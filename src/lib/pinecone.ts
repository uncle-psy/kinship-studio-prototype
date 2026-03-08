import type { PineconeVector } from "./types";

const host = () => process.env.PINECONE_INDEX_HOST!;
const headers = () => ({
  "Content-Type": "application/json",
  "Api-Key": process.env.PINECONE_API_KEY!,
});

export async function pineconeUpsert(
  namespace: string,
  vectors: PineconeVector[]
) {
  const res = await fetch(`${host()}/vectors/upsert`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ vectors, namespace }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pinecone upsert failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function pineconeQuery(
  namespace: string,
  vector: number[],
  topK: number,
  filter?: Record<string, unknown>
) {
  const body: Record<string, unknown> = {
    vector,
    topK,
    includeMetadata: true,
    namespace,
  };
  if (filter) body.filter = filter;

  const res = await fetch(`${host()}/query`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Pinecone query failed: ${res.status}`);
  const data = await res.json();
  return data.matches || [];
}

export async function pineconeFetch(ids: string[], namespace?: string) {
  const params = new URLSearchParams();
  ids.forEach((id) => params.append("ids", id));
  if (namespace) params.set("namespace", namespace);

  const res = await fetch(`${host()}/vectors/fetch?${params}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`Pinecone fetch failed: ${res.status}`);
  return res.json();
}

export async function pineconeDelete(options: {
  ids?: string[];
  deleteAll?: boolean;
  namespace?: string;
  filter?: Record<string, unknown>;
}) {
  const body: Record<string, unknown> = {};
  if (options.ids) body.ids = options.ids;
  if (options.deleteAll) body.deleteAll = true;
  if (options.namespace) body.namespace = options.namespace;
  if (options.filter) body.filter = options.filter;

  const res = await fetch(`${host()}/vectors/delete`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Pinecone delete failed: ${res.status}`);
  return res.json();
}

export async function pineconeListIds(
  namespace?: string,
  prefix?: string
): Promise<string[]> {
  const params = new URLSearchParams();
  if (namespace) params.set("namespace", namespace);
  if (prefix) params.set("prefix", prefix);

  const res = await fetch(`${host()}/vectors/list?${params}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`Pinecone list failed: ${res.status}`);
  const data = await res.json();
  return (data.vectors || []).map(
    (v: { id: string }) => v.id
  );
}
