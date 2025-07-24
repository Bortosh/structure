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
    idProject: string;
    name: string;
    type: "Line";
    path: { lat: number; lng: number }[];
    estado: "pendiente" | "completada";
    equipos?: string[];
}