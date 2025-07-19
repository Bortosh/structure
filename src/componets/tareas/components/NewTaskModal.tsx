import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";

export default function NewTaskModal({ open, onClose, onSubmit }:any) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [estado, setEstado] = useState("No iniciada");
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
            <DialogTitle>Crear Nueva Tarea</DialogTitle>
            <DialogContent className="flex flex-col gap-4">
                <TextField label="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} fullWidth />
                <TextField label="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} fullWidth />
                <TextField label="Responsable" value={responsable} onChange={e => setResponsable(e.target.value)} fullWidth />
                <TextField type="date" label="Fecha Límite" value={fechaLimite} onChange={e => setFechaLimite(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
                <TextField select label="Estado" value={estado} onChange={e => setEstado(e.target.value)} fullWidth>
                    <MenuItem value="No iniciada">No iniciada</MenuItem>
                    <MenuItem value="En progreso">En progreso</MenuItem>
                    <MenuItem value="Completada">Completada</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
            </DialogActions>
        </Dialog>
    );
}
