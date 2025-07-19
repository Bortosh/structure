import { Button } from "@mui/material";
import { useProjectsStore } from '../../../globalState/projectsStore';
import { useNavigate } from "react-router-dom";

export default function SelectedProjectCard() {
    const { selectedProject } = useProjectsStore();
    const navigate = useNavigate();

    if (!selectedProject) {
        return (
            <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Proyecto seleccionado</h2>
                <p className="text-gray-600 text-sm">Aquí se muestran los detalles del proyecto actual.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col gap-3">
            <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{selectedProject.nombre}</h2>
                <p className="text-sm text-gray-600 mb-1">Tipo: {selectedProject.tipo}</p>
                <p className="text-sm text-gray-600 mb-1">Estado: {selectedProject.estado}</p>
                <p className="text-sm text-gray-600">Fecha Límite: {selectedProject.fechaLimite}</p>
            </div>

            <div className="flex gap-2 mt-4">
                <Button variant="contained" color="primary" size="small" sx={{ textTransform: "none" }}>
                    Editar
                </Button>
                <Button variant="outlined" color="error" size="small" sx={{ textTransform: "none" }}>
                    Eliminar
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{ textTransform: "none" }}
                    onClick={() => navigate(`/proyectos/${selectedProject.id}/tareas`)}
                >
                    Crear Tarea
                </Button>
            </div>
        </div>
    );
}
