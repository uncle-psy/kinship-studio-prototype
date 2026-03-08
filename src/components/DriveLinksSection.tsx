"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

interface DriveLinksSectionProps {
  kbId: string;
  onLinkAdded: () => void;
}

export function DriveLinksSection({
  kbId,
  onLinkAdded,
}: DriveLinksSectionProps) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAddLink() {
    if (!url.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/knowledge/${kbId}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          name: name.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add link");
      }

      setUrl("");
      setName("");
      onLinkAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="space-y-3">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://drive.google.com/drive/folders/..."
          className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
          disabled={loading}
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Link name (optional)"
          className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
          disabled={loading}
        />
      </div>

      <p className="text-xs text-muted mt-2 mb-3">
        <Icon icon="lucide:info" width={12} height={12} className="inline mr-1" />
        Content sync from Google Drive coming soon. Links are saved for reference.
      </p>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      <button
        onClick={handleAddLink}
        disabled={!url.trim() || loading}
        className="bg-card border border-card-border hover:border-accent/50 text-foreground font-medium px-5 py-2.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <Icon
            icon="lucide:loader-2"
            width={16}
            height={16}
            className="animate-spin"
          />
        ) : (
          <Icon icon="lucide:link" width={16} height={16} />
        )}
        Add Link
      </button>
    </div>
  );
}
