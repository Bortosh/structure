
import { useState } from 'react'
import { Button } from './ui/botton'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog'
import { Input } from './ui/Input'
import { Label } from './ui/label'
import type { ProjectLegacy as Project } from '../../../shared/interfaces/project'

interface DeleteProjectDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirmDelete: (projectId: string) => void
    project?: Project
}

export function DeleteProjectDialog({
    isOpen,
    onClose,
    onConfirmDelete,
    project
}: DeleteProjectDialogProps) {
    const [confirmName, setConfirmName] = useState('')
    const [error, setError] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!project) return

        if (confirmName !== project.name) {
            setError(true)
            return
        }

        onConfirmDelete(project.id)
        setConfirmName('')
        setError(false)
        onClose()
    }

    if (!project) return null

    const isMatch = confirmName === project.name
    const buttonDisabled = !isMatch

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[90vw] md:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Delete Project</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the project
                            and remove all data associated with it.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <p className="text-sm">
                            Please type <span className="font-semibold">{project.name}</span> to confirm deletion.
                        </p>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmName">Project Name</Label>
                            <Input
                                id="confirmName"
                                value={confirmName}
                                onChange={(e) => {
                                    setConfirmName(e.target.value)
                                    setError(false)
                                }}
                                className={error ? 'border-red-500' : ''}
                                autoComplete="off"
                            />
                            {error && (
                                <p className="text-xs text-red-500">Project name doesn't match</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="mt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="mb-2 sm:mb-0">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={buttonDisabled}
                            className={!isMatch ? 'opacity-50' : ''}
                        >
                            Delete Project
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 