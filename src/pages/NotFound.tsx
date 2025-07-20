// src/pages/NotFound.tsx
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
            <Typography variant="h3" gutterBottom color="textPrimary">
                404 - Page Not Found
            </Typography>
            <Typography variant="body1" className="mb-6">
                The page you're looking for doesn't exist.
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate("/")}>
                Return to Home
            </Button>
        </div>
    );
}
