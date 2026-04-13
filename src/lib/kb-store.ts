import type { KnowledgeBase, KBItem } from "./types";

// --- Storage abstraction ---
// Uses Upstash Redis when KV_REST_API_URL is set, otherwise falls back to
// an in-memory store (fine for local dev; data resets on server restart)

interface KVStore {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
  del(key: string): Promise<void>;
  sadd(key: string, member: string): Promise<void>;
  srem(key: string, member: string): Promise<void>;
  smembers(key: string): Promise<string[]>;
}

// --- In-memory fallback store ---
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

// --- Upstash Redis store ---
function createRedisKV(): KVStore {
  // Dynamic import to avoid errors when @upstash/redis isn't configured
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

const SEED_KBS: { kb: KnowledgeBase; items: KBItem[] }[] = [
  {
    kb: {
      id: "kb_terra_climate",
      name: "TerraAI Climate Intelligence",
      namespace: "kb_terra_climate",
      createdAt: new Date("2025-09-15").toISOString(),
      itemCount: 5,
      projectId: "proj_terra-ai",
    },
    items: [
      { id: "ti1", name: "Sub-Saharan Crop Yield Dataset 2024-2026.csv", type: "file", status: "ingested", createdAt: new Date("2025-09-15").toISOString(), chunkCount: 342 },
      { id: "ti2", name: "Satellite Imagery Analysis Protocols.pdf", type: "file", status: "ingested", createdAt: new Date("2025-10-01").toISOString(), chunkCount: 87 },
      { id: "ti3", name: "Soil Health Restoration Metrics — 2,400 Hectares.md", type: "file", status: "ingested", createdAt: new Date("2025-11-20").toISOString(), chunkCount: 56 },
      { id: "ti4", name: "Farmer Advisory Templates & Regional Guides", type: "ai-generated", status: "ingested", createdAt: new Date("2026-01-10").toISOString(), chunkCount: 124 },
      { id: "ti5", name: "SE Asia Expansion — Vietnam, Cambodia, Myanmar Research", type: "ai-generated", status: "ingested", createdAt: new Date("2026-03-01").toISOString(), chunkCount: 203 },
    ],
  },
  {
    kb: {
      id: "kb_equi_finance",
      name: "EquiLend Financial Protocols",
      namespace: "kb_equi_finance",
      createdAt: new Date("2025-07-25").toISOString(),
      itemCount: 4,
      projectId: "proj_equilend",
    },
    items: [
      { id: "ei1", name: "Lending Criteria & APR Cap Enforcement Rules.pdf", type: "file", status: "ingested", createdAt: new Date("2025-07-25").toISOString(), chunkCount: 64 },
      { id: "ei2", name: "Community Fund Governance Charter.md", type: "file", status: "ingested", createdAt: new Date("2025-08-10").toISOString(), chunkCount: 38 },
      { id: "ei3", name: "Repayment Analytics — $2.4M Portfolio Performance", type: "ai-generated", status: "ingested", createdAt: new Date("2025-12-01").toISOString(), chunkCount: 156 },
      { id: "ei4", name: "Regulatory Compliance — Multi-Jurisdiction Framework.pdf", type: "file", status: "ingested", createdAt: new Date("2026-02-15").toISOString(), chunkCount: 92 },
    ],
  },
  {
    kb: {
      id: "kb_helix_medical",
      name: "Helix Health Medical Resources",
      namespace: "kb_helix_medical",
      createdAt: new Date("2025-11-10").toISOString(),
      itemCount: 5,
      projectId: "proj_helix-health",
    },
    items: [
      { id: "hi1", name: "Telehealth Node Deployment Playbook.pdf", type: "file", status: "ingested", createdAt: new Date("2025-11-10").toISOString(), chunkCount: 78 },
      { id: "hi2", name: "Appalachian Rural Health Statistics 2020-2026.csv", type: "file", status: "ingested", createdAt: new Date("2025-11-15").toISOString(), chunkCount: 215 },
      { id: "hi3", name: "AI Diagnostic Accuracy Reports — Dermatology & Cardiology", type: "file", status: "ingested", createdAt: new Date("2026-01-05").toISOString(), chunkCount: 134 },
      { id: "hi4", name: "Patient Outcome Tracking — 28,000 Residents", type: "ai-generated", status: "ingested", createdAt: new Date("2026-02-20").toISOString(), chunkCount: 189 },
      { id: "hi5", name: "Insurance Reimbursement Models & Revenue Projections", type: "ai-generated", status: "ingested", createdAt: new Date("2026-03-10").toISOString(), chunkCount: 67 },
    ],
  },
  {
    kb: {
      id: "kb_civic_governance",
      name: "CivicChain Governance Records",
      namespace: "kb_civic_governance",
      createdAt: new Date("2025-12-05").toISOString(),
      itemCount: 4,
      projectId: "proj_civicchain",
    },
    items: [
      { id: "ci1", name: "Burlington Transparent Budgeting Pilot — Full Report.pdf", type: "file", status: "ingested", createdAt: new Date("2025-12-05").toISOString(), chunkCount: 98 },
      { id: "ci2", name: "Municipal Waste Reduction Analysis (22% Improvement).md", type: "file", status: "ingested", createdAt: new Date("2026-01-20").toISOString(), chunkCount: 45 },
      { id: "ci3", name: "Citizen Engagement Metrics & Survey Data", type: "ai-generated", status: "ingested", createdAt: new Date("2026-02-10").toISOString(), chunkCount: 112 },
      { id: "ci4", name: "On-Chain Budget Tracking — Smart Contract Specifications", type: "file", status: "ingested", createdAt: new Date("2026-03-01").toISOString(), chunkCount: 73 },
    ],
  },
];

const KB_SEED_VERSION = "v2-kinship-duna";
let kbsSeeded = false;

async function ensureKBsSeeded() {
  if (kbsSeeded) return;
  const kv = getStore();
  const currentVersion = await kv.get<string>("seed:kb:version");
  if (currentVersion !== KB_SEED_VERSION) {
    // Clear old KB data
    const oldIds = await kv.smembers("kb:list");
    for (const id of oldIds) {
      await kv.del(`kb:${id}`);
      await kv.del(`kb:${id}:items`);
      await kv.srem("kb:list", id);
    }
    // Seed new KBs
    for (const { kb, items } of SEED_KBS) {
      await kv.set(`kb:${kb.id}`, kb);
      await kv.set(`kb:${kb.id}:items`, items);
      await kv.sadd("kb:list", kb.id);
    }
    await kv.set("seed:kb:version", KB_SEED_VERSION);
  }
  kbsSeeded = true;
}

// --- Knowledge Base CRUD ---

export async function listKnowledgeBases(projectId?: string): Promise<KnowledgeBase[]> {
  await ensureKBsSeeded();
  const kv = getStore();
  const ids = await kv.smembers("kb:list");
  if (!ids || ids.length === 0) return [];

  const kbs: KnowledgeBase[] = [];
  for (const id of ids) {
    const data = await kv.get<KnowledgeBase>(`kb:${id}`);
    if (data) {
      const items = await kv.get<KBItem[]>(`kb:${id}:items`);
      kbs.push({ ...data, itemCount: items?.length || 0 });
    }
  }

  const filtered = projectId
    ? kbs.filter((kb) => (kb.projectId || "proj_terra-ai") === projectId)
    : kbs;

  filtered.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return filtered;
}

export async function getKnowledgeBase(
  id: string
): Promise<(KnowledgeBase & { items: KBItem[] }) | null> {
  await ensureKBsSeeded();
  const kv = getStore();
  const data = await kv.get<KnowledgeBase>(`kb:${id}`);
  if (!data) return null;

  const items = (await kv.get<KBItem[]>(`kb:${id}:items`)) || [];
  return { ...data, itemCount: items.length, items };
}

export async function createKnowledgeBase(
  name: string,
  namespace: string,
  projectId?: string
): Promise<KnowledgeBase> {
  const kv = getStore();
  const kb: KnowledgeBase = {
    id: namespace,
    name,
    namespace,
    createdAt: new Date().toISOString(),
    itemCount: 0,
    projectId,
  };

  await kv.set(`kb:${namespace}`, kb);
  await kv.set(`kb:${namespace}:items`, []);
  await kv.sadd("kb:list", namespace);

  return kb;
}

export async function deleteKnowledgeBase(id: string): Promise<void> {
  const kv = getStore();
  await kv.del(`kb:${id}`);
  await kv.del(`kb:${id}:items`);
  await kv.srem("kb:list", id);
}

export async function updateKnowledgeBaseName(
  id: string,
  name: string
): Promise<void> {
  const kv = getStore();
  const data = await kv.get<KnowledgeBase>(`kb:${id}`);
  if (data) {
    await kv.set(`kb:${id}`, { ...data, name });
  }
}

// --- Items within a Knowledge Base ---

export async function getItems(kbId: string): Promise<KBItem[]> {
  const kv = getStore();
  return (await kv.get<KBItem[]>(`kb:${kbId}:items`)) || [];
}

export async function addItem(kbId: string, item: KBItem): Promise<void> {
  const kv = getStore();
  const items = (await kv.get<KBItem[]>(`kb:${kbId}:items`)) || [];
  items.push(item);
  await kv.set(`kb:${kbId}:items`, items);
}

export async function removeItem(
  kbId: string,
  itemId: string
): Promise<KBItem | null> {
  const kv = getStore();
  const items = (await kv.get<KBItem[]>(`kb:${kbId}:items`)) || [];
  const index = items.findIndex((i) => i.id === itemId);
  if (index === -1) return null;

  const [removed] = items.splice(index, 1);
  await kv.set(`kb:${kbId}:items`, items);
  return removed;
}

export async function updateItemStatus(
  kbId: string,
  itemId: string,
  status: KBItem["status"],
  chunkCount?: number
): Promise<void> {
  const kv = getStore();
  const items = (await kv.get<KBItem[]>(`kb:${kbId}:items`)) || [];
  const item = items.find((i) => i.id === itemId);
  if (item) {
    item.status = status;
    if (chunkCount !== undefined) item.chunkCount = chunkCount;
    await kv.set(`kb:${kbId}:items`, items);
  }
}
