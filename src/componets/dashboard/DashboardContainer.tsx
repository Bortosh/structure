import { useEffect } from "react";
import { useProjectsStore } from "../../globalState/projectsStore";
import ProyectosTable from "../proyectos/components/ProyectosTable";
import ProyectosTableSkeleton from "../proyectos/components/ProyectosTableSkeleton";

const DashboardContainer = () => {

    const { projects, fetchAndSetProjects, isLoading } = useProjectsStore();

    useEffect(() => {
            if (projects.length === 0) fetchAndSetProjects();
        }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
            <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex-1">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Created Projects</h2>
                {isLoading ? <ProyectosTableSkeleton /> : <ProyectosTable />}
            </section>
        </div>
    );
}

export default DashboardContainer;