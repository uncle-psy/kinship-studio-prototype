"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

type Tool = {
  id: string;
  name: string;
  icon: string;
  iconEmoji?: string;
  description: string;
  category: string;
  authType: "oauth" | "credentials" | "wallet" | "token";
  status: "connected" | "disconnected";
  connectedAs?: string;
};

const TOOLS: Tool[] = [
  {
    id: "telegram",
    name: "Telegram",
    icon: "simple-icons:telegram",
    description: "Send and receive messages, manage channels and bots",
    category: "Messaging",
    authType: "credentials",
    status: "disconnected",
  },
  {
    id: "bluesky",
    name: "Bluesky",
    icon: "simple-icons:bluesky",
    description: "Post, reply, and monitor mentions on the AT Protocol social network",
    category: "Social",
    authType: "credentials",
    status: "disconnected",
  },
  {
    id: "x",
    name: "X (Twitter)",
    icon: "simple-icons:x",
    description: "Post tweets, monitor mentions, and engage with your audience",
    category: "Social",
    authType: "credentials",
    status: "disconnected",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "simple-icons:linkedin",
    description: "Post updates, manage company pages, and monitor engagement",
    category: "Social",
    authType: "oauth",
    status: "disconnected",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "simple-icons:facebook",
    description: "Manage pages, post content, and monitor comments",
    category: "Social",
    authType: "oauth",
    status: "disconnected",
  },
  {
    id: "solana",
    name: "Solana",
    icon: "simple-icons:solana",
    description: "Connect an external Solana wallet for on-chain actions and token operations",
    category: "Blockchain",
    authType: "wallet",
    status: "disconnected",
  },
  {
    id: "google",
    name: "Google",
    icon: "simple-icons:google",
    description: "Access Gmail, Calendar, Drive, Docs, and other Google services",
    category: "Productivity",
    authType: "oauth",
    status: "disconnected",
  },
];

const categoryColors: Record<string, string> = {
  Messaging: "text-blue-400 bg-blue-400/10",
  Social: "text-purple-400 bg-purple-400/10",
  Blockchain: "text-green-400 bg-green-400/10",
  Productivity: "text-orange-400 bg-orange-400/10",
};

// ── Connect modals for each auth type ──────────────────────────────────────────

function CredentialsModal({ tool, onClose, onConnect }: { tool: Tool; onClose: () => void; onConnect: (as: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [connecting, setConnecting] = useState(false);

  const isTelegram = tool.id === "telegram";

  const handleConnect = () => {
    if (isTelegram && !token) return;
    if (!isTelegram && (!username || !password)) return;
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      onConnect(isTelegram ? `Bot: ${token.slice(0, 8)}…` : `@${username}`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-card-border rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-card-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
              <Icon icon={tool.icon} width={22} height={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Connect {tool.name}</h2>
              <p className="text-xs text-muted">{tool.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors">
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {isTelegram ? (
            <>
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300">
                Create a bot via <span className="font-mono">@BotFather</span> on Telegram, then paste the bot token below.
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Bot Token</label>
                <input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw"
                  className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 font-mono text-sm"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Username / Handle</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={tool.id === "bluesky" ? "@handle.bsky.social" : `@${tool.name.toLowerCase()}handle`}
                  className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  {tool.id === "bluesky" ? "App Password" : "Password"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
                />
                {tool.id === "bluesky" && (
                  <p className="text-xs text-muted mt-1.5">Use an App Password from Bluesky Settings → Privacy → App Passwords</p>
                )}
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleConnect}
              disabled={connecting || (isTelegram ? !token : !username || !password)}
              className="flex-1 bg-accent hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              {connecting ? "Connecting…" : `Connect ${tool.name}`}
            </button>
            <button onClick={onClose} className="px-5 py-2.5 border border-card-border rounded-xl text-muted hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OAuthModal({ tool, onClose, onConnect }: { tool: Tool; onClose: () => void; onConnect: (as: string) => void }) {
  const [connecting, setConnecting] = useState(false);

  const handleOAuth = () => {
    setConnecting(true);
    // Simulate OAuth redirect + callback
    setTimeout(() => {
      setConnecting(false);
      onConnect(`Connected via OAuth`);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-card-border rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-card-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
              <Icon icon={tool.icon} width={22} height={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Connect {tool.name}</h2>
              <p className="text-xs text-muted">Authenticate with {tool.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors">
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-card-border text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.06] flex items-center justify-center mx-auto mb-3">
              <Icon icon={tool.icon} width={30} height={30} className="text-white/80" />
            </div>
            <p className="text-sm text-muted">
              You&apos;ll be redirected to {tool.name} to authorize Kinship Agents. We&apos;ll request only the permissions needed to post and read on your behalf.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleOAuth}
              disabled={connecting}
              className="flex-1 bg-accent hover:bg-accent-dark disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {connecting ? (
                <>
                  <Icon icon="lucide:loader-2" width={16} height={16} className="animate-spin" />
                  Redirecting…
                </>
              ) : (
                <>
                  <Icon icon={tool.icon} width={16} height={16} />
                  Continue with {tool.name}
                </>
              )}
            </button>
            <button onClick={onClose} className="px-5 py-2.5 border border-card-border rounded-xl text-muted hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WalletModal({ tool, onClose, onConnect }: { tool: Tool; onClose: () => void; onConnect: (as: string) => void }) {
  const [address, setAddress] = useState("");
  const [connecting, setConnecting] = useState(false);

  const isValidAddress = address.length >= 32 && address.length <= 44 && /^[A-Za-z0-9]+$/.test(address);

  const handleConnect = () => {
    if (!isValidAddress) return;
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      onConnect(`${address.slice(0, 4)}…${address.slice(-4)}`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-card-border rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-card-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
              <Icon icon={tool.icon} width={22} height={22} className="text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Connect Solana Wallet</h2>
              <p className="text-xs text-muted">External wallet for on-chain actions</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors">
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-300">
            Connect a read-only external wallet. Your agent can monitor balances and history, and request transactions for you to approve.
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Solana Wallet Address
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trSnSkzLu"
              className="w-full bg-input border border-card-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 font-mono text-sm"
            />
            {address && !isValidAddress && (
              <p className="text-xs text-red-400 mt-1.5">Enter a valid Solana public key (base58, 32–44 chars)</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleConnect}
              disabled={!isValidAddress || connecting}
              className="flex-1 bg-accent hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              {connecting ? "Connecting…" : "Connect Wallet"}
            </button>
            <button onClick={onClose} className="px-5 py-2.5 border border-card-border rounded-xl text-muted hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tool card ──────────────────────────────────────────────────────────────────

function ToolCard({ tool, onConnect, onDisconnect }: { tool: Tool; onConnect: () => void; onDisconnect: () => void }) {
  const isConnected = tool.status === "connected";

  return (
    <div className={`bg-card border rounded-xl p-5 transition-all ${isConnected ? "border-accent/40" : "border-card-border"}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isConnected ? "bg-accent/15" : "bg-white/[0.06]"}`}>
            <Icon
              icon={tool.icon}
              width={22}
              height={22}
              className={isConnected ? "text-accent" : "text-white/70"}
            />
          </div>
          <div>
            <h3 className="text-white font-semibold">{tool.name}</h3>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${categoryColors[tool.category] || "text-muted bg-white/[0.06]"}`}>
              {tool.category}
            </span>
          </div>
        </div>
        {isConnected ? (
          <span className="flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Connected
          </span>
        ) : (
          <span className="text-xs text-muted">Not connected</span>
        )}
      </div>

      <p className="text-sm text-muted mb-4 leading-relaxed">{tool.description}</p>

      {isConnected && tool.connectedAs && (
        <p className="text-xs text-muted mb-3 font-mono truncate">{tool.connectedAs}</p>
      )}

      {isConnected ? (
        <div className="flex gap-2">
          <button
            onClick={onConnect}
            className="flex-1 text-sm py-2 rounded-lg border border-card-border text-muted hover:text-white hover:border-white/30 transition-colors"
          >
            Reconfigure
          </button>
          <button
            onClick={onDisconnect}
            className="text-sm px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="w-full text-sm py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 border border-accent/30 transition-colors font-medium"
        >
          Connect {tool.name}
        </button>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function EmpowerPage() {
  const [tools, setTools] = useState<Tool[]>(TOOLS);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  const activeTool = tools.find((t) => t.id === activeToolId);
  const categories = ["All", ...Array.from(new Set(TOOLS.map((t) => t.category)))];
  const filtered = filter === "All" ? tools : tools.filter((t) => t.category === filter);
  const connectedCount = tools.filter((t) => t.status === "connected").length;

  const handleConnect = (toolId: string) => setActiveToolId(toolId);

  const handleConnected = (toolId: string, connectedAs: string) => {
    setTools((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, status: "connected", connectedAs } : t))
    );
    setActiveToolId(null);
  };

  const handleDisconnect = (toolId: string) => {
    setTools((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, status: "disconnected", connectedAs: undefined } : t))
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Empower</h1>
          <p className="text-muted mt-1">
            {connectedCount} of {tools.length} tools connected
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === cat
                ? "bg-accent text-white"
                : "bg-white/[0.06] text-muted hover:text-white hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tool grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onConnect={() => handleConnect(tool.id)}
            onDisconnect={() => handleDisconnect(tool.id)}
          />
        ))}
      </div>

      {/* Auth modals */}
      {activeTool && activeTool.authType === "credentials" && (
        <CredentialsModal
          tool={activeTool}
          onClose={() => setActiveToolId(null)}
          onConnect={(as) => handleConnected(activeTool.id, as)}
        />
      )}
      {activeTool && activeTool.authType === "oauth" && (
        <OAuthModal
          tool={activeTool}
          onClose={() => setActiveToolId(null)}
          onConnect={(as) => handleConnected(activeTool.id, as)}
        />
      )}
      {activeTool && activeTool.authType === "wallet" && (
        <WalletModal
          tool={activeTool}
          onClose={() => setActiveToolId(null)}
          onConnect={(as) => handleConnected(activeTool.id, as)}
        />
      )}
    </div>
  );
}
