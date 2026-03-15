import { NextResponse } from "next/server";
import { listPresences, createPresence, isValidHandle, isHandleTaken } from "@/lib/presence-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId") || undefined;
  const presences = await listPresences(projectId);
  return NextResponse.json({ presences });
}

export async function POST(request: Request) {
  const { name, briefDescription, handle, projectId } = await request.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const rawHandle = (handle ?? "").trim().toLowerCase();

  if (!rawHandle) {
    return NextResponse.json({ error: "Handle is required" }, { status: 400 });
  }
  if (!isValidHandle(rawHandle)) {
    return NextResponse.json(
      { error: "Handle may only contain letters, numbers, underscores, and periods (max 25 characters)" },
      { status: 400 }
    );
  }
  if (await isHandleTaken(rawHandle)) {
    return NextResponse.json({ error: "That handle is already taken" }, { status: 409 });
  }

  const presence = await createPresence(
    name.trim(),
    (briefDescription ?? "").trim(),
    rawHandle,
    projectId
  );
  return NextResponse.json({ presence }, { status: 201 });
}
