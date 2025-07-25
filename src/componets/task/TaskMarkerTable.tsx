import { useState } from "react"
import { useTaskStore } from "../../globalState/taskStorageLegacy"
import { Button } from "../project/components/ui/botton"
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog"
import { EditTaskModal } from "./EditTaskModal"
import type { Task } from "../project/project-map/types/task-types"

export const TaskMarkerTable = () => {
    const tasks = useTaskStore((state) => state.tasks)
    const removeTask = useTaskStore((state) => state.removeTask)
    const updateTask = useTaskStore((state) => state.updateTask)

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)

    const markerTasks = tasks.filter(task => task.type !== "Line") // exclude taskLines

    const visibleKeys = markerTasks.length > 0
        ? Object.keys(markerTasks[0]).filter(
            key => !["id", "lat", "lng", "type", "typeAction"].includes(key)
        )
        : []

    const handleDeleteClick = (id: string) => {
        setSelectedTaskId(id)
        setIsDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (selectedTaskId) {
            removeTask(selectedTaskId)
            setSelectedTaskId(null)
            setIsDialogOpen(false)
        }
    }

    const handleEditClick = (task: Task) => {
        setTaskToEdit(task)
        setIsEditOpen(true)
    }

    const handleSaveEdit = (id: string, updated: Partial<Task>) => {
        updateTask(id, updated)
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="border-b font-medium">
                        <tr>
                            <th className="px-4 py-2">Type</th>
                            {visibleKeys.map((key) => (
                                <th key={key} className="px-4 py-2 capitalize whitespace-nowrap">
                                    {key.replace(/([A-Z])/g, ' $1')}
                                </th>
                            ))}
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {markerTasks.map((task) => (
                            <tr key={task.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{task.type}</td>
                                {visibleKeys.map((key) => {
                                    const value = task[key as keyof typeof task]
                                    const displayValue =
                                        Array.isArray(value)
                                            ? value.length > 0 ? value.join(', ') : '-'
                                            : typeof value === 'boolean'
                                                ? value ? 'Yes' : 'No'
                                                : value !== undefined && value !== ''
                                                    ? value
                                                    : '-'

                                    return (
                                        <td key={key} className="px-4 py-2 whitespace-nowrap">
                                            {displayValue}
                                        </td>
                                    )
                                })}
                                <td className="px-4 py-2 whitespace-nowrap space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditClick(task)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleDeleteClick(task.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {markerTasks.length === 0 && (
                            <tr>
                                <td colSpan={visibleKeys.length + 2} className="px-4 py-6 text-center text-gray-500">
                                    No marker tasks registered yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {taskToEdit && (
                <EditTaskModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    task={taskToEdit}
                    onSave={handleSaveEdit}
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
