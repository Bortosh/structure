import { create } from "zustand";
import type { ProjectsState } from '../shared/interfaces/project'
import { fetchProjects } from "../shared/services/projectsService";

export const useProjectsStore = create<ProjectsState>((set) => ({
    projects: [],
    setProjects: (projects) => set({ projects }),
    isLoading: false,
    fetchAndSetProjects: async () => {
        set({ isLoading: true });
        const projects = await fetchProjects();
        set({ projects, isLoading: false });
    },

    addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
}));
