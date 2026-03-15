"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface Project {
  id: string;
  name: string;
  slug: string;
}

const ALL_PROJECTS: Project[] = [
  { id: "mapshifting", name: "Mapshifting", slug: "mapshifting" },
  { id: "money-maker", name: "Money Maker", slug: "money-maker" },
  { id: "vets-visions", name: "Vets Visions", slug: "vets-visions" },
];

interface ProjectContextValue {
  projects: Project[];
  activeProject: Project;
  setActiveProject: (project: Project) => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [activeProject, setActiveProject] = useState<Project>(ALL_PROJECTS[0]);

  return (
    <ProjectContext.Provider value={{ projects: ALL_PROJECTS, activeProject, setActiveProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
}
