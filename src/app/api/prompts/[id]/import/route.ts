export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getPrompt } from "@/lib/prompt-store";
import { extractText } from "@/lib/file-parser";

// POST /api/prompts/[id]/import — Import a file and extract its text as prompt content
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const prompt = await getPrompt(id);
    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const supportedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/markdown",
      "text/x-markdown",
    ];

    const mimeType = file.type || "text/plain";
    if (!supportedTypes.some((t) => mimeType.startsWith(t.split("/")[0]) || mimeType === t)) {
      // Allow any text type
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractText(buffer, mimeType);

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Could not extract text from file" }, { status: 400 });
    }

    return NextResponse.json({ content: text.trim() });
  } catch (error) {
    console.error("Prompt import error:", error);
    return NextResponse.json({ error: "Failed to import file" }, { status: 500 });
  }
}
