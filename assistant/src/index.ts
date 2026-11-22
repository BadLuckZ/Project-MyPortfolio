import profile from "../generated/profile.md";
import { handleChat } from "./handlers/chat";
import { buildSystemPrompt } from "./prompt/rule";
import { createGeminiProvider } from "./providers/gemini";

const MODEL = "gemini-3.5-flash-lite";
const systemPrompt = buildSystemPrompt(profile);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ status: "ok" });
    }
    if (request.method === "POST" && url.pathname === "/chat") {
      if (!env.GEMINI_API_KEY) {
        console.log(
          JSON.stringify({ event: "config error", missing: "GEMINI_API_KEY" }),
        );
        return Response.json(
          { error: "temporarily unavailable" },
          { status: 503 },
        );
      }
      const provider = createGeminiProvider(env.GEMINI_API_KEY, MODEL);
      return handleChat(request, { provider, systemPrompt });
    }

    return Response.json({ error: "not found" }, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
