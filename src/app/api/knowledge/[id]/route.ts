import { NextResponse } from "next/server";
import { getKnowledgeBase, deleteKnowledgeBase } from "@/lib/kb-store";
import { pineconeDelete } from "@/lib/pinecone";

// GET /api/knowledge/[id] — Get single knowledge base with items
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const kb = await getKnowledgeBase(id);
    if (!kb) {
      return NextResponse.json(
        { error: "Knowledge base not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(kb);
  } catch (error) {
    console.error("Get KB error:", error);
    return NextResponse.json(
      { error: "Failed to get knowledge base" },
      { status: 500 }
    );
  }
}

// DELETE /api/knowledge/[id] — Delete knowledge base and all its vectors
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete all vectors in the namespace from Pinecone
    try {
      await pineconeDelete({ deleteAll: true, namespace: id });
    } catch (err) {
      console.error("Pinecone delete error (non-fatal):", err);
    }

    // Remove metadata from KV
    await deleteKnowledgeBase(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete KB error:", error);
    return NextResponse.json(
      { error: "Failed to delete knowledge base" },
      { status: 500 }
    );
  }
}
