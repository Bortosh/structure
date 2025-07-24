// MeasureLines.tsx

import { useState, useRef, useEffect } from "react";
import { useTaskStore } from "../../../globalState/taskStorageLegacy";
import { Button } from "../components/ui/botton";
import { ModalSaveLine } from "../../tareas/components/ModalSaveLine"; // modal para pedir nombre

interface MeasureLinesProps {
    map: google.maps.Map;
    idProject: string;
}

export const MeasureLines = ({ map, idProject }: MeasureLinesProps) => {
    const [path, setPath] = useState<google.maps.LatLngLiteral[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const polylineRef = useRef<google.maps.Polyline | null>(null);
    const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);
    const { addTaskLine, taskLines } = useTaskStore();
    console.log("🚀 ~ MeasureLines ~ taskLines:", taskLines)

    useEffect(() => {
        if (!map) return;

        const handleClick = (e: google.maps.MapMouseEvent) => {
            if (!e.latLng || path.length >= 6) return;
            const latLng = e.latLng;

            setPath((prev) => [
                ...prev,
                {
                    lat: latLng.lat(),
                    lng: latLng.lng(),
                }
            ]);
        };

        clickListenerRef.current = map.addListener("click", handleClick);

        return () => {
            clickListenerRef.current?.remove();
        };
    }, [map, path]);


    useEffect(() => {
        if (!map) return;

        if (!polylineRef.current) {
            polylineRef.current = new google.maps.Polyline({
                path,
                strokeColor: "#000000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map,
            });
        } else {
            polylineRef.current.setPath(path);
        }
    }, [path]);

    const handleSave = (name: string) => {
        if (path.length >= 2 && path.length <= 6) {
            addTaskLine({
                id: crypto.randomUUID(),
                idProject: idProject,
                name,
                type: "Line",
                path,
                estado: "pendiente",
                equipos: [],
            });
            reset();
        }
    };

    const reset = () => {
        setPath([]);
        setIsModalOpen(false);
        polylineRef.current?.setMap(null);
        polylineRef.current = null;
    };

    return (
        <>
            {path.length >= 2 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
                    <Button onClick={() => setIsModalOpen(true)}>Guardar línea</Button>
                </div>
            )}
            <ModalSaveLine
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />
        </>
    );
};
