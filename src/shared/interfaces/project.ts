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

export interface ProjectLegacy {
    id: string
    name: string
    workRequestId: number
    client: string
    status: 'Active' | 'Pending' | 'Completed' | 'New'
    crew: string
    startDate: string
    endDate?: string
    completion: number
    txCount: number
    serviceCount: number
    estimatedIncome: number
    description?: string
    department?: string
    category?: string
    budget?: number
    priority?: string
    latitude?: number
    longitude?: number
}

export function statusColor(status: string) {
    switch (status) {
        case 'Active':
            return 'bg-green-100 text-green-800 dark:bg-green-300 dark:text-green-900'
        case 'Pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-300 dark:text-yellow-900'
        case 'Completed':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900'
        case 'New':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-900'
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-900'
    }
}

