import { AssetGrid } from "@/components/AssetGrid";

export default function AssetsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Assets</h1>
          <p className="text-muted mt-1">Manage game assets and sprites</p>
        </div>
        <button className="bg-accent hover:bg-accent-dark text-black font-semibold px-5 py-2.5 rounded-full transition-colors">
          + Upload Asset
        </button>
      </div>

      {/* Search and filters */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search assets..."
          className="flex-1 bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
        />
        <select className="bg-input border border-card-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent/50 min-w-[140px]">
          <option>All Types</option>
          <option>Tile</option>
          <option>Object</option>
          <option>Sprite</option>
          <option>Audio</option>
        </select>
        <div className="flex border border-card-border rounded-xl overflow-hidden">
          <button className="bg-accent/20 text-accent px-3 py-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button className="bg-input text-muted px-3 py-3 hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <AssetGrid />
    </div>
  );
}
