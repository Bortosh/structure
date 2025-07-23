import { useState } from 'react'
import { useTaskStore } from '../../globalState/taskStorageLegacy'
import { Button } from '../project/components/ui/botton'
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog'
import type { Task } from '../project/project-map/types/task-types'
import { EditTaskModal } from './EditTaskModal'

export const MapActionsTable = () => {
    const tasks = useTaskStore((state) => state.tasks)
    const removeTask = useTaskStore((state) => state.removeTask)

    const visibleKeys = tasks.length > 0
        ? Object.keys(tasks[0]).filter(key => key !== 'id')
        : []

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)

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

    const updateTask = useTaskStore((state) => state.updateTask)

    const handleEditClick = (task: Task) => {
        setTaskToEdit(task)
        setIsEditOpen(true)
    }

    const handleSaveEdit = (id: string, updated: Partial<Task>) => {
        updateTask(id, updated)
    }


    return (
        <>
            <div className="bg-white rounded-md shadow p-4">
                <h2 className="text-xl font-semibold mb-4">Map Actions</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="border-b font-medium">
                            <tr>
                                {visibleKeys.map((key) => (
                                    <th key={key} className="px-4 py-2 capitalize whitespace-nowrap">
                                        {key.replace(/([A-Z])/g, ' $1')}
                                    </th>
                                ))}
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task.id} className="border-b hover:bg-gray-50">
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
                            {tasks.length === 0 && (
                                <tr>
                                    <td colSpan={visibleKeys.length + 1} className="px-4 py-6 text-center text-gray-500">
                                        No actions registered yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
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
