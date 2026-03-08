import { NextResponse } from "next/server";
import { getPresence, updatePresence, deletePresence } from "@/lib/presence-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const presence = await getPresence(id);
  if (!presence) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ presence });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updates = await request.json();

  const allowed = [
    "name",
    "physicalDescription",
    "bodyType",
    "clothingStyle",
    "hairStyle",
    "skinTone",
    "accessories",
    "knowledgeBaseIds",
    "knowledgeBaseNames",
    "promptId",
    "promptName",
    "signals",
  ];
  const filtered = Object.fromEntries(
    Object.entries(updates).filter(([k]) => allowed.includes(k))
  );

  const updated = await updatePresence(id, filtered);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ presence: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deletePresence(id);
  return NextResponse.json({ success: true });
}
