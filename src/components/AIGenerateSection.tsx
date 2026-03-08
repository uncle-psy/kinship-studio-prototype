"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

interface AIGenerateSectionProps {
  kbId: string;
  onGenerated: () => void;
}

export function AIGenerateSection({
  kbId,
  onGenerated,
}: AIGenerateSectionProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleGenerate() {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/knowledge/${kbId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      setSuccess(
        `Generated "${data.document.name}" (${data.document.chunkCount} chunks)`
      );
      setPrompt("");
      onGenerated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe what content to research and generate... e.g. 'Write a comprehensive guide about cognitive behavioral therapy techniques for anxiety management'"
        className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none h-28"
        disabled={loading}
      />

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-400 text-sm mt-2">{success}</p>}

      <button
        onClick={handleGenerate}
        disabled={!prompt.trim() || loading}
        className="mt-3 bg-accent hover:bg-accent-dark text-white font-medium px-5 py-2.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <Icon
              icon="lucide:loader-2"
              width={16}
              height={16}
              className="animate-spin"
            />
            Generating...
          </>
        ) : (
          <>
            <Icon icon="lucide:sparkles" width={16} height={16} />
            Generate Document
          </>
        )}
      </button>
    </div>
  );
}
