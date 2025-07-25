// components/RenderTaskLines.tsx
import { useEffect, useRef } from "react";
import { useTaskStore } from "../../../globalState/taskStorageLegacy";

interface Props {
    map: google.maps.Map;
    projectId: string;
}

export const RenderTaskLines = ({ map, projectId }: Props) => {
    const { taskLines } = useTaskStore();
    const polylineRefs = useRef<google.maps.Polyline[]>([]);

    useEffect(() => {
        if (!map) return;

        // Limpiar las líneas anteriores
        polylineRefs.current.forEach((polyline) => polyline.setMap(null));
        polylineRefs.current = [];

        const projectLines = taskLines.filter((line) => line.projectId === projectId);

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
    }, [taskLines, map, projectId]);

    return null;
};
