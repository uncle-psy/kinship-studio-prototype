import { NextResponse } from "next/server";
import { listProjects, createProject } from "@/lib/project-store";

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, codeName, description, owner, team, visibility } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const project = await createProject({
    name,
    codeName,
    description,
    owner,
    team,
    visibility,
  });

  return NextResponse.json({ project }, { status: 201 });
}
