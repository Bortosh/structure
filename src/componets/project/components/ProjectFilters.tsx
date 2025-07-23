
import { SearchIcon } from 'lucide-react'
import { Card, CardContent } from '../../dashboard/components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/botton'

interface ProjectFiltersProps {
    activeFilter: string
    onFilterChange: (filter: string) => void
    searchQuery: string
    onSearchChange: (query: string) => void
}

export function ProjectFilters({
    activeFilter,
    onFilterChange,
    searchQuery,
    onSearchChange
}: ProjectFiltersProps) {
    return (
        <Card className="shadow-sm border border-gray-300">
            <CardContent className="p-4 space-y-4">
                {/* Status Filters */}
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={activeFilter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onFilterChange('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={activeFilter === 'active' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onFilterChange('active')}
                    >
                        Active
                    </Button>
                    <Button
                        variant={activeFilter === 'pending' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onFilterChange('pending')}
                    >
                        Pending
                    </Button>
                    <Button
                        variant={activeFilter === 'completed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onFilterChange('completed')}
                    >
                        Completed
                    </Button>
                    <Button
                        variant={activeFilter === 'new' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onFilterChange('new')}
                    >
                        New
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by project name or work request ID..."
                        className="w-full pl-8"
                    />
                </div>
            </CardContent>
        </Card>
    )
} 