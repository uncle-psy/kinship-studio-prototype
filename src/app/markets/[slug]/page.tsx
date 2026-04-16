"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useMarket } from "@/lib/project-context";
import {
  objectivesForMarket,
  proposalsForMarket,
  OBJECTIVE_STATUS_STYLES,
  PROPOSAL_STATUS_STYLES,
} from "@/lib/market-mock";

export default function MarketDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const { markets } = useMarket();
  const [showNewObjective, setShowNewObjective] = useState(false);

  const market = markets.find((m) => m.codeName === slug);
  if (markets.length > 0 && !market) {
    notFound();
  }
  if (!market) {
    return <div className="text-muted">Loading Market…</div>;
  }

  const objectives = objectivesForMarket(market.id);
  const proposals = proposalsForMarket(market.id);
  const activeProposals = proposals.filter((p) => p.status === "open" || p.status === "resolving").length;
  const deployedProposals = proposals.filter((p) => p.status === "passed" || p.status === "deployed").length;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-4">
        <Link href="/markets" className="hover:text-white transition-colors">
          Markets
        </Link>
        <Icon icon="lucide:chevron-right" width={14} height={14} />
        <span className="text-white">{market.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-6 flex-wrap">
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
            style={{ background: (market.accent || "#eb8000") + "22" }}
          >
            {market.icon || "📈"}
          </div>
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-3xl font-bold text-white">{market.name}</h1>
              <span className="text-sm text-muted">@{market.codeName}</span>
            </div>
            <p className="text-muted">{market.description}</p>
            <div className="flex gap-3 mt-3 flex-wrap text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <Icon icon="lucide:user" width={14} height={14} /> Sponsor: {market.owner}
              </span>
              {market.sponsorMode && (
                <span className="flex items-center gap-1.5">
                  <Icon icon="lucide:coins" width={14} height={14} /> {market.sponsorMode.replace("-", " ")}
                </span>
              )}
              {market.ledger && (
                <span className="flex items-center gap-1.5">
                  <Icon icon="lucide:database" width={14} height={14} /> {market.ledger} ledger
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowNewObjective(true)}
          className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors shrink-0"
        >
          + New Objective
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Objectives", value: objectives.length.toString(), icon: "lucide:target" },
          { label: "Proposals", value: proposals.length.toString(), icon: "lucide:vote" },
          { label: "Open / Resolving", value: activeProposals.toString(), icon: "lucide:activity" },
          { label: "Passed / Deployed", value: deployedProposals.toString(), icon: "lucide:rocket" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-card-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted text-xs mb-1">
              <Icon icon={s.icon} width={14} height={14} /> {s.label}
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Objectives */}
      <h2 className="text-xl font-semibold text-white mb-2">Objectives</h2>
      <p className="text-sm text-muted mb-4">
        Each Objective is a scoped area of activity. The Sponsor&rsquo;s value vector is declared here; every Proposal
        under the Objective is priced against it.
      </p>

      <div className="space-y-3 mb-8">
        {objectives.map((o) => {
          const oProposals = proposals.filter((p) => p.objectiveId === o.id);
          const open = oProposals.filter((p) => p.status === "open").length;
          const stat = OBJECTIVE_STATUS_STYLES[o.status];
          return (
            <Link
              key={o.id}
              href={`/markets/${market.codeName}/objectives/${o.slug}`}
              className="block bg-card border border-card-border rounded-xl p-5 hover:border-accent/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-white/[0.06] border border-card-border flex items-center justify-center text-2xl shrink-0">
                  {o.icon || "🎯"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-white font-semibold truncate">{o.name}</h3>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                      style={{ background: stat.bg, color: stat.color }}
                    >
                      {stat.label}
                    </span>
                    {o.operatorName && (
                      <span className="text-xs text-muted">· {o.operatorName}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted mb-3 line-clamp-2">{o.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {o.valueVector.slice(0, 4).map((v) => (
                      <span
                        key={v.id}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/70"
                      >
                        {v.label} · {v.weight}%
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-3 text-xs text-muted">
                    <span>{oProposals.length} proposals</span>
                    <span className="text-green-400/80">{open} open</span>
                    <span>Window: {o.resolutionWindowHours}h</span>
                    <span>Threshold: {(o.resolutionThreshold * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <Icon icon="lucide:chevron-right" width={20} height={20} className="text-muted shrink-0 mt-2" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent proposals */}
      <h2 className="text-xl font-semibold text-white mb-2">Recent proposals</h2>
      <div className="space-y-2 mb-6">
        {proposals
          .slice()
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 4)
          .map((p) => {
            const obj = objectives.find((o) => o.id === p.objectiveId);
            const stat = PROPOSAL_STATUS_STYLES[p.status];
            return (
              <Link
                key={p.id}
                href={`/markets/${market.codeName}/objectives/${obj?.slug || ""}/proposals/${p.id}`}
                className="block bg-card/60 border border-card-border rounded-lg p-4 hover:border-accent/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                        style={{ background: stat.bg, color: stat.color }}
                      >
                        {stat.label}
                      </span>
                      <span className="text-xs text-muted">{obj?.name}</span>
                    </div>
                    <div className="text-white text-sm font-medium">{p.title}</div>
                    {(p.passPrice > 0 || p.failPrice > 0) && (
                      <div className="flex gap-3 mt-2 text-xs text-muted">
                        <span className="text-green-400">Pass {(p.passPrice * 100).toFixed(0)}¢</span>
                        <span className="text-red-400">Fail {(p.failPrice * 100).toFixed(0)}¢</span>
                        <span>Vol ${((p.volumePass + p.volumeFail) / 1000).toFixed(1)}k</span>
                      </div>
                    )}
                  </div>
                  <Icon icon="lucide:chevron-right" width={16} height={16} className="text-muted mt-1" />
                </div>
              </Link>
            );
          })}
      </div>

      {/* New Objective modal */}
      {showNewObjective && (
        <NewObjectiveModal marketName={market.name} onClose={() => setShowNewObjective(false)} />
      )}
    </div>
  );
}

// ─── New Objective Modal ────────────────────────────────────────────────────

function NewObjectiveModal({ marketName, onClose }: { marketName: string; onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [operator, setOperator] = useState("");
  const [dims, setDims] = useState<{ label: string; weight: number }[]>([
    { label: "", weight: 40 },
    { label: "", weight: 30 },
    { label: "", weight: 20 },
    { label: "", weight: 10 },
  ]);
  const [window, setWindow] = useState(168);
  const [threshold, setThreshold] = useState(0.08);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="bg-card border border-card-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-5 border-b border-card-border">
          <div>
            <h2 className="text-xl font-bold text-white">New Objective</h2>
            <p className="text-xs text-muted">under <span className="text-white/80">{marketName}</span></p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white">
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">Objective name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Benefits Navigation"
              className="w-full bg-white/[0.06] border border-card-border rounded-lg px-3 py-2 text-white text-sm focus:border-accent/60 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">What this Objective optimizes</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="One paragraph. What does the Operator optimize? What would a good outcome look like a year from now?"
              className="w-full bg-white/[0.06] border border-card-border rounded-lg px-3 py-2 text-white text-sm focus:border-accent/60 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">Operator agent</label>
            <input
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              placeholder="e.g. Benefits Operator"
              className="w-full bg-white/[0.06] border border-card-border rounded-lg px-3 py-2 text-white text-sm focus:border-accent/60 outline-none"
            />
            <p className="text-[11px] text-muted mt-1">
              The Operator publishes proposals, runs the governance procedure, and emits Kinship Codes on resolution.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs uppercase tracking-wider text-muted">Value vector</label>
              <span className="text-[11px] text-muted">
                Weights should sum to 100% — Electors price Proposals against this mix.
              </span>
            </div>
            <div className="space-y-2">
              {dims.map((d, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={d.label}
                    onChange={(e) => {
                      const next = [...dims];
                      next[i] = { ...next[i], label: e.target.value };
                      setDims(next);
                    }}
                    placeholder={`Dimension ${i + 1}`}
                    className="flex-1 bg-white/[0.06] border border-card-border rounded-lg px-3 py-2 text-white text-sm focus:border-accent/60 outline-none"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={d.weight}
                    onChange={(e) => {
                      const next = [...dims];
                      next[i] = { ...next[i], weight: Number(e.target.value) };
                      setDims(next);
                    }}
                    className="w-20 bg-white/[0.06] border border-card-border rounded-lg px-3 py-2 text-white text-sm focus:border-accent/60 outline-none"
                  />
                  <span className="text-muted text-xs">%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">Resolution window (hours)</label>
              <input
                type="number"
                value={window}
                onChange={(e) => setWindow(Number(e.target.value))}
                className="w-full bg-white/[0.06] border border-card-border rounded-lg px-3 py-2 text-white text-sm focus:border-accent/60 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">TWAP threshold</label>
              <input
                type="number"
                step={0.01}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full bg-white/[0.06] border border-card-border rounded-lg px-3 py-2 text-white text-sm focus:border-accent/60 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 p-5 border-t border-card-border">
          <span className="text-xs text-muted">
            Objectives can be edited after creation. Proposals inherit the value vector at the time they open.
          </span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-white/70 hover:text-white">
              Cancel
            </button>
            <button
              onClick={onClose}
              className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2 rounded-full text-sm transition-colors"
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
