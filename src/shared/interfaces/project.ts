export interface Project {
    id: string;
    nombre: string;
    tipo: string;
    estado: string;
    fechaLimite?: string;
    tareas?: Task[]
}

export interface Task {
    id: string;
    nombre: string;
    descripcion: string;
    estado: string;
    fechaLimite: string;
    responsable: string;
    equipos: string[];
}

export interface ProjectsState {
    projects: Project[];
    setProjects: (projects: Project[]) => void
    addProject: (project: Project) => void
    fetchAndSetProjects: () => void
    isLoading: boolean
    selectedProject: Project | null
    setSelectedProject: (project: Project | null) => void
}