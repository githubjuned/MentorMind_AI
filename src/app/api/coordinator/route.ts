import { NextRequest, NextResponse } from "next/server";
import { orchestrateAIRequest } from "@/services/ai/orchestrator";
import type { AppState } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, state, attachment, apiKey } = body as {
      text: string;
      state: AppState;
      attachment?: string;
      apiKey?: string;
    };

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing or invalid prompt text" }, { status: 400 });
    }

    if (!state) {
      return NextResponse.json({ error: "Missing student application state" }, { status: 400 });
    }

    const result = await orchestrateAIRequest(text, state, attachment, apiKey);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in AI Coordinator route:", error);
    return NextResponse.json(
      { error: "Failed to process coordinator request", details: String(error) },
      { status: 500 }
    );
  }
}

