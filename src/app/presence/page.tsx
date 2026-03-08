"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { CreatePresenceModal } from "@/components/CreatePresenceModal";
import type { Presence } from "@/lib/types";

export default function PresencePage() {
  const router = useRouter();
  const [presences, setPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const fetchPresences = useCallback(async () => {
    try {
      const res = await fetch("/api/presence");
      if (res.ok) {
        const data = await res.json();
        setPresences(data.presences);
      }
    } catch (err) {
      console.error("Failed to fetch presences:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPresences();
  }, [fetchPresences]);

  const filtered = presences.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.physicalDescription && p.physicalDescription.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Presence</h1>
          <p className="text-muted mt-1">
            {presences.length} actor{presences.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-2"
        >
          <Icon icon="lucide:plus" width={18} height={18} />
          New Presence
        </button>
      </div>

      {/* Search */}
      {presences.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <Icon
              icon="lucide:search"
              width={16}
              height={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search presences…"
              className="w-full bg-input border border-card-border rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
            />
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <Icon
            icon="lucide:loader-2"
            width={40}
            height={40}
            className="mx-auto mb-3 text-muted animate-spin"
          />
          <p className="text-muted">Loading presences…</p>
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((presence) => (
            <button
              key={presence.id}
              onClick={() => router.push(`/presence/${presence.id}`)}
              className="bg-card border border-card-border rounded-xl p-5 text-left hover:border-accent/50 transition-all hover:bg-white/[0.04] group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                  <Icon icon="lucide:user-round" width={20} height={20} className="text-accent" />
                </div>
                <Icon
                  icon="lucide:chevron-right"
                  width={18}
                  height={18}
                  className="text-muted group-hover:text-accent transition-colors mt-1"
                />
              </div>

              <h3 className="text-white font-semibold text-lg mb-1 truncate">{presence.name}</h3>

              {presence.physicalDescription ? (
                <p className="text-sm text-muted line-clamp-2 mb-3">{presence.physicalDescription}</p>
              ) : (
                <p className="text-sm text-muted/50 italic mb-3">No description yet</p>
              )}

              {/* Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {presence.bodyType && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent/80">
                    {presence.bodyType}
                  </span>
                )}
                {presence.clothingStyle && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-muted">
                    {presence.clothingStyle}
                  </span>
                )}
                {presence.knowledgeBaseIds.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-muted flex items-center gap-1">
                    <Icon icon="lucide:brain" width={10} height={10} />
                    {presence.knowledgeBaseIds.length} KB
                  </span>
                )}
                {presence.promptId && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-muted flex items-center gap-1">
                    <Icon icon="lucide:message-square-code" width={10} height={10} />
                    Prompt
                  </span>
                )}
                {presence.signals.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-muted flex items-center gap-1">
                    <Icon icon="lucide:activity" width={10} height={10} />
                    {presence.signals.length} signal{presence.signals.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <p className="text-xs text-muted mt-3">
                Updated {new Date(presence.updatedAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && presences.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-4">
            <Icon icon="lucide:user-round" width={32} height={32} className="text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No presences yet</h3>
          <p className="text-muted mb-6 max-w-md mx-auto">
            Create a Presence to define an actor or being — their appearance, knowledge, system prompt, and signal settings.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            + New Presence
          </button>
        </div>
      )}

      {/* No search results */}
      {!loading && presences.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted">No presences match &ldquo;{search}&rdquo;</p>
        </div>
      )}

      {showCreate && (
        <CreatePresenceModal
          onClose={() => setShowCreate(false)}
          onCreate={(p) => {
            setShowCreate(false);
            router.push(`/presence/${p.id}`);
          }}
        />
      )}
    </div>
  );
}
