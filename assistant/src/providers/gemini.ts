import {
  ProviderError,
  type ChatMessage,
  type GenerateRequest,
  type GenerateResult,
  type LLMProvider,
} from "../types/llm";

const ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/interactions";
const TIMEOUT_MS = 15_000;

interface InteractionResponse {
  steps?: Array<{
    type: string;
    content?: Array<{ type: string; text?: string }>;
  }>;
  usage?: { total_input_tokens?: number; total_output_tokens?: number };
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
  return {
    name: "gemini",

    // https://aistudio.google.com/api-reference/interactions-api/create-interaction
    async generate(request: GenerateRequest): Promise<GenerateResult> {
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
          `Gemini returned status ${response.status}`,
          response.status,
        );
      }

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
  };
}
