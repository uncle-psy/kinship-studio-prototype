"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

// ── Types ──────────────────────────────────────────────────────────────────────

type StepType = "action" | "decision" | "checkpoint" | "loop" | "tool";

type Step = {
  id: string;
  type: StepType;
  label: string;
  description: string;
};

type Database = {
  id: string;
  label: string;
  type: string;
  connected: boolean;
};

type Alignment = {
  id: string;
  name: string;
  goal: string;
  status: "draft" | "ready" | "active";
  steps: Step[];
  databases: Database[];
  model: string;
  systemPrompt: string;
  checkpointing: boolean;
  scoringEnabled: boolean;
  createdAt: string;
};

// ── Sample data ────────────────────────────────────────────────────────────────

const SAMPLE_ALIGNMENTS: Alignment[] = [
  {
    id: "align-1",
    name: "Content Research Loop",
    goal: "Research trending topics, generate content ideas, draft posts, and score them against engagement criteria",
    status: "ready",
    steps: [
      { id: "s1", type: "action", label: "Search trending topics", description: "Query web for trending content in domain" },
      { id: "s2", type: "checkpoint", label: "Relevance check", description: "Score relevance of topics against brand guidelines" },
      { id: "s3", type: "action", label: "Generate content ideas", description: "Produce 5 content angles per topic" },
      { id: "s4", type: "decision", label: "Quality gate", description: "If score < 0.7, loop back to generate" },
      { id: "s5", type: "action", label: "Draft post", description: "Write final post copy for each channel" },
    ],
    databases: [
      { id: "db1", label: "Pinecone (embeddings)", type: "vector", connected: true },
      { id: "db2", label: "PostgreSQL (logs)", type: "relational", connected: true },
    ],
    model: "claude-opus-4-6",
    systemPrompt: "You are a content strategist AI…",
    checkpointing: true,
    scoringEnabled: true,
    createdAt: "2026-03-10",
  },
];

const STEP_ICONS: Record<StepType, string> = {
  action: "lucide:zap",
  decision: "lucide:git-branch",
  checkpoint: "lucide:check-circle",
  loop: "lucide:repeat",
  tool: "lucide:plug-2",
};

const STEP_COLORS: Record<StepType, string> = {
  action: "text-accent bg-accent/15",
  decision: "text-yellow-400 bg-yellow-400/10",
  checkpoint: "text-green-400 bg-green-400/10",
  loop: "text-purple-400 bg-purple-400/10",
  tool: "text-blue-400 bg-blue-400/10",
};

const MODEL_OPTIONS = [
  { value: "claude-opus-4-6", label: "Claude Opus 4.6", hint: "Most capable" },
  { value: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", hint: "Balanced" },
  { value: "claude-haiku-4-5", label: "Claude Haiku 4.5", hint: "Fastest" },
];

const DB_OPTIONS = [
  { value: "pinecone", label: "Pinecone", type: "vector", icon: "🌲" },
  { value: "postgresql", label: "PostgreSQL", type: "relational", icon: "🐘" },
  { value: "mongodb", label: "MongoDB", type: "document", icon: "🍃" },
  { value: "supabase", label: "Supabase", type: "relational", icon: "⚡" },
  { value: "redis", label: "Redis", type: "cache", icon: "🔴" },
];

// ── Step builder ───────────────────────────────────────────────────────────────

function StepNode({ step, index, onRemove }: { step: Step; index: number; onRemove: () => void }) {
  return (
    <div className="flex items-start gap-3">
      {/* Connector line + number */}
      <div className="flex flex-col items-center">
        <div className="w-7 h-7 rounded-full bg-card border border-card-border flex items-center justify-center text-xs font-bold text-muted">
          {index + 1}
        </div>
        <div className="w-px flex-1 bg-card-border mt-1" style={{ minHeight: 16 }} />
      </div>

      {/* Card */}
      <div className="flex-1 bg-card border border-card-border rounded-xl p-4 mb-2 group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded flex items-center justify-center ${STEP_COLORS[step.type]}`}>
              <Icon icon={STEP_ICONS[step.type]} width={12} height={12} />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{step.type}</span>
          </div>
          <button
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-400 transition-all"
          >
            <Icon icon="lucide:x" width={14} height={14} />
          </button>
        </div>
        <div className="text-sm font-semibold text-white mb-0.5">{step.label}</div>
        <div className="text-xs text-muted">{step.description}</div>
      </div>
    </div>
  );
}

// ── Create alignment modal ─────────────────────────────────────────────────────

function CreateAlignmentModal({ onClose, onCreate }: { onClose: () => void; onCreate: (a: Alignment) => void }) {
  const [step, setStep] = useState<"goal" | "plan" | "configure">("goal");
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [generating, setGenerating] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [model, setModel] = useState("claude-sonnet-4-6");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [checkpointing, setCheckpointing] = useState(true);
  const [scoring, setScoring] = useState(true);
  const [databases, setDatabases] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const generatePlan = () => {
    if (!goal.trim()) return;
    setGenerating(true);
    // Simulate AI generating a plan
    setTimeout(() => {
      setSteps([
        { id: "g1", type: "action", label: "Gather context", description: "Collect relevant information from connected data sources" },
        { id: "g2", type: "action", label: "Process & analyze", description: "Apply reasoning to identify patterns and insights" },
        { id: "g3", type: "checkpoint", label: "Quality checkpoint", description: "Evaluate output against defined success criteria" },
        { id: "g4", type: "decision", label: "Sufficient quality?", description: "If score meets threshold, proceed. Otherwise retry." },
        { id: "g5", type: "loop", label: "Refinement loop", description: "Iterate with feedback until quality gate passes" },
        { id: "g6", type: "action", label: "Deliver output", description: "Format and route final result to destination" },
      ]);
      setSystemPrompt(`You are an AI agent executing a focused task: ${goal.trim()}.\n\nOperate systematically. At each step, evaluate your progress against the goal. Use the available tools and databases as needed. Surface uncertainties before acting on them.`);
      setGenerating(false);
      setStep("plan");
    }, 1800);
  };

  const addStep = (type: StepType) => {
    const labels: Record<StepType, string> = {
      action: "New action",
      decision: "Decision point",
      checkpoint: "Checkpoint",
      loop: "Loop",
      tool: "Tool call",
    };
    setSteps((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, type, label: labels[type], description: "Describe what happens here" },
    ]);
  };

  const removeStep = (id: string) => setSteps((prev) => prev.filter((s) => s.id !== id));

  const handleCreate = () => {
    if (!name.trim()) return;
    setSaving(true);
    setTimeout(() => {
      const alignment: Alignment = {
        id: `align-${Date.now()}`,
        name: name.trim(),
        goal: goal.trim(),
        status: "draft",
        steps,
        databases: databases.map((d) => {
          const opt = DB_OPTIONS.find((o) => o.value === d)!;
          return { id: d, label: opt.label, type: opt.type, connected: true };
        }),
        model,
        systemPrompt,
        checkpointing,
        scoringEnabled: scoring,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setSaving(false);
      onCreate(alignment);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-card-border rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-card-border flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Create Alignment</h2>
            <div className="flex items-center gap-2 mt-2">
              {(["goal", "plan", "configure"] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 text-xs font-medium ${step === s ? "text-accent" : i < ["goal", "plan", "configure"].indexOf(step) ? "text-green-400" : "text-muted"}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === s ? "bg-accent text-white" : i < ["goal", "plan", "configure"].indexOf(step) ? "bg-green-400 text-black" : "bg-white/10 text-muted"}`}>
                      {i < ["goal", "plan", "configure"].indexOf(step) ? "✓" : i + 1}
                    </div>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </div>
                  {i < 2 && <div className="w-6 h-px bg-card-border" />}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors">
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Goal */}
          {step === "goal" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Alignment Name <span className="text-accent">*</span>
                </label>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Content Research Loop, Customer Onboarding, Daily Digest"
                  className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Describe what you want the agent to do <span className="text-accent">*</span>
                </label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Monitor our Telegram channel for questions, research answers using our knowledge base, and post helpful replies. Check every 30 minutes. Score responses for helpfulness before posting."
                  rows={5}
                  className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none"
                />
                <p className="text-xs text-muted mt-1.5">Be specific about triggers, data sources, outputs, and success criteria. The AI will use this to generate an agentic plan.</p>
              </div>
              <button
                onClick={generatePlan}
                disabled={!name.trim() || !goal.trim() || generating}
                className="w-full bg-accent hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <Icon icon="lucide:loader-2" width={16} height={16} className="animate-spin" />
                    Generating plan…
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:sparkles" width={16} height={16} />
                    Generate Agentic Plan with AI
                  </>
                )}
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-card-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-3 text-xs text-muted">or</span>
                </div>
              </div>
              <button
                onClick={() => { if (name.trim()) setStep("plan"); }}
                disabled={!name.trim()}
                className="w-full border border-card-border text-muted hover:text-white hover:border-white/30 disabled:opacity-50 py-2.5 rounded-xl transition-colors font-medium"
              >
                Build plan manually
              </button>
            </div>
          )}

          {/* Step 2: Plan */}
          {step === "plan" && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-sm text-accent flex items-start gap-2">
                <Icon icon="lucide:sparkles" width={16} height={16} className="flex-shrink-0 mt-0.5" />
                <span>AI generated this plan from your goal. Drag to reorder steps or add/remove as needed.</span>
              </div>

              {/* Steps */}
              <div>
                {steps.map((s, i) => (
                  <StepNode key={s.id} step={s} index={i} onRemove={() => removeStep(s.id)} />
                ))}
              </div>

              {/* Add step buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs text-muted self-center">Add step:</span>
                {(["action", "decision", "checkpoint", "loop", "tool"] as StepType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => addStep(type)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${STEP_COLORS[type]} border-current/30 hover:opacity-80`}
                  >
                    <Icon icon={STEP_ICONS[type]} width={12} height={12} />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep("goal")} className="px-4 py-2.5 border border-card-border rounded-xl text-muted hover:text-white transition-colors text-sm">
                  ← Back
                </button>
                <button
                  onClick={() => setStep("configure")}
                  disabled={steps.length === 0}
                  className="flex-1 bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Configure →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Configure */}
          {step === "configure" && (
            <div className="space-y-5">
              {/* Model */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Model</label>
                <div className="flex flex-col gap-2">
                  {MODEL_OPTIONS.map((m) => (
                    <label key={m.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${model === m.value ? "border-accent/60 bg-accent/5" : "border-card-border hover:border-white/20"}`}>
                      <input type="radio" name="model" value={m.value} checked={model === m.value} onChange={() => setModel(m.value)} className="sr-only" />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${model === m.value ? "border-accent" : "border-muted"}`}>
                        {model === m.value && <div className="w-2 h-2 rounded-full bg-accent" />}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-white">{m.label}</span>
                        <span className="text-xs text-muted ml-2">{m.hint}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* System prompt */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">System Prompt</label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none text-sm"
                  placeholder="Instructions that guide the agent's behavior throughout the loop…"
                />
              </div>

              {/* Databases */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Databases</label>
                <div className="flex flex-col gap-2">
                  {DB_OPTIONS.map((db) => (
                    <label key={db.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${databases.includes(db.value) ? "border-accent/60 bg-accent/5" : "border-card-border hover:border-white/20"}`}>
                      <input
                        type="checkbox"
                        checked={databases.includes(db.value)}
                        onChange={(e) => {
                          if (e.target.checked) setDatabases((prev) => [...prev, db.value]);
                          else setDatabases((prev) => prev.filter((d) => d !== db.value));
                        }}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${databases.includes(db.value) ? "border-accent bg-accent" : "border-muted"}`}>
                        {databases.includes(db.value) && <Icon icon="lucide:check" width={10} height={10} className="text-white" />}
                      </div>
                      <span className="text-base">{db.icon}</span>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-white">{db.label}</span>
                        <span className="text-xs text-muted ml-2">{db.type}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center justify-between p-3 rounded-xl border border-card-border cursor-pointer hover:border-white/20 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-white">Checkpointing</div>
                    <div className="text-xs text-muted">Save state at each checkpoint so the loop can resume if interrupted</div>
                  </div>
                  <div
                    onClick={() => setCheckpointing((v) => !v)}
                    className={`w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${checkpointing ? "bg-accent" : "bg-white/10"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${checkpointing ? "left-5" : "left-0.5"}`} />
                  </div>
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl border border-card-border cursor-pointer hover:border-white/20 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-white">Output Scoring</div>
                    <div className="text-xs text-muted">Score each output against the goal criteria before proceeding</div>
                  </div>
                  <div
                    onClick={() => setScoring((v) => !v)}
                    className={`w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${scoring ? "bg-accent" : "bg-white/10"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${scoring ? "left-5" : "left-0.5"}`} />
                  </div>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep("plan")} className="px-4 py-2.5 border border-card-border rounded-xl text-muted hover:text-white transition-colors text-sm">
                  ← Back
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving}
                  className="flex-1 bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
                >
                  {saving ? "Creating…" : "Create Alignment"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Alignment card ─────────────────────────────────────────────────────────────

function AlignmentCard({ alignment, onSelect }: { alignment: Alignment; onSelect: () => void }) {
  const statusColors: Record<string, string> = {
    draft: "text-muted bg-white/[0.06]",
    ready: "text-green-400 bg-green-400/10",
    active: "text-accent bg-accent/15",
  };

  return (
    <button
      onClick={onSelect}
      className="group bg-card border border-card-border rounded-xl p-5 text-left hover:border-accent/50 transition-all hover:bg-white/[0.04] w-full"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
          <Icon icon="lucide:workflow" width={20} height={20} className="text-accent" />
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${statusColors[alignment.status]}`}>
            {alignment.status}
          </span>
          <Icon icon="lucide:chevron-right" width={16} height={16} className="text-muted group-hover:text-accent transition-colors" />
        </div>
      </div>

      <h3 className="text-white font-semibold text-base mb-1 truncate">{alignment.name}</h3>
      <p className="text-sm text-muted line-clamp-2 mb-3">{alignment.goal}</p>

      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="flex items-center gap-1">
          <Icon icon="lucide:list-ordered" width={12} height={12} />
          {alignment.steps.length} steps
        </span>
        {alignment.databases.length > 0 && (
          <span className="flex items-center gap-1">
            <Icon icon="lucide:database" width={12} height={12} />
            {alignment.databases.length} DB{alignment.databases.length !== 1 ? "s" : ""}
          </span>
        )}
        {alignment.checkpointing && (
          <span className="flex items-center gap-1">
            <Icon icon="lucide:save" width={12} height={12} />
            Checkpointed
          </span>
        )}
      </div>
    </button>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function AlignPage() {
  const [alignments, setAlignments] = useState<Alignment[]>(SAMPLE_ALIGNMENTS);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<Alignment | null>(null);

  if (selected) {
    return (
      <div>
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-muted hover:text-white transition-colors text-sm mb-6"
        >
          <Icon icon="lucide:arrow-left" width={16} height={16} />
          Back to Alignments
        </button>

        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-white">{selected.name}</h1>
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded ${selected.status === "ready" ? "text-green-400 bg-green-400/10" : "text-muted bg-white/[0.06]"}`}>
                {selected.status}
              </span>
            </div>
            <p className="text-muted max-w-xl">{selected.goal}</p>
          </div>
          <button className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-2">
            <Icon icon="lucide:play" width={16} height={16} />
            Run Alignment
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Steps */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Agentic Flow</h2>
            <div className="bg-card border border-card-border rounded-xl p-5">
              {selected.steps.map((s, i) => (
                <StepNode key={s.id} step={s} index={i} onRemove={() => {}} />
              ))}
            </div>
          </div>

          {/* Config sidebar */}
          <div className="space-y-4">
            <div className="bg-card border border-card-border rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Configuration</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted mb-1">Model</div>
                  <div className="text-sm text-white font-medium">{selected.model}</div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Checkpointing</div>
                  <div className={`text-sm font-medium ${selected.checkpointing ? "text-green-400" : "text-muted"}`}>
                    {selected.checkpointing ? "Enabled" : "Disabled"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Output Scoring</div>
                  <div className={`text-sm font-medium ${selected.scoringEnabled ? "text-green-400" : "text-muted"}`}>
                    {selected.scoringEnabled ? "Enabled" : "Disabled"}
                  </div>
                </div>
              </div>
            </div>

            {selected.databases.length > 0 && (
              <div className="bg-card border border-card-border rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Databases</h3>
                <div className="space-y-2">
                  {selected.databases.map((db) => (
                    <div key={db.id} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                      <span className="text-white truncate">{db.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-card border border-card-border rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">System Prompt</h3>
              <p className="text-xs text-muted line-clamp-4">{selected.systemPrompt || "No system prompt set"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Align</h1>
          <p className="text-muted mt-1">
            {alignments.length} alignment{alignments.length !== 1 ? "s" : ""} · agentic loops and workflows
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-2"
        >
          <Icon icon="lucide:plus" width={18} height={18} />
          Create Alignment
        </button>
      </div>

      {/* Explainer */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
          <Icon icon="lucide:workflow" width={20} height={20} className="text-accent" />
        </div>
        <div>
          <h3 className="text-white font-semibold mb-1">What is an Alignment?</h3>
          <p className="text-sm text-muted leading-relaxed">
            An Alignment is a named agentic loop — a structured workflow that tells your AI exactly what to do, in what order, with what data. Each Alignment can be attached to a Presence (supervisor agent) and includes its goal, steps, model, system prompt, databases, checkpointing, and scoring configuration.
          </p>
        </div>
      </div>

      {/* Grid */}
      {alignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alignments.map((a) => (
            <AlignmentCard key={a.id} alignment={a} onSelect={() => setSelected(a)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-4">
            <Icon icon="lucide:workflow" width={32} height={32} className="text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No alignments yet</h3>
          <p className="text-muted mb-6 max-w-md mx-auto">
            Create an Alignment to define an agentic loop — tell the AI what you want, and it will generate a configurable plan.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            + Create Alignment
          </button>
        </div>
      )}

      {showCreate && (
        <CreateAlignmentModal
          onClose={() => setShowCreate(false)}
          onCreate={(a) => {
            setAlignments((prev) => [a, ...prev]);
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}
