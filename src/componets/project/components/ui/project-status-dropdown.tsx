'use client'

import { useState } from 'react'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { Button } from './botton'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './Menudropdown'
import type { ProjectLegacy as Project } from '../../../../shared/interfaces/project'
import { statusColor } from '../../../../shared/interfaces/project'

interface ProjectStatusDropdownProps {
    project: Project
    onStatusChange: (newStatus: Project['status']) => void
}

export function ProjectStatusDropdown({ project, onStatusChange }: ProjectStatusDropdownProps) {
    const [status, setStatus] = useState<Project['status']>(project.status)

    const handleStatusChange = (newStatus: Project['status']) => {
        setStatus(newStatus)
        onStatusChange(newStatus)
    }

    const statuses: Project['status'][] = ['Active', 'Pending', 'Completed', 'New']

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={`h-auto py-2 px-4 flex items-center gap-2 rounded-full text-sm font-medium ${statusColor(status)}`}
                >
                    {status}
                    <ChevronDownIcon className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='bg-white'>
                {statuses.map((statusOption) => (
                    <DropdownMenuItem
                        key={statusOption}
                        onClick={() => handleStatusChange(statusOption)}
                        className="flex items-center gap-2"
                    >
                        <span className={`h-2 w-2 rounded-full ${statusColor(statusOption)}`} />
                        {statusOption}
                        {status === statusOption && (
                            <CheckIcon className="ml-auto h-4 w-4" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 