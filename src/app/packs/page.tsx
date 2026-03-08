export default function PacksPage() {
  const packs = [
    { name: "Forest Kit", details: "6 tiles, 8 objects, 4 sprites, 6 audio", count: 24 },
    { name: "Gym Equipment", details: "3 tiles, 10 objects, 2 sprites", count: 15 },
    { name: "Zen Garden", details: "4 tiles, 12 objects, 2 sprites, 2 audio", count: 20 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Asset Packs</h1>
          <p className="text-muted mt-1">Reusable asset groups for sample-platform</p>
        </div>
        <button className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors">
          + New Pack
        </button>
      </div>

      {/* Info card */}
      <div className="bg-card border border-card-border rounded-xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="text-accent font-semibold mb-1">What are Asset Packs?</h3>
            <p className="text-sm text-muted leading-relaxed">
              Asset Packs group related assets into reusable collections. Instead of picking individual tiles, sprites, and objects each time, select a pack like &ldquo;Forest Kit&rdquo; and get everything you need.
            </p>
          </div>
        </div>
      </div>

      {/* Pack list */}
      <div className="space-y-3">
        {packs.map((pack) => (
          <div
            key={pack.name}
            className="bg-card border border-card-border rounded-xl p-5 flex items-center justify-between hover:border-accent/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-900/30 rounded-lg flex items-center justify-center text-lg">
                📁
              </div>
              <div>
                <h3 className="text-white font-medium">{pack.name}</h3>
                <p className="text-sm text-muted">{pack.details}</p>
              </div>
            </div>
            <span className="bg-accent/15 text-accent text-sm font-medium px-3 py-1 rounded-full">
              {pack.count} assets
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
