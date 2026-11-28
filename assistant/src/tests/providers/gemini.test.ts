import { describe, expect, it, vi } from "vitest";
import { createGeminiProvider } from "../../providers/gemini";
import {
  ProviderError,
  type GenerateRequest,
  type StreamEvent,
} from "../../types/llm";

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

const STREAM_EVENTS = [
  { event_type: "interaction.created", interaction: { model: MODEL_TEST } },
  { event_type: "interaction.status_update", status: "in_progress" },
  { event_type: "step.start", index: 0, step: { type: "thought" } },
  {
    event_type: "step.delta",
    index: 0,
    delta: { type: "text", text: "hidden reasoning" },
  },
  { event_type: "step.stop", index: 0 },
  { event_type: "step.start", index: 1, step: { type: "model_output" } },
  {
    event_type: "step.delta",
    index: 1,
    delta: { type: "text", text: "It started " },
  },
  {
    event_type: "step.delta",
    index: 1,
    delta: { type: "text", text: "in August 2025." },
  },
  { event_type: "step.stop", index: 1 },
  {
    event_type: "interaction.completed",
    interaction: {
      status: "completed",
      usage: { total_input_tokens: 8728, total_output_tokens: 22 },
    },
  },
];

function sse(events: unknown[], { done = true } = {}): string {
  const blocks = events.map(
    (e) =>
      `event: ${(e as { event_type: string }).event_type}\ndata: ${JSON.stringify(e)}\n\n`,
  );
  if (done) blocks.push("event: done\ndata: [DONE]\n\n");
  return blocks.join("");
}

function streamFetch(body: string | ReadableStream<Uint8Array>) {
  return vi.fn<typeof fetch>(
    async () =>
      new Response(body, {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      }),
  );
}

async function collect(events: AsyncIterable<StreamEvent>) {
  const result: StreamEvent[] = [];
  for await (const event of events) result.push(event);
  return result;
}

describe("createGeminiProvider stream", () => {
  it("asks the API to stream", async () => {
    const fetchFn = streamFetch(sse(STREAM_EVENTS));
    await collect(
      createGeminiProvider(API_KEY_TEST, MODEL_TEST, fetchFn).stream(request),
    );
    const body = JSON.parse(String(fetchFn.mock.calls[0][1]?.body));
    expect(body.stream).toBe(true);
  });

  it("yields only model_output text, then usage", async () => {
    const provider = createGeminiProvider(
      API_KEY_TEST,
      MODEL_TEST,
      streamFetch(sse(STREAM_EVENTS)),
    );
    expect(await collect(provider.stream(request))).toEqual([
      { type: "text", text: "It started " },
      { type: "text", text: "in August 2025." },
      { type: "done", model: MODEL_TEST, inputTokens: 8728, outputTokens: 22 },
    ]);
  });

  it("fails before any text when the API rejects the request", async () => {
    const provider = createGeminiProvider(
      API_KEY_TEST,
      MODEL_TEST,
      mockFetch(429, { error: {} }),
    );
    await expect(collect(provider.stream(request))).rejects.toMatchObject({
      name: "ProviderError",
      status: 429,
    });
  });

  it("maps network failures to 504", async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => {
      throw new TypeError("network down");
    });
    const provider = createGeminiProvider(API_KEY_TEST, MODEL_TEST, fetchFn);
    await expect(collect(provider.stream(request))).rejects.toMatchObject({
      status: 504,
    });
  });

  it("fails with 502 on an error event after some text", async () => {
    const events = [
      ...STREAM_EVENTS.slice(0, 7),
      { event_type: "error", error: { code: "internal", message: "boom" } },
    ];
    const provider = createGeminiProvider(
      API_KEY_TEST,
      MODEL_TEST,
      streamFetch(sse(events, { done: false })),
    );

    const received: StreamEvent[] = [];
    const err = await (async () => {
      for await (const event of provider.stream(request)) received.push(event);
    })().catch((e: unknown) => e);

    expect(received).toEqual([{ type: "text", text: "It started " }]);
    expect(err).toMatchObject({ name: "ProviderError", status: 502 });
  });

  it("fails with 502 when the stream ends without completing", async () => {
    const provider = createGeminiProvider(
      API_KEY_TEST,
      MODEL_TEST,
      streamFetch(sse(STREAM_EVENTS.slice(0, 7), { done: false })),
    );
    await expect(collect(provider.stream(request))).rejects.toMatchObject({
      status: 502,
    });
  });

  it("fails with 502 when the reply has no text", async () => {
    const events = STREAM_EVENTS.filter(
      (e) => !(e.event_type === "step.delta" && e.index === 1),
    );
    const provider = createGeminiProvider(
      API_KEY_TEST,
      MODEL_TEST,
      streamFetch(sse(events)),
    );
    await expect(collect(provider.stream(request))).rejects.toMatchObject({
      status: 502,
    });
  });

  it("fails with 502 on invalid JSON", async () => {
    const provider = createGeminiProvider(
      API_KEY_TEST,
      MODEL_TEST,
      streamFetch("event: step.delta\ndata: {not json\n\n"),
    );
    await expect(collect(provider.stream(request))).rejects.toMatchObject({
      status: 502,
    });
  });

  it("maps a body that breaks mid-stream to 504", async () => {
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(sse(STREAM_EVENTS.slice(0, 7))));
        controller.error(new DOMException("timed out", "TimeoutError"));
      },
    });
    const provider = createGeminiProvider(
      API_KEY_TEST,
      MODEL_TEST,
      streamFetch(body),
    );
    await expect(collect(provider.stream(request))).rejects.toMatchObject({
      status: 504,
    });
  });
});
