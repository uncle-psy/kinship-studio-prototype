"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { CreatePresenceModal } from "@/components/CreatePresenceModal";
import type { Presence } from "@/lib/types";

// Modal to choose between Presence (supervisor) or Agent (worker)
function CreateAgentChoiceModal({
  onClose,
  onChoosePresence,
  onChooseAgent,
}: {
  onClose: () => void;
  onChoosePresence: () => void;
  onChooseAgent: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-card-border rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-card-border">
          <div>
            <h2 className="text-xl font-bold text-white">Create New Agent</h2>
            <p className="text-sm text-muted mt-1">Choose what kind of agent to create</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-white transition-colors"
          >
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 gap-4">
          {/* Presence (supervisor) */}
          <button
            onClick={onChoosePresence}
            className="group text-left bg-background border border-card-border rounded-xl p-5 hover:border-accent/60 transition-all hover:bg-accent/5"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/25 transition-colors">
                <Icon icon="lucide:crown" width={22} height={22} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold text-base">Presence</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent/20 text-accent">Supervisor</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  A top-level orchestrator agent that coordinates worker agents, manages agentic loops, and serves as the primary interface. Presences are powered by alignments and can delegate tasks to Agents.
                </p>
              </div>
              <Icon icon="lucide:chevron-right" width={18} height={18} className="text-muted group-hover:text-accent transition-colors flex-shrink-0 mt-3" />
            </div>
          </button>

          {/* Agent (worker) */}
          <button
            onClick={onChooseAgent}
            className="group text-left bg-background border border-card-border rounded-xl p-5 hover:border-accent/60 transition-all hover:bg-accent/5"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.1] transition-colors">
                <Icon icon="lucide:bot" width={22} height={22} className="text-white/70" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold text-base">Agent</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.08] text-white/60">Worker</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  A specialized worker agent that executes specific tasks under a Presence&apos;s direction. Agents focus on a single responsibility — searching, writing, analyzing, or taking action via connected tools.
                </p>
              </div>
              <Icon icon="lucide:chevron-right" width={18} height={18} className="text-muted group-hover:text-accent transition-colors flex-shrink-0 mt-3" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple worker agent creation modal
function CreateWorkerAgentModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onCreated();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-card-border rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-card-border">
          <div>
            <h2 className="text-xl font-bold text-white">Create Worker Agent</h2>
            <p className="text-sm text-muted mt-1">Specialized agent to be directed by a Presence</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors">
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Agent Name <span className="text-accent">*</span>
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Research Agent, Content Writer, Data Analyst"
              className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Specialization / Role
            </label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Web research, Copywriting, Data extraction"
              className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this agent do? What tasks will it handle?"
              rows={3}
              className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleCreate}
              disabled={!name.trim() || saving}
              className="flex-1 bg-accent hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              {saving ? "Creating…" : "Create Agent"}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-card-border rounded-xl text-muted hover:text-white hover:border-white/30 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PresencePage() {
  const router = useRouter();
  const [presences, setPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showCreatePresence, setShowCreatePresence] = useState(false);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
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
    (p.briefDescription && p.briefDescription.toLowerCase().includes(search.toLowerCase())) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Presence</h1>
          <p className="text-muted mt-1">
            {presences.length} agent{presences.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowChoiceModal(true)}
          className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-2"
        >
          <Icon icon="lucide:plus" width={18} height={18} />
          Create New Agent
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

              {presence.briefDescription ? (
                <p className="text-sm text-muted/70 italic line-clamp-1 mb-1">&ldquo;{presence.briefDescription}&rdquo;</p>
              ) : null}

              {presence.description ? (
                <p className="text-sm text-muted line-clamp-2 mb-3">{presence.description}</p>
              ) : (
                <p className="text-sm text-muted/50 italic mb-3">No description yet</p>
              )}

              {/* Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
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
          <h3 className="text-xl font-semibold text-white mb-2">No agents yet</h3>
          <p className="text-muted mb-6 max-w-md mx-auto">
            Create a Presence (supervisor) to orchestrate your AI agents, or a worker Agent to handle specific tasks.
          </p>
          <button
            onClick={() => setShowChoiceModal(true)}
            className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            + Create New Agent
          </button>
        </div>
      )}

      {/* No search results */}
      {!loading && presences.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted">No presences match &ldquo;{search}&rdquo;</p>
        </div>
      )}

      {/* Choice modal */}
      {showChoiceModal && (
        <CreateAgentChoiceModal
          onClose={() => setShowChoiceModal(false)}
          onChoosePresence={() => {
            setShowChoiceModal(false);
            setShowCreatePresence(true);
          }}
          onChooseAgent={() => {
            setShowChoiceModal(false);
            setShowCreateAgent(true);
          }}
        />
      )}

      {/* Create Presence (supervisor) modal */}
      {showCreatePresence && (
        <CreatePresenceModal
          onClose={() => setShowCreatePresence(false)}
          onCreate={(p) => {
            setShowCreatePresence(false);
            router.push(`/presence/${p.id}`);
          }}
        />
      )}

      {/* Create worker Agent modal */}
      {showCreateAgent && (
        <CreateWorkerAgentModal
          onClose={() => setShowCreateAgent(false)}
          onCreated={() => {
            setShowCreateAgent(false);
            fetchPresences();
          }}
        />
      )}
    </div>
  );
}
