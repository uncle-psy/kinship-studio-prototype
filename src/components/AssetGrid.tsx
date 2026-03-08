"use client";

const sampleAssets = [
  { name: "Small Stone", slug: "stone_small", size: "3 KB", tags: ["stone", "small"], type: "Object", color: "#94a3b8" },
  { name: "Wooden Hammer (Small)", slug: "hammer_wooden_small", size: "5 KB", tags: ["tool", "hammer"], type: "Object", color: "#d97706" },
  { name: "Wooden Hammer (Large)", slug: "hammer_wooden_large", size: "4 KB", tags: ["tool", "hammer"], type: "Object", color: "#b45309" },
  { name: "Stone Forge (Tall)", slug: "forge_stone_tall", size: "14 KB", tags: ["forge", "stone"], type: "Object", color: "#6b7280" },
  { name: "Stone Forge (Short)", slug: "forge_stone_short", size: "7 KB", tags: ["forge", "stone"], type: "Object", color: "#4b5563" },
  { name: "Wooden Door (Tall Front)", slug: "door_tall_front", size: "4 KB", tags: ["door", "wood"], type: "Object", color: "#92400e" },
  { name: "Wooden Door (Tall Side)", slug: "door_tall_side", size: "4 KB", tags: ["door", "wood"], type: "Object", color: "#78350f" },
  { name: "Wooden Door (Short)", slug: "door_short_side", size: "3 KB", tags: ["door", "wood"], type: "Object", color: "#a16207" },
  { name: "Grass Tile (Light)", slug: "grass_light", size: "2 KB", tags: ["grass", "terrain"], type: "Tile", color: "#16a34a" },
  { name: "Grass Tile (Dark)", slug: "grass_dark", size: "2 KB", tags: ["grass", "terrain"], type: "Tile", color: "#15803d" },
  { name: "Water Tile", slug: "water_tile", size: "3 KB", tags: ["water", "terrain"], type: "Tile", color: "#0284c7" },
  { name: "Sand Tile", slug: "sand_tile", size: "2 KB", tags: ["sand", "terrain"], type: "Tile", color: "#ca8a04" },
];

export function AssetGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {sampleAssets.map((asset) => (
        <div
          key={asset.slug}
          className="bg-card border border-card-border rounded-xl overflow-hidden hover:border-accent/40 transition-colors cursor-pointer group"
        >
          {/* Asset preview */}
          <div className="h-40 bg-background/50 flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity"
              style={{
                background: `linear-gradient(135deg, ${asset.color}, ${asset.color}88)`,
                boxShadow: `0 4px 12px ${asset.color}33`,
              }}
            />
          </div>

          {/* Asset info */}
          <div className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">📁</span>
              <span className="text-white text-sm font-medium truncate">{asset.name}</span>
            </div>
            <div className="text-xs text-muted mb-2 truncate">{asset.slug}</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">{asset.size}</span>
              <div className="flex gap-1">
                {asset.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-muted bg-background/50 px-1.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
