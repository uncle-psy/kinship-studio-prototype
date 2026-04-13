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
 * Wraps page content — all projects now have seed data so we always show children.
 */
export function ProjectGate({ children, sectionName, icon }: ProjectGateProps) {
  const { activeProject, loading } = useProject();

  if (loading || !activeProject) {
    return <div className="text-muted py-12 text-center">Loading…</div>;
  }

  return <>{children}</>;
}
