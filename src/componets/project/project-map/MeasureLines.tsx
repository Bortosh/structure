// MeasureLines.tsx

import { useState, useRef, useEffect } from "react";
import { useTaskStore } from "../../../globalState/taskStorageLegacy";
import { Button } from "../components/ui/botton";
import { CreateTaskLineWrapperModal } from "../../task/ui/CreateTaskLineWrapperModal";
import type { TaskLineData } from "./types/task-types";

interface MeasureLinesProps {
    map: google.maps.Map;
    projectId: string;
}

export const MeasureLines = ({ map, projectId }: MeasureLinesProps) => {
    const [path, setPath] = useState<google.maps.LatLngLiteral[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const polylineRef = useRef<google.maps.Polyline | null>(null);
    const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);
    const { addTaskLine, taskLines, tasks } = useTaskStore();
    console.log("🚀 ~ MeasureLines ~ task:", tasks)
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

    const handleSave = (data: TaskLineData) => {
        if (path.length >= 2 && path.length <= 6) {
            addTaskLine({
                id: data.id,
                name: data.name,
                type: "Line",
                projectId,
                path,
                status: "active",
                teamsToTaskLine: [],
                cableType: data.cableType,
                typeLine: data.type,
                pointAName: data.pointAName,
                pointBName: data.pointBName,
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

    const getMidpoint = (): google.maps.LatLng => {
        if (path.length < 2) {
            const fallback = path[0] || { lat: 0, lng: 0 };
            return new google.maps.LatLng(fallback.lat, fallback.lng);
        }

        const first = path[0];
        const last = path[path.length - 1];

        const midpointLat = (first.lat + last.lat) / 2;
        const midpointLng = (first.lng + last.lng) / 2;

        return new google.maps.LatLng(midpointLat, midpointLng);
    };


    return (
        <>
            {path.length >= 2 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
                    <Button onClick={() => setIsModalOpen(true)}>Save Line</Button>
                </div>
            )}
            <CreateTaskLineWrapperModal
                isOpen={isModalOpen}
                id={crypto.randomUUID()}
                midpoint={getMidpoint()}
                onSubmit={handleSave}
                onCancel={reset}
                onTypeChange={() => { }}
            />
        </>
    );
};
