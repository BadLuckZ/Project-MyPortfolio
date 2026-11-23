import {
  readJsonBody,
  validateMessages,
  ValidationFailure,
} from "../guards/validate";
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

function logChat(fields: Record<string, string | number>): void {
  console.log(JSON.stringify({ event: "chat", ...fields }));
}

function reject(failure: ValidationFailure): Response {
  logChat({ status: failure.status, rule: failure.rule });
  return Response.json({ error: failure.error }, { status: failure.status });
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
