import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { UsageDecision } from "../../guards/usage";
import { handleChat, type ChatDeps } from "../../handlers/chat";
import { ProviderError, type LLMProvider } from "../../types/llm";

const SYSTEM_PROMPT_TEST = "SYSTEM";
const QUESTION = "What is Baan-Saat?";

function fakeProvider(generate: LLMProvider["generate"]): LLMProvider {
  return { name: "fake", generate: vi.fn(generate) };
}

const okProvider = () =>
  fakeProvider(async () => ({
    text: "A project.",
    model: "fake-model",
    inputTokens: 10,
    outputTokens: 3,
  }));

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

const validBody = { messages: [{ role: "user", content: QUESTION }] };

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe("handleChat", () => {
  it("returns the provider reply and passes the system prompt and messages", async () => {
    const provider = okProvider();
    const res = await handleChat(post(validBody), deps({ provider }));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ reply: "A project." });
    expect(provider.generate).toHaveBeenCalledWith(
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
    expect(provider.generate).not.toHaveBeenCalled();
  });

  it("maps a provider rate limit to 503", async () => {
    const provider = fakeProvider(async () => {
      throw new ProviderError("quota", 429);
    });
    const res = await handleChat(post(validBody), deps({ provider }));
    expect(res.status).toBe(503);
  });

  it("maps other provider failures to 502 without leaking details", async () => {
    const provider = fakeProvider(async () => {
      throw new ProviderError("Gemini returned status 500", 500);
    });
    const res = await handleChat(post(validBody), deps({ provider }));
    expect(res.status).toBe(502);
    expect(JSON.stringify(await res.json())).not.toContain("Gemini");
  });

  it("maps unexpected errors to 500", async () => {
    const provider = fakeProvider(async () => {
      throw new TypeError("bug");
    });
    const res = await handleChat(post(validBody), deps({ provider }));
    expect(res.status).toBe(500);
  });

  it("never logs the visitor's message", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    await handleChat(post(validBody), deps());
    expect(log).toHaveBeenCalled();
    expect(log.mock.calls.flat().join(" ")).not.toContain(QUESTION);
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
    expect(provider.generate).not.toHaveBeenCalled();
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
    expect(provider.generate).not.toHaveBeenCalled();
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
    expect(provider.generate).not.toHaveBeenCalled();
  });
});
