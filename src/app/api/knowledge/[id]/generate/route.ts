import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { chunkText } from "@/lib/chunker";
import { embedTexts } from "@/lib/voyage";
import { pineconeUpsert } from "@/lib/pinecone";
import { addItem, updateItemStatus } from "@/lib/kb-store";
import type { KBItem, PineconeVector } from "@/lib/types";

// POST /api/knowledge/[id]/generate — Use Claude to research + create a document
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: kbId } = await params;

  try {
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const itemId = `item_${nanoid(8)}`;
    const docName =
      prompt.length > 60 ? prompt.slice(0, 60) + "..." : prompt;

    // Add item as processing
    const item: KBItem = {
      id: itemId,
      name: docName,
      type: "ai-generated",
      status: "processing",
      createdAt: new Date().toISOString(),
    };
    await addItem(kbId, item);

    try {
      // Call Claude to generate the document
      const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system:
            "You are a knowledge base content creator. Generate detailed, well-structured, factual content based on the user's research prompt. Write in clear paragraphs with headers where appropriate. The content will be stored in a vector database for retrieval-augmented generation, so be thorough and informative.",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!claudeRes.ok) {
        const errData = await claudeRes.text();
        console.error("Claude API error:", errData);
        await updateItemStatus(kbId, itemId, "failed");
        return NextResponse.json(
          { error: "AI generation failed" },
          { status: 502 }
        );
      }

      const claudeData = await claudeRes.json();
      const generatedText = claudeData.content[0].text;

      // Chunk the generated text
      const chunks = chunkText(generatedText);

      // Embed
      const embeddings = await embedTexts(chunks, "document");

      // Build vectors
      const vectors: PineconeVector[] = chunks.map((chunk, i) => ({
        id: `${itemId}_chunk_${i}`,
        values: embeddings[i],
        metadata: {
          text: chunk,
          fileName: docName,
          itemId,
          chunkIndex: i,
          type: "ai-generated",
        },
      }));

      // Upsert to Pinecone
      for (let i = 0; i < vectors.length; i += 100) {
        await pineconeUpsert(kbId, vectors.slice(i, i + 100));
      }

      // Update status
      await updateItemStatus(kbId, itemId, "ingested", chunks.length);

      return NextResponse.json({
        document: {
          id: itemId,
          name: docName,
          chunkCount: chunks.length,
          status: "ingested",
        },
      });
    } catch (err) {
      console.error("Generation error:", err);
      await updateItemStatus(kbId, itemId, "failed");
      return NextResponse.json(
        { error: "Failed to generate document" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate document" },
      { status: 500 }
    );
  }
}
