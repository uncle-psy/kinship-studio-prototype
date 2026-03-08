export interface KnowledgeBase {
  id: string;
  name: string;
  namespace: string;
  createdAt: string;
  itemCount: number;
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

export interface PineconeVector {
  id: string;
  values: number[];
  metadata?: Record<string, string | number | boolean | string[]>;
}
