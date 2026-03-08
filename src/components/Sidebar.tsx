"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

const navSections = [
  {
    label: "Assets",
    items: [
      { href: "/assets", icon: "lucide:library", label: "Library", badge: "63" },
      { href: "/assets/upload", icon: "lucide:upload-cloud", label: "Upload" },
      { href: "/packs", icon: "lucide:package", label: "Asset Packs", tag: "NEW" },
    ],
  },
  {
    label: "AI & Knowledge",
    items: [
      { href: "/knowledge", icon: "lucide:brain", label: "Knowledge" },
      { href: "/prompts", icon: "lucide:message-square-code", label: "Prompts" },
      { href: "/progress", icon: "lucide:activity", label: "Signals" },
    ],
  },
  {
    label: "Experiences",
    items: [
      { href: "/games", icon: "lucide:compass", label: "Experiences" },
    ],
  },
];

const projects = ["Mapshifting"];

export function Sidebar() {
  const pathname = usePathname();
  const [projectsOpen, setProjectsOpen] = useState(true);

  return (
    <aside className="fixed left-0 top-[60px] w-[220px] h-[calc(100vh-60px)] bg-sidebar border-r border-card-border overflow-y-auto py-4 px-3">
      {/* Platform */}
      <div className="mb-4">
        <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider px-3 mb-1">
          Platform
        </div>
        <div className="px-3 py-1.5 text-accent text-sm flex items-center gap-2">
          <Icon icon="lucide:layers" width={16} height={16} className="text-accent" />
          Kinship Today
        </div>
      </div>

      {/* Projects */}
      <div className="mb-4">
        <button
          onClick={() => setProjectsOpen((o) => !o)}
          className="w-full flex items-center justify-between text-[10px] font-semibold text-white/40 uppercase tracking-wider px-3 mb-1 hover:text-white/60 transition-colors"
        >
          <span>Projects</span>
          <Icon
            icon={projectsOpen ? "lucide:chevron-down" : "lucide:chevron-right"}
            width={12}
            height={12}
          />
        </button>
        {projectsOpen && (
          <ul className="space-y-0.5">
            {projects.map((name) => (
              <li key={name}>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer">
                  <Icon icon="lucide:folder" width={18} height={18} className="text-white" />
                  <span className="flex-1">{name}</span>
                </div>
              </li>
            ))}
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
                    {item.badge && (
                      <span className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.tag && (
                      <span className="bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {item.tag}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {/* Bottom items */}
      <div className="mt-2">
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
    </aside>
  );
}
