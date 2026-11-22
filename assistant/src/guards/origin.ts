const ALLOWED_METHODS = "POST, OPTIONS";
const ALLOWED_HEADERS = "Content-Type";
const PREFLIGHT_MAX_AGE_SECONDS = "86400";

export function parseAllowedOrigins(value: string | undefined): Set<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0),
  );
}

export function isAllowedOrigin(
  origin: string | null,
  allowed: Set<string>,
): origin is string {
  return origin !== null && allowed.has(origin);
}

export function corsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
    "Access-Control-Max-Age": PREFLIGHT_MAX_AGE_SECONDS,
    Vary: "Origin",
  };
}

export function withCors(response: Response, origin: string): Response {
  const result = new Response(response.body, response);
  for (const [name, value] of Object.entries(corsHeaders(origin))) {
    result.headers.set(name, value);
  }
  return result;
}
