import { describe, expect, it } from "vitest";
import {
  checkUsage,
  pacificDay,
  USAGE_LIMITS,
  type ClientUsage,
  type TotalUsage,
  type UsageLimits,
} from "../../guards/usage";

const START = Date.parse("2026-11-23T18:00:00Z");
const MINUTE = 60 * 1000;

const SMALL: UsageLimits = {
  windowMs: 10 * MINUTE,
  perWindow: 3,
  perClientPerDay: 5,
  perDayTotal: 8,
};

function run(times: number, limits: UsageLimits = SMALL) {
  let result = checkUsage(undefined, undefined, START, limits);
  for (let i = 1; i < times; i++) {
    result = checkUsage(
      result.client,
      result.total,
      START + i * MINUTE,
      limits,
    );
  }
  return result;
}

describe("pacificDay", () => {
  it("uses the Pacific date, not the UTC date", () => {
    expect(pacificDay(Date.parse("2026-11-23T07:59:00Z"))).toBe("2026-11-22");
    expect(pacificDay(Date.parse("2026-11-23T08:00:00Z"))).toBe("2026-11-23");
  });

  it("follows daylight saving time", () => {
    expect(pacificDay(Date.parse("2026-03-09T06:59:00Z"))).toBe("2026-03-08");
    expect(pacificDay(Date.parse("2026-03-09T07:00:00Z"))).toBe("2026-03-09");
  });
});

describe("checkUsage", () => {
  it("allows the first request and counts it", () => {
    const result = checkUsage(undefined, undefined, START, SMALL);
    expect(result.decision).toEqual({ allowed: true });
    expect(result.client).toEqual({
      day: "2026-11-23",
      dayCount: 1,
      recent: [START],
    });
    expect(result.total).toEqual({ day: "2026-11-23", count: 1 });
  });

  it("allows up to the window limit and blocks the next one", () => {
    expect(run(SMALL.perWindow).decision.allowed).toBe(true);
    expect(run(SMALL.perWindow + 1).decision).toMatchObject({
      allowed: false,
      reason: "rate_limited",
    });
  });

  it("tells the client how long to wait", () => {
    const result = run(SMALL.perWindow + 1);
    expect(result.decision).toEqual({
      allowed: false,
      reason: "rate_limited",
      retryAfterSeconds: 7 * 60,
    });
  });

  it("allows requests again once old ones leave the window", () => {
    const full = run(SMALL.perWindow);
    const later = checkUsage(
      full.client,
      full.total,
      START + SMALL.windowMs,
      SMALL,
    );
    expect(later.decision.allowed).toBe(true);
  });

  it("does not count blocked requests", () => {
    const blocked = run(SMALL.perWindow + 1);
    expect(blocked.client.dayCount).toBe(SMALL.perWindow);
    expect(blocked.total.count).toBe(SMALL.perWindow);
  });

  it("blocks a client at its daily limit", () => {
    const limits = { ...SMALL, windowMs: MINUTE };
    expect(run(SMALL.perClientPerDay, limits).decision.allowed).toBe(true);
    expect(run(SMALL.perClientPerDay + 1, limits).decision).toEqual({
      allowed: false,
      reason: "client_daily_limit",
    });
  });

  it("resets the daily count at midnight Pacific", () => {
    const client: ClientUsage = {
      day: "2026-11-22",
      dayCount: SMALL.perClientPerDay,
      recent: [],
    };
    const result = checkUsage(client, undefined, START, SMALL);
    expect(result.decision.allowed).toBe(true);
    expect(result.client.dayCount).toBe(1);
  });

  it("returns 'budget_exhausted' when the total budget is used up", () => {
    const total: TotalUsage = { day: "2026-11-23", count: SMALL.perDayTotal };
    const result = checkUsage(undefined, total, START, SMALL);
    expect(result.decision).toEqual({
      allowed: false,
      reason: "budget_exhausted",
    });
  });

  it("checks the client limits before the total budget", () => {
    const full = run(SMALL.perWindow);
    const total: TotalUsage = { day: "2026-11-23", count: SMALL.perDayTotal };
    const result = checkUsage(full.client, total, START + MINUTE * 3, SMALL);
    expect(result.decision).toMatchObject({ reason: "rate_limited" });
    expect(result.total.count).toBe(SMALL.perDayTotal);
  });

  it("resets the total budget at midnight Pacific", () => {
    const total: TotalUsage = { day: "2026-11-22", count: SMALL.perDayTotal };
    const result = checkUsage(undefined, total, START, SMALL);
    expect(result.decision.allowed).toBe(true);
    expect(result.total).toEqual({ day: "2026-11-23", count: 1 });
  });

  it("does not change the state it was given", () => {
    const client: ClientUsage = { day: "2026-11-23", dayCount: 1, recent: [] };
    const snapshot = structuredClone(client);
    checkUsage(client, undefined, START, SMALL);
    expect(client).toEqual(snapshot);
  });

  it("uses the agreed production limits by default", () => {
    expect(USAGE_LIMITS).toEqual({
      windowMs: 10 * MINUTE,
      perWindow: 10,
      perClientPerDay: 40,
      perDayTotal: 400,
    });
  });
});
