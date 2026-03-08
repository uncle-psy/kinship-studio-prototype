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

export async function listPresences(): Promise<Presence[]> {
  const kv = getStore();
  const ids = await kv.smembers("presence:list");
  if (!ids || ids.length === 0) return [];

  const presences: Presence[] = [];
  for (const id of ids) {
    const data = await kv.get<Presence>(`presence:${id}`);
    if (data) presences.push(data);
  }

  presences.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  return presences;
}

export async function getPresence(id: string): Promise<Presence | null> {
  const kv = getStore();
  return kv.get<Presence>(`presence:${id}`);
}

export async function createPresence(name: string): Promise<Presence> {
  const kv = getStore();
  const { nanoid } = await import("nanoid");
  const id = `presence_${nanoid(8)}`;
  const now = new Date().toISOString();

  const presence: Presence = {
    id,
    name,
    physicalDescription: "",
    knowledgeBaseIds: [],
    knowledgeBaseNames: [],
    signals: [],
    createdAt: now,
    updatedAt: now,
  };

  await kv.set(`presence:${id}`, presence);
  await kv.sadd("presence:list", id);

  return presence;
}

export async function updatePresence(
  id: string,
  updates: Partial<Omit<Presence, "id" | "createdAt">>
): Promise<Presence | null> {
  const kv = getStore();
  const existing = await kv.get<Presence>(`presence:${id}`);
  if (!existing) return null;

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
  await kv.del(`presence:${id}`);
  await kv.srem("presence:list", id);
}
