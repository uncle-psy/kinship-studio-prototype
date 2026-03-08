import { NextResponse } from "next/server";
import {
  extractDriveId,
  getFileMetadata,
  listFolderFiles,
  downloadFileContent,
  isSupportedFileType,
} from "@/lib/google-drive";
import { extractText } from "@/lib/file-parser";
import { chunkText } from "@/lib/chunker";
import { embedTexts } from "@/lib/voyage";
import { pineconeUpsert } from "@/lib/pinecone";
import {
  getItems,
  updateItemStatus,
  addItem,
} from "@/lib/kb-store";
import type { KBItem, PineconeVector } from "@/lib/types";
import { nanoid } from "nanoid";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow up to 60s for large folders

// POST /api/knowledge/[id]/items/[itemId]/ingest — Ingest content from a Drive link
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { id: kbId, itemId } = await params;

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    // Find the drive-link item
    const items = await getItems(kbId);
    const item = items.find((i) => i.id === itemId);
    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }
    if (item.type !== "drive-link" || !item.url) {
      return NextResponse.json(
        { error: "Item is not a drive link" },
        { status: 400 }
      );
    }

    // Parse the Drive URL
    const driveInfo = extractDriveId(item.url);
    if (!driveInfo) {
      await updateItemStatus(kbId, itemId, "failed");
      return NextResponse.json(
        { error: "Could not parse Google Drive URL" },
        { status: 400 }
      );
    }

    // Update status to processing
    await updateItemStatus(kbId, itemId, "processing");

    const results: { name: string; chunks: number; status: string }[] = [];

    if (driveInfo.type === "folder") {
      // List files in the folder
      const files = await listFolderFiles(driveInfo.id, apiKey);
      const supportedFiles = files.filter((f) =>
        isSupportedFileType(f.mimeType)
      );

      if (supportedFiles.length === 0) {
        await updateItemStatus(kbId, itemId, "failed");
        return NextResponse.json(
          {
            error:
              "No supported files found in folder. Supports: PDF, DOCX, TXT, MD, CSV, Google Docs/Sheets/Slides",
          },
          { status: 400 }
        );
      }

      // Process each file in the folder
      for (const file of supportedFiles) {
        const result = await processFile(
          file.id,
          file.name,
          file.mimeType,
          kbId,
          apiKey
        );
        results.push(result);
      }

      // Update the parent link item status based on results
      const allFailed = results.every((r) => r.status === "failed");
      const totalChunks = results.reduce((sum, r) => sum + r.chunks, 0);
      await updateItemStatus(
        kbId,
        itemId,
        allFailed ? "failed" : "ingested",
        totalChunks
      );
    } else {
      // Single file
      const metadata = await getFileMetadata(driveInfo.id, apiKey);

      if (!isSupportedFileType(metadata.mimeType)) {
        await updateItemStatus(kbId, itemId, "failed");
        return NextResponse.json(
          {
            error: `Unsupported file type: ${metadata.mimeType}. Supports: PDF, DOCX, TXT, MD, CSV, Google Docs/Sheets/Slides`,
          },
          { status: 400 }
        );
      }

      const result = await processFile(
        driveInfo.id,
        metadata.name,
        metadata.mimeType,
        kbId,
        apiKey
      );
      results.push(result);

      await updateItemStatus(
        kbId,
        itemId,
        result.status === "failed" ? "failed" : "ingested",
        result.chunks
      );
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Ingest error:", error);
    await updateItemStatus(kbId, itemId, "failed");
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to ingest content",
      },
      { status: 500 }
    );
  }
}

/**
 * Download, parse, chunk, embed, and upsert a single file from Google Drive.
 * Also adds the file as a sub-item in the KB store.
 */
async function processFile(
  fileId: string,
  fileName: string,
  mimeType: string,
  kbId: string,
  apiKey: string
): Promise<{ name: string; chunks: number; status: string }> {
  const subItemId = `item_${nanoid(8)}`;

  try {
    // Download file content
    const { buffer, exportedMimeType } = await downloadFileContent(
      fileId,
      mimeType,
      apiKey
    );

    // Extract text
    const text = await extractText(buffer, exportedMimeType);
    if (!text || text.trim().length === 0) {
      return { name: fileName, chunks: 0, status: "failed" };
    }

    // Chunk
    const chunks = chunkText(text);

    // Embed
    const embeddings = await embedTexts(chunks, "document");

    // Build vectors
    const vectors: PineconeVector[] = chunks.map((chunk, i) => ({
      id: `${subItemId}_chunk_${i}`,
      values: embeddings[i],
      metadata: {
        text: chunk,
        fileName,
        itemId: subItemId,
        chunkIndex: i,
        source: "google-drive",
      },
    }));

    // Upsert to Pinecone in batches
    for (let i = 0; i < vectors.length; i += 100) {
      await pineconeUpsert(kbId, vectors.slice(i, i + 100));
    }

    // Add as a sub-item in the KB store
    const subItem: KBItem = {
      id: subItemId,
      name: `${fileName} (from Drive)`,
      type: "file",
      status: "ingested",
      createdAt: new Date().toISOString(),
      mimeType: exportedMimeType,
      chunkCount: chunks.length,
    };
    await addItem(kbId, subItem);

    return { name: fileName, chunks: chunks.length, status: "ingested" };
  } catch (err) {
    console.error(`Error processing Drive file ${fileName}:`, err);
    return { name: fileName, chunks: 0, status: "failed" };
  }
}
