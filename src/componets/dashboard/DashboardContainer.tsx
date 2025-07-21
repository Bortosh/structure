// src/components/home/dashboard-overview.tsx
import { BarChart2, TrendingUp, Users, Wallet } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/Card'
import { PageHeader } from './components/PageHeader'

const recentActivities = [
    {
        id: '1',
        type: 'project',
        title: 'New project created',
        description: 'Main St Fiber Installation (ID: PRJ-2023-089)',
        date: 'Today at 2:30 PM',
        user: 'John Smith'
    },
    {
        id: '2',
        type: 'crew',
        title: 'Crew assigned',
        description: 'Boring Crew #3 assigned to Highland Park project',
        date: 'Today at 11:15 AM',
        user: 'Sarah Johnson'
    },
    {
        id: '3',
        type: 'task',
        title: 'Task completed',
        description: 'Permit approval for Downtown Line Extension',
        date: 'Yesterday at 4:45 PM',
        user: 'Mike Williams'
    },
    {
        id: '4',
        type: 'report',
        title: 'Report generated',
        description: 'Monthly production report for April 2023',
        date: 'Apr 30, 2023',
        user: 'System'
    },
]

export default function DashboardOverview() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description="Overview of your construction projects and activities"
            />

            {/* Overview cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <OverviewCard title="Total Projects" value="27" icon={<LayersIcon />} subtitle="+4 from last month" />
                <OverviewCard title="Active Crews" value="8" icon={<Users className="h-4 w-4 text-muted-foreground" />} subtitle="+2 from last month" />
                <OverviewCard title="Production Rate" value="+12.5%" icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} subtitle="+2.3% from last month" />
                <OverviewCard title="Revenue" value="$45,231" icon={<Wallet className="h-4 w-4 text-muted-foreground" />} subtitle="+20.1% from last month" />
            </div>

            {/* Recent activity */}
            <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                        Your team's latest actions and updates
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4 rounded-lg border border-gray-200 p-3 shadow-sm">
                                <div className={`rounded-full p-2 ${activityColor(activity.type)}`}>
                                    {activityIcon(activity.type)}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {activity.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {activity.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {activity.date} • {activity.user}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function OverviewCard({ title, value, icon, subtitle }: { title: string, value: string, icon: React.ReactNode, subtitle: string }) {
    return (
        <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    {subtitle}
                </p>
            </CardContent>
        </Card>
    )
}

function LayersIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-muted-foreground"
        >
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
        </svg>
    )
}

function activityIcon(type: string) {
    switch (type) {
        case 'project':
            return <LayersIcon />
        case 'crew':
            return <Users className="h-4 w-4" />
        case 'task':
        case 'report':
            return <BarChart2 className="h-4 w-4" />
        default:
            return <LayersIcon />
    }
}

function activityColor(type: string) {
    switch (type) {
        case 'project':
            return 'bg-blue-100 dark:bg-blue-200'
        case 'crew':
            return 'bg-green-100 dark:bg-green-200'
        case 'task':
            return 'bg-amber-100 dark:bg-amber-200'
        case 'report':
            return 'bg-purple-100 dark:bg-purple-200'
        default:
            return 'bg-gray-100 dark:bg-gray-500'
    }
}
