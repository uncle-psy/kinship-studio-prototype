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

export interface Prompt {
  id: string;
  name: string;
  content: string;
  tone?: string;
  persona?: string;
  audience?: string;
  format?: string;
  goal?: string;
  connectedKBId?: string;
  connectedKBName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PresenceSignal {
  signalId: string;
  name: string;
  letter: string;
  color: string;
  value: number; // 0–100
}

export interface Presence {
  id: string;
  name: string;
  briefDescription: string;  // seed from creation
  description: string;       // AI-generated / edited full description
  backstory: string;         // AI-generated / edited backstory
  assetId?: string;
  assetName?: string;
  knowledgeBaseIds: string[];
  knowledgeBaseNames: string[];
  promptId?: string;
  promptName?: string;
  signals: PresenceSignal[];
  createdAt: string;
  updatedAt: string;
}

export interface PineconeVector {
  id: string;
  values: number[];
  metadata?: Record<string, string | number | boolean | string[]>;
}
