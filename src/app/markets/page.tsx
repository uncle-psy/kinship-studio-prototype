"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { useMarket } from "@/lib/project-context";
import { objectivesForMarket, proposalsForMarket } from "@/lib/market-mock";

export default function MarketsPage() {
  const { markets, loading } = useMarket();

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Markets</h1>
          <p className="text-muted mt-1 max-w-2xl">
            A Market is the top-level container for a Kinship Action Market — an organization, network,
            or domain whose Sponsor designs an Operator, sets the objective vector, and binds the
            Executors that deploy on resolution.
          </p>
        </div>
        <button className="shrink-0 bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors">
          + New Market
        </button>
      </div>

      {/* Design → Decide → Deploy banner */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-6 flex flex-wrap gap-4">
        {[
          { phase: "Design", where: "in the Studio", icon: "lucide:compass" },
          { phase: "Decide", where: "in the Action Market", icon: "lucide:line-chart" },
          { phase: "Deploy", where: "through the Exchange", icon: "lucide:rocket" },
        ].map((p, i) => (
          <div key={p.phase} className="flex items-center gap-3 flex-1 min-w-[220px]">
            <div className="w-10 h-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
              <Icon icon={p.icon} width={20} height={20} />
            </div>
            <div>
              <div className="text-white font-semibold">
                {i + 1}. {p.phase}
              </div>
              <div className="text-xs text-muted">{p.where}</div>
            </div>
          </div>
        ))}
      </div>

      {loading && <div className="text-muted">Loading Markets…</div>}

      <div className="space-y-3">
        {markets.map((m) => {
          const objectives = objectivesForMarket(m.id);
          const proposals = proposalsForMarket(m.id);
          const activeProposals = proposals.filter((p) => p.status === "open" || p.status === "resolving");
          return (
            <Link
              key={m.id}
              href={`/markets/${m.codeName}`}
              className="block bg-card border border-card-border rounded-xl p-5 hover:border-accent/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0"
                  style={{ background: (m.accent || "#eb8000") + "22" }}
                >
                  {m.icon || "📈"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-white font-semibold text-lg truncate">{m.name}</h3>
                    <span className="text-xs text-muted">@{m.codeName}</span>
                    <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {m.visibility}
                    </span>
                    {m.sponsorMode && (
                      <span className="bg-white/[0.06] text-white/70 text-[10px] font-medium px-2 py-0.5 rounded uppercase">
                        {m.sponsorMode.replace("-", " ")}
                      </span>
                    )}
                    {m.ledger && (
                      <span className="bg-white/[0.06] text-white/70 text-[10px] font-medium px-2 py-0.5 rounded uppercase">
                        {m.ledger} ledger
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted mb-3 line-clamp-2">{m.description}</p>
                  <div className="flex gap-4 text-xs text-muted flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Icon icon="lucide:target" width={14} height={14} />
                      {objectives.length} objectives
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Icon icon="lucide:vote" width={14} height={14} />
                      {proposals.length} proposals
                    </span>
                    <span className="flex items-center gap-1.5 text-green-400/80">
                      <Icon icon="lucide:activity" width={14} height={14} />
                      {activeProposals.length} live
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Icon icon="lucide:user" width={14} height={14} />
                      {m.owner}
                    </span>
                  </div>
                </div>
                <Icon icon="lucide:chevron-right" width={20} height={20} className="text-muted shrink-0 mt-2" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 bg-card/60 border border-card-border rounded-xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-accent text-2xl">ℹ️</span>
          <div>
            <h3 className="text-accent font-semibold mb-1">Market → Objective → Proposal</h3>
            <p className="text-sm text-muted leading-relaxed">
              A Market holds one or more <strong className="text-white/80">Objectives</strong> — scoped
              areas of activity such as a program line, a campaign, a fund. Each Objective carries its
              own value vector and contains <strong className="text-white/80">Proposals</strong>, the
              specific decisions the Pass / Fail conditional markets price. A resolved Proposal emits
              scoped Kinship Codes to the Executors it named.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
