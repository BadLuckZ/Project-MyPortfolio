import { describe, expect, it } from "vitest";
import { buildSystemPrompt } from "../../prompt/rule";

describe("buildSystemPrompt", () => {
  it("puts the rules first and wraps the profile in tags", () => {
    const prompt = buildSystemPrompt("# About\n- Name: Test");
    expect(prompt.indexOf("Rules:")).toBeLessThan(prompt.indexOf("<profile>"));
    expect(
      prompt.endsWith("<profile>\n# About\n- Name: Test\n</profile>"),
    ).toBe(true);
  });

  it("trims surrounding whitespace from the profile", () => {
    expect(buildSystemPrompt("\n\n# About\n\n")).toContain(
      "<profile>\n# About\n</profile>",
    );
  });

  it("rejects an empty profile", () => {
    expect(() => buildSystemPrompt("  \n ")).toThrow("profile is empty");
  });
});
