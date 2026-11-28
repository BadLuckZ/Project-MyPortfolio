import { describe, expect, it, vi } from "vitest";
import { parseSse, type SseEvent } from "../../sse/parse";

const encoder = new TextEncoder();

function streamOf(chunks: (string | Uint8Array)[]): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(
          typeof chunk === "string" ? encoder.encode(chunk) : chunk,
        );
      }
      controller.close();
    },
  });
}

async function collect(stream: ReadableStream<Uint8Array>) {
  const events: SseEvent[] = [];
  for await (const event of parseSse(stream)) events.push(event);
  return events;
}

const TWO_EVENTS =
  'event: step.delta\ndata: {"text":"Hi"}\n\n' +
  "event: done\ndata: [DONE]\n\n";

const EXPECTED = [
  { event: "step.delta", data: '{"text":"Hi"}' },
  { event: "done", data: "[DONE]" },
];

describe("parseSse", () => {
  it("parses events from a single chunk", async () => {
    expect(await collect(streamOf([TWO_EVENTS]))).toEqual(EXPECTED);
  });

  it("parses events split at every character", async () => {
    expect(await collect(streamOf(TWO_EVENTS.split("")))).toEqual(EXPECTED);
  });

  it("decodes a multi-byte character split across chunks", async () => {
    const bytes = encoder.encode('data: {"text":"ก"}\n\n');
    const cut = bytes.indexOf(0xe0) + 1;
    const events = await collect(
      streamOf([bytes.slice(0, cut), bytes.slice(cut)]),
    );
    expect(events).toEqual([{ event: "message", data: '{"text":"ก"}' }]);
  });

  it("accepts CRLF line endings, even when CR and LF arrive apart", async () => {
    const chunks = ["event: done\r", "\ndata: [DONE]\r\n\r", "\n"];
    expect(await collect(streamOf(chunks))).toEqual([
      { event: "done", data: "[DONE]" },
    ]);
  });

  it("joins multi-line data with newlines", async () => {
    const events = await collect(streamOf(["data: a\ndata: b\n\n"]));
    expect(events).toEqual([{ event: "message", data: "a\nb" }]);
  });

  it("ignores comments and events without data", async () => {
    const events = await collect(
      streamOf([": keep-alive\n\nevent: ping\n\ndata: x\n\n"]),
    );
    expect(events).toEqual([{ event: "message", data: "x" }]);
  });

  it("drops an unfinished event at the end of the stream", async () => {
    const events = await collect(streamOf(["data: a\n\ndata: cut off"]));
    expect(events).toEqual([{ event: "message", data: "a" }]);
  });

  it("cancels the stream when the consumer stops early", async () => {
    const onCancel = vi.fn();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode("data: first\n\n"));
      },
      cancel: onCancel,
    });

    for await (const event of parseSse(stream)) {
      expect(event.data).toBe("first");
      break;
    }
    expect(onCancel).toHaveBeenCalled();
  });
});
