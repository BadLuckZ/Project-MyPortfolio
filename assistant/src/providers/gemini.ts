import { parseSse } from "../sse/parse";
import {
  ProviderError,
  type ChatMessage,
  type GenerateRequest,
  type GenerateResult,
  type LLMProvider,
  type StreamEvent,
} from "../types/llm";

const ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/interactions";
const TIMEOUT_MS = 15_000;

interface Usage {
  total_input_tokens?: number;
  total_output_tokens?: number;
}

interface InteractionResponse {
  steps?: Array<{
    type: string;
    content?: Array<{ type: string; text?: string }>;
  }>;
  usage?: Usage;
}

interface StreamPayload {
  event_type?: string;
  index?: number;
  step?: { type?: string };
  delta?: { type?: string; text?: string };
  interaction?: { usage?: Usage };
}

function toStep(message: ChatMessage) {
  return {
    type: message.role === "user" ? "user_input" : "model_output",
    content: [{ type: "text", text: message.content }],
  };
}

export function createGeminiProvider(
  apiKey: string,
  model: string,
  fetchFn: typeof fetch = (input, init) => fetch(input, init),
): LLMProvider {
  // https://aistudio.google.com/api-reference/interactions-api/create-interaction
  async function post(
    request: GenerateRequest,
    stream: boolean,
  ): Promise<Response> {
    let response: Response;
    try {
      response = await fetchFn(ENDPOINT, {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          store: false,
          stream,
          system_instruction: request.system,
          input: request.messages.map(toStep),
          generation_config: {
            max_output_tokens: request.maxOutputTokens,
            temperature: request.temperature,
          },
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (err) {
      throw new ProviderError(
        `Gemini request failed: ${(err as Error).name}`,
        504,
      );
    }

    if (!response.ok) {
      throw new ProviderError(
        `Gemini status: ${response.status}`,
        response.status,
      );
    }
    return response;
  }

  return {
    name: "gemini",
    async generate(request: GenerateRequest): Promise<GenerateResult> {
      const response = await post(request, false);
      const data = (await response.json()) as InteractionResponse;
      const text = (data.steps ?? [])
        .filter((step) => step.type === "model_output")
        .flatMap((step) => step.content ?? [])
        .map((part) => (part.type === "text" ? (part.text ?? "") : ""))
        .join("")
        .trim();

      if (!text) {
        throw new ProviderError("Gemini returned no text", 502);
      }

      return {
        text,
        model,
        inputTokens: data.usage?.total_input_tokens ?? 0,
        outputTokens: data.usage?.total_output_tokens ?? 0,
      };
    },

    async *stream(request: GenerateRequest): AsyncGenerator<StreamEvent> {
      const response = await post(request, true);
      if (!response.body) {
        throw new ProviderError("Gemini returned no body", 502);
      }

      const outputSteps = new Set<number>();
      let sentText = false;

      try {
        for await (const { data } of parseSse(response.body)) {
          if (data === "[DONE]") continue;

          let payload: StreamPayload;
          try {
            payload = JSON.parse(data) as StreamPayload;
          } catch {
            throw new ProviderError("Gemini sent invalid JSON", 502);
          }

          switch (payload.event_type) {
            case "step.start":
              if (payload.step?.type === "model_output") {
                outputSteps.add(payload.index ?? -1);
              }
              break;
            case "step.delta":
              if (
                outputSteps.has(payload.index ?? -1) &&
                payload.delta?.type === "text" &&
                payload.delta.text
              ) {
                sentText = true;
                yield { type: "text", text: payload.delta.text };
              }
              break;
            case "interaction.completed": {
              if (!sentText) {
                throw new ProviderError("Gemini returned no text", 502);
              }
              const usage = payload.interaction?.usage;
              yield {
                type: "done",
                model,
                inputTokens: usage?.total_input_tokens ?? 0,
                outputTokens: usage?.total_output_tokens ?? 0,
              };
              return;
            }
            case "error":
              throw new ProviderError("Gemini stream error", 502);
          }
        }
      } catch (err) {
        if (err instanceof ProviderError) throw err;
        throw new ProviderError(
          `Gemini stream interrupted: ${(err as Error).name}`,
          504,
        );
      }
      throw new ProviderError("Gemini stream ended early", 502);
    },
  };
}
