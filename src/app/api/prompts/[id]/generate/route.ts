import { NextResponse } from "next/server";
import { getPrompt, updatePrompt } from "@/lib/prompt-store";
import { pineconeQuery } from "@/lib/pinecone";
import { embedQuery } from "@/lib/voyage";

// POST /api/prompts/[id]/generate — AI generate or refine a prompt
// Body: { instructions: string, mode: "generate" | "refine" }
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const { instructions, mode = "generate" } = await request.json();
    if (!instructions || typeof instructions !== "string" || !instructions.trim()) {
      return NextResponse.json({ error: "Instructions are required" }, { status: 400 });
    }

    const prompt = await getPrompt(id);
    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    // Optionally pull KB context
    let kbContext = "";
    if (prompt.connectedKBId) {
      try {
        const queryVec = await embedQuery(instructions);
        const matches = await pineconeQuery(prompt.connectedKBId, queryVec, 5);
        if (matches.length > 0) {
          kbContext = matches
            .map((m: { metadata?: { text?: string } }) => m.metadata?.text || "")
            .filter(Boolean)
            .join("\n\n");
        }
      } catch (err) {
        console.warn("KB context fetch failed:", err);
      }
    }

    // Build the context block for guidance fields
    const guidance = [
      prompt.tone && `Tone: ${prompt.tone}`,
      prompt.persona && `Persona/Voice: ${prompt.persona}`,
      prompt.audience && `Target Audience: ${prompt.audience}`,
      prompt.format && `Output Format: ${prompt.format}`,
      prompt.goal && `Goal: ${prompt.goal}`,
    ]
      .filter(Boolean)
      .join("\n");

    let systemPrompt: string;
    let userMessage: string;

    if (mode === "refine" && prompt.content) {
      systemPrompt = `You are an expert AI prompt engineer. Your job is to refine and improve existing AI system prompts based on user instructions. Return only the updated prompt text — no explanations, no markdown fences, no meta-commentary. Just the prompt itself.`;

      userMessage = [
        guidance && `Prompt guidance:\n${guidance}`,
        kbContext && `Relevant context from knowledge base:\n${kbContext}`,
        `Current prompt:\n${prompt.content}`,
        `Refinement instructions: ${instructions}`,
      ]
        .filter(Boolean)
        .join("\n\n");
    } else {
      systemPrompt = `You are an expert AI prompt engineer. Your job is to write high-quality, clear, and effective AI system prompts. Return only the prompt text — no explanations, no markdown fences, no meta-commentary. Just the prompt itself.`;

      userMessage = [
        guidance && `Prompt guidance:\n${guidance}`,
        kbContext && `Relevant context from knowledge base:\n${kbContext}`,
        `Instructions: ${instructions}`,
      ]
        .filter(Boolean)
        .join("\n\n");
    }

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      console.error("Claude API error:", errText);
      return NextResponse.json({ error: "AI generation failed" }, { status: 502 });
    }

    const claudeData = await claudeRes.json();
    const generatedContent = claudeData.content[0].text.trim();

    // Save generated content back to prompt
    const updated = await updatePrompt(id, { content: generatedContent });

    return NextResponse.json({ content: generatedContent, prompt: updated });
  } catch (error) {
    console.error("Prompt generate error:", error);
    return NextResponse.json({ error: "Failed to generate prompt" }, { status: 500 });
  }
}
