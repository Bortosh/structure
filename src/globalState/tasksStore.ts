import { create } from "zustand";
import type { TasksState, Team } from "../shared/interfaces/task";
import { fetchTaskTeams } from "../shared/services/taskTeamService";

export const useTasksStore = create<TasksState>((set, get) => ({
    tasks: [],
    teams: [],
    setTasks: (tasks) => set({ tasks }),
    addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),
    getTasksByProject: (projectId) =>
        get().tasks.filter((task) => task.projectId === projectId),
    fetchAndSetTeams: async () => {
        const teams: Team[] = await fetchTaskTeams();
        set({ teams });
    },
}));
