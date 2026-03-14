"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

const facets = [
  { letter: "H", name: "Health", description: "Physical wellbeing and body awareness", score: 50, color: "#ef4444" },
  { letter: "E", name: "Empathy", description: "Understanding and sharing emotions", score: 50, color: "#f97316" },
  { letter: "A", name: "Aspiration", description: "Goal-setting and future thinking", score: 50, color: "#f59e0b" },
  { letter: "R", name: "Resilience", description: "Bouncing back from challenges", score: 50, color: "#22c55e" },
  { letter: "T", name: "Thinking", description: "Critical and creative reasoning", score: 50, color: "#3b82f6" },
  { letter: "Si", name: "Self-Identity", description: "Understanding and accepting oneself", score: 50, color: "#a855f7" },
  { letter: "So", name: "Social", description: "Communication and relationship skills", score: 50, color: "#ec4899" },
];

type Offering = {
  id: string;
  name: string;
  category: string;
  priceRange: string;
  championMargin: string;
  description: string;
};

type Provider = {
  id: string;
  name: string;
  offerings: Offering[];
};

const categoryColor: Record<string, string> = {
  "Supplements & Nutrition": "#22c55e",
  "Wellness Technologies": "#3b82f6",
  "Health Tech": "#06b6d4",
};

const initialProviders: Provider[] = [
  {
    id: "new-earth",
    name: "New Earth Technologies",
    offerings: [
      { id: "lajit-gold", name: "Lajit Gold", category: "Supplements & Nutrition", priceRange: "$45 – $100", championMargin: "36%", description: "Premium Sherpa-sourced Himalayan gold-grade shilajit resin and drops — lab-tested, sustainably harvested." },
      { id: "high-vibe-mushrooms", name: "High Vibe Mushrooms", category: "Supplements & Nutrition", priceRange: "$69 – $79", championMargin: "36%", description: "Certified full-spectrum proprietary blend of medicinal mushrooms using the most effective delivery systems." },
      { id: "hi-massager", name: "Hi Massager", category: "Wellness Technologies", priceRange: "$350", championMargin: "45%", description: "Patented percussive & vibrational massager that reduces stress, improves sleep, boosts relationships, and relieves pain." },
      { id: "fullyvital", name: "FullyVital", category: "Wellness Technologies", priceRange: "$100 – $239", championMargin: "45%", description: "Cutting-edge longevity science with clean, doctor-formulated haircare to reverse hair aging from the inside out." },
      { id: "spiro", name: "Spiro", category: "Health Tech", priceRange: "$65 – $850", championMargin: "36%", description: "Patented SPIRO® system neutralizes harmful electromagnetic disturbances by filtering quantum noise and re-polarizing disruptive EMFs." },
      { id: "self-decode", name: "Self Decode", category: "Health Tech", priceRange: "$418 – $690", championMargin: "36%", description: "Advanced AI analyzes over 200 million genetic variants, delivering science-backed personalized health insights." },
      { id: "curcumin-pro", name: "Curcumin Pro", category: "Supplements & Nutrition", priceRange: "$16 – $69", championMargin: "45%", description: "World's first full line of curcumin-enhanced products with a patented process enabling GI and blood-brain barrier penetration." },
      { id: "scandilabs", name: "Scandilabs", category: "Supplements & Nutrition", priceRange: "$52", championMargin: "36%", description: "Swedish simplicity meets cutting-edge biohacking, empowering individuals to thrive naturally through accessible wellness." },
      { id: "lumaflex", name: "LumaFlex", category: "Wellness Technologies", priceRange: "$599 – $689", championMargin: "31.5%", description: "Fully portable, flexible red light therapy device for faster recovery, discomfort relief, and elevated health on the go." },
      { id: "code-health", name: "Code Health", category: "Supplements & Nutrition", priceRange: "$44 – $444", championMargin: "45%", description: "Therapeutic formulas infused with bio-energy patterns targeting root causes of cellular malfunction for self-repair." },
      { id: "dr-cowans-garden", name: "Dr. Cowan's Garden", category: "Supplements & Nutrition", priceRange: "$20 – $250", championMargin: "31.5%", description: "Pure, nutrient-dense foods using beyond-organic ingredients and traditional processing methods, naturally preserved." },
      { id: "analemma-water", name: "Analemma Water", category: "Wellness Technologies", priceRange: "$200 – $2,600", championMargin: "31.5%", description: "Restores water to its most vital state with stable, coherent structure that supports energy, immunity, and balance." },
      { id: "alii-supplements", name: "Alii Supplements", category: "Supplements & Nutrition", priceRange: "$33 – $44", championMargin: "27%", description: "Thoughtfully formulated to restore all nutrients deleted by birth control, helping you feel revitalized and balanced." },
      { id: "blue-scorpion", name: "Blue Scorpion", category: "Supplements & Nutrition", priceRange: "$99 – $2,018", championMargin: "45%", description: "Harnesses rare Dominican scorpion venom to deliver natural, science-backed relief from pain and inflammation." },
      { id: "bengs-health", name: "Bengs Health", category: "Supplements & Nutrition", priceRange: "$45 – $90", championMargin: "31.5%", description: "Scientifically validated, non-invasive technologies that harness the body's natural ability to heal through information-based methods." },
      { id: "jinfinity", name: "Jinfinity", category: "Wellness Technologies", priceRange: "$50 – $1,500", championMargin: "45%", description: "Innovative longevity biomarkers and nutraceuticals for optimizing health through personalized precision interventions." },
      { id: "baloo-living", name: "Baloo Living", category: "Health Tech", priceRange: "$54 – $321", championMargin: "36%", description: "Eco-conscious weighted blankets made from chemical-free cotton for cool, breathable comfort with a lifetime guarantee." },
    ],
  },
];

function AddProviderModal({ onAdd, onClose }: { onAdd: (name: string) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-card border border-card-border rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-white font-semibold text-lg mb-4">Add Provider</h3>
        <input
          autoFocus
          type="text"
          placeholder="Provider name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) { onAdd(name.trim()); } }}
          className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 text-sm outline-none focus:border-accent/60 mb-4"
        />
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white transition-colors">Cancel</button>
          <button
            disabled={!name.trim()}
            onClick={() => name.trim() && onAdd(name.trim())}
            className="px-4 py-2 rounded-lg text-sm bg-accent text-white font-medium disabled:opacity-40 hover:bg-accent/90 transition-colors"
          >
            Add Provider
          </button>
        </div>
      </div>
    </div>
  );
}

function AddOfferingModal({ onAdd, onClose }: { onAdd: (o: Omit<Offering, "id">) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Supplements & Nutrition");
  const [priceRange, setPriceRange] = useState("");
  const [championMargin, setChampionMargin] = useState("");
  const [description, setDescription] = useState("");

  const categories = ["Supplements & Nutrition", "Wellness Technologies", "Health Tech"];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-card border border-card-border rounded-2xl p-6 w-full max-w-lg">
        <h3 className="text-white font-semibold text-lg mb-4">Add Offering</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/50 mb-1 block">Name</label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Super Greens"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 text-sm outline-none focus:border-accent/60"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-accent/60"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/50 mb-1 block">Retail Price</label>
              <input
                type="text"
                placeholder="e.g. $49 – $99"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 text-sm outline-none focus:border-accent/60"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Champion Margin</label>
              <input
                type="text"
                placeholder="e.g. 36%"
                value={championMargin}
                onChange={(e) => setChampionMargin(e.target.value)}
                className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 text-sm outline-none focus:border-accent/60"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1 block">Description</label>
            <textarea
              placeholder="Short description of the offering"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 text-sm outline-none focus:border-accent/60 resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white transition-colors">Cancel</button>
          <button
            disabled={!name.trim() || !priceRange.trim()}
            onClick={() => name.trim() && priceRange.trim() && onAdd({ name, category, priceRange, championMargin, description })}
            className="px-4 py-2 rounded-lg text-sm bg-accent text-white font-medium disabled:opacity-40 hover:bg-accent/90 transition-colors"
          >
            Add Offering
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  const [expandedProviders, setExpandedProviders] = useState<Record<string, boolean>>({ "new-earth": true });
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [addOfferingFor, setAddOfferingFor] = useState<string | null>(null);

  const toggleProvider = (id: string) =>
    setExpandedProviders((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleAddProvider = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, "-");
    setProviders((prev) => [...prev, { id, name, offerings: [] }]);
    setExpandedProviders((prev) => ({ ...prev, [id]: true }));
    setShowAddProvider(false);
  };

  const handleAddOffering = (providerId: string, offering: Omit<Offering, "id">) => {
    const id = offering.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId ? { ...p, offerings: [...p.offerings, { ...offering, id }] } : p
      )
    );
    setAddOfferingFor(null);
  };

  const totalOfferings = providers.reduce((sum, p) => sum + p.offerings.length, 0);

  return (
    <div>
      {/* ── Vibes header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Vibes</h1>
          <p className="text-muted mt-1">7 vibes of personal growth measurement</p>
        </div>
        <button className="bg-card border border-card-border hover:border-accent/50 text-foreground font-medium px-5 py-2.5 rounded-full transition-colors flex items-center gap-2">
          📋 Rubric Editor
        </button>
      </div>

      {/* ── Vibes grid ── */}
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
            <div className="h-2 bg-background/50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${facet.score}%`, backgroundColor: facet.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Offerings section ── */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-white">Offerings</h2>
            <p className="text-muted text-sm mt-0.5">
              {providers.length} {providers.length === 1 ? "provider" : "providers"} · {totalOfferings} offerings
            </p>
          </div>
          <button
            onClick={() => setShowAddProvider(true)}
            className="flex items-center gap-2 bg-accent/10 hover:bg-accent/20 border border-accent/30 hover:border-accent/60 text-accent font-medium px-4 py-2 rounded-full text-sm transition-colors"
          >
            <Icon icon="lucide:plus" width={16} height={16} />
            Add Provider
          </button>
        </div>

        <div className="space-y-4">
          {providers.map((provider) => {
            const isOpen = expandedProviders[provider.id] ?? true;
            return (
              <div key={provider.id} className="bg-card border border-card-border rounded-2xl overflow-hidden">
                {/* Provider header */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
                  onClick={() => toggleProvider(provider.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
                      <Icon icon="lucide:building-2" width={16} height={16} className="text-accent" />
                    </div>
                    <div>
                      <span className="text-white font-semibold">{provider.name}</span>
                      <span className="ml-2 text-xs text-white/40 bg-white/[0.06] px-2 py-0.5 rounded-full">
                        {provider.offerings.length} offerings
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setAddOfferingFor(provider.id); }}
                      className="flex items-center gap-1.5 text-xs text-accent hover:bg-accent/10 px-3 py-1.5 rounded-full border border-accent/30 hover:border-accent/60 transition-colors"
                    >
                      <Icon icon="lucide:plus" width={12} height={12} />
                      Add Offering
                    </button>
                    <Icon
                      icon={isOpen ? "lucide:chevron-up" : "lucide:chevron-down"}
                      width={16}
                      height={16}
                      className="text-white/40"
                    />
                  </div>
                </div>

                {/* Offerings list */}
                {isOpen && provider.offerings.length > 0 && (
                  <div className="border-t border-card-border divide-y divide-card-border/60">
                    {provider.offerings.map((offering) => {
                      const catColor = categoryColor[offering.category] ?? "#6b7280";
                      return (
                        <div
                          key={offering.id}
                          className="px-5 py-3 hover:bg-white/[0.02] transition-colors flex items-center gap-3"
                        >
                          {/* Category dot */}
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: catColor }} />

                          {/* Name + category */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-white text-sm font-medium truncate">{offering.name}</span>
                              <span
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: catColor + "22", color: catColor }}
                              >
                                {offering.category}
                              </span>
                            </div>
                            {offering.description && (
                              <p className="text-xs text-white/30 mt-0.5 truncate">{offering.description}</p>
                            )}
                          </div>

                          {/* Price & margin */}
                          <div className="flex items-center gap-5 flex-shrink-0">
                            <div className="text-right">
                              <div className="text-[10px] text-white/40 mb-0.5">Retail</div>
                              <div className="text-sm font-semibold text-white whitespace-nowrap">{offering.priceRange}</div>
                            </div>
                            <div className="text-right w-[72px]">
                              <div className="text-[10px] text-white/40 mb-0.5">Champion</div>
                              <div className="text-sm font-bold whitespace-nowrap" style={{ color: "#22c55e" }}>
                                {offering.championMargin}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {isOpen && provider.offerings.length === 0 && (
                  <div className="border-t border-card-border px-5 py-8 text-center">
                    <p className="text-white/30 text-sm">No offerings yet.</p>
                    <button
                      onClick={() => setAddOfferingFor(provider.id)}
                      className="mt-3 text-xs text-accent hover:underline"
                    >
                      Add the first offering
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {providers.length === 0 && (
            <div className="bg-card border border-card-border border-dashed rounded-2xl px-5 py-12 text-center">
              <Icon icon="lucide:store" width={32} height={32} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No providers yet.</p>
              <button
                onClick={() => setShowAddProvider(true)}
                className="mt-3 text-sm text-accent hover:underline"
              >
                Add your first provider
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddProvider && (
        <AddProviderModal onAdd={handleAddProvider} onClose={() => setShowAddProvider(false)} />
      )}
      {addOfferingFor && (
        <AddOfferingModal
          onAdd={(o) => handleAddOffering(addOfferingFor, o)}
          onClose={() => setAddOfferingFor(null)}
        />
      )}
    </div>
  );
}
