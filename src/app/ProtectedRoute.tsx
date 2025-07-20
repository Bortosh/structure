// src/app/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../globalState/authStore";

export default function ProtectedRoute({
    children,
    allowedRoles,
}: {
    children: React.ReactNode;
    allowedRoles: number[];
}) {
    const user = useAuthStore((state) => state.currentUser);

    if (!user) return <Navigate to="/login" />;
    if (!allowedRoles.includes(user.idRol)) return <Navigate to="/unauthorized" />;

    return children;
}
