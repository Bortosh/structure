import dataProject from '../../componets/proyectos/data/dataProjects.json'

export const fetchProjects = (): Promise<typeof dataProject> => {

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(dataProject);
        }, 800);
    });
};
