import { useEffect, useRef } from "react";
import { useTaskStore } from "../../../globalState/taskStorageLegacy";

interface Props {
    map: google.maps.Map;
    projectId: string;
}

export const RenderTaskLines = ({ map, projectId }: Props) => {
    const { taskLines } = useTaskStore();
    const polylineRefs = useRef<google.maps.Polyline[]>([]);
    const circleRefs = useRef<google.maps.Circle[]>([]);
    const markerRefs = useRef<google.maps.Marker[]>([]);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

    useEffect(() => {
        if (!map) return;

        // Limpiar anteriores
        polylineRefs.current.forEach((polyline) => polyline.setMap(null));
        circleRefs.current.forEach((circle) => circle.setMap(null));
        markerRefs.current.forEach((marker) => marker.setMap(null));
        polylineRefs.current = [];
        circleRefs.current = [];
        markerRefs.current = [];

        const projectLines = taskLines.filter((line) => line.projectId === projectId);

        if (!infoWindowRef.current) {
            infoWindowRef.current = new google.maps.InfoWindow();
        }

        projectLines.forEach((line) => {
            const polyline = new google.maps.Polyline({
                path: line.path,
                strokeColor: "#2E86DE",
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map,
            });
            polylineRefs.current.push(polyline);

            // Tooltip enriquecido
            polyline.addListener("mouseover", (e: google.maps.MapMouseEvent) => {
                if (!e.latLng) return;

                const content = `
                    <div style="font-size: 14px;">
                        <strong>${line.name}</strong><br/>
                        <em>${line.typeLine} / ${line.cableType}</em><br/>
                        A: ${line.pointAName || "N/A"}<br/>
                        B: ${line.pointBName || "N/A"}
                    </div>
                `;

                infoWindowRef.current!.setContent(content);
                infoWindowRef.current!.setPosition(e.latLng);
                infoWindowRef.current!.open(map);

                polyline.setOptions({ strokeColor: "#F39C12", strokeWeight: 3 });
            });

            polyline.addListener("mouseout", () => {
                infoWindowRef.current!.close();
                polyline.setOptions({ strokeColor: "#2E86DE", strokeWeight: 2 });
            });

            // Círculos sobre puntos
            line.path.forEach((point) => {
                const circle = new google.maps.Circle({
                    map,
                    center: point,
                    radius: 2,
                    fillColor: "#34d399",
                    fillOpacity: 0.6,
                    strokeColor: "#34d399",
                    strokeWeight: 1,
                    strokeOpacity: 0.8,
                });
                circleRefs.current.push(circle);
            });

            // 🅰️🅱️ Marcadores de punto A y B
            if (line.path.length >= 2) {
                const markerA = new google.maps.Marker({
                    map,
                    position: line.path[0],
                    label: {
                        text: "A",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "14px"
                    },
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 6,
                        fillColor: "#3498db",
                        fillOpacity: 1,
                        strokeWeight: 1,
                        strokeColor: "white"
                    }
                });

                const markerB = new google.maps.Marker({
                    map,
                    position: line.path[line.path.length - 1],
                    label: {
                        text: "B",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "14px"
                    },
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 6,
                        fillColor: "#e74c3c",
                        fillOpacity: 1,
                        strokeWeight: 1,
                        strokeColor: "white"
                    }
                });

                markerRefs.current.push(markerA, markerB);
            }
        });

        return () => {
            polylineRefs.current.forEach((polyline) => polyline.setMap(null));
            circleRefs.current.forEach((circle) => circle.setMap(null));
            markerRefs.current.forEach((marker) => marker.setMap(null));
            infoWindowRef.current?.close();
        };
    }, [taskLines, map, projectId]);

    return null;
};
