import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { useProjectsStore } from "../../../globalState/projectsStore";

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "tipo", headerName: "Tipo", width: 200 },
    { field: "fechaCreacion", headerName: "Fecha de creación", width: 180 },
    { field: "estado", headerName: "Estado", width: 150 }
];

export default function ProyectosTable() {

    const { projects } = useProjectsStore()

    return (
        <div className="flex flex-col">
            <DataGrid
                rows={projects}
                columns={columns}
                pageSizeOptions={[5, 10, 15]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5, page: 0 } }
                }}
                disableRowSelectionOnClick
            />
        </div>

    );
}
