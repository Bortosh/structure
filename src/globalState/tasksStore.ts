import { create } from "zustand";
import type { TasksState } from "../shared/interfaces/task";

export const useTasksStore = create<TasksState>((set, get) => ({
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
    addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),
    getTasksByProject: (projectId) =>
        get().tasks.filter((task) => task.projectId === projectId),
}));
