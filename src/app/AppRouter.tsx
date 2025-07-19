import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutContainer from '../componets/layout/LayoutContainer'
import DashboardContainer from '../componets/dashboard/DashboardContainer'
import ProyectosContainer from '../componets/proyectos/ProyectosContainer'
import SupervisoresContainer from "../componets/supervisores/SupervisoresContainer";
import TareasContainer from "../componets/tareas/TareasContainer";
import TaskDetailContainer from "../componets/tareas/components/TaskDetailContainer";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LayoutContainer />}>
                    <Route index element={<DashboardContainer />} />
                    <Route path="proyectos" element={<ProyectosContainer />} />
                    <Route path="supervisores" element={<SupervisoresContainer />} />
                    <Route path="proyectos/:projectId/tareas" element={<TareasContainer />} />
                    <Route path="proyectos/:projectId/tareas/:taskId/acciones" element={<TaskDetailContainer />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
