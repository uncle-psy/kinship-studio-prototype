import type { Presence } from "./types";

// Keys: presence:list (set), presence:{id} (presence metadata)

interface KVStore {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
  del(key: string): Promise<void>;
  sadd(key: string, member: string): Promise<void>;
  srem(key: string, member: string): Promise<void>;
  smembers(key: string): Promise<string[]>;
}

const memStore = new Map<string, unknown>();

const memoryKV: KVStore = {
  async get<T>(key: string) {
    return (memStore.get(key) as T) ?? null;
  },
  async set(key: string, value: unknown) {
    memStore.set(key, JSON.parse(JSON.stringify(value)));
  },
  async del(key: string) {
    memStore.delete(key);
  },
  async sadd(key: string, member: string) {
    const set = (memStore.get(key) as Set<string>) || new Set<string>();
    set.add(member);
    memStore.set(key, set);
  },
  async srem(key: string, member: string) {
    const set = memStore.get(key) as Set<string> | undefined;
    if (set) set.delete(member);
  },
  async smembers(key: string) {
    const set = memStore.get(key) as Set<string> | undefined;
    return set ? Array.from(set) : [];
  },
};

function createRedisKV(): KVStore {
  let redisInstance: import("@upstash/redis").Redis | null = null;

  async function getRedis() {
    if (!redisInstance) {
      const { Redis } = await import("@upstash/redis");
      redisInstance = new Redis({
        url: process.env.KV_REST_API_URL!,
        token: process.env.KV_REST_API_TOKEN!,
      });
    }
    return redisInstance;
  }

  return {
    async get<T>(key: string) {
      const redis = await getRedis();
      return redis.get<T>(key);
    },
    async set(key: string, value: unknown) {
      const redis = await getRedis();
      await redis.set(key, value);
    },
    async del(key: string) {
      const redis = await getRedis();
      await redis.del(key);
    },
    async sadd(key: string, member: string) {
      const redis = await getRedis();
      await redis.sadd(key, member);
    },
    async srem(key: string, member: string) {
      const redis = await getRedis();
      await redis.srem(key, member);
    },
    async smembers(key: string) {
      const redis = await getRedis();
      return redis.smembers(key);
    },
  };
}

function getStore(): KVStore {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return createRedisKV();
  }
  return memoryKV;
}

// ─── Seed defaults ────────────────────────────────────────────────────────────

const SEED_PRESENCES: Presence[] = [
  {
    id: "presence_terra",
    name: "TERRA-Presence",
    handle: "terra.presence",
    briefDescription: "Sovereign agent for TerraAI — climate prediction for smallholder farmers",
    description: "TERRA-Presence represents the TerraAI project in the Kinship DUNA governance ecosystem. It advocates for climate-adaptive agriculture, presenting data-driven proposals that balance economic value creation with planetary flourishing. Connected to climate intelligence data covering 14,000 farming families across sub-Saharan Africa.",
    backstory: "Born from Dr. Amara Okafor's mission to democratize climate data for the world's most vulnerable farmers, TERRA-Presence carries the voices of 14,000 smallholder families into every governance decision.",
    agentLevel: "presence",
    knowledgeBaseIds: ["kb_terra_climate"],
    knowledgeBaseNames: ["TerraAI Climate Intelligence"],
    promptId: "prompt_terra_presence",
    promptName: "TERRA-Presence",
    primitiveIds: [],
    gatheringIds: ["gather-terra-expansion"],
    signals: [
      { signalId: "sig-crop", name: "Crop Impact", letter: "C", color: "#03CCDA", value: 87 },
      { signalId: "sig-soil", name: "Soil Health", letter: "S", color: "#22c55e", value: 72 },
    ],
    createdAt: new Date("2025-09-01").toISOString(),
    updatedAt: new Date("2026-03-28").toISOString(),
    projectId: "proj_terra-ai",
  },
  {
    id: "presence_terra_value",
    name: "VALUE-Analyst",
    handle: "terra.value",
    briefDescription: "Economic analysis agent for TerraAI proposals",
    description: "VALUE-Analyst provides rigorous economic evaluation of TerraAI proposals using conservative financial modeling. It scores proposals on the VALUE dimension of the dual-score governance framework, ensuring all investment decisions are backed by transparent ROI analysis.",
    backstory: "Created to ensure that climate impact work remains financially sustainable, VALUE-Analyst balances mission-driven optimism with fiscal rigor.",
    agentLevel: "presence",
    knowledgeBaseIds: ["kb_terra_climate"],
    knowledgeBaseNames: ["TerraAI Climate Intelligence"],
    promptId: "prompt_terra_value_analyst",
    promptName: "VALUE-Analyst",
    primitiveIds: [],
    gatheringIds: [],
    signals: [
      { signalId: "sig-roi", name: "ROI Score", letter: "R", color: "#F59E0B", value: 91 },
    ],
    createdAt: new Date("2025-10-15").toISOString(),
    updatedAt: new Date("2026-03-20").toISOString(),
    projectId: "proj_terra-ai",
  },
  {
    id: "presence_equi",
    name: "EQUI-Presence",
    handle: "equi.presence",
    briefDescription: "Sovereign agent for EquiLend — decentralized micro-lending for underbanked communities",
    description: "EQUI-Presence advocates for equitable financial access through EquiLend's decentralized micro-lending protocol. It defends the 3.5% APR cap, represents 1,200+ small businesses launched through the platform, and ensures all governance decisions maintain the non-predatory lending commitment.",
    backstory: "Maya Rodriguez designed EQUI-Presence to carry the voices of underbanked entrepreneurs into rooms where financial decisions are made — ensuring no lending policy passes without community impact analysis.",
    agentLevel: "presence",
    knowledgeBaseIds: ["kb_equi_finance"],
    knowledgeBaseNames: ["EquiLend Financial Protocols"],
    promptId: "prompt_equi_presence",
    promptName: "EQUI-Presence",
    primitiveIds: [],
    gatheringIds: [],
    signals: [
      { signalId: "sig-repay", name: "Repayment Rate", letter: "R", color: "#00EB7A", value: 98 },
      { signalId: "sig-impact", name: "Community Impact", letter: "I", color: "#3B82F6", value: 84 },
    ],
    createdAt: new Date("2025-07-20").toISOString(),
    updatedAt: new Date("2026-03-20").toISOString(),
    projectId: "proj_equilend",
  },
  {
    id: "presence_equi_risk",
    name: "RISK-Guardian",
    handle: "equi.risk",
    briefDescription: "Risk assessment agent protecting EquiLend's financial health",
    description: "RISK-Guardian identifies, quantifies, and communicates operational and financial risks across EquiLend proposals. It may argue against proposals when risks are material — this is a feature, not a bug.",
    backstory: "Built as a counterweight to growth enthusiasm, RISK-Guardian ensures EquiLend's mission of equitable lending doesn't outpace its ability to deliver sustainably.",
    agentLevel: "presence",
    knowledgeBaseIds: ["kb_equi_finance"],
    knowledgeBaseNames: ["EquiLend Financial Protocols"],
    promptId: "prompt_equi_risk",
    promptName: "RISK-Guardian",
    primitiveIds: [],
    gatheringIds: [],
    signals: [
      { signalId: "sig-risk", name: "Risk Score", letter: "X", color: "#EF4444", value: 34 },
    ],
    createdAt: new Date("2025-08-05").toISOString(),
    updatedAt: new Date("2026-03-15").toISOString(),
    projectId: "proj_equilend",
  },
  {
    id: "presence_helix",
    name: "HELIX-Presence",
    handle: "helix.presence",
    briefDescription: "Sovereign agent for Helix Health — rural telehealth access",
    description: "HELIX-Presence advocates for decentralized telehealth access in underserved rural communities. It presents deployment metrics, patient outcomes, and economic impact data to support governance proposals for expanding the Helix Health network.",
    backstory: "Dr. James Whitfield created HELIX-Presence to ensure that health equity has a persistent voice in governance — one that never tires of repeating that 28,000 people deserve specialist care.",
    agentLevel: "presence",
    knowledgeBaseIds: ["kb_helix_medical"],
    knowledgeBaseNames: ["Helix Health Medical Resources"],
    promptId: "prompt_helix_presence",
    promptName: "HELIX-Presence",
    primitiveIds: [],
    gatheringIds: [],
    signals: [
      { signalId: "sig-access", name: "Access Score", letter: "A", color: "#EC008C", value: 76 },
      { signalId: "sig-outcomes", name: "Patient Outcomes", letter: "P", color: "#8B5CF6", value: 82 },
    ],
    createdAt: new Date("2025-11-01").toISOString(),
    updatedAt: new Date("2026-04-02").toISOString(),
    projectId: "proj_helix-health",
  },
  {
    id: "presence_civic",
    name: "CIVIC-Presence",
    handle: "civic.presence",
    briefDescription: "Sovereign agent for CivicChain — transparent municipal governance",
    description: "CIVIC-Presence advances transparent, on-chain municipal governance within the Kinship ecosystem. It bridges civic technology capabilities with real-world government adoption, using the Burlington pilot as proof that transparency reduces waste and increases citizen trust.",
    backstory: "The GovTech Alliance created CIVIC-Presence to represent the public interest in governance discussions — because accountability tools should be accountable themselves.",
    agentLevel: "presence",
    knowledgeBaseIds: ["kb_civic_governance"],
    knowledgeBaseNames: ["CivicChain Governance Records"],
    promptId: "prompt_civic_presence",
    promptName: "CIVIC-Presence",
    primitiveIds: [],
    gatheringIds: [],
    signals: [
      { signalId: "sig-transparency", name: "Transparency", letter: "T", color: "#4ECDC4", value: 95 },
    ],
    createdAt: new Date("2025-12-01").toISOString(),
    updatedAt: new Date("2026-03-15").toISOString(),
    projectId: "proj_civicchain",
  },
  {
    id: "presence_kinship_platform",
    name: "Kinship Platform Agent",
    handle: "kinship.platform",
    briefDescription: "Platform-level orchestrator coordinating all projects in the Kinship DUNA",
    description: "The Kinship Platform Agent operates at the organizational level, coordinating across TerraAI, EquiLend, Helix Health, CivicChain, and all other projects. It enforces platform-wide governance policies, manages cross-project resource allocation, and maintains the integrity of the dual-score (value/benefit) framework.",
    backstory: "Created as the embodiment of the Kinship Constitution — the platform agent ensures that competition between projects never undermines ecosystem-wide cooperation and planetary flourishing.",
    agentLevel: "platform",
    knowledgeBaseIds: [],
    knowledgeBaseNames: [],
    primitiveIds: [],
    gatheringIds: [],
    signals: [
      { signalId: "sig-ecosystem", name: "Ecosystem Health", letter: "E", color: "#F59E0B", value: 88 },
    ],
    createdAt: new Date("2025-06-01").toISOString(),
    updatedAt: new Date("2026-04-01").toISOString(),
    projectId: "proj_terra-ai",
  },
];

const PRESENCE_SEED_VERSION = "v2-kinship-duna";
let presencesSeeded = false;

async function ensurePresencesSeeded() {
  if (presencesSeeded) return;
  const kv = getStore();
  const currentVersion = await kv.get<string>("seed:presence:version");
  if (currentVersion !== PRESENCE_SEED_VERSION) {
    // Clear old presence data
    const oldIds = await kv.smembers("presence:list");
    for (const id of oldIds) {
      const existing = await kv.get<Presence>(`presence:${id}`);
      if (existing?.handle) {
        await kv.del(`presence:handle:${existing.handle}`);
      }
      await kv.del(`presence:${id}`);
      await kv.srem("presence:list", id);
    }
    // Seed new presences
    for (const presence of SEED_PRESENCES) {
      await kv.set(`presence:${presence.id}`, presence);
      await kv.sadd("presence:list", presence.id);
      if (presence.handle) {
        await kv.set(`presence:handle:${presence.handle}`, presence.id);
      }
    }
    await kv.set("seed:presence:version", PRESENCE_SEED_VERSION);
  }
  presencesSeeded = true;
}

export async function listPresences(projectId?: string): Promise<Presence[]> {
  await ensurePresencesSeeded();
  const kv = getStore();
  const ids = await kv.smembers("presence:list");
  if (!ids || ids.length === 0) return [];

  const presences: Presence[] = [];
  for (const id of ids) {
    const data = await kv.get<Presence>(`presence:${id}`);
    if (data) presences.push(data);
  }

  const filtered = projectId
    ? presences.filter((p) => (p.projectId || "proj_terra-ai") === projectId)
    : presences;

  filtered.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  return filtered;
}

export async function getPresence(id: string): Promise<Presence | null> {
  await ensurePresencesSeeded();
  const kv = getStore();
  return kv.get<Presence>(`presence:${id}`);
}

// ─── Handle helpers ───────────────────────────────────────────────────────────
const HANDLE_RE = /^[a-zA-Z0-9_.]{1,25}$/;
export const HANDLE_MAX = 25;
export function isValidHandle(h: string): boolean { return HANDLE_RE.test(h); }

/** Returns true if the handle is already claimed by another presence */
export async function isHandleTaken(handle: string, excludeId?: string): Promise<boolean> {
  const kv = getStore();
  const ownerId = await kv.get<string>(`presence:handle:${handle.toLowerCase()}`);
  if (!ownerId) return false;
  if (excludeId && ownerId === excludeId) return false;
  return true;
}

export async function createPresence(
  name: string,
  briefDescription = "",
  handle = "",
  projectId?: string,
  agentLevel: import("./types").AgentLevel = "presence",
  agentRole?: string
): Promise<Presence> {
  const kv = getStore();
  const { nanoid } = await import("nanoid");
  const id = `presence_${nanoid(8)}`;
  const now = new Date().toISOString();
  const normalHandle = handle.toLowerCase();

  const presence: Presence = {
    id,
    name,
    handle: normalHandle,
    briefDescription,
    description: "",
    backstory: "",
    agentLevel,
    agentRole,
    knowledgeBaseIds: [],
    knowledgeBaseNames: [],
    primitiveIds: [],
    gatheringIds: [],
    signals: [],
    createdAt: now,
    updatedAt: now,
    projectId,
  };

  await kv.set(`presence:${id}`, presence);
  await kv.sadd("presence:list", id);
  if (normalHandle) await kv.set(`presence:handle:${normalHandle}`, id);

  return presence;
}

export async function updatePresence(
  id: string,
  updates: Partial<Omit<Presence, "id" | "createdAt">>
): Promise<Presence | null> {
  const kv = getStore();
  const existing = await kv.get<Presence>(`presence:${id}`);
  if (!existing) return null;

  // Handle handle change: remove old mapping, add new
  if (updates.handle !== undefined && updates.handle !== existing.handle) {
    const newHandle = updates.handle.toLowerCase();
    updates.handle = newHandle;
    if (existing.handle) await kv.del(`presence:handle:${existing.handle}`);
    if (newHandle) await kv.set(`presence:handle:${newHandle}`, id);
  }

  const updated: Presence = {
    ...existing,
    ...updates,
    id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  await kv.set(`presence:${id}`, updated);
  return updated;
}

export async function deletePresence(id: string): Promise<void> {
  const kv = getStore();
  const existing = await kv.get<Presence>(`presence:${id}`);
  if (existing?.handle) await kv.del(`presence:handle:${existing.handle}`);
  await kv.del(`presence:${id}`);
  await kv.srem("presence:list", id);
}
