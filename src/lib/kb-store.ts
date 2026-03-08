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

// --- Knowledge Base CRUD ---

export async function listKnowledgeBases(): Promise<KnowledgeBase[]> {
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

  kbs.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return kbs;
}

export async function getKnowledgeBase(
  id: string
): Promise<(KnowledgeBase & { items: KBItem[] }) | null> {
  const kv = getStore();
  const data = await kv.get<KnowledgeBase>(`kb:${id}`);
  if (!data) return null;

  const items = (await kv.get<KBItem[]>(`kb:${id}:items`)) || [];
  return { ...data, itemCount: items.length, items };
}

export async function createKnowledgeBase(
  name: string,
  namespace: string
): Promise<KnowledgeBase> {
  const kv = getStore();
  const kb: KnowledgeBase = {
    id: namespace,
    name,
    namespace,
    createdAt: new Date().toISOString(),
    itemCount: 0,
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
