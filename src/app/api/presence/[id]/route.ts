import { NextResponse } from "next/server";
import { getPresence, updatePresence, deletePresence, isValidHandle, isHandleTaken } from "@/lib/presence-store";

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

  // Validate handle if being updated
  if (updates.handle !== undefined) {
    const newHandle = String(updates.handle).trim().toLowerCase();
    if (!isValidHandle(newHandle)) {
      return NextResponse.json(
        { error: "Handle may only contain letters, numbers, underscores, and periods (max 25 characters)" },
        { status: 400 }
      );
    }
    if (await isHandleTaken(newHandle, id)) {
      return NextResponse.json({ error: "That handle is already taken" }, { status: 409 });
    }
    updates.handle = newHandle;
  }

  const allowed = [
    "name",
    "handle",
    "briefDescription",
    "description",
    "backstory",
    "assetId",
    "assetName",
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
