"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

type ExperienceStatus = "Live" | "Draft";

const experiences: {
  id: string;
  name: string;
  emoji: string;
  market: string;
  marketSlug: string;
  status: ExperienceStatus;
  description: string;
  surfaces: number;
  rituals: number;
  owner: string;
  updated: string;
}[] = [
  {
    id: "x-sa-peer-drop-in",
    name: "Peer Drop-In",
    emoji: "🎖️",
    market: "Service Alliance",
    marketSlug: "service-alliance",
    status: "Live",
    description:
      "A 24/7 peer-support room where veterans talk to a Service Alliance Elector and, when appropriate, are warm-handed to a trained Peer Navigator Executor.",
    surfaces: 4,
    rituals: 2,
    owner: "Benefits Operator",
    updated: "Apr 2026",
  },
  {
    id: "x-sa-hiring-day",
    name: "Re-entry Hiring Day",
    emoji: "💼",
    market: "Service Alliance",
    marketSlug: "service-alliance",
    status: "Live",
    description:
      "A live hiring day across certified Service Alliance employers. Electors score match quality and 12-month retention risk for each candidate in real time.",
    surfaces: 3,
    rituals: 1,
    owner: "Re-entry Operator",
    updated: "Apr 2026",
  },
  {
    id: "x-clw-loving-manager",
    name: "Loving Manager Cohort",
    emoji: "💛",
    market: "Center for a Loving Workplace",
    marketSlug: "loving-workplace",
    status: "Live",
    description:
      "A twelve-week cohort experience pairing managers with an Elector that coaches on compassionate feedback. Resolutions authorize cohort stipends and certification credit.",
    surfaces: 6,
    rituals: 3,
    owner: "Education Operator",
    updated: "Apr 2026",
  },
  {
    id: "x-clw-certification-day",
    name: "Employer Certification Day",
    emoji: "🏅",
    market: "Center for a Loving Workplace",
    marketSlug: "loving-workplace",
    status: "Live",
    description:
      "An onsite experience that runs a CLW certification audit, an anonymous pulse, and a live closeout with the Certification Operator — everything signed into the CLW ledger.",
    surfaces: 3,
    rituals: 2,
    owner: "Certification Operator",
    updated: "Apr 2026",
  },
  {
    id: "x-sbx-boardwalk",
    name: "Venice Boardwalk Series",
    emoji: "🏖️",
    market: "Silicon Beach Exchange",
    marketSlug: "silicon-beach",
    status: "Live",
    description:
      "Six weeks of coordinated programming across four Venice venues — dawn meditations, AI-and-music twilight sets, Sunday beach cleanups — orchestrated by the Placemaking Operator.",
    surfaces: 4,
    rituals: 3,
    owner: "Placemaking Operator",
    updated: "Apr 2026",
  },
  {
    id: "x-sbx-tide-language",
    name: "Tide Language",
    emoji: "🌊",
    market: "Silicon Beach Exchange",
    marketSlug: "silicon-beach",
    status: "Draft",
    description:
      "An interactive installation at the Annenberg Community Beach House that lets visitors converse with an Elector configured to represent the tide. Pending Creator Fund passage.",
    surfaces: 2,
    rituals: 1,
    owner: "Creator Fund Operator",
    updated: "Apr 2026",
  },
];

export default function ExperiencesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Experiences</h1>
          <p className="text-muted mt-1">
            {experiences.length} experiences across Service Alliance, CLW, and Silicon Beach Exchange
          </p>
        </div>
        <button className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors">
          + New Experience
        </button>
      </div>

      <div className="bg-card/60 border border-card-border rounded-xl p-4 mb-6 flex items-start gap-3">
        <Icon icon="lucide:info" className="text-accent mt-0.5" width={18} height={18} />
        <div className="text-sm text-muted">
          An Experience is where Citizens meet Electors, and where Operators stage Proposals that come
          out of an Action Market. Every Experience is attached to one Market so the Kinship Codes
          flowing through it inherit the Market&rsquo;s scope.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((exp) => (
          <Link
            key={exp.id}
            href={`/markets/${exp.marketSlug}`}
            className="block bg-card border border-card-border rounded-xl p-5 hover:border-accent/40 transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{exp.emoji}</span>
                  <h3 className="text-white font-semibold text-lg">{exp.name}</h3>
                </div>
                <span
                  className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded uppercase ${
                    exp.status === "Live"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-badge-draft/20 text-badge-draft"
                  }`}
                >
                  {exp.status}
                </span>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-white/60 truncate max-w-[120px]">
                {exp.market}
              </span>
            </div>

            <p className="text-sm text-muted mb-4 line-clamp-3">{exp.description}</p>

            <div className="flex gap-4 mb-4">
              <div className="bg-white/[0.06] border border-card-border rounded-lg px-4 py-3 text-center flex-1">
                <div className="text-2xl font-bold text-white">{exp.surfaces}</div>
                <div className="text-xs text-white/50">Surfaces</div>
              </div>
              <div className="bg-white/[0.06] border border-card-border rounded-lg px-4 py-3 text-center flex-1">
                <div className="text-2xl font-bold text-white">{exp.rituals}</div>
                <div className="text-xs text-white/50">Rituals</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted/60">{exp.owner} · {exp.updated}</span>
              <span className="text-sm text-muted group-hover:text-accent transition-colors">
                Open &rarr;
              </span>
            </div>
          </Link>
        ))}

        <div className="border-2 border-dashed border-card-border rounded-xl p-5 flex flex-col items-center justify-center min-h-[200px] hover:border-accent/40 transition-colors cursor-pointer group">
          <div className="text-4xl text-muted group-hover:text-accent mb-2 transition-colors">+</div>
          <div className="text-muted group-hover:text-accent transition-colors font-medium">
            New Experience
          </div>
        </div>
      </div>
    </div>
  );
}
