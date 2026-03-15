"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { nanoid } from "nanoid";
import { ProjectGate } from "@/components/ProjectGate";

/* ─── Types ─────────────────────────────────────────────────────── */

interface BondingCurve {
  type: "power" | "linear";
  y: number; // exponent for power, multiplier for linear
}

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  bondingCurve: BondingCurve;
  dexThreshold: number;
  totalSupply: number;
  startingPrice: number;
  createdAt: string;
}

/* ─── Sample Data ───────────────────────────────────────────────── */

const SAMPLE_COINS: Coin[] = [
  {
    id: nanoid(),
    name: "Kinship Token",
    symbol: "KIN",
    image: "",
    bondingCurve: { type: "power", y: 1.5 },
    dexThreshold: 500000,
    totalSupply: 1000000,
    startingPrice: 0.001,
    createdAt: "2026-02-10T08:00:00Z",
  },
  {
    id: nanoid(),
    name: "Vibe Coin",
    symbol: "VIBE",
    image: "",
    bondingCurve: { type: "power", y: 2 },
    dexThreshold: 250000,
    totalSupply: 500000,
    startingPrice: 0.01,
    createdAt: "2026-02-18T12:00:00Z",
  },
  {
    id: nanoid(),
    name: "Earth Credits",
    symbol: "EARTH",
    image: "",
    bondingCurve: { type: "linear", y: 0.5 },
    dexThreshold: 1000000,
    totalSupply: 2000000,
    startingPrice: 0.005,
    createdAt: "2026-03-01T10:00:00Z",
  },
  {
    id: nanoid(),
    name: "Heal Token",
    symbol: "HEAL",
    image: "",
    bondingCurve: { type: "power", y: 1.2 },
    dexThreshold: 100000,
    totalSupply: 100000,
    startingPrice: 0.02,
    createdAt: "2026-03-08T14:00:00Z",
  },
];

/* ─── Helpers ───────────────────────────────────────────────────── */

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  if (n >= 1) return n.toFixed(2);
  if (n >= 0.01) return n.toFixed(3);
  return n.toFixed(4);
}

function curveLabel(c: BondingCurve): string {
  if (c.type === "power") return `x ^ ${c.y}`;
  return `x * ${c.y}`;
}

function computePrice(curve: BondingCurve, startingPrice: number, t: number): number {
  if (curve.type === "power") {
    return startingPrice * Math.pow(1 + t * 10, curve.y);
  }
  return startingPrice * (1 + t * curve.y * 10);
}

/* ─── Bonding Curve SVG ─────────────────────────────────────────── */

function BondingCurveSVG({
  curve,
  startingPrice,
  id,
  height = 80,
}: {
  curve: BondingCurve;
  startingPrice: number;
  id: string;
  height?: number;
}) {
  const W = 240;
  const H = height;
  const PAD = { t: 4, r: 4, b: 4, l: 4 };
  const pW = W - PAD.l - PAD.r;
  const pH = H - PAD.t - PAD.b;
  const steps = 60;

  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push([t, computePrice(curve, startingPrice, t)]);
  }

  const maxP = Math.max(...pts.map((p) => p[1]));
  const toX = (t: number) => PAD.l + t * pW;
  const toY = (p: number) => PAD.t + pH - (p / maxP) * pH;

  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${toX(p[0]).toFixed(1)},${toY(p[1]).toFixed(1)}`)
    .join(" ");

  const fill =
    line +
    ` L${toX(1).toFixed(1)},${(PAD.t + pH).toFixed(1)}` +
    ` L${PAD.l.toFixed(1)},${(PAD.t + pH).toFixed(1)} Z`;

  const gid = `cg-${id}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eb8000" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#eb8000" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke="#eb8000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Coin Card ─────────────────────────────────────────────────── */

function CoinCard({ coin }: { coin: Coin }) {
  const colors: Record<string, string> = {
    KIN: "#eb8000",
    VIBE: "#a855f7",
    EARTH: "#22c55e",
    HEAL: "#ec4899",
  };
  const color = colors[coin.symbol] || "#eb8000";

  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden hover:border-accent/50 transition-all group">
      {/* Chart area */}
      <div className="px-3 pt-3 bg-white/[0.02]">
        <BondingCurveSVG curve={coin.bondingCurve} startingPrice={coin.startingPrice} id={coin.id} />
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        {/* Name + Symbol */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: `${color}25`, color }}
          >
            {coin.symbol[0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-semibold truncate">{coin.name}</div>
            <div className="text-xs text-white/40 font-mono">${coin.symbol}</div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-medium whitespace-nowrap">
            Pre-DEX
          </span>
        </div>

        {/* Formula */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-white/40">Curve</span>
          <span className="font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-md">
            {curveLabel(coin.bondingCurve)}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06]">
          <div>
            <div className="text-[10px] text-white/35 uppercase tracking-wider">Price</div>
            <div className="text-xs text-white font-medium">${fmt(coin.startingPrice)}</div>
          </div>
          <div>
            <div className="text-[10px] text-white/35 uppercase tracking-wider">Supply</div>
            <div className="text-xs text-white font-medium">{fmt(coin.totalSupply)}</div>
          </div>
          <div>
            <div className="text-[10px] text-white/35 uppercase tracking-wider">DEX at</div>
            <div className="text-xs text-white font-medium">${fmt(coin.dexThreshold)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Create Coin Modal ─────────────────────────────────────────── */

function CreateCoinModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (coin: Omit<Coin, "id" | "createdAt">) => void;
}) {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [curveType, setCurveType] = useState<"power" | "linear">("power");
  const [curveY, setCurveY] = useState("1.5");
  const [dexThreshold, setDexThreshold] = useState("500000");
  const [totalSupply, setTotalSupply] = useState("1000000");
  const [startingPrice, setStartingPrice] = useState("0.001");

  const yVal = parseFloat(curveY) || 1;
  const previewCurve: BondingCurve = { type: curveType, y: yVal };
  const previewPrice = parseFloat(startingPrice) || 0.001;

  const canSubmit = name.trim() && symbol.trim() && curveY && dexThreshold && totalSupply && startingPrice;

  function handleSubmit() {
    if (!canSubmit) return;
    onCreate({
      name: name.trim(),
      symbol: symbol.trim().toUpperCase(),
      image: "",
      bondingCurve: { type: curveType, y: parseFloat(curveY) },
      dexThreshold: parseFloat(dexThreshold),
      totalSupply: parseFloat(totalSupply),
      startingPrice: parseFloat(startingPrice),
    });
  }

  const inputCls =
    "w-full bg-input border border-card-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent/50 focus:outline-none transition-colors";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-card border border-card-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Create Coin</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <Icon icon="lucide:x" width={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Image placeholder */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-input border-2 border-dashed border-card-border flex items-center justify-center text-white/20 hover:border-accent/40 hover:text-accent/40 transition-colors cursor-pointer">
              <Icon icon="lucide:image-plus" width={28} />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs text-white/50 mb-1 block">Name</label>
            <input
              className={inputCls}
              placeholder="e.g. Kinship Token"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Symbol */}
          <div>
            <label className="text-xs text-white/50 mb-1 block">Symbol</label>
            <input
              className={inputCls}
              placeholder="e.g. KIN"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              maxLength={8}
            />
          </div>

          {/* Bonding Curve Type */}
          <div>
            <label className="text-xs text-white/50 mb-1 block">Bonding Curve</label>
            <div className="flex gap-2">
              <button
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  curveType === "power"
                    ? "bg-accent/20 text-accent border-accent/50"
                    : "bg-input text-white/50 border-card-border hover:border-white/20"
                }`}
                onClick={() => setCurveType("power")}
              >
                <span className="font-mono">x ^ y</span>
                <span className="block text-[10px] mt-0.5 opacity-60">Power</span>
              </button>
              <button
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  curveType === "linear"
                    ? "bg-accent/20 text-accent border-accent/50"
                    : "bg-input text-white/50 border-card-border hover:border-white/20"
                }`}
                onClick={() => setCurveType("linear")}
              >
                <span className="font-mono">x * y</span>
                <span className="block text-[10px] mt-0.5 opacity-60">Linear</span>
              </button>
            </div>
          </div>

          {/* Curve Parameter */}
          <div>
            <label className="text-xs text-white/50 mb-1 block">
              {curveType === "power" ? "Exponent (y)" : "Multiplier (y)"}
            </label>
            <input
              className={inputCls}
              type="number"
              step="0.1"
              min="0.1"
              placeholder={curveType === "power" ? "1.5" : "0.5"}
              value={curveY}
              onChange={(e) => setCurveY(e.target.value)}
            />
          </div>

          {/* Live preview */}
          <div className="bg-white/[0.02] rounded-xl p-3 border border-card-border">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-white/35 uppercase tracking-wider">Curve Preview</span>
              <span className="text-xs font-mono text-accent">{curveLabel(previewCurve)}</span>
            </div>
            <BondingCurveSVG curve={previewCurve} startingPrice={previewPrice} id="preview" height={100} />
          </div>

          {/* DEX Threshold */}
          <div>
            <label className="text-xs text-white/50 mb-1 block">DEX Push Level (Market Cap in USDC)</label>
            <div className="relative">
              <input
                className={inputCls + " pr-16"}
                type="number"
                placeholder="500000"
                value={dexThreshold}
                onChange={(e) => setDexThreshold(e.target.value)}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30">USDC</span>
            </div>
          </div>

          {/* Total Supply */}
          <div>
            <label className="text-xs text-white/50 mb-1 block">Total Token Supply</label>
            <input
              className={inputCls}
              type="number"
              placeholder="1000000"
              value={totalSupply}
              onChange={(e) => setTotalSupply(e.target.value)}
            />
          </div>

          {/* Starting Price */}
          <div>
            <label className="text-xs text-white/50 mb-1 block">Starting Price (per token)</label>
            <div className="relative">
              <input
                className={inputCls + " pr-16"}
                type="number"
                step="0.001"
                placeholder="0.001"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30">USDC</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-white/[0.06]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-5 py-2 rounded-xl text-sm font-medium bg-accent hover:bg-accent-dark text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Create Coin
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default function CoinsPage() {
  const [coins, setCoins] = useState<Coin[]>(SAMPLE_COINS);
  const [showCreate, setShowCreate] = useState(false);

  function handleCreate(data: Omit<Coin, "id" | "createdAt">) {
    setCoins((prev) => [{ ...data, id: nanoid(), createdAt: new Date().toISOString() }, ...prev]);
    setShowCreate(false);
  }

  return (
    <ProjectGate sectionName="Coins" icon="lucide:coins">
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Coins</h1>
          <p className="text-muted mt-1">
            {coins.length} coin{coins.length !== 1 ? "s" : ""} &middot; Launch and manage bonding curve tokens
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent font-medium px-4 py-2 rounded-full text-sm transition-colors shrink-0"
        >
          <Icon icon="lucide:plus" width={16} />
          Create Coin
        </button>
      </div>

      {/* Grid */}
      {coins.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {coins.map((coin) => (
            <CoinCard key={coin.id} coin={coin} />
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-card-border rounded-2xl flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <Icon icon="lucide:coins" width={28} className="text-accent" />
          </div>
          <h3 className="text-white font-semibold mb-1">No coins yet</h3>
          <p className="text-muted text-sm mb-4">Create your first bonding curve token</p>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent font-medium px-4 py-2 rounded-full text-sm transition-colors"
          >
            <Icon icon="lucide:plus" width={16} />
            Create Coin
          </button>
        </div>
      )}

      {/* Modal */}
      {showCreate && <CreateCoinModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
    </div>
    </ProjectGate>
  );
}
