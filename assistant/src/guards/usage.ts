export const USAGE_LIMITS = {
  windowMs: 10 * 60 * 1000,
  perWindow: 10,
  perClientPerDay: 40,
  perDayTotal: 400,
};

export type UsageLimits = typeof USAGE_LIMITS;

export interface ClientUsage {
  day: string;
  dayCount: number;
  recent: number[];
}

export interface TotalUsage {
  day: string;
  count: number;
}

export type UsageDecision =
  | { allowed: true }
  | { allowed: false; reason: "rate_limited"; retryAfterSeconds: number }
  | { allowed: false; reason: "client_daily_limit" }
  | { allowed: false; reason: "budget_exhausted" };

export interface UsageResult {
  decision: UsageDecision;
  client: ClientUsage;
  total: TotalUsage;
}

const pacificDateFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Los_Angeles",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// Gemini's daily quota resets at midnight Pacific time
export function pacificDay(now: number): string {
  return pacificDateFormat.format(now);
}

export function checkUsage(
  client: ClientUsage | undefined,
  total: TotalUsage | undefined,
  now: number,
  limits: UsageLimits = USAGE_LIMITS,
): UsageResult {
  const day = pacificDay(now);
  const recent = (client?.recent ?? []).filter(
    (time) => now - time < limits.windowMs,
  );
  const dayCount = client?.day === day ? client.dayCount : 0;
  const totalCount = total?.day === day ? total.count : 0;
  const current: ClientUsage = { day, dayCount, recent };
  const currentTotal: TotalUsage = { day, count: totalCount };
  if (recent.length >= limits.perWindow) {
    const oldest = recent[0];
    const retryAfterSeconds = Math.ceil(
      (oldest + limits.windowMs - now) / 1000,
    );
    return {
      decision: { allowed: false, reason: "rate_limited", retryAfterSeconds },
      client: current,
      total: currentTotal,
    };
  }

  if (dayCount >= limits.perClientPerDay) {
    return {
      decision: { allowed: false, reason: "client_daily_limit" },
      client: current,
      total: currentTotal,
    };
  }

  if (totalCount >= limits.perDayTotal) {
    return {
      decision: { allowed: false, reason: "budget_exhausted" },
      client: current,
      total: currentTotal,
    };
  }

  return {
    decision: { allowed: true },
    client: { day, dayCount: dayCount + 1, recent: [...recent, now] },
    total: { day, count: totalCount + 1 },
  };
}
