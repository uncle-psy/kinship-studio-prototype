import { NextResponse } from "next/server";
import { removeItem } from "@/lib/kb-store";
import { pineconeListIds, pineconeDelete } from "@/lib/pinecone";

// DELETE /api/knowledge/[id]/items/[itemId] — Remove an item and its vectors
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id: kbId, itemId } = await params;

    // Remove from KV store
    const removed = await removeItem(kbId, itemId);
    if (!removed) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    // If the item had vectors in Pinecone, delete them
    if (removed.type !== "drive-link") {
      try {
        // List vectors with this item's prefix
        const vectorIds = await pineconeListIds(kbId, `${itemId}_chunk_`);
        if (vectorIds.length > 0) {
          await pineconeDelete({ ids: vectorIds, namespace: kbId });
        }
      } catch (err) {
        console.error("Pinecone vector delete error (non-fatal):", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove item error:", error);
    return NextResponse.json(
      { error: "Failed to remove item" },
      { status: 500 }
    );
  }
}
