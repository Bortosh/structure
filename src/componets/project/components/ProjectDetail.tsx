
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeftIcon } from 'lucide-react'
import { Button } from '../components/ui/botton'
import { ProjectStatusDropdown } from './ui/project-status-dropdown'
import { Tabs, TabsList, TabsTrigger } from './ui/tab'
import type { ProjectLegacy as Project } from '../../../shared/interfaces/project'
import { sampleProjects } from '../dataProjectLegacy/data'
import { ProjectInfoCard } from './ProjectInfoCard'
import { TabsContent } from '@radix-ui/react-tabs'
import { ProjectDescription } from './ProjectDescription'
import { ProjectActions } from './ProjectActions'
import { cn } from '../../dashboard/components/utils/utils'
import { DeleteProjectDialog } from './delete-project-dialog'
import { EditProjectForm } from './EditProjectForm'
import { usePlacesSearch } from '../../../shared/hooks/usePlacesSearch'
import MapSearch from '../project-map/MapSearch'
import { ProjectMap } from '../project-map/ProjectMap'
import type { Marker } from '../project-map/types/marker-types'
import { useTaskStore } from '../../../globalState/taskStorageLegacy'

export type ProjectTab = 'info' | 'map' | 'tasks' | 'team' | 'financials' | 'files'

export function ProjectDetail() {
    const { projectId } = useParams()
    const navigate = useNavigate()
    const project = sampleProjects.find(p => p.id === projectId)
    const [currentProject, setCurrentProject] = useState<Project | null>(project || null)
    const [activeTab, setActiveTab] = useState<ProjectTab>('info')


    const [isEditFormOpen, setIsEditFormOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    // Add state for selected location
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null)

    // Marker states
    const [txMarkers, setTxMarkers] = useState<Marker[]>([])
    const [serviceMarkers, setServiceMarkers] = useState<Marker[]>([])
    const [handholeMarkers, setHandholeMarkers] = useState<Marker[]>([])
    const [tieInMarkers, setTieInMarkers] = useState<Marker[]>([])

    // Task store integration
    const addTask = useTaskStore((state) => state.addTask)
    const removeTask = useTaskStore((state) => state.removeTask)
    const task = useTaskStore((state) => state.tasks)
    console.log("🚀 ~ ProjectDetail ~ task:", task)

    const handleEdit = () => {
        setIsEditFormOpen(true)
    }

    const handleDelete = () => {
        setIsDeleteDialogOpen(true)
    }

    const handleStatusChange = (newStatus: Project['status']) => {
        if (currentProject) {
            setCurrentProject({
                ...currentProject,
                status: newStatus,
            })
        }
    }

    if (!currentProject) {
        return (
            <div className="p-6">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back to Projects
                </Button>
                <p className="text-red-500 font-medium text-lg">Project not found</p>
            </div>
        )
    }

    // Search functionality
    const {
        searchQuery,
        loadingSearch,
        searchResults,
        handleSearchChange,
        handlePlaceSelect
    } = usePlacesSearch()

    const handlePlaceSelection = (place: any) => {
        if (!place?.location) return;

        const newLocation = {
            lat: place.location.latitude,
            lng: place.location.longitude
        };

        setSelectedLocation(newLocation);
        handlePlaceSelect(place); // This will update the search input and clear results
    }

    return (
        <div className="space-y-6">
            <div>
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back to Projects
                </Button>
            </div>

            <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">{currentProject.name}</h1>
                    <ProjectStatusDropdown
                        project={currentProject}
                        onStatusChange={handleStatusChange}
                    />
                </div>
                <div className="text-muted-foreground mb-6">
                    <span>Work Request ID: {currentProject.workRequestId}</span>
                </div>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={(value: string) => setActiveTab(value as ProjectTab)}
                className="w-full"
            >
                <TabsList className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:cursor-pointer")}>
                    <TabsTrigger value="info" className="cursor-pointer">Info</TabsTrigger>
                    <TabsTrigger value="map" className="cursor-pointer">Map</TabsTrigger>
                    <TabsTrigger value="tasks" className="cursor-pointer">Tasks</TabsTrigger>
                    <TabsTrigger value="team" className="cursor-pointer">Team</TabsTrigger>
                    <TabsTrigger value="financials" className="cursor-pointer">Financials</TabsTrigger>
                    <TabsTrigger value="files" className="cursor-pointer">Files</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Columna izquierda: Project Info */}
                        <ProjectInfoCard project={currentProject} />

                        {/* Columna derecha: Descripción y acciones */}
                        <div className="space-y-6">
                            <ProjectDescription project={currentProject} />
                            <ProjectActions
                                project={currentProject}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="map" className="space-y-4">
                    <MapSearch
                        searchQuery={searchQuery}
                        loadingSearch={loadingSearch}
                        searchResults={searchResults}
                        onSearchChange={handleSearchChange}
                        onResultClick={handlePlaceSelection}
                        className="w-full max-w-md"
                    />
                    <ProjectMap
                        projectId={Number(currentProject.id)}
                        txMarkers={txMarkers}
                        serviceMarkers={serviceMarkers}
                        handholeMarkers={handholeMarkers}
                        tieInMarkers={tieInMarkers}
                        setTxMarkers={setTxMarkers}
                        setServiceMarkers={setServiceMarkers}
                        setHandholeMarkers={setHandholeMarkers}
                        setTieInMarkers={setTieInMarkers}
                        setTasks={addTask}
                        removeTask={removeTask}
                        selectedLocation={selectedLocation}
                    />
                </TabsContent>

                <TabsContent value="tasks"><div>Tasks content here</div></TabsContent>
                <TabsContent value="team"><div>Team content here</div></TabsContent>
                <TabsContent value="financials"><div>Financials content here</div></TabsContent>
                <TabsContent value="files"><div>Files content here</div></TabsContent>
            </Tabs>

            {isEditFormOpen && (
                <EditProjectForm
                    project={currentProject}
                    isOpen={isEditFormOpen}
                    onClose={() => setIsEditFormOpen(false)}
                    onSubmit={(updatedProject) => {
                        setIsEditFormOpen(false)
                        setCurrentProject(updatedProject)
                    }}
                />
            )}

            {isDeleteDialogOpen && (
                <DeleteProjectDialog
                    project={project}
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirmDelete={() => {
                        setIsDeleteDialogOpen(false)
                        navigate('/projects-new')
                    }}
                />
            )}
        </div>
    )
}
