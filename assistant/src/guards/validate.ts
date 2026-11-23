import type { ChatMessage } from "../types/llm";

export const LIMITS = {
  maxBodyBytes: 16 * 1024,
  maxUserChars: 500,
  maxAssistantChars: 4000,
  maxUserTurns: 6,
} as const;

export interface ValidationFailure {
  ok: false;
  status: 400 | 413;
  error: "payload_too_large" | "invalid_json" | "invalid_request";
  rule: string;
}

export type Validated<T> = { ok: true; value: T } | ValidationFailure;

function fail(
  rule: string,
  status: ValidationFailure["status"] = 400,
  error: ValidationFailure["error"] = "invalid_request",
): ValidationFailure {
  return { ok: false, status, error, rule };
}

export async function readJsonBody(
  request: Request,
): Promise<Validated<unknown>> {
  const declared = Number(request.headers.get("Content-Length"));
  if (declared > LIMITS.maxBodyBytes) {
    return fail("body_too_large", 413, "payload_too_large");
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > LIMITS.maxBodyBytes) {
    return fail("body_too_large", 413, "payload_too_large");
  }

  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return fail("invalid_json", 400, "invalid_json");
  }
}

function isMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const { role, content } = value as Record<string, unknown>;
  return (
    (role === "user" || role === "assistant") && typeof content === "string"
  );
}

export function validateMessages(raw: unknown): Validated<ChatMessage[]> {
  if (typeof raw !== "object" || raw === null) return fail("not_object");

  const messages = (raw as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return fail("no_messages");
  }
  if (messages.length > LIMITS.maxUserTurns * 2 - 1) {
    return fail("too_many_messages");
  }

  const clean: ChatMessage[] = [];
  for (const [index, message] of messages.entries()) {
    if (!isMessage(message)) return fail("bad_shape");

    const expected = index % 2 === 0 ? "user" : "assistant";
    if (message.role !== expected) return fail("bad_order");
    if (message.content.trim() === "") return fail("empty_content");

    const max =
      message.role === "user" ? LIMITS.maxUserChars : LIMITS.maxAssistantChars;
    if (message.content.length > max) return fail("content_too_long");

    clean.push({ role: message.role, content: message.content });
  }

  if (clean[clean.length - 1].role !== "user") return fail("bad_order");
  return { ok: true, value: clean };
}
