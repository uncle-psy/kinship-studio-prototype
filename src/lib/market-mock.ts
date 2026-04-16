// In-memory mock data for Objectives and Proposals under the seed Markets.
// The backing store for Markets is project-store.ts (KV-backed).
// Objectives and Proposals are UI-only for the prototype.

import type { Objective, Proposal } from "./types";

// ─── Objectives ──────────────────────────────────────────────────────────────

export const SEED_OBJECTIVES: Objective[] = [
  // Service Alliance ----------------------------------------------------------
  {
    id: "obj_sa-benefits",
    marketId: "mkt_service-alliance",
    name: "Benefits Navigation",
    slug: "benefits-navigation",
    description:
      "Improve the first-year outcome for separating service members by reducing time-to-claim, closing the mental-health hand-off gap, and increasing peer-led uptake of earned benefits.",
    icon: "🪖",
    status: "active",
    operatorName: "Benefits Operator",
    valueVector: [
      { id: "v1", label: "Veteran Outcomes", weight: 40, direction: "maximize" },
      { id: "v2", label: "Time-to-Claim (Days)", weight: 25, direction: "minimize" },
      { id: "v3", label: "Peer Engagement", weight: 20, direction: "maximize" },
      { id: "v4", label: "Program Cost", weight: 15, direction: "minimize" },
    ],
    resolutionWindowHours: 168,
    resolutionThreshold: 0.08,
    createdAt: "2026-01-12T10:00:00Z",
    updatedAt: "2026-04-11T09:30:00Z",
  },
  {
    id: "obj_sa-reentry",
    marketId: "mkt_service-alliance",
    name: "Career Re-entry",
    slug: "career-reentry",
    description:
      "Place veterans in mission-aligned roles with employers who have signed the Service Alliance commitment. Electors trade on match quality and 12-month retention, not placement count.",
    icon: "💼",
    status: "active",
    operatorName: "Re-entry Operator",
    valueVector: [
      { id: "v1", label: "12-mo Retention", weight: 45, direction: "maximize" },
      { id: "v2", label: "Match Quality", weight: 30, direction: "maximize" },
      { id: "v3", label: "Wage Lift", weight: 15, direction: "maximize" },
      { id: "v4", label: "Time-to-Place", weight: 10, direction: "minimize" },
    ],
    resolutionWindowHours: 336,
    resolutionThreshold: 0.1,
    createdAt: "2026-02-03T14:00:00Z",
    updatedAt: "2026-04-09T16:00:00Z",
  },
  {
    id: "obj_sa-peer",
    marketId: "mkt_service-alliance",
    name: "Peer Support Network",
    slug: "peer-support",
    description:
      "Stand up a moderated peer support network across VSO chapters, indexed by MOS and service era, with crisis-escalation guardrails built into every conversation.",
    icon: "🤝",
    status: "draft",
    operatorName: "Peer Support Operator",
    valueVector: [
      { id: "v1", label: "Crisis Resolution", weight: 50, direction: "maximize" },
      { id: "v2", label: "Active Peers", weight: 25, direction: "maximize" },
      { id: "v3", label: "Trust Score", weight: 25, direction: "maximize" },
    ],
    resolutionWindowHours: 120,
    resolutionThreshold: 0.09,
    createdAt: "2026-03-10T09:00:00Z",
    updatedAt: "2026-04-02T11:00:00Z",
  },

  // Center for a Loving Workplace --------------------------------------------
  {
    id: "obj_clw-curriculum",
    marketId: "mkt_loving-workplace",
    name: "Curriculum & Education",
    slug: "curriculum-education",
    description:
      "Design and publish the Loving Workplace curriculum across manager, executive, and practitioner tracks. Electors weigh pedagogical rigor, accessibility, and employer adoption.",
    icon: "📚",
    status: "active",
    operatorName: "Education Operator",
    valueVector: [
      { id: "v1", label: "Learning Outcomes", weight: 35, direction: "maximize" },
      { id: "v2", label: "Accessibility", weight: 25, direction: "maximize" },
      { id: "v3", label: "Employer Adoption", weight: 25, direction: "maximize" },
      { id: "v4", label: "Production Cost", weight: 15, direction: "minimize" },
    ],
    resolutionWindowHours: 240,
    resolutionThreshold: 0.07,
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-04-13T14:00:00Z",
  },
  {
    id: "obj_clw-research",
    marketId: "mkt_loving-workplace",
    name: "Research Amplification",
    slug: "research-amplification",
    description:
      "Curate and amplify peer-reviewed research on heart-centered workplace practices. Resolutions authorize grant disbursements, podcast placements, and conference programming.",
    icon: "🔬",
    status: "active",
    operatorName: "Research Operator",
    valueVector: [
      { id: "v1", label: "Methodological Rigor", weight: 40, direction: "maximize" },
      { id: "v2", label: "Practitioner Reach", weight: 30, direction: "maximize" },
      { id: "v3", label: "Replication Support", weight: 20, direction: "maximize" },
      { id: "v4", label: "Grant Efficiency", weight: 10, direction: "maximize" },
    ],
    resolutionWindowHours: 336,
    resolutionThreshold: 0.08,
    createdAt: "2026-02-14T10:00:00Z",
    updatedAt: "2026-04-10T16:00:00Z",
  },
  {
    id: "obj_clw-certification",
    marketId: "mkt_loving-workplace",
    name: "Employer Certification",
    slug: "employer-certification",
    description:
      "Operate the Loving Workplace employer certification — standards, audits, and renewal. Each certification decision is a Proposal that releases an Executor bundle for onsite review.",
    icon: "🏅",
    status: "active",
    operatorName: "Certification Operator",
    valueVector: [
      { id: "v1", label: "Employee Wellbeing", weight: 45, direction: "maximize" },
      { id: "v2", label: "Operational Fit", weight: 25, direction: "maximize" },
      { id: "v3", label: "Audit Integrity", weight: 20, direction: "maximize" },
      { id: "v4", label: "Time-to-Audit", weight: 10, direction: "minimize" },
    ],
    resolutionWindowHours: 168,
    resolutionThreshold: 0.1,
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-04-14T09:00:00Z",
  },

  // Silicon Beach Exchange ---------------------------------------------------
  {
    id: "obj_sbx-placemaking",
    marketId: "mkt_silicon-beach",
    name: "Placemaking",
    slug: "placemaking",
    description:
      "Activate coastal venues — studios, theaters, galleries — through coordinated programming. Electors trade on cultural coherence, resident wellbeing, and ecological footprint together.",
    icon: "🏖️",
    status: "active",
    operatorName: "Placemaking Operator",
    valueVector: [
      { id: "v1", label: "Cultural Coherence", weight: 30, direction: "maximize" },
      { id: "v2", label: "Resident Wellbeing", weight: 30, direction: "maximize" },
      { id: "v3", label: "Ecological Footprint", weight: 20, direction: "minimize" },
      { id: "v4", label: "Venue Revenue", weight: 20, direction: "maximize" },
    ],
    resolutionWindowHours: 168,
    resolutionThreshold: 0.08,
    createdAt: "2026-01-28T10:00:00Z",
    updatedAt: "2026-04-12T10:00:00Z",
  },
  {
    id: "obj_sbx-creator-fund",
    marketId: "mkt_silicon-beach",
    name: "Creator Fund",
    slug: "creator-fund",
    description:
      "Deploy SBX treasury into resident creators whose work embodies complementary consciousness. Proposals bind a grant amount, a milestone schedule, and the Executor that will disburse it.",
    icon: "🎨",
    status: "active",
    operatorName: "Creator Fund Operator",
    valueVector: [
      { id: "v1", label: "Artistic Ambition", weight: 30, direction: "maximize" },
      { id: "v2", label: "Community Resonance", weight: 30, direction: "maximize" },
      { id: "v3", label: "Completion Risk", weight: 20, direction: "minimize" },
      { id: "v4", label: "Economic Multiplier", weight: 20, direction: "maximize" },
    ],
    resolutionWindowHours: 240,
    resolutionThreshold: 0.09,
    createdAt: "2026-02-18T10:00:00Z",
    updatedAt: "2026-04-11T17:30:00Z",
  },
  {
    id: "obj_sbx-coastline",
    marketId: "mkt_silicon-beach",
    name: "Coastline Stewardship",
    slug: "coastline-stewardship",
    description:
      "An Objective whose Electors include agents representing the coastline itself — tide, dune, kelp, pelican — trading alongside human Citizens on proposals that touch the shore.",
    icon: "🌅",
    status: "draft",
    operatorName: "Coastline Operator",
    valueVector: [
      { id: "v1", label: "Biodiversity", weight: 40, direction: "maximize" },
      { id: "v2", label: "Access Equity", weight: 25, direction: "maximize" },
      { id: "v3", label: "Storm Resilience", weight: 20, direction: "maximize" },
      { id: "v4", label: "Steward Hours", weight: 15, direction: "maximize" },
    ],
    resolutionWindowHours: 336,
    resolutionThreshold: 0.1,
    createdAt: "2026-03-20T10:00:00Z",
    updatedAt: "2026-04-08T10:00:00Z",
  },
];

// ─── Proposals ──────────────────────────────────────────────────────────────

export const SEED_PROPOSALS: Proposal[] = [
  // Service Alliance · Benefits Navigation
  {
    id: "prop_sa-benefits-1",
    objectiveId: "obj_sa-benefits",
    marketId: "mkt_service-alliance",
    title: "Pilot Peer-Navigator cohort across 4 VSO chapters",
    summary:
      "Authorize a 90-day pilot placing a trained Peer Navigator Executor in four VSO chapters (Fort Bragg, San Diego, Cleveland, Bozeman). Success condition: median time-to-first-claim drops by ≥ 20%.",
    authoredBy: "Rick Gage (Operator)",
    status: "open",
    opensAt: "2026-04-10T09:00:00Z",
    closesAt: "2026-04-17T09:00:00Z",
    passPrice: 0.71,
    failPrice: 0.29,
    volumePass: 48250,
    volumeFail: 19600,
    budgetUsd: 120000,
    executors: [
      { name: "Peer Navigator Executor", architect: "Service Alliance / Architects", scope: "VSO chapter onboarding, benefits intake, warm-transfer to VA" },
      { name: "Stipend Disbursement Executor", architect: "Treasury Ops", scope: "Payout to chapters via Stripe + compliance logging" },
    ],
    createdAt: "2026-04-10T09:00:00Z",
    updatedAt: "2026-04-16T08:00:00Z",
  },
  {
    id: "prop_sa-benefits-2",
    objectiveId: "obj_sa-benefits",
    marketId: "mkt_service-alliance",
    title: "Auto-route mental-health intake to VA Community Care when local wait > 14 days",
    summary:
      "Resolution would authorize an orchestration Executor to monitor VA clinic wait times and automatically re-route mental-health intakes to a vetted Community Care provider when the local wait exceeds 14 days.",
    authoredBy: "Benefits Operator",
    status: "passed",
    opensAt: "2026-03-18T09:00:00Z",
    closesAt: "2026-03-25T09:00:00Z",
    passPrice: 0.82,
    failPrice: 0.18,
    volumePass: 71200,
    volumeFail: 14800,
    budgetUsd: 45000,
    executors: [
      { name: "Wait-Time Orchestrator", architect: "Clinical Ops", scope: "VA API polling, provider directory, routing rules" },
      { name: "Referral Letter Executor", architect: "Clinical Ops", scope: "Generate, sign, and file referrals" },
    ],
    createdAt: "2026-03-18T09:00:00Z",
    updatedAt: "2026-03-26T10:00:00Z",
  },
  // Service Alliance · Career Re-entry
  {
    id: "prop_sa-reentry-1",
    objectiveId: "obj_sa-reentry",
    marketId: "mkt_service-alliance",
    title: "Certify 12 Tier-1 defense primes for Service Alliance employer commitment",
    summary:
      "Authorize the Certification Executor to audit and onboard 12 Tier-1 defense primes under the Service Alliance employer commitment (mentor match, 12-month retention targets, transparent reporting).",
    authoredBy: "Re-entry Operator",
    status: "open",
    opensAt: "2026-04-08T09:00:00Z",
    closesAt: "2026-04-22T09:00:00Z",
    passPrice: 0.56,
    failPrice: 0.44,
    volumePass: 32000,
    volumeFail: 28400,
    budgetUsd: 180000,
    executors: [
      { name: "Employer Certification Executor", architect: "Service Alliance", scope: "Employer audit, commitment signing, annual review" },
    ],
    createdAt: "2026-04-08T09:00:00Z",
    updatedAt: "2026-04-15T18:00:00Z",
  },
  // Service Alliance · Peer Support (draft)
  {
    id: "prop_sa-peer-1",
    objectiveId: "obj_sa-peer",
    marketId: "mkt_service-alliance",
    title: "Draft: Launch MOS-indexed peer matching with crisis-escalation guardrails",
    summary:
      "Stand up a moderated peer support network indexed by MOS and service era. Every conversation carries a crisis-escalation guardrail that can hand off to a licensed clinician within 60 seconds.",
    authoredBy: "Peer Support Operator",
    status: "draft",
    opensAt: "2026-04-20T09:00:00Z",
    closesAt: "2026-04-25T09:00:00Z",
    passPrice: 0,
    failPrice: 0,
    volumePass: 0,
    volumeFail: 0,
    budgetUsd: 65000,
    executors: [
      { name: "Peer Matching Executor", architect: "Peer Ops", scope: "Matching algorithm, consent workflow, conversation logging" },
      { name: "Crisis Escalation Executor", architect: "Clinical Ops", scope: "Risk detection, clinician paging, follow-up protocol" },
    ],
    createdAt: "2026-04-14T10:00:00Z",
    updatedAt: "2026-04-16T09:00:00Z",
  },

  // CLW · Curriculum & Education
  {
    id: "prop_clw-curriculum-1",
    objectiveId: "obj_clw-curriculum",
    marketId: "mkt_loving-workplace",
    title: "Publish the Loving Manager track (Modules 1–4) under CC-BY-SA",
    summary:
      "Release the first four modules of the Loving Manager track under CC-BY-SA, translated into Spanish and Portuguese. Executor bundle includes a captioning Executor and a translation QA Executor.",
    authoredBy: "Education Operator",
    status: "open",
    opensAt: "2026-04-09T09:00:00Z",
    closesAt: "2026-04-19T09:00:00Z",
    passPrice: 0.78,
    failPrice: 0.22,
    volumePass: 61400,
    volumeFail: 17400,
    budgetUsd: 62000,
    executors: [
      { name: "Captioning Executor", architect: "Media Ops", scope: "Whisper + human QA, WCAG captions" },
      { name: "Translation QA Executor", architect: "CLW Research", scope: "Human review of es + pt-BR translations" },
      { name: "Publish Executor", architect: "Platform Ops", scope: "Push to lovingworkplace.org and LMS partners" },
    ],
    createdAt: "2026-04-09T09:00:00Z",
    updatedAt: "2026-04-15T12:00:00Z",
  },
  {
    id: "prop_clw-curriculum-2",
    objectiveId: "obj_clw-curriculum",
    marketId: "mkt_loving-workplace",
    title: "Retire Module 07 (\"Tough Love\") and sunset its certification credit",
    summary:
      "Module 07 fails current standards on trauma-informed pedagogy. Resolution authorizes the Education Executor to sunset the module, migrate learners to the replacement track, and adjust certification credit.",
    authoredBy: "Education Operator",
    status: "failed",
    opensAt: "2026-03-22T09:00:00Z",
    closesAt: "2026-03-29T09:00:00Z",
    passPrice: 0.41,
    failPrice: 0.59,
    volumePass: 22100,
    volumeFail: 31500,
    budgetUsd: 18000,
    executors: [
      { name: "LMS Migration Executor", architect: "Platform Ops", scope: "Learner migration, transcript rewrite" },
    ],
    createdAt: "2026-03-22T09:00:00Z",
    updatedAt: "2026-03-30T09:00:00Z",
  },
  // CLW · Research
  {
    id: "prop_clw-research-1",
    objectiveId: "obj_clw-research",
    marketId: "mkt_loving-workplace",
    title: "Fund $250k replication of Whitaker et al. on compassionate feedback",
    summary:
      "Authorize a $250k grant to a pre-registered replication of Whitaker et al. (2024) on compassionate feedback in knowledge-worker teams, executed by the Grants Executor and bound to a public pre-registration.",
    authoredBy: "Research Operator",
    status: "deployed",
    opensAt: "2026-02-19T09:00:00Z",
    closesAt: "2026-02-26T09:00:00Z",
    passPrice: 0.74,
    failPrice: 0.26,
    volumePass: 58300,
    volumeFail: 20400,
    budgetUsd: 250000,
    executors: [
      { name: "Grants Executor", architect: "Treasury Ops", scope: "Milestone-based disbursement, receipt capture" },
      { name: "Pre-registration Executor", architect: "Research Ops", scope: "OSF pre-reg, data-sharing plan" },
    ],
    createdAt: "2026-02-19T09:00:00Z",
    updatedAt: "2026-04-02T14:00:00Z",
  },
  // CLW · Certification
  {
    id: "prop_clw-certification-1",
    objectiveId: "obj_clw-certification",
    marketId: "mkt_loving-workplace",
    title: "Renew certification for Cascade Retail (2,400 employees) for 2026–27",
    summary:
      "Renew Cascade Retail's Loving Workplace certification for 2026–27. Executor bundle includes an onsite audit, an anonymous employee pulse, and a remediation plan generator if scores fall short.",
    authoredBy: "Certification Operator",
    status: "resolving",
    opensAt: "2026-04-12T09:00:00Z",
    closesAt: "2026-04-19T09:00:00Z",
    passPrice: 0.63,
    failPrice: 0.37,
    volumePass: 27400,
    volumeFail: 16100,
    budgetUsd: 42000,
    executors: [
      { name: "Onsite Audit Executor", architect: "Certification Ops", scope: "Interview protocol, observation notes, photo evidence" },
      { name: "Employee Pulse Executor", architect: "Research Ops", scope: "Anonymous survey, statistical QA" },
    ],
    createdAt: "2026-04-12T09:00:00Z",
    updatedAt: "2026-04-16T06:00:00Z",
  },

  // Silicon Beach · Placemaking
  {
    id: "prop_sbx-place-1",
    objectiveId: "obj_sbx-placemaking",
    marketId: "mkt_silicon-beach",
    title: "Activate Venice Boardwalk for 6-week Complementary Consciousness series",
    summary:
      "Deploy a six-week coordinated programming series — dawn meditations, twilight AI-and-music sets, Sunday beach cleanups — across four Venice venues. Executor orchestrates venue contracts, talent payout, and city permits.",
    authoredBy: "Placemaking Operator",
    status: "open",
    opensAt: "2026-04-11T09:00:00Z",
    closesAt: "2026-04-18T09:00:00Z",
    passPrice: 0.69,
    failPrice: 0.31,
    volumePass: 41200,
    volumeFail: 18800,
    budgetUsd: 96000,
    executors: [
      { name: "Venue Contract Executor", architect: "SBX Ops", scope: "Negotiate, sign, and pay venue contracts within budget envelope" },
      { name: "Talent Payout Executor", architect: "Treasury Ops", scope: "Payout artists, collect W-9/1099, post receipts on-chain" },
      { name: "Permit Executor", architect: "Civic Ops", scope: "File special-event permits with City of LA" },
    ],
    createdAt: "2026-04-11T09:00:00Z",
    updatedAt: "2026-04-16T09:00:00Z",
  },
  // Silicon Beach · Creator Fund
  {
    id: "prop_sbx-creator-1",
    objectiveId: "obj_sbx-creator-fund",
    marketId: "mkt_silicon-beach",
    title: "Grant $60k to Mira Okafor for \"Tide Language\" installation at the Annenberg",
    summary:
      "Disburse $60k to Mira Okafor for an interactive installation that lets visitors converse with an Elector configured to represent the tide, sited at the Annenberg Community Beach House for summer 2026.",
    authoredBy: "Creator Fund Operator",
    status: "passed",
    opensAt: "2026-04-03T09:00:00Z",
    closesAt: "2026-04-10T09:00:00Z",
    passPrice: 0.77,
    failPrice: 0.23,
    volumePass: 39600,
    volumeFail: 11800,
    budgetUsd: 60000,
    executors: [
      { name: "Milestone Grant Executor", architect: "Treasury Ops", scope: "Phased disbursement against milestone sign-off" },
      { name: "Residency Executor", architect: "SBX Ops", scope: "Venue coordination, opening night, docent training" },
    ],
    createdAt: "2026-04-03T09:00:00Z",
    updatedAt: "2026-04-11T09:00:00Z",
  },
  // Silicon Beach · Coastline (draft)
  {
    id: "prop_sbx-coast-1",
    objectiveId: "obj_sbx-coastline",
    marketId: "mkt_silicon-beach",
    title: "Draft: Seat Kelp and Pelican Electors on all coastline proposals",
    summary:
      "Formally seat Electors representing kelp forest and brown pelican populations on every Proposal that touches the shore. Electors are configured by the Coastline Operator using ecological monitoring data.",
    authoredBy: "Coastline Operator",
    status: "draft",
    opensAt: "2026-05-01T09:00:00Z",
    closesAt: "2026-05-08T09:00:00Z",
    passPrice: 0,
    failPrice: 0,
    volumePass: 0,
    volumeFail: 0,
    budgetUsd: 24000,
    executors: [
      { name: "Ecological Data Executor", architect: "Coastal Research", scope: "Ingests tide, water quality, and species-count feeds into the Elector config" },
    ],
    createdAt: "2026-04-14T10:00:00Z",
    updatedAt: "2026-04-16T09:00:00Z",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

export function objectivesForMarket(marketId: string): Objective[] {
  return SEED_OBJECTIVES.filter((o) => o.marketId === marketId);
}

export function proposalsForObjective(objectiveId: string): Proposal[] {
  return SEED_PROPOSALS.filter((p) => p.objectiveId === objectiveId);
}

export function proposalsForMarket(marketId: string): Proposal[] {
  return SEED_PROPOSALS.filter((p) => p.marketId === marketId);
}

export function getObjective(id: string): Objective | undefined {
  return SEED_OBJECTIVES.find((o) => o.id === id);
}

export function getProposal(id: string): Proposal | undefined {
  return SEED_PROPOSALS.find((p) => p.id === id);
}

export const PROPOSAL_STATUS_STYLES: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  draft: { label: "Draft", color: "#eb8000", bg: "rgba(235,128,0,0.15)" },
  open: { label: "Open · Trading", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  resolving: { label: "Resolving", color: "#06b6d4", bg: "rgba(6,182,212,0.15)" },
  passed: { label: "Passed", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  failed: { label: "Failed", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  deployed: { label: "Deployed", color: "#a855f7", bg: "rgba(168,85,247,0.18)" },
};

export const OBJECTIVE_STATUS_STYLES: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  draft: { label: "Draft", color: "#eb8000", bg: "rgba(235,128,0,0.15)" },
  active: { label: "Active", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  paused: { label: "Paused", color: "#9ca3af", bg: "rgba(156,163,175,0.15)" },
  closed: { label: "Closed", color: "#6b7280", bg: "rgba(107,114,128,0.15)" },
};
