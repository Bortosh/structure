import { useState, useEffect } from "react";
import NewProjectForm from "./components/NewProjectForm";
import { Button } from "@mui/material";
import ProyectosTable from "./components/ProyectosTable";
import { useProjectsStore } from '../../globalState/projectsStore'
import ProyectosTableSkeleton from "./components/ProyectosTableSkeleton";
import SelectedProjectCard from "./components/SelectedProjectCard";

export default function ProyectosContainer() {
    const { projects, fetchAndSetProjects, isLoading } = useProjectsStore();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (projects.length === 0) fetchAndSetProjects();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex flex-col gap-6">
            <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Selected Project</h2>
                    <Button
                        variant="contained"
                        onClick={() => setOpen(true)}
                        sx={{ height: "3rem", fontWeight: "bold", textTransform: "none" }}
                    >
                        New Project
                    </Button>
                </div>
                <SelectedProjectCard />
            </section>

            <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex-1">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Created Projects</h2>
                {isLoading ? <ProyectosTableSkeleton /> : <ProyectosTable />}
            </section>

            <NewProjectForm open={open} onClose={() => setOpen(false)} />
        </div>
    );
}
