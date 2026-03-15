"use client";

import { ReactNode } from "react";
import { Icon } from "@iconify/react";
import { useProject } from "@/lib/project-context";

interface ProjectGateProps {
  children: ReactNode;
  /** The section name shown in the empty state, e.g. "Agents", "Knowledge Bases" */
  sectionName: string;
  /** Icon name for the empty state */
  icon: string;
}

/**
 * Wraps page content so that non-Mapshifting projects show an empty-state
 * placeholder instead of real data (which only exists for Mapshifting).
 */
export function ProjectGate({ children, sectionName, icon }: ProjectGateProps) {
  const { activeProject, loading } = useProject();

  if (loading || !activeProject) {
    return <div className="text-muted py-12 text-center">Loading…</div>;
  }

  if (activeProject.codeName === "mapshifting") {
    return <>{children}</>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{sectionName}</h1>
          <p className="text-muted mt-1">{activeProject.name}</p>
        </div>
      </div>
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-card-border flex items-center justify-center mx-auto mb-4">
          <Icon icon={icon} width={32} height={32} className="text-muted" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No {sectionName.toLowerCase()} yet</h3>
        <p className="text-muted mb-6 max-w-md mx-auto">
          This project is empty. Start building by adding your first items to {activeProject.name}.
        </p>
      </div>
    </div>
  );
}
