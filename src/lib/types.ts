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

export interface Project {
  id: string;
  name: string;
  codeName: string;
  description: string;
  visibility: ProjectVisibility;
  owner: string;
  createdAt: string;
  updatedAt: string;
  team: string[];
  status: ProjectStatus;
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
