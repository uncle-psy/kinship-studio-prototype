export default function GamesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Games</h1>
          <p className="text-muted mt-1">1 game in sample-platform</p>
        </div>
        <button className="bg-accent hover:bg-accent-dark text-black font-semibold px-5 py-2.5 rounded-full transition-colors">
          + New Game
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Game Card */}
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

          <div className="flex gap-4 mb-4">
            <div className="bg-background/50 border border-card-border rounded-lg px-4 py-3 text-center flex-1">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs text-muted">Scenes</div>
            </div>
            <div className="bg-background/50 border border-card-border rounded-lg px-4 py-3 text-center flex-1">
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-xs text-muted">Quests</div>
            </div>
          </div>

          <div className="text-sm text-muted group-hover:text-accent transition-colors">
            Click to enter game &rarr;
          </div>
        </div>

        {/* New Game Card */}
        <div className="border-2 border-dashed border-card-border rounded-xl p-5 flex flex-col items-center justify-center min-h-[200px] hover:border-accent/40 transition-colors cursor-pointer group">
          <div className="text-4xl text-muted group-hover:text-accent mb-2 transition-colors">+</div>
          <div className="text-muted group-hover:text-accent transition-colors font-medium">New Game</div>
        </div>
      </div>
    </div>
  );
}
