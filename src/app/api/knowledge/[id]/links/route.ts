import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { addItem } from "@/lib/kb-store";
import type { KBItem } from "@/lib/types";

// POST /api/knowledge/[id]/links — Add a Google Drive link
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: kbId } = await params;

  try {
    const { url, name } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const itemId = `item_${nanoid(8)}`;
    const linkName =
      name || url.replace(/^https?:\/\//, "").slice(0, 60);

    const item: KBItem = {
      id: itemId,
      name: linkName,
      type: "drive-link",
      status: "pending",
      createdAt: new Date().toISOString(),
      url,
    };

    await addItem(kbId, item);

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Add link error:", error);
    return NextResponse.json(
      { error: "Failed to add link" },
      { status: 500 }
    );
  }
}
