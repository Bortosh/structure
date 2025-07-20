
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../globalState/authStore";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}
