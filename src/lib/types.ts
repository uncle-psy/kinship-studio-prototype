export interface KnowledgeBase {
  id: string;
  name: string;
  namespace: string;
  createdAt: string;
  itemCount: number;
  projectId?: string;
}

export interface KBItem {
  id: string;
  name: string;
  type: "file" | "ai-generated" | "drive-link";
  status: "pending" | "processing" | "ingested" | "failed";
  createdAt: string;
  mimeType?: string;
  url?: string;
  chunkCount?: number;
}

export interface Prompt {
  id: string;
  name: string;
  content: string;
  tone?: string;
  persona?: string;
  audience?: string;
  format?: string;
  goal?: string;
  connectedKBId?: string;
  connectedKBName?: string;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
}

export interface PresenceSignal {
  signalId: string;
  name: string;
  letter: string;
  color: string;
  value: number; // 0–100
}

export interface Presence {
  id: string;
  name: string;
  handle: string;            // unique, letters/numbers/underscore/period, max 25
  briefDescription: string;  // seed from creation
  description: string;       // AI-generated / edited full description
  backstory: string;         // AI-generated / edited backstory
  agentLevel: AgentLevel;    // presence | project | platform
  agentRole?: string;        // worker role/specialization, if applicable
  assetId?: string;
  assetName?: string;
  knowledgeBaseIds: string[];
  knowledgeBaseNames: string[];
  promptId?: string;
  promptName?: string;
  primitiveIds?: string[];   // which primitives are enabled for this agent
  gatheringIds?: string[];   // which gatherings this agent participates in
  signals: PresenceSignal[];
  createdAt: string;
  updatedAt: string;
  projectId?: string;
}

export type ProjectVisibility = "secret" | "private" | "pending" | "public";
export type ProjectStatus = "active" | "archived";

// The Project interface is the on-disk record for a Kinship Action Market.
// We keep the field name "Project" in the store for backwards compatibility,
// but the UI surfaces it as "Market" (the KAM top-level container).
export interface Project {
  id: string;
  name: string;
  codeName: string;          // handle used in URLs, e.g. "service-alliance"
  description: string;
  visibility: ProjectVisibility;
  owner: string;             // Sponsor name
  createdAt: string;
  updatedAt: string;
  team: string[];            // Sponsors, Operators, stewards
  status: ProjectStatus;
  icon?: string;             // emoji or icon label shown in cards
  accent?: string;           // hex accent color
  sponsorMode?: "sponsor-funded" | "citizen-funded" | "membership" | "virtual";
  ledger?: "solana" | "database";
}

// Alias — the Studio surfaces Projects as Markets everywhere in the UI.
export type Market = Project;
export type MarketVisibility = ProjectVisibility;
export type MarketStatus = ProjectStatus;

// ── Objective ────────────────────────────────────────────────────────────────
// An Objective is a scoped area of activity inside a Market:
// a campaign, a program line, a fund, a working group. Each Objective
// carries its own value vector (the dimensions the Electors optimize).
export type ObjectiveStatus = "draft" | "active" | "paused" | "closed";

export interface ValueDimension {
  id: string;
  label: string;              // e.g. "Veteran Outcomes"
  weight: number;             // 0–100 — share of the objective vector
  direction?: "maximize" | "minimize";
}

export interface Objective {
  id: string;
  marketId: string;           // parent Market
  name: string;
  slug: string;
  description: string;
  icon?: string;
  status: ObjectiveStatus;
  operatorName?: string;      // Operator agent running the objective
  valueVector: ValueDimension[];
  resolutionWindowHours: number;
  resolutionThreshold: number; // TWAP margin required to pass
  createdAt: string;
  updatedAt: string;
}

// ── Proposal ────────────────────────────────────────────────────────────────
// A Proposal is a specific decision under an Objective. When the Pass
// conditional market clears, the resolution authorizes the Executor bundle.
export type ProposalStatus = "draft" | "open" | "resolving" | "passed" | "failed" | "deployed";

export interface ExecutorBinding {
  name: string;
  architect: string;
  scope: string;              // what tools/actions this Executor gets
}

export interface Proposal {
  id: string;
  objectiveId: string;
  marketId: string;
  title: string;
  summary: string;
  authoredBy: string;         // Sponsor or delegated Operator
  status: ProposalStatus;
  opensAt: string;
  closesAt: string;
  passPrice: number;          // last TWAP on the Pass branch (0–1)
  failPrice: number;          // last TWAP on the Fail branch (0–1)
  volumePass: number;
  volumeFail: number;
  budgetUsd?: number;
  executors: ExecutorBinding[];
  createdAt: string;
  updatedAt: string;
}

// ── Agent Topology ────────────────────────────────────────────────────────────
// The three nested agent levels from the Kinship architecture.
// Presence = personal (single user), Project = team, Platform = organization.
export type AgentLevel = "presence" | "project" | "platform";

// Primitives are the building blocks creators compose into agents.
// Organized by the Clarity process: Inform, Instruct, Empower, Align.
export type PrimitiveCategory = "inform" | "instruct" | "empower" | "align";
export type PrimitiveTier = 1 | 2 | 3 | 4;

export interface Primitive {
  id: string;
  name: string;
  category: PrimitiveCategory;
  tier: PrimitiveTier;
  icon: string;
  description: string;
  enabled: boolean;
  configured: boolean;
  configSummary?: string; // e.g. "3 KBs connected", "Telegram + Google"
}

// ── Gathering ────────────────────────────────────────────────────────────────
// A Gathering is a bounded interaction context where agents and users meet.
export type GatheringStatus = "draft" | "active" | "paused" | "completed";

export interface GatheringParticipant {
  id: string;
  name: string;
  role: "host" | "participant" | "observer";
  type: "agent" | "human";
}

export interface ApprovalRule {
  id: string;
  trigger: string;       // e.g. "financial transaction", "publish content"
  threshold: string;     // e.g. "always", "> $100", "confidence < 0.7"
  approver: string;      // e.g. "creator", "project admin"
}

export interface Gathering {
  id: string;
  name: string;
  purpose: string;
  status: GatheringStatus;
  agentIds: string[];
  participantCount: number;
  participants: GatheringParticipant[];
  vibeIds: string[];
  approvalRules: ApprovalRule[];
  createdAt: string;
  projectId?: string;
}

export interface PineconeVector {
  id: string;
  values: number[];
  metadata?: Record<string, string | number | boolean | string[]>;
}
