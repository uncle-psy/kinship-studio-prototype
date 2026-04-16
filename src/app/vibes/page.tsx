"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

// ── Scope metadata ──────────────────────────────────────────────────────────
const SCOPE_META: Record<string, { label: string; icon: string; color: string; desc: string }> = {
  network:    { label: "Network",    icon: "lucide:globe",       color: "#F59E0B", desc: "Constitutional invariants for the entire Kinship ecosystem" },
  platform:   { label: "Platform",   icon: "lucide:layers",      color: "#3B82F6", desc: "Platform-wide tonal envelope across every Market" },
  project:    { label: "Market",     icon: "lucide:layout-grid", color: "#8B5CF6", desc: "Sponsor-specific constraints that travel with every Objective and Proposal" },
  experience: { label: "Experience", icon: "lucide:compass",     color: "#10B981", desc: "Room tone for the specific interactions inside a Market" },
  agent:      { label: "Agent",      icon: "lucide:bot",         color: "#EC4899", desc: "Persona-level expression bounds for a single Operator, Elector, or Executor" },
};
const SCOPES = ["network", "platform", "project", "experience", "agent"] as const;
type Scope = (typeof SCOPES)[number];

const AFFECT_DIMS = [
  { key: "warmth",    label: "Warmth",     lo: "Cool",      hi: "Warm"       },
  { key: "energy",    label: "Energy",     lo: "Still",     hi: "Electric"   },
  { key: "tone",      label: "Tone",       lo: "Solemn",    hi: "Playful"    },
  { key: "direct",    label: "Directness", lo: "Gentle",    hi: "Direct"     },
  { key: "challenge", label: "Challenge",  lo: "Nurturing", hi: "Demanding"  },
  { key: "ritual",    label: "Ritual",     lo: "Casual",    hi: "Ceremonial" },
] as const;

const GUARDRAIL_DEFS = [
  { id: "no-coercion",        label: "No coercive persuasion or manipulation",             cat: "Safety" },
  { id: "anti-sycophancy",    label: "Anti-sycophancy — prioritize truth over agreement",  cat: "Epistemic" },
  { id: "no-extraction",      label: "No dark-pattern engagement optimization",            cat: "Safety" },
  { id: "autonomy",           label: "Protect user autonomy and meaningful choice",        cat: "Safety" },
  { id: "antibypass",         label: "Spiritual antibypass — no grandiosity or inflation",  cat: "Spiritual" },
  { id: "reality-testing",    label: "Require grounding and reality-testing",               cat: "Spiritual" },
  { id: "crisis-pathway",     label: "Escalate to human support when crisis detected",     cat: "Safety" },
  { id: "epistemic-humility", label: "Epistemic humility — no confident fabrication",      cat: "Epistemic" },
  { id: "no-shame",           label: "No shaming, demeaning, or humiliating language",     cat: "Relational" },
  { id: "consent-boundaries", label: "Enforce consent and boundary respect",               cat: "Relational" },
  { id: "no-delusion",        label: "No delusion co-creation or reinforcement",           cat: "Epistemic" },
  { id: "trauma-informed",    label: "Trauma-informed interaction guarantees",              cat: "Safety" },
];

// ── Types ───────────────────────────────────────────────────────────────────
interface Norm { type: "encourage" | "require" | "prohibit"; text: string }
interface Vibe {
  id: string; name: string; scope: Scope; desc: string; color: string; status: string;
  affect: Record<string, number>; guardrails: string[]; norms: Norm[];
  maxIntensity: number; pacing: string;
}

// ── Initial Data ────────────────────────────────────────────────────────────
const VIBES_INIT: Vibe[] = [
  {
    id: "kinship-constitution", name: "Kinship Constitution", scope: "network",
    desc: "The master vibes — non-negotiable invariants defining how this ecosystem relates to humans and to itself. Even adversarial sub-experiences are nested inside this cooperative frame.",
    color: "#F59E0B", status: "active",
    affect: { warmth: 70, energy: 50, tone: 45, direct: 55, challenge: 50, ritual: 40 },
    guardrails: ["no-coercion","anti-sycophancy","no-extraction","autonomy","antibypass","reality-testing","crisis-pathway","epistemic-humility","no-shame","consent-boundaries","no-delusion","trauma-informed"],
    norms: [
      { type: "require", text: "Non-extraction social contract" },
      { type: "require", text: "Ecosystem cooperation — compete locally, never undermine network trust" },
      { type: "require", text: "Reality-respecting compassion" },
      { type: "prohibit", text: "Delusion co-creation or reinforcement" },
      { type: "prohibit", text: "Sycophantic agreement over truth" },
    ],
    maxIntensity: 80, pacing: "adaptive",
  },
  {
    id: "growth-space", name: "Growth Space", scope: "platform",
    desc: "Clinical-adjacent, gentle, growth-oriented. For platforms focused on personal development, therapeutic exploration, and structured inner work.",
    color: "#3B82F6", status: "active",
    affect: { warmth: 80, energy: 30, tone: 35, direct: 40, challenge: 35, ritual: 55 },
    guardrails: ["no-coercion","anti-sycophancy","autonomy","crisis-pathway","consent-boundaries","trauma-informed"],
    norms: [
      { type: "encourage", text: "Reflective listening" },
      { type: "encourage", text: "Motivational interviewing techniques" },
      { type: "require", text: "Consent before deep psychological work" },
      { type: "prohibit", text: "Dismissive or invalidating language" },
    ],
    maxIntensity: 60, pacing: "slow",
  },
  {
    id: "creative-playground", name: "Creative Playground", scope: "platform",
    desc: "Playful, experimental, expressive. For platforms centered on creative exploration, improvisation, and collaborative art-making.",
    color: "#06B6D4", status: "active",
    affect: { warmth: 65, energy: 80, tone: 85, direct: 50, challenge: 30, ritual: 15 },
    guardrails: ["no-coercion","no-extraction","autonomy","no-shame"],
    norms: [
      { type: "encourage", text: "Spontaneous expression" },
      { type: "encourage", text: "Collaborative improvisation" },
      { type: "prohibit", text: "Judgment of creative attempts" },
    ],
    maxIntensity: 90, pacing: "dynamic",
  },
  {
    id: "shadow-integration", name: "Shadow Integration", scope: "project",
    desc: "Deep, contemplative, psychologically intense. For exploring difficult emotions, unconscious patterns, and personal transformation through structured containers.",
    color: "#8B5CF6", status: "active",
    affect: { warmth: 70, energy: 25, tone: 15, direct: 65, challenge: 60, ritual: 75 },
    guardrails: ["no-coercion","anti-sycophancy","antibypass","reality-testing","crisis-pathway","consent-boundaries","no-delusion"],
    norms: [
      { type: "require", text: "Consent before deep psychological work" },
      { type: "require", text: "Grounding prompts in liminal contexts" },
      { type: "encourage", text: "Repair attempts after rupture" },
      { type: "prohibit", text: "Reinforcement of implausible beliefs" },
    ],
    maxIntensity: 70, pacing: "slow",
  },
  {
    id: "leadership-crucible", name: "Leadership Crucible", scope: "project",
    desc: "Challenging, direct, accountability-focused. For rites-of-passage, leadership development, and capacity-building where growth requires pressure.",
    color: "#EF4444", status: "active",
    affect: { warmth: 50, energy: 75, tone: 30, direct: 90, challenge: 85, ritual: 60 },
    guardrails: ["no-coercion","anti-sycophancy","autonomy","no-shame","consent-boundaries"],
    norms: [
      { type: "encourage", text: "Direct, specific feedback grounded in observation" },
      { type: "require", text: "Restorative closure after challenge" },
      { type: "prohibit", text: "Shaming as motivational strategy" },
    ],
    maxIntensity: 85, pacing: "dynamic",
  },
  {
    id: "ceremony-container", name: "Ceremony Container", scope: "experience",
    desc: "Sacred, slow, high ritual intensity. The room tone for ceremonies, rites, and group containers where participants enter a shared liminal space together.",
    color: "#10B981", status: "active",
    affect: { warmth: 75, energy: 20, tone: 10, direct: 35, challenge: 30, ritual: 95 },
    guardrails: ["no-coercion","antibypass","reality-testing","consent-boundaries","no-shame","trauma-informed"],
    norms: [
      { type: "require", text: "Tone signaled before entry" },
      { type: "require", text: "Cultural sensitivity acknowledgment" },
      { type: "encourage", text: "Collective synchrony and grounding" },
      { type: "prohibit", text: "Breaking container without group consent" },
    ],
    maxIntensity: 50, pacing: "slow",
  },
  {
    id: "arena-mode", name: "Arena Mode", scope: "experience",
    desc: "Competitive, electric, high energy. For game sessions, challenges, and adversarial experiences — always nested inside the deeper cooperative frame.",
    color: "#F97316", status: "active",
    affect: { warmth: 35, energy: 95, tone: 70, direct: 80, challenge: 90, ritual: 20 },
    guardrails: ["no-coercion","no-extraction","autonomy","no-shame"],
    norms: [
      { type: "require", text: "Restorative closure after competition" },
      { type: "require", text: "Cooperation constraint — no undermining network trust" },
      { type: "prohibit", text: "Humiliation or sabotage" },
    ],
    maxIntensity: 95, pacing: "fast",
  },
  {
    id: "gentle-guide", name: "Gentle Guide", scope: "agent",
    desc: "Warm, patient, nurturing. For holding space, reflective questioning, and supporting growth without pushing. Uses autonomy-supportive conversational moves.",
    color: "#EC4899", status: "active",
    affect: { warmth: 90, energy: 20, tone: 50, direct: 25, challenge: 15, ritual: 35 },
    guardrails: ["no-coercion","anti-sycophancy","crisis-pathway","consent-boundaries"],
    norms: [
      { type: "encourage", text: "Reflective listening and open questions" },
      { type: "encourage", text: "Autonomy-supportive questioning" },
      { type: "prohibit", text: "Unsolicited advice or direction" },
    ],
    maxIntensity: 40, pacing: "slow",
  },
  {
    id: "fierce-ally", name: "Fierce Ally", scope: "agent",
    desc: "Direct, challenging, deeply caring. Sees potential and refuses to let you settle. Precise, invested, honest — the demanding friend who holds you accountable.",
    color: "#A855F7", status: "active",
    affect: { warmth: 60, energy: 70, tone: 35, direct: 85, challenge: 80, ritual: 30 },
    guardrails: ["no-coercion","anti-sycophancy","autonomy","no-shame"],
    norms: [
      { type: "encourage", text: "Direct, specific feedback" },
      { type: "require", text: "Care must be evident even in challenge" },
      { type: "prohibit", text: "Mockery, derision, or contempt" },
    ],
    maxIntensity: 80, pacing: "dynamic",
  },
];

// ── Sub-components ──────────────────────────────────────────────────────────

function VibeCard({ v, onClick }: { v: Vibe; onClick: () => void }) {
  const s = SCOPE_META[v.scope];
  return (
    <button onClick={onClick} className="bg-card border border-card-border rounded-xl p-5 text-left hover:border-accent/50 transition-all hover:bg-white/[0.04] group" style={{ borderLeftWidth: 3, borderLeftColor: s.color }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-semibold truncate">{v.name}</span>
            <span className="text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: s.color + "20", color: s.color }}>{s.label}</span>
          </div>
          <p className="text-xs text-muted line-clamp-2 leading-relaxed">{v.desc}</p>
        </div>
        <Icon icon="lucide:chevron-right" className="text-muted shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" width={14} />
      </div>
      {/* Mini affect bars */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
        {AFFECT_DIMS.map(d => (
          <div key={d.key} className="flex items-center gap-1.5">
            <span className="text-[8px] text-muted w-[42px] text-right shrink-0">{d.label}</span>
            <div className="flex-1 h-[3px] bg-white/[0.08] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${v.affect[d.key]}%`, backgroundColor: s.color }} />
            </div>
            <span className="text-[8px] text-muted w-3 shrink-0">{v.affect[d.key]}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        <span className="text-[9px] text-muted bg-white/[0.04] px-2 py-0.5 rounded-full">{v.guardrails.length} guardrails</span>
        <span className="text-[9px] text-muted bg-white/[0.04] px-2 py-0.5 rounded-full">{v.norms.length} norms</span>
        <span className="text-[9px] text-muted bg-white/[0.04] px-2 py-0.5 rounded-full">{v.pacing}</span>
      </div>
    </button>
  );
}

function AffectSlider({ dim, value, onChange, accentColor }: { dim: typeof AFFECT_DIMS[number]; value: number; onChange: (v: number) => void; accentColor: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-semibold text-foreground">{dim.label}</span>
        <span className="text-xs font-bold" style={{ color: accentColor }}>{value}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-muted w-[60px] text-right">{dim.lo}</span>
        <input type="range" min={0} max={100} value={value} onChange={e => onChange(parseInt(e.target.value))}
          className="flex-1 h-1 appearance-none bg-white/[0.08] rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
          style={{ accentColor }} />
        <span className="text-[10px] text-muted w-[60px]">{dim.hi}</span>
      </div>
    </div>
  );
}

// ── Vibe Editor ─────────────────────────────────────────────────────────────

function VibeEditor({ vibe, isNew, onBack, onSave, onDelete }: {
  vibe?: Vibe; isNew: boolean; onBack: () => void;
  onSave: (v: Vibe) => void; onDelete?: (id: string) => void;
}) {
  const [name, setName] = useState(vibe?.name || "");
  const [scope, setScope] = useState<Scope>(vibe?.scope || "experience");
  const [desc, setDesc] = useState(vibe?.desc || "");
  const [vColor, setVColor] = useState(vibe?.color || SCOPE_META.experience.color);
  const [affect, setAffect] = useState<Record<string, number>>(vibe?.affect || { warmth: 50, energy: 50, tone: 50, direct: 50, challenge: 50, ritual: 50 });
  const [guardrails, setGuardrails] = useState<string[]>(vibe?.guardrails || ["no-coercion", "autonomy", "no-shame", "consent-boundaries"]);
  const [norms, setNorms] = useState<Norm[]>(vibe?.norms || []);
  const [maxInt, setMaxInt] = useState(vibe?.maxIntensity ?? 70);
  const [pacing, setPacing] = useState(vibe?.pacing || "adaptive");
  const [tab, setTab] = useState("identity");
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [newNormText, setNewNormText] = useState("");
  const [newNormType, setNewNormType] = useState<Norm["type"]>("encourage");

  const COLOR_OPTS = ["#F59E0B","#3B82F6","#8B5CF6","#10B981","#EC4899","#EF4444","#06B6D4","#F97316","#A855F7","#6FC3FF","#A8E063","#F7DC6F"];
  const PACING_OPTS = [
    { id: "slow", label: "Slow", desc: "Contemplative, measured" },
    { id: "adaptive", label: "Adaptive", desc: "Context-responsive" },
    { id: "dynamic", label: "Dynamic", desc: "Active, varied rhythm" },
    { id: "fast", label: "Fast", desc: "Energetic, rapid-fire" },
  ];

  const toggleGuardrail = (id: string) => setGuardrails(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  const sm = SCOPE_META[scope];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      onSave({ id: vibe?.id || name.toLowerCase().replace(/\s+/g, "-"), name, scope, desc, color: vColor, status: "active", affect, guardrails, norms, maxIntensity: maxInt, pacing });
      setSaving(false);
    }, 400);
  };

  const addNorm = () => {
    if (newNormText.trim()) {
      setNorms([...norms, { type: newNormType, text: newNormText.trim() }]);
      setNewNormText("");
    }
  };

  const TABS = [
    { id: "identity", label: "Identity" },
    { id: "affect",   label: "Affect Posture" },
    { id: "norms",    label: "Norms & Guardrails" },
  ];

  const normColor = (type: string) => type === "encourage" ? "#22c55e" : type === "require" ? "#3b82f6" : "#ef4444";

  return (
    <div className="max-w-[720px]">
      {/* Header */}
      <div className="mb-6">
        <button onClick={onBack} className="text-muted hover:text-white text-sm flex items-center gap-1.5 mb-3 transition-colors">
          <Icon icon="lucide:arrow-left" width={14} /> Back to Library
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">{isNew ? "New Vibe" : `Edit: ${vibe!.name}`}</h1>
          {!isNew && <span className="text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ backgroundColor: sm.color + "20", color: sm.color }}>{sm.label}</span>}
        </div>
        <p className="text-muted text-sm mt-1">{isNew ? "Create a reusable vibe contract that agents and experiences can embody" : "Changes cascade to all agents and experiences using this vibe"}</p>
      </div>

      {/* Tab bar */}
      <div className="flex bg-card border border-card-border rounded-xl overflow-hidden mb-6">
        {TABS.map((t, i) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === t.id ? "bg-accent/15 text-accent" : "text-muted hover:text-white"} ${i < TABS.length - 1 ? "border-r border-card-border" : ""}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Identity Tab ── */}
      {tab === "identity" && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Name</label>
            <p className="text-[11px] text-muted mb-2">The name for this vibe contract — shown when attaching to agents or experiences.</p>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Gentle Guide"
              className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Scope</label>
            <p className="text-[11px] text-muted mb-2">Which level of the hierarchy this vibe operates at. Higher scopes constrain lower ones.</p>
            <div className="flex flex-wrap gap-2">
              {SCOPES.map(s => {
                const m = SCOPE_META[s];
                return (
                  <button key={s} onClick={() => { setScope(s); setVColor(m.color); }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border transition-colors text-sm ${scope === s ? "border-transparent" : "border-card-border text-muted hover:text-white"}`}
                    style={scope === s ? { backgroundColor: m.color + "18", color: m.color, borderColor: m.color + "44" } : {}}>
                    <Icon icon={m.icon} width={14} />
                    <span className={scope === s ? "font-semibold" : ""}>{m.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-muted mt-2">{SCOPE_META[scope].desc}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Description</label>
            <p className="text-[11px] text-muted mb-2">What this vibe contract embodies — the emotional, relational, and social physics it creates.</p>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
              placeholder="e.g. A warm, patient environment for reflective growth…"
              className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 resize-y leading-relaxed" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTS.map(c => (
                <button key={c} onClick={() => setVColor(c)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                  style={{ backgroundColor: c, border: vColor === c ? "3px solid white" : "3px solid transparent", outline: vColor === c ? `2px solid ${c}` : "none" }} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors">{saving ? "Saving…" : isNew ? "Create Vibe" : "Save Changes"}</button>
            <button onClick={onBack} className="border border-card-border text-muted hover:text-white px-5 py-2.5 rounded-full transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* ── Affect Posture Tab ── */}
      {tab === "affect" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Affect Dimensions</h3>
            <p className="text-xs text-muted mb-5 leading-relaxed">Set the emotional coordinates for this vibe. These dimensions shape how agents express themselves — their tone, pacing, and relational style.</p>
            <div className="space-y-5">
              {AFFECT_DIMS.map(d => (
                <AffectSlider key={d.key} dim={d} value={affect[d.key]} accentColor={sm.color}
                  onChange={val => setAffect({ ...affect, [d.key]: val })} />
              ))}
            </div>
          </div>

          <div className="border-t border-card-border pt-6">
            <h3 className="text-sm font-semibold text-white mb-1">Expression Bounds</h3>
            <p className="text-xs text-muted mb-4 leading-relaxed">Set limits on how intensely this vibe can express, and the pacing style agents should use.</p>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-semibold text-foreground">Maximum Intensity</label>
                  <span className="text-xs font-bold" style={{ color: sm.color }}>{maxInt}%</span>
                </div>
                <p className="text-[11px] text-muted mb-2">Even high-energy personas stay within this bound.</p>
                <input type="range" min={10} max={100} value={maxInt} onChange={e => setMaxInt(parseInt(e.target.value))}
                  className="w-full h-1 appearance-none bg-white/[0.08] rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                  style={{ accentColor: sm.color }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Pacing Style</label>
                <p className="text-[11px] text-muted mb-2">How the agent modulates conversational rhythm.</p>
                <div className="flex flex-wrap gap-2">
                  {PACING_OPTS.map(p => (
                    <button key={p.id} onClick={() => setPacing(p.id)}
                      className={`px-3.5 py-2 rounded-lg border text-left transition-colors ${pacing === p.id ? "" : "border-card-border text-muted hover:text-white"}`}
                      style={pacing === p.id ? { backgroundColor: sm.color + "18", borderColor: sm.color + "44", color: sm.color } : {}}>
                      <div className={`text-xs ${pacing === p.id ? "font-semibold" : ""}`}>{p.label}</div>
                      <div className="text-[10px] text-muted mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors">{saving ? "Saving…" : "Save Changes"}</button>
            <button onClick={onBack} className="border border-card-border text-muted hover:text-white px-5 py-2.5 rounded-full transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* ── Norms & Guardrails Tab ── */}
      {tab === "norms" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Hard Guardrails</h3>
            <p className="text-xs text-muted mb-4 leading-relaxed">Non-negotiable constraints enforced at runtime — agents cannot override them. Higher-scope guardrails are inherited automatically.</p>
            <div className="space-y-2">
              {GUARDRAIL_DEFS.map(g => {
                const on = guardrails.includes(g.id);
                return (
                  <button key={g.id} onClick={() => toggleGuardrail(g.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left ${on ? "bg-card border-card-border" : "border-white/[0.04] hover:border-card-border"}`}>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${on ? "" : "border-white/20"}`}
                      style={on ? { borderColor: sm.color, backgroundColor: sm.color + "25" } : {}}>
                      {on && <Icon icon="lucide:check" width={12} style={{ color: sm.color }} />}
                    </div>
                    <span className={`text-xs flex-1 ${on ? "text-foreground" : "text-muted"}`}>{g.label}</span>
                    <span className="text-[9px] text-muted bg-white/[0.04] px-1.5 py-0.5 rounded">{g.cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-card-border pt-6">
            <h3 className="text-sm font-semibold text-white mb-1">Relational Norms</h3>
            <p className="text-xs text-muted mb-4 leading-relaxed">Soft norms that shape interaction patterns. Encouraged behaviors are modeled; required behaviors are enforced; prohibited behaviors are blocked.</p>
            {norms.length > 0 && (
              <div className="space-y-2 mb-4">
                {norms.map((n, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 bg-card border border-card-border rounded-lg">
                    <span className="text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded shrink-0" style={{ backgroundColor: normColor(n.type) + "18", color: normColor(n.type) }}>{n.type}</span>
                    <span className="text-xs text-muted flex-1">{n.text}</span>
                    <button onClick={() => setNorms(norms.filter((_, j) => j !== i))} className="text-muted hover:text-white text-sm transition-colors">✕</button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 items-center bg-card border border-card-border rounded-lg px-3 py-2.5">
              <select value={newNormType} onChange={e => setNewNormType(e.target.value as Norm["type"])}
                className="bg-background border border-card-border rounded-md px-2 py-1.5 text-[11px] text-muted outline-none">
                <option value="encourage">Encourage</option>
                <option value="require">Require</option>
                <option value="prohibit">Prohibit</option>
              </select>
              <input value={newNormText} onChange={e => setNewNormText(e.target.value)} placeholder="Add a relational norm…"
                onKeyDown={e => e.key === "Enter" && addNorm()}
                className="flex-1 bg-background border border-card-border rounded-md px-3 py-1.5 text-xs text-foreground placeholder:text-muted outline-none focus:border-accent/50" />
              <button onClick={addNorm} className="text-xs text-accent hover:text-white border border-card-border px-3 py-1.5 rounded-md transition-colors">Add</button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors">{saving ? "Saving…" : "Save Changes"}</button>
            <button onClick={onBack} className="border border-card-border text-muted hover:text-white px-5 py-2.5 rounded-full transition-colors">Cancel</button>
          </div>

          {!isNew && (
            <div className="border-t border-red-500/20 pt-6 mt-6">
              <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3">Danger Zone</h3>
              {!confirmDel ? (
                <>
                  <p className="text-xs text-muted mb-3">Removing this vibe detaches it from all agents and experiences currently using it.</p>
                  <button onClick={() => setConfirmDel(true)} className="text-red-500 border border-red-500/30 hover:bg-red-500/10 px-4 py-2 rounded-lg text-xs font-semibold transition-colors">Delete Vibe</button>
                </>
              ) : (
                <>
                  <p className="text-xs text-red-400 font-medium mb-3">Delete &quot;{vibe!.name}&quot; and detach from all references?</p>
                  <div className="flex gap-2">
                    <button onClick={() => { onDelete?.(vibe!.id); onBack(); }} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors">Confirm Delete</button>
                    <button onClick={() => setConfirmDel(false)} className="border border-card-border text-muted hover:text-white px-4 py-2 rounded-lg text-xs transition-colors">Cancel</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function VibesPage() {
  const [vibes, setVibes] = useState<Vibe[]>(VIBES_INIT);
  const [view, setView] = useState<string | null>(null);
  const [scopeFilter, setScopeFilter] = useState<string>("all");
  const [mainTab, setMainTab] = useState("library");

  // Editor handlers
  const handleSave = (v: Vibe) => {
    if (vibes.find(vb => vb.id === v.id)) setVibes(vibes.map(vb => vb.id === v.id ? v : vb));
    else setVibes([...vibes, v]);
    setView(null);
  };
  const handleDelete = (id: string) => setVibes(vibes.filter(v => v.id !== id));

  // ── Editor views ──
  if (view === "new") return <VibeEditor isNew onBack={() => setView(null)} onSave={handleSave} />;
  const editVibe = vibes.find(v => v.id === view);
  if (editVibe) return <VibeEditor vibe={editVibe} isNew={false} onBack={() => setView(null)} onSave={handleSave} onDelete={handleDelete} />;

  // ── Dashboard ──
  const filtered = scopeFilter === "all" ? vibes : vibes.filter(v => v.scope === scopeFilter);
  const totalGuardrails = new Set(vibes.flatMap(v => v.guardrails)).size;
  const totalNorms = vibes.reduce((s, v) => s + v.norms.length, 0);

  // Cascade data
  const cascadePath = [
    { scope: "network", vibeId: "kinship-constitution" },
    { scope: "platform", vibeId: "growth-space" },
    { scope: "project", vibeId: "shadow-integration" },
    { scope: "experience", vibeId: "ceremony-container" },
    { scope: "agent", vibeId: "gentle-guide" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Vibes</h1>
          <p className="text-muted mt-1">Define the relational norms, affective tone, and social physics of your ecosystem</p>
        </div>
        <button onClick={() => setView("new")} className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-2">
          <Icon icon="lucide:plus" width={16} /> Create Vibe
        </button>
      </div>

      {/* Main Tabs */}
      <div className="flex bg-card border border-card-border rounded-xl overflow-hidden mb-6">
        {([
          { id: "library",   label: "Library",   icon: "lucide:layout-grid" },
          { id: "cascade",   label: "Cascade",   icon: "lucide:git-merge" },
          { id: "scorecard", label: "Scorecard",  icon: "lucide:activity" },
        ] as const).map((t, i) => (
          <button key={t.id} onClick={() => setMainTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${mainTab === t.id ? "bg-accent/15 text-accent" : "text-muted hover:text-white"} ${i < 2 ? "border-r border-card-border" : ""}`}>
            <Icon icon={t.icon} width={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Library Tab ── */}
      {mainTab === "library" && (
        <>
          {/* Scope filter pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            <button onClick={() => setScopeFilter("all")}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${scopeFilter === "all" ? "border-accent bg-accent/15 text-accent font-semibold" : "border-card-border text-muted hover:text-white"}`}>
              All ({vibes.length})
            </button>
            {SCOPES.map(s => {
              const m = SCOPE_META[s];
              const c = vibes.filter(v => v.scope === s).length;
              return (
                <button key={s} onClick={() => setScopeFilter(s)}
                  className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full border transition-colors ${scopeFilter === s ? "font-semibold" : "border-card-border text-muted hover:text-white"}`}
                  style={scopeFilter === s ? { borderColor: m.color + "66", backgroundColor: m.color + "15", color: m.color } : {}}>
                  <Icon icon={m.icon} width={12} />
                  {m.label} ({c})
                </button>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {[
              { label: "Total Vibes",   value: String(vibes.length),                                      icon: "lucide:sparkles",        color: "#EB8000" },
              { label: "Guardrails",     value: String(totalGuardrails),                                   icon: "lucide:shield",          color: "#22c55e" },
              { label: "Norms",          value: String(totalNorms),                                        icon: "lucide:heart-handshake", color: "#a855f7" },
              { label: "Scope Coverage", value: new Set(vibes.map(v => v.scope)).size + "/5",              icon: "lucide:layers",          color: "#06b6d4" },
              { label: "Active",         value: String(vibes.filter(v => v.status === "active").length),   icon: "lucide:zap",             color: "#f59e0b" },
            ].map((s, i) => (
              <div key={i} className="bg-card border border-card-border rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon icon={s.icon} width={13} style={{ color: s.color }} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted">{s.label}</span>
                </div>
                <div className="text-xl font-bold text-white">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Section label */}
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Vibe Contracts ({filtered.length})</h2>
            <div className="h-px bg-card-border mt-2" />
          </div>

          {/* Vibes grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(v => <VibeCard key={v.id} v={v} onClick={() => setView(v.id)} />)}
            <button onClick={() => setView("new")}
              className="border-2 border-dashed border-card-border rounded-xl flex flex-col items-center justify-center gap-2 py-12 text-muted hover:border-accent hover:text-accent transition-colors min-h-[180px]">
              <Icon icon="lucide:plus-circle" width={24} />
              <span className="text-sm">Create Vibe</span>
            </button>
          </div>
        </>
      )}

      {/* ── Cascade Tab ── */}
      {mainTab === "cascade" && (() => {
        const effGuardrails = new Set<string>();
        const effNorms: Norm[] = [];
        const effAffect: Record<string, number> = {};
        AFFECT_DIMS.forEach(d => { effAffect[d.key] = 0; });
        let cnt = 0;
        cascadePath.forEach(({ vibeId }) => {
          const v = vibes.find(vb => vb.id === vibeId);
          if (v) {
            v.guardrails.forEach(g => effGuardrails.add(g));
            v.norms.forEach(n => effNorms.push(n));
            AFFECT_DIMS.forEach(d => { effAffect[d.key] += v.affect[d.key]; });
            cnt++;
          }
        });
        if (cnt > 0) AFFECT_DIMS.forEach(d => { effAffect[d.key] = Math.round(effAffect[d.key] / cnt); });

        return (
          <div>
            <div className="bg-card border border-card-border rounded-xl p-5 mb-6">
              <p className="text-xs text-muted leading-relaxed">
                Vibes cascade like CSS: each level inherits from above, adds its own constraints, and passes an <span className="text-accent font-semibold">effective vibe contract</span> downward. Invariants are non-negotiable; local expression is flexible within bounds. When an agent enters a new context, a <span className="text-accent font-semibold">vibe handshake</span> computes which parts of its persona are admissible.
              </p>
            </div>

            {/* Cascade levels */}
            <div className="flex flex-col">
              {cascadePath.map(({ scope, vibeId }, i) => {
                const sm = SCOPE_META[scope];
                const v = vibes.find(vb => vb.id === vibeId);
                if (!v) return null;
                return (
                  <div key={scope}>
                    <div className="bg-card border rounded-xl p-5" style={{ borderColor: sm.color + "33", borderLeftWidth: 3, borderLeftColor: sm.color }}>
                      <div className="flex items-center gap-2.5 mb-2">
                        <Icon icon={sm.icon} width={14} style={{ color: sm.color }} />
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: sm.color }}>{sm.label}</span>
                        <span className="text-sm font-semibold text-white">{v.name}</span>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed mb-2.5">{v.desc}</p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: sm.color + "12", color: sm.color }}>{v.guardrails.length} guardrails</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: sm.color + "12", color: sm.color }}>{v.norms.length} norms</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: sm.color + "12", color: sm.color }}>max {v.maxIntensity}%</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ backgroundColor: sm.color + "12", color: sm.color }}>{v.pacing}</span>
                      </div>
                    </div>
                    {i < cascadePath.length - 1 && (
                      <div className="flex justify-center py-1">
                        <div className="w-0.5 h-5 bg-card-border" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Arrow to effective contract */}
            <div className="flex justify-center py-1.5">
              <div className="w-0.5 h-6 bg-accent" />
            </div>

            {/* Effective Contract */}
            <div className="rounded-xl p-6 border-2" style={{ backgroundColor: "rgba(235,128,0,0.06)", borderColor: "rgba(235,128,0,0.3)" }}>
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="lucide:shield-check" width={16} className="text-accent" />
                <span className="text-sm font-bold text-accent">Effective Vibe Contract</span>
                <span className="text-[10px] text-muted">— computed at runtime for this path</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted mb-3">Affect Blend</h4>
                  <div className="space-y-1.5">
                    {AFFECT_DIMS.map(d => (
                      <div key={d.key} className="flex items-center gap-2">
                        <span className="text-[9px] text-muted w-[50px] text-right">{d.label}</span>
                        <div className="flex-1 h-1 bg-white/[0.08] rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${effAffect[d.key]}%` }} />
                        </div>
                        <span className="text-[9px] text-accent font-semibold w-4">{effAffect[d.key]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted mb-3">Active Guardrails ({effGuardrails.size})</h4>
                  <div className="space-y-1">
                    {[...effGuardrails].slice(0, 8).map(gId => {
                      const g = GUARDRAIL_DEFS.find(gd => gd.id === gId);
                      return g ? (
                        <div key={gId} className="flex items-center gap-1.5 text-[10px] text-muted">
                          <span className="text-green-500 text-[6px]">●</span> {g.label.split("—")[0].trim()}
                        </div>
                      ) : null;
                    })}
                    {effGuardrails.size > 8 && <span className="text-[10px] text-muted">+{effGuardrails.size - 8} more</span>}
                  </div>
                </div>
              </div>
              <div className="border-t border-card-border mt-4 pt-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted mb-3">Accumulated Norms ({effNorms.length})</h4>
                <div className="flex flex-wrap gap-1.5">
                  {effNorms.map((n, i) => {
                    const tc = n.type === "encourage" ? "#22c55e" : n.type === "require" ? "#3b82f6" : "#ef4444";
                    return <span key={i} className="text-[9px] px-2 py-0.5 rounded-md border" style={{ backgroundColor: tc + "12", color: tc, borderColor: tc + "22" }}>{n.type}: {n.text}</span>;
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Scorecard Tab ── */}
      {mainTab === "scorecard" && (
        <div>
          <div className="bg-card border border-card-border rounded-xl p-5 mb-6">
            <p className="text-xs text-muted leading-relaxed">
              The Vibes Scorecard monitors ecosystem health in real time. Every interaction feeds the measurement layer — a multi-objective system that treats vibes as <span className="text-accent font-semibold">control variables</span>, not aesthetic labels. No single metric is optimized in isolation; the system maintains a Pareto balance with hard constraints.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Health Metrics</h2>
            <div className="h-px bg-card-border mt-2" />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Affect Coherence",    value: "94%",  desc: "Agent expressions match vibe contracts",  icon: "lucide:heart-pulse",    color: "#22c55e" },
              { label: "Guardrail Compliance", value: "100%", desc: "Zero runtime violations detected",       icon: "lucide:shield-check",   color: "#22c55e" },
              { label: "Sycophancy Risk",      value: "Low",  desc: "Truth-over-agreement ratio healthy",     icon: "lucide:alert-triangle", color: "#22c55e" },
              { label: "Psychological Safety",  value: "87%", desc: "Group risk-taking without punishment",   icon: "lucide:users",          color: "#3b82f6" },
              { label: "Alliance Proxy",        value: "82%", desc: "Digital therapeutic alliance measure",   icon: "lucide:handshake",      color: "#a855f7" },
              { label: "Repair Success",        value: "91%", desc: "Rupture-and-repair completion rate",     icon: "lucide:heart",          color: "#06b6d4" },
            ].map((m, i) => (
              <div key={i} className="bg-card border border-card-border rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon icon={m.icon} width={13} style={{ color: m.color }} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted">{m.label}</span>
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: m.color }}>{m.value}</div>
                <p className="text-[11px] text-muted">{m.desc}</p>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Monitoring Signals</h2>
            <div className="h-px bg-card-border mt-2" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { label: "Dialogue Signals",  items: ["Toxicity & harassment detection", "Coercion markers", "Consent & boundary violations", "Repair attempts", "Validation vs escalation"], color: "#22c55e" },
              { label: "Relational Process", items: ["Turn-taking fairness", "Responsiveness & attunement", "Escalation trajectories", "Non-shaming feedback patterns"], color: "#3b82f6" },
              { label: "Epistemic Risk",     items: ["Hallucination risk in factual claims", "Sycophancy markers", "Implausible belief reinforcement", "Confident fabrication detection"], color: "#a855f7" },
              { label: "Safety Signals",     items: ["Self-harm ideation detection", "Crisis indicators & escalation", "Delusion escalation patterns", "Vulnerable user detection"], color: "#ef4444" },
            ].map((cat, i) => (
              <div key={i} className="bg-card border border-card-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs font-bold text-white">{cat.label}</span>
                </div>
                <div className="space-y-1.5">
                  {cat.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-2 text-[11px] text-muted">
                      <span className="text-[6px]" style={{ color: cat.color }}>●</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Enforcement Layers</h2>
            <div className="h-px bg-card-border mt-2" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Compile-Time", desc: "Creator-time validation: flag disallowed vibe combinations before deployment (e.g. high spiritual authority + high intimacy + no reality-check guardrails).", icon: "lucide:check-circle", color: "#22c55e" },
              { label: "Runtime Guardrails", desc: "Every message passes through input interpretation, generation, and output evaluation. Responses violating constraints are blocked or rewritten.", icon: "lucide:shield", color: "#3b82f6" },
              { label: "Vibe Repair", desc: "When rupture occurs: pause escalation, reflect, restore consent, offer choices (continue, break, switch agents, human moderator), log for learning.", icon: "lucide:refresh-ccw", color: "#a855f7" },
            ].map((e, i) => (
              <div key={i} className="bg-card border border-card-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon icon={e.icon} width={14} style={{ color: e.color }} />
                  <span className="text-xs font-bold text-white">{e.label}</span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
