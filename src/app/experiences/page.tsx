"use client";


export default function ExperiencesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Experiences</h1>
          <p className="text-muted mt-1">3 experiences in Kinship Today</p>
        </div>
        <button className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
          + New Experience
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Ocean Explorers */}
        <div className="bg-card border border-card-border rounded-xl p-5 hover:border-accent/40 transition-colors cursor-pointer group">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🌊</span>
                <h3 className="text-white font-semibold text-lg">Ocean Explorers</h3>
              </div>
              <span className="inline-block bg-green-500/20 text-green-400 text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                Live
              </span>
            </div>
          </div>

          <p className="text-sm text-muted mb-4">Deep sea adventure with marine biology</p>

          <div className="flex gap-4 mb-4">
            <div className="bg-white/[0.06] border border-card-border rounded-lg px-4 py-3 text-center flex-1">
              <div className="text-2xl font-bold text-white">4</div>
              <div className="text-xs text-white/50">Scenes</div>
            </div>
            <div className="bg-white/[0.06] border border-card-border rounded-lg px-4 py-3 text-center flex-1">
              <div className="text-2xl font-bold text-white">2</div>
              <div className="text-xs text-white/50">Quests</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted/50">by Maya Rodriguez · Feb 2026</span>
            <span className="text-sm text-muted group-hover:text-accent transition-colors">Open &rarr;</span>
          </div>
        </div>

        {/* Time Travelers Guild */}
        <div className="bg-card border border-card-border rounded-xl p-5 hover:border-accent/40 transition-colors cursor-pointer group">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">⏳</span>
                <h3 className="text-white font-semibold text-lg">Time Travelers Guild</h3>
              </div>
              <span className="inline-block bg-green-500/20 text-green-400 text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                Live
              </span>
            </div>
          </div>

          <p className="text-sm text-muted mb-4">Collaborative history exploration</p>

          <div className="flex gap-4 mb-4">
            <div className="bg-white/[0.06] border border-card-border rounded-lg px-4 py-3 text-center flex-1">
              <div className="text-2xl font-bold text-white">6</div>
              <div className="text-xs text-white/50">Scenes</div>
            </div>
            <div className="bg-white/[0.06] border border-card-border rounded-lg px-4 py-3 text-center flex-1">
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-xs text-white/50">Quests</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted/50">by Alex Chen · Nov 2024</span>
            <span className="text-sm text-muted group-hover:text-accent transition-colors">Open &rarr;</span>
          </div>
        </div>

        {/* sample-game (existing) */}
        <div className="bg-card border border-card-border rounded-xl p-5 hover:border-accent/40 transition-colors cursor-pointer group">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🌿</span>
                <h3 className="text-white font-semibold text-lg">sample-game</h3>
              </div>
              <span className="inline-block bg-badge-draft/20 text-badge-draft text-xs font-bold px-2.5 py-0.5 rounded uppercase">
                Draft
              </span>
            </div>
          </div>

          <p className="text-sm text-muted mb-4">A sample game experience</p>

          <div className="flex gap-4 mb-4">
            <div className="bg-white/[0.06] border border-card-border rounded-lg px-4 py-3 text-center flex-1">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs text-white/50">Scenes</div>
            </div>
            <div className="bg-white/[0.06] border border-card-border rounded-lg px-4 py-3 text-center flex-1">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs text-white/50">Quests</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted/50">Draft</span>
            <span className="text-sm text-muted group-hover:text-accent transition-colors">Open &rarr;</span>
          </div>
        </div>

        {/* New Experience Card */}
        <div className="border-2 border-dashed border-card-border rounded-xl p-5 flex flex-col items-center justify-center min-h-[200px] hover:border-accent/40 transition-colors cursor-pointer group">
          <div className="text-4xl text-muted group-hover:text-accent mb-2 transition-colors">+</div>
          <div className="text-muted group-hover:text-accent transition-colors font-medium">New Experience</div>
        </div>
      </div>
    </div>
  );
}
