const facets = [
  { letter: "H", name: "Health", description: "Physical wellbeing and body awareness", score: 50, color: "#ef4444" },
  { letter: "E", name: "Empathy", description: "Understanding and sharing emotions", score: 50, color: "#f97316" },
  { letter: "A", name: "Aspiration", description: "Goal-setting and future thinking", score: 50, color: "#f59e0b" },
  { letter: "R", name: "Resilience", description: "Bouncing back from challenges", score: 50, color: "#22c55e" },
  { letter: "T", name: "Thinking", description: "Critical and creative reasoning", score: 50, color: "#3b82f6" },
  { letter: "Si", name: "Self-Identity", description: "Understanding and accepting oneself", score: 50, color: "#a855f7" },
  { letter: "So", name: "Social", description: "Communication and relationship skills", score: 50, color: "#ec4899" },
];

export default function ProgressPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Signals Framework</h1>
          <p className="text-muted mt-1">7 signals of personal growth measurement</p>
        </div>
        <button className="bg-card border border-card-border hover:border-accent/50 text-foreground font-medium px-5 py-2.5 rounded-full transition-colors flex items-center gap-2">
          📋 Rubric Editor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facets.map((facet) => (
          <div
            key={facet.name}
            className="bg-card border border-card-border rounded-xl p-5 hover:border-accent/40 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: facet.color }}
                >
                  {facet.letter}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{facet.name}</h3>
                  <p className="text-sm text-muted truncate max-w-[200px]">{facet.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{facet.score}</div>
                <div className="text-xs text-muted">avg score</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-background/50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${facet.score}%`,
                  backgroundColor: facet.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
