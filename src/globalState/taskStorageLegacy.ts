// lib/useTaskStore.ts
import { create } from "zustand";

import type { Task, TaskType } from "../componets/project/project-map/types/task-types";


interface TaskStore {
    tasks: Task[];
    addTask: (id: string, type: TaskType, lat: number, lng: number) => void;
    removeTask: (id: string) => void;
    clearTasks: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: [],
    addTask: (id, type, lat, lng) =>
        set((state) => ({
            tasks: [...state.tasks, { id, type, lat, lng }],
        })),
    removeTask: (id) =>
        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
        })),
    clearTasks: () => set({ tasks: [] }),
}));
