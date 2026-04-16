"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { CreatePresenceModal } from "@/components/CreatePresenceModal";
import { useProject } from "@/lib/project-context";
import type { Presence, AgentLevel } from "@/lib/types";

// ── Agent level metadata ────────────────────────────────────────────────────
const AGENT_LEVELS: {
  level: AgentLevel;
  label: string;
  tag: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  examples: string;
}[] = [
  {
    level: "presence",
    label: "Elector",
    tag: "Citizen",
    icon: "lucide:user-round",
    color: "text-accent",
    bgColor: "bg-accent/15",
    description:
      "A Citizen's sovereign Elector. Trades Pass/Fail on every Proposal in the Markets it joins, priced against a value vector the Citizen configured once. Queries peer Electors and the Operator through the interaction layer.",
    examples:
      "Service Alliance veteran Elector, CLW heart-centered educator Elector, SBX coastal Citizen Elector",
  },
  {
    level: "project",
    label: "Operator",
    tag: "Sponsor",
    icon: "lucide:users",
    color: "text-purple-400",
    bgColor: "bg-purple-400/15",
    description:
      "Published by the Sponsor. Runs the governance procedure for one or more Objectives: publishes Proposals, enforces the resolution rules, and emits Kinship Codes to Executors on Pass.",
    examples:
      "Benefits Operator (Service Alliance), Education Operator (CLW), Placemaking Operator (Silicon Beach)",
  },
  {
    level: "platform",
    label: "Executor",
    tag: "Architect",
    icon: "lucide:building-2",
    color: "text-amber-400",
    bgColor: "bg-amber-400/15",
    description:
      "Built by an Architect. Carries scoped tool credentials and an operational playbook. On Pass, the Executor receives its Kinship Code and performs the authorized work — never outside its scope.",
    examples:
      "Peer Navigator Executor, LMS Migration Executor, Milestone Grant Executor, Venue Contract Executor",
  },
];

const LEVEL_META: Record<AgentLevel, typeof AGENT_LEVELS[0]> = Object.fromEntries(
  AGENT_LEVELS.map((a) => [a.level, a])
) as Record<AgentLevel, typeof AGENT_LEVELS[0]>;

// ── Choice Modal: Presence / Project / Platform ─────────────────────────────
function CreateAgentChoiceModal({
  onClose,
  onChooseLevel,
  onChooseWorker,
}: {
  onClose: () => void;
  onChooseLevel: (level: AgentLevel) => void;
  onChooseWorker: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-card-border rounded-2xl w-full max-w-xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-card-border">
          <div>
            <h2 className="text-xl font-bold text-white">Create New Agent</h2>
            <p className="text-sm text-muted mt-1">
              Choose the level at which this agent operates
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-white transition-colors"
          >
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Three topology levels */}
          {AGENT_LEVELS.map((agent) => (
            <button
              key={agent.level}
              onClick={() => onChooseLevel(agent.level)}
              className="group text-left bg-background border border-card-border rounded-xl p-5 hover:border-accent/60 transition-all hover:bg-accent/5 w-full"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${agent.bgColor} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon
                    icon={agent.icon}
                    width={22}
                    height={22}
                    className={agent.color}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-base">
                      {agent.label}
                    </h3>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${agent.bgColor} ${agent.color}`}
                    >
                      {agent.tag}
                    </span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed mb-1.5">
                    {agent.description}
                  </p>
                  <p className="text-xs text-muted/60 italic">{agent.examples}</p>
                </div>
                <Icon
                  icon="lucide:chevron-right"
                  width={18}
                  height={18}
                  className="text-muted group-hover:text-accent transition-colors flex-shrink-0 mt-3"
                />
              </div>
            </button>
          ))}

          {/* Divider */}
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-card-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs text-muted">or</span>
            </div>
          </div>

          {/* Worker agent */}
          <button
            onClick={onChooseWorker}
            className="group text-left bg-background border border-card-border rounded-xl p-5 hover:border-white/30 transition-all hover:bg-white/[0.02] w-full"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.1] transition-colors">
                <Icon
                  icon="lucide:bot"
                  width={22}
                  height={22}
                  className="text-white/70"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold text-base">
                    Worker Agent
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.08] text-white/60">
                    Specialist
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  A specialized worker that executes specific tasks under a
                  supervising agent&apos;s direction. Focuses on a single
                  responsibility: searching, writing, analyzing, or acting via
                  tools.
                </p>
              </div>
              <Icon
                icon="lucide:chevron-right"
                width={18}
                height={18}
                className="text-muted group-hover:text-white/60 transition-colors flex-shrink-0 mt-3"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Worker Agent creation modal ─────────────────────────────────────────────
function CreateWorkerAgentModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
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
            <h2 className="text-xl font-bold text-white">
              Create Worker Agent
            </h2>
            <p className="text-sm text-muted mt-1">
              Specialized agent to be directed by a supervising agent
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-white transition-colors"
          >
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
              {saving ? "Creating\u2026" : "Create Agent"}
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

// ── Filter tabs ─────────────────────────────────────────────────────────────
type FilterTab = "all" | AgentLevel;

// ── Main page ───────────────────────────────────────────────────────────────
export default function AgentsPage() {
  const router = useRouter();
  const { activeProject } = useProject();
  const [presences, setPresences] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [createLevel, setCreateLevel] = useState<AgentLevel | null>(null);
  const [showCreateWorker, setShowCreateWorker] = useState(false);
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");

  const fetchPresences = useCallback(async () => {
    if (!activeProject) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/presence?projectId=${activeProject.id}`
      );
      if (res.ok) {
        const data = await res.json();
        setPresences(data.presences);
      }
    } catch (err) {
      console.error("Failed to fetch presences:", err);
    } finally {
      setLoading(false);
    }
  }, [activeProject]);

  useEffect(() => {
    fetchPresences();
  }, [fetchPresences]);

  const filtered = presences
    .filter((p) => {
      if (filterTab !== "all" && (p.agentLevel || "presence") !== filterTab)
        return false;
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.briefDescription &&
          p.briefDescription.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    });

  // Count by level for filter badges
  const counts: Record<string, number> = { all: presences.length };
  for (const p of presences) {
    const lv = p.agentLevel || "presence";
    counts[lv] = (counts[lv] || 0) + 1;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Agents</h1>
          <p className="text-muted mt-1">
            {presences.length} agent{presences.length !== 1 ? "s" : ""} across{" "}
            {Object.keys(counts).length - 1} level
            {Object.keys(counts).length - 1 !== 1 ? "s" : ""}
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

      {/* Topology explainer */}
      {presences.length === 0 && !loading && (
        <div className="bg-card border border-card-border rounded-xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Icon icon="lucide:layers" width={18} height={18} className="text-accent" />
            Three agent classes — Operators, Electors, Executors
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-4">
            In a Kinship Action Market, Sponsors publish <span className="text-white">Operators</span>,
            Citizens configure <span className="text-white">Electors</span>, and Architects build{" "}
            <span className="text-white">Executors</span>. Operators govern, Electors price Proposals,
            and Executors carry out whatever the market resolves to deploy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {AGENT_LEVELS.map((agent) => (
              <div
                key={agent.level}
                className="border border-card-border rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg ${agent.bgColor} flex items-center justify-center`}
                  >
                    <Icon
                      icon={agent.icon}
                      width={16}
                      height={16}
                      className={agent.color}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {agent.label}
                    </div>
                    <div className="text-[10px] text-muted uppercase tracking-wider">
                      {agent.tag}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {agent.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs + Search */}
      {presences.length > 0 && (
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1 bg-card border border-card-border rounded-xl p-1">
            {(
              [
                { key: "all" as FilterTab, label: "All", icon: "lucide:layers" },
                ...AGENT_LEVELS.map((a) => ({
                  key: a.level as FilterTab,
                  label: a.label,
                  icon: a.icon,
                })),
              ] as { key: FilterTab; label: string; icon: string }[]
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterTab === tab.key
                    ? "bg-accent/20 text-accent"
                    : "text-muted hover:text-white"
                }`}
              >
                <Icon icon={tab.icon} width={13} height={13} />
                {tab.label}
                {counts[tab.key] ? (
                  <span className="text-[10px] opacity-70">
                    {counts[tab.key]}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
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
              placeholder="Search agents\u2026"
              className="w-full bg-input border border-card-border rounded-xl pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 text-sm"
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
          <p className="text-muted">Loading agents\u2026</p>
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((presence) => {
            const level = LEVEL_META[presence.agentLevel || "presence"];
            return (
              <button
                key={presence.id}
                onClick={() => router.push(`/agents/${presence.id}`)}
                className="bg-card border border-card-border rounded-xl p-5 text-left hover:border-accent/50 transition-all hover:bg-white/[0.04] group"
                style={{ borderLeftWidth: 3, borderLeftColor: level.level === "presence" ? "var(--accent)" : level.level === "project" ? "#a855f7" : "#f59e0b" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${level.bgColor} flex items-center justify-center`}
                  >
                    <Icon
                      icon={level.icon}
                      width={20}
                      height={20}
                      className={level.color}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${level.bgColor} ${level.color}`}
                    >
                      {level.tag}
                    </span>
                    <Icon
                      icon="lucide:chevron-right"
                      width={18}
                      height={18}
                      className="text-muted group-hover:text-accent transition-colors"
                    />
                  </div>
                </div>

                <h3 className="text-white font-semibold text-lg mb-1 truncate">
                  {presence.name}
                </h3>

                {presence.briefDescription ? (
                  <p className="text-sm text-muted/70 italic line-clamp-1 mb-1">
                    &ldquo;{presence.briefDescription}&rdquo;
                  </p>
                ) : null}

                {presence.description ? (
                  <p className="text-sm text-muted line-clamp-2 mb-3">
                    {presence.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted/50 italic mb-3">
                    No description yet
                  </p>
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
                      <Icon
                        icon="lucide:message-square-code"
                        width={10}
                        height={10}
                      />
                      Prompt
                    </span>
                  )}
                  {presence.signals.length > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-muted flex items-center gap-1">
                      <Icon icon="lucide:activity" width={10} height={10} />
                      {presence.signals.length} signal
                      {presence.signals.length !== 1 ? "s" : ""}
                    </span>
                  )}
                  {presence.primitiveIds && presence.primitiveIds.length > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent flex items-center gap-1">
                      <Icon icon="lucide:puzzle" width={10} height={10} />
                      {presence.primitiveIds.length} primitives
                    </span>
                  )}
                  {presence.gatheringIds && presence.gatheringIds.length > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 flex items-center gap-1">
                      <Icon icon="lucide:circle-dot" width={10} height={10} />
                      {presence.gatheringIds.length} gathering
                      {presence.gatheringIds.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted mt-3">
                  Updated{" "}
                  {new Date(presence.updatedAt).toLocaleDateString()}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && presences.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-4">
            <Icon
              icon="lucide:user-round"
              width={32}
              height={32}
              className="text-accent"
            />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No agents yet
          </h3>
          <p className="text-muted mb-6 max-w-md mx-auto">
            Create an Elector (Citizen), an Operator (Sponsor), or an Executor (Architect) to start wiring
            this Market&rsquo;s agents.
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
          <p className="text-muted">
            No agents match &ldquo;{search}&rdquo;
            {filterTab !== "all"
              ? ` in ${LEVEL_META[filterTab].label}`
              : ""}
          </p>
        </div>
      )}

      {/* Choice modal */}
      {showChoiceModal && (
        <CreateAgentChoiceModal
          onClose={() => setShowChoiceModal(false)}
          onChooseLevel={(level) => {
            setShowChoiceModal(false);
            setCreateLevel(level);
          }}
          onChooseWorker={() => {
            setShowChoiceModal(false);
            setShowCreateWorker(true);
          }}
        />
      )}

      {/* Create agent modal (all three levels) */}
      {createLevel && (
        <CreatePresenceModal
          onClose={() => setCreateLevel(null)}
          projectId={activeProject?.id}
          agentLevel={createLevel}
          onCreate={(p) => {
            setCreateLevel(null);
            router.push(`/agents/${p.id}`);
          }}
        />
      )}

      {/* Create worker modal */}
      {showCreateWorker && (
        <CreateWorkerAgentModal
          onClose={() => setShowCreateWorker(false)}
          onCreated={() => {
            setShowCreateWorker(false);
            fetchPresences();
          }}
        />
      )}
    </div>
  );
}
