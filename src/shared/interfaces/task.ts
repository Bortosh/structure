export interface Task {
    id: string;
    nombre: string;
    descripcion: string;
    projectId: string;
    estado: "pendiente" | "en progreso" | "finalizada";
}

export interface Team {
    id: string;
    nombre: string;
}


export interface TasksState {
    tasks: Task[];
    teams: Team[];
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    getTasksByProject: (projectId: string) => Task[];
    fetchAndSetTeams: () => void;
}

export interface Accion {
    id: string;           // UUID
    nombre: string;
    descripcion: string;
    lat: number;
    lng: number;
}
