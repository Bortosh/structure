export interface Project {
    id: string;
    nombre: string;
    tipo: string;
    fechaCreacion: string;
    estado: string;
}

export interface ProjectsState {
    projects: Project[];
    setProjects: (projects: Project[]) => void;
    addProject: (project: Project) => void;
    fetchAndSetProjects: () => void
    isLoading: boolean
}