import { describe, expect, it } from "vitest";
import { clientKey } from "../../guards/client-key";

const SECRET_TEST = "secret-test";
const IP = "203.0.113.7";

describe("clientKey", () => {
  it("returns a 64-character hex string", async () => {
    expect(await clientKey(IP, SECRET_TEST)).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is stable for the same IP and secret", async () => {
    expect(await clientKey(IP, SECRET_TEST)).toBe(
      await clientKey(IP, SECRET_TEST),
    );
  });

  it("differs between IPs", async () => {
    expect(await clientKey(IP, SECRET_TEST)).not.toBe(
      await clientKey("203.0.113.8", SECRET_TEST),
    );
  });

  it("differs between secrets", async () => {
    expect(await clientKey(IP, SECRET_TEST)).not.toBe(
      await clientKey(IP, "other-secret"),
    );
  });

  it("does not contain the IP", async () => {
    expect(await clientKey(IP, SECRET_TEST)).not.toContain(IP);
  });
});
