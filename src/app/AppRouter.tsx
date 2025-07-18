import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutContainer from '../componets/layout/LayoutContainer'
import DashboardContainer from '../componets/dashboard/DashboardContainer'
import ProyectosContainer from '../componets/proyectos/ProyectosContainer'
import SupervisoresContainer from "../componets/supervisores/SupervisoresContainer";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LayoutContainer />}>
                    <Route index element={<DashboardContainer />} />
                    <Route path="proyectos" element={<ProyectosContainer />} />
                    <Route path="supervisores" element={<SupervisoresContainer />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;