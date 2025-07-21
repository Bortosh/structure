import type { ProjectLegacy } from '../../../shared/interfaces/project'
import { ProjectCard } from './ProjectCard'

interface ProjectsGridProps {
    projects: ProjectLegacy[]
    onEditProject: (project: ProjectLegacy) => void
    onDeleteProject: (project: ProjectLegacy) => void
    onViewProject: (projectId: string) => void
}

export function ProjectsGrid({
    projects,
    onEditProject,
    onDeleteProject,
    onViewProject
}: ProjectsGridProps) {
    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    onEditProject={onEditProject}
                    onDeleteProject={onDeleteProject}
                    onViewProject={onViewProject}
                />
            ))}
        </div>
    )
} 