"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

interface KBItem {
  id: string;
  name: string;
  type: "file" | "ai-generated" | "drive-link";
  status: "pending" | "processing" | "ingested" | "failed";
  createdAt: string;
  url?: string;
  chunkCount?: number;
}

interface KBItemsListProps {
  kbId: string;
  items: KBItem[];
  onItemRemoved: () => void;
}

const typeIcons: Record<string, string> = {
  file: "lucide:file-text",
  "ai-generated": "lucide:sparkles",
  "drive-link": "lucide:link",
};

const typeLabels: Record<string, string> = {
  file: "File",
  "ai-generated": "AI Generated",
  "drive-link": "Drive Link",
};

export function KBItemsList({ kbId, items, onItemRemoved }: KBItemsListProps) {
  const [removing, setRemoving] = useState<string | null>(null);

  async function handleRemove(itemId: string) {
    setRemoving(itemId);
    try {
      const res = await fetch(
        `/api/knowledge/${kbId}/items/${itemId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        onItemRemoved();
      }
    } catch (err) {
      console.error("Remove failed:", err);
    } finally {
      setRemoving(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon
          icon="lucide:inbox"
          width={48}
          height={48}
          className="mx-auto mb-3 text-muted"
        />
        <p className="text-muted">No items yet. Upload files, add links, or generate content above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 bg-white/[0.04] hover:bg-white/[0.06] rounded-xl px-4 py-3 transition-colors group"
        >
          {/* Status indicator */}
          <div className="shrink-0">
            {item.status === "ingested" && (
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" title="Ingested" />
            )}
            {item.status === "failed" && (
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" title="Failed" />
            )}
            {item.status === "processing" && (
              <Icon
                icon="lucide:loader-2"
                width={14}
                height={14}
                className="text-yellow-500 animate-spin"
              />
            )}
            {item.status === "pending" && (
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" title="Pending" />
            )}
          </div>

          {/* Type icon */}
          <Icon
            icon={typeIcons[item.type] || "lucide:file"}
            width={18}
            height={18}
            className="text-muted shrink-0"
          />

          {/* Name */}
          <div className="flex-1 min-w-0">
            <p className="text-foreground truncate text-sm font-medium">
              {item.name}
            </p>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs text-muted">
                {typeLabels[item.type]}
              </span>
              {item.chunkCount != null && (
                <span className="text-xs text-muted">
                  {item.chunkCount} chunks
                </span>
              )}
              <span className="text-xs text-muted">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* URL for drive links */}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-dark transition-colors shrink-0"
              title="Open link"
            >
              <Icon icon="lucide:external-link" width={16} height={16} />
            </a>
          )}

          {/* Remove button */}
          <button
            onClick={() => handleRemove(item.id)}
            disabled={removing === item.id}
            className="text-muted hover:text-red-400 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
            title="Remove item"
          >
            {removing === item.id ? (
              <Icon
                icon="lucide:loader-2"
                width={16}
                height={16}
                className="animate-spin"
              />
            ) : (
              <Icon icon="lucide:trash-2" width={16} height={16} />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
