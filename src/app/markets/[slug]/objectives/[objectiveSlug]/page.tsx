"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useMarket } from "@/lib/project-context";
import {
  objectivesForMarket,
  proposalsForObjective,
  PROPOSAL_STATUS_STYLES,
  OBJECTIVE_STATUS_STYLES,
} from "@/lib/market-mock";

export default function ObjectiveDetailPage() {
  const params = useParams<{ slug: string; objectiveSlug: string }>();
  const { markets } = useMarket();
  const [showNewProposal, setShowNewProposal] = useState(false);

  const market = markets.find((m) => m.codeName === params?.slug);
  if (markets.length > 0 && !market) notFound();
  if (!market) return <div className="text-muted">Loading…</div>;

  const objective = objectivesForMarket(market.id).find((o) => o.slug === params?.objectiveSlug);
  if (!objective) notFound();
  if (!objective) return null;

  const proposals = proposalsForObjective(objective.id);
  const stat = OBJECTIVE_STATUS_STYLES[objective.status];

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-muted mb-4 flex-wrap">
        <Link href="/markets" className="hover:text-white">Markets</Link>
        <Icon icon="lucide:chevron-right" width={14} height={14} />
        <Link href={`/markets/${market.codeName}`} className="hover:text-white">{market.name}</Link>
        <Icon icon="lucide:chevron-right" width={14} height={14} />
        <span className="text-white">{objective.name}</span>
      </div>

      <div className="flex items-start justify-between gap-6 mb-6 flex-wrap">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/[0.06] border border-card-border flex items-center justify-center text-3xl">
            {objective.icon || "🎯"}
          </div>
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-3xl font-bold text-white">{objective.name}</h1>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                style={{ background: stat.bg, color: stat.color }}
              >
                {stat.label}
              </span>
            </div>
            <p className="text-muted">{objective.description}</p>
            <div className="flex gap-3 mt-3 flex-wrap text-xs text-muted">
              {objective.operatorName && (
                <span className="flex items-center gap-1.5">
                  <Icon icon="lucide:user-cog" width={14} height={14} /> {objective.operatorName}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Icon icon="lucide:hourglass" width={14} height={14} /> Resolution window {objective.resolutionWindowHours}h
              </span>
              <span className="flex items-center gap-1.5">
                <Icon icon="lucide:gauge" width={14} height={14} /> TWAP threshold {(objective.resolutionThreshold * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowNewProposal(true)}
          className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors shrink-0"
        >
          + New Proposal
        </button>
      </div>

      {/* Value vector */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Icon icon="lucide:sliders-horizontal" width={18} height={18} className="text-accent" />
          <h2 className="text-white font-semibold">Value vector</h2>
          <span className="text-xs text-muted">
            Proposals under this Objective are priced against this mix.
          </span>
        </div>
        <div className="space-y-2">
          {objective.valueVector.map((v) => (
            <div key={v.id} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white/90 truncate">{v.label}</span>
                  {v.direction && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        v.direction === "maximize" ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"
                      }`}
                    >
                      {v.direction === "maximize" ? "↑ MAX" : "↓ MIN"}
                    </span>
                  )}
                </div>
                <div className="mt-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${v.weight}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="text-white text-sm font-semibold tabular-nums">{v.weight}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proposals list */}
      <h2 className="text-xl font-semibold text-white mb-2">Proposals</h2>
      <p className="text-sm text-muted mb-4">
        Each Proposal opens Pass / Fail conditional markets. On resolution, the Proposal emits scoped Kinship Codes to the listed Executors.
      </p>

      <div className="space-y-3">
        {proposals.length === 0 && (
          <div className="bg-card/60 border border-dashed border-card-border rounded-xl p-6 text-center text-muted text-sm">
            No proposals yet. Click <span className="text-accent font-semibold">+ New Proposal</span> to draft one.
          </div>
        )}
        {proposals.map((p) => {
          const s = PROPOSAL_STATUS_STYLES[p.status];
          const totalVol = p.volumePass + p.volumeFail;
          const passShare = totalVol > 0 ? (p.volumePass / totalVol) * 100 : 0;
          return (
            <Link
              key={p.id}
              href={`/markets/${market.codeName}/objectives/${objective.slug}/proposals/${p.id}`}
              className="block bg-card border border-card-border rounded-xl p-5 hover:border-accent/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                      style={{ background: s.bg, color: s.color }}
                    >
                      {s.label}
                    </span>
                    <span className="text-xs text-muted">by {p.authoredBy}</span>
                    {p.budgetUsd && (
                      <span className="text-xs text-white/70">
                        · ${p.budgetUsd.toLocaleString()} budget
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold mb-1">{p.title}</h3>
                  <p className="text-sm text-muted mb-3 line-clamp-2">{p.summary}</p>

                  {totalVol > 0 && (
                    <div>
                      <div className="h-2 rounded-full overflow-hidden bg-white/[0.06] flex">
                        <div className="h-full bg-green-500" style={{ width: `${passShare}%` }} />
                        <div className="h-full bg-red-500/80" style={{ width: `${100 - passShare}%` }} />
                      </div>
                      <div className="flex justify-between text-xs mt-1.5">
                        <span className="text-green-400 font-medium">
                          Pass {(p.passPrice * 100).toFixed(0)}¢ · ${(p.volumePass / 1000).toFixed(1)}k
                        </span>
                        <span className="text-red-400 font-medium">
                          Fail {(p.failPrice * 100).toFixed(0)}¢ · ${(p.volumeFail / 1000).toFixed(1)}k
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-3 flex-wrap">
                    {p.executors.map((ex) => (
                      <span
                        key={ex.name}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/70 flex items-center gap-1"
                      >
                        <Icon icon="lucide:cpu" width={11} height={11} />
                        {ex.name}
                      </span>
                    ))}
                  </div>
                </div>
                <Icon icon="lucide:chevron-right" width={20} height={20} className="text-muted shrink-0 mt-2" />
              </div>
            </Link>
          );
        })}
      </div>

      {showNewProposal && (
        <NewProposalModal
          objectiveName={objective.name}
          marketName={market.name}
          onClose={() => setShowNewProposal(false)}
        />
      )}
    </div>
  );
}

function NewProposalModal({
  objectiveName,
  marketName,
  onClose,
}: {
  objectiveName: string;
  marketName: string;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [budget, setBudget] = useState<number | "">("");
  const [executors, setExecutors] = useState<{ name: string; scope: string }[]>([
    { name: "", scope: "" },
  ]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="bg-card border border-card-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-5 border-b border-card-border">
          <div>
            <h2 className="text-xl font-bold text-white">New Proposal</h2>
            <p className="text-xs text-muted">
              under <span className="text-white/80">{marketName}</span> ·{" "}
              <span className="text-white/80">{objectiveName}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white">
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">Proposal title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Pilot Peer-Navigator cohort across 4 VSO chapters"
              className="w-full bg-white/[0.06] border border-card-border rounded-lg px-3 py-2 text-white text-sm focus:border-accent/60 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">What this Proposal authorizes</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              placeholder="State the action, the success criterion, and the window. Keep it narrow enough that Electors can price it."
              className="w-full bg-white/[0.06] border border-card-border rounded-lg px-3 py-2 text-white text-sm focus:border-accent/60 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">Budget envelope (USD)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 120000"
                className="w-full bg-white/[0.06] border border-card-border rounded-lg px-3 py-2 text-white text-sm focus:border-accent/60 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1.5">Trading window</label>
              <select className="w-full bg-white/[0.06] border border-card-border rounded-lg px-3 py-2 text-white text-sm focus:border-accent/60 outline-none">
                <option>7 days (inherit from Objective)</option>
                <option>3 days</option>
                <option>14 days</option>
                <option>30 days</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs uppercase tracking-wider text-muted">Executor bundle</label>
              <button
                onClick={() => setExecutors([...executors, { name: "", scope: "" }])}
                className="text-xs text-accent hover:text-accent-dark"
              >
                + Add Executor
              </button>
            </div>
            <p className="text-[11px] text-muted mb-2">
              Every tool the Executor will need must be named here. On Pass, these Executors receive scoped Kinship Codes for the budget envelope and reporting window.
            </p>
            <div className="space-y-2">
              {executors.map((ex, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={ex.name}
                    onChange={(e) => {
                      const next = [...executors];
                      next[i] = { ...next[i], name: e.target.value };
                      setExecutors(next);
                    }}
                    placeholder="Executor name"
                    className="w-48 bg-white/[0.06] border border-card-border rounded-lg px-3 py-2 text-white text-sm focus:border-accent/60 outline-none"
                  />
                  <input
                    value={ex.scope}
                    onChange={(e) => {
                      const next = [...executors];
                      next[i] = { ...next[i], scope: e.target.value };
                      setExecutors(next);
                    }}
                    placeholder="Tool scope / action surface"
                    className="flex-1 bg-white/[0.06] border border-card-border rounded-lg px-3 py-2 text-white text-sm focus:border-accent/60 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 p-5 border-t border-card-border">
          <span className="text-xs text-muted">
            Drafts stay private until the Sponsor publishes to the Action Market.
          </span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-white/70 hover:text-white">
              Cancel
            </button>
            <button
              onClick={onClose}
              className="bg-white/[0.08] hover:bg-white/[0.12] text-white font-medium px-4 py-2 rounded-full text-sm transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={onClose}
              className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2 rounded-full text-sm transition-colors"
            >
              Publish to Market
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
