import { useAuthStore } from "../globalState/authStore";
import { useNavigate } from "react-router-dom";
import { mockUsers } from "../shared/data/mockUsers";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { initialRoutesByRole } from "../shared/constants/routesByRole";

export default function LoginPage() {
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleLogin = (user: any) => {
        login(user);
        const redirectPath = initialRoutesByRole[user.idRol] || "/unauthorized";
        navigate(redirectPath);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <Card className="w-full max-w-sm">
                <CardContent className="flex flex-col gap-4">
                    <Typography variant="h5" className="text-center">Login</Typography>
                    {mockUsers.map(user => (
                        <Button key={user.id} variant="contained" onClick={() => handleLogin(user)}>
                            {user.name} ({user.rolName})
                        </Button>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
