import { Button } from "@mui/material";
import { useProjectsStore } from '../../../globalState/projectsStore';
import { useNavigate } from "react-router-dom";

export default function SelectedProjectCard() {
    const { selectedProject } = useProjectsStore();
    const navigate = useNavigate();

    if (!selectedProject) {
        return (
            <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Selected Project</h2>
                <p className="text-gray-600 text-sm">Details of the current project will appear here.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col gap-3">
            <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{selectedProject.nombre}</h2>
                <p className="text-sm text-gray-600 mb-1">Type: {selectedProject.tipo}</p>
                <p className="text-sm text-gray-600 mb-1">Status: {selectedProject.estado}</p>
                <p className="text-sm text-gray-600">Deadline: {selectedProject.fechaLimite}</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="contained" color="primary" size="small" sx={{ textTransform: "none" }}>
                    Edit
                </Button>
                <Button variant="outlined" color="error" size="small" sx={{ textTransform: "none" }}>
                    Delete
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{ textTransform: "none" }}
                    onClick={() => navigate(`/projects/${selectedProject.id}/tasks`)}
                >
                    Create Task
                </Button>
            </div>
        </div>
    );
}