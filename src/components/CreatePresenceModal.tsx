"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import type { Presence } from "@/lib/types";

interface Props {
  onClose: () => void;
  onCreate: (presence: Presence) => void;
}

export function CreatePresenceModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [briefDescription, setBriefDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), briefDescription: briefDescription.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create presence");
        return;
      }
      const data = await res.json();
      onCreate(data.presence);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-card-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
              <Icon icon="lucide:user-round" width={20} height={20} className="text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">New Presence</h2>
              <p className="text-xs text-muted">Create a new actor / being</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors p-1">
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Presence Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. The Wandering Scholar, Shadow Fox, The Tide…"
              autoFocus
              className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Brief Description
              <span className="text-muted font-normal ml-1">(optional — helps AI understand what this being is)</span>
            </label>
            <textarea
              value={briefDescription}
              onChange={(e) => setBriefDescription(e.target.value)}
              placeholder="e.g. A cunning arctic fox spirit who guides lost travellers. Or: a swirling dust storm with a mischievous personality."
              rows={3}
              className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 text-sm resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 flex items-center gap-1.5">
              <Icon icon="lucide:alert-circle" width={14} height={14} />
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/[0.06] hover:bg-white/[0.1] border border-card-border text-foreground font-medium px-4 py-2.5 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="flex-1 bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <Icon icon="lucide:loader-2" width={16} height={16} className="animate-spin" />
              ) : (
                <Icon icon="lucide:plus" width={16} height={16} />
              )}
              {loading ? "Creating…" : "Create Presence"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
