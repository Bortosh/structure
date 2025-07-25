export type TaskType = "TX" | "Service" | "Handhole" | "Line" | "TieIn";

// export interface Task {
//     id: string;
//     type: TaskType;
//     lat: number;
//     lng: number;
// }

export interface Task {
    id: string
    type: 'TX' | 'Service' | 'Handhole' | 'TieIn' | 'Line'
    lat: number
    lng: number
    idProject?: string
    name?: string
    txNumber?: string
    serviceNumber?: string
    relatedTxNumber?: string
    tieInDescription?: string
    features?: string[]
    status?: string
    handholeNumber?: string
    handholeType?: string
}

export interface TaskLine {
    id: string;
    projectId: string;
    name: string;
    type: "Line";
    path: { lat: number; lng: number }[];
    estado: "pendiente" | "completada";
    teamsToTaskLine?: string[];
}

export interface ExtraTask {
    id: string;
    name: string;
    projectId: string | null;
    projectName: string;
    description: string;
    status: string;
    deadline: string;
}
