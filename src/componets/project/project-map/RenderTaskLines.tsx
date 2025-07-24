// components/RenderTaskLines.tsx
import { useEffect, useRef } from "react";
import { useTaskStore } from "../../../globalState/taskStorageLegacy";

interface Props {
    map: google.maps.Map;
    idProject: string;
}

export const RenderTaskLines = ({ map, idProject }: Props) => {
    const { taskLines } = useTaskStore();
    const polylineRefs = useRef<google.maps.Polyline[]>([]);

    useEffect(() => {
        if (!map) return;

        // Limpiar las líneas anteriores
        polylineRefs.current.forEach((polyline) => polyline.setMap(null));
        polylineRefs.current = [];

        const projectLines = taskLines.filter((line) => line.idProject === idProject);

        projectLines.forEach((line) => {
            const polyline = new google.maps.Polyline({
                path: line.path,
                strokeColor: "#2E86DE",
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map,
            });
            polylineRefs.current.push(polyline);
        });
    }, [taskLines, map, idProject]);

    return null; // No renderiza nada visualmente en React, solo en el mapa
};
