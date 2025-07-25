// components/RenderTaskMarkers.tsx
import { useEffect, useRef } from "react";
import { useTaskStore } from "../../../globalState/taskStorageLegacy";

interface Props {
    map: google.maps.Map;
    projectId: string;
}

export const RenderTaskMarkers = ({ map, projectId }: Props) => {
    const { tasks } = useTaskStore();
    const markerRefs = useRef<google.maps.Marker[]>([]);

    useEffect(() => {
        if (!map) return;

        // Eliminar marcadores anteriores
        markerRefs.current.forEach(marker => marker.setMap(null));
        markerRefs.current = [];

        const projectTasks = tasks.filter(task => task.idProject === projectId);

        projectTasks.forEach(task => {
            const marker = new google.maps.Marker({
                map,
                position: { lat: task.lat, lng: task.lng },
                title: task.name,
                //icon: getIconByType(task.type), // si quieres íconos personalizados
            });

            markerRefs.current.push(marker);
        });
    }, [map, tasks, projectId]);

    return null;
};
