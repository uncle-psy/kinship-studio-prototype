import type { Prompt } from "./types";

// Reuses the same KV abstraction as kb-store.ts
// Keys: prompt:list (set), prompt:{id} (prompt metadata)

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

export async function listPrompts(): Promise<Prompt[]> {
  const kv = getStore();
  const ids = await kv.smembers("prompt:list");
  if (!ids || ids.length === 0) return [];

  const prompts: Prompt[] = [];
  for (const id of ids) {
    const data = await kv.get<Prompt>(`prompt:${id}`);
    if (data) prompts.push(data);
  }

  prompts.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  return prompts;
}

export async function getPrompt(id: string): Promise<Prompt | null> {
  const kv = getStore();
  return kv.get<Prompt>(`prompt:${id}`);
}

export async function createPrompt(name: string): Promise<Prompt> {
  const kv = getStore();
  const { nanoid } = await import("nanoid");
  const id = `prompt_${nanoid(8)}`;
  const now = new Date().toISOString();

  const prompt: Prompt = {
    id,
    name,
    content: "",
    createdAt: now,
    updatedAt: now,
  };

  await kv.set(`prompt:${id}`, prompt);
  await kv.sadd("prompt:list", id);

  return prompt;
}

export async function updatePrompt(
  id: string,
  updates: Partial<Omit<Prompt, "id" | "createdAt">>
): Promise<Prompt | null> {
  const kv = getStore();
  const existing = await kv.get<Prompt>(`prompt:${id}`);
  if (!existing) return null;

  const updated: Prompt = {
    ...existing,
    ...updates,
    id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  await kv.set(`prompt:${id}`, updated);
  return updated;
}

export async function deletePrompt(id: string): Promise<void> {
  const kv = getStore();
  await kv.del(`prompt:${id}`);
  await kv.srem("prompt:list", id);
}
