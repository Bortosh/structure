import { create } from "zustand";
import type { ExtraTask, Task, TaskLine } from "../componets/project/project-map/types/task-types";

interface TaskStore {
    tasks: Task[];
    taskLines: TaskLine[];
    extraTasks: ExtraTask[];

    addTask: (task: Task) => void;
    updateTask: (id: string, updated: Partial<Task>) => void;
    removeTask: (id: string) => void;

    addTaskLine: (taskLine: TaskLine) => void;
    removeTaskLine: (id: string) => void;

    addExtraTask: (task: ExtraTask) => void;
    updateExtraTask: (id: string, updated: Partial<ExtraTask>) => void;
    removeExtraTask: (id: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: [],
    taskLines: [],
    extraTasks: [],

    addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),
    updateTask: (id, updated) =>
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === id ? { ...task, ...updated } : task
            ),
        })),
    removeTask: (id) =>
        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
        })),

    addTaskLine: (taskLine) =>
        set((state) => ({ taskLines: [...state.taskLines, taskLine] })),
    removeTaskLine: (id) =>
        set((state) => ({
            taskLines: state.taskLines.filter((line) => line.id !== id),
        })),

    addExtraTask: (task) =>
        set((state) => ({ extraTasks: [...state.extraTasks, task] })),
    updateExtraTask: (id, updated) =>
        set((state) => ({
            extraTasks: state.extraTasks.map((task) =>
                task.id === id ? { ...task, ...updated } : task
            ),
        })),
    removeExtraTask: (id) =>
        set((state) => ({
            extraTasks: state.extraTasks.filter((task) => task.id !== id),
        })),
}));
