"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import type { Presence, PresenceSignal } from "@/lib/types";

// ─── Signal definitions (mirrors progress/page.tsx) ─────────────────────────
const ALL_SIGNALS = [
  { signalId: "health",       name: "Health",        letter: "H",  color: "#ef4444" },
  { signalId: "empathy",      name: "Empathy",       letter: "E",  color: "#f97316" },
  { signalId: "aspiration",   name: "Aspiration",    letter: "A",  color: "#f59e0b" },
  { signalId: "resilience",   name: "Resilience",    letter: "R",  color: "#22c55e" },
  { signalId: "thinking",     name: "Thinking",      letter: "T",  color: "#3b82f6" },
  { signalId: "self-identity",name: "Self-Identity", letter: "Si", color: "#a855f7" },
  { signalId: "social",       name: "Social",        letter: "So", color: "#ec4899" },
];

// ─── Appearance option lists ─────────────────────────────────────────────────
const BODY_TYPES = ["Athletic", "Lean", "Average", "Stocky", "Petite", "Tall", "Ethereal", "Custom"];
const CLOTHING_STYLES = ["Casual", "Formal", "Fantasy", "Sci-Fi", "Streetwear", "Ceremonial", "Minimal", "Custom"];
const HAIR_STYLES = ["Short", "Medium", "Long", "Curly", "Braided", "Shaved", "Flowing", "None"];
const SKIN_TONES = ["Fair", "Light", "Medium", "Tan", "Brown", "Dark", "Ebony", "Otherworldly"];

// ─── Types ───────────────────────────────────────────────────────────────────
interface KnowledgeBase { id: string; name: string; }
interface Prompt { id: string; name: string; }

// ─── Sub-components ──────────────────────────────────────────────────────────
function ChipSelect({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(value === opt ? "" : opt)}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            value === opt
              ? "bg-accent/20 border-accent/50 text-accent"
              : "bg-white/[0.04] border-card-border text-muted hover:border-accent/30 hover:text-foreground"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function PresenceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [presence, setPresence] = useState<Presence | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [physicalDescription, setPhysicalDescription] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [clothingStyle, setClothingStyle] = useState("");
  const [hairStyle, setHairStyle] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [accessories, setAccessories] = useState("");

  // Relationships
  const [allKBs, setAllKBs] = useState<KnowledgeBase[]>([]);
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [selectedKBIds, setSelectedKBIds] = useState<string[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState("");

  // Signals
  const [activeSignals, setActiveSignals] = useState<PresenceSignal[]>([]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load presence ──
  const fetchPresence = useCallback(async () => {
    try {
      const res = await fetch(`/api/presence/${id}`);
      if (!res.ok) { router.push("/presence"); return; }
      const data = await res.json();
      const p: Presence = data.presence;
      setPresence(p);
      setName(p.name);
      setPhysicalDescription(p.physicalDescription || "");
      setBodyType(p.bodyType || "");
      setClothingStyle(p.clothingStyle || "");
      setHairStyle(p.hairStyle || "");
      setSkinTone(p.skinTone || "");
      setAccessories(p.accessories || "");
      setSelectedKBIds(p.knowledgeBaseIds || []);
      setSelectedPromptId(p.promptId || "");
      setActiveSignals(p.signals || []);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  // ── Load KBs + Prompts ──
  useEffect(() => {
    fetchPresence();
    fetch("/api/knowledge")
      .then((r) => r.json())
      .then((d) => setAllKBs(d.knowledgeBases || []))
      .catch(() => {});
    fetch("/api/prompts")
      .then((r) => r.json())
      .then((d) => setAllPrompts(d.prompts || []))
      .catch(() => {});
  }, [fetchPresence]);

  // ── Save ──
  async function handleSave() {
    if (!presence) return;
    setSaving(true);
    try {
      const kbNames = selectedKBIds
        .map((kbId) => allKBs.find((k) => k.id === kbId)?.name ?? kbId);
      const promptName = allPrompts.find((p) => p.id === selectedPromptId)?.name ?? "";

      const res = await fetch(`/api/presence/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          physicalDescription,
          bodyType,
          clothingStyle,
          hairStyle,
          skinTone,
          accessories,
          knowledgeBaseIds: selectedKBIds,
          knowledgeBaseNames: kbNames,
          promptId: selectedPromptId || undefined,
          promptName: selectedPromptId ? promptName : undefined,
          signals: activeSignals,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPresence(data.presence);
        setSavedFlash(true);
        if (flashTimer.current) clearTimeout(flashTimer.current);
        flashTimer.current = setTimeout(() => setSavedFlash(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ──
  async function handleDelete() {
    await fetch(`/api/presence/${id}`, { method: "DELETE" });
    router.push("/presence");
  }

  // ── Toggle KB ──
  function toggleKB(kbId: string) {
    setSelectedKBIds((prev) =>
      prev.includes(kbId) ? prev.filter((x) => x !== kbId) : [...prev, kbId]
    );
  }

  // ── Toggle Signal ──
  function toggleSignal(sig: typeof ALL_SIGNALS[0]) {
    setActiveSignals((prev) => {
      const exists = prev.find((s) => s.signalId === sig.signalId);
      if (exists) return prev.filter((s) => s.signalId !== sig.signalId);
      return [...prev, { ...sig, value: 50 }];
    });
  }

  function setSignalValue(signalId: string, value: number) {
    setActiveSignals((prev) =>
      prev.map((s) => (s.signalId === signalId ? { ...s, value } : s))
    );
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
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
            <Icon icon="lucide:user-round" width={20} height={20} className="text-accent" />
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-2xl font-bold text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-accent/50 focus:outline-none transition-colors py-0.5 flex-1 min-w-0"
          />
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="ml-4 shrink-0 text-muted hover:text-red-400 transition-colors flex items-center gap-1.5 text-sm border border-transparent hover:border-red-400/30 px-3 py-1.5 rounded-lg"
        >
          <Icon icon="lucide:trash-2" width={14} height={14} />
          Delete
        </button>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">
        {/* ── Left: Appearance ─────────────────────────────────────────────── */}
        <div className="flex-[3] min-w-0 space-y-4">

          {/* Physical Description */}
          <div className="bg-card border border-card-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Icon icon="lucide:pencil-line" width={16} height={16} className="text-accent" />
              Physical Description
            </h2>
            <textarea
              value={physicalDescription}
              onChange={(e) => setPhysicalDescription(e.target.value)}
              rows={4}
              placeholder="Describe the physical appearance of this presence — height, build, distinguishing features, energy, posture…"
              className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 text-sm leading-relaxed resize-y"
            />
          </div>

          {/* Body */}
          <div className="bg-card border border-card-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Icon icon="lucide:person-standing" width={16} height={16} className="text-accent" />
              Body Type
            </h2>
            <ChipSelect options={BODY_TYPES} value={bodyType} onChange={setBodyType} />
          </div>

          {/* Clothing */}
          <div className="bg-card border border-card-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Icon icon="lucide:shirt" width={16} height={16} className="text-accent" />
              Clothing Style
            </h2>
            <ChipSelect options={CLOTHING_STYLES} value={clothingStyle} onChange={setClothingStyle} />
          </div>

          {/* Hair + Skin */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-card-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Icon icon="lucide:sparkles" width={16} height={16} className="text-accent" />
                Hair Style
              </h2>
              <ChipSelect options={HAIR_STYLES} value={hairStyle} onChange={setHairStyle} />
            </div>
            <div className="bg-card border border-card-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Icon icon="lucide:palette" width={16} height={16} className="text-accent" />
                Skin Tone
              </h2>
              <ChipSelect options={SKIN_TONES} value={skinTone} onChange={setSkinTone} />
            </div>
          </div>

          {/* Accessories */}
          <div className="bg-card border border-card-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Icon icon="lucide:gem" width={16} height={16} className="text-accent" />
              Accessories & Details
            </h2>
            <input
              type="text"
              value={accessories}
              onChange={(e) => setAccessories(e.target.value)}
              placeholder="e.g. Worn leather satchel, silver ring on left hand, faint scar above eyebrow…"
              className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 text-sm"
            />
          </div>

          {/* Save row */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2"
            >
              {saving ? (
                <Icon icon="lucide:loader-2" width={16} height={16} className="animate-spin" />
              ) : (
                <Icon icon="lucide:save" width={16} height={16} />
              )}
              {saving ? "Saving…" : "Save Presence"}
            </button>
            <p className={`text-sm flex items-center gap-1.5 transition-colors ${savedFlash ? "text-green-400" : "text-muted"}`}>
              {savedFlash && <Icon icon="lucide:check-circle" width={14} height={14} />}
              {savedFlash
                ? "Saved!"
                : presence.updatedAt
                ? `Saved ${new Date(presence.updatedAt).toLocaleTimeString()}`
                : `Created ${new Date(presence.createdAt).toLocaleDateString()}`}
            </p>
          </div>
        </div>

        {/* ── Right sidebar ─────────────────────────────────────────────────── */}
        <div className="flex-[2] min-w-0 space-y-4">

          {/* Knowledge Bases */}
          <div className="bg-card border border-card-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <Icon icon="lucide:brain" width={16} height={16} className="text-accent" />
              Knowledge Bases
            </h2>
            <p className="text-xs text-muted mb-3">Select one or more KBs for this presence to draw from.</p>
            {allKBs.length === 0 ? (
              <p className="text-xs text-muted/60 italic">No knowledge bases available.</p>
            ) : (
              <div className="space-y-1.5">
                {allKBs.map((kb) => {
                  const checked = selectedKBIds.includes(kb.id);
                  return (
                    <label
                      key={kb.id}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        checked
                          ? "bg-accent/10 border border-accent/30"
                          : "bg-white/[0.03] border border-transparent hover:bg-white/[0.06]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleKB(kb.id)}
                        className="accent-accent"
                      />
                      <span className={`text-sm ${checked ? "text-white" : "text-muted"}`}>
                        {kb.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* System Prompt */}
          <div className="bg-card border border-card-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <Icon icon="lucide:message-square-code" width={16} height={16} className="text-accent" />
              System Prompt
            </h2>
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
          </div>

          {/* Signals */}
          <div className="bg-card border border-card-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <Icon icon="lucide:activity" width={16} height={16} className="text-accent" />
              Signals
            </h2>
            <p className="text-xs text-muted mb-4">Enable signals and set the starting value for this presence.</p>
            <div className="space-y-3">
              {ALL_SIGNALS.map((sig) => {
                const active = activeSignals.find((s) => s.signalId === sig.signalId);
                return (
                  <div key={sig.signalId}>
                    {/* Toggle row */}
                    <div className="flex items-center gap-3 mb-1">
                      <button
                        type="button"
                        onClick={() => toggleSignal(sig)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 transition-opacity ${
                          active ? "opacity-100" : "opacity-30"
                        }`}
                        style={{ backgroundColor: sig.color }}
                        title={active ? `Remove ${sig.name}` : `Add ${sig.name}`}
                      >
                        {sig.letter}
                      </button>
                      <span className={`text-sm flex-1 ${active ? "text-white" : "text-muted"}`}>
                        {sig.name}
                      </span>
                      {active && (
                        <span className="text-sm font-mono text-accent w-8 text-right">
                          {active.value}
                        </span>
                      )}
                    </div>
                    {/* Slider */}
                    {active && (
                      <div className="pl-11">
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
                        <div className="flex justify-between text-[10px] text-muted mt-0.5">
                          <span>0</span>
                          <span>100</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-card border border-card-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Presence?</h3>
            <p className="text-muted text-sm mb-5">
              &ldquo;{presence.name}&rdquo; will be permanently removed. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-white/[0.06] hover:bg-white/[0.1] border border-card-border text-foreground font-medium px-4 py-2.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
