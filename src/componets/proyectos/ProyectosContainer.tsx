import { useState, useEffect } from "react";
import NewProjectForm from "./components/NewProjectForm";
import { Button } from "@mui/material";
import ProyectosTable from "./components/ProyectosTable";
import { useProjectsStore } from '../../globalState/projectsStore'
import ProyectosTableSkeleton from "./components/ProyectosTableSkeleton";

export default function ProyectosContainer() {

    const { projects, fetchAndSetProjects, isLoading } = useProjectsStore()

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (projects.length === 0) fetchAndSetProjects();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Proyecto seleccionado</h2>
                    <p className="text-gray-600 text-sm">Aquí se muestran los detalles del proyecto actual.</p>
                </div>

                <Button
                    variant="contained"
                    onClick={() => setOpen(true)}
                    sx={{ ml: 3, height: "3rem", fontWeight: "bold", textTransform: "none" }}
                >
                    Nuevo Proyecto
                </Button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Proyectos creados</h2>
                {isLoading ? <ProyectosTableSkeleton /> : <ProyectosTable />}
            </div>

            <NewProjectForm open={open} onClose={() => setOpen(false)} />
        </div>
    );
}
