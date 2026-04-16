"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { Project } from "./types";

interface ProjectContextValue {
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (project: Project) => void;
  refreshProjects: () => Promise<void>;
  loading: boolean;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      const fetched: Project[] = data.projects || [];
      setProjects(fetched);

      // If no active project yet, or active project was deleted, pick first
      setActiveProject((prev) => {
        if (prev && fetched.find((p) => p.id === prev.id)) return prev;
        return fetched[0] || null;
      });
    } catch {
      // Keep existing state on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  return (
    <ProjectContext.Provider
      value={{ projects, activeProject, setActiveProject, refreshProjects, loading }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
}

// Markets alias — the KAM Studio surfaces Projects as Markets throughout the UI.
export const useMarket = () => {
  const { projects, activeProject, setActiveProject, refreshProjects, loading } = useProject();
  return {
    markets: projects,
    activeMarket: activeProject,
    setActiveMarket: setActiveProject,
    refreshMarkets: refreshProjects,
    loading,
  };
};
