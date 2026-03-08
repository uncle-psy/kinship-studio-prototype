"use client";

export default function UploadAssetPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-muted mb-2">
        <span className="hover:text-accent cursor-pointer">Assets</span>
        <span className="mx-2">/</span>
        <span>Upload</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Upload Asset</h1>
          <p className="text-muted mt-1">Add a new game asset with full metadata</p>
        </div>
        <button className="bg-accent hover:bg-accent-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-2">
          💾 Upload & Save
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* File upload */}
          <div className="bg-card border border-card-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              📁 File
            </h2>
            <div className="border-2 border-dashed border-card-border rounded-xl p-12 text-center hover:border-accent/40 transition-colors cursor-pointer">
              <div className="text-4xl mb-3 opacity-50">📄</div>
              <p className="text-foreground/80 mb-1">Drop file here or click to browse</p>
              <p className="text-xs text-muted">PNG, SVG, JSON, MP3, OGG · Max 50MB</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-card border border-card-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              📋 Basic Info
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Display Name</label>
                <input
                  type="text"
                  placeholder="Grass Block (Tall)"
                  className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
                />
              </div>
              <div>
                <label className="block text-sm text-foreground/80 mb-1">
                  Slug Name <span className="text-muted">(lowercase, underscores only)</span>
                </label>
                <input
                  type="text"
                  placeholder="grass_block_tall"
                  className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
                />
              </div>
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Type</label>
                <select className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50">
                  <option>🎨 Object</option>
                  <option>🗺️ Tile</option>
                  <option>🏃 Sprite</option>
                  <option>🔊 Audio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-foreground/80 mb-1">
                  Description <span className="text-muted">(for AI scene generation context)</span>
                </label>
                <textarea
                  placeholder="Describe what this asset is and how AI should use it in scenes..."
                  rows={3}
                  className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-foreground/80 mb-1">
                  Tags <span className="text-muted">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="ground, grass, terrain, forest"
                  className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
                />
              </div>
            </div>
          </div>

          {/* Interaction */}
          <div className="bg-card border border-card-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              👆 Interaction
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Type</label>
                <select className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50">
                  <option>Tap</option>
                  <option>Hold</option>
                  <option>Drag</option>
                  <option>None</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Range (tiles)</label>
                <input
                  type="number"
                  defaultValue="1.5"
                  step="0.5"
                  className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50"
                />
              </div>
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Cooldown (ms)</label>
                <input
                  type="number"
                  defaultValue="500"
                  className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50"
                />
              </div>
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Requires Facing</label>
                <select className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Metadata */}
        <div className="space-y-6">
          {/* HEARTS Mapping */}
          <div className="bg-card border border-card-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              💚 HEARTS Mapping
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Primary Facet</label>
                <select className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50">
                  <option>None</option>
                  <option>Health</option>
                  <option>Empathy</option>
                  <option>Aspiration</option>
                  <option>Resilience</option>
                  <option>Thinking</option>
                  <option>Self-Identity</option>
                  <option>Social</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Secondary Facet</label>
                <select className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50">
                  <option>None</option>
                  <option>Health</option>
                  <option>Empathy</option>
                  <option>Aspiration</option>
                  <option>Resilience</option>
                  <option>Thinking</option>
                  <option>Self-Identity</option>
                  <option>Social</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Base Delta</label>
                <input
                  type="number"
                  defaultValue="0"
                  className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50"
                />
              </div>
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Mapping Description</label>
                <input
                  type="text"
                  placeholder="How this asset affects the facet..."
                  className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
                />
              </div>
            </div>
          </div>

          {/* Area of Effect */}
          <div className="bg-card border border-card-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              🎯 Area of Effect
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Shape</label>
                <select className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50">
                  <option>None</option>
                  <option>Circle</option>
                  <option>Rectangle</option>
                  <option>Line</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Unit</label>
                <select className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50">
                  <option>Tiles</option>
                  <option>Pixels</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="bg-card border border-card-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              📐 Dimensions
            </h2>
            <p className="text-xs text-muted mb-3">Auto-detected from image. Edit if needed.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Width (px)</label>
                <input
                  type="number"
                  defaultValue="0"
                  className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50"
                />
              </div>
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Height (px)</label>
                <input
                  type="number"
                  defaultValue="0"
                  className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50"
                />
              </div>
            </div>
          </div>

          {/* Hitbox */}
          <div className="bg-card border border-card-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              📏 Hitbox
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Width</label>
                <input type="number" defaultValue="1" className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50" />
              </div>
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Height</label>
                <input type="number" defaultValue="1" className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50" />
              </div>
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Offset X</label>
                <input type="number" defaultValue="0" className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50" />
              </div>
              <div>
                <label className="block text-sm text-foreground/80 mb-1">Offset Y</label>
                <input type="number" defaultValue="0" className="w-full bg-input border border-card-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-accent/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
