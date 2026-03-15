"use client";

import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { ProjectGate } from "@/components/ProjectGate";

// ── Types ──────────────────────────────────────────────────────────────────────

type Offering = {
  id: string;
  name: string;
  category: string;
  priceRange: string;
  championMargin: string;
  description: string;
  imageUrl: string;
};

type Provider = {
  id: string;
  name: string;
  description: string;
  logo: string;
  offerings: Offering[];
};

// ── Constants ──────────────────────────────────────────────────────────────────

const categoryColor: Record<string, string> = {
  "Supplements & Nutrition": "#22c55e",
  "Wellness Technologies": "#3b82f6",
  "Health Tech": "#06b6d4",
};

// Placeholder images for products without a real URL
const PH = (bg: string, fg: string) =>
  `https://placehold.co/400x280/${bg.replace("#", "")}/${fg.replace("#", "")}`;

const initialProviders: Provider[] = [
  {
    id: "new-earth",
    name: "New Earth Technologies",
    description: "Curated wellness brands offering supplements, technologies, and health solutions — each with a Champion affiliate program for Kinship promoters.",
    logo: "https://placehold.co/80x80/111827/f97316?text=NET",
    offerings: [
      {
        id: "lajit-gold",
        name: "Lajit Gold",
        category: "Supplements & Nutrition",
        priceRange: "$45 – $100",
        championMargin: "36%",
        description: "Premium Sherpa-sourced Himalayan gold-grade shilajit resin and drops — lab-tested, sustainably harvested.",
        imageUrl: PH("#2d1b00", "#f59e0b"),
      },
      {
        id: "high-vibe-mushrooms",
        name: "High Vibe Mushrooms",
        category: "Supplements & Nutrition",
        priceRange: "$69 – $79",
        championMargin: "36%",
        description: "Certified full-spectrum proprietary blend of medicinal mushrooms using the most effective delivery systems.",
        imageUrl: "https://highvibemushrooms.com/cdn/shop/files/8_28e2edc1-f00e-4f49-b8c6-e6d53c05f427_600x600.png?v=1749764923",
      },
      {
        id: "hi-massager",
        name: "Hi Massager",
        category: "Wellness Technologies",
        priceRange: "$350",
        championMargin: "45%",
        description: "Patented percussive & vibrational massager that reduces stress, improves sleep, boosts relationships, and relieves pain.",
        imageUrl: "https://i0.wp.com/www.himassager.com/wp-content/uploads/2019/08/hi-image.jpg?fit=1920%2C1080&ssl=1",
      },
      {
        id: "fullyvital",
        name: "FullyVital",
        category: "Wellness Technologies",
        priceRange: "$100 – $239",
        championMargin: "45%",
        description: "Cutting-edge longevity science with clean, doctor-formulated haircare to reverse hair aging from the inside out.",
        imageUrl: "https://cdn.shopify.com/s/files/1/0576/8118/2916/files/fully-vital-hair-growth-system-b1.jpg?v=1767280104&width=800",
      },
      {
        id: "spiro",
        name: "Spiro",
        category: "Health Tech",
        priceRange: "$65 – $850",
        championMargin: "36%",
        description: "Patented SPIRO® system neutralizes harmful electromagnetic disturbances by filtering quantum noise and re-polarizing disruptive EMFs.",
        imageUrl: "https://spiroemf.com/cdn/shop/files/SPIRO_CARD_-_BLUE_1.png?v=1771951626&width=800",
      },
      {
        id: "self-decode",
        name: "Self Decode",
        category: "Health Tech",
        priceRange: "$418 – $690",
        championMargin: "36%",
        description: "Advanced AI analyzes over 200 million genetic variants, delivering science-backed personalized health insights.",
        imageUrl: "https://selfdecode.com/library/uploads/2025/03/new-dna-kit.png",
      },
      {
        id: "curcumin-pro",
        name: "Curcumin Pro",
        category: "Supplements & Nutrition",
        priceRange: "$16 – $69",
        championMargin: "45%",
        description: "World's first full line of curcumin-enhanced products with a patented process enabling GI and blood-brain barrier penetration.",
        imageUrl: "https://curcuminpro.com/wp-content/uploads/2025/04/gen-banner-2-scaled-1.webp",
      },
      {
        id: "scandilabs",
        name: "Scandilabs",
        category: "Supplements & Nutrition",
        priceRange: "$52",
        championMargin: "36%",
        description: "Swedish simplicity meets cutting-edge biohacking, empowering individuals to thrive naturally through accessible wellness.",
        imageUrl: PH("#1e3a5f", "#60a5fa"),
      },
      {
        id: "lumaflex",
        name: "LumaFlex",
        category: "Wellness Technologies",
        priceRange: "$599 – $689",
        championMargin: "31.5%",
        description: "Fully portable, flexible red light therapy device for faster recovery, discomfort relief, and elevated health on the go.",
        imageUrl: PH("#450a0a", "#f87171"),
      },
      {
        id: "code-health",
        name: "Code Health",
        category: "Supplements & Nutrition",
        priceRange: "$44 – $444",
        championMargin: "45%",
        description: "Therapeutic formulas infused with bio-energy patterns targeting root causes of cellular malfunction for self-repair.",
        imageUrl: "https://codehealthshop.com/wp-content/uploads/2024/10/CODE-Health-Logo-Standard-CODE-White-500px.png",
      },
      {
        id: "dr-cowans-garden",
        name: "Dr. Cowan's Garden",
        category: "Supplements & Nutrition",
        priceRange: "$20 – $250",
        championMargin: "31.5%",
        description: "Pure, nutrient-dense foods using beyond-organic ingredients and traditional processing methods, naturally preserved.",
        imageUrl: "https://www.drcowansgarden.com/cdn/shop/files/DCG_-_Kumquat_-_1920_x_1080_1_1400x.jpg",
      },
      {
        id: "analemma-water",
        name: "Analemma Water",
        category: "Wellness Technologies",
        priceRange: "$200 – $2,600",
        championMargin: "31.5%",
        description: "Restores water to its most vital state with stable, coherent structure that supports energy, immunity, and balance.",
        imageUrl: PH("#0c2d48", "#38bdf8"),
      },
      {
        id: "alii-supplements",
        name: "Alii Supplements",
        category: "Supplements & Nutrition",
        priceRange: "$33 – $44",
        championMargin: "27%",
        description: "Thoughtfully formulated to restore all nutrients deleted by birth control, helping you feel revitalized and balanced.",
        imageUrl: "https://aliisupplement.com/cdn/shop/files/HERO_IMAGE.jpg?v=1736536845&width=800",
      },
      {
        id: "blue-scorpion",
        name: "Blue Scorpion",
        category: "Supplements & Nutrition",
        priceRange: "$99 – $2,018",
        championMargin: "45%",
        description: "Harnesses rare Dominican scorpion venom to deliver natural, science-backed relief from pain and inflammation.",
        imageUrl: PH("#1e1b4b", "#818cf8"),
      },
      {
        id: "bengs-health",
        name: "Bengs Health",
        category: "Supplements & Nutrition",
        priceRange: "$45 – $90",
        championMargin: "31.5%",
        description: "Scientifically validated, non-invasive technologies that harness the body's natural ability to heal through information-based methods.",
        imageUrl: "https://bengshealth.com/wp-content/uploads/2024/08/Bengs_recover_donker_4000x4000-1024x1024.webp",
      },
      {
        id: "jinfinity",
        name: "Jinfinity",
        category: "Wellness Technologies",
        priceRange: "$50 – $1,500",
        championMargin: "45%",
        description: "Innovative longevity biomarkers and nutraceuticals for optimizing health through personalized precision interventions.",
        imageUrl: "https://www.jinfiniti.com/wp-content/themes/yootheme/cache/9d/agingsos-test-box-9d1de46e.png",
      },
      {
        id: "baloo-living",
        name: "Baloo Living",
        category: "Health Tech",
        priceRange: "$54 – $321",
        championMargin: "36%",
        description: "Eco-conscious weighted blankets made from chemical-free cotton for cool, breathable comfort with a lifetime guarantee.",
        imageUrl: "https://balooliving.com/cdn/shop/files/TF-XKZK-2PUN-TOTE_1.jpg",
      },
    ],
  },
];

// ── Image Uploader ─────────────────────────────────────────────────────────────

function ImageUploader({
  value,
  onChange,
  label,
  square = false,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  square?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="text-xs text-white/50 mb-1 block">{label}</label>
      <div
        className={`relative border-2 border-dashed border-card-border rounded-xl flex items-center justify-center cursor-pointer hover:border-accent/50 transition-colors overflow-hidden bg-background ${square ? "w-20 h-20" : "w-full h-32"}`}
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="upload preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
              <Icon icon="lucide:pencil" width={16} height={16} className="text-white" />
            </div>
          </>
        ) : (
          <div className="text-center p-3">
            <Icon icon="lucide:upload-cloud" width={22} height={22} className="text-white/30 mx-auto mb-1" />
            {!square && <p className="text-xs text-white/30">Click or drag to upload</p>}
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}

// ── Add Provider Modal ─────────────────────────────────────────────────────────

function AddProviderModal({
  onAdd,
  onClose,
}: {
  onAdd: (p: Omit<Provider, "id" | "offerings">) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-card-border rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-white font-semibold text-lg mb-4">Add Provider</h3>
        <div className="space-y-4">
          {/* Logo + name row */}
          <div className="flex items-end gap-4">
            <ImageUploader value={logo} onChange={setLogo} label="Logo" square />
            <div className="flex-1">
              <label className="text-xs text-white/50 mb-1 block">Provider Name</label>
              <input
                autoFocus
                type="text"
                placeholder="e.g. Acme Wellness Co."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && name.trim()) onAdd({ name: name.trim(), description, logo });
                }}
                className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 text-sm outline-none focus:border-accent/60"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-white/50 mb-1 block">Description</label>
            <textarea
              placeholder="What does this provider offer? Who is it for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 text-sm outline-none focus:border-accent/60 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            disabled={!name.trim()}
            onClick={() => name.trim() && onAdd({ name: name.trim(), description, logo })}
            className="px-4 py-2 rounded-lg text-sm bg-accent text-white font-medium disabled:opacity-40 hover:bg-accent/90 transition-colors"
          >
            Add Provider
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add Offering Modal ─────────────────────────────────────────────────────────

function AddOfferingModal({
  onAdd,
  onClose,
}: {
  onAdd: (o: Omit<Offering, "id">) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Supplements & Nutrition");
  const [priceRange, setPriceRange] = useState("");
  const [championMargin, setChampionMargin] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const categories = ["Supplements & Nutrition", "Wellness Technologies", "Health Tech"];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-card-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-white font-semibold text-lg mb-4">Add Offering</h3>
        <div className="space-y-3">
          {/* Product image */}
          <ImageUploader value={imageUrl} onChange={setImageUrl} label="Product Image" />

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
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
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
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            disabled={!name.trim() || !priceRange.trim()}
            onClick={() =>
              name.trim() &&
              priceRange.trim() &&
              onAdd({ name, category, priceRange, championMargin, description, imageUrl })
            }
            className="px-4 py-2 rounded-lg text-sm bg-accent text-white font-medium disabled:opacity-40 hover:bg-accent/90 transition-colors"
          >
            Add Offering
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Offering Card ──────────────────────────────────────────────────────────────

function OfferingCard({ offering }: { offering: Offering }) {
  const catColor = categoryColor[offering.category] ?? "#6b7280";

  return (
    <div className="bg-background border border-card-border rounded-xl overflow-hidden flex flex-col hover:border-white/20 transition-colors">
      {/* Image */}
      <div className="relative h-40 bg-white/[0.03] overflow-hidden flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={offering.imageUrl || `https://placehold.co/400x280/111827/374151`}
          alt={offering.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x280/111827/374151`;
          }}
        />
        {/* Category badge overlay */}
        <span
          className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: catColor + "33", color: catColor, backdropFilter: "blur(4px)" }}
        >
          {offering.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <h4 className="text-white font-semibold text-sm leading-tight mb-1">{offering.name}</h4>
        {offering.description && (
          <p className="text-xs text-white/40 leading-relaxed line-clamp-2 flex-1">{offering.description}</p>
        )}

        {/* Price & margin */}
        <div className="flex items-end justify-between mt-3 pt-3 border-t border-card-border/60">
          <div>
            <div className="text-[10px] text-white/40 mb-0.5">Retail</div>
            <div className="text-sm font-semibold text-white">{offering.priceRange}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/40 mb-0.5">Champion</div>
            <div className="text-base font-bold" style={{ color: "#22c55e" }}>
              {offering.championMargin}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function OfferingsPage() {
  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  const [expandedProviders, setExpandedProviders] = useState<Record<string, boolean>>({ "new-earth": true });
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [addOfferingFor, setAddOfferingFor] = useState<string | null>(null);

  const toggleProvider = (id: string) =>
    setExpandedProviders((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleAddProvider = (p: Omit<Provider, "id" | "offerings">) => {
    const id = p.name.toLowerCase().replace(/\s+/g, "-");
    setProviders((prev) => [...prev, { id, ...p, offerings: [] }]);
    setExpandedProviders((prev) => ({ ...prev, [id]: true }));
    setShowAddProvider(false);
  };

  const handleAddOffering = (providerId: string, offering: Omit<Offering, "id">) => {
    const id = offering.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, offerings: [...p.offerings, { ...offering, id }] } : p))
    );
    setAddOfferingFor(null);
  };

  const totalOfferings = providers.reduce((sum, p) => sum + p.offerings.length, 0);

  return (
    <ProjectGate sectionName="Offerings" icon="lucide:store">
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Offerings</h1>
          <p className="text-muted mt-1">
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

      {/* Provider list */}
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
                  {/* Logo */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.06] flex items-center justify-center">
                    {provider.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={provider.logo} alt={provider.name} className="w-full h-full object-cover" />
                    ) : (
                      <Icon icon="lucide:building-2" width={18} height={18} className="text-accent" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">{provider.name}</span>
                      <span className="text-xs text-white/40 bg-white/[0.06] px-2 py-0.5 rounded-full flex-shrink-0">
                        {provider.offerings.length} offerings
                      </span>
                    </div>
                    {provider.description && (
                      <p className="text-xs text-white/40 mt-0.5 truncate max-w-[480px]">{provider.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddOfferingFor(provider.id);
                    }}
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

              {/* Offerings card grid */}
              {isOpen && provider.offerings.length > 0 && (
                <div className="border-t border-card-border p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {provider.offerings.map((offering) => (
                      <OfferingCard key={offering.id} offering={offering} />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
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
            <button onClick={() => setShowAddProvider(true)} className="mt-3 text-sm text-accent hover:underline">
              Add your first provider
            </button>
          </div>
        )}
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
    </ProjectGate>
  );
}
