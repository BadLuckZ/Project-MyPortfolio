import type { UsageDecision } from "../guards/usage";
import {
  readJsonBody,
  validateMessages,
  type ValidationFailure,
} from "../guards/validate";
import {
  ProviderError,
  type LLMProvider,
  type StreamEvent,
} from "../types/llm";

const MAX_OUTPUT_TOKENS = 1024;
const TEMPERATURE = 0.2;

export interface ChatDeps {
  provider: LLMProvider;
  systemPrompt: string;
  checkUsage: () => Promise<UsageDecision>;
}

function logChat(fields: Record<string, string | number>): void {
  console.log(JSON.stringify({ event: "chat", ...fields }));
}

function reject(failure: ValidationFailure): Response {
  logChat({ status: failure.status, rule: failure.rule });
  return Response.json({ error: failure.error }, { status: failure.status });
}

type UsageDenied = Exclude<UsageDecision, { allowed: true }>;

function denyUsage(decision: UsageDenied): Response {
  switch (decision.reason) {
    case "rate_limited":
      logChat({ status: 429, rule: decision.reason });
      return Response.json(
        { error: "rate_limited" },
        {
          status: 429,
          headers: { "Retry-After": String(decision.retryAfterSeconds) },
        },
      );
    case "client_daily_limit":
      logChat({ status: 429, rule: decision.reason });
      return Response.json({ error: "daily_limit" }, { status: 429 });
    case "budget_exhausted":
      logChat({ status: 503, rule: decision.reason });
      return Response.json(
        { error: "temporarily_unavailable" },
        { status: 503 },
      );
  }
}

function toClientStatus(err: unknown): number {
  if (!(err instanceof ProviderError)) return 500;
  return err.status === 429 ? 503 : 502;
}

function errorCode(status: number): string {
  return status === 503 ? "temporarily_unavailable" : "upstream_error";
}

function upstreamStatus(err: unknown): number {
  return err instanceof ProviderError ? err.status : 0;
}

const encoder = new TextEncoder();

function sseEvent(event: string, data: unknown): Uint8Array {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function streamReply(
  first: StreamEvent,
  rest: AsyncGenerator<StreamEvent>,
  log: Record<string, string | number>,
  started: number,
): Response {
  let pending: StreamEvent | null = first;

  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        let event = pending;
        pending = null;
        if (!event) {
          const next = await rest.next();
          if (next.done) throw new ProviderError("Stream ended early", 502);
          event = next.value;
        }

        if (event.type === "text") {
          controller.enqueue(sseEvent("delta", { text: event.text }));
          return;
        }

        controller.enqueue(sseEvent("done", {}));
        controller.close();
        logChat({
          ...log,
          outcome: "completed",
          model: event.model,
          inputTokens: event.inputTokens,
          outputTokens: event.outputTokens,
          latencyMs: Date.now() - started,
        });
      } catch (err) {
        controller.enqueue(
          sseEvent("error", { error: errorCode(toClientStatus(err)) }),
        );
        controller.close();
        logChat({
          ...log,
          outcome: "stream_error",
          upstreamStatus: upstreamStatus(err),
          latencyMs: Date.now() - started,
        });
      }
    },

    async cancel() {
      await rest.return(undefined);
      logChat({
        ...log,
        outcome: "cancelled",
        latencyMs: Date.now() - started,
      });
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function handleChat(
  request: Request,
  deps: ChatDeps,
): Promise<Response> {
  const body = await readJsonBody(request);
  if (!body.ok) return reject(body);
  const validated = validateMessages(body.value);
  if (!validated.ok) return reject(validated);
  const messages = validated.value;
  let usage: UsageDecision;
  try {
    usage = await deps.checkUsage();
  } catch {
    logChat({ status: 503, rule: "usage_guard_error" });
    return Response.json({ error: "temporarily_unavailable" }, { status: 503 });
  }
  if (!usage.allowed) return denyUsage(usage);

  const started = Date.now();
  const events = deps.provider.stream({
    system: deps.systemPrompt,
    messages,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    temperature: TEMPERATURE,
  });

  // Wait for the first event so early failures still get a real status code.
  let first: IteratorResult<StreamEvent>;
  try {
    first = await events.next();
    if (first.done) throw new ProviderError("Stream ended early", 502);
  } catch (err) {
    const status = toClientStatus(err);
    logChat({
      status,
      provider: deps.provider.name,
      upstreamStatus: upstreamStatus(err),
      latencyMs: Date.now() - started,
    });
    return Response.json({ error: errorCode(status) }, { status });
  }

  const log = {
    status: 200,
    provider: deps.provider.name,
    ttfbMs: Date.now() - started,
  };
  return streamReply(first.value, events, log, started);
}
