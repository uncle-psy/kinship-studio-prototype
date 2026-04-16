"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { useMarket } from "@/lib/project-context";
import {
  getProposal,
  objectivesForMarket,
  PROPOSAL_STATUS_STYLES,
} from "@/lib/market-mock";

export default function ProposalDetailPage() {
  const params = useParams<{ slug: string; objectiveSlug: string; proposalId: string }>();
  const { markets } = useMarket();

  const market = markets.find((m) => m.codeName === params?.slug);
  if (markets.length > 0 && !market) notFound();
  if (!market) return <div className="text-muted">Loading…</div>;

  const objective = objectivesForMarket(market.id).find((o) => o.slug === params?.objectiveSlug);
  if (!objective) notFound();

  const proposal = getProposal(params?.proposalId || "");
  if (!proposal) notFound();
  if (!objective || !proposal) return null;

  const s = PROPOSAL_STATUS_STYLES[proposal.status];
  const totalVol = proposal.volumePass + proposal.volumeFail;
  const passShare = totalVol > 0 ? (proposal.volumePass / totalVol) * 100 : 0;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-4 flex-wrap">
        <Link href="/markets" className="hover:text-white">Markets</Link>
        <Icon icon="lucide:chevron-right" width={14} height={14} />
        <Link href={`/markets/${market.codeName}`} className="hover:text-white">{market.name}</Link>
        <Icon icon="lucide:chevron-right" width={14} height={14} />
        <Link href={`/markets/${market.codeName}/objectives/${objective.slug}`} className="hover:text-white">
          {objective.name}
        </Link>
        <Icon icon="lucide:chevron-right" width={14} height={14} />
        <span className="text-white">Proposal</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 mb-4 flex-wrap">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
          style={{ background: s.bg, color: s.color }}
        >
          {s.label}
        </span>
        <span className="text-xs text-muted">by {proposal.authoredBy}</span>
      </div>
      <h1 className="text-3xl font-bold text-white mb-3 max-w-3xl">{proposal.title}</h1>
      <p className="text-muted max-w-3xl leading-relaxed">{proposal.summary}</p>

      {/* Two-column layout: Market / Executors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Pass / Fail markets */}
          <div className="bg-card border border-card-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="lucide:line-chart" width={18} height={18} className="text-accent" />
              <h2 className="text-white font-semibold">Conditional markets</h2>
              {proposal.status === "open" && (
                <span className="text-xs text-green-400 ml-auto">
                  Closes {new Date(proposal.closesAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {totalVol > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="text-xs text-green-400 uppercase tracking-wider mb-1">Pass</div>
                    <div className="text-3xl font-bold text-green-400">
                      {(proposal.passPrice * 100).toFixed(0)}¢
                    </div>
                    <div className="text-xs text-muted mt-1">
                      Vol ${proposal.volumePass.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="text-xs text-red-400 uppercase tracking-wider mb-1">Fail</div>
                    <div className="text-3xl font-bold text-red-400">
                      {(proposal.failPrice * 100).toFixed(0)}¢
                    </div>
                    <div className="text-xs text-muted mt-1">
                      Vol ${proposal.volumeFail.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="h-3 rounded-full overflow-hidden bg-white/[0.06] flex">
                    <div className="h-full bg-green-500" style={{ width: `${passShare}%` }} />
                    <div className="h-full bg-red-500/80" style={{ width: `${100 - passShare}%` }} />
                  </div>
                  <div className="flex justify-between text-xs mt-1.5 text-muted">
                    <span>Pass TWAP · Citizens&rsquo; aggregate prediction that the action advances the vector</span>
                  </div>
                </div>

                {proposal.status === "open" && (
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 bg-green-500/15 hover:bg-green-500/25 text-green-400 font-semibold px-4 py-2.5 rounded-full text-sm transition-colors border border-green-500/30">
                      Buy Pass tokens
                    </button>
                    <button className="flex-1 bg-red-500/15 hover:bg-red-500/25 text-red-400 font-semibold px-4 py-2.5 rounded-full text-sm transition-colors border border-red-500/30">
                      Buy Fail tokens
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-muted">
                Market has not opened yet. Publish this Proposal to start conditional trading.
              </div>
            )}
          </div>

          {/* Executors */}
          <div className="bg-card border border-card-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon icon="lucide:cpu" width={18} height={18} className="text-accent" />
              <h2 className="text-white font-semibold">Executor bundle</h2>
              <span className="text-xs text-muted">
                On Pass, each Executor receives a scoped Kinship Code for the work below.
              </span>
            </div>
            <div className="space-y-2">
              {proposal.executors.map((ex) => (
                <div
                  key={ex.name}
                  className="bg-white/[0.04] border border-card-border rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">{ex.name}</span>
                    <span className="text-xs text-muted">· {ex.architect}</span>
                  </div>
                  <div className="text-xs text-white/60">{ex.scope}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Deployment trace (for passed/deployed proposals) */}
          {(proposal.status === "passed" || proposal.status === "deployed") && (
            <div className="bg-card border border-card-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Icon icon="lucide:rocket" width={18} height={18} className="text-accent" />
                <h2 className="text-white font-semibold">Deployment</h2>
              </div>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">1.</span>
                  <span className="text-white/80">
                    TWAP crossed threshold · {new Date(proposal.closesAt).toLocaleString()}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">2.</span>
                  <span className="text-white/80">
                    Autocrat emitted scoped Kinship Codes to {proposal.executors.length} Executor{proposal.executors.length > 1 ? "s" : ""}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">3.</span>
                  <span className="text-white/80">
                    Winning-side Electors settled; losing-side tokens retired
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold">4.</span>
                  <span className="text-white/80">
                    {proposal.status === "deployed"
                      ? "Executors reporting against the budget envelope"
                      : "Executors invoked; awaiting first report"}
                  </span>
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Sidebar details */}
        <div className="space-y-4">
          <div className="bg-card border border-card-border rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-wider text-muted mb-3">Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Opened</dt>
                <dd className="text-white text-right">
                  {new Date(proposal.opensAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Closes</dt>
                <dd className="text-white text-right">
                  {new Date(proposal.closesAt).toLocaleDateString()}
                </dd>
              </div>
              {proposal.budgetUsd && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Budget</dt>
                  <dd className="text-white text-right">
                    ${proposal.budgetUsd.toLocaleString()}
                  </dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Volume</dt>
                <dd className="text-white text-right">
                  ${(totalVol).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-wider text-muted mb-3">Objective alignment</h3>
            <p className="text-xs text-muted mb-3">
              This Proposal is priced against the Objective&rsquo;s value vector:
            </p>
            <div className="space-y-1.5">
              {objective.valueVector.map((v) => (
                <div key={v.id} className="flex justify-between text-sm">
                  <span className="text-white/80 truncate">{v.label}</span>
                  <span className="text-muted tabular-nums">{v.weight}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-wider text-muted mb-3">Discussion</h3>
            <div className="text-sm text-muted">
              Public discussion and Citizen / Elector debate logs appear here when the market opens.
            </div>
            <button className="mt-3 w-full bg-white/[0.06] hover:bg-white/[0.1] border border-card-border text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
              Open discussion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
