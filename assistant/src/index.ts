import profile from "../generated/profile.md";
import {
  corsHeaders,
  isAllowedOrigin,
  parseAllowedOrigins,
  withCors,
} from "./guards/origin";
import { handleChat } from "./handlers/chat";
import { buildSystemPrompt } from "./prompt/rule";
import { createGeminiProvider } from "./providers/gemini";
export { UsageGuard } from "./durable/usage-guard";

const MODEL = "gemini-3.5-flash-lite";
const systemPrompt = buildSystemPrompt(profile);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ status: "ok" });
    }
    if (url.pathname === "/chat") {
      const origin = request.headers.get("Origin");
      if (!isAllowedOrigin(origin, parseAllowedOrigins(env.ALLOWED_ORIGINS))) {
        return Response.json({ error: "forbidden_origin" }, { status: 403 });
      }

      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(origin),
        });
      }

      if (request.method !== "POST") {
        return withCors(
          Response.json(
            { error: "method_not_allowed" },
            { status: 405, headers: { Allow: "POST, OPTIONS" } },
          ),
          origin,
        );
      }

      if (!env.GEMINI_API_KEY) {
        console.log(
          JSON.stringify({ event: "config_error", missing: "GEMINI_API_KEY" }),
        );
        return withCors(
          Response.json({ error: "temporarily_unavailable" }, { status: 503 }),
          origin,
        );
      }

      const provider = createGeminiProvider(env.GEMINI_API_KEY, MODEL);
      return withCors(
        await handleChat(request, { provider, systemPrompt }),
        origin,
      );
    }

    return Response.json({ error: "not_found" }, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
