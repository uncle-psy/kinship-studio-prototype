"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { FileDropzone } from "@/components/FileDropzone";
import { KBItemsList } from "@/components/KBItemsList";
import { AIGenerateSection } from "@/components/AIGenerateSection";
import { DriveLinksSection } from "@/components/DriveLinksSection";

interface KBItem {
  id: string;
  name: string;
  type: "file" | "ai-generated" | "drive-link";
  status: "pending" | "processing" | "ingested" | "failed";
  createdAt: string;
  url?: string;
  chunkCount?: number;
}

interface KBDetail {
  id: string;
  name: string;
  namespace: string;
  createdAt: string;
  itemCount: number;
  items: KBItem[];
}

export default function KnowledgeBaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const kbId = params.id as string;

  const [kb, setKB] = useState<KBDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "upload" | "drive" | "ai" | null
  >(null);

  const fetchKB = useCallback(async () => {
    try {
      const res = await fetch(`/api/knowledge/${kbId}`);
      if (res.ok) {
        const data = await res.json();
        setKB(data);
      } else if (res.status === 404) {
        router.push("/knowledge");
      }
    } catch (err) {
      console.error("Failed to fetch KB:", err);
    } finally {
      setLoading(false);
    }
  }, [kbId, router]);

  useEffect(() => {
    fetchKB();
  }, [fetchKB]);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this knowledge base? This will remove all documents and vectors permanently.")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/knowledge/${kbId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/knowledge");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <Icon
          icon="lucide:loader-2"
          width={40}
          height={40}
          className="mx-auto mb-3 text-muted animate-spin"
        />
        <p className="text-muted">Loading knowledge base...</p>
      </div>
    );
  }

  if (!kb) {
    return (
      <div className="text-center py-16">
        <p className="text-muted">Knowledge base not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-4">
        <button
          onClick={() => router.push("/knowledge")}
          className="hover:text-accent transition-colors"
        >
          Knowledge Bases
        </button>
        <Icon icon="lucide:chevron-right" width={14} height={14} />
        <span className="text-foreground">{kb.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">{kb.name}</h1>
          <p className="text-muted mt-1">
            {kb.items.length} item{kb.items.length !== 1 ? "s" : ""} &middot;
            Created {new Date(kb.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-card border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-red-300 font-medium px-4 py-2.5 rounded-full transition-colors flex items-center gap-2 text-sm"
        >
          {deleting ? (
            <Icon icon="lucide:loader-2" width={16} height={16} className="animate-spin" />
          ) : (
            <Icon icon="lucide:trash-2" width={16} height={16} />
          )}
          Delete Knowledge Base
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <button
          onClick={() =>
            setActiveSection(activeSection === "upload" ? null : "upload")
          }
          className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
            activeSection === "upload"
              ? "bg-accent/10 border-accent/50"
              : "bg-card border-card-border hover:border-accent/30"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              activeSection === "upload" ? "bg-accent/20" : "bg-white/[0.06]"
            }`}
          >
            <Icon
              icon="lucide:upload-cloud"
              width={20}
              height={20}
              className={
                activeSection === "upload" ? "text-accent" : "text-muted"
              }
            />
          </div>
          <div>
            <p className="text-foreground font-medium text-sm">Upload Files</p>
            <p className="text-xs text-muted">PDF, TXT, DOCX, MD</p>
          </div>
        </button>

        <button
          onClick={() =>
            setActiveSection(activeSection === "drive" ? null : "drive")
          }
          className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
            activeSection === "drive"
              ? "bg-accent/10 border-accent/50"
              : "bg-card border-card-border hover:border-accent/30"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              activeSection === "drive" ? "bg-accent/20" : "bg-white/[0.06]"
            }`}
          >
            <Icon
              icon="lucide:link"
              width={20}
              height={20}
              className={
                activeSection === "drive" ? "text-accent" : "text-muted"
              }
            />
          </div>
          <div>
            <p className="text-foreground font-medium text-sm">Google Drive</p>
            <p className="text-xs text-muted">Link folders & files</p>
          </div>
        </button>

        <button
          onClick={() =>
            setActiveSection(activeSection === "ai" ? null : "ai")
          }
          className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
            activeSection === "ai"
              ? "bg-accent/10 border-accent/50"
              : "bg-card border-card-border hover:border-accent/30"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              activeSection === "ai" ? "bg-accent/20" : "bg-white/[0.06]"
            }`}
          >
            <Icon
              icon="lucide:sparkles"
              width={20}
              height={20}
              className={
                activeSection === "ai" ? "text-accent" : "text-muted"
              }
            />
          </div>
          <div>
            <p className="text-foreground font-medium text-sm">
              Generate with AI
            </p>
            <p className="text-xs text-muted">Research & create content</p>
          </div>
        </button>
      </div>

      {/* Active Section Panel */}
      {activeSection && (
        <div className="bg-card border border-card-border rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">
              {activeSection === "upload" && "Upload Files"}
              {activeSection === "drive" && "Google Drive Link"}
              {activeSection === "ai" && "Generate with AI"}
            </h3>
            <button
              onClick={() => setActiveSection(null)}
              className="text-muted hover:text-white transition-colors"
            >
              <Icon icon="lucide:x" width={18} height={18} />
            </button>
          </div>

          {activeSection === "upload" && (
            <FileDropzone kbId={kbId} onUploadComplete={fetchKB} />
          )}
          {activeSection === "drive" && (
            <DriveLinksSection kbId={kbId} onLinkAdded={fetchKB} />
          )}
          {activeSection === "ai" && (
            <AIGenerateSection kbId={kbId} onGenerated={fetchKB} />
          )}
        </div>
      )}

      {/* Items List */}
      <div>
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Icon icon="lucide:files" width={20} height={20} className="text-muted" />
          Items
          {kb.items.length > 0 && (
            <span className="text-sm font-normal text-muted">
              ({kb.items.length})
            </span>
          )}
        </h3>
        <KBItemsList
          kbId={kbId}
          items={kb.items}
          onItemRemoved={fetchKB}
        />
      </div>
    </div>
  );
}
