import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { useProjectsStore } from "../../../globalState/projectsStore";

const columns: GridColDef[] = [
    { field: "nombre", headerName: "Name", flex: 1 },
    { field: "tipo", headerName: "Type", flex: 1 },
    {
        field: "estado",
        headerName: "Status",
        flex: 1,
        renderCell: (params) => (
            <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${params.value === "Completed"
                        ? "bg-green-100 text-green-700"
                        : params.value === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : params.value === "At Risk"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                    }`}
            >
                {params.value}
            </span>
        ),
    },
    {
        field: "fechaLimite",
        headerName: "Deadline",
        flex: 1,
        renderCell: (params) => (
            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-600">
                {params.value}
            </span>
        ),
    },
];



export default function ProyectosTable() {

    const { projects, setSelectedProject } = useProjectsStore()

    return (
        <div className="flex flex-col">
            <DataGrid
                rows={projects}
                columns={columns}
                pageSizeOptions={[5, 10, 15]}
                onRowClick={({ row }) => setSelectedProject(row)}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5, page: 0 } }
                }}
                disableRowSelectionOnClick
            />
        </div>

    );
}
