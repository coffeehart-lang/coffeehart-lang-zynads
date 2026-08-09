import { onRequestGet as handleHealth } from "../functions/api/health";
import { onRequestGet as handleConfig } from "../functions/api/sheets/config";
import { onRequestGet as handleTransactions } from "../functions/api/sheets/transactions";
import { onRequestPost as handleSync } from "../functions/api/sheets/sync";
import { onRequestPost as handleAdvisor } from "../functions/api/advisor/summary";

export interface Env {
  GOOGLE_SERVICE_ACCOUNT_KEY?: string;
  GEMINI_API_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Create a context object mimicking Cloudflare Pages Functions context
    const context = {
      request,
      env,
    };

    if (path === "/api/health") {
      return handleHealth();
    } else if (path === "/api/sheets/config") {
      return handleConfig(context);
    } else if (path === "/api/sheets/transactions") {
      return handleTransactions(context);
    } else if (path === "/api/sheets/sync" && request.method === "POST") {
      return handleSync(context);
    } else if (path === "/api/advisor/summary" && request.method === "POST") {
      return handleAdvisor(context);
    }

    return new Response("Not found", { status: 404 });
  }
};
