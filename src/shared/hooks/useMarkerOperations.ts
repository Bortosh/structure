
import type { Marker } from "../../componets/project/project-map/types/marker-types";
import type { MarkerType } from "../../componets/project/project-map/map-utils/marker-icons";

interface UseMarkerOperationsProps {
    editingMarker: {
        type: MarkerType;
        index: number;
        latLng: google.maps.LatLng;
    } | null;
    setEditingMarker: (marker: {
        type: MarkerType;
        index: number;
        latLng: google.maps.LatLng;
    } | null) => void;
    txMarkers: Marker[];
    serviceMarkers: Marker[];
    handholeMarkers: Marker[];
    tieInMarkers: Marker[];
    setTxMarkers: (markers: Marker[] | ((prev: Marker[]) => Marker[])) => void;
    setServiceMarkers: (markers: Marker[] | ((prev: Marker[]) => Marker[])) => void;
    setHandholeMarkers: (markers: Marker[] | ((prev: Marker[]) => Marker[])) => void;
    setTieInMarkers: (markers: Marker[] | ((prev: Marker[]) => Marker[])) => void;
    removeTask?: (id: string) => void;
    markerRefs?: {
        txMarkerRefs: React.RefObject<(google.maps.marker.AdvancedMarkerElement | null)[]>;
        serviceMarkerRefs: React.RefObject<(google.maps.marker.AdvancedMarkerElement | null)[]>;
        handholeMarkerRefs: React.RefObject<(google.maps.marker.AdvancedMarkerElement | null)[]>;
        tieInMarkerRefs: React.RefObject<(google.maps.marker.AdvancedMarkerElement | null)[]>;
    };
}

export const useMarkerOperations = ({
    editingMarker,
    setEditingMarker,
    txMarkers,
    serviceMarkers,
    handholeMarkers,
    tieInMarkers,
    setTxMarkers,
    setServiceMarkers,
    setHandholeMarkers,
    setTieInMarkers,
    removeTask,
    markerRefs,
}: UseMarkerOperationsProps) => {

    // Rotate a TX marker (turns it 90 degrees each click)
    const handleRotateMarker = () => {
        if (!editingMarker) return;

        const { index, type } = editingMarker;

        if (type === "TX") {
            setTxMarkers((prev) => {
                const updated = prev.map((marker, i) =>
                    i === index ? { ...marker, rotation: ((marker.rotation || 0) + 90) % 360 } : marker
                );
                return updated;
            });
        }

        setEditingMarker(null);
    };

    // Delete a marker (remove it from the map and list)
    const handleDeleteMarker = () => {
        if (!editingMarker) return;

        const { index, type } = editingMarker;

        // Get marker ID before removing
        let markerId: string | undefined;

        if (type === "TX") {
            markerId = txMarkers[index]?.id;
            setTxMarkers((prev) => prev.filter((_, i) => i !== index));
        }

        if (type === "Service") {
            markerId = serviceMarkers[index]?.id;
            setServiceMarkers((prev) => prev.filter((_, i) => i !== index));
        }

        if (type === "Handhole") {
            markerId = handholeMarkers[index]?.id;
            setHandholeMarkers((prev) => prev.filter((_, i) => i !== index));
        }

        if (type === "TieIn") {
            markerId = tieInMarkers[index]?.id;
            setTieInMarkers((prev) => prev.filter((_, i) => i !== index));
        }

        // Remove the corresponding task
        if (markerId) {
            removeTask?.(markerId);
        }

        setEditingMarker(null);
    };

    // Make a marker draggable (can move it around)
    const handleEnableDragMarker = () => {
        if (!editingMarker || !markerRefs) return;

        const { index, type } = editingMarker;

        // Choose the correct marker refs and update function based on type
        let markerRef: React.RefObject<(google.maps.marker.AdvancedMarkerElement | null)[]>;
        let setMarkersFn: (markers: Marker[] | ((prev: Marker[]) => Marker[])) => void;

        if (type === "TX") {
            markerRef = markerRefs.txMarkerRefs;
            setMarkersFn = setTxMarkers;
        } else if (type === "Service") {
            markerRef = markerRefs.serviceMarkerRefs;
            setMarkersFn = setServiceMarkers;
        } else if (type === "Handhole") {
            markerRef = markerRefs.handholeMarkerRefs;
            setMarkersFn = setHandholeMarkers;
        } else if (type === "TieIn") {
            markerRef = markerRefs.tieInMarkerRefs;
            setMarkersFn = setTieInMarkers;
        } else {
            return;
        }

        // Get the marker element from refs
        const marker = markerRef.current?.[index];
        if (!marker) return;

        // Enable dragging
        marker.gmpDraggable = true;

        // Handle the drag end event
        const handlePointerUp = () => {
            // Disable dragging
            marker.gmpDraggable = false;

            // Remove the listener
            marker.element?.removeEventListener("pointerup", handlePointerUp);

            // Get new position and update state
            const newPosition = marker.position;
            if (!newPosition) return;

            // Extract lat/lng as numbers before updating state
            const newLat = typeof newPosition.lat === 'function' ? newPosition.lat() : newPosition.lat;
            const newLng = typeof newPosition.lng === 'function' ? newPosition.lng() : newPosition.lng;

            setMarkersFn((prevMarkers: Marker[]) =>
                prevMarkers.map((m: Marker, i: number) =>
                    i === index
                        ? {
                            ...m,
                            lat: newLat,
                            lng: newLng,
                        }
                        : m
                )
            );
        };

        // Add the pointer up listener
        marker.element?.addEventListener("pointerup", handlePointerUp);

        // Clear editing state
        setEditingMarker(null);
    };

    return {
        handleRotateMarker,
        handleDeleteMarker,
        handleEnableDragMarker
    };
};

export default useMarkerOperations; 