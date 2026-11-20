const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

const HTML_TAGS = new Set(["a", "b", "u", "br", "dd", "code"]);

export function htmlToText(html: string): string {
  assertKnownTags(html);

  const text = html
    .replace(/\s+/g, " ")
    .replace(
      /<a\s[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi,
      (_m: string, href: string, label: string) =>
        `[${stripTags(label).trim()}](${href})`,
    )
    .replace(/<code>(.*?)<\/code>/gi, "`$1`")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<dd>/gi, "\n")
    .replace(/<\/dd>/gi, "");

  return normalizeLines(decodeEntities(stripTags(text)));
}

function assertKnownTags(html: string): void {
  for (const match of html.matchAll(/<\/?([a-z][a-z0-9]*)/gi)) {
    const tag = match[1].toLowerCase();
    if (!HTML_TAGS.has(tag)) throw new Error(`Unknown HTML tag <${tag}>`);
  }
}

function stripTags(s: string): string {
  return s.replace(/<\/?[a-z][a-z0-9]*[^>]*>/gi, "");
}

function decodeEntities(s: string): string {
  return s.replace(/&[a-z0-9#]+;/gi, (entity) => {
    const char = ENTITIES[entity];
    if (char === undefined) throw new Error(`Unknown HTML entity ${entity}`);
    return char;
  });
}

function normalizeLines(s: string): string {
  return s
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
