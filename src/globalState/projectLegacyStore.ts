import { create } from 'zustand'
import type { ProjectLegacy } from '../shared/interfaces/project'
import { sampleProjects } from '../componets/project/dataProjectLegacy/data'

interface ProjectLegacyState {
    legacyProjects: ProjectLegacy[]
    setLegacyProjects: (projects: ProjectLegacy[]) => void
    selectedLegacyProject: ProjectLegacy | null
    setSelectedLegacyProject: (project: ProjectLegacy | null) => void
    addLegacyProject: (project: ProjectLegacy) => void
    updateLegacyProject: (project: ProjectLegacy) => void
    removeLegacyProject: (projectId: string) => void
}

export const useProjectLegacyStore = create<ProjectLegacyState>((set) => ({
    legacyProjects: sampleProjects, // ← Estado inicial con tus mocks
    selectedLegacyProject: null,

    setLegacyProjects: (projects) => set({ legacyProjects: projects }),
    setSelectedLegacyProject: (project) => set({ selectedLegacyProject: project }),

    addLegacyProject: (project) =>
        set((state) => ({
            legacyProjects: [...state.legacyProjects, project],
        })),

    updateLegacyProject: (project) =>
        set((state) => ({
            legacyProjects: state.legacyProjects.map((p) =>
                p.id === project.id ? project : p
            ),
        })),

    removeLegacyProject: (projectId) =>
        set((state) => ({
            legacyProjects: state.legacyProjects.filter((p) => p.id !== projectId),
        })),
}))
