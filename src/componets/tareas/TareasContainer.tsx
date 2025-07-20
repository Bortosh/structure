import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, MenuItem, Select } from "@mui/material";
import { useProjectsStore } from "../../globalState/projectsStore";
import { useTasksStore } from "../../globalState/tasksStore";
import type { Project, Task } from "../../shared/interfaces/project";
import NewTaskModal from "../tareas/components/NewTaskModal";
import AssignTeamsModal from "../tareas/components/AssignTeamsModal";

export default function TareasContainer() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { projects } = useProjectsStore();
    const { teams, fetchAndSetTeams } = useTasksStore();

    const project: Project | undefined = projects.find((p: Project) => p.id === projectId);

    const [open, setOpen] = useState(false);
    const [openAssign, setOpenAssign] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    useEffect(() => {
        fetchAndSetTeams();
    }, []);

    const handleOpenAssign = (task: Task) => {
        setSelectedTask(task);
        setOpenAssign(true);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex flex-col gap-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Project Tasks</h2>
                <div className="flex gap-2">
                    <Button variant="outlined" onClick={() => navigate("/projects")}>Back to Projects</Button>
                    <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Create Task</Button>
                </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                {project ? (
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-[800px] divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Assignee</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {project.tareas?.map((tarea: Task) => (
                                    <tr key={tarea.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 whitespace-nowrap">{tarea.nombre}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            <Select
                                                defaultValue={tarea.estado}
                                                size="small"
                                                variant="outlined"
                                            >
                                                <MenuItem value="Not Started">Not Started</MenuItem>
                                                <MenuItem value="In Progress">In Progress</MenuItem>
                                                <MenuItem value="Completed">Completed</MenuItem>
                                            </Select>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">{tarea.fechaLimite}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{tarea.responsable}</td>
                                        <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                                            <Button variant="outlined" size="small">Edit</Button>
                                            <Button variant="outlined" color="error" size="small">Delete</Button>
                                            <Button variant="outlined" size="small" onClick={() => handleOpenAssign(tarea)}>Assign Teams</Button>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                onClick={() => navigate(`/projects/${projectId}/tasks/${tarea.id}/actions`)}
                                            >
                                                Task Actions
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">Project not found.</p>
                )}
            </div>
            <NewTaskModal open={open} onClose={() => setOpen(false)} onSubmit={(newTask: any) => console.log(newTask)} />
            {selectedTask && (
                <AssignTeamsModal
                    open={openAssign}
                    onClose={() => setOpenAssign(false)}
                    teams={teams}
                    tarea={selectedTask}
                    equiposAsignados={selectedTask.equipos}
                    onSave={(newEquipos: any) => console.log(newEquipos)}
                />
            )}
        </div>
    );
}
