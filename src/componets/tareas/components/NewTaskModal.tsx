import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";

export default function NewTaskModal({ open, onClose, onSubmit }: any) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [estado, setEstado] = useState("Not Started");
    const [fechaLimite, setFechaLimite] = useState("");
    const [responsable, setResponsable] = useState("");

    const handleSubmit = () => {
        onSubmit({
            id: Date.now().toString(),
            nombre,
            descripcion,
            estado,
            fechaLimite,
            responsable
        });
        onClose();
        setNombre("");
        setDescripcion("");
        setEstado("No iniciada");
        setFechaLimite("");
        setResponsable("");
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create New Task</DialogTitle>
            <DialogContent className="flex flex-col gap-4">
                <TextField label="Name" value={nombre} onChange={e => setNombre(e.target.value)} fullWidth />
                <TextField label="Description" value={descripcion} onChange={e => setDescripcion(e.target.value)} fullWidth />
                <TextField label="Assignee" value={responsable} onChange={e => setResponsable(e.target.value)} fullWidth />
                <TextField type="date" label="Deadline" value={fechaLimite} onChange={e => setFechaLimite(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
                <TextField select label="Status" value={estado} onChange={e => setEstado(e.target.value)} fullWidth>
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}
