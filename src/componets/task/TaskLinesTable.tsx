import { useState } from "react"
import { useTaskStore } from "../../globalState/taskStorageLegacy"
import { Button } from "../project/components/ui/botton"
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog"

const TaskLinesTable = () => {
    const taskLines = useTaskStore((state) => state.taskLines)
    const removeTaskLine = useTaskStore((state) => state.removeTaskLine)

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const visibleKeys = taskLines.length > 0
        ? Object.keys(taskLines[0]).filter(key =>
            !["id", "path", "type"].includes(key)
        )
        : []

    const handleDeleteClick = (id: string) => {
        setSelectedId(id)
        setIsDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (selectedId) {
            removeTaskLine(selectedId)
            setSelectedId(null)
            setIsDialogOpen(false)
        }
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
                        {taskLines.map((line) => (
                            <tr key={line.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{line.type}</td>
                                {visibleKeys.map((key) => {
                                    const value = line[key as keyof typeof line]
                                    const displayValue = Array.isArray(value)
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
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleDeleteClick(line.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {taskLines.length === 0 && (
                            <tr>
                                <td colSpan={visibleKeys.length + 2} className="px-4 py-6 text-center text-gray-500">
                                    No task lines registered yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmDeleteDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </>
    )
}

export default TaskLinesTable;