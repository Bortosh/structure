import { useParams } from "react-router-dom";
import { useState } from "react";
import {
    GoogleMap,
    Marker,
    InfoWindow,
    Polyline,
    useJsApiLoader,
} from "@react-google-maps/api";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    Card,
    CardContent,
    IconButton,
    FormControl,
    MenuItem
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";

const containerStyle = {
    width: "100%",
    height: "60vh",
    minHeight: "300px",
};

const center = {
    lat: 3.4516,
    lng: -76.5320,
};

const iconosMarcador: Record<string, string> = {
    rojo: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    azul: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    verde: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    naranja: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
};

interface Accion {
    id: string;
    tipo: "marker" | "line";
    nombre: string;
    descripcion: string;
    lat?: number;
    lng?: number;
    path?: { lat: number; lng: number }[];
    icon?: string;
    color?: string | undefined;
}


const coloresCSS: Record<"rojo" | "azul" | "verde" | "naranja", string> = {
    rojo: "red",
    azul: "blue",
    verde: "green",
    naranja: "orange",
};

export default function TaskDetailContainer() {
    const { projectId, taskId } = useParams();
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
    console.log("🚀 ~ TaskDetailContainer ~ mapInstance:", mapInstance)
    const [acciones, setAcciones] = useState<Accion[]>([]);
    const [selectedLatLng, setSelectedLatLng] = useState<{
        lat: number;
        lng: number;
        color?: string;
    } | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [selectedAccion, setSelectedAccion] = useState<Accion | null>(null);
    const [drawingMode, setDrawingMode] = useState<"marker" | "line">("marker");
    const [linePath, setLinePath] = useState<{ lat: number; lng: number }[]>([]);
    const [colorSeleccionado, setColorSeleccionado] = useState("rojo");

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    });

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        const clickedPoint = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        };

        if (drawingMode === "marker") {
            setSelectedLatLng({ ...clickedPoint, color: colorSeleccionado });
            setOpenDialog(true);
        } else if (drawingMode === "line") {
            setLinePath((prev) => [...prev, clickedPoint]);
        }
    };

    const handleGuardarAccion = () => {
        if (!selectedLatLng) return;

        const nuevaAccion: Accion = {
            id: uuidv4(),
            tipo: "marker",
            nombre,
            descripcion,
            lat: selectedLatLng.lat,
            lng: selectedLatLng.lng,
            icon: iconosMarcador[selectedLatLng.color || "rojo"],
            color: colorSeleccionado,
        };

        setAcciones((prev) => [...prev, nuevaAccion]);
        setNombre("");
        setDescripcion("");
        setSelectedLatLng(null);
        setOpenDialog(false);
    };

    const guardarLineaComoAccion = () => {
        if (linePath.length < 2) return;

        const nuevaAccion: Accion = {
            id: uuidv4(),
            tipo: "line",
            nombre: "Drawn Line",
            descripcion: `Line with ${linePath.length} points`,
            path: [...linePath],
        };

        setAcciones((prev) => [...prev, nuevaAccion]);
        setLinePath([]);
    };

    const eliminarAccion = (id: string) => {
        setAcciones((prev) => prev.filter((a) => a.id !== id));
        setSelectedAccion(null);
    };

    const guardarAccionesEnTarea = () => {
        console.log("Acciones guardadas para la tarea", taskId, acciones);
        // Aquí puedes hacer un dispatch a Zustand o actualizar tu backend
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Actions for Task {taskId} of Project {projectId}
                </h2>
                <div className="flex flex-wrap gap-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                        <Button className="sm:col-span-2 md:col-span-1" variant="outlined" onClick={() => window.history.back()}>
                            Back
                        </Button>
                        <FormControl size="small" className="sm:col-span-2 md:col-span-1">
                            <TextField
                                label="Marker Type"
                                value={colorSeleccionado}
                                onChange={(e) => setColorSeleccionado(e.target.value)}
                                select
                                size="small"
                                sx={{ minWidth: 160, backgroundColor: "white" }}
                            >
                                <MenuItem value="rojo">
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: 12,
                                            height: 12,
                                            borderRadius: "50%",
                                            backgroundColor: "red",
                                            marginRight: 8,
                                        }}
                                    ></span>
                                    Red Marker
                                </MenuItem>
                                <MenuItem value="azul">
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: 12,
                                            height: 12,
                                            borderRadius: "50%",
                                            backgroundColor: "blue",
                                            marginRight: 8,
                                        }}
                                    ></span>
                                    Blue Marker
                                </MenuItem>
                                <MenuItem value="verde">
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: 12,
                                            height: 12,
                                            borderRadius: "50%",
                                            backgroundColor: "green",
                                            marginRight: 8,
                                        }}
                                    ></span>
                                    Green Marker
                                </MenuItem>
                                <MenuItem value="naranja">
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: 12,
                                            height: 12,
                                            borderRadius: "50%",
                                            backgroundColor: "orange",
                                            marginRight: 8,
                                        }}
                                    ></span>
                                    Orange Marker
                                </MenuItem>
                            </TextField>
                        </FormControl>
                        <Button
                            variant={drawingMode === "marker" ? "contained" : "outlined"}
                            onClick={() => setDrawingMode("marker")}
                        >
                            Add Marker
                        </Button>
                        <Button
                            variant={drawingMode === "line" ? "contained" : "outlined"}
                            onClick={() => setDrawingMode("line")}
                        >
                            Draw Line
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => setLinePath([])}>
                            Clear All Lines
                        </Button>
                        <Button variant="outlined" onClick={guardarLineaComoAccion}>
                            Save Line
                        </Button>
                    </div>
                </div>
            </div>
            {isLoaded ? (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={14}
                    onLoad={(map) => setMapInstance(map)}
                    onClick={handleMapClick}
                >
                    {acciones
                        .filter((a) => a.tipo === "marker")
                        .map((accion) => (
                            <Marker
                                key={accion.id}
                                position={{ lat: accion.lat!, lng: accion.lng! }}
                                icon={accion.icon}
                                onClick={() => setSelectedAccion(accion)}
                            />
                        ))}

                    {selectedAccion && selectedAccion.tipo === "marker" && (
                        <InfoWindow
                            position={{ lat: selectedAccion.lat!, lng: selectedAccion.lng! }}
                            onCloseClick={() => setSelectedAccion(null)}
                        >
                            <div>
                                <h4 className="font-bold mb-1">{selectedAccion.nombre}</h4>
                                <p className="text-sm mb-2">{selectedAccion.descripcion}</p>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => eliminarAccion(selectedAccion.id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </InfoWindow>
                    )}

                    {acciones
                        .filter((a) => a.tipo === "line")
                        .map((accion) => (
                            <Polyline
                                key={accion.id}
                                path={accion.path!}
                                options={{
                                    strokeColor: "#3b82f6",
                                    strokeOpacity: 0.8,
                                    strokeWeight: 3,
                                }}
                            />
                        ))}

                    {linePath.length > 1 && (
                        <Polyline
                            path={linePath}
                            options={{
                                strokeColor: "#10b981",
                                strokeOpacity: 0.6,
                                strokeWeight: 2,
                                // strokeDasharray no es válido aquí
                            }}
                        />
                    )}
                </GoogleMap>
            ) : (
                <p className="text-center text-gray-600">Loading Map...</p>
            )}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Register Action</DialogTitle>
                <DialogContent className="flex flex-col gap-4 pt-4">
                    <TextField
                        label="Name"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleGuardarAccion} variant="contained">
                        Save Action
                    </Button>
                </DialogActions>
            </Dialog>

            <div className="mt-6">
                <Typography variant="h6" gutterBottom>
                    Registered Actions
                </Typography>
                {acciones.length === 0 ? (
                    <p className="text-sm text-gray-600">No actions registered.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {acciones.map((accion) => (
                            <Card key={accion.id} className="bg-white shadow-sm">
                                <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        {accion.tipo === "marker" && (
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="w-5 h-5 rounded-full border border-gray-300"
                                                    style={{
                                                        backgroundColor:
                                                            accion.color && (Object.keys(coloresCSS) as string[]).includes(accion.color)
                                                                ? coloresCSS[accion.color as keyof typeof coloresCSS]
                                                                : "#6b7280",
                                                    }}
                                                />
                                                <span className="text-xs capitalize text-gray-600">
                                                    {accion.color}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <Typography variant="subtitle1">
                                                {accion.nombre} ({accion.tipo})
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {accion.descripcion}
                                            </Typography>
                                        </div>
                                    </div>
                                    <IconButton onClick={() => eliminarAccion(accion.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                <div className="mt-4">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={guardarAccionesEnTarea}
                        disabled={acciones.length === 0}
                    >
                        Save Actions to Task
                    </Button>
                </div>
            </div>
        </div>
    );
}
