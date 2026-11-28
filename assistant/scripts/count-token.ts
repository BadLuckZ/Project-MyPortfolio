import { readFile } from "node:fs/promises";
import path from "node:path";
import { countTokens } from "gpt-tokenizer/encoding/o200k_base";

const ASSISTANT_DIR = path.resolve(import.meta.dirname, "..");
const REPO_DIR = path.resolve(ASSISTANT_DIR, "..");

const FILES = [
  ["profile.md", path.join(ASSISTANT_DIR, "generated", "profile.md")],
  ["project.js", path.join(REPO_DIR, "js", "projects", "project.js")],
  ["experience.js", path.join(REPO_DIR, "js", "experiences", "experience.js")],
] as const;

for (const [label, file] of FILES) {
  const text = await readFile(file, "utf8");
  const tokens = countTokens(text);
  const chars = text.length.toLocaleString("en-US");
  console.log(`${label}: ${tokens} tokens, ${chars} chars`);
}
