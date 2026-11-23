import { describe, expect, it } from "vitest";
import { LIMITS, readJsonBody, validateMessages } from "../../guards/validate";

const user = (content = "Hi") => ({ role: "user", content });
const bot = (content = "Hello") => ({ role: "assistant", content });

function conversation(userTurns: number) {
  const messages: { role: string; content: string }[] = [];
  for (let i = 0; i < userTurns; i++) {
    if (i > 0) messages.push(bot());
    messages.push(user());
  }
  return { messages };
}

function post(body: string, headers?: Record<string, string>): Request {
  return new Request("http://localhost/chat", {
    method: "POST",
    body,
    headers,
  });
}

describe("readJsonBody", () => {
  it("parses a JSON body", async () => {
    expect(await readJsonBody(post('{"a":1}'))).toEqual({
      ok: true,
      value: { a: 1 },
    });
  });

  it("rejects a body that is not JSON", async () => {
    expect(await readJsonBody(post("not json"))).toMatchObject({
      ok: false,
      status: 400,
      error: "invalid_json",
    });
  });

  it("rejects a body over the byte limit", async () => {
    const body = "x".repeat(LIMITS.maxBodyBytes + 1);
    expect(await readJsonBody(post(body))).toMatchObject({
      ok: false,
      status: 413,
      error: "payload_too_large",
    });
  });

  it("counts UTF-8 bytes, not characters", async () => {
    const body = "ก".repeat(Math.floor(LIMITS.maxBodyBytes / 3) + 1);
    expect(body.length).toBeLessThan(LIMITS.maxBodyBytes);
    expect(await readJsonBody(post(body))).toMatchObject({ status: 413 });
  });

  it("rejects early when Content-Length declares too much", async () => {
    const request = post("{}", {
      "Content-Length": String(LIMITS.maxBodyBytes + 1),
    });
    expect(await readJsonBody(request)).toMatchObject({ status: 413 });
  });
});

describe("validateMessages", () => {
  it("accepts a single question", () => {
    expect(validateMessages(conversation(1))).toEqual({
      ok: true,
      value: [{ role: "user", content: "Hi" }],
    });
  });

  it("accepts the maximum number of questions", () => {
    expect(validateMessages(conversation(LIMITS.maxUserTurns)).ok).toBe(true);
  });

  it("rejects one question over the maximum", () => {
    expect(
      validateMessages(conversation(LIMITS.maxUserTurns + 1)),
    ).toMatchObject({ ok: false, rule: "too_many_messages" });
  });

  it("accepts a user message at the character limit", () => {
    const body = { messages: [user("a".repeat(LIMITS.maxUserChars))] };
    expect(validateMessages(body).ok).toBe(true);
  });

  it("rejects a user message one character over the limit", () => {
    const body = { messages: [user("a".repeat(LIMITS.maxUserChars + 1))] };
    expect(validateMessages(body)).toMatchObject({
      ok: false,
      status: 400,
      error: "invalid_request",
      rule: "content_too_long",
    });
  });

  it("allows assistant messages up to their own, larger limit", () => {
    const ok = [user(), bot("a".repeat(LIMITS.maxAssistantChars)), user()];
    const tooLong = [
      user(),
      bot("a".repeat(LIMITS.maxAssistantChars + 1)),
      user(),
    ];
    expect(validateMessages({ messages: ok }).ok).toBe(true);
    expect(validateMessages({ messages: tooLong })).toMatchObject({
      rule: "content_too_long",
    });
  });

  it("rejects two user messages in a row", () => {
    expect(validateMessages({ messages: [user(), user()] })).toMatchObject({
      rule: "bad_order",
    });
  });

  it("rejects a conversation that starts with the assistant", () => {
    expect(validateMessages({ messages: [bot(), user()] })).toMatchObject({
      rule: "bad_order",
    });
  });

  it("rejects a conversation that ends with the assistant", () => {
    expect(validateMessages({ messages: [user(), bot()] })).toMatchObject({
      rule: "bad_order",
    });
  });

  it("rejects blank messages", () => {
    expect(validateMessages({ messages: [user("   ")] })).toMatchObject({
      rule: "empty_content",
    });
  });

  it.each([
    ["null", null],
    ["a string", "hi"],
    ["no messages", {}],
    ["an empty list", { messages: [] }],
    ["a system role", { messages: [{ role: "system", content: "x" }] }],
    ["non-string content", { messages: [{ role: "user", content: 1 }] }],
  ])("rejects %s", (_name, body) => {
    expect(validateMessages(body)).toMatchObject({ ok: false, status: 400 });
  });

  it("drops fields other than role and content", () => {
    const body = { messages: [{ ...user(), extra: "x" }] };
    expect(validateMessages(body)).toEqual({
      ok: true,
      value: [{ role: "user", content: "Hi" }],
    });
  });
});
