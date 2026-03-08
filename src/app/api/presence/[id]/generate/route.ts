import { NextResponse } from "next/server";
import { getPresence, updatePresence } from "@/lib/presence-store";

// POST /api/presence/[id]/generate
// Body: { target: "description" | "backstory", instructions: string, mode: "generate" | "refine" }
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured" }, { status: 500 });
    }

    const { target, instructions, mode = "generate" } = await request.json();

    if (!instructions?.trim()) {
      return NextResponse.json({ error: "Instructions are required" }, { status: 400 });
    }
    if (target !== "description" && target !== "backstory") {
      return NextResponse.json({ error: "target must be 'description' or 'backstory'" }, { status: 400 });
    }

    const presence = await getPresence(id);
    if (!presence) {
      return NextResponse.json({ error: "Presence not found" }, { status: 404 });
    }

    const context = [
      `Presence name: ${presence.name}`,
      presence.briefDescription && `Brief description: ${presence.briefDescription}`,
      target === "backstory" && presence.description && `Appearance description: ${presence.description}`,
    ]
      .filter(Boolean)
      .join("\n");

    let systemPrompt: string;
    let userMessage: string;

    if (target === "description") {
      if (mode === "refine" && presence.description) {
        systemPrompt = `You are a creative writer specializing in character and entity descriptions. Given context about a presence/actor/being, refine and improve an existing description based on user instructions. The presence could be anything — human, animal, mythical creature, elemental force, abstract entity, etc. Adapt your language and structure accordingly. Return only the updated description text — no headings, no markdown fences, no commentary.`;
        userMessage = `${context}\n\nCurrent description:\n${presence.description}\n\nRefinement instructions: ${instructions}`;
      } else {
        systemPrompt = `You are a creative writer specializing in character and entity descriptions. Given context about a presence/actor/being, write a rich, vivid description. The presence could be anything — human, animal, mythical creature, elemental force, abstract entity, etc. Adapt what you describe to fit the nature of the being (a fox has fur and a tail, not clothes; the wind has no body but has presence and motion). Return only the description text — no headings, no markdown fences, no commentary. 2–4 paragraphs.`;
        userMessage = `${context}\n\nInstructions: ${instructions}`;
      }
    } else {
      // backstory
      if (mode === "refine" && presence.backstory) {
        systemPrompt = `You are a creative writer specializing in character backstories and lore. Refine and improve an existing backstory based on user instructions. Return only the updated backstory text — no headings, no markdown fences, no commentary.`;
        userMessage = `${context}\n\nCurrent backstory:\n${presence.backstory}\n\nRefinement instructions: ${instructions}`;
      } else {
        systemPrompt = `You are a creative writer specializing in character backstories and lore. Given context about a presence/actor/being, write an engaging backstory — origins, history, motivations, and defining moments. Adapt the storytelling to fit the nature of the being. Return only the backstory text — no headings, no markdown fences, no commentary. 2–4 paragraphs.`;
        userMessage = `${context}\n\nInstructions: ${instructions}`;
      }
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
    const generated = claudeData.content[0].text.trim();

    const updated = await updatePresence(id, { [target]: generated });
    return NextResponse.json({ content: generated, presence: updated });
  } catch (error) {
    console.error("Presence generate error:", error);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
