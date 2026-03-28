"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import type { Presence, AgentLevel } from "@/lib/types";

const HANDLE_RE = /^[a-zA-Z0-9_.]*$/;
const HANDLE_MAX = 25;

function suggestHandle(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_.]/g, "")
    .slice(0, HANDLE_MAX);
}

function handleError(h: string): string | null {
  if (!h) return null;
  if (!HANDLE_RE.test(h)) return "Only letters, numbers, underscores, and periods allowed";
  if (h.length > HANDLE_MAX) return `Max ${HANDLE_MAX} characters`;
  return null;
}

const LEVEL_UI: Record<
  AgentLevel,
  { label: string; tag: string; icon: string; color: string; bgColor: string; subtitle: string; placeholder: string; handlePlaceholder: string; descPlaceholder: string }
> = {
  presence: {
    label: "New Presence",
    tag: "Personal",
    icon: "lucide:user-round",
    color: "text-accent",
    bgColor: "bg-accent/15",
    subtitle: "A user\u2019s sovereign agent that delegates to specialists",
    placeholder: "e.g. The Wandering Scholar, Shadow Fox, The Tide\u2026",
    handlePlaceholder: "wandering_scholar",
    descPlaceholder:
      "e.g. A cunning arctic fox spirit who guides lost travellers. Or: a swirling dust storm with a mischievous personality.",
  },
  project: {
    label: "New Project Agent",
    tag: "Team",
    icon: "lucide:users",
    color: "text-purple-400",
    bgColor: "bg-purple-400/15",
    subtitle: "Coordinates multiple agents within a project team",
    placeholder: "e.g. Campaign Coordinator, Care Team Lead, Syndicate Manager\u2026",
    handlePlaceholder: "campaign_coordinator",
    descPlaceholder:
      "e.g. Coordinates investor onboarding across the DC and NY syndicates, managing shared context and handoffs.",
  },
  platform: {
    label: "New Platform Agent",
    tag: "Organization",
    icon: "lucide:building-2",
    color: "text-amber-400",
    bgColor: "bg-amber-400/15",
    subtitle: "Operates at the organization level across all projects",
    placeholder: "e.g. Association Director, Network Governor, Platform Orchestrator\u2026",
    handlePlaceholder: "platform_director",
    descPlaceholder:
      "e.g. Enforces organizational policies, maintains platform-wide memory, and coordinates cross-project workflows.",
  },
};

interface Props {
  onClose: () => void;
  onCreate: (presence: Presence) => void;
  projectId?: string;
  agentLevel?: AgentLevel;
}

export function CreatePresenceModal({
  onClose,
  onCreate,
  projectId,
  agentLevel = "presence",
}: Props) {
  const ui = LEVEL_UI[agentLevel];
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [handleTouched, setHandleTouched] = useState(false);
  const [briefDescription, setBriefDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function onNameChange(val: string) {
    setName(val);
    if (!handleTouched) {
      setHandle(suggestHandle(val));
    }
  }

  function onHandleChange(val: string) {
    const cleaned = val.replace(/[^a-zA-Z0-9_.]/g, "").slice(0, HANDLE_MAX);
    setHandle(cleaned);
    setHandleTouched(true);
  }

  const inlineHandleError = handleTouched ? handleError(handle) : null;
  const canSubmit =
    name.trim() && handle.trim() && !handleError(handle) && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          handle: handle.trim(),
          briefDescription: briefDescription.trim(),
          projectId,
          agentLevel,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create agent");
        return;
      }
      const data = await res.json();
      onCreate(data.presence);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-card-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${ui.bgColor} flex items-center justify-center`}
            >
              <Icon
                icon={ui.icon}
                width={20}
                height={20}
                className={ui.color}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white">
                  {ui.label}
                </h2>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${ui.bgColor} ${ui.color}`}
                >
                  {ui.tag}
                </span>
              </div>
              <p className="text-xs text-muted">{ui.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-white transition-colors p-1"
          >
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Agent Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={ui.placeholder}
              autoFocus
              className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
            />
          </div>

          {/* Handle */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Handle
              <span className="text-muted font-normal ml-1">
                (unique \u00B7 letters, numbers, _ and . \u00B7 max 25)
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm select-none">
                @
              </span>
              <input
                type="text"
                value={handle}
                onChange={(e) => onHandleChange(e.target.value)}
                onBlur={() => setHandleTouched(true)}
                placeholder={ui.handlePlaceholder}
                maxLength={HANDLE_MAX}
                className={`w-full bg-input border rounded-xl pl-8 pr-14 py-3 text-foreground placeholder:text-muted focus:outline-none transition-colors ${
                  inlineHandleError
                    ? "border-red-500/50 focus:border-red-500/70"
                    : "border-card-border focus:border-accent/50"
                }`}
              />
              <span
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs tabular-nums ${
                  handle.length >= HANDLE_MAX ? "text-red-400" : "text-muted"
                }`}
              >
                {handle.length}/{HANDLE_MAX}
              </span>
            </div>
            {inlineHandleError && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <Icon icon="lucide:alert-circle" width={12} height={12} />
                {inlineHandleError}
              </p>
            )}
          </div>

          {/* Brief Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Brief Description
              <span className="text-muted font-normal ml-1">(optional)</span>
            </label>
            <textarea
              value={briefDescription}
              onChange={(e) => setBriefDescription(e.target.value)}
              placeholder={ui.descPlaceholder}
              rows={3}
              className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 text-sm resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 flex items-center gap-1.5">
              <Icon icon="lucide:alert-circle" width={14} height={14} />
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/[0.06] hover:bg-white/[0.1] border border-card-border text-foreground font-medium px-4 py-2.5 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <Icon
                  icon="lucide:loader-2"
                  width={16}
                  height={16}
                  className="animate-spin"
                />
              ) : (
                <Icon icon="lucide:plus" width={16} height={16} />
              )}
              {loading ? "Creating\u2026" : `Create ${agentLevel === "presence" ? "Presence" : agentLevel === "project" ? "Project Agent" : "Platform Agent"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
