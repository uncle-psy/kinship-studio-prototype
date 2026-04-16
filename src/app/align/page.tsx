"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

// ── Types ──────────────────────────────────────────────────────────────────────

type StepType = "action" | "decision" | "checkpoint" | "loop" | "tool" | "human-approval" | "reflection" | "parallel";

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

type GatheringStatus = "draft" | "active" | "paused" | "completed";

type Participant = {
  id: string;
  name: string;
  role: "host" | "participant" | "observer";
  type: "agent" | "human";
};

type ApprovalRule = {
  id: string;
  trigger: string;
  threshold: string;
  approver: string;
};

type Gathering = {
  id: string;
  name: string;
  purpose: string;
  status: GatheringStatus;
  participants: Participant[];
  vibeIds: string[];
  approvalRules: ApprovalRule[];
  createdAt: string;
};

// ── Tab ────────────────────────────────────────────────────────────────────────

type AlignTab = "workflows" | "gatherings" | "approvals" | "topology";

// ── Sample data ────────────────────────────────────────────────────────────────

const SAMPLE_ALIGNMENTS: Alignment[] = [
  {
    id: "align-1",
    name: "Service Alliance · Proposal-to-Deploy Pipeline",
    goal: "On Pass resolution, emit scoped Kinship Codes to the Peer Navigator and Stipend Disbursement Executors, stage the pilot cohort, and start reporting against the Objective's value vector.",
    status: "active",
    steps: [
      { id: "s1", type: "action", label: "Observe Proposal resolution", description: "Autocrat resolves Pass; workflow is triggered with the resolved Proposal ID and budget envelope." },
      { id: "s2", type: "tool", label: "Mint Kinship Codes", description: "Issue scoped JWT + Solana Codes to each Executor listed in the Proposal." },
      { id: "s3", type: "checkpoint", label: "Verify scope", description: "Each Executor must ACK its Code before any external tool is called." },
      { id: "s4", type: "parallel", label: "Kick off Executors", description: "Peer Navigator onboards chapters; Stipend Disbursement Executor funds them." },
      { id: "s5", type: "reflection", label: "Score against value vector", description: "Sample Veteran Outcomes, Time-to-Claim, Peer Engagement, and Program Cost weekly." },
      { id: "s6", type: "decision", label: "Abort condition", description: "If the vector moves below threshold, pause and notify the Operator." },
      { id: "s7", type: "human-approval", label: "Sponsor checkpoint", description: "Sponsor signs off at the 30-day review." },
      { id: "s8", type: "action", label: "Publish report to Market", description: "Report card is posted into the Proposal's deployment trace." },
    ],
    databases: [
      { id: "db1", label: "Pinecone (veteran benefits corpus)", type: "vector", connected: true },
      { id: "db2", label: "PostgreSQL (VSO chapter ledger)", type: "relational", connected: true },
    ],
    model: "claude-opus-4-6",
    systemPrompt: "You are the Service Alliance deployment orchestrator. Bind every action to the Proposal that authorized it. Never invoke a tool that falls outside the Executor's Kinship Code scope.",
    checkpointing: true,
    scoringEnabled: true,
    createdAt: "2026-03-22",
  },
  {
    id: "align-2",
    name: "CLW · Certification Audit Workflow",
    goal: "Run a Loving Workplace certification audit end-to-end: onsite observation, anonymous employee pulse, remediation plan if scores fall short, and renewal Proposal back to the Certification Operator.",
    status: "ready",
    steps: [
      { id: "s2-1", type: "action", label: "Schedule onsite audit", description: "Auditor Executor books employer calendar and confirms travel." },
      { id: "s2-2", type: "tool", label: "Pulse survey launch", description: "Employee Pulse Executor launches the anonymous survey; enforces the audit sample plan." },
      { id: "s2-3", type: "checkpoint", label: "Data integrity", description: "Reject the batch if response rate < 60% or if de-identification is compromised." },
      { id: "s2-4", type: "decision", label: "Remediation trigger", description: "If wellbeing score < 70, route to Remediation Plan Generator." },
      { id: "s2-5", type: "reflection", label: "Employer sign-off", description: "Employer countersigns findings before publication." },
      { id: "s2-6", type: "human-approval", label: "Certification Operator", description: "Operator posts a Proposal to renew, deny, or condition the certification." },
    ],
    databases: [
      { id: "db3", label: "Pinecone (CLW research library)", type: "vector", connected: true },
      { id: "db4", label: "PostgreSQL (certification ledger)", type: "relational", connected: true },
    ],
    model: "claude-opus-4-6",
    systemPrompt: "You are the CLW certification audit orchestrator. Prioritize employee wellbeing, audit integrity, and operational fit in that order. Never disclose raw survey rows — only aggregated findings.",
    checkpointing: true,
    scoringEnabled: true,
    createdAt: "2026-02-18",
  },
];

const SAMPLE_GATHERINGS: Gathering[] = [
  {
    id: "gather-sa-peer-cohort",
    name: "Service Alliance · Peer-Navigator Cohort Debate",
    purpose: "Electors debate the 4-chapter Peer Navigator pilot — weighing time-to-claim reduction against program cost before the Proposal closes.",
    status: "active",
    participants: [
      { id: "p1", name: "Benefits Operator", role: "host", type: "agent" },
      { id: "p2", name: "Veteran Elector (Cohort A)", role: "participant", type: "agent" },
      { id: "p3", name: "VSO Chapter Elector", role: "participant", type: "agent" },
      { id: "p4", name: "Rick Gage", role: "participant", type: "human" },
      { id: "p5", name: "Sponsor Council", role: "observer", type: "human" },
    ],
    vibeIds: ["kinship-constitution", "growth-space"],
    approvalRules: [
      { id: "ar1", trigger: "Budget allocation > $100k", threshold: "Always", approver: "Sponsor Council + Operator" },
      { id: "ar2", trigger: "New chapter deployment", threshold: "Always", approver: "Operator + VSO partner signoff" },
    ],
    createdAt: "2026-04-10",
  },
  {
    id: "gather-clw-loving-manager",
    name: "CLW · Loving Manager Module Release Review",
    purpose: "Gather Electors from CLW practitioner, employer, and researcher constituencies to price the release of Modules 1–4 under CC-BY-SA with es + pt-BR translations.",
    status: "active",
    participants: [
      { id: "p6", name: "Education Operator", role: "host", type: "agent" },
      { id: "p7", name: "Practitioner Elector", role: "participant", type: "agent" },
      { id: "p8", name: "Employer Elector", role: "participant", type: "agent" },
      { id: "p9", name: "Research Elector", role: "observer", type: "agent" },
    ],
    vibeIds: ["kinship-constitution"],
    approvalRules: [
      { id: "ar3", trigger: "Curriculum release under permissive license", threshold: "Always", approver: "Research Operator + Education Operator" },
      { id: "ar4", trigger: "Budget > $50k", threshold: "Always", approver: "CLW Sponsor Council" },
    ],
    createdAt: "2026-04-09",
  },
  {
    id: "gather-sbx-coastline",
    name: "Silicon Beach · Seat Coastline Electors",
    purpose: "Draft gathering to debate seating Electors that represent kelp forest and brown pelican populations on all Proposals touching the coast.",
    status: "draft",
    participants: [
      { id: "p10", name: "Coastline Operator", role: "host", type: "agent" },
      { id: "p11", name: "Kelp-Elector (proposed)", role: "participant", type: "agent" },
      { id: "p12", name: "Pelican-Elector (proposed)", role: "participant", type: "agent" },
      { id: "p13", name: "SBX Sponsor", role: "participant", type: "human" },
    ],
    vibeIds: ["growth-space", "kinship-constitution"],
    approvalRules: [
      { id: "ar5", trigger: "Admit non-human Electors", threshold: "Always", approver: "Sponsor + Complementary-Consciousness Council" },
      { id: "ar6", trigger: "Data-feed attestation", threshold: "Always", approver: "Coastal Research (Architect)" },
    ],
    createdAt: "2026-04-14",
  },
];

const STEP_ICONS: Record<StepType, string> = {
  action: "lucide:zap",
  decision: "lucide:git-branch",
  checkpoint: "lucide:check-circle",
  loop: "lucide:repeat",
  tool: "lucide:plug-2",
  "human-approval": "lucide:hand",
  reflection: "lucide:scan-eye",
  parallel: "lucide:split",
};

const STEP_COLORS: Record<StepType, string> = {
  action: "text-accent bg-accent/15",
  decision: "text-yellow-400 bg-yellow-400/10",
  checkpoint: "text-green-400 bg-green-400/10",
  loop: "text-purple-400 bg-purple-400/10",
  tool: "text-blue-400 bg-blue-400/10",
  "human-approval": "text-orange-400 bg-orange-400/10",
  reflection: "text-cyan-400 bg-cyan-400/10",
  parallel: "text-pink-400 bg-pink-400/10",
};

const MODEL_OPTIONS = [
  { value: "claude-opus-4-6", label: "Claude Opus 4.6", hint: "Most capable" },
  { value: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", hint: "Balanced" },
  { value: "claude-haiku-4-5", label: "Claude Haiku 4.5", hint: "Fastest" },
];

const DB_OPTIONS = [
  { value: "pinecone", label: "Pinecone", type: "vector", icon: "\uD83C\uDF32" },
  { value: "postgresql", label: "PostgreSQL", type: "relational", icon: "\uD83D\uDC18" },
  { value: "mongodb", label: "MongoDB", type: "document", icon: "\uD83C\uDF43" },
  { value: "supabase", label: "Supabase", type: "relational", icon: "\u26A1" },
  { value: "redis", label: "Redis", type: "cache", icon: "\uD83D\uDD34" },
];

// ── Step builder ───────────────────────────────────────────────────────────────

function StepNode({ step, index, onRemove }: { step: Step; index: number; onRemove: () => void }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div className="w-7 h-7 rounded-full bg-card border border-card-border flex items-center justify-center text-xs font-bold text-muted">
          {index + 1}
        </div>
        <div className="w-px flex-1 bg-card-border mt-1" style={{ minHeight: 16 }} />
      </div>
      <div className="flex-1 bg-card border border-card-border rounded-xl p-4 mb-2 group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded flex items-center justify-center ${STEP_COLORS[step.type]}`}>
              <Icon icon={STEP_ICONS[step.type]} width={12} height={12} />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{step.type.replace("-", " ")}</span>
          </div>
          <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-400 transition-all">
            <Icon icon="lucide:x" width={14} height={14} />
          </button>
        </div>
        <div className="text-sm font-semibold text-white mb-0.5">{step.label}</div>
        <div className="text-xs text-muted">{step.description}</div>
      </div>
    </div>
  );
}

// ── Create Alignment modal ─────────────────────────────────────────────────────

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
    setTimeout(() => {
      setSteps([
        { id: "g1", type: "action", label: "Gather context", description: "Collect relevant information from connected data sources" },
        { id: "g2", type: "action", label: "Process & analyze", description: "Apply reasoning to identify patterns and insights" },
        { id: "g3", type: "reflection", label: "Self-review", description: "Agent critiques its output against vibes and quality criteria" },
        { id: "g4", type: "checkpoint", label: "Quality checkpoint", description: "Evaluate output against defined success criteria" },
        { id: "g5", type: "decision", label: "Sufficient quality?", description: "If score meets threshold, proceed. Otherwise retry." },
        { id: "g6", type: "loop", label: "Refinement loop", description: "Iterate with feedback until quality gate passes" },
        { id: "g7", type: "human-approval", label: "Human approval", description: "Route to human for final sign-off on high-stakes output" },
        { id: "g8", type: "action", label: "Deliver output", description: "Format and route final result to destination" },
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
      "human-approval": "Human approval",
      reflection: "Self-review",
      parallel: "Parallel fan-out",
    };
    setSteps((prev) => [...prev, { id: `custom-${Date.now()}`, type, label: labels[type], description: "Describe what happens here" }]);
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
        <div className="flex items-center justify-between p-6 border-b border-card-border flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Create Workflow</h2>
            <div className="flex items-center gap-2 mt-2">
              {(["goal", "plan", "configure"] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 text-xs font-medium ${step === s ? "text-accent" : i < ["goal", "plan", "configure"].indexOf(step) ? "text-green-400" : "text-muted"}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === s ? "bg-accent text-white" : i < ["goal", "plan", "configure"].indexOf(step) ? "bg-green-400 text-black" : "bg-white/10 text-muted"}`}>
                      {i < ["goal", "plan", "configure"].indexOf(step) ? "\u2713" : i + 1}
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

        <div className="flex-1 overflow-y-auto p-6">
          {step === "goal" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Workflow Name <span className="text-accent">*</span></label>
                <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Content Research Loop, Customer Onboarding, Daily Digest" className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Describe what you want the agent to do <span className="text-accent">*</span></label>
                <textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Monitor our Telegram channel for questions, research answers using our knowledge base, and post helpful replies. Check every 30 minutes. Score responses for helpfulness before posting." rows={5} className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none" />
                <p className="text-xs text-muted mt-1.5">Be specific about triggers, data sources, outputs, and success criteria. The AI will use this to generate an agentic plan.</p>
              </div>
              <button onClick={generatePlan} disabled={!name.trim() || !goal.trim() || generating} className="w-full bg-accent hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {generating ? (<><Icon icon="lucide:loader-2" width={16} height={16} className="animate-spin" />Generating plan\u2026</>) : (<><Icon icon="lucide:sparkles" width={16} height={16} />Generate Agentic Plan with AI</>)}
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-card-border" /></div>
                <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted">or</span></div>
              </div>
              <button onClick={() => { if (name.trim()) setStep("plan"); }} disabled={!name.trim()} className="w-full border border-card-border text-muted hover:text-white hover:border-white/30 disabled:opacity-50 py-2.5 rounded-xl transition-colors font-medium">Build plan manually</button>
            </div>
          )}

          {step === "plan" && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-sm text-accent flex items-start gap-2">
                <Icon icon="lucide:sparkles" width={16} height={16} className="flex-shrink-0 mt-0.5" />
                <span>AI generated this plan from your goal. Add/remove steps as needed. Use <strong>Human Approval</strong> for actions that need sign-off, <strong>Reflection</strong> for self-correction loops.</span>
              </div>
              <div>
                {steps.map((s, i) => (<StepNode key={s.id} step={s} index={i} onRemove={() => removeStep(s.id)} />))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs text-muted self-center">Add step:</span>
                {(["action", "decision", "checkpoint", "loop", "tool", "human-approval", "reflection", "parallel"] as StepType[]).map((type) => (
                  <button key={type} onClick={() => addStep(type)} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${STEP_COLORS[type]} border-current/30 hover:opacity-80`}>
                    <Icon icon={STEP_ICONS[type]} width={12} height={12} />
                    {type === "human-approval" ? "Human Approval" : type === "reflection" ? "Reflection" : type === "parallel" ? "Parallel" : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep("goal")} className="px-4 py-2.5 border border-card-border rounded-xl text-muted hover:text-white transition-colors text-sm">\u2190 Back</button>
                <button onClick={() => setStep("configure")} disabled={steps.length === 0} className="flex-1 bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors">Configure \u2192</button>
              </div>
            </div>
          )}

          {step === "configure" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Model</label>
                <div className="flex flex-col gap-2">
                  {MODEL_OPTIONS.map((m) => (
                    <label key={m.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${model === m.value ? "border-accent/60 bg-accent/5" : "border-card-border hover:border-white/20"}`}>
                      <input type="radio" name="model" value={m.value} checked={model === m.value} onChange={() => setModel(m.value)} className="sr-only" />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${model === m.value ? "border-accent" : "border-muted"}`}>{model === m.value && <div className="w-2 h-2 rounded-full bg-accent" />}</div>
                      <div className="flex-1"><span className="text-sm font-medium text-white">{m.label}</span><span className="text-xs text-muted ml-2">{m.hint}</span></div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">System Prompt</label>
                <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows={4} className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none text-sm" placeholder="Instructions that guide the agent\u2019s behavior throughout the workflow\u2026" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Databases</label>
                <div className="flex flex-col gap-2">
                  {DB_OPTIONS.map((db) => (
                    <label key={db.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${databases.includes(db.value) ? "border-accent/60 bg-accent/5" : "border-card-border hover:border-white/20"}`}>
                      <input type="checkbox" checked={databases.includes(db.value)} onChange={(e) => { if (e.target.checked) setDatabases((prev) => [...prev, db.value]); else setDatabases((prev) => prev.filter((d) => d !== db.value)); }} className="sr-only" />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${databases.includes(db.value) ? "border-accent bg-accent" : "border-muted"}`}>{databases.includes(db.value) && <Icon icon="lucide:check" width={10} height={10} className="text-white" />}</div>
                      <span className="text-base">{db.icon}</span>
                      <div className="flex-1"><span className="text-sm font-medium text-white">{db.label}</span><span className="text-xs text-muted ml-2">{db.type}</span></div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center justify-between p-3 rounded-xl border border-card-border cursor-pointer hover:border-white/20 transition-colors">
                  <div><div className="text-sm font-medium text-white">Checkpointing</div><div className="text-xs text-muted">Save state at each checkpoint so the workflow can resume if interrupted</div></div>
                  <div onClick={() => setCheckpointing((v) => !v)} className={`w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${checkpointing ? "bg-accent" : "bg-white/10"}`}><div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${checkpointing ? "left-5" : "left-0.5"}`} /></div>
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl border border-card-border cursor-pointer hover:border-white/20 transition-colors">
                  <div><div className="text-sm font-medium text-white">HEARTS Scoring</div><div className="text-xs text-muted">Score each output against Harmony, Empowerment, Artistry, Reason, Trust, Synthesis</div></div>
                  <div onClick={() => setScoring((v) => !v)} className={`w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${scoring ? "bg-accent" : "bg-white/10"}`}><div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${scoring ? "left-5" : "left-0.5"}`} /></div>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep("plan")} className="px-4 py-2.5 border border-card-border rounded-xl text-muted hover:text-white transition-colors text-sm">\u2190 Back</button>
                <button onClick={handleCreate} disabled={saving} className="flex-1 bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors">{saving ? "Creating\u2026" : "Create Workflow"}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Create Gathering modal ─────────────────────────────────────────────────────

function CreateGatheringModal({ onClose, onCreate }: { onClose: () => void; onCreate: (g: Gathering) => void }) {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) return;
    setSaving(true);
    setTimeout(() => {
      const gathering: Gathering = {
        id: `gather-${Date.now()}`,
        name: name.trim(),
        purpose: purpose.trim(),
        status: "draft",
        participants: [],
        vibeIds: [],
        approvalRules: [],
        createdAt: new Date().toISOString().split("T")[0],
      };
      setSaving(false);
      onCreate(gathering);
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-card-border rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-card-border">
          <div>
            <h2 className="text-xl font-bold text-white">Create Gathering</h2>
            <p className="text-sm text-muted mt-1">A bounded context where agents and users interact</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors">
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Gathering Name <span className="text-accent">*</span></label>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Investor Onboarding, Coaching Session, Campaign War Room" className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Purpose</label>
            <textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="What is this gathering for? Which agents participate, which users are invited, and what rules apply?" rows={4} className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleCreate} disabled={!name.trim() || saving} className="flex-1 bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors">{saving ? "Creating\u2026" : "Create Gathering"}</button>
            <button onClick={onClose} className="px-5 py-2.5 border border-card-border rounded-xl text-muted hover:text-white hover:border-white/30 transition-colors font-medium">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Cards ───────────────────────────────────────────────────────────────────────

function AlignmentCard({ alignment, onSelect }: { alignment: Alignment; onSelect: () => void }) {
  const statusColors: Record<string, string> = { draft: "text-muted bg-white/[0.06]", ready: "text-green-400 bg-green-400/10", active: "text-accent bg-accent/15" };
  return (
    <button onClick={onSelect} className="group bg-card border border-card-border rounded-xl p-5 text-left hover:border-accent/50 transition-all hover:bg-white/[0.04] w-full">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center"><Icon icon="lucide:workflow" width={20} height={20} className="text-accent" /></div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${statusColors[alignment.status]}`}>{alignment.status}</span>
          <Icon icon="lucide:chevron-right" width={16} height={16} className="text-muted group-hover:text-accent transition-colors" />
        </div>
      </div>
      <h3 className="text-white font-semibold text-base mb-1 truncate">{alignment.name}</h3>
      <p className="text-sm text-muted line-clamp-2 mb-3">{alignment.goal}</p>
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="flex items-center gap-1"><Icon icon="lucide:list-ordered" width={12} height={12} />{alignment.steps.length} steps</span>
        {alignment.databases.length > 0 && (<span className="flex items-center gap-1"><Icon icon="lucide:database" width={12} height={12} />{alignment.databases.length} DB{alignment.databases.length !== 1 ? "s" : ""}</span>)}
        {alignment.steps.some(s => s.type === "human-approval") && (<span className="flex items-center gap-1 text-orange-400"><Icon icon="lucide:hand" width={12} height={12} />Human approval</span>)}
        {alignment.steps.some(s => s.type === "reflection") && (<span className="flex items-center gap-1 text-cyan-400"><Icon icon="lucide:scan-eye" width={12} height={12} />Reflection</span>)}
        {alignment.checkpointing && (<span className="flex items-center gap-1"><Icon icon="lucide:save" width={12} height={12} />Checkpointed</span>)}
      </div>
    </button>
  );
}

function GatheringCard({ gathering }: { gathering: Gathering }) {
  const statusColors: Record<string, string> = { draft: "text-muted bg-white/[0.06]", active: "text-green-400 bg-green-400/10", paused: "text-yellow-400 bg-yellow-400/10", completed: "text-blue-400 bg-blue-400/10" };
  const agents = gathering.participants.filter((p) => p.type === "agent");
  const humans = gathering.participants.filter((p) => p.type === "human");
  return (
    <div className="bg-card border border-card-border rounded-xl p-5 hover:border-green-400/30 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-green-400/15 flex items-center justify-center"><Icon icon="lucide:circle-dot" width={20} height={20} className="text-green-400" /></div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${statusColors[gathering.status]}`}>{gathering.status}</span>
      </div>
      <h3 className="text-white font-semibold text-base mb-1">{gathering.name}</h3>
      <p className="text-sm text-muted line-clamp-2 mb-3">{gathering.purpose}</p>
      <div className="flex items-center gap-3 text-xs text-muted mb-2">
        {agents.length > 0 && (<span className="flex items-center gap-1"><Icon icon="lucide:bot" width={12} height={12} />{agents.length} agent{agents.length !== 1 ? "s" : ""}</span>)}
        {humans.length > 0 && (<span className="flex items-center gap-1"><Icon icon="lucide:user" width={12} height={12} />{humans.length} human{humans.length !== 1 ? "s" : ""}</span>)}
        {gathering.approvalRules.length > 0 && (<span className="flex items-center gap-1 text-orange-400"><Icon icon="lucide:shield-check" width={12} height={12} />{gathering.approvalRules.length} approval rule{gathering.approvalRules.length !== 1 ? "s" : ""}</span>)}
      </div>
      {gathering.participants.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {gathering.participants.map((p) => (
            <span key={p.id} className={`text-[10px] px-2 py-0.5 rounded-full ${p.type === "agent" ? "bg-accent/10 text-accent" : "bg-white/[0.06] text-muted"}`}>
              {p.type === "agent" ? <Icon icon="lucide:bot" width={9} height={9} className="inline mr-1" /> : <Icon icon="lucide:user" width={9} height={9} className="inline mr-1" />}
              {p.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Approval Rule Card ──────────────────────────────────────────────────────────

function ApprovalRuleCard({ rule, gatheringName }: { rule: ApprovalRule; gatheringName: string }) {
  return (
    <div className="bg-card border border-card-border rounded-xl p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-orange-400/15 flex items-center justify-center flex-shrink-0">
        <Icon icon="lucide:shield-check" width={18} height={18} className="text-orange-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white mb-0.5">{rule.trigger}</div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="flex items-center gap-1"><Icon icon="lucide:gauge" width={11} height={11} />Threshold: {rule.threshold}</span>
          <span className="text-white/20">\u00B7</span>
          <span className="flex items-center gap-1"><Icon icon="lucide:user-check" width={11} height={11} />Approver: {rule.approver}</span>
        </div>
        <span className="text-[10px] text-muted/60 mt-1 block">{gatheringName}</span>
      </div>
    </div>
  );
}

// ── Topology view ───────────────────────────────────────────────────────────────

function TopologyView({ gatherings }: { gatherings: Gathering[] }) {
  return (
    <div className="space-y-4">
      <div className="bg-card border border-card-border rounded-xl p-6">
        <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
          <Icon icon="lucide:network" width={18} height={18} className="text-accent" />
          Agent Topology
        </h3>
        <p className="text-sm text-muted mb-5">
          How agents relate to each other across Gatherings, with communication paths and permission boundaries.
        </p>

        {/* Visual hierarchy */}
        <div className="space-y-3">
          {/* Platform level */}
          <div className="border border-amber-400/20 rounded-xl p-4 bg-amber-400/[0.03]">
            <div className="flex items-center gap-2 mb-3">
              <Icon icon="lucide:building-2" width={16} height={16} className="text-amber-400" />
              <span className="text-sm font-semibold text-amber-400">Platform Level</span>
              <span className="text-[10px] text-muted bg-white/[0.06] px-2 py-0.5 rounded-full">Organization-wide policies and memory</span>
            </div>

            {/* Project level */}
            <div className="border border-purple-400/20 rounded-xl p-4 bg-purple-400/[0.03] ml-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon icon="lucide:users" width={16} height={16} className="text-purple-400" />
                <span className="text-sm font-semibold text-purple-400">Project Level</span>
                <span className="text-[10px] text-muted bg-white/[0.06] px-2 py-0.5 rounded-full">Shared team context</span>
              </div>

              {/* Gatherings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                {gatherings.map((g) => (
                  <div key={g.id} className="border border-green-400/20 rounded-lg p-3 bg-green-400/[0.03]">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Icon icon="lucide:circle-dot" width={12} height={12} className="text-green-400" />
                      <span className="text-xs font-semibold text-green-400">{g.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {g.participants.map((p) => (
                        <span key={p.id} className={`text-[9px] px-1.5 py-0.5 rounded ${p.type === "agent" ? "bg-accent/15 text-accent" : "bg-white/[0.06] text-muted"}`}>
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {gatherings.length === 0 && (
                  <div className="col-span-2 text-center py-4 text-xs text-muted">No Gatherings yet. Create one to see it in the topology.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-400/20 border border-amber-400/40" />Platform Agent</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-purple-400/20 border border-purple-400/40" />Project Agent</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-400/20 border border-green-400/40" />Gathering</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-accent/20 border border-accent/40" />Agent Presence</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-white/[0.06] border border-white/20" />Human Presence</span>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function AlignPage() {
  const [alignments, setAlignments] = useState<Alignment[]>(SAMPLE_ALIGNMENTS);
  const [gatherings, setGatherings] = useState<Gathering[]>(SAMPLE_GATHERINGS);
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false);
  const [showCreateGathering, setShowCreateGathering] = useState(false);
  const [selected, setSelected] = useState<Alignment | null>(null);
  const [activeTab, setActiveTab] = useState<AlignTab>("workflows");

  // All approval rules from all gatherings
  const allApprovalRules = gatherings.flatMap((g) => g.approvalRules.map((r) => ({ ...r, gatheringName: g.name })));

  // Workflow detail view
  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-muted hover:text-white transition-colors text-sm mb-6">
          <Icon icon="lucide:arrow-left" width={16} height={16} />Back to Align
        </button>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-white">{selected.name}</h1>
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded ${selected.status === "ready" ? "text-green-400 bg-green-400/10" : "text-muted bg-white/[0.06]"}`}>{selected.status}</span>
            </div>
            <p className="text-muted max-w-xl">{selected.goal}</p>
          </div>
          <button className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-2">
            <Icon icon="lucide:play" width={16} height={16} />Run Workflow
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Agentic Flow</h2>
            <div className="bg-card border border-card-border rounded-xl p-5">
              {selected.steps.map((s, i) => (<StepNode key={s.id} step={s} index={i} onRemove={() => {}} />))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-card border border-card-border rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Configuration</h3>
              <div className="space-y-3">
                <div><div className="text-xs text-muted mb-1">Model</div><div className="text-sm text-white font-medium">{selected.model}</div></div>
                <div><div className="text-xs text-muted mb-1">Checkpointing</div><div className={`text-sm font-medium ${selected.checkpointing ? "text-green-400" : "text-muted"}`}>{selected.checkpointing ? "Enabled" : "Disabled"}</div></div>
                <div><div className="text-xs text-muted mb-1">HEARTS Scoring</div><div className={`text-sm font-medium ${selected.scoringEnabled ? "text-green-400" : "text-muted"}`}>{selected.scoringEnabled ? "Enabled" : "Disabled"}</div></div>
              </div>
            </div>
            {selected.databases.length > 0 && (
              <div className="bg-card border border-card-border rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Databases</h3>
                <div className="space-y-2">{selected.databases.map((db) => (<div key={db.id} className="flex items-center gap-2 text-sm"><span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" /><span className="text-white truncate">{db.label}</span></div>))}</div>
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

  // Tab definitions
  const TABS: { key: AlignTab; label: string; icon: string; count?: number }[] = [
    { key: "workflows", label: "Workflows", icon: "lucide:workflow", count: alignments.length },
    { key: "gatherings", label: "Gatherings", icon: "lucide:circle-dot", count: gatherings.length },
    { key: "approvals", label: "Approval Rules", icon: "lucide:shield-check", count: allApprovalRules.length },
    { key: "topology", label: "Topology", icon: "lucide:network" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Align</h1>
          <p className="text-muted mt-1">
            Orchestration, workflows, gatherings, and approval rules
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "gatherings" && (
            <button onClick={() => setShowCreateGathering(true)} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-2">
              <Icon icon="lucide:plus" width={18} height={18} />Create Gathering
            </button>
          )}
          {activeTab === "workflows" && (
            <button onClick={() => setShowCreateWorkflow(true)} className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-2">
              <Icon icon="lucide:plus" width={18} height={18} />Create Workflow
            </button>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-card border border-card-border rounded-xl p-1 mb-6">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? "bg-accent/20 text-accent" : "text-muted hover:text-white"}`}>
            <Icon icon={tab.icon} width={15} height={15} />
            {tab.label}
            {tab.count !== undefined && (<span className="text-[10px] opacity-70">{tab.count}</span>)}
          </button>
        ))}
      </div>

      {/* Workflows tab */}
      {activeTab === "workflows" && (
        <>
          <div className="bg-card border border-card-border rounded-xl p-5 mb-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0"><Icon icon="lucide:workflow" width={20} height={20} className="text-accent" /></div>
            <div>
              <h3 className="text-white font-semibold mb-1">Agentic Workflows</h3>
              <p className="text-sm text-muted leading-relaxed">A Workflow is a structured agentic loop: a sequence of steps including actions, decisions, checkpoints, reflections, human approvals, and parallel fan-outs. Each Workflow can be attached to an agent and includes its goal, model, databases, checkpointing, and HEARTS scoring configuration.</p>
            </div>
          </div>
          {alignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alignments.map((a) => (<AlignmentCard key={a.id} alignment={a} onSelect={() => setSelected(a)} />))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-4"><Icon icon="lucide:workflow" width={32} height={32} className="text-accent" /></div>
              <h3 className="text-xl font-semibold text-white mb-2">No workflows yet</h3>
              <p className="text-muted mb-6 max-w-md mx-auto">Create a Workflow to define an agentic loop \u2014 describe your goal, and AI will generate a configurable plan with steps, approvals, and reflections.</p>
              <button onClick={() => setShowCreateWorkflow(true)} className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-full transition-colors">+ Create Workflow</button>
            </div>
          )}
        </>
      )}

      {/* Gatherings tab */}
      {activeTab === "gatherings" && (
        <>
          <div className="bg-card border border-card-border rounded-xl p-5 mb-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-400/15 flex items-center justify-center flex-shrink-0"><Icon icon="lucide:circle-dot" width={20} height={20} className="text-green-400" /></div>
            <div>
              <h3 className="text-white font-semibold mb-1">Gatherings</h3>
              <p className="text-sm text-muted leading-relaxed">A Gathering is a bounded interaction context: it defines which agents participate, which users are invited (via Kinship Codes), what vibes apply, and what approval rules govern actions. This is where agents and humans actually meet.</p>
            </div>
          </div>
          {gatherings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gatherings.map((g) => (<GatheringCard key={g.id} gathering={g} />))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-green-400/15 flex items-center justify-center mx-auto mb-4"><Icon icon="lucide:circle-dot" width={32} height={32} className="text-green-400" /></div>
              <h3 className="text-xl font-semibold text-white mb-2">No Gatherings yet</h3>
              <p className="text-muted mb-6 max-w-md mx-auto">Create a Gathering to define a bounded context where agents and users interact, with specific rules and vibes.</p>
              <button onClick={() => setShowCreateGathering(true)} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full transition-colors">+ Create Gathering</button>
            </div>
          )}
        </>
      )}

      {/* Approvals tab */}
      {activeTab === "approvals" && (
        <>
          <div className="bg-card border border-card-border rounded-xl p-5 mb-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-400/15 flex items-center justify-center flex-shrink-0"><Icon icon="lucide:shield-check" width={20} height={20} className="text-orange-400" /></div>
            <div>
              <h3 className="text-white font-semibold mb-1">Approval Rules (Human-in-the-Loop)</h3>
              <p className="text-sm text-muted leading-relaxed">Critical decisions are routed to humans for approval. Define triggers (what actions need sign-off), thresholds (when to ask), and approvers (who decides). These rules are attached to Gatherings and enforced via LangGraph interrupt().</p>
            </div>
          </div>
          {allApprovalRules.length > 0 ? (
            <div className="space-y-3">
              {allApprovalRules.map((r) => (<ApprovalRuleCard key={r.id} rule={r} gatheringName={r.gatheringName} />))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-orange-400/15 flex items-center justify-center mx-auto mb-4"><Icon icon="lucide:shield-check" width={32} height={32} className="text-orange-400" /></div>
              <h3 className="text-xl font-semibold text-white mb-2">No approval rules yet</h3>
              <p className="text-muted mb-6 max-w-md mx-auto">Approval rules are created within Gatherings. Create a Gathering first, then add rules for which actions require human sign-off.</p>
            </div>
          )}
        </>
      )}

      {/* Topology tab */}
      {activeTab === "topology" && (
        <TopologyView gatherings={gatherings} />
      )}

      {/* Modals */}
      {showCreateWorkflow && (
        <CreateAlignmentModal onClose={() => setShowCreateWorkflow(false)} onCreate={(a) => { setAlignments((prev) => [a, ...prev]); setShowCreateWorkflow(false); }} />
      )}
      {showCreateGathering && (
        <CreateGatheringModal onClose={() => setShowCreateGathering(false)} onCreate={(g) => { setGatherings((prev) => [g, ...prev]); setShowCreateGathering(false); }} />
      )}
    </div>
  );
}
