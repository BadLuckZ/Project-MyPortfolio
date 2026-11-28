import { DurableObject } from "cloudflare:workers";
import {
  checkUsage,
  pacificDay,
  USAGE_LIMITS,
  type ClientUsage,
  type TotalUsage,
  type UsageDecision,
} from "../guards/usage";

const TOTAL_KEY = "total";
const CLIENT_PREFIX = "client:";
const CLEANUP_DELAY_MS = 24 * 60 * 60 * 1000;

export class UsageGuard extends DurableObject<Env> {
  async check(clientKey: string): Promise<UsageDecision> {
    const now = Date.now();
    const kv = this.ctx.storage.kv;
    const key = CLIENT_PREFIX + clientKey;

    const result = checkUsage(
      kv.get<ClientUsage>(key),
      kv.get<TotalUsage>(TOTAL_KEY),
      now,
    );

    if (result.decision.allowed) {
      kv.put(key, result.client);
      kv.put(TOTAL_KEY, result.total);

      if ((await this.ctx.storage.getAlarm()) === null) {
        await this.ctx.storage.setAlarm(now + CLEANUP_DELAY_MS);
      }
    }

    return result.decision;
  }

  async alarm(): Promise<void> {
    const now = Date.now();
    const today = pacificDay(now);
    const kv = this.ctx.storage.kv;

    for (const [key, usage] of kv.list<ClientUsage>({
      prefix: CLIENT_PREFIX,
    })) {
      const windowActive = usage.recent.some(
        (time) => now - time < USAGE_LIMITS.windowMs,
      );
      if (usage.day !== today && !windowActive) kv.delete(key);
    }
  }
}
