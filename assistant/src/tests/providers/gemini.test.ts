import { describe, expect, it, vi } from "vitest";
import { createGeminiProvider } from "../../providers/gemini";
import { ProviderError, type GenerateRequest } from "../../types/llm";

const API_KEY_TEST = "test-key";
const MODEL_TEST = "gemini-3.5-flash-lite";

const request: GenerateRequest = {
  system: "SYSTEM PROMPT",
  messages: [
    { role: "user", content: "What is Baan-Saat?" },
    { role: "assistant", content: "A group project." },
    { role: "user", content: "When did it start?" },
  ],
  maxOutputTokens: 400,
  temperature: 0.2,
};

const okBody = {
  steps: [
    { type: "thought", content: [{ type: "text", text: "hidden reasoning" }] },
    {
      type: "model_output",
      content: [{ type: "text", text: "It started in August 2025." }],
    },
  ],
  usage: { total_input_tokens: 8728, total_output_tokens: 22 },
};

function mockFetch(status: number, body: unknown) {
  return vi.fn<typeof fetch>(
    async () => new Response(JSON.stringify(body), { status }),
  );
}

describe("createGeminiProvider", () => {
  it("sends the key, model and history in the Interactions format", async () => {
    const fetchFn = mockFetch(200, okBody);
    await createGeminiProvider(API_KEY_TEST, MODEL_TEST, fetchFn).generate(
      request,
    );

    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe(
      "https://generativelanguage.googleapis.com/v1beta/interactions",
    );
    expect(new Headers(init?.headers).get("x-goog-api-key")).toBe("test-key");

    const body = JSON.parse(String(init?.body));
    expect(body).toMatchObject({
      model: "gemini-3.5-flash-lite",
      store: false,
      system_instruction: "SYSTEM PROMPT",
      generation_config: { max_output_tokens: 400, temperature: 0.2 },
    });
    expect(body.input.map((step: { type: string }) => step.type)).toEqual([
      "user_input",
      "model_output",
      "user_input",
    ]);
  });

  it("returns only model_output text and token usage", async () => {
    const result = await createGeminiProvider(
      API_KEY_TEST,
      MODEL_TEST,
      mockFetch(200, okBody),
    ).generate(request);
    expect(result).toEqual({
      text: "It started in August 2025.",
      model: MODEL_TEST,
      inputTokens: 8728,
      outputTokens: 22,
    });
  });

  it("maps HTTP errors to ProviderError with the same status", async () => {
    const provider = createGeminiProvider(
      API_KEY_TEST,
      MODEL_TEST,
      mockFetch(429, { error: {} }),
    );
    await expect(provider.generate(request)).rejects.toMatchObject({
      name: "ProviderError",
      status: 429,
    });
  });

  it("fails with 502 when the response has no text", async () => {
    const provider = createGeminiProvider(
      API_KEY_TEST,
      MODEL_TEST,
      mockFetch(200, { steps: [] }),
    );
    await expect(provider.generate(request)).rejects.toMatchObject({
      status: 502,
    });
  });

  it("keeps the provider's error body out of the error message", async () => {
    const provider = createGeminiProvider(
      API_KEY_TEST,
      MODEL_TEST,
      mockFetch(400, { error: { message: "echo: What is Baan-Saat?" } }),
    );
    const err = await provider.generate(request).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ProviderError);
    expect((err as Error).message).not.toContain("Baan-Saat");
  });

  it("maps network failures and timeouts to 504", async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => {
      throw new DOMException("timed out", "TimeoutError");
    });
    await expect(
      createGeminiProvider(API_KEY_TEST, MODEL_TEST, fetchFn).generate(request),
    ).rejects.toMatchObject({
      status: 504,
    });
  });
});
