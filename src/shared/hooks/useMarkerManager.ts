// ✅ Brings in tools we need to run code when the app starts or when data changes.
import { useEffect, useRef } from "react";
// ✅ Brings in the types and icons for the markers on the map.
import { createMarkerIcon } from "../../componets/project/project-map/map-utils/marker-icons";
import type { MarkerType } from '../../componets/project/project-map/map-utils/marker-icons'
import type { Marker } from "../../componets/project/project-map/types/marker-types";

// ✅ This describes the tools and info we give this component.
interface UseMarkerManagerProps {
    mapInstance: google.maps.Map | null; // The actual map we're working with
    txMarkers?: Marker[]; // List of TX markers to show on the map
    serviceMarkers?: Marker[]; // List of Service markers to show
    handholeMarkers?: Marker[]; // List of Handhole markers to show
    tieInMarkers?: Marker[]; // Add new marker array
    editModeRef: React.RefObject<boolean>; // Whether edit mode is on (allows marker edits)
    setEditingMarker: (marker: { // Function to set which marker we're editing
        type: MarkerType;
        index: number;
        latLng: google.maps.LatLng;
    } | null) => void;
    setTxMarkers: (markers: Marker[] | ((prev: Marker[]) => Marker[])) => void; // Function to update TX markers list
    setServiceMarkers: (markers: Marker[] | ((prev: Marker[]) => Marker[])) => void; // Function to update Service markers list
    setHandholeMarkers: (markers: Marker[] | ((prev: Marker[]) => Marker[])) => void; // Function to update Handhole markers list
    setTieInMarkers: (markers: Marker[] | ((prev: Marker[]) => Marker[])) => void; // Add new setter
}

export const useMarkerManager = ({
    mapInstance,
    txMarkers,
    serviceMarkers,
    handholeMarkers,
    tieInMarkers, // Add new prop
    editModeRef,
    setEditingMarker,
    setTxMarkers,
    setServiceMarkers,
    setHandholeMarkers,
    setTieInMarkers, // Add new prop
}: UseMarkerManagerProps) => {
    // ✅ These keep track of all the markers we've placed on the map.
    const txMarkerRefs = useRef<(google.maps.marker.AdvancedMarkerElement | null)[]>([]); // Holds all TX marker elements
    const serviceMarkerRefs = useRef<(google.maps.marker.AdvancedMarkerElement | null)[]>([]); // Holds all Service marker elements
    const handholeMarkerRefs = useRef<(google.maps.marker.AdvancedMarkerElement | null)[]>([]); // Holds all Handhole marker elements
    const tieInMarkerRefs = useRef<(google.maps.marker.AdvancedMarkerElement | null)[]>([]); // Add new ref

    // ✅ These keep track of the marker data (their positions, etc.)
    const txMarkersRef = useRef<Marker[]>(txMarkers || []);
    const serviceMarkersRef = useRef<Marker[]>(serviceMarkers || []);
    const handholeMarkersRef = useRef<Marker[]>(handholeMarkers || []);
    const tieInMarkersRef = useRef<Marker[]>(tieInMarkers || []); // Add new ref

    // Track whether marker operations are in progress to prevent blinking
    const operationInProgressRef = useRef(false);

    // New: Add visibility lock to prevent markers from being detached during form operations
    const visibilityLockRef = useRef(false);

    // Track last timeout to prevent race conditions
    const lastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Track all marker ids to ensure stable references
    const markerIdsRef = useRef(new Set<string>());

    // ✅ Whenever the marker data changes, we update our stored copy.
    useEffect(() => {
        txMarkersRef.current = txMarkers || [];
    }, [txMarkers]);

    useEffect(() => {
        serviceMarkersRef.current = serviceMarkers || [];
    }, [serviceMarkers]);

    useEffect(() => {
        handholeMarkersRef.current = handholeMarkers || [];
    }, [handholeMarkers]);

    useEffect(() => {
        tieInMarkersRef.current = tieInMarkers || [];
    }, [tieInMarkers]);

    // ✅ This function creates or updates a single marker on the map.
    const createOrUpdateMarker = (
        markerData: Marker, // Info about the marker (where it is, its label)
        index: number, // Where this marker is in the list
        markerRefs: React.RefObject<(google.maps.marker.AdvancedMarkerElement | null)[]>, // Where we store the actual marker element
        type: MarkerType, // The marker type (TX, Service, Handhole)
        setMarkers: (markers: Marker[] | ((prev: Marker[]) => Marker[])) => void // Function to update the list of markers
    ) => {
        // ✅ If the map isn't ready, or the marker system isn't ready, stop!
        if (!mapInstance || !window.google?.maps?.marker?.AdvancedMarkerElement) {
            console.warn("Map instance or AdvancedMarkerElement not ready");
            return;
        }

        // Add this marker id to our tracking set
        if (markerData.id) {
            markerIdsRef.current.add(markerData.id);
        }

        // ✅ Grab the marker position
        const lat = markerData.lat;
        const lng = markerData.lng;

        // ✅ See if we've already made this marker before
        let marker = markerRefs.current[index];

        // ✅ If this is a brand new marker, create it!
        if (!marker) {
            // Prevent creating markers during other operations to avoid blinking
            if (operationInProgressRef.current) {
                // Use minimal timeout (1ms) to break call stack but still be fast
                setTimeout(() => {
                    createOrUpdateMarker(markerData, index, markerRefs, type, setMarkers);
                }, 1);
                return;
            }

            // ✅ Make the marker icon (this draws the actual picture you see)
            const iconElement = createMarkerIcon(type, markerData.rotation || 0);
            // ✅ Set up the marker so it works like a button when you click it
            iconElement.style.cursor = "pointer";
            iconElement.setAttribute("role", "button");
            iconElement.setAttribute("aria-label", `Marker for ${markerData.label}`);

            console.log(`[CREATE] New marker of type ${type} at index ${index}`);

            marker = new google.maps.marker.AdvancedMarkerElement({
                map: mapInstance,                    // Put it on the map!
                position: { lat, lng },              // Where to put it
                content: iconElement,                // What the marker looks like
                title: markerData.label,             // Tooltip title when hovering
                gmpDraggable: false,                 // Can't move it (yet)
                gmpClickable: true,                  // You can click on it!
            });

            // ✅ Save this marker so we can use it later
            markerRefs.current[index] = marker;

            // ✅ What happens when you click this marker
            marker.addEventListener("gmp-click", () => {
                console.log(`[CLICK] Marker clicked: ${markerData.label}`);
                // ✅ If we're not in edit mode, do nothing
                if (!editModeRef.current) {
                    console.log(`[SKIP] Edit mode is OFF, ignoring marker click.`);
                    return;
                }
                // ✅ If the marker has no position (weird but possible), warn and skip
                if (!marker?.position) {
                    console.warn('[WARNING] Marker ${markerData.label} has no position!');
                    return;
                }

                const position = marker.position as google.maps.LatLngLiteral;

                console.log(`[ACTION] Setting editing marker: ${markerData.label} at position, position`);

                // ✅ Tell the app that we're editing this marker now
                setEditingMarker({
                    type,
                    index,
                    latLng: new google.maps.LatLng(position.lat, position.lng),
                });
            });
            // ✅ What happens when you drag and drop the marker (if draggable is turned on)
            marker.addEventListener("gmp-dragend", (event: any) => {
                if (!event.latLng) return;

                console.log(`[DRAGEND] Marker dragged: ${markerData.label}`);

                const updatedMarkers =
                    type === "TX"
                        ? [...txMarkersRef.current]
                        : type === "Service"
                            ? [...serviceMarkersRef.current]
                            : type === "Handhole"
                                ? [...handholeMarkersRef.current]
                                : [...tieInMarkersRef.current]; // Add TieIn case

                updatedMarkers[index] = {
                    ...updatedMarkers[index],
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                };

                console.log('[UPDATE] Updating ${type} marker ${markerData.label} position to, updatedMarkers[index]');

                operationInProgressRef.current = true;

                if (type === "TX") {
                    setTxMarkers(updatedMarkers);
                    if (marker) {
                        const rotatedIcon = createMarkerIcon(type, updatedMarkers[index].rotation || 0);
                        marker.content = rotatedIcon;
                    }
                }
                if (type === "Service") setServiceMarkers(updatedMarkers);
                if (type === "Handhole") setHandholeMarkers(updatedMarkers);
                if (type === "TieIn") setTieInMarkers(updatedMarkers); // Add TieIn case

                // Use minimal timeout (5ms) to prevent blinking but avoid race conditions
                setTimeout(() => {
                    operationInProgressRef.current = false;
                }, 5);
            });
        } else {
            // Only update the marker if its position has changed or it's not on the map
            const currentLat = marker.position ? (marker.position as google.maps.LatLngLiteral).lat : null;
            const currentLng = marker.position ? (marker.position as google.maps.LatLngLiteral).lng : null;

            // Position has changed or marker doesn't have a position
            if (currentLat !== lat || currentLng !== lng || !marker.position) {
                marker.position = { lat, lng };
            }

            // Ensure marker is attached to the map if not under visibility lock
            if (!marker.map && !visibilityLockRef.current) {
                marker.map = mapInstance;
            }

            // Update TX marker content only if rotation has changed
            if (type === "TX" && markerData.rotation !== undefined) {
                const rotatedIcon = createMarkerIcon(type, markerData.rotation);

                // Only update content if it's needed to avoid unnecessary redraws
                if (rotatedIcon.innerHTML !== (marker.content as HTMLElement).innerHTML) {
                    marker.content = rotatedIcon;
                }
            }
        }

        // Make sure marker is draggable or not based on edit mode
        marker.gmpDraggable = false;
    };

    // Main effect for managing all markers
    useEffect(() => {
        if (!mapInstance) return;

        // Skip concurrent operations to prevent blinking
        if (operationInProgressRef.current) return;

        operationInProgressRef.current = true;

        // Function to process a set of markers without causing blinking
        const processMarkers = (
            markers: Marker[] | undefined,
            markerRefs: React.RefObject<(google.maps.marker.AdvancedMarkerElement | null)[]>,
            type: MarkerType,
            setMarkers: (markers: Marker[] | ((prev: Marker[]) => Marker[])) => void
        ) => {
            if (!markers || !mapInstance) return;

            // Update existing markers and create new ones
            markers.forEach((markerData, index) => {
                createOrUpdateMarker(markerData, index, markerRefs, type, setMarkers);
            });

            // Remove any extra markers that are no longer needed
            while (markerRefs.current.length > markers.length) {
                const markerToRemove = markerRefs.current.pop();
                if (markerToRemove) {
                    markerToRemove.map = null;
                }
            }

            // Update array length
            markerRefs.current.length = markers.length;
        };

        // Process all marker types with slight delay between each to prevent render conflicts
        const processTxMarkers = () => processMarkers(txMarkers, txMarkerRefs, "TX", setTxMarkers);
        const processServiceMarkers = () => processMarkers(serviceMarkers, serviceMarkerRefs, "Service", setServiceMarkers);
        const processHandholeMarkers = () => processMarkers(handholeMarkers, handholeMarkerRefs, "Handhole", setHandholeMarkers);
        const processTieInMarkers = () => processMarkers(tieInMarkers, tieInMarkerRefs, "TieIn", setTieInMarkers);

        processTxMarkers();
        processServiceMarkers();
        processHandholeMarkers();
        processTieInMarkers();

        // Release the operation lock with minimal delay (5ms)
        setTimeout(() => {
            operationInProgressRef.current = false;
        }, 5);

        // If we have a visibility lock, don't run the final visibility check
        if (visibilityLockRef.current) return;

        // Cancel any existing timeout to prevent race conditions
        if (lastTimeoutRef.current) {
            clearTimeout(lastTimeoutRef.current);
        }

        // Run visibility check with minimal delay (5ms)
        lastTimeoutRef.current = setTimeout(() => {
            if (!visibilityLockRef.current) {
                ensureAllMarkersVisible();
            }
            lastTimeoutRef.current = null;
        }, 5);

        return () => {
            if (lastTimeoutRef.current) {
                clearTimeout(lastTimeoutRef.current);
            }
        };
    }, [
        mapInstance,
        txMarkers,
        serviceMarkers,
        handholeMarkers,
        tieInMarkers,
        setTxMarkers,
        setServiceMarkers,
        setHandholeMarkers,
        setTieInMarkers
    ]);

    // Simple function to ensure all markers are visible - can be called from outside
    const ensureAllMarkersVisible = () => {
        if (!mapInstance) return;

        // Set visibility lock to prevent multiple rapid operations
        visibilityLockRef.current = true;

        // Attach all markers to the map
        const attachMarkers = (refs: React.RefObject<(google.maps.marker.AdvancedMarkerElement | null)[]>) => {
            if (!refs.current) return;
            refs.current.forEach(marker => {
                if (marker && !marker.map) {
                    marker.map = mapInstance;
                }
            });
        };

        attachMarkers(txMarkerRefs);
        attachMarkers(serviceMarkerRefs);
        attachMarkers(handholeMarkerRefs);
        attachMarkers(tieInMarkerRefs);

        // Release visibility lock with minimal delay (5ms)
        setTimeout(() => {
            visibilityLockRef.current = false;
        }, 5);
    };

    // ✅ Return the references to all markers, so we can use them elsewhere
    return {
        markerRefs: {
            txMarkerRefs,
            serviceMarkerRefs,
            handholeMarkerRefs,
            tieInMarkerRefs,
        },
        ensureAllMarkersVisible
    };
};

export default useMarkerManager;