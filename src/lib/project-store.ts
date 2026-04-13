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
    id: "proj_terra-ai",
    name: "TerraAI",
    codeName: "terra-ai",
    description: "Predictive AI for climate-adaptive agriculture — reducing crop losses for smallholder farmers while building regenerative food systems",
    visibility: "public",
    owner: "Dr. Amara Okafor",
    createdAt: new Date("2025-06-15").toISOString(),
    updatedAt: new Date("2026-03-28").toISOString(),
    team: ["Dr. Amara Okafor", "Kofi Mensah", "Lina Voss"],
    status: "active",
  },
  {
    id: "proj_equilend",
    name: "EquiLend",
    codeName: "equilend",
    description: "Decentralized micro-lending protocol providing fair-rate loans to underbanked communities with on-chain transparency and community governance",
    visibility: "public",
    owner: "Maya Rodriguez",
    createdAt: new Date("2025-04-01").toISOString(),
    updatedAt: new Date("2026-03-20").toISOString(),
    team: ["Maya Rodriguez", "Daniel Osei", "Priya Patel"],
    status: "active",
  },
  {
    id: "proj_helix-health",
    name: "Helix Health",
    codeName: "helix-health",
    description: "Decentralized telehealth network pairing AI diagnostics with human physicians to bring specialist care to underserved rural communities",
    visibility: "public",
    owner: "Dr. James Whitfield",
    createdAt: new Date("2025-08-10").toISOString(),
    updatedAt: new Date("2026-04-02").toISOString(),
    team: ["Dr. James Whitfield", "Sarah Chen", "Marcus Rivera"],
    status: "active",
  },
  {
    id: "proj_civicchain",
    name: "CivicChain",
    codeName: "civicchain",
    description: "On-chain transparent budgeting and governance tooling for municipalities — making every public dollar trackable and every decision auditable",
    visibility: "public",
    owner: "GovTech Alliance",
    createdAt: new Date("2025-09-01").toISOString(),
    updatedAt: new Date("2026-03-15").toISOString(),
    team: ["GovTech Alliance", "Elena Vasquez", "Tom Briggs"],
    status: "active",
  },
];

const SEED_VERSION = "v2-kinship-duna";
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
  const id = `proj_${nanoid(8)}`;
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
