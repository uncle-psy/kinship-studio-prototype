"use client";

import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import type { Presence, KnowledgeBase, Prompt } from "@/lib/types";

// ─── Signals ──────────────────────────────────────────────────────────────────
const ALL_SIGNALS = [
  { signalId: "health",        name: "Health",        letter: "H",  color: "#ef4444" },
  { signalId: "empathy",       name: "Empathy",       letter: "E",  color: "#f97316" },
  { signalId: "aspiration",    name: "Aspiration",    letter: "A",  color: "#f59e0b" },
  { signalId: "resilience",    name: "Resilience",    letter: "R",  color: "#22c55e" },
  { signalId: "thinking",      name: "Thinking",      letter: "T",  color: "#3b82f6" },
  { signalId: "self-identity", name: "Self-Identity", letter: "Si", color: "#a855f7" },
  { signalId: "social",        name: "Social",        letter: "So", color: "#ec4899" },
];

// ─── Themes ───────────────────────────────────────────────────────────────────
const THEMES = [
  {
    id: "twilight", name: "Twilight", description: "Deep blues and teals — the default",
    accent: "#4CADA8", bg: "#0f1117", surface: "#1a1d28", textFont: "Inter", displayFont: "Geist",
    swatches: ["#4CADA8", "#0f1117", "#1a1d28", "#6ee7e0"],
  },
  {
    id: "ember", name: "Ember", description: "Warm ambers and burnt oranges",
    accent: "#f97316", bg: "#120a06", surface: "#1e1108", textFont: "Geist", displayFont: "Geist",
    swatches: ["#f97316", "#120a06", "#1e1108", "#fb923c"],
  },
  {
    id: "aurora", name: "Aurora", description: "Vibrant purples and electric greens",
    accent: "#a855f7", bg: "#0d0a18", surface: "#150f28", textFont: "Space Grotesk", displayFont: "Space Grotesk",
    swatches: ["#a855f7", "#0d0a18", "#150f28", "#c084fc"],
  },
  {
    id: "slate", name: "Slate", description: "Clean neutral grays, minimal feel",
    accent: "#94a3b8", bg: "#0d0f12", surface: "#13161c", textFont: "Geist Mono", displayFont: "Geist Mono",
    swatches: ["#94a3b8", "#0d0f12", "#13161c", "#cbd5e1"],
  },
  {
    id: "rose", name: "Rose", description: "Soft pinks and electric magentas",
    accent: "#ec4899", bg: "#130810", surface: "#1e1018", textFont: "Lora", displayFont: "Playfair Display",
    swatches: ["#ec4899", "#130810", "#1e1018", "#f472b6"],
  },
  {
    id: "forest", name: "Forest", description: "Earthy greens and deep wood tones",
    accent: "#22c55e", bg: "#080e0a", surface: "#0e1812", textFont: "Lora", displayFont: "Lora",
    swatches: ["#22c55e", "#080e0a", "#0e1812", "#4ade80"],
  },
];

// ─── Mock data ─────────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: "u1", name: "Jordan Kim",     email: "jordan@kinship.studio", role: "owner",  joined: "Jan 15, 2024", initials: "JK", color: "#4CADA8" },
  { id: "u2", name: "Alex Chen",      email: "alex@kinship.studio",   role: "admin",  joined: "Feb 20, 2024", initials: "AC", color: "#f97316" },
  { id: "u3", name: "Maya Rodriguez", email: "maya@kinship.studio",   role: "member", joined: "Mar 10, 2024", initials: "MR", color: "#a855f7" },
  { id: "u4", name: "Taylor Wong",    email: "taylor@kinship.studio", role: "member", joined: "Apr 5, 2024",  initials: "TW", color: "#ec4899" },
];

const INITIAL_APPROVALS = [
  { id: "a1", type: "knowledge-base", typeLabel: "Knowledge Base", name: "World History KB",            submittedBy: "Alex Chen",      date: "Mar 5, 2026",  status: "pending" },
  { id: "a2", type: "experience",     typeLabel: "Experience",     name: "Ancient Civilizations Quest", submittedBy: "Maya Rodriguez", date: "Mar 6, 2026",  status: "pending" },
  { id: "a3", type: "actor",          typeLabel: "Actor",          name: "Professor Aldric",            submittedBy: "Alex Chen",      date: "Mar 4, 2026",  status: "pending" },
  { id: "a4", type: "prompt",         typeLabel: "System Prompt",  name: "Socratic Tutor v2",           submittedBy: "Taylor Wong",    date: "Mar 7, 2026",  status: "pending" },
  { id: "a5", type: "project",        typeLabel: "Project",        name: "Ocean Explorers",             submittedBy: "Maya Rodriguez", date: "Mar 6, 2026",  status: "pending" },
  { id: "a6", type: "knowledge-base", typeLabel: "Knowledge Base", name: "Marine Biology v1",           submittedBy: "Taylor Wong",    date: "Mar 3, 2026",  status: "approved" },
  { id: "a7", type: "actor",          typeLabel: "Actor",          name: "The Cartographer",            submittedBy: "Jordan Kim",     date: "Mar 1, 2026",  status: "approved" },
];

const INITIAL_PROJECTS: Project[] = [
  { id: "p1", name: "Mapshifting",          description: "Interactive map-based exploration game", visibility: "private", owner: "Jordan Kim",     createdAt: "Jan 2024" },
  { id: "p2", name: "Ocean Explorers",      description: "Deep sea adventure with marine biology", visibility: "pending", owner: "Maya Rodriguez", createdAt: "Feb 2026" },
  { id: "p3", name: "Time Travelers Guild", description: "Collaborative history exploration",       visibility: "public",  owner: "Alex Chen",      createdAt: "Nov 2024" },
];

const TYPE_COLORS: Record<string, string> = {
  "knowledge-base": "#3b82f6",
  "experience":     "#f59e0b",
  "actor":          "#4CADA8",
  "prompt":         "#a855f7",
  "project":        "#22c55e",
};

const VISIBILITY_CONFIG = {
  secret:  { label: "Secret",           icon: "lucide:lock-keyhole", color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20" },
  private: { label: "Private",          icon: "lucide:eye-off",      color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  pending: { label: "Pending Approval", icon: "lucide:clock",        color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20" },
  public:  { label: "Public",           icon: "lucide:globe",        color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
};

const HANDLE_RE = /^[a-zA-Z0-9_.]*$/;
const HANDLE_MAX = 50;

type Tab        = "overview" | "theme" | "signals" | "presence" | "users" | "approvals" | "projects" | "danger";
type Visibility = "secret" | "private" | "pending" | "public";

interface Project {
  id: string;
  name: string;
  description: string;
  visibility: Visibility;
  owner: string;
  createdAt: string;
}

const TABS: { id: Tab; label: string; icon: string; danger?: boolean }[] = [
  { id: "overview",  label: "Overview",    icon: "lucide:layout-dashboard" },
  { id: "theme",     label: "Theme",       icon: "lucide:palette" },
  { id: "signals",   label: "Signals",     icon: "lucide:activity" },
  { id: "presence",  label: "Presence",    icon: "lucide:user-round" },
  { id: "users",     label: "Users",       icon: "lucide:users" },
  { id: "approvals", label: "Approvals",   icon: "lucide:check-circle" },
  { id: "projects",  label: "Projects",    icon: "lucide:folder-open" },
  { id: "danger",    label: "Danger Zone", icon: "lucide:triangle-alert", danger: true },
];

// ─── Shared sub-components ────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {subtitle && <p className="text-muted text-sm mt-0.5">{subtitle}</p>}
    </div>
  );
}

function SaveBar({
  saving, flash, onSave, label = "Save Changes",
}: {
  saving: boolean; flash: boolean; onSave: () => void; label?: string;
}) {
  return (
    <div className="flex items-center gap-3 mt-5">
      <button
        onClick={onSave}
        disabled={saving}
        className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2 rounded-full transition-colors flex items-center gap-2 text-sm disabled:opacity-60"
      >
        {saving
          ? <Icon icon="lucide:loader-2" width={14} height={14} className="animate-spin" />
          : <Icon icon="lucide:save" width={14} height={14} />}
        {saving ? "Saving…" : label}
      </button>
      {flash && (
        <p className="text-xs text-green-400 flex items-center gap-1">
          <Icon icon="lucide:check-circle" width={12} height={12} />
          Saved!
        </p>
      )}
    </div>
  );
}

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-6 py-4 border-b border-card-border last:border-0">
      <div className="w-[200px] shrink-0 pt-2">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint && <p className="text-xs text-muted mt-0.5 leading-snug">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // ── Identity ──
  const [platformName, setPlatformName] = useState("Kinship Today");
  const [platformHandle, setPlatformHandle] = useState("kinship_today");
  const [handleError, setHandleError] = useState("");
  const [description, setDescription] = useState("A platform for interactive knowledge experiences and living characters.");
  const [platformIcon, setPlatformIcon] = useState("🌍");
  const [identitySaving, setIdentitySaving] = useState(false);
  const [identityFlash, setIdentityFlash] = useState(false);

  // ── Theme ──
  const [selectedTheme, setSelectedTheme] = useState("twilight");
  const [themeSaving, setThemeSaving] = useState(false);
  const [themeFlash, setThemeFlash] = useState(false);

  // ── Signals ──
  const [enabledSignals, setEnabledSignals] = useState<string[]>(ALL_SIGNALS.map((s) => s.signalId));
  const [signalsSaving, setSignalsSaving] = useState(false);
  const [signalsFlash, setSignalsFlash] = useState(false);

  // ── Presence ──
  const [allPresences, setAllPresences] = useState<Presence[]>([]);
  const [allKBs, setAllKBs] = useState<KnowledgeBase[]>([]);
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [platformPresenceIds, setPlatformPresenceIds] = useState<string[]>([]);
  const [platformKBIds, setPlatformKBIds] = useState<string[]>([]);
  const [platformPromptId, setPlatformPromptId] = useState("");
  const [promptMode, setPromptMode] = useState<"select" | "custom">("select");
  const [customSystemPrompt, setCustomSystemPrompt] = useState("");
  const [presenceSaving, setPresenceSaving] = useState(false);
  const [presenceFlash, setPresenceFlash] = useState(false);

  // ── Users ──
  const [users, setUsers] = useState(INITIAL_USERS);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  // ── Approvals ──
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [approvalTypeFilter, setApprovalTypeFilter] = useState("all");

  // ── Projects ──
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  const flashTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  function triggerFlash(key: string, setter: (v: boolean) => void) {
    setter(true);
    if (flashTimers.current[key]) clearTimeout(flashTimers.current[key]);
    flashTimers.current[key] = setTimeout(() => setter(false), 2500);
  }

  useEffect(() => {
    fetch("/api/presence").then((r) => r.json()).then((d) => setAllPresences(d.presences || [])).catch(() => {});
    fetch("/api/knowledge").then((r) => r.json()).then((d) => setAllKBs(d.knowledgeBases || [])).catch(() => {});
    fetch("/api/prompts").then((r) => r.json()).then((d) => setAllPrompts(d.prompts || [])).catch(() => {});
  }, []);

  // ── Save handlers ──
  async function saveIdentity() {
    if (platformHandle && !HANDLE_RE.test(platformHandle)) {
      setHandleError("Only letters, numbers, _ and . allowed");
      return;
    }
    setIdentitySaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setIdentitySaving(false);
    triggerFlash("identity", setIdentityFlash);
  }

  async function saveTheme() {
    setThemeSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setThemeSaving(false);
    triggerFlash("theme", setThemeFlash);
  }

  async function saveSignals() {
    setSignalsSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSignalsSaving(false);
    triggerFlash("signals", setSignalsFlash);
  }

  async function savePresence() {
    setPresenceSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setPresenceSaving(false);
    triggerFlash("presence", setPresenceFlash);
  }

  function handleApproval(id: string, action: "approve" | "reject") {
    setApprovals((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: action === "approve" ? "approved" : "rejected" } : a)
    );
  }

  function updateProjectVisibility(id: string, v: Visibility) {
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, visibility: v } : p));
  }

  function updateUserRole(id: string, role: string) {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u));
  }

  function removeUser(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  function handleInvite() {
    if (!inviteEmail.trim()) return;
    setUsers((prev) => [
      ...prev,
      {
        id: `u${Date.now()}`,
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
        joined: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        initials: inviteEmail.slice(0, 2).toUpperCase(),
        color: "#64748b",
      },
    ]);
    setInviteEmail("");
    setShowInvite(false);
  }

  const pendingCount = approvals.filter((a) => a.status === "pending").length;

  // ─────────────────────────────────────────────────────────────────────────────
  // Tab: Overview
  // ─────────────────────────────────────────────────────────────────────────────
  function renderOverview() {
    return (
      <div className="space-y-6">
        <SectionHeader title="Overview" subtitle="Platform identity and live metrics" />

        {/* Identity */}
        <div className="bg-card border border-card-border rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
            <Icon icon="lucide:fingerprint" width={16} height={16} className="text-accent" />
            Platform Identity
          </h3>
          <div className="divide-y divide-card-border">
            <FieldRow label="Platform Name">
              <input
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full bg-input border border-card-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent/50"
              />
            </FieldRow>

            <FieldRow label="Handle" hint="@ identifier — letters, numbers, _ and . only, max 50">
              <div className="flex items-center gap-1.5">
                <span className="text-muted text-sm shrink-0">@</span>
                <div className="flex-1 relative">
                  <input
                    value={platformHandle}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^a-zA-Z0-9_.]/g, "").slice(0, HANDLE_MAX);
                      setPlatformHandle(cleaned);
                      setHandleError("");
                    }}
                    maxLength={HANDLE_MAX}
                    className={`w-full bg-input border rounded-xl px-3 py-2 text-sm text-foreground font-mono focus:outline-none pr-16 ${
                      handleError ? "border-red-500/50 focus:border-red-500/70" : "border-card-border focus:border-accent/50"
                    }`}
                  />
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs tabular-nums pointer-events-none ${
                    platformHandle.length >= HANDLE_MAX ? "text-red-400" : "text-muted"
                  }`}>
                    {platformHandle.length}/{HANDLE_MAX}
                  </span>
                </div>
              </div>
              {handleError && <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <Icon icon="lucide:alert-circle" width={11} height={11} />{handleError}
              </p>}
            </FieldRow>

            <FieldRow label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full bg-input border border-card-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent/50 resize-none"
              />
            </FieldRow>

            <FieldRow label="Icon" hint="Emoji or 1–2 char symbol">
              <input
                value={platformIcon}
                onChange={(e) => setPlatformIcon(e.target.value)}
                maxLength={4}
                className="w-20 bg-input border border-card-border rounded-xl px-3 py-2 text-2xl text-center focus:outline-none focus:border-accent/50"
              />
            </FieldRow>

            <FieldRow label="Platform ID" hint="Read-only system identifier">
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-input border border-card-border rounded-xl px-3 py-2 text-xs text-muted font-mono truncate">
                  0a061698-f710-4e2f-901f-32f7f92b4a3d
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText("0a061698-f710-4e2f-901f-32f7f92b4a3d")}
                  className="shrink-0 text-muted hover:text-accent transition-colors p-2 rounded-lg hover:bg-white/[0.05]"
                  title="Copy ID"
                >
                  <Icon icon="lucide:copy" width={14} height={14} />
                </button>
              </div>
            </FieldRow>
          </div>
          <SaveBar saving={identitySaving} flash={identityFlash} onSave={saveIdentity} />
        </div>

        {/* Metrics */}
        <div>
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
            <Icon icon="lucide:bar-chart-2" width={16} height={16} className="text-accent" />
            Platform Metrics
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Assets",          value: "63",                              icon: "lucide:library",        color: "#4CADA8" },
              { label: "Experiences",     value: "1",                               icon: "lucide:compass",        color: "#f97316" },
              { label: "Actors",          value: String(allPresences.length),       icon: "lucide:user-round",     color: "#a855f7" },
              { label: "Knowledge Bases", value: String(allKBs.length),             icon: "lucide:brain",          color: "#3b82f6" },
              { label: "Signals Active",  value: `${enabledSignals.length} / ${ALL_SIGNALS.length}`, icon: "lucide:activity", color: "#22c55e" },
              { label: "Projects",        value: String(projects.length),           icon: "lucide:folder-open",    color: "#f59e0b" },
              { label: "Tokens Used",     value: "24,891",                          icon: "lucide:zap",            color: "#ec4899" },
              { label: "API Calls",       value: "1,247",                           icon: "lucide:arrow-up-right", color: "#94a3b8" },
            ].map((m) => (
              <div key={m.label} className="bg-card border border-card-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${m.color}22` }}>
                    <Icon icon={m.icon} width={13} height={13} style={{ color: m.color }} />
                  </div>
                  <span className="text-xs text-muted">{m.label}</span>
                </div>
                <p className="text-2xl font-bold text-white tabular-nums">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Tab: Theme
  // ─────────────────────────────────────────────────────────────────────────────
  function renderTheme() {
    const current = THEMES.find((t) => t.id === selectedTheme) ?? THEMES[0];
    return (
      <div>
        <SectionHeader title="Theme" subtitle="Choose fonts and colours applied platform-wide" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-6">
          {THEMES.map((theme) => {
            const active = selectedTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`relative text-left p-5 rounded-xl border transition-all ${
                  active
                    ? "border-accent/50 bg-accent/5 shadow-[0_0_0_1px_rgba(76,173,168,0.2)]"
                    : "border-card-border bg-card hover:border-white/20 hover:bg-white/[0.03]"
                }`}
              >
                {active && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                    <Icon icon="lucide:check" width={11} height={11} className="text-white" />
                  </div>
                )}
                <div className="flex gap-1.5 mb-3">
                  {theme.swatches.map((s, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: s }} />
                  ))}
                </div>
                <p className="text-white font-semibold text-sm">{theme.name}</p>
                <p className="text-xs text-muted mt-0.5">{theme.description}</p>
                <div className="flex gap-3 mt-2.5 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Icon icon="lucide:type" width={11} height={11} />
                    {theme.textFont}
                  </span>
                  {theme.displayFont !== theme.textFont && (
                    <span className="flex items-center gap-1">
                      <Icon icon="lucide:heading" width={11} height={11} />
                      {theme.displayFont}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Preview strip */}
        <div className="rounded-xl p-6 border border-white/10 mb-5" style={{ backgroundColor: current.surface }}>
          <p className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: `${current.accent}90` }}>
            Preview — {current.name}
          </p>
          <p className="text-white text-2xl font-bold mb-1">Sample Heading</p>
          <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            Supporting body copy that demonstrates readability at comfortable sizes.
          </p>
          <div className="flex gap-3">
            <button
              className="text-sm font-semibold px-5 py-2 rounded-full text-white"
              style={{ backgroundColor: current.accent }}
            >
              Primary Action
            </button>
            <button
              className="text-sm font-medium px-5 py-2 rounded-full border"
              style={{ color: current.accent, borderColor: `${current.accent}40` }}
            >
              Secondary
            </button>
          </div>
        </div>

        <SaveBar saving={themeSaving} flash={themeFlash} onSave={saveTheme} label="Apply Theme" />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Tab: Signals
  // ─────────────────────────────────────────────────────────────────────────────
  function renderSignals() {
    return (
      <div>
        <SectionHeader title="Signals" subtitle="Select which signals are available across all projects" />

        <div className="bg-card border border-card-border rounded-xl overflow-hidden mb-3">
          {ALL_SIGNALS.map((sig) => {
            const active = enabledSignals.includes(sig.signalId);
            return (
              <div
                key={sig.signalId}
                className="flex items-center gap-4 px-5 py-4 border-b border-card-border last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <button
                  onClick={() =>
                    setEnabledSignals((prev) =>
                      prev.includes(sig.signalId)
                        ? prev.filter((s) => s !== sig.signalId)
                        : [...prev, sig.signalId]
                    )
                  }
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 transition-all ${
                    active ? "opacity-100 scale-100" : "opacity-25 scale-95"
                  }`}
                  style={{ backgroundColor: sig.color }}
                >
                  {sig.letter}
                </button>
                <div className="flex-1">
                  <p className={`text-sm font-medium transition-colors ${active ? "text-white" : "text-muted"}`}>
                    {sig.name}
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                  active ? "bg-green-500/10 text-green-400" : "bg-white/5 text-muted"
                }`}>
                  {active ? "Enabled" : "Disabled"}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted mb-5">
          {enabledSignals.length} of {ALL_SIGNALS.length} signals enabled platform-wide
        </p>

        <SaveBar saving={signalsSaving} flash={signalsFlash} onSave={saveSignals} />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Tab: Presence
  // ─────────────────────────────────────────────────────────────────────────────
  function renderPresence() {
    return (
      <div>
        <SectionHeader title="Platform Presence" subtitle="Actors, knowledge bases, and system prompt available across all projects" />

        <div className="space-y-4">
          {/* Actors */}
          <div className="bg-card border border-card-border rounded-xl p-5">
            <h3 className="text-white font-semibold mb-1 text-sm flex items-center gap-2">
              <Icon icon="lucide:user-round" width={15} height={15} className="text-accent" />
              Platform Actors
            </h3>
            <p className="text-xs text-muted mb-4">These presences are available to all projects on this platform.</p>
            {allPresences.length === 0 ? (
              <p className="text-xs text-muted/50 italic">No presences created yet. <a href="/presence" className="text-accent hover:underline">Create one →</a></p>
            ) : (
              <div className="space-y-2">
                {allPresences.map((p) => {
                  const checked = platformPresenceIds.includes(p.id);
                  return (
                    <label key={p.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      checked ? "bg-accent/10 border border-accent/30" : "bg-white/[0.03] border border-transparent hover:bg-white/[0.06]"
                    }`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setPlatformPresenceIds((prev) =>
                            prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]
                          )
                        }
                        className="accent-accent"
                      />
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-medium ${checked ? "text-white" : "text-muted"}`}>{p.name}</span>
                        {p.handle && <span className="text-xs text-muted ml-2 font-mono">@{p.handle}</span>}
                      </div>
                      {p.briefDescription && (
                        <span className="text-xs text-muted truncate max-w-[160px] hidden sm:block">{p.briefDescription}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Knowledge Bases */}
          <div className="bg-card border border-card-border rounded-xl p-5">
            <h3 className="text-white font-semibold mb-1 text-sm flex items-center gap-2">
              <Icon icon="lucide:brain" width={15} height={15} className="text-accent" />
              Platform Knowledge Bases
            </h3>
            <p className="text-xs text-muted mb-4">These KBs are available to all projects on this platform.</p>
            {allKBs.length === 0 ? (
              <p className="text-xs text-muted/50 italic">No knowledge bases yet. <a href="/knowledge" className="text-accent hover:underline">Create one →</a></p>
            ) : (
              <div className="space-y-2">
                {allKBs.map((kb) => {
                  const checked = platformKBIds.includes(kb.id);
                  return (
                    <label key={kb.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      checked ? "bg-accent/10 border border-accent/30" : "bg-white/[0.03] border border-transparent hover:bg-white/[0.06]"
                    }`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setPlatformKBIds((prev) =>
                            prev.includes(kb.id) ? prev.filter((x) => x !== kb.id) : [...prev, kb.id]
                          )
                        }
                        className="accent-accent"
                      />
                      <span className={`flex-1 text-sm ${checked ? "text-white" : "text-muted"}`}>{kb.name}</span>
                      <span className="text-xs text-muted shrink-0">{kb.itemCount} items</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* System Prompt */}
          <div className="bg-card border border-card-border rounded-xl p-5">
            <h3 className="text-white font-semibold mb-1 text-sm flex items-center gap-2">
              <Icon icon="lucide:message-square-code" width={15} height={15} className="text-accent" />
              Platform System Prompt
            </h3>
            <p className="text-xs text-muted mb-4">
              Applies to all AI interactions platform-wide unless overridden by a project or actor.
            </p>

            {/* Mode toggle */}
            <div className="flex rounded-lg overflow-hidden border border-card-border mb-4 w-fit">
              {(["select", "custom"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPromptMode(m)}
                  className={`px-4 py-1.5 text-xs font-medium transition-colors capitalize ${
                    promptMode === m ? "bg-accent text-white" : "bg-input text-muted hover:text-foreground"
                  }`}
                >
                  {m === "select" ? "Select Existing" : "Write Custom"}
                </button>
              ))}
            </div>

            {promptMode === "select" ? (
              <select
                value={platformPromptId}
                onChange={(e) => setPlatformPromptId(e.target.value)}
                className="w-full bg-input border border-card-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent/50"
              >
                <option value="">— No platform prompt —</option>
                {allPrompts.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            ) : (
              <textarea
                value={customSystemPrompt}
                onChange={(e) => setCustomSystemPrompt(e.target.value)}
                rows={6}
                placeholder="e.g. You are an assistant on the Kinship Today platform. Be helpful, curious, and engaging. Always stay within the context of the platform's educational goals."
                className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 resize-y font-mono"
              />
            )}
          </div>
        </div>

        <SaveBar saving={presenceSaving} flash={presenceFlash} onSave={savePresence} />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Tab: Users
  // ─────────────────────────────────────────────────────────────────────────────
  function renderUsers() {
    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-white">Users</h2>
            <p className="text-muted text-sm mt-0.5">{users.length} member{users.length !== 1 ? "s" : ""} on this platform</p>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="bg-accent hover:bg-accent-dark text-white font-semibold px-4 py-2 rounded-full transition-colors flex items-center gap-2 text-sm"
          >
            <Icon icon="lucide:user-plus" width={14} height={14} />
            Invite User
          </button>
        </div>

        <div className="bg-card border border-card-border rounded-xl overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_120px_80px_36px] gap-4 px-5 py-3 border-b border-card-border">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">User</p>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider text-center">Role</p>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider text-center hidden sm:block">Joined</p>
            <div />
          </div>

          {users.map((user) => (
            <div key={user.id} className="grid grid-cols-[1fr_120px_80px_36px] gap-4 items-center px-5 py-3.5 border-b border-card-border last:border-0 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                  style={{ backgroundColor: user.color }}
                >
                  {user.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-muted truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex justify-center">
                {user.role === "owner" ? (
                  <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">Owner</span>
                ) : (
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    className="bg-input border border-card-border rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:border-accent/50 w-full"
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                )}
              </div>

              <div className="text-xs text-muted text-center hidden sm:block">{user.joined}</div>

              <div className="flex justify-center">
                {user.role !== "owner" && (
                  <button
                    onClick={() => removeUser(user.id)}
                    className="text-muted hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/5"
                    title="Remove user"
                  >
                    <Icon icon="lucide:user-minus" width={14} height={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Invite modal */}
        {showInvite && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowInvite(false)} />
            <div className="relative bg-card border border-card-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-1">Invite User</h3>
              <p className="text-muted text-sm mb-4">They&apos;ll receive an email to join this platform.</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted mb-1 block">Email address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                    autoFocus
                    placeholder="user@example.com"
                    className="w-full bg-input border border-card-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted mb-1 block">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full bg-input border border-card-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent/50"
                  >
                    <option value="admin">Admin — can manage platform settings</option>
                    <option value="member">Member — can create and edit content</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowInvite(false)}
                  className="flex-1 bg-white/[0.06] hover:bg-white/[0.1] border border-card-border text-foreground font-medium px-4 py-2.5 rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim()}
                  className="flex-1 bg-accent hover:bg-accent-dark text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Tab: Approvals
  // ─────────────────────────────────────────────────────────────────────────────
  function renderApprovals() {
    const TYPE_FILTERS = [
      { id: "all",            label: "All" },
      { id: "knowledge-base", label: "Knowledge Bases" },
      { id: "experience",     label: "Experiences" },
      { id: "actor",          label: "Actors" },
      { id: "prompt",         label: "Prompts" },
      { id: "project",        label: "Projects" },
    ];

    const APPROVAL_ICON: Record<string, string> = {
      "knowledge-base": "lucide:brain",
      "experience":     "lucide:compass",
      "actor":          "lucide:user-round",
      "prompt":         "lucide:message-square-code",
      "project":        "lucide:folder-open",
    };

    const filtered = approvals.filter((a) =>
      approvalTypeFilter === "all" || a.type === approvalTypeFilter
    );
    const pending  = filtered.filter((a) => a.status === "pending");
    const resolved = filtered.filter((a) => a.status !== "pending");

    return (
      <div>
        <SectionHeader
          title="Approvals"
          subtitle="Review items submitted for public visibility across the platform"
        />

        {/* Type filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {TYPE_FILTERS.map((f) => {
            const cnt = f.id === "all"
              ? approvals.filter((a) => a.status === "pending").length
              : approvals.filter((a) => a.type === f.id && a.status === "pending").length;
            return (
              <button
                key={f.id}
                onClick={() => setApprovalTypeFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  approvalTypeFilter === f.id
                    ? "bg-accent/20 text-accent border border-accent/30"
                    : "bg-white/[0.05] text-muted border border-transparent hover:border-white/15 hover:text-foreground"
                }`}
              >
                {f.label}
                {cnt > 0 && (
                  <span className="bg-accent/30 text-accent text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {cnt}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Pending */}
        {pending.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
              Awaiting Review — {pending.length}
            </p>
            <div className="space-y-2">
              {pending.map((item) => (
                <div key={item.id} className="bg-card border border-card-border rounded-xl px-5 py-4 flex items-center gap-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${TYPE_COLORS[item.type]}20` }}
                  >
                    <Icon icon={APPROVAL_ICON[item.type] ?? "lucide:file"} width={15} height={15} style={{ color: TYPE_COLORS[item.type] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-muted mt-0.5">
                      <span style={{ color: TYPE_COLORS[item.type] }} className="font-medium">{item.typeLabel}</span>
                      {" · "}submitted by {item.submittedBy} · {item.date}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleApproval(item.id, "reject")}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproval(item.id, "approve")}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resolved */}
        {resolved.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
              Recently Resolved — {resolved.length}
            </p>
            <div className="space-y-2">
              {resolved.map((item) => (
                <div key={item.id} className="bg-card border border-card-border rounded-xl px-5 py-4 flex items-center gap-4 opacity-55">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${TYPE_COLORS[item.type]}20` }}
                  >
                    <Icon icon={APPROVAL_ICON[item.type] ?? "lucide:file"} width={15} height={15} style={{ color: TYPE_COLORS[item.type] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-muted mt-0.5">{item.typeLabel} · by {item.submittedBy} · {item.date}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    item.status === "approved"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}>
                    {item.status === "approved" ? "Approved" : "Rejected"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="bg-card border border-card-border rounded-xl p-12 text-center">
            <Icon icon="lucide:check-circle" width={36} height={36} className="text-muted mx-auto mb-3" />
            <p className="text-white font-medium mb-1">All clear</p>
            <p className="text-muted text-sm">No items awaiting approval in this category</p>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Tab: Projects
  // ─────────────────────────────────────────────────────────────────────────────
  function renderProjects() {
    return (
      <div>
        <SectionHeader title="Projects" subtitle="Manage project visibility and approve public requests" />

        <div className="bg-card border border-card-border rounded-xl overflow-hidden mb-5">
          <div className="px-5 py-3 border-b border-card-border grid grid-cols-[1fr_auto_auto] gap-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Project</p>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider w-44 text-center">Visibility</p>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider w-32" />
          </div>

          {projects.map((project) => {
            const vis = VISIBILITY_CONFIG[project.visibility];
            return (
              <div
                key={project.id}
                className="px-5 py-4 border-b border-card-border last:border-0 grid grid-cols-[1fr_auto_auto] gap-4 items-center hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-white">{project.name}</p>
                  <p className="text-xs text-muted mt-0.5">{project.description}</p>
                  <p className="text-xs text-muted/50 mt-0.5">by {project.owner} · Created {project.createdAt}</p>
                </div>

                <div className="w-44 flex justify-center">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${vis.bg} ${vis.color}`}>
                    <Icon icon={vis.icon} width={11} height={11} />
                    {vis.label}
                  </div>
                </div>

                <div className="w-32 flex gap-1.5 justify-end">
                  {project.visibility === "pending" && (
                    <>
                      <button
                        onClick={() => updateProjectVisibility(project.id, "private")}
                        className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => updateProjectVisibility(project.id, "public")}
                        className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                    </>
                  )}
                  {project.visibility === "public" && (
                    <button
                      onClick={() => updateProjectVisibility(project.id, "private")}
                      className="text-xs text-muted bg-white/5 border border-white/10 hover:border-white/20 hover:text-foreground px-2.5 py-1 rounded-lg transition-colors"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Visibility legend */}
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Visibility Levels</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.entries(VISIBILITY_CONFIG) as [Visibility, typeof VISIBILITY_CONFIG[Visibility]][]).map(([key, v]) => (
              <div key={key} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs ${v.bg} ${v.color}`}>
                <Icon icon={v.icon} width={13} height={13} />
                <div>
                  <p className="font-semibold">{v.label}</p>
                  <p className="opacity-70 text-[11px] mt-0.5">
                    {key === "secret" && "Invite-only, hidden"}
                    {key === "private" && "Team access only"}
                    {key === "pending" && "Awaiting admin OK"}
                    {key === "public" && "Visible to all"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Tab: Danger
  // ─────────────────────────────────────────────────────────────────────────────
  function renderDanger() {
    return (
      <div>
        <SectionHeader title="Danger Zone" subtitle="Irreversible platform operations — proceed with caution" />

        <div className="border border-red-500/30 rounded-xl divide-y divide-red-500/20 overflow-hidden">
          <div className="flex items-start justify-between gap-6 p-6">
            <div>
              <p className="text-white font-semibold text-sm">Transfer Ownership</p>
              <p className="text-muted text-xs mt-1 max-w-sm">
                Transfer platform ownership to another admin. You will lose owner privileges.
              </p>
            </div>
            <button className="shrink-0 bg-white/[0.06] border border-white/15 text-foreground hover:bg-white/[0.1] font-medium px-4 py-2 rounded-lg text-sm transition-colors">
              Transfer
            </button>
          </div>

          <div className="flex items-start justify-between gap-6 p-6">
            <div>
              <p className="text-white font-semibold text-sm">Archive Platform</p>
              <p className="text-muted text-xs mt-1 max-w-sm">
                Disables all public access and pauses AI interactions. Platform data and settings are fully preserved.
              </p>
            </div>
            <button className="shrink-0 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 font-medium px-4 py-2 rounded-lg text-sm transition-colors">
              Archive
            </button>
          </div>

          <div className="flex items-start justify-between gap-6 p-6">
            <div>
              <p className="text-white font-semibold text-sm">Delete Platform</p>
              <p className="text-muted text-xs mt-1 max-w-sm">
                Permanently deletes all data: assets, actors, knowledge bases, experiences, and projects.
                <strong className="text-red-400"> This cannot be undone.</strong>
              </p>
            </div>
            <button className="shrink-0 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
              Delete Platform
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
        <p className="text-muted mt-1 flex items-center gap-2 text-sm flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="text-lg">{platformIcon}</span>
            {platformName}
          </span>
          <span className="text-muted/30">·</span>
          <span className="font-mono text-accent/70">@{platformHandle || "—"}</span>
          <span className="text-muted/30">·</span>
          <span className="font-mono text-xs text-muted/50">0a061698-f710-…</span>
        </p>
      </div>

      {/* Two-column layout: nav + content */}
      <div className="flex gap-6 items-start">

        {/* Left nav */}
        <nav className="w-[200px] shrink-0 space-y-1 sticky top-6">
          {TABS.map((tab) => {
            const badge = tab.id === "approvals" ? pendingCount : undefined;
            const isDanger = tab.danger ?? false;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                  isDanger
                    ? isActive
                      ? "bg-red-500/10 text-red-400 border-red-500/30"
                      : "text-red-400/40 hover:text-red-400 hover:bg-red-500/5 border-transparent"
                    : isActive
                    ? "bg-accent/15 text-accent border-accent/25"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05] border-transparent"
                } ${tab.id === "danger" ? "mt-3" : ""}`}
              >
                <Icon icon={tab.icon} width={16} height={16} />
                <span className="flex-1 text-left">{tab.label}</span>
                {badge !== undefined && badge > 0 && (
                  <span className="bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-4">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Content pane */}
        <div className="flex-1 min-w-0">
          {activeTab === "overview"  && renderOverview()}
          {activeTab === "theme"     && renderTheme()}
          {activeTab === "signals"   && renderSignals()}
          {activeTab === "presence"  && renderPresence()}
          {activeTab === "users"     && renderUsers()}
          {activeTab === "approvals" && renderApprovals()}
          {activeTab === "projects"  && renderProjects()}
          {activeTab === "danger"    && renderDanger()}
        </div>
      </div>
    </div>
  );
}
