"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { CreateKBModal } from "@/components/CreateKBModal";

interface KnowledgeBase {
  id: string;
  name: string;
  namespace: string;
  createdAt: string;
  itemCount: number;
}

export default function KnowledgePage() {
  const router = useRouter();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const fetchKBs = useCallback(async () => {
    try {
      const res = await fetch("/api/knowledge");
      if (res.ok) {
        const data = await res.json();
        setKnowledgeBases(data.knowledgeBases);
      }
    } catch (err) {
      console.error("Failed to fetch KBs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKBs();
  }, [fetchKBs]);

  const filtered = knowledgeBases.filter((kb) =>
    kb.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Knowledge Bases</h1>
          <p className="text-muted mt-1">
            {knowledgeBases.length} knowledge base{knowledgeBases.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-2"
        >
          <Icon icon="lucide:plus" width={18} height={18} />
          Create Knowledge Base
        </button>
      </div>

      {/* Search */}
      {knowledgeBases.length > 0 && (
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
              placeholder="Search knowledge bases..."
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
          <p className="text-muted">Loading knowledge bases...</p>
        </div>
      )}

      {/* KB Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((kb) => (
            <button
              key={kb.id}
              onClick={() => router.push(`/knowledge/${kb.id}`)}
              className="bg-card border border-card-border rounded-xl p-5 text-left hover:border-accent/50 transition-all hover:bg-white/[0.04] group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
                  <Icon
                    icon="lucide:brain"
                    width={20}
                    height={20}
                    className="text-accent"
                  />
                </div>
                <Icon
                  icon="lucide:chevron-right"
                  width={18}
                  height={18}
                  className="text-muted group-hover:text-accent transition-colors mt-1"
                />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1 truncate">
                {kb.name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-muted">
                <span className="flex items-center gap-1">
                  <Icon icon="lucide:file-text" width={14} height={14} />
                  {kb.itemCount} item{kb.itemCount !== 1 ? "s" : ""}
                </span>
                <span>
                  {new Date(kb.createdAt).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && knowledgeBases.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-4">
            <Icon icon="lucide:brain" width={32} height={32} className="text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No knowledge bases yet
          </h3>
          <p className="text-muted mb-6 max-w-md mx-auto">
            Create a knowledge base to store documents, files, and AI-generated
            content for your AI interactions.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            + Create Knowledge Base
          </button>
        </div>
      )}

      {/* No search results */}
      {!loading && knowledgeBases.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted">No knowledge bases match &ldquo;{search}&rdquo;</p>
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <CreateKBModal
          onClose={() => setShowCreate(false)}
          onCreate={(kb) => {
            setShowCreate(false);
            router.push(`/knowledge/${kb.id}`);
          }}
        />
      )}
    </div>
  );
}
