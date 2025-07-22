// lib/useTaskStore.ts
import { create } from "zustand";

import type { Task } from "../componets/project/project-map/types/task-types";


interface TaskStore {
    tasks: Task[];
    addTask: (task: Task) => void;
    removeTask: (id: string) => void;
    clearTasks: () => void;
    updateTask: (id: string, updatedFields: Partial<Task>) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: [],
    addTask: (task: Task) => set((state) => ({ tasks: [...state.tasks, task] })),
    updateTask: (id, updatedFields) =>
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === id ? { ...task, ...updatedFields } : task
            ),
        })),
    removeTask: (id) =>
        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
        })),
    clearTasks: () => set({ tasks: [] }),
}));
