"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

interface CreateKBModalProps {
  onClose: () => void;
  onCreate: (kb: { id: string; name: string; namespace: string }) => void;
}

export function CreateKBModal({ onClose, onCreate }: CreateKBModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create");
      }

      const kb = await res.json();
      onCreate(kb);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card border border-card-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Create Knowledge Base
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-white transition-colors"
          >
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm text-subtle mb-2">
            Knowledge Base Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Product Documentation, Research Papers..."
            className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 mb-1"
            autoFocus
            disabled={loading}
          />
          <p className="text-xs text-muted mb-5">
            A new Pinecone namespace will be created for this knowledge base.
          </p>

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-card-border text-foreground hover:border-accent/50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <Icon
                  icon="lucide:loader-2"
                  width={16}
                  height={16}
                  className="animate-spin"
                />
              )}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
