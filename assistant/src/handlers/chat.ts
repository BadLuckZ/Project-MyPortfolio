import {
  ProviderError,
  type ChatMessage,
  type LLMProvider,
} from "../types/llm";

const MAX_OUTPUT_TOKENS = 512;
const TEMPERATURE = 0.2;

export interface ChatDeps {
  provider: LLMProvider;
  systemPrompt: string;
}

function parseMessages(raw: unknown): ChatMessage[] | null {
  if (typeof raw !== "object" || raw === null) return null;
  const messages = (raw as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const valid = messages.every(
    (m) =>
      typeof m === "object" &&
      m !== null &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string",
  );

  if (!valid) return null;
  if (messages[messages.length - 1].role !== "user") return null;

  return messages as ChatMessage[];
}

function logChat(fields: Record<string, string | number>): void {
  console.log(JSON.stringify({ event: "chat", ...fields }));
}

function toClientStatus(err: unknown): number {
  if (!(err instanceof ProviderError)) return 500;
  return err.status === 429 ? 503 : 502;
}

export async function handleChat(
  request: Request,
  deps: ChatDeps,
): Promise<Response> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const messages = parseMessages(raw);
  if (!messages) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

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
