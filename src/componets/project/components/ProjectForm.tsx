import { useState, useEffect } from 'react'
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

interface ProjectFormProps {
    isOpen: boolean
    onClose: () => void
    onSave: (projectData: {
        id?: string
        name: string
        workRequestId: number
        startDate: string
    }) => void
    project?: Project
    mode: 'create' | 'edit'
}

export function ProjectForm({
    isOpen,
    onClose,
    onSave,
    project,
    mode = 'create'
}: ProjectFormProps) {
    const [name, setName] = useState('')
    const [workRequestId, setWorkRequestId] = useState('')
    const [startDate, setStartDate] = useState('')
    const [formErrors, setFormErrors] = useState({
        name: false,
        workRequestId: false,
        startDate: false
    })

    useEffect(() => {
        if (mode === 'edit' && project) {
            setName(project.name)
            setWorkRequestId(project.workRequestId.toString())
            setStartDate(project.startDate)
        } else {
            setName('')
            setWorkRequestId('')
            setStartDate('')
        }
    }, [project, mode, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const errors = {
            name: !name.trim(),
            workRequestId: !workRequestId.trim() || isNaN(Number(workRequestId)),
            startDate: !startDate
        }

        setFormErrors(errors)

        if (Object.values(errors).some(isError => isError)) {
            return
        }

        onSave({
            id: project?.id,
            name,
            workRequestId: Number(workRequestId),
            startDate
        })

        setName('')
        setWorkRequestId('')
        setStartDate('')
        onClose()
    }

    const title = mode === 'create' ? 'Create New Project' : 'Edit Project'
    const description = mode === 'create'
        ? 'Enter the details for the new project'
        : 'Update the project details'
    const buttonText = mode === 'create' ? 'Create Project' : 'Save Changes'

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-sm sm:max-w-md rounded-xl p-6 shadow-md bg-white dark:bg-neutral-100 data-[state=open]:fade-in-90">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground mb-4">
                            {description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="mb-1 block">Project Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={formErrors.name ? 'border-red-500' : ''}
                            />
                            {formErrors.name && (
                                <p className="text-xs text-red-500 mt-1">Project name is required</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="workRequestId" className="mb-1 block">Work Request ID</Label>
                            <Input
                                id="workRequestId"
                                value={workRequestId}
                                onChange={(e) => setWorkRequestId(e.target.value)}
                                className={formErrors.workRequestId ? 'border-red-500' : ''}
                            />
                            {formErrors.workRequestId && (
                                <p className="text-xs text-red-500 mt-1">Valid Work Request ID is required</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="startDate" className="mb-1 block">Start Date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className={formErrors.startDate ? 'border-red-500' : ''}
                            />
                            {formErrors.startDate && (
                                <p className="text-xs text-red-500 mt-1">Start date is required</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {buttonText}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
