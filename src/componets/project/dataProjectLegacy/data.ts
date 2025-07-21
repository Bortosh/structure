import type { ProjectLegacy } from "../../../shared/interfaces/project";

export const sampleProjects: ProjectLegacy[] = [
    {
        id: 'p1',
        name: 'Main St Fiber Installation',
        workRequestId: 12940274,
        client: 'TeleCorp Inc.',
        status: 'Active',
        crew: 'Boring Crew 1',
        startDate: '2023-03-15',
        completion: 65,
        txCount: 12,
        serviceCount: 8,
        estimatedIncome: 45000,
        latitude: 25.7617,
        longitude: -80.1918 // Miami coordinates
    },
    {
        id: 'p2',
        name: 'Downtown Line Extension',
        workRequestId: 12947263,
        client: 'Metro Utilities',
        status: 'Pending',
        crew: 'Pending Assignment',
        startDate: '2023-04-10',
        completion: 0,
        txCount: 8,
        serviceCount: 5,
        estimatedIncome: 32000,
        latitude: 34.0522,
        longitude: -118.2437 // Los Angeles coordinates as example
    },
    {
        id: 'p3',
        name: 'Highland Park Utility Upgrade',
        workRequestId: 274823627,
        client: 'City of Highland',
        status: 'Active',
        crew: 'Boring Crew 3',
        startDate: '2023-02-28',
        completion: 80,
        txCount: 15,
        serviceCount: 12,
        estimatedIncome: 65000
    },
    {
        id: 'p4',
        name: 'Westside Gas Pipeline',
        workRequestId: 10374620,
        client: 'Global Gas Co.',
        status: 'New',
        crew: 'Boring Crew 2',
        startDate: '2023-01-20',
        completion: 30,
        txCount: 10,
        serviceCount: 6,
        estimatedIncome: 40000
    },
    {
        id: 'p5',
        name: 'Eastwood Development',
        workRequestId: 328340462,
        client: 'Eastwood Builders',
        status: 'Completed',
        crew: 'Restoration Crew 1',
        startDate: '2022-12-05',
        completion: 100,
        txCount: 20,
        serviceCount: 16,
        estimatedIncome: 85000
    },
    {
        id: 'p6',
        name: 'North County Water Main',
        workRequestId: 19028390,
        client: 'County Water Authority',
        status: 'Active',
        crew: 'Boring Crew 2',
        startDate: '2023-04-02',
        completion: 45,
        txCount: 14,
        serviceCount: 9,
        estimatedIncome: 52000
    }
] 