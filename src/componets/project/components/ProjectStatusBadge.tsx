import { statusColor } from '../../../shared/interfaces/project'

interface ProjectStatusBadgeProps {
    status: string
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor(status)}`}>
            {status}
        </span>
    )
} 