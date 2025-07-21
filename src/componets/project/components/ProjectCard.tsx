import { ArrowRightIcon, CalendarIcon, CreditCardIcon, LandmarkIcon, MoreVertical, PowerIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '../../dashboard/components/ui/Card'
import { Button } from './ui/botton'
import { ProjectStatusBadge } from '../components/ProjectStatusBadge'
import type { ProjectLegacy } from '../../../shared/interfaces/project'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/Menudropdown"

interface ProjectCardProps {
    project: ProjectLegacy
    onEditProject: (project: ProjectLegacy) => void
    onDeleteProject: (project: ProjectLegacy) => void
    onViewProject: (projectId: string) => void
}

export function ProjectCard({
    project,
    onEditProject,
    onDeleteProject,
    onViewProject
}: ProjectCardProps) {
    // Format currency to USD
    const formattedIncome = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(project.estimatedIncome)

    return (
        <Card className="border border-muted rounded-sm bg-background">
            <CardHeader className="p-3 pb-1.5 flex flex-row justify-between items-start">
                <div className="pr-2">
                    <h3 className="font-semibold text-base leading-tight">{project.name}</h3>
                    <p className="text-xs text-muted-foreground">WR: {project.workRequestId}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <ProjectStatusBadge status={project.status} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="bg-white border border-gray-200 shadow-md rounded-md p-1 z-50"
                        >
                            <DropdownMenuItem onClick={() => onEditProject(project)}>
                                <PencilIcon className="mr-2 h-4 w-4" />
                                <span>Edit Project</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDeleteProject(project)}
                                className="text-red-600 focus:text-red-600 focus:bg-red-100"
                            >
                                <TrashIcon className="mr-2 h-4 w-4" />
                                <span>Delete Project</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="p-3 pt-1.5 space-y-2.5 sm:space-y-3 flex-grow">
                {/* Progress Bar */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Progress</span>
                        <span className="text-xs font-medium text-foreground">{project.completion}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                            className="h-full bg-green-600 transition-all duration-500"
                            style={{ width: `${project.completion}%` }}
                        />
                    </div>
                </div>
                {/* Project Details */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs">
                    <div className="flex items-center">
                        <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span>Start: {project.startDate}</span>
                    </div>
                    <div className="flex items-center">
                        <PowerIcon className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span>{project.txCount} TX's</span>
                    </div>
                    <div className="flex items-center">
                        <CreditCardIcon className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span>{project.serviceCount} Services</span>
                    </div>
                    <div className="flex items-center">
                        <LandmarkIcon className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span>{formattedIncome}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-1.5 bg-muted/30 border-t mt-auto">
                <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto py-0.5 h-6 text-xs"
                    onClick={() => onViewProject(project.id)}
                >
                    View Project
                    <ArrowRightIcon className="ml-1 h-3 w-3" />
                </Button>
            </CardFooter>
        </Card>
    )
} 