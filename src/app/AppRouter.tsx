import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutContainer from '../componets/layout/LayoutContainer';
import DashboardContainer from '../componets/dashboard/DashboardContainer';
import ProyectosContainer from '../componets/proyectos/ProyectosContainer';
import SupervisoresContainer from "../componets/supervisores/SupervisoresContainer";
import TareasContainer from "../componets/tareas/TareasContainer";
import TaskDetailContainer from "../componets/tareas/components/TaskDetailContainer";
import ProtectedRoute from "../app/ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import PrivateRoute from "./PrivateRoute";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";
import ProjectsContainer from "../componets/project/ProjectsContainer";
import { ProjectDetail } from "../componets/project/components/ProjectDetail";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                <Route path="/" element={
                    <PrivateRoute>
                        <LayoutContainer />
                    </PrivateRoute>
                }>
                    <Route
                        index
                        element={
                            <ProtectedRoute allowedRoles={[1]}>
                                <DashboardContainer />
                            </ProtectedRoute>
                        }
                    />
                    {/* <Route
                        path="projects"
                        element={
                            <ProtectedRoute allowedRoles={[2]}>
                                <ProyectosContainer />
                            </ProtectedRoute>
                        }
                    /> */}
                    <Route
                        path="projects"
                        element={
                            <ProtectedRoute allowedRoles={[2]}>
                                <ProjectsContainer />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="projects/:projectId"
                        element={
                            <ProtectedRoute allowedRoles={[2]}>
                                <ProjectDetail />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="supervisors" element={<SupervisoresContainer />} />
                    <Route
                        path="projects/:projectId/tasks"
                        element={
                            <ProtectedRoute allowedRoles={[2]}>
                                <TareasContainer />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="projects/:projectId/tasks/:taskId/actions"
                        element={
                            <ProtectedRoute allowedRoles={[2]}>
                                <TaskDetailContainer />
                            </ProtectedRoute>
                        }
                    />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
