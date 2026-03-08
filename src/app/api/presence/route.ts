import { NextResponse } from "next/server";
import { listPresences, createPresence } from "@/lib/presence-store";

export async function GET() {
  const presences = await listPresences();
  return NextResponse.json({ presences });
}

export async function POST(request: Request) {
  const { name } = await request.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const presence = await createPresence(name.trim());
  return NextResponse.json({ presence }, { status: 201 });
}
