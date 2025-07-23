import type { ProjectLegacy as Project } from '../../../shared/interfaces/project'
import { Card, CardContent, CardHeader, CardTitle } from '../../dashboard/components/ui/Card'
import { formatDate } from '../../dashboard/components/utils/utils'

interface ProjectInfoCardProps {
    project: Project
}

export function ProjectInfoCard({ project }: ProjectInfoCardProps) {
    return (
        <Card className="rounded-2xl border border-gray-200 shadow-sm p-4">
            <CardHeader>
                <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="Department" value={project.department ?? 'N/A'} />
                    <InfoItem label="Category" value={project.category ?? 'N/A'} />
                    <InfoItem label="Start Date" value={formatDate(project.startDate)} />
                    <InfoItem label="End Date" value={formatDate(project.endDate)} />
                    <InfoItem label="Budget" value={project.budget ? `$${project.budget.toLocaleString()}` : 'N/A'} />
                    <InfoItem label="Priority" value={project.priority ?? 'N/A'} />
                </div>
            </CardContent>
        </Card>
    )
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-sm">{value}</p>
        </div>
    )
}
