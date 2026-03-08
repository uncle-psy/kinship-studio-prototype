import { NextResponse } from "next/server";
import { getPrompt, updatePrompt, deletePrompt } from "@/lib/prompt-store";

// GET /api/prompts/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prompt = await getPrompt(id);
    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }
    return NextResponse.json(prompt);
  } catch (error) {
    console.error("Get prompt error:", error);
    return NextResponse.json({ error: "Failed to get prompt" }, { status: 500 });
  }
}

// PUT /api/prompts/[id] — update fields
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();

    const allowed = ["name", "content", "tone", "persona", "audience", "format", "goal", "connectedKBId", "connectedKBName"];
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([k]) => allowed.includes(k))
    );

    const updated = await updatePrompt(id, filtered);
    if (!updated) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update prompt error:", error);
    return NextResponse.json({ error: "Failed to update prompt" }, { status: 500 });
  }
}

// DELETE /api/prompts/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await getPrompt(id);
    if (!existing) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }
    await deletePrompt(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete prompt error:", error);
    return NextResponse.json({ error: "Failed to delete prompt" }, { status: 500 });
  }
}
