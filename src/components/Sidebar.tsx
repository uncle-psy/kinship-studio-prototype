"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useMarket } from "@/lib/project-context";

const navSections = [
  {
    label: "KINSHIP ACTION MARKETS",
    items: [
      { href: "/markets", icon: "lucide:layout-grid", label: "Markets", hint: "All Markets" },
    ],
  },
  {
    label: "AGENTS",
    items: [
      { href: "/agents", icon: "lucide:user-round", label: "Agents", hint: "Operators, Electors, Executors" },
    ],
  },
  {
    label: "CLARITY PROCESS",
    items: [
      { href: "/knowledge", icon: "lucide:brain", label: "Inform", hint: "Knowledge & RAG" },
      { href: "/prompts", icon: "lucide:message-square-code", label: "Instruct", hint: "Behavior & Chains" },
      { href: "/empower", icon: "lucide:plug-2", label: "Empower", hint: "Tools & MCP" },
      { href: "/align", icon: "lucide:workflow", label: "Align", hint: "Orchestration" },
    ],
  },
  {
    label: "GOVERNANCE",
    items: [
      { href: "/vibes", icon: "lucide:activity", label: "Vibes", hint: "Safety & Norms" },
      { href: "/offerings", icon: "lucide:store", label: "Offerings" },
      { href: "/coins", icon: "lucide:coins", label: "Coins" },
    ],
  },
  {
    label: "Experiences",
    items: [
      { href: "/experiences", icon: "lucide:compass", label: "Experiences" },
      { href: "/assets", icon: "lucide:library", label: "Library", badge: "63" },
      { href: "/assets/upload", icon: "lucide:upload-cloud", label: "Upload" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [marketsOpen, setMarketsOpen] = useState(true);
  const { markets, activeMarket, setActiveMarket } = useMarket();

  return (
    <aside className="fixed left-0 top-[60px] w-[220px] h-[calc(100vh-60px)] bg-sidebar border-r border-card-border overflow-y-auto py-4 px-3">
      {/* Platform */}
      <div className="mb-2">
        <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider px-3 mb-1">
          Platform
        </div>
        <div className="px-3 py-1.5 text-accent text-sm flex items-center gap-2">
          <Icon icon="lucide:layers" width={16} height={16} className="text-accent" />
          Kinship Studio
        </div>
      </div>

      {/* Platform Settings */}
      <div className="mb-4">
        <ul>
          <li>
            <Link
              href="/platform-settings"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === "/platform-settings"
                  ? "bg-accent/20 text-accent"
                  : "text-white/70 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <Icon
                icon="lucide:settings"
                width={18}
                height={18}
                className={pathname === "/platform-settings" ? "text-accent" : "text-white"}
              />
              <span>Platform Settings</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Markets */}
      <div className="mb-4">
        <button
          onClick={() => setMarketsOpen((o) => !o)}
          className="w-full flex items-center justify-between text-[10px] font-semibold text-white/40 uppercase tracking-wider px-3 mb-1 hover:text-white/60 transition-colors"
        >
          <span>Markets</span>
          <Icon
            icon={marketsOpen ? "lucide:chevron-down" : "lucide:chevron-right"}
            width={12}
            height={12}
          />
        </button>
        {marketsOpen && (
          <ul className="space-y-0.5">
            {markets.map((market) => {
              const isActive =
                activeMarket?.id === market.id &&
                !pathname.startsWith("/platform-settings");
              return (
                <li key={market.id}>
                  <button
                    onClick={() => {
                      setActiveMarket(market);
                      if (pathname.startsWith("/platform-settings")) {
                        router.push(`/markets/${market.codeName}`);
                      } else {
                        router.push(`/markets/${market.codeName}`);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-accent/20 text-accent"
                        : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span className="text-base leading-none">{market.icon || "📈"}</span>
                    <span className="flex-1 text-left truncate">{market.name}</span>
                  </button>
                </li>
              );
            })}
            <li>
              <Link
                href="/markets"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/50 hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                <Icon icon="lucide:plus" width={16} height={16} />
                <span>All Markets</span>
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* Nav sections */}
      {navSections.map((section) => (
        <div key={section.label} className="mb-4">
          <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider px-3 mb-1">
            {section.label}
          </div>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/assets" && pathname === "/assets") ||
                (item.href !== "/assets" && pathname.startsWith(item.href) && item.href !== "/assets");

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-accent/20 text-accent"
                        : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <Icon
                      icon={item.icon}
                      width={18}
                      height={18}
                      className={isActive ? "text-accent" : "text-white"}
                    />
                    <span className="flex-1">{item.label}</span>
                    {"badge" in item && item.badge && (
                      <span className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
