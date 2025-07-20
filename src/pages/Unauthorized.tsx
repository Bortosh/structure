
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
            <Typography variant="h4" gutterBottom color="error">
                Unauthorized Access
            </Typography>
            <Typography variant="body1" className="mb-6">
                You do not have permission to view this page.
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate("/")}>
                Go to Home
            </Button>
        </div>
    );
}
