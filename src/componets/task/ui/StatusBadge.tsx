interface StatusBadgeProps {
    status: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const base = "px-2 py-1 rounded text-xs font-medium"

    const colorMap: Record<string, string> = {
        "Active": "bg-blue-100 text-blue-800",
        "In Progress": "bg-yellow-100 text-yellow-800",
        "Completed": "bg-green-100 text-green-800",
        "Finalized": "bg-blue-200 text-gray-800"
    }

    const className = `${base} ${colorMap[status] || "bg-neutral-100 text-neutral-700"}`

    return <span className={className}>{status}</span>
}
