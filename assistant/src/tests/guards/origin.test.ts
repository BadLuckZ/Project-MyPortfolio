import { describe, expect, it } from "vitest";
import {
  corsHeaders,
  isAllowedOrigin,
  parseAllowedOrigins,
  withCors,
} from "../../guards/origin";

const SITE = "https://thanagorn.com";

describe("parseAllowedOrigins", () => {
  it("splits, trims and drops empty entries", () => {
    expect(
      parseAllowedOrigins(" https://a.com , ,http://localhost:5500 "),
    ).toEqual(new Set(["https://a.com", "http://localhost:5500"]));
  });

  it("returns an empty set when the variable is missing", () => {
    expect(parseAllowedOrigins(undefined).size).toBe(0);
  });
});

describe("isAllowedOrigin", () => {
  const allowed = parseAllowedOrigins(SITE);

  it("accepts an exact match", () => {
    expect(isAllowedOrigin(SITE, allowed)).toBe(true);
  });

  it("rejects a missing Origin header", () => {
    expect(isAllowedOrigin(null, allowed)).toBe(false);
  });

  it("rejects look-alike origins", () => {
    expect(isAllowedOrigin("https://thanagorn.com.evil.com", allowed)).toBe(
      false,
    );
    expect(isAllowedOrigin("http://thanagorn.com", allowed)).toBe(false);
    expect(isAllowedOrigin("https://www.thanagorn.com", allowed)).toBe(false);
  });
});

describe("withCors", () => {
  it("adds CORS headers and keeps status and body", async () => {
    const res = withCors(Response.json({ ok: true }, { status: 418 }), SITE);
    expect(res.status).toBe(418);
    expect(await res.json()).toEqual({ ok: true });
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(SITE);
    expect(res.headers.get("Vary")).toBe("Origin");
  });

  it("never uses a wildcard origin", () => {
    expect(corsHeaders(SITE)["Access-Control-Allow-Origin"]).not.toBe("*");
  });
});
