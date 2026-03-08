"use client";

import { useState } from "react";

const categories = ["All", "Signals", "Scene", "NPC", "Sages", "Challenge", "General"];
const statuses = ["All", "Draft", "Pending", "Ingested", "Failed"];

export default function KnowledgePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Knowledge Base</h1>
          <p className="text-muted mt-1">0 documents</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-card border border-card-border hover:border-accent/50 text-foreground font-medium px-4 py-2.5 rounded-full transition-colors flex items-center gap-2">
            🔄 Ingest
          </button>
          <button className="bg-card border border-card-border hover:border-accent/50 text-foreground font-medium px-4 py-2.5 rounded-full transition-colors flex items-center gap-2">
            📄 Upload PDF
          </button>
          <button className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors">
            + New Document
          </button>
        </div>
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
            placeholder="Search documents..."
            className="w-full bg-input border border-card-border rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-muted mr-1">Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedCategory === cat
                ? "bg-accent text-white font-medium"
                : "bg-card border border-card-border text-foreground/80 hover:border-accent/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-sm text-muted mr-1">Status:</span>
        {statuses.map((status) => (
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
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-white mb-2">No documents found</h3>
        <p className="text-muted mb-6">Add knowledge documents to provide context for AI interactions.</p>
        <button className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-full transition-colors">
          + Create Document
        </button>
      </div>
    </div>
  );
}
