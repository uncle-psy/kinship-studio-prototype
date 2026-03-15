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
    id: "proj_mapshifting",
    name: "Mapshifting",
    codeName: "mapshifting",
    description: "Interactive map-based exploration game",
    visibility: "private",
    owner: "Jordan Kim",
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date("2024-01-15").toISOString(),
    team: ["Jordan Kim", "Alex Chen"],
    status: "active",
  },
  {
    id: "proj_money-maker",
    name: "Money Maker",
    codeName: "money-maker",
    description: "Financial literacy through interactive gameplay",
    visibility: "private",
    owner: "Jordan Kim",
    createdAt: new Date("2026-03-01").toISOString(),
    updatedAt: new Date("2026-03-01").toISOString(),
    team: ["Jordan Kim"],
    status: "active",
  },
  {
    id: "proj_vets-visions",
    name: "Vet's Visions",
    codeName: "vets-visions",
    description: "Veteran wellness and storytelling platform",
    visibility: "private",
    owner: "Taylor Wong",
    createdAt: new Date("2026-03-01").toISOString(),
    updatedAt: new Date("2026-03-01").toISOString(),
    team: ["Taylor Wong"],
    status: "active",
  },
];

let seeded = false;

async function ensureSeeded() {
  if (seeded) return;
  const kv = getStore();
  const ids = await kv.smembers("project:list");
  if (ids.length === 0) {
    for (const proj of SEED_PROJECTS) {
      await kv.set(`project:${proj.id}`, proj);
      await kv.sadd("project:list", proj.id);
    }
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
