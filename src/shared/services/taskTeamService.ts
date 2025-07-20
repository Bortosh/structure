import dataTasksTeams from '../../componets/tareas/data/dataTasksTeams.json'

export const fetchTaskTeams = (): Promise<typeof dataTasksTeams> => {

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(dataTasksTeams);
        }, 800);
    });
};
