import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { extractText, getMimeType } from "@/lib/file-parser";
import { chunkText } from "@/lib/chunker";
import { embedTexts } from "@/lib/voyage";
import { pineconeUpsert } from "@/lib/pinecone";
import { addItem, updateItemStatus } from "@/lib/kb-store";
import type { KBItem, PineconeVector } from "@/lib/types";

export const runtime = "nodejs";

// POST /api/knowledge/[id]/upload — Upload files, parse, chunk, embed, store
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: kbId } = await params;

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    const results: { name: string; chunkCount: number; status: string }[] = [];

    for (const file of files) {
      const itemId = `item_${nanoid(8)}`;
      const mimeType = getMimeType(file.name);

      // Add item to KV immediately as "processing"
      const item: KBItem = {
        id: itemId,
        name: file.name,
        type: "file",
        status: "processing",
        createdAt: new Date().toISOString(),
        mimeType,
      };
      await addItem(kbId, item);

      try {
        // Extract text
        const buffer = Buffer.from(await file.arrayBuffer());
        const text = await extractText(buffer, mimeType);

        if (!text || text.trim().length === 0) {
          await updateItemStatus(kbId, itemId, "failed");
          results.push({ name: file.name, chunkCount: 0, status: "failed" });
          continue;
        }

        // Chunk
        const chunks = chunkText(text);

        // Embed
        const embeddings = await embedTexts(chunks, "document");

        // Build vectors
        const vectors: PineconeVector[] = chunks.map((chunk, i) => ({
          id: `${itemId}_chunk_${i}`,
          values: embeddings[i],
          metadata: {
            text: chunk,
            fileName: file.name,
            itemId,
            chunkIndex: i,
          },
        }));

        // Upsert to Pinecone in batches of 100
        for (let i = 0; i < vectors.length; i += 100) {
          await pineconeUpsert(kbId, vectors.slice(i, i + 100));
        }

        // Update status to ingested
        await updateItemStatus(kbId, itemId, "ingested", chunks.length);
        results.push({
          name: file.name,
          chunkCount: chunks.length,
          status: "ingested",
        });
      } catch (err) {
        console.error(`Error processing file ${file.name}:`, err);
        await updateItemStatus(kbId, itemId, "failed");
        results.push({ name: file.name, chunkCount: 0, status: "failed" });
      }
    }

    return NextResponse.json({ files: results });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process uploads" },
      { status: 500 }
    );
  }
}
