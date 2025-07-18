import { Skeleton } from "@mui/material";

export default function ProyectosTableSkeleton() {
    return (
        <div className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <Skeleton variant="text" height={32} width="30%" />

            {[...Array(5)].map((_, index) => (
                <div key={index} className="flex gap-4">
                    <Skeleton variant="rectangular" width={40} height={40} />
                    <Skeleton variant="text" width="20%" height={32} />
                    <Skeleton variant="text" width="30%" height={32} />
                    <Skeleton variant="text" width="20%" height={32} />
                    <Skeleton variant="text" width="15%" height={32} />
                </div>
            ))}
        </div>
    );
}
