export interface Task {
    id: string;
    nombre: string;
    descripcion: string;
    projectId: string;
    estado: "pendiente" | "en progreso" | "finalizada";
}

export interface TasksState {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    getTasksByProject: (projectId: string) => Task[];
}