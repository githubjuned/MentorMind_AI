import { db, isDatabaseConfigured } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbHealthy = false;
  if (isDatabaseConfigured && db) {
    try {
      await db.execute(sql`select 1`);
      dbHealthy = true;
    } catch {
      dbHealthy = false;
    }
  }

  const hasApiKey = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.OPENAI_API_KEY);

  return Response.json({
    status: "healthy",
    app: "MentorMind AI",
    version: "1.0.0",
    database: {
      configured: isDatabaseConfigured,
      connected: dbHealthy,
      mode: isDatabaseConfigured && dbHealthy ? "postgresql" : "local-first-storage",
    },
    ai: {
      mode: hasApiKey ? "live-ai-model" : "intelligent-heuristics-demo",
      provider: hasApiKey ? "gemini" : "demo-knowledge-base",
      specializedAgents: 7,
    },
    timestamp: new Date().toISOString(),
  });
}
