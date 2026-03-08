"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Icon } from "@iconify/react";

interface Prompt {
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

interface KnowledgeBase {
  id: string;
  name: string;
}

const TONES = ["", "Professional", "Casual", "Empathetic", "Direct", "Playful", "Authoritative", "Friendly", "Neutral"];
const PERSONAS = ["", "Assistant", "Mentor", "Expert", "Character", "Narrator", "Teacher", "Coach", "Game Master"];
const AUDIENCES = ["", "General", "Technical", "Non-technical", "Children", "Students", "Professionals", "Developers", "Players"];
const FORMATS = ["", "Paragraph", "Bullet points", "Step-by-step", "Dialogue", "Structured", "Free-form"];

export default function PromptDetailPage() {
  const router = useRouter();
  const params = useParams();
  const promptId = params.id as string;

  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Editor fields (local state, synced on save)
  const [name, setName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [content, setContent] = useState("");
  const [tone, setTone] = useState("");
  const [persona, setPersona] = useState("");
  const [audience, setAudience] = useState("");
  const [format, setFormat] = useState("");
  const [goal, setGoal] = useState("");
  const [connectedKBId, setConnectedKBId] = useState("");
  const [connectedKBName, setConnectedKBName] = useState("");

  // KB list for the selector
  const [kbs, setKbs] = useState<KnowledgeBase[]>([]);

  // Panel state
  const [activePanel, setActivePanel] = useState<"guidance" | "ai" | "import" | null>(null);

  // AI panel state
  const [aiInstructions, setAiInstructions] = useState("");
  const [aiMode, setAiMode] = useState<"generate" | "refine">("generate");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Import panel state
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPrompt = useCallback(async () => {
    try {
      const res = await fetch(`/api/prompts/${promptId}`);
      if (res.ok) {
        const data: Prompt = await res.json();
        setPrompt(data);
        setName(data.name);
        setContent(data.content || "");
        setTone(data.tone || "");
        setPersona(data.persona || "");
        setAudience(data.audience || "");
        setFormat(data.format || "");
        setGoal(data.goal || "");
        setConnectedKBId(data.connectedKBId || "");
        setConnectedKBName(data.connectedKBName || "");
      } else if (res.status === 404) {
        router.push("/prompts");
      }
    } catch (err) {
      console.error("Failed to fetch prompt:", err);
    } finally {
      setLoading(false);
    }
  }, [promptId, router]);

  const fetchKBs = useCallback(async () => {
    try {
      const res = await fetch("/api/knowledge");
      if (res.ok) {
        const data = await res.json();
        setKbs(data.knowledgeBases || []);
      }
    } catch (err) {
      console.error("Failed to fetch KBs:", err);
    }
  }, []);

  useEffect(() => {
    fetchPrompt();
    fetchKBs();
  }, [fetchPrompt, fetchKBs]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/prompts/${promptId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          tone: tone || undefined,
          persona: persona || undefined,
          audience: audience || undefined,
          format: format || undefined,
          goal: goal || undefined,
          connectedKBId: connectedKBId || undefined,
          connectedKBName: connectedKBName || undefined,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPrompt(updated);
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveName() {
    if (!name.trim() || name.trim() === prompt?.name) {
      setEditingName(false);
      setName(prompt?.name || "");
      return;
    }
    try {
      const res = await fetch(`/api/prompts/${promptId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPrompt(updated);
        setName(updated.name);
      }
    } catch (err) {
      console.error("Name save failed:", err);
    } finally {
      setEditingName(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this prompt? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/prompts/${promptId}`, { method: "DELETE" });
      if (res.ok) router.push("/prompts");
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  }

  async function handleAIGenerate() {
    if (!aiInstructions.trim()) return;
    setAiLoading(true);
    setAiError("");

    // Auto-save settings first
    await fetch(`/api/prompts/${promptId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tone: tone || undefined,
        persona: persona || undefined,
        audience: audience || undefined,
        format: format || undefined,
        goal: goal || undefined,
        connectedKBId: connectedKBId || undefined,
        connectedKBName: connectedKBName || undefined,
        content,
      }),
    });

    try {
      const res = await fetch(`/api/prompts/${promptId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructions: aiInstructions, mode: aiMode }),
      });
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
        setPrompt(data.prompt);
        setLastSaved(new Date());
        setAiInstructions("");
      } else {
        const data = await res.json();
        setAiError(data.error || "Generation failed");
      }
    } catch (err) {
      console.error("AI generate failed:", err);
      setAiError("Something went wrong");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleFileImport(file: File) {
    setImportLoading(true);
    setImportError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`/api/prompts/${promptId}/import`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
        setActivePanel(null);
      } else {
        const data = await res.json();
        setImportError(data.error || "Import failed");
      }
    } catch (err) {
      console.error("Import failed:", err);
      setImportError("Something went wrong");
    } finally {
      setImportLoading(false);
    }
  }

  function handleKBSelect(kbId: string) {
    const kb = kbs.find((k) => k.id === kbId);
    setConnectedKBId(kbId);
    setConnectedKBName(kb?.name || "");
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <Icon icon="lucide:loader-2" width={40} height={40} className="mx-auto mb-3 text-muted animate-spin" />
        <p className="text-muted">Loading prompt...</p>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="text-center py-16">
        <p className="text-muted">Prompt not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-4">
        <button onClick={() => router.push("/prompts")} className="hover:text-accent transition-colors">
          Prompts
        </button>
        <Icon icon="lucide:chevron-right" width={14} height={14} />
        <span className="text-foreground">{prompt.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex-1 mr-4">
          {editingName ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveName();
                if (e.key === "Escape") { setEditingName(false); setName(prompt.name); }
              }}
              className="text-3xl font-bold bg-transparent border-b border-accent/50 text-white focus:outline-none w-full pb-1"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="text-3xl font-bold text-white hover:text-accent/90 transition-colors text-left group flex items-center gap-2"
            >
              {prompt.name}
              <Icon icon="lucide:pencil" width={18} height={18} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
          <p className="text-muted mt-1 text-sm">
            {lastSaved
              ? `Saved ${lastSaved.toLocaleTimeString()}`
              : `Created ${new Date(prompt.createdAt).toLocaleDateString()}`}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-card border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-red-300 font-medium px-4 py-2.5 rounded-full transition-colors flex items-center gap-2 text-sm shrink-0"
        >
          {deleting ? (
            <Icon icon="lucide:loader-2" width={16} height={16} className="animate-spin" />
          ) : (
            <Icon icon="lucide:trash-2" width={16} height={16} />
          )}
          Delete
        </button>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Left: Prompt editor */}
        <div className="flex-1 min-w-0">
          <div className="bg-card border border-card-border rounded-xl p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Icon icon="lucide:file-text" width={18} height={18} className="text-accent" />
                Prompt Content
              </h3>
              {content && (
                <span className="text-xs text-muted">{content.length} chars</span>
              )}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste, type, or generate your prompt here…"
              rows={18}
              className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 resize-y font-mono text-sm leading-relaxed"
            />
          </div>

          {/* Save + import row */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2.5 rounded-full transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <Icon icon="lucide:loader-2" width={16} height={16} className="animate-spin" />
              ) : (
                <Icon icon="lucide:save" width={16} height={16} />
              )}
              Save Prompt
            </button>
            <button
              onClick={() => setActivePanel(activePanel === "import" ? null : "import")}
              className={`border font-medium px-4 py-2.5 rounded-full transition-colors flex items-center gap-2 text-sm ${
                activePanel === "import"
                  ? "bg-accent/10 border-accent/50 text-accent"
                  : "bg-card border-card-border text-foreground hover:border-accent/40"
              }`}
            >
              <Icon icon="lucide:upload" width={16} height={16} />
              Import File
            </button>
          </div>

          {/* Import panel */}
          {activePanel === "import" && (
            <div className="bg-card border border-card-border rounded-xl p-5 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Import File</h3>
                <button onClick={() => setActivePanel(null)} className="text-muted hover:text-white transition-colors">
                  <Icon icon="lucide:x" width={18} height={18} />
                </button>
              </div>
              <p className="text-sm text-muted mb-4">
                Import a TXT, MD, PDF, or DOCX file. The extracted text will replace the current prompt content.
              </p>

              <div
                className="border-2 border-dashed border-card-border rounded-xl p-8 text-center hover:border-accent/40 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleFileImport(file);
                }}
              >
                {importLoading ? (
                  <>
                    <Icon icon="lucide:loader-2" width={28} height={28} className="mx-auto mb-2 text-muted animate-spin" />
                    <p className="text-muted text-sm">Importing...</p>
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:upload-cloud" width={28} height={28} className="mx-auto mb-2 text-muted" />
                    <p className="text-foreground text-sm font-medium">Click or drag a file here</p>
                    <p className="text-muted text-xs mt-1">TXT, MD, PDF, DOCX</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.pdf,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileImport(file);
                }}
              />
              {importError && (
                <p className="text-red-400 text-sm mt-3">{importError}</p>
              )}
            </div>
          )}
        </div>

        {/* Right: Settings sidebar */}
        <div className="w-80 shrink-0 space-y-4">
          {/* Guidance */}
          <div className="bg-card border border-card-border rounded-xl overflow-hidden">
            <button
              onClick={() => setActivePanel(activePanel === "guidance" ? null : "guidance")}
              className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-white font-semibold flex items-center gap-2">
                <Icon icon="lucide:sliders-horizontal" width={18} height={18} className="text-accent" />
                Guidance
              </span>
              <Icon
                icon={activePanel === "guidance" ? "lucide:chevron-up" : "lucide:chevron-down"}
                width={16}
                height={16}
                className="text-muted"
              />
            </button>

            {/* Show summary chips when collapsed */}
            {activePanel !== "guidance" && (tone || persona || audience || format || goal) && (
              <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                {tone && <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent/80">{tone}</span>}
                {persona && <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-muted">{persona}</span>}
                {audience && <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-muted">{audience}</span>}
                {format && <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-muted">{format}</span>}
              </div>
            )}

            {activePanel === "guidance" && (
              <div className="px-4 pb-4 space-y-4 border-t border-card-border pt-4">
                <div>
                  <label className="block text-xs text-muted mb-1.5">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-input border border-card-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-accent/50"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t}>{t || "— Select tone —"}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5">Persona / Voice</label>
                  <select
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    className="w-full bg-input border border-card-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-accent/50"
                  >
                    {PERSONAS.map((p) => (
                      <option key={p} value={p}>{p || "— Select persona —"}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5">Target Audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full bg-input border border-card-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-accent/50"
                  >
                    {AUDIENCES.map((a) => (
                      <option key={a} value={a}>{a || "— Select audience —"}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5">Output Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full bg-input border border-card-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-accent/50"
                  >
                    {FORMATS.map((f) => (
                      <option key={f} value={f}>{f || "— Select format —"}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5">Goal</label>
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="What should this prompt achieve?"
                    rows={3}
                    className="w-full bg-input border border-card-border rounded-lg px-3 py-2 text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Knowledge Base */}
          <div className="bg-card border border-card-border rounded-xl p-4">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
              <Icon icon="lucide:brain" width={18} height={18} className="text-accent" />
              Knowledge Base
            </h3>
            <p className="text-xs text-muted mb-3">
              Connect a KB to give AI context when generating or refining this prompt.
            </p>
            <select
              value={connectedKBId}
              onChange={(e) => handleKBSelect(e.target.value)}
              className="w-full bg-input border border-card-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-accent/50"
            >
              <option value="">— No knowledge base —</option>
              {kbs.map((kb) => (
                <option key={kb.id} value={kb.id}>{kb.name}</option>
              ))}
            </select>
            {connectedKBId && (
              <p className="text-xs text-accent mt-2 flex items-center gap-1">
                <Icon icon="lucide:check-circle" width={12} height={12} />
                Connected: {connectedKBName}
              </p>
            )}
          </div>

          {/* AI Assistant */}
          <div className="bg-card border border-card-border rounded-xl overflow-hidden">
            <button
              onClick={() => setActivePanel(activePanel === "ai" ? null : "ai")}
              className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-white font-semibold flex items-center gap-2">
                <Icon icon="lucide:sparkles" width={18} height={18} className="text-accent" />
                AI Assistant
              </span>
              <Icon
                icon={activePanel === "ai" ? "lucide:chevron-up" : "lucide:chevron-down"}
                width={16}
                height={16}
                className="text-muted"
              />
            </button>

            {activePanel === "ai" && (
              <div className="px-4 pb-4 border-t border-card-border pt-4 space-y-3">
                {/* Mode toggle */}
                <div className="flex rounded-lg overflow-hidden border border-card-border">
                  <button
                    onClick={() => setAiMode("generate")}
                    className={`flex-1 py-2 text-xs font-medium transition-colors ${
                      aiMode === "generate"
                        ? "bg-accent text-white"
                        : "bg-input text-muted hover:text-foreground"
                    }`}
                  >
                    Generate
                  </button>
                  <button
                    onClick={() => setAiMode("refine")}
                    className={`flex-1 py-2 text-xs font-medium transition-colors ${
                      aiMode === "refine"
                        ? "bg-accent text-white"
                        : "bg-input text-muted hover:text-foreground"
                    }`}
                  >
                    Refine
                  </button>
                </div>

                <p className="text-xs text-muted">
                  {aiMode === "generate"
                    ? "Describe what you want — AI will generate a complete prompt using your guidance settings."
                    : "Describe how to change the existing prompt — AI will revise it while preserving intent."}
                </p>

                <textarea
                  value={aiInstructions}
                  onChange={(e) => setAiInstructions(e.target.value)}
                  placeholder={
                    aiMode === "generate"
                      ? "e.g. Write a system prompt for a fantasy RPG guide who helps players navigate quests…"
                      : "e.g. Make it shorter and more direct. Add emphasis on empathy…"
                  }
                  rows={5}
                  className="w-full bg-input border border-card-border rounded-lg px-3 py-2 text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none"
                />

                {aiError && (
                  <p className="text-red-400 text-xs">{aiError}</p>
                )}

                <button
                  onClick={handleAIGenerate}
                  disabled={aiLoading || !aiInstructions.trim()}
                  className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {aiLoading ? (
                    <>
                      <Icon icon="lucide:loader-2" width={16} height={16} className="animate-spin" />
                      {aiMode === "generate" ? "Generating..." : "Refining..."}
                    </>
                  ) : (
                    <>
                      <Icon icon="lucide:sparkles" width={16} height={16} />
                      {aiMode === "generate" ? "Generate Prompt" : "Refine Prompt"}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
