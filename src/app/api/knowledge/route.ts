import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { listKnowledgeBases, createKnowledgeBase } from "@/lib/kb-store";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

// GET /api/knowledge — List all knowledge bases
export async function GET() {
  try {
    const kbs = await listKnowledgeBases();
    return NextResponse.json({ knowledgeBases: kbs });
  } catch (error) {
    console.error("List KBs error:", error);
    return NextResponse.json(
      { error: "Failed to list knowledge bases" },
      { status: 500 }
    );
  }
}

// POST /api/knowledge — Create a new knowledge base
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const namespace = `${slugify(name.trim())}-${nanoid(6)}`;
    const kb = await createKnowledgeBase(name.trim(), namespace);

    return NextResponse.json(kb, { status: 201 });
  } catch (error) {
    console.error("Create KB error:", error);
    return NextResponse.json(
      { error: "Failed to create knowledge base" },
      { status: 500 }
    );
  }
}
