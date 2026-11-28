import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { UsageDecision } from "../../guards/usage";
import { handleChat, type ChatDeps } from "../../handlers/chat";
import { parseSse } from "../../sse/parse";
import {
  ProviderError,
  type LLMProvider,
  type StreamEvent,
} from "../../types/llm";

const SYSTEM_PROMPT_TEST = "SYSTEM";
const QUESTION = "What is Baan-Saat?";

const DONE: StreamEvent = {
  type: "done",
  model: "fake-model",
  inputTokens: 10,
  outputTokens: 3,
};

function fakeProvider(stream: LLMProvider["stream"]) {
  return {
    name: "fake",
    generate: vi.fn(),
    stream: vi.fn(stream),
  } satisfies LLMProvider;
}

const okProvider = () =>
  fakeProvider(async function* () {
    yield { type: "text", text: "A group " };
    yield { type: "text", text: "project." };
    yield DONE;
  });

function failingProvider(err: unknown) {
  return fakeProvider(async function* () {
    throw err;
  });
}

function usage(decision: UsageDecision) {
  return vi.fn(async () => decision);
}

function deps(overrides: Partial<ChatDeps> = {}): ChatDeps {
  return {
    provider: okProvider(),
    systemPrompt: SYSTEM_PROMPT_TEST,
    checkUsage: usage({ allowed: true }),
    ...overrides,
  };
}

function post(body: unknown): Request {
  return new Request("http://localhost/chat", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function readEvents(res: Response) {
  const events: { event: string; data: unknown }[] = [];
  for await (const { event, data } of parseSse(res.body!)) {
    events.push({ event, data: JSON.parse(data) });
  }
  return events;
}

const validBody = { messages: [{ role: "user", content: QUESTION }] };

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe("handleChat", () => {
  it("streams the reply as delta events, then done", async () => {
    const provider = okProvider();
    const res = await handleChat(post(validBody), deps({ provider }));
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/event-stream");
    expect(await readEvents(res)).toEqual([
      { event: "delta", data: { text: "A group " } },
      { event: "delta", data: { text: "project." } },
      { event: "done", data: {} },
    ]);
    expect(provider.stream).toHaveBeenCalledWith(
      expect.objectContaining({
        system: SYSTEM_PROMPT_TEST,
        messages: validBody.messages,
      }),
    );
  });

  it("rejects a body that is not JSON", async () => {
    const res = await handleChat(post("not json"), deps());
    expect(res.status).toBe(400);
  });

  it("rejects messages with a wrong shape", async () => {
    const body = { messages: [{ role: "system", content: 123 }] };
    const res = await handleChat(post(body), deps());
    expect(res.status).toBe(400);
  });

  it("rejects a conversation that does not end with a user message", async () => {
    const body = { messages: [{ role: "assistant", content: "Hi" }] };
    const res = await handleChat(post(body), deps());
    expect(res.status).toBe(400);
  });

  it("rejects an oversized body with 413 before calling the provider", async () => {
    const provider = okProvider();
    const res = await handleChat(
      post("x".repeat(16 * 1024 + 1)),
      deps({ provider }),
    );
    expect(res.status).toBe(413);
    expect(await res.json()).toEqual({ error: "payload_too_large" });
    expect(provider.stream).not.toHaveBeenCalled();
  });

  it("maps a provider rate limit before streaming to 503", async () => {
    const provider = failingProvider(new ProviderError("quota", 429));
    const res = await handleChat(post(validBody), deps({ provider }));
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "temporarily_unavailable" });
  });

  it("maps other provider failures before streaming to 502 without details", async () => {
    const provider = failingProvider(
      new ProviderError("Gemini returned status 500", 500),
    );
    const res = await handleChat(post(validBody), deps({ provider }));
    expect(res.status).toBe(502);
    expect(JSON.stringify(await res.json())).not.toContain("Gemini");
  });

  it("maps unexpected errors before streaming to 500", async () => {
    const provider = failingProvider(new TypeError("bug"));
    const res = await handleChat(post(validBody), deps({ provider }));
    expect(res.status).toBe(500);
  });

  it("sends an error event when the provider fails mid-stream", async () => {
    const provider = fakeProvider(async function* () {
      yield { type: "text", text: "A group " };
      throw new ProviderError("Gemini stream error", 502);
    });
    const res = await handleChat(post(validBody), deps({ provider }));
    expect(res.status).toBe(200);
    expect(await readEvents(res)).toEqual([
      { event: "delta", data: { text: "A group " } },
      { event: "error", data: { error: "upstream_error" } },
    ]);
  });

  it("stops the provider when the visitor disconnects", async () => {
    let stopped = false;
    const provider = fakeProvider(async function* () {
      try {
        yield { type: "text", text: "one" };
        yield { type: "text", text: "two" };
        yield { type: "text", text: "three" };
        yield DONE;
      } finally {
        stopped = true;
      }
    });
    const res = await handleChat(post(validBody), deps({ provider }));
    const reader = res.body!.getReader();
    await reader.read();
    await reader.cancel();
    expect(stopped).toBe(true);
  });

  it("logs time to first byte and token usage", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const res = await handleChat(post(validBody), deps());
    await readEvents(res);

    const entry = JSON.parse(String(log.mock.calls.at(-1)?.[0]));
    expect(entry).toMatchObject({
      event: "chat",
      status: 200,
      outcome: "completed",
      inputTokens: 10,
      outputTokens: 3,
    });
    expect(entry.ttfbMs).toEqual(expect.any(Number));
  });

  it("never logs the visitor's message or the reply", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const res = await handleChat(post(validBody), deps());
    await readEvents(res);

    const logged = log.mock.calls.flat().join(" ");
    expect(log).toHaveBeenCalled();
    expect(logged).not.toContain(QUESTION);
    expect(logged).not.toContain("A group");
  });
});

describe("handleChat usage guard", () => {
  it("does not check usage for an invalid request", async () => {
    const checkUsage = usage({ allowed: true });
    await handleChat(post("not json"), deps({ checkUsage }));
    expect(checkUsage).not.toHaveBeenCalled();
  });

  it("returns 429 with Retry-After when rate limited", async () => {
    const provider = okProvider();
    const checkUsage = usage({
      allowed: false,
      reason: "rate_limited",
      retryAfterSeconds: 120,
    });
    const res = await handleChat(
      post(validBody),
      deps({ provider, checkUsage }),
    );
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("120");
    expect(await res.json()).toEqual({ error: "rate_limited" });
    expect(provider.stream).not.toHaveBeenCalled();
  });

  it("returns 429 when the visitor hit the daily limit", async () => {
    const checkUsage = usage({ allowed: false, reason: "client_daily_limit" });
    const res = await handleChat(post(validBody), deps({ checkUsage }));

    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: "daily_limit" });
  });

  it("returns 503 when the daily budget is used up", async () => {
    const provider = okProvider();
    const checkUsage = usage({ allowed: false, reason: "budget_exhausted" });
    const res = await handleChat(
      post(validBody),
      deps({ provider, checkUsage }),
    );
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "temporarily_unavailable" });
    expect(provider.stream).not.toHaveBeenCalled();
  });

  it("fails closed with 503 when the usage guard throws", async () => {
    const provider = okProvider();
    const checkUsage = vi.fn(async (): Promise<UsageDecision> => {
      throw new Error("durable object unavailable");
    });
    const res = await handleChat(
      post(validBody),
      deps({ provider, checkUsage }),
    );
    expect(res.status).toBe(503);
    expect(provider.stream).not.toHaveBeenCalled();
  });
});
