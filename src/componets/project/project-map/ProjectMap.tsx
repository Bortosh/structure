
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// Map Components
import MapToolbar from "./MapToolbar";
import MarkerPopoverOverlay from "./MarkerPopoverOverlay";
import GhostMarker from "./GhostMarker";
import MarkerForm from "./MarkerForm";
import type { MarkerFormData } from './MarkerForm'
import LineSegmentFormPopover from "./LineSegmentFormPopover";

// Types and Utilities
import type { Marker } from "./types/marker-types";
import type { Task } from "./types/task-types";
import type { MarkerType } from "./map-utils/marker-icons";

// Hooks
import useMapLoader from "../../../shared/hooks/useMapLoader";
import useMarkerManager from "../../../shared/hooks/useMarkerManager";
import { useMapTools } from "../../../shared/hooks/useMapTools";
import { useMarkerOperations } from "../../../shared/hooks/useMarkerOperations";
import { useLineAnnotation } from "../../../shared/hooks/useLineAnnotation";


// Import MarkerClusterer
import { MarkerClusterer } from "../project-map//map-utils/marker-clusterer";
import { MeasureLines } from "./MeasureLines";
import { RenderTaskLines } from "./RenderTaskLines";
import { RenderTaskMarkers } from "./RenderTaskMarkers";

interface ProjectMapProps {
    projectId: string;
    txMarkers: Marker[];
    serviceMarkers: Marker[];
    handholeMarkers: Marker[];
    tieInMarkers: Marker[];
    setTxMarkers: (markers: Marker[] | ((prev: Marker[]) => Marker[])) => void;
    setServiceMarkers: (markers: Marker[] | ((prev: Marker[]) => Marker[])) => void;
    setHandholeMarkers: (markers: Marker[] | ((prev: Marker[]) => Marker[])) => void;
    setTieInMarkers: (markers: Marker[] | ((prev: Marker[]) => Marker[])) => void;
    setTasks?: (task: Task) => void;
    removeTask?: (id: string) => void;
    selectedLocation?: { lat: number; lng: number } | null;
}

const ProjectMap: React.FC<ProjectMapProps> = ({
    projectId,
    txMarkers,
    serviceMarkers,
    handholeMarkers,
    tieInMarkers,
    setTxMarkers,
    setServiceMarkers,
    setHandholeMarkers,
    setTieInMarkers,
    setTasks,
    removeTask,
    selectedLocation,
}) => {
    // Refs to keep track of mode changes
    const editModeRef = useRef(false);
    const dropModeRef = useRef<MarkerType | null>(null);

    // Helper function to disable marker dragging
    const disableAllMarkersDraggable = () => {
        const disableArrayMarkers = (markersRef: React.RefObject<(google.maps.marker.AdvancedMarkerElement | null)[]>) => {
            if (!markersRef?.current) return;
            markersRef.current.forEach((marker) => {
                if (marker && marker.gmpDraggable) {
                    marker.gmpDraggable = false;
                }
            });
        };

        if (markerRefs) {
            disableArrayMarkers(markerRefs.txMarkerRefs);
            disableArrayMarkers(markerRefs.serviceMarkerRefs);
            disableArrayMarkers(markerRefs.handholeMarkerRefs);
            disableArrayMarkers(markerRefs.tieInMarkerRefs);

            // Ensure markers remain visible after disabling dragging - remove delay
            ensureAllMarkersVisible();
        }
    };

    // Map tools state (extracted into custom hook)
    const {
        showToolbar,
        setShowToolbar,
        editMode,
        setEditMode,
        dropMode,
        setDropMode,
        measureDistanceMode,
        setMeasureDistanceMode,
        resetTools,
        // resetToolsExceptAnnotation
    } = useMapTools({
        editModeRef,
        dropModeRef,
        onReset: disableAllMarkersDraggable
    });

    // Map interaction state
    const [ghostPosition, setGhostPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [editingMarker, setEditingMarker] = useState<{
        type: MarkerType;
        index: number;
        latLng: google.maps.LatLng;
    } | null>(null);
    // const [draggableMarkerKey, setDraggableMarkerKey] = useState<string | null>(null);

    // Form state for new markers
    const [teamsToTask, setTeamsToTask] = useState(['Fisrt Team', 'Second Team'])
    console.log("🚀 ~ ProjectMap ~ setTeamsToTask:", setTeamsToTask)

    // Estado para trazado de línea
    const [linePath, setLinePath] = useState<google.maps.LatLngLiteral[]>([]);
    const [isLineModalOpen, setIsLineModalOpen] = useState(false);

    const [newMarkerFormInfo, setNewMarkerFormInfo] = useState<{
        projectId: string
        teamsToTask: string[]
        id: string;
        lat: number;
        lng: number;
        type: MarkerType;
    } | null>(null);

    // Add state for measurements
    const measurementsRef = useRef<{
        polyline: google.maps.Polyline;
        path: google.maps.MVCArray<google.maps.LatLng>;
        segmentTypes: Map<string, "Primary" | "Secondary">;
    }[]>([]);

    // Create a ref to store the latest type callback
    const latestTypeCallbackRef = useRef<((type: "Primary" | "Secondary") => void) | null>(null);

    // Function to generate segment ID
    const generateSegmentId = (pointA: google.maps.LatLng, pointB: google.maps.LatLng) => {
        const [a, b] = [
            `${pointA.lat().toFixed(5)},${pointA.lng().toFixed(5)}`,
            `${pointB.lat().toFixed(5)},${pointB.lng().toFixed(5)}`,
        ].sort();
        return `${a}_${b}`;
    };

    // Function to update line color
    const updateLineColor = (measurement: {
        polyline: google.maps.Polyline;
        segmentTypes: Map<string, "Primary" | "Secondary">;
    }, segmentId: string, type?: "Primary" | "Secondary") => {
        if (type) {
            measurement.segmentTypes.set(segmentId, type);
        } else {
            measurement.segmentTypes.delete(segmentId);
        }

        // Update the polyline color
        const color = type === "Primary" ? "#000000" : type === "Secondary" ? "#0000FF" : "#FF0000";
        measurement.polyline.setOptions({ strokeColor: color });
    };

    // Map click handler
    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        if (!event.latLng) return;

        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const currentDropMode = dropModeRef.current;

        if (!currentDropMode) {
            setEditingMarker(null);
            return;
        }

        const newId = uuidv4();
        const newMarker: Marker = {
            id: newId,
            lat,
            lng,
            label: `${currentDropMode}-${projectId || "proj"}`,
            rotation: 0,
        };

        if (currentDropMode === "TX") setTxMarkers(prev => [...prev, newMarker]);
        if (currentDropMode === "Service") setServiceMarkers(prev => [...prev, newMarker]);
        if (currentDropMode === "Handhole") setHandholeMarkers(prev => [...prev, newMarker]);
        if (currentDropMode === "TieIn") setTieInMarkers(prev => [...prev, newMarker]);

        setDropMode(null);
        setNewMarkerFormInfo({
            projectId,
            teamsToTask,
            id: newId,
            lat,
            lng,
            type: currentDropMode,
        });

        document.body.style.cursor = "default";
        setEditingMarker(null);
    };

    // Map and placesSearch setup
    const { mapContainerRef, mapInstance } = useMapLoader(handleMapClick);

    // Add a ref to keep track of the marker manager instance
    const markerManagerRef = useRef<{ ensureAllMarkersVisible: () => void } | null>(null);

    // Marker management
    const {
        markerRefs,
        ensureAllMarkersVisible
    } = useMarkerManager({
        mapInstance,
        txMarkers,
        serviceMarkers,
        handholeMarkers,
        tieInMarkers,
        editModeRef,
        setEditingMarker,
        setTxMarkers,
        setServiceMarkers,
        setHandholeMarkers,
        setTieInMarkers,
    });

    // Store marker manager reference for later use
    useEffect(() => {
        markerManagerRef.current = {
            ensureAllMarkersVisible
        };
    }, [ensureAllMarkersVisible]);

    // Create a ref for marker clusterer
    const markerClusterer = useRef<MarkerClusterer | null>(null);

    // Initialize marker clustering
    useEffect(() => {
        if (mapInstance && markerRefs.txMarkerRefs.current &&
            markerRefs.serviceMarkerRefs.current &&
            markerRefs.handholeMarkerRefs.current &&
            markerRefs.tieInMarkerRefs.current) {
            let markers: google.maps.marker.AdvancedMarkerElement[] = [];

            // Collect all markers from different refs
            [...markerRefs.txMarkerRefs.current,
            ...markerRefs.serviceMarkerRefs.current,
            ...markerRefs.handholeMarkerRefs.current,
            ...markerRefs.tieInMarkerRefs.current].forEach(marker => {
                if (marker) {
                    markers.push(marker);
                }
            });

            markerClusterer.current = new MarkerClusterer({
                map: mapInstance,
                markers: markers,
            });

            // Ensure all markers are visible initially
            if (markerManagerRef.current) {
                markerManagerRef.current.ensureAllMarkersVisible();
            }
        }
    }, [mapInstance, markerRefs, markerManagerRef]);

    // Marker operations (rotateMarker, deleteMarker, enableDragMarker)
    const { handleRotateMarker, handleDeleteMarker, handleEnableDragMarker } = useMarkerOperations({
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
        markerRefs: markerRefs,
    });

    // Line annotation
    const { selectedLineSegment, setSelectedLineSegment } = useLineAnnotation();

    // Effect to handle selected location changes
    useEffect(() => {
        if (mapInstance && selectedLocation) {
            mapInstance.panTo(selectedLocation);
            mapInstance.setZoom(20); // Increased zoom level for better detail
        }
    }, [mapInstance, selectedLocation]);

    // Ghost marker following mouse
    // const handleResultClick = (place: any) => {
    //     if (!place?.location || !mapInstance) return;

    //     const lat = place.location.latitude;
    //     const lng = place.location.longitude;

    //     mapInstance.panTo({ lat, lng });
    //     mapInstance.setZoom(20); // Already at 20, keeping for consistency
    // };

    // Follow mouse with ghost marker when drop mode is active
    if (mapInstance && dropMode) {
        if (!mapInstance.get('mouseMoveListener')) {
            const listener = mapInstance.addListener("mousemove", (event: google.maps.MapMouseEvent) => {
                if (!event.latLng) return;

                setGhostPosition({
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                });
            });

            mapInstance.set('mouseMoveListener', listener);
        }
    } else if (mapInstance && mapInstance.get('mouseMoveListener')) {
        google.maps.event.removeListener(mapInstance.get('mouseMoveListener'));
        mapInstance.set('mouseMoveListener', null);
        setGhostPosition(null);
    }

    // Form position calculation
    const formPosition = newMarkerFormInfo
        ? new google.maps.LatLng(newMarkerFormInfo.lat, newMarkerFormInfo.lng)
        : null;

    // Form cancel handler

    const handleCancelNewMarkerForm = () => {
        if (!newMarkerFormInfo) return;

        const { id, type } = newMarkerFormInfo;

        ensureAllMarkersVisible();

        setTimeout(() => {
            if (type === "TX") {
                setTxMarkers((prev) => prev.filter((m) => m.id !== id));
            }
            if (type === "Service") {
                setServiceMarkers((prev) => prev.filter((m) => m.id !== id));
            }
            if (type === "Handhole") {
                setHandholeMarkers((prev) => prev.filter((m) => m.id !== id));
            }
            if (type === "TieIn") {
                setTieInMarkers((prev) => prev.filter((m) => m.id !== id));
            }
            setNewMarkerFormInfo(null);
            resetTools();
        }, 50);
    };

    // Update marker positions if project coordinates change
    useEffect(() => {
        if (projectId && txMarkers.length > 0 && mapInstance) {
            // Update marker positions based on new coordinates
            if (markerManagerRef.current) {
                markerManagerRef.current.ensureAllMarkersVisible();
            }
        }
    }, [projectId, txMarkers, mapInstance, markerManagerRef]);

    useEffect(() => {
        if (!mapInstance) return;

        if (measureDistanceMode) {
            mapInstance.setOptions({ draggableCursor: "crosshair" }); // Cambia el cursor
        } else {
            mapInstance.setOptions({ draggableCursor: "" }); // Restaura el cursor por defecto
        }
    }, [mapInstance, measureDistanceMode]);

    return (
        <div className="w-full h-[600px] rounded-lg overflow-hidden relative">
            {/* Map container */}
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Ghost marker */}
            {mapInstance && ghostPosition && dropMode && (
                <GhostMarker mapInstance={mapInstance} position={ghostPosition} />
            )}

            {/* Toolbar */}
            <MapToolbar
                showToolbar={showToolbar}
                toggleShowToolbar={() => {
                    const closingToolbar = showToolbar;
                    setShowToolbar(!showToolbar);
                    if (closingToolbar) resetTools();
                    // Ensure markers remain visible after toolbar toggle - remove delay
                    ensureAllMarkersVisible();
                }}
                editMode={editMode}
                toggleEditMode={() => {
                    resetTools();
                    const newEditMode = !editMode;
                    setEditMode(newEditMode);
                    // Ensure markers remain visible after edit mode toggle - remove delay
                    ensureAllMarkersVisible();
                }}
                activeDropMode={dropMode}
                toggleDropTXMode={() => {
                    handleCancelNewMarkerForm();
                    resetTools();
                    setDropMode(dropMode === "TX" ? null : "TX");
                }}
                toggleDropServiceMode={() => {
                    handleCancelNewMarkerForm();
                    resetTools();
                    setDropMode(dropMode === "Service" ? null : "Service");
                }}
                toggleDropHandholeMode={() => {
                    handleCancelNewMarkerForm();
                    resetTools();
                    setDropMode(dropMode === "Handhole" ? null : "Handhole");
                }}
                toggleDropTieInMode={() => {
                    handleCancelNewMarkerForm();
                    resetTools();
                    setDropMode(dropMode === "TieIn" ? null : "TieIn");
                }}
                measureDistanceMode={measureDistanceMode}
                toggleMeasureDistanceMode={() => {
                    handleCancelNewMarkerForm();
                    resetTools();
                    setMeasureDistanceMode(!measureDistanceMode);
                    // Ensure markers remain visible after distance mode toggle
                    ensureAllMarkersVisible();
                }}
                cancelNewMarkerForm={handleCancelNewMarkerForm}
                resetTools={resetTools}

                linePath={linePath}
                openLineModal={() => setIsLineModalOpen(true)}
                clearLinePath={() => setLinePath([])}
            />

            {/* Distance measurement tool */}
            {mapInstance && measureDistanceMode && (
                <MeasureLines
                    map={mapInstance}
                    projectId={projectId}
                    path={linePath}
                    setPath={setLinePath}
                    isModalOpen={isLineModalOpen}
                    setIsModalOpen={setIsLineModalOpen}
                />
            )}

            {mapInstance && projectId && (
                <RenderTaskLines
                    map={mapInstance}
                    projectId={projectId}
                />
            )}

            {mapInstance && projectId && (
                <RenderTaskMarkers
                    map={mapInstance}
                    projectId={projectId}
                />
            )}

            {/* Line segment form */}
            {mapInstance && selectedLineSegment && (
                <MarkerPopoverOverlay
                    map={mapInstance}
                    position={selectedLineSegment.midpoint}
                    onClose={() => {
                        // If there's a cancel callback and we're closing without submitting, call it
                        if (selectedLineSegment.onCancel && latestTypeCallbackRef.current) {
                            selectedLineSegment.onCancel();
                        }
                        setSelectedLineSegment(null);
                        // Clear type callback when popover closes
                        latestTypeCallbackRef.current = null;
                    }}
                >
                    <LineSegmentFormPopover
                        id={uuidv4()}
                        midpoint={selectedLineSegment.midpoint}
                        onSubmit={(data: any) => {
                            setTasks?.({
                                id: data.id,
                                type: "Line",
                                lat: data.midpoint.lat(),
                                lng: data.midpoint.lng()
                            });
                            setSelectedLineSegment(null);
                            // Clear type callback after submit
                            latestTypeCallbackRef.current = null;
                        }}
                        onCancel={() => {
                            // Call the cancel callback if it exists
                            if (selectedLineSegment.onCancel) {
                                selectedLineSegment.onCancel();
                            }
                            setSelectedLineSegment(null);
                            // Clear type callback after cancel
                            latestTypeCallbackRef.current = null;
                        }}
                        onTypeChange={(type: any) => {
                            // Find the measurement containing this segment and update its color
                            const measurement = measurementsRef.current.find(m =>
                                m.path.getArray().some((point, i) => {
                                    if (i === 0) return false;
                                    const prevPoint = m.path.getAt(i - 1);
                                    return generateSegmentId(prevPoint, point) === selectedLineSegment.id;
                                })
                            );

                            if (measurement) {
                                updateLineColor(measurement, selectedLineSegment.id, type);
                            }

                            // Call the type callback if available (this happens for newly drawn lines)
                            if (latestTypeCallbackRef.current) {
                                latestTypeCallbackRef.current(type);
                                // Clear the callback after using it
                                latestTypeCallbackRef.current = null;
                            }
                        }}
                    />
                </MarkerPopoverOverlay>
            )}

            {/* New marker form */}
            {mapInstance && newMarkerFormInfo && formPosition && (
                <MarkerPopoverOverlay
                    key={newMarkerFormInfo.id}
                    map={mapInstance}
                    position={formPosition}
                    onClose={() => {
                        // Ensure markers are visible before closing the form
                        ensureAllMarkersVisible();

                        // Use a minimal delay before state changes
                        setTimeout(() => {
                            setNewMarkerFormInfo(null);
                        }, 50);
                    }}
                >
                    <MarkerForm
                        id={newMarkerFormInfo.id}
                        projectId={newMarkerFormInfo.projectId}
                        teamsToTask={teamsToTask}
                        lat={newMarkerFormInfo.lat}
                        lng={newMarkerFormInfo.lng}
                        type={newMarkerFormInfo.type}
                        onSubmit={(data: MarkerFormData) => {
                            // Ensure markers are visible before form submission
                            ensureAllMarkersVisible();

                            // Use a minimal delay to allow visibility to stabilize
                            setTimeout(() => {
                                if (data.type === "TX") {
                                    setTxMarkers((prev) =>
                                        prev.map((marker) =>
                                            marker.id === data.id
                                                ? {
                                                    ...marker,
                                                    txNumber: data.txNumber,
                                                }
                                                : marker
                                        )
                                    );
                                }

                                if (data.type === "Service") {
                                    setServiceMarkers((prev) =>
                                        prev.map((marker) =>
                                            marker.id === data.id
                                                ? {
                                                    ...marker,
                                                    serviceNumber: data.serviceNumber,
                                                    relatedTxNumber: data.relatedTxNumber,
                                                    features: data.features,
                                                }
                                                : marker
                                        )
                                    );
                                }

                                setTasks?.(data);
                                setNewMarkerFormInfo(null);
                                resetTools();
                            }, 50);
                        }}
                        onCancel={handleCancelNewMarkerForm}

                    />
                </MarkerPopoverOverlay>
            )}

            {/* Marker editing popover */}
            {editingMarker && mapInstance && (
                <MarkerPopoverOverlay
                    map={mapInstance}
                    position={editingMarker.latLng}
                    onClose={() => {
                        // Ensure markers are visible before closing the editing popover
                        ensureAllMarkersVisible();

                        // Use a minimal delay before state changes
                        setTimeout(() => {
                            setEditingMarker(null);
                        }, 50);
                    }}
                >
                    <button
                        onClick={handleEnableDragMarker}
                        className="block w-full text-left px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                        Drag
                    </button>

                    {editingMarker.type === "TX" && (
                        <button
                            onClick={handleRotateMarker}
                            className="block w-full text-left px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                            Rotate
                        </button>
                    )}

                    <button
                        onClick={handleDeleteMarker}
                        className="block w-full text-left px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                        Delete
                    </button>
                </MarkerPopoverOverlay>
            )}
        </div>
    );
};

export { ProjectMap };