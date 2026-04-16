import type { Project, ProjectVisibility, ProjectStatus } from "./types";

// Keys: project:list (set), project:{id} (project metadata)

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

const SEED_PROJECTS: Project[] = [
  {
    id: "mkt_service-alliance",
    name: "Service Alliance",
    codeName: "service-alliance",
    description:
      "Closing the gap between those who served and the systems built to support them. Sponsors Operators that coordinate benefits, peer support, and career re-entry across VSOs, the VA, state agencies, and mission-aligned employers.",
    visibility: "public",
    owner: "Service Alliance Sponsor",
    createdAt: new Date("2025-11-04").toISOString(),
    updatedAt: new Date("2026-04-12").toISOString(),
    team: ["Service Alliance Sponsor", "Rick Gage (Operator)", "VSO Partner Council"],
    status: "active",
    icon: "🎖️",
    accent: "#eb8000",
    sponsorMode: "sponsor-funded",
    ledger: "database",
  },
  {
    id: "mkt_loving-workplace",
    name: "Center for a Loving Workplace",
    codeName: "loving-workplace",
    description:
      "Creates, curates, and amplifies research and education for a global, heart-centered community. Operators publish proposals on curriculum, employer certification, and published research; Electors price the tradeoffs against CLW's value vector.",
    visibility: "public",
    owner: "Center for a Loving Workplace",
    createdAt: new Date("2025-09-22").toISOString(),
    updatedAt: new Date("2026-04-14").toISOString(),
    team: ["CLW Sponsor Council", "Research Operator", "Education Operator"],
    status: "active",
    icon: "💛",
    accent: "#f59e0b",
    sponsorMode: "membership",
    ledger: "database",
  },
  {
    id: "mkt_silicon-beach",
    name: "Silicon Beach Exchange",
    codeName: "silicon-beach",
    description:
      "Connects and elevates the people, places, and experiences of the coast through AI agents grounded in complementary consciousness. Citizens configure Electors that trade on a values mix spanning culture, commerce, and community wellbeing.",
    visibility: "public",
    owner: "Silicon Beach Exchange",
    createdAt: new Date("2025-10-10").toISOString(),
    updatedAt: new Date("2026-04-15").toISOString(),
    team: ["SBX Sponsor", "Coastal Operator", "Complementary-Consciousness Council"],
    status: "active",
    icon: "🌊",
    accent: "#06b6d4",
    sponsorMode: "citizen-funded",
    ledger: "solana",
  },
];

const SEED_VERSION = "v3-kinship-action-markets";
let seeded = false;

async function ensureSeeded() {
  if (seeded) return;
  const kv = getStore();
  const currentVersion = await kv.get<string>("seed:project:version");
  if (currentVersion !== SEED_VERSION) {
    // Clear old project data
    const oldIds = await kv.smembers("project:list");
    for (const id of oldIds) {
      await kv.del(`project:${id}`);
      await kv.srem("project:list", id);
    }
    // Seed new projects
    for (const proj of SEED_PROJECTS) {
      await kv.set(`project:${proj.id}`, proj);
      await kv.sadd("project:list", proj.id);
    }
    await kv.set("seed:project:version", SEED_VERSION);
  }
  seeded = true;
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export async function listProjects(): Promise<Project[]> {
  await ensureSeeded();
  const kv = getStore();
  const ids = await kv.smembers("project:list");
  if (!ids || ids.length === 0) return [];

  const projects: Project[] = [];
  for (const id of ids) {
    const data = await kv.get<Project>(`project:${id}`);
    if (data) projects.push(data);
  }

  projects.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  return projects;
}

export async function getProject(id: string): Promise<Project | null> {
  await ensureSeeded();
  const kv = getStore();
  return kv.get<Project>(`project:${id}`);
}

export async function createProject(data: {
  name: string;
  codeName?: string;
  description?: string;
  owner?: string;
  team?: string[];
  visibility?: ProjectVisibility;
}): Promise<Project> {
  const kv = getStore();
  const { nanoid } = await import("nanoid");
  const id = `mkt_${nanoid(8)}`;
  const now = new Date().toISOString();
  const codeName =
    data.codeName?.trim() ||
    data.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const teamMembers =
    data.team && data.team.length > 0 ? data.team : [data.owner || "Unknown"];

  const project: Project = {
    id,
    name: data.name.trim(),
    codeName,
    description: data.description?.trim() || "",
    visibility: data.visibility || "private",
    owner: data.owner || teamMembers[0],
    createdAt: now,
    updatedAt: now,
    team: teamMembers,
    status: "active",
    icon: "📈",
    sponsorMode: "sponsor-funded",
    ledger: "database",
  };

  await kv.set(`project:${id}`, project);
  await kv.sadd("project:list", id);
  return project;
}

export async function updateProject(
  id: string,
  updates: Partial<Pick<Project, "name" | "codeName" | "description" | "visibility" | "owner" | "team" | "status">>
): Promise<Project | null> {
  const kv = getStore();
  const existing = await kv.get<Project>(`project:${id}`);
  if (!existing) return null;

  const updated: Project = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await kv.set(`project:${id}`, updated);
  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  const kv = getStore();
  const existing = await kv.get<Project>(`project:${id}`);
  if (!existing) return false;

  await kv.del(`project:${id}`);
  await kv.srem("project:list", id);
  return true;
}
