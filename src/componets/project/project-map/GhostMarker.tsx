"use client";

import { useEffect, useRef } from "react";

interface GhostMarkerProps {
    position: { lat: number; lng: number };
    mapInstance: google.maps.Map | null;
}

const GhostMarker: React.FC<GhostMarkerProps> = ({ position, mapInstance }) => {
    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mapInstance) {
            console.warn("[GhostMarker] mapInstance is null. Delaying marker creation.");
            return;
        }

        if (!window.google?.maps?.marker?.AdvancedMarkerElement) {
            console.warn("[GhostMarker] AdvancedMarkerElement is unavailable.");
            return;
        }

        // Create the ghost marker DOM element
        const ghostDiv = document.createElement("div");
        ghostDiv.style.width = "24px";
        ghostDiv.style.height = "24px";
        ghostDiv.style.borderRadius = "50%";
        ghostDiv.style.background = "rgba(16, 185, 129, 0.5)"; // green-500 opacity-50
        ghostDiv.style.border = "2px solid white";
        ghostDiv.style.boxShadow = "0 0 4px rgba(0, 0, 0, 0.3)";
        ghostDiv.style.pointerEvents = "none"; // Avoids it blocking map clicks

        divRef.current = ghostDiv;

        const marker = new window.google.maps.marker.AdvancedMarkerElement({
            map: mapInstance,
            position,
            content: ghostDiv,
        });

        markerRef.current = marker;

        console.log("[GhostMarker] Marker added to map:", marker);

        return () => {
            console.log("[GhostMarker] Cleaning up marker.");
            marker.map = null;
        };
    }, [mapInstance]); // Only runs when mapInstance is defined (prevents early run)

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.position = position;
        }
    }, [position]);

    return null;
};

export default GhostMarker;
