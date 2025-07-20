import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Checkbox, ListItemText, Typography } from "@mui/material";

export default function AssignTeamsModal({ open, onClose, teams, tarea, equiposAsignados, onSave } : any) {
    const [selectedEquipos, setSelectedEquipos] = useState(equiposAsignados);

    useEffect(() => {
        setSelectedEquipos(equiposAsignados);
    }, [equiposAsignados]);

    const handleChange = (event : any) => {
        const value = event.target.value;
        setSelectedEquipos(typeof value === 'string' ? value.split(',') : value);
    };

    const handleSave = () => {
        onSave(selectedEquipos);
        onClose();
    };

    const renderEquipoNombre = (id:any) => {
        const equipo = teams.find((e:any) => e.id === id);
        return equipo ? equipo.nombre : id;
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Assign Teams to Task</DialogTitle>
            <DialogContent className="flex flex-col gap-4 mt-4">
                <Typography variant="subtitle1">{tarea.nombre}</Typography>
                <Typography variant="body2">Assignee: {tarea.responsable}</Typography>
                <Typography variant="body2">Deadline: {tarea.fechaLimite}</Typography>

                <FormControl fullWidth>
                    <InputLabel id="equipos-multiple-checkbox-label">Teams</InputLabel>
                    <Select
                        labelId="equipos-multiple-checkbox-label"
                        multiple
                        value={selectedEquipos}
                        onChange={handleChange}
                        input={<OutlinedInput label="Equipos" />}
                        renderValue={(selected) => selected.map(renderEquipoNombre).join(", ")}
                    >
                        {teams.map((equipo:any) => (
                            <MenuItem key={equipo.id} value={equipo.id}>
                                <Checkbox checked={selectedEquipos.indexOf(equipo.id) > -1} />
                                <ListItemText primary={equipo.nombre} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <div>
                    <Typography variant="subtitle2">Assigned Teams:</Typography>
                    {selectedEquipos.map((id:any) => (
                        <Typography key={id} variant="body2">• {renderEquipoNombre(id)}</Typography>
                    ))}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Assign</Button>
            </DialogActions>
        </Dialog>
    );
}
