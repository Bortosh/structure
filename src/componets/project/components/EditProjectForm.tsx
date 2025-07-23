
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

interface EditProjectFormProps {
    project: Project
    isOpen: boolean
    onClose: () => void
    onSubmit: (updatedProject: Project) => void
}

export function EditProjectForm({
    project,
    isOpen,
    onClose,
    onSubmit
}: EditProjectFormProps) {
    const [name, setName] = useState(project.name)
    const [workRequestId, setWorkRequestId] = useState(project.workRequestId.toString())
    const [startDate, setStartDate] = useState(project.startDate)
    const [formErrors, setFormErrors] = useState({
        name: false,
        workRequestId: false,
        startDate: false
    })

    useEffect(() => {
        // Reset form when project changes
        setName(project.name)
        setWorkRequestId(project.workRequestId.toString())
        setStartDate(project.startDate)
    }, [project])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validate form
        const errors = {
            name: !name.trim(),
            workRequestId: !workRequestId.trim() || isNaN(Number(workRequestId)),
            startDate: !startDate
        }

        setFormErrors(errors)

        if (Object.values(errors).some(isError => isError)) {
            return
        }

        const updatedProject: Project = {
            ...project,
            name,
            workRequestId: Number(workRequestId),
            startDate
        }

        onSubmit(updatedProject)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[90vw] md:max-w-[425px] bg-white">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>
                            Update project details
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Project Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={formErrors.name ? 'border-red-500' : ''}
                            />
                            {formErrors.name && (
                                <p className="text-xs text-red-500">Project name is required</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="workRequestId">Work Request ID</Label>
                            <Input
                                id="workRequestId"
                                value={workRequestId}
                                onChange={(e) => setWorkRequestId(e.target.value)}
                                className={formErrors.workRequestId ? 'border-red-500' : ''}
                            />
                            {formErrors.workRequestId && (
                                <p className="text-xs text-red-500">Valid Work Request ID is required</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className={formErrors.startDate ? 'border-red-500' : ''}
                            />
                            {formErrors.startDate && (
                                <p className="text-xs text-red-500">Start date is required</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 