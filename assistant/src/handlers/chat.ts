import type { UsageDecision } from "../guards/usage";
import {
  readJsonBody,
  validateMessages,
  type ValidationFailure,
} from "../guards/validate";
import { ProviderError, type LLMProvider } from "../types/llm";

const MAX_OUTPUT_TOKENS = 512;
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
  try {
    const result = await deps.provider.generate({
      system: deps.systemPrompt,
      messages,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      temperature: TEMPERATURE,
    });

    logChat({
      status: 200,
      provider: deps.provider.name,
      model: result.model,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      latencyMs: Date.now() - started,
    });
    return Response.json({ reply: result.text });
  } catch (err) {
    const status = toClientStatus(err);
    logChat({
      status,
      provider: deps.provider.name,
      upstreamStatus: err instanceof ProviderError ? err.status : 0,
      latencyMs: Date.now() - started,
    });
    return Response.json(
      { error: status === 503 ? "temporarily_unavailable" : "upstream_error" },
      { status },
    );
  }
}
