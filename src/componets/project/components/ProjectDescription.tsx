import type { ProjectLegacy as Project } from '../../../shared/interfaces/project'
import { Card, CardContent, CardHeader, CardTitle } from '../../dashboard/components/ui/Card'

interface ProjectDescriptionProps {
    project: Project
}

export function ProjectDescription({ project }: ProjectDescriptionProps) {
    return (
        <Card className="rounded-2xl border border-gray-200 shadow-sm p-4">
            <CardHeader>
                <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {project.description || 'No description provided.'}
                </p>
            </CardContent>
        </Card>
    )
}
