export interface SseEvent {
  event: string;
  data: string;
}

const EVENT_SEPARATOR = "\n\n";

function parseBlock(block: string): SseEvent | null {
  let event = "message";
  const data: string[] = [];

  for (const line of block.split("\n")) {
    if (line === "" || line.startsWith(":")) continue;
    const colon = line.indexOf(":");
    const field = colon === -1 ? line : line.slice(0, colon);
    let value = colon === -1 ? "" : line.slice(colon + 1);
    if (value.startsWith(" ")) value = value.slice(1);
    if (field === "event") event = value;
    else if (field === "data") data.push(value);
  }

  return data.length > 0 ? { event, data: data.join("\n") } : null;
}

export async function* parseSse(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<SseEvent> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finished = false;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        finished = true;
        return;
      }

      buffer += decoder.decode(value, { stream: true });
      buffer = buffer.replace(/\r\n/g, "\n");

      let end: number;
      while ((end = buffer.indexOf(EVENT_SEPARATOR)) !== -1) {
        const parsed = parseBlock(buffer.slice(0, end));
        buffer = buffer.slice(end + EVENT_SEPARATOR.length);
        if (parsed) yield parsed;
      }
    }
  } finally {
    if (!finished) await reader.cancel();
    reader.releaseLock();
  }
}
