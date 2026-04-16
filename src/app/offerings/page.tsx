"use client";

import { useRef, useState } from "react";
import { Icon } from "@iconify/react";

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
  "Benefits Navigation": "#eb8000",
  "Career Re-entry": "#22c55e",
  "Education & Curriculum": "#f59e0b",
  "Employer Certification": "#a855f7",
  "Research Grants": "#06b6d4",
  "Placemaking": "#3b82f6",
  "Creator Fund": "#ec4899",
};

// Placeholder images for products without a real URL
const PH = (bg: string, fg: string) =>
  `https://placehold.co/400x280/${bg.replace("#", "")}/${fg.replace("#", "")}`;

const initialProviders: Provider[] = [
  {
    id: "service-alliance",
    name: "Service Alliance",
    description:
      "Offerings commissioned through Service Alliance Markets — Executor-delivered services that close the gap between those who served and the systems built to support them. Champion margins fund VSO chapter operations.",
    logo: "https://placehold.co/80x80/0c1d2e/eb8000?text=SA",
    offerings: [
      {
        id: "sa-peer-nav",
        name: "Peer Navigator Session (1:1)",
        category: "Benefits Navigation",
        priceRange: "Free · sponsor-funded",
        championMargin: "100% stipend to chapter",
        description:
          "A 60-minute working session with a trained Peer Navigator Executor that runs the veteran through benefits intake, mental-health screening, and claim filing.",
        imageUrl: PH("#0c1d2e", "#eb8000"),
      },
      {
        id: "sa-claim-filing",
        name: "VA Claim Filing Executor",
        category: "Benefits Navigation",
        priceRange: "Free · sponsor-funded",
        championMargin: "VSO partner fee",
        description:
          "Authorized on Proposal passage, this Executor assembles evidence, completes VA forms, and files claims end-to-end under its Kinship Code scope.",
        imageUrl: PH("#0c1d2e", "#eb8000"),
      },
      {
        id: "sa-employer-cert",
        name: "Service Alliance Employer Certification",
        category: "Employer Certification",
        priceRange: "$15k – $60k / yr",
        championMargin: "30% to coordinating chapter",
        description:
          "Annual certification for employers who commit to mentor match, 12-month retention targets, and transparent reporting on veteran hires.",
        imageUrl: PH("#0c1d2e", "#a855f7"),
      },
      {
        id: "sa-reentry-placement",
        name: "Career Re-entry Placement",
        category: "Career Re-entry",
        priceRange: "$2,500 placement fee",
        championMargin: "40%",
        description:
          "Placement into a Service Alliance certified employer with a 12-month retention stipend for both the veteran and the hiring manager.",
        imageUrl: PH("#0c1d2e", "#22c55e"),
      },
    ],
  },
  {
    id: "loving-workplace",
    name: "Center for a Loving Workplace",
    description:
      "Offerings authorized through CLW Markets — curriculum, certification, and research services delivered by CLW Executors under heart-centered standards.",
    logo: "https://placehold.co/80x80/2d1d00/f59e0b?text=CLW",
    offerings: [
      {
        id: "clw-loving-manager",
        name: "Loving Manager Track (12-week cohort)",
        category: "Education & Curriculum",
        priceRange: "$1,200 / seat",
        championMargin: "28%",
        description:
          "Twelve-week cohort for managers that pairs each participant with an Elector-coached feedback loop. Includes Modules 1–4 and cohort stipend.",
        imageUrl: PH("#2d1d00", "#f59e0b"),
      },
      {
        id: "clw-exec-track",
        name: "Loving Executive Track",
        category: "Education & Curriculum",
        priceRange: "$4,800 / seat",
        championMargin: "28%",
        description:
          "Six-session leadership track covering compassionate feedback, trauma-informed decision making, and values-weighted capital allocation.",
        imageUrl: PH("#2d1d00", "#f59e0b"),
      },
      {
        id: "clw-cert-audit",
        name: "Loving Workplace Certification Audit",
        category: "Employer Certification",
        priceRange: "$22k – $75k",
        championMargin: "20% to certified auditor",
        description:
          "Onsite audit, anonymous employee pulse, and renewal review — everything a Proposal needs to resolve a certification renewal decision.",
        imageUrl: PH("#2d1d00", "#a855f7"),
      },
      {
        id: "clw-research-grant",
        name: "Research Replication Grant",
        category: "Research Grants",
        priceRange: "$50k – $500k",
        championMargin: "5% grant admin",
        description:
          "Pre-registered replication grants disbursed by the Grants Executor against an OSF pre-registration and milestone schedule.",
        imageUrl: PH("#2d1d00", "#06b6d4"),
      },
    ],
  },
  {
    id: "silicon-beach",
    name: "Silicon Beach Exchange",
    description:
      "Offerings issued by SBX Markets — placemaking services, creator grants, and residency programs delivered by Executors grounded in complementary consciousness.",
    logo: "https://placehold.co/80x80/0a1f30/06b6d4?text=SBX",
    offerings: [
      {
        id: "sbx-venue-series",
        name: "Coastal Venue Series (6 weeks)",
        category: "Placemaking",
        priceRange: "$75k – $120k",
        championMargin: "22% to host venue",
        description:
          "Coordinated six-week programming across four coastal venues. Executor orchestrates venue contracts, talent payout, permits, and after-actions.",
        imageUrl: PH("#0a1f30", "#3b82f6"),
      },
      {
        id: "sbx-creator-grant",
        name: "Creator Fund Milestone Grant",
        category: "Creator Fund",
        priceRange: "$20k – $120k",
        championMargin: "10% to residency producer",
        description:
          "Phased, milestone-based grant issued to resident creators whose work embodies complementary consciousness.",
        imageUrl: PH("#0a1f30", "#ec4899"),
      },
      {
        id: "sbx-residency",
        name: "Annenberg Residency",
        category: "Creator Fund",
        priceRange: "$25k",
        championMargin: "15%",
        description:
          "Two-week residency at the Annenberg Community Beach House including a public-facing installation and opening night curated by the Placemaking Operator.",
        imageUrl: PH("#0a1f30", "#ec4899"),
      },
      {
        id: "sbx-coastline",
        name: "Coastline Stewardship Subscription",
        category: "Placemaking",
        priceRange: "$50 / mo",
        championMargin: "5% to coastal steward",
        description:
          "Citizen-funded subscription — proceeds pool into the Coastline Objective where Electors representing kelp, pelican, and tide trade alongside humans.",
        imageUrl: PH("#0a1f30", "#3b82f6"),
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
  const [category, setCategory] = useState("Benefits Navigation");
  const [priceRange, setPriceRange] = useState("");
  const [championMargin, setChampionMargin] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const categories = [
    "Benefits Navigation",
    "Career Re-entry",
    "Education & Curriculum",
    "Employer Certification",
    "Research Grants",
    "Placemaking",
    "Creator Fund",
  ];

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
  const [expandedProviders, setExpandedProviders] = useState<Record<string, boolean>>({ "service-alliance": true });
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
  );
}
