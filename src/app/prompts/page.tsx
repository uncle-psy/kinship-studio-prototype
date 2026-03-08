"use client";

import { useState } from "react";

const tiers = [
  { name: "Tier 1 — Global", description: "Applied to all conversations", icon: "🌍", count: 0 },
  { name: "Tier 2 — Scene", description: "Applied within specific scenes", icon: "🖼️", count: 0 },
  { name: "Tier 3 — NPC", description: "Applied to specific NPC conversations", icon: "🛡️", count: 0 },
];

const statusFilters = ["All", "Draft", "Active", "Archived"];

export default function PromptsPage() {
  const [selectedStatus, setSelectedStatus] = useState("All");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Prompts</h1>
          <p className="text-muted mt-1">0 prompts</p>
        </div>
        <button className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors">
          + New Prompt
        </button>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="bg-card border border-card-border rounded-xl p-5 hover:border-accent/40 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">{tier.icon}</span>
              <span className="text-2xl font-bold text-white">{tier.count}</span>
            </div>
            <h3 className="text-white font-semibold mb-1">{tier.name}</h3>
            <p className="text-sm text-muted">{tier.description}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search prompts..."
            className="w-full bg-input border border-card-border rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
          />
        </div>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-sm text-muted mr-1">Status:</span>
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedStatus === status
                ? "bg-accent text-white font-medium"
                : "bg-card border border-card-border text-foreground/80 hover:border-accent/50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-white mb-2">No prompts found</h3>
        <p className="text-muted mb-6">Create prompts to guide AI behavior in different contexts.</p>
        <button className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-full transition-colors">
          + Create Prompt
        </button>
      </div>
    </div>
  );
}
