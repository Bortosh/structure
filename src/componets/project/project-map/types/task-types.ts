export type TaskType = "TX" | "Service" | "Handhole" | "Line" | "TieIn";

export interface Task {
    id: string;
    type: TaskType;
    lat: number;
    lng: number;
}
