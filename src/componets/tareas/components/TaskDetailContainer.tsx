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
    height: "500px",
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
    tipo: "marcador" | "linea";
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
            tipo: "marcador",
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
            tipo: "linea",
            nombre: "Línea trazada",
            descripcion: `Línea con ${linePath.length} puntos`,
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
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className="text-xl font-semibold text-gray-800">
                    Acciones para la Tarea {taskId} del Proyecto {projectId}
                </h2>
                <div className="flex gap-2 flex-wrap items-center">
                    <Button variant="outlined" onClick={() => window.history.back()}>
                        Volver
                    </Button>
                    <FormControl size="small">
                        <TextField
                            label="Tipo de Marcador"
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
                                Marcador Rojo
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
                                Marcador Azul
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
                                Marcador Verde
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
                                Marcador Naranja
                            </MenuItem>
                        </TextField>
                    </FormControl>
                    <Button
                        variant={drawingMode === "marker" ? "contained" : "outlined"}
                        onClick={() => setDrawingMode("marker")}
                    >
                        Añadir Marcador
                    </Button>
                    <Button
                        variant={drawingMode === "line" ? "contained" : "outlined"}
                        onClick={() => setDrawingMode("line")}
                    >
                        Trazar Línea
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => setLinePath([])}>
                        Limpiar Todas las Líneas
                    </Button>
                    <Button variant="outlined" onClick={guardarLineaComoAccion}>
                        Guardar Línea
                    </Button>
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
                        .filter((a) => a.tipo === "marcador")
                        .map((accion) => (
                            <Marker
                                key={accion.id}
                                position={{ lat: accion.lat!, lng: accion.lng! }}
                                icon={accion.icon}
                                onClick={() => setSelectedAccion(accion)}
                            />
                        ))}

                    {selectedAccion && selectedAccion.tipo === "marcador" && (
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
                                    Eliminar
                                </Button>
                            </div>
                        </InfoWindow>
                    )}

                    {acciones
                        .filter((a) => a.tipo === "linea")
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
                <p className="text-center text-gray-600">Cargando mapa...</p>
            )}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Registrar Acción</DialogTitle>
                <DialogContent className="flex flex-col gap-4 pt-4">
                    <TextField
                        label="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={handleGuardarAccion} variant="contained">
                        Guardar Acción
                    </Button>
                </DialogActions>
            </Dialog>

            <div className="mt-6">
                <Typography variant="h6" gutterBottom>
                    Acciones Registradas
                </Typography>
                {acciones.length === 0 ? (
                    <p className="text-sm text-gray-600">No hay acciones registradas.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {acciones.map((accion) => (
                            <Card key={accion.id} className="bg-white shadow-sm">
                                <CardContent className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        {accion.tipo === "marcador" && (
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
                        Guardar Acciones en la Tarea
                    </Button>
                </div>
            </div>
        </div>
    );
}
