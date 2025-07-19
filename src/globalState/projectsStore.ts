import { create } from "zustand";
import type { ProjectsState, Project } from '../shared/interfaces/project';
import { fetchProjects } from "../shared/services/projectsService";

export const useProjectsStore = create<ProjectsState>((set) => ({
    projects: [],
    setProjects: (projects: Project[]) => set({ projects }),
    isLoading: false,
    fetchAndSetProjects: async () => {
        set({ isLoading: true });
        let projects = await fetchProjects();
        projects = projects.map((p: any) => ({
            ...p,
            tareas: p.tareas ?? []
        }));
        set({ projects, isLoading: false });
    },
    addProject: (project: Project) =>
        set((state) => ({ projects: [...state.projects, project] })),
    setSelectedProject: (project: Project | null) => set({ selectedProject: project }),
    selectedProject: null,
}));
