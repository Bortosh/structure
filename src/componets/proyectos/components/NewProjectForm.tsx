import { useState } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

interface NewProjectFormProps {
    open: boolean;
    onClose: () => void;
}

const NewProjectForm = ({ open, onClose }: NewProjectFormProps) => {
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("");
    const [fechaLimite, setFechaLimite] = useState("");

    const handleSubmit = () => {
        console.log({ nombre, tipo, fechaLimite });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogContent className="flex flex-col gap-4 py-4">
                <TextField
                    label="Name"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Type"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Deadline"
                    type="date"
                    value={fechaLimite}
                    onChange={(e) => setFechaLimite(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewProjectForm;
