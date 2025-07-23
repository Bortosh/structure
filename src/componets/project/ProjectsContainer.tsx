
import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { Button } from './components/ui/botton'
import { PageHeader } from '../dashboard/components/PageHeader'
import { ProjectFilters } from './components/ProjectFilters'
import { ProjectsGrid } from './components/ProjectsGrid'
import { sampleProjects } from './dataProjectLegacy/data'
import type { ProjectLegacy } from '../../shared/interfaces/project'
import { ProjectForm } from './components/ProjectForm'
import { DeleteProjectDialog } from './components/delete-project-dialog'
import { useNavigate } from 'react-router-dom'

export default function ProjectsContainer() {
    const [statusFilter, setStatusFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [projects, setProjects] = useState<ProjectLegacy[]>(sampleProjects)

    // Project form state
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [currentProject, setCurrentProject] = useState<ProjectLegacy | undefined>(undefined)

    // Delete dialog state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [projectToDelete, setProjectToDelete] = useState<ProjectLegacy | undefined>(undefined)

    const navigate = useNavigate()

    // Filter projects based on status and search query
    const filteredProjects = projects.filter((project) => {
        // Status filtering
        if (statusFilter !== 'all') {
            if (statusFilter === 'active' && project.status !== 'Active') return false;
            if (statusFilter === 'pending' && project.status !== 'Pending') return false;
            if (statusFilter === 'completed' && project.status !== 'Completed') return false;
            if (statusFilter === 'new' && project.status !== 'New') return false;
        }

        // Search filtering (if search query exists)
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            return (
                project.name.toLowerCase().includes(query) ||
                project.workRequestId.toString().includes(query)
            )
        }

        return true
    })

    // Open the create project form
    const handleCreateProject = () => {
        setFormMode('create')
        setCurrentProject(undefined)
        setIsFormOpen(true)
    }

    // Open the edit project form
    const handleEditProject = (project: ProjectLegacy) => {
        setFormMode('edit')
        setCurrentProject(project)
        setIsFormOpen(true)
    }

    // Open the delete project dialog
    const handleDeleteClick = (project: ProjectLegacy) => {
        setProjectToDelete(project)
        setIsDeleteDialogOpen(true)
    }

    // Handle project view (placeholder for now)
    const handleViewProject = (projectId: string) => {
        // Navigate to project detail page
        navigate(`/projects/${projectId}`)

    }

    // Save project (create or edit)
    const handleSaveProject = (projectData: {
        id?: string;
        name: string;
        workRequestId: number;
        startDate: string;
    }) => {
        if (formMode === 'create') {
            // Create a new project with default values for other fields
            const timestamp = new Date().getTime();
            const newProject: ProjectLegacy = {
                id: `p${timestamp}`, // Use timestamp for unique ID
                ...projectData,
                client: 'New Client', // Default value
                status: 'New',
                crew: 'Pending Assignment',
                completion: 0,
                txCount: 0,
                serviceCount: 0,
                estimatedIncome: 0
            }

            // Add the new project to the list
            setProjects([...projects, newProject])
        } else {
            // Edit existing project
            const updatedProjects = projects.map(p => {
                if (p.id === projectData.id) {
                    return {
                        ...p,
                        name: projectData.name,
                        workRequestId: projectData.workRequestId,
                        startDate: projectData.startDate
                    }
                }
                return p
            })
            setProjects(updatedProjects)
        }
    }

    // Handle project deletion confirmation
    const handleDeleteProject = (projectId: string) => {
        const updatedProjects = projects.filter(p => p.id !== projectId)
        setProjects(updatedProjects)
    }

    return (
        <div className="space-y-4">
            {/* Header with actions */}
            <PageHeader
                title="Projects"
                description="Manage your construction projects and track their progress"
            >
                <Button
                    className="whitespace-nowrap"
                    onClick={handleCreateProject}
                >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Create Project
                </Button>
            </PageHeader>

            {/* Filters and search */}
            <ProjectFilters
                activeFilter={statusFilter}
                onFilterChange={setStatusFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {/* Projects Grid */}
            <ProjectsGrid
                projects={filteredProjects}
                onEditProject={handleEditProject}
                onDeleteProject={handleDeleteClick}
                onViewProject={handleViewProject}
            />

            {/* Project Form Dialog (Create or Edit) */}
            <ProjectForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={handleSaveProject}
                project={currentProject}
                mode={formMode}
            />

            {/* Delete Project Dialog */}
            <DeleteProjectDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirmDelete={handleDeleteProject}
                project={projectToDelete}
            />
        </div>
    )
} 