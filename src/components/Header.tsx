"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] bg-header border-b border-card-border flex items-center justify-between px-6 z-50">
      <Link href="/games" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-amber-700 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-white font-bold text-lg tracking-wide">KINSHIP</span>
        <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded">STUDIO</span>
      </Link>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-3 bg-white/[0.06] border border-card-border rounded-full px-4 py-1.5 hover:border-accent/50 transition-colors">
          <div className="w-7 h-7 bg-white/10 rounded flex items-center justify-center text-xs">
            🎮
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-white">Kinship Today</div>
            <div className="text-xs text-muted">1 games · 63 assets</div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted ml-1">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-amber-700 flex items-center justify-center text-white text-sm font-medium cursor-pointer">
        DL
      </div>
    </header>
  );
}
