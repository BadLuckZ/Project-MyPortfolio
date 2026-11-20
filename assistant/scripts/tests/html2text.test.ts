import { describe, expect, it } from "vitest";
import { htmlToText } from "../html2text.ts";

describe("htmlToText", () => {
  it("turns <br> into line breaks", () => {
    expect(htmlToText("a<br>b<br><br>c")).toBe("a\nb\n\nc");
  });

  it("puts each <dd> item on its own line", () => {
    expect(htmlToText("Intro<dd>1. One</dd>\n   <dd>2. Two</dd>")).toBe("Intro\n1. One\n2. Two");
  });

  it("collapses source indentation like a browser", () => {
    expect(htmlToText("line one\n      continues")).toBe("line one continues");
  });

  it("converts links to markdown and keeps the URL", () => {
    const html = '<a href="https://example.com" target="_blank"><b><u>Click</u></b></a> to view.';
    expect(htmlToText(html)).toBe("[Click](https://example.com) to view.");
  });

  it("keeps <code> as inline code", () => {
    expect(htmlToText("used <code>@supabase/ssr</code> here")).toBe("used `@supabase/ssr` here");
  });

  it("drops formatting tags", () => {
    expect(htmlToText("<b>Bold</b> and <u>under</u>")).toBe("Bold and under");
  });

  it("decodes known entities", () => {
    expect(htmlToText("R&amp;D")).toBe("R&D");
  });

  it("rejects unknown tags", () => {
    expect(() => htmlToText("<script>x</script>")).toThrow("Unknown HTML tag <script>");
  });

  it("rejects unknown entities", () => {
    expect(() => htmlToText("a&nbsp;b")).toThrow("Unknown HTML entity &nbsp;");
  });
});
