import { NextResponse } from "next/server";
import { listPrompts, createPrompt } from "@/lib/prompt-store";

// GET /api/prompts — list all prompts
export async function GET() {
  try {
    const prompts = await listPrompts();
    return NextResponse.json({ prompts });
  } catch (error) {
    console.error("List prompts error:", error);
    return NextResponse.json({ error: "Failed to list prompts" }, { status: 500 });
  }
}

// POST /api/prompts — create a new prompt
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const prompt = await createPrompt(name.trim());
    return NextResponse.json(prompt, { status: 201 });
  } catch (error) {
    console.error("Create prompt error:", error);
    return NextResponse.json({ error: "Failed to create prompt" }, { status: 500 });
  }
}
