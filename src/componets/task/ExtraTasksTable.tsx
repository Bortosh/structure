import { useState } from "react"
import { useTaskStore } from "../../globalState/taskStorageLegacy"
import { Button } from "../project/components/ui/botton"
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog"
import { CreateExtraTaskModal } from "./CreateExtraTaskModal"
import { EditExtraTaskModal } from "./EditExtraTaskModal"
import type { ExtraTask } from "../project/project-map/types/task-types"
import { StatusBadge } from "./ui/StatusBadge"

const ExtraTasksTable = () => {
    const extraTasks = useTaskStore((state) => state.extraTasks)
    const removeExtraTask = useTaskStore((state) => state.removeExtraTask)

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const [taskToEdit, setTaskToEdit] = useState<ExtraTask | null>(null)

    const handleDeleteClick = (id: string) => {
        setSelectedTaskId(id)
        setIsDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (selectedTaskId) {
            removeExtraTask(selectedTaskId)
            setSelectedTaskId(null)
            setIsDialogOpen(false)
        }
    }

    const handleEditClick = (task: ExtraTask) => {
        setTaskToEdit(task)
        setIsEditOpen(true)
    }

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Extra Tasks</h3>
                <Button size="sm" onClick={() => setIsCreateOpen(true)}>New Extra Task</Button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="border-b font-medium">
                        <tr>
                            <th className="px-4 py-2">Project</th>
                            <th className="px-4 py-2">Extra Task Name</th>
                            <th className="px-4 py-2">Description</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Deadline</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {extraTasks.map(task => (
                            <tr key={task.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{task.projectName}</td>
                                <td className="px-4 py-2">{task.name}</td>
                                <td className="px-4 py-2">{task.description}</td>
                                <td className="px-4 py-2">
                                    <StatusBadge status={task.status} />
                                </td>
                                <td className="px-4 py-2">{task.deadline}</td>
                                <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                                    <Button className="hover: cursor-pointer" variant="outline" size="sm" onClick={() => handleEditClick(task)}>Edit</Button>
                                    <Button className="hover: cursor-pointer" variant="default" size="sm" onClick={() => handleDeleteClick(task.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                        {extraTasks.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                                    No extra tasks yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <CreateExtraTaskModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />

            {taskToEdit && (
                <EditExtraTaskModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    task={taskToEdit}
                />
            )}

            <ConfirmDeleteDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </>
    )
}

export default ExtraTasksTable;