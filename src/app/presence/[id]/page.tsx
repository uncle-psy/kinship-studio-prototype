"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import type { Presence, PresenceSignal } from "@/lib/types";

// ─── Signal definitions ───────────────────────────────────────────────────────
const ALL_SIGNALS = [
  { signalId: "health",        name: "Health",        letter: "H",  color: "#ef4444" },
  { signalId: "empathy",       name: "Empathy",       letter: "E",  color: "#f97316" },
  { signalId: "aspiration",    name: "Aspiration",    letter: "A",  color: "#f59e0b" },
  { signalId: "resilience",    name: "Resilience",    letter: "R",  color: "#22c55e" },
  { signalId: "thinking",      name: "Thinking",      letter: "T",  color: "#3b82f6" },
  { signalId: "self-identity", name: "Self-Identity", letter: "Si", color: "#a855f7" },
  { signalId: "social",        name: "Social",        letter: "So", color: "#ec4899" },
];

interface KnowledgeBase { id: string; name: string; }
interface PromptItem    { id: string; name: string; }

// ─── Reusable editable text section ──────────────────────────────────────────
function EditableSection({
  label,
  icon,
  value,
  onChange,
  onSave,
  saving,
  savedFlash,
  placeholder,
  rows = 12,
  fontMono = false,
}: {
  label: string;
  icon: string;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  saving: boolean;
  savedFlash: boolean;
  placeholder: string;
  rows?: number;
  fontMono?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const originalRef = useRef("");

  function startEditing() {
    originalRef.current = value;
    setIsEditing(true);
  }

  function handleCancel() {
    onChange(originalRef.current);
    setIsEditing(false);
  }

  async function handleSave() {
    await onSave();
    setIsEditing(false);
  }

  // If no content yet, start in editing mode
  useEffect(() => {
    if (!value) setIsEditing(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`border rounded-xl p-5 transition-colors ${isEditing ? "bg-card border-accent/40" : "bg-card border-card-border"}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Icon icon={icon} width={16} height={16} className="text-accent" />
          {label}
          {isEditing && (
            <span className="text-xs font-normal text-accent/70 bg-accent/10 px-2 py-0.5 rounded-full">Editing</span>
          )}
        </h3>
        {value && (
          <span className="text-xs text-muted">{value.length} chars</span>
        )}
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={!isEditing}
        placeholder={placeholder}
        rows={rows}
        className={`w-full rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none text-sm leading-relaxed transition-colors ${fontMono ? "font-mono" : ""} ${
          isEditing
            ? "bg-input border border-accent/30 focus:border-accent/60 resize-y cursor-text"
            : "bg-transparent border border-transparent cursor-default resize-none select-text"
        }`}
      />

      <div className="flex items-center gap-3 mt-3">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2 rounded-full transition-colors flex items-center gap-2 text-sm disabled:opacity-60"
            >
              {saving
                ? <Icon icon="lucide:loader-2" width={14} height={14} className="animate-spin" />
                : <Icon icon="lucide:save" width={14} height={14} />}
              Save {label}
            </button>
            <button
              onClick={handleCancel}
              className="border border-card-border text-foreground/70 hover:text-foreground hover:border-accent/40 font-medium px-4 py-2 rounded-full transition-colors text-sm"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={startEditing}
            className="bg-card border border-card-border hover:border-accent/50 text-foreground font-medium px-5 py-2 rounded-full transition-colors flex items-center gap-2 text-sm"
          >
            <Icon icon="lucide:pencil" width={14} height={14} />
            Edit {label}
          </button>
        )}
        <p className={`text-xs flex items-center gap-1 transition-colors ${savedFlash ? "text-green-400" : "text-muted"}`}>
          {savedFlash && <Icon icon="lucide:check-circle" width={12} height={12} />}
          {savedFlash ? "Saved!" : ""}
        </p>
      </div>
    </div>
  );
}

// ─── Collapsible sidebar card ─────────────────────────────────────────────────
function SidebarCard({ title, icon, children, defaultOpen = false }: {
  title: string; icon: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-white font-semibold flex items-center gap-2 text-sm">
          <Icon icon={icon} width={16} height={16} className="text-accent" />
          {title}
        </span>
        <Icon icon={open ? "lucide:chevron-up" : "lucide:chevron-down"} width={14} height={14} className="text-muted" />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-card-border pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PresenceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [presence, setPresence] = useState<Presence | null>(null);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [backstory, setBackstory] = useState("");

  // Save state per section
  const [descSaving, setDescSaving] = useState(false);
  const [descFlash, setDescFlash]   = useState(false);
  const [backSaving, setBackSaving] = useState(false);
  const [backFlash, setBackFlash]   = useState(false);
  const [nameSaving, setNameSaving] = useState(false);

  // Relationships
  const [allKBs, setAllKBs]       = useState<KnowledgeBase[]>([]);
  const [allPrompts, setAllPrompts] = useState<PromptItem[]>([]);
  const [selectedKBIds, setSelectedKBIds]     = useState<string[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState("");
  const [activeSignals, setActiveSignals]       = useState<PresenceSignal[]>([]);

  // AI assistant
  const [aiTarget, setAiTarget]           = useState<"description" | "backstory">("description");
  const [aiMode, setAiMode]               = useState<"generate" | "refine">("generate");
  const [aiInstructions, setAiInstructions] = useState("");
  const [aiLoading, setAiLoading]         = useState(false);
  const [aiError, setAiError]             = useState("");

  // Sidebar save state
  const [sidebarSaving, setSidebarSaving] = useState(false);
  const [sidebarFlash, setSidebarFlash]   = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const flashTimer = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  function flash(key: string, setter: (v: boolean) => void) {
    setter(true);
    if (flashTimer.current[key]) clearTimeout(flashTimer.current[key]);
    flashTimer.current[key] = setTimeout(() => setter(false), 2500);
  }

  // ── Load ──
  const fetchPresence = useCallback(async () => {
    try {
      const res = await fetch(`/api/presence/${id}`);
      if (!res.ok) { router.push("/presence"); return; }
      const data = await res.json();
      const p: Presence = data.presence;
      setPresence(p);
      setName(p.name);
      setDescription(p.description || "");
      setBackstory(p.backstory || "");
      setSelectedKBIds(p.knowledgeBaseIds || []);
      setSelectedPromptId(p.promptId || "");
      setActiveSignals(p.signals || []);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchPresence();
    fetch("/api/knowledge").then((r) => r.json()).then((d) => setAllKBs(d.knowledgeBases || [])).catch(() => {});
    fetch("/api/prompts").then((r) => r.json()).then((d) => setAllPrompts(d.prompts || [])).catch(() => {});
  }, [fetchPresence]);

  // ── Save name ──
  async function handleSaveName() {
    if (!name.trim() || name.trim() === presence?.name) return;
    setNameSaving(true);
    const res = await fetch(`/api/presence/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (res.ok) { const d = await res.json(); setPresence(d.presence); setName(d.presence.name); }
    setNameSaving(false);
  }

  // ── Save description ──
  async function handleSaveDescription() {
    setDescSaving(true);
    const res = await fetch(`/api/presence/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });
    if (res.ok) { const d = await res.json(); setPresence(d.presence); flash("desc", setDescFlash); }
    setDescSaving(false);
  }

  // ── Save backstory ──
  async function handleSaveBackstory() {
    setBackSaving(true);
    const res = await fetch(`/api/presence/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ backstory }),
    });
    if (res.ok) { const d = await res.json(); setPresence(d.presence); flash("back", setBackFlash); }
    setBackSaving(false);
  }

  // ── Save sidebar (KB, prompt, signals) ──
  async function handleSaveSidebar() {
    setSidebarSaving(true);
    const kbNames = selectedKBIds.map((kbId) => allKBs.find((k) => k.id === kbId)?.name ?? kbId);
    const promptName = allPrompts.find((p) => p.id === selectedPromptId)?.name ?? "";
    const res = await fetch(`/api/presence/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        knowledgeBaseIds: selectedKBIds,
        knowledgeBaseNames: kbNames,
        promptId: selectedPromptId || undefined,
        promptName: selectedPromptId ? promptName : undefined,
        signals: activeSignals,
      }),
    });
    if (res.ok) { const d = await res.json(); setPresence(d.presence); flash("sidebar", setSidebarFlash); }
    setSidebarSaving(false);
  }

  // ── AI generate ──
  async function handleAIGenerate() {
    if (!aiInstructions.trim()) return;
    setAiLoading(true);
    setAiError("");
    try {
      const res = await fetch(`/api/presence/${id}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: aiTarget, instructions: aiInstructions, mode: aiMode }),
      });
      if (res.ok) {
        const data = await res.json();
        if (aiTarget === "description") { setDescription(data.content); flash("desc", setDescFlash); }
        else                            { setBackstory(data.content);    flash("back", setBackFlash); }
        setPresence(data.presence);
        setAiInstructions("");
      } else {
        const data = await res.json();
        setAiError(data.error || "Generation failed");
      }
    } catch {
      setAiError("Something went wrong");
    } finally {
      setAiLoading(false);
    }
  }

  // ── Signals ──
  function toggleSignal(sig: typeof ALL_SIGNALS[0]) {
    setActiveSignals((prev) => {
      const exists = prev.find((s) => s.signalId === sig.signalId);
      if (exists) return prev.filter((s) => s.signalId !== sig.signalId);
      return [...prev, { ...sig, value: 50 }];
    });
  }
  function setSignalValue(signalId: string, value: number) {
    setActiveSignals((prev) => prev.map((s) => s.signalId === signalId ? { ...s, value } : s));
  }

  // ── Delete ──
  async function handleDelete() {
    await fetch(`/api/presence/${id}`, { method: "DELETE" });
    router.push("/presence");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Icon icon="lucide:loader-2" width={36} height={36} className="text-muted animate-spin" />
      </div>
    );
  }
  if (!presence) return null;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-4">
        <button onClick={() => router.push("/presence")} className="hover:text-accent transition-colors">
          Presence
        </button>
        <Icon icon="lucide:chevron-right" width={14} height={14} />
        <span className="text-foreground">{presence.name}</span>
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
            <Icon icon="lucide:user-round" width={20} height={20} className="text-accent" />
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => { if (e.key === "Enter") { (e.target as HTMLInputElement).blur(); } }}
            disabled={nameSaving}
            className="text-2xl font-bold text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-accent/50 focus:outline-none transition-colors py-0.5 flex-1 min-w-0"
          />
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="shrink-0 text-muted hover:text-red-400 transition-colors flex items-center gap-1.5 text-sm border border-transparent hover:border-red-400/30 px-3 py-1.5 rounded-lg"
        >
          <Icon icon="lucide:trash-2" width={14} height={14} />
          Delete
        </button>
      </div>

      {/* Brief description badge */}
      {presence.briefDescription && (
        <p className="text-sm text-muted mb-6 ml-[52px] italic">
          &ldquo;{presence.briefDescription}&rdquo;
        </p>
      )}

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">

        {/* ── Left: Description + Backstory + AI ───────────────────────────── */}
        <div className="flex-[3] min-w-0 space-y-4">

          <EditableSection
            label="Description"
            icon="lucide:scan-face"
            value={description}
            onChange={setDescription}
            onSave={handleSaveDescription}
            saving={descSaving}
            savedFlash={descFlash}
            placeholder="A vivid description of this presence — what it looks like, how it moves, what energy it carries. Use AI to generate one based on the brief description above."
            rows={10}
          />

          <EditableSection
            label="Backstory"
            icon="lucide:book-open"
            value={backstory}
            onChange={setBackstory}
            onSave={handleSaveBackstory}
            saving={backSaving}
            savedFlash={backFlash}
            placeholder="The origin, history, and motivations of this presence. Use AI to generate a backstory, or write your own."
            rows={8}
          />

          {/* Asset selector */}
          <div className="bg-card border border-card-border rounded-xl p-5">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-1">
              <Icon icon="lucide:image" width={16} height={16} className="text-accent" />
              Asset
            </h3>
            <p className="text-xs text-muted mb-3">
              Select an asset from the library to visually represent this presence. Physical attributes (body, clothing, etc.) are defined by the asset.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={presence.assetName || ""}
                readOnly
                placeholder="No asset selected"
                className="flex-1 bg-input border border-card-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none cursor-default"
              />
              <button
                onClick={() => router.push("/assets")}
                className="bg-white/[0.06] border border-card-border hover:border-accent/40 text-foreground text-sm font-medium px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
              >
                <Icon icon="lucide:library" width={14} height={14} />
                Browse Assets
              </button>
            </div>
          </div>

          {/* AI Assistant */}
          <div className="bg-card border border-card-border rounded-xl overflow-hidden">
            <button
              onClick={() => {/* always visible, this is a card header only */}}
              className="w-full flex items-center gap-2 p-5 pb-0 cursor-default"
            >
              <Icon icon="lucide:sparkles" width={16} height={16} className="text-accent" />
              <span className="text-white font-semibold text-sm">AI Assistant</span>
            </button>
            <div className="p-5 pt-3 space-y-3">

              {/* Target toggle */}
              <div className="flex rounded-lg overflow-hidden border border-card-border">
                <button
                  onClick={() => setAiTarget("description")}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${
                    aiTarget === "description" ? "bg-accent text-white" : "bg-input text-muted hover:text-foreground"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setAiTarget("backstory")}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${
                    aiTarget === "backstory" ? "bg-accent text-white" : "bg-input text-muted hover:text-foreground"
                  }`}
                >
                  Backstory
                </button>
              </div>

              {/* Mode toggle */}
              <div className="flex rounded-lg overflow-hidden border border-card-border">
                <button
                  onClick={() => setAiMode("generate")}
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
                    aiMode === "generate" ? "bg-white/10 text-white" : "bg-input text-muted hover:text-foreground"
                  }`}
                >
                  Generate
                </button>
                <button
                  onClick={() => setAiMode("refine")}
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
                    aiMode === "refine" ? "bg-white/10 text-white" : "bg-input text-muted hover:text-foreground"
                  }`}
                >
                  Refine
                </button>
              </div>

              <p className="text-xs text-muted">
                {aiMode === "generate"
                  ? `AI will generate a ${aiTarget} using the name and brief description as context.`
                  : `AI will refine the existing ${aiTarget} based on your instructions.`}
              </p>

              <textarea
                value={aiInstructions}
                onChange={(e) => setAiInstructions(e.target.value)}
                placeholder={
                  aiTarget === "description"
                    ? "e.g. Lean into the mystical side, make it feel ancient and otherworldly…"
                    : "e.g. Give them a tragic origin tied to a lost civilization. Keep it mysterious."
                }
                rows={4}
                className="w-full bg-input border border-card-border rounded-xl px-3 py-2.5 text-foreground text-sm placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none"
              />

              {aiError && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <Icon icon="lucide:alert-circle" width={12} height={12} />
                  {aiError}
                </p>
              )}

              <button
                onClick={handleAIGenerate}
                disabled={aiLoading || !aiInstructions.trim()}
                className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {aiLoading ? (
                  <><Icon icon="lucide:loader-2" width={14} height={14} className="animate-spin" />
                  {aiMode === "generate" ? "Generating…" : "Refining…"}</>
                ) : (
                  <><Icon icon="lucide:sparkles" width={14} height={14} />
                  {aiMode === "generate" ? `Generate ${aiTarget}` : `Refine ${aiTarget}`}</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right sidebar ─────────────────────────────────────────────────── */}
        <div className="flex-[2] min-w-0 space-y-3">

          {/* Knowledge Bases */}
          <SidebarCard title="Knowledge Bases" icon="lucide:brain" defaultOpen>
            <p className="text-xs text-muted mb-3">Select one or more KBs for this presence to draw from.</p>
            {allKBs.length === 0 ? (
              <p className="text-xs text-muted/60 italic">No knowledge bases available.</p>
            ) : (
              <div className="space-y-1.5">
                {allKBs.map((kb) => {
                  const checked = selectedKBIds.includes(kb.id);
                  return (
                    <label key={kb.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      checked ? "bg-accent/10 border border-accent/30" : "bg-white/[0.03] border border-transparent hover:bg-white/[0.06]"
                    }`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => setSelectedKBIds((prev) =>
                          prev.includes(kb.id) ? prev.filter((x) => x !== kb.id) : [...prev, kb.id]
                        )}
                        className="accent-accent"
                      />
                      <span className={`text-sm ${checked ? "text-white" : "text-muted"}`}>{kb.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </SidebarCard>

          {/* System Prompt */}
          <SidebarCard title="System Prompt" icon="lucide:message-square-code">
            <p className="text-xs text-muted mb-3">Assign one prompt to govern this presence&apos;s behaviour.</p>
            <select
              value={selectedPromptId}
              onChange={(e) => setSelectedPromptId(e.target.value)}
              className="w-full bg-input border border-card-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent/50"
            >
              <option value="">— No prompt —</option>
              {allPrompts.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </SidebarCard>

          {/* Signals */}
          <SidebarCard title="Signals" icon="lucide:activity">
            <p className="text-xs text-muted mb-4">Enable signals and set the starting value for this presence.</p>
            <div className="space-y-3">
              {ALL_SIGNALS.map((sig) => {
                const active = activeSignals.find((s) => s.signalId === sig.signalId);
                return (
                  <div key={sig.signalId}>
                    <div className="flex items-center gap-2.5 mb-1">
                      <button
                        type="button"
                        onClick={() => toggleSignal(sig)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0 transition-opacity ${active ? "opacity-100" : "opacity-25"}`}
                        style={{ backgroundColor: sig.color }}
                      >
                        {sig.letter}
                      </button>
                      <span className={`text-sm flex-1 ${active ? "text-white" : "text-muted"}`}>{sig.name}</span>
                      {active && (
                        <span className="text-xs font-mono text-accent w-6 text-right">{active.value}</span>
                      )}
                    </div>
                    {active && (
                      <div className="pl-[38px]">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={active.value}
                          onChange={(e) => setSignalValue(sig.signalId, Number(e.target.value))}
                          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                          style={{
                            accentColor: sig.color,
                            background: `linear-gradient(to right, ${sig.color} ${active.value}%, rgba(255,255,255,0.1) ${active.value}%)`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </SidebarCard>

          {/* Save sidebar button */}
          <button
            onClick={handleSaveSidebar}
            disabled={sidebarSaving}
            className="w-full bg-white/[0.06] hover:bg-white/[0.1] border border-card-border hover:border-accent/40 text-foreground font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {sidebarSaving
              ? <Icon icon="lucide:loader-2" width={14} height={14} className="animate-spin" />
              : <Icon icon="lucide:save" width={14} height={14} />}
            {sidebarSaving ? "Saving…" : "Save Configuration"}
          </button>
          {sidebarFlash && (
            <p className="text-xs text-green-400 text-center flex items-center justify-center gap-1">
              <Icon icon="lucide:check-circle" width={12} height={12} />
              Configuration saved!
            </p>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-card border border-card-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Presence?</h3>
            <p className="text-muted text-sm mb-5">
              &ldquo;{presence.name}&rdquo; will be permanently removed. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-white/[0.06] hover:bg-white/[0.1] border border-card-border text-foreground font-medium px-4 py-2.5 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold px-4 py-2.5 rounded-xl transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
