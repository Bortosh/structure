import type { ProjectLegacy as Project } from '../../../shared/interfaces/project'
import { Button } from './ui/botton'
import { Card, CardContent, CardHeader, CardTitle } from '../../dashboard/components/ui/Card'
import { EditIcon, TrashIcon } from 'lucide-react'

interface ProjectActionsProps {
    project: Project
    onEdit: () => void
    onDelete: (project: Project) => void
}

export function ProjectActions({ project, onEdit, onDelete }: ProjectActionsProps) {
    return (
        <Card className="rounded-2xl border border-gray-200 shadow-sm p-4">
            <CardHeader>
                <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-2 px-4 py-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onEdit}
                >
                    <EditIcon className="mr-2 h-4 w-4" />
                    Edit Project
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => onDelete(project)}
                >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete Project
                </Button>
            </CardContent>
        </Card>
    )
}
