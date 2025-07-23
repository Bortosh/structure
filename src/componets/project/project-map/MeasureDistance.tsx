
import { useEffect, useRef } from "react";
import type { TaskType } from "./types/task-types";

// These are the expected inputs (props) for the component.
// It uses Google Maps and lets the user measure distances by clicking on the map.
interface MeasureDistanceProps {
    mapInstance: google.maps.Map; // the map we are drawing on
    isActive: boolean; // whether the measuring tool is currently active
    editMode: boolean; // whether users can drag/move the markers
    onDeactivate: () => void; // function to call when the tool is deactivated (right click)
    addTask?: (id: string, type: TaskType, lat: number, lng: number) => void;  // optional: add task logic
    annotateLineMode?: boolean; // optional: whether we can annotate lines
    onLineClick?: (id: string, midpoint: google.maps.LatLng, type?: (type: "Primary" | "Secondary") => void, cancel?: () => void) => void; // optional: show overlay form on line click
    measurementsRef: React.RefObject<{
        polyline: google.maps.Polyline;
        path: google.maps.MVCArray<google.maps.LatLng>;
        segmentTypes: Map<string, "Primary" | "Secondary">;
    }[]>;
}

// A segment connects two points
// interface Segment {
//     id: string;
//     pointA: google.maps.LatLng;
//     pointB: google.maps.LatLng;
// }

// Each measurement represents a line drawn on the map
interface Measurement {
    polyline: google.maps.Polyline;
    ghostLine: google.maps.Polyline;
    markers: google.maps.Marker[];
    path: google.maps.MVCArray<google.maps.LatLng>;
    listeners: google.maps.MapsEventListener[];
    tooltipDiv: HTMLDivElement;
    overlay: google.maps.OverlayView;
    type?: "Primary" | "Secondary";
}

const MeasureDistance: React.FC<MeasureDistanceProps> = ({
    mapInstance,
    isActive,
    editMode,
    onDeactivate,
    // annotateLineMode,
    onLineClick,
    measurementsRef,
}) => {
    // Store all the drawn lines and the current active line
    const measurementsRefInternal = useRef<Measurement[]>([]);
    const activeMeasurementRef = useRef<Measurement | null>(null);

    // Define color constants
    const DEFAULT_LINE_COLOR = "#FF0000"; // Red
    const PRIMARY_LINE_COLOR = "#000000"; // Black
    const SECONDARY_LINE_COLOR = "#0000FF"; // Blue

    // Generate a unique ID for a line between two points (order-independent)
    const generateSegmentId = (pointA: google.maps.LatLng, pointB: google.maps.LatLng) => {
        const [a, b] = [
            `${pointA.lat().toFixed(5)},${pointA.lng().toFixed(5)}`,
            `${pointB.lat().toFixed(5)},${pointB.lng().toFixed(5)}`,
        ].sort();
        return `${a}_${b}`;
    };

    // Position and show the floating tooltip at the midpoint
    const showTooltip = (
        tooltipDiv: HTMLDivElement,
        overlay: google.maps.OverlayView,
        midpoint: google.maps.LatLng,
        feet: number
    ) => {
        const projection = overlay.getProjection();
        if (!projection) return;

        const point = projection.fromLatLngToDivPixel(midpoint);
        if (!point) return;

        tooltipDiv.innerText = `${feet.toFixed(2)} ft`;
        tooltipDiv.style.left = `${point.x}px`;
        tooltipDiv.style.top = `${point.y}px`;
        tooltipDiv.style.transform = `translate(-50%, -100%)`;
        tooltipDiv.style.display = "block";

        overlay.draw = () => {
            const proj = overlay.getProjection();
            if (!proj) return;
            const p = proj.fromLatLngToDivPixel(midpoint);
            if (!p) return;
            tooltipDiv.style.left = `${p.x}px`;
            tooltipDiv.style.top = `${p.y}px`;
        };
        overlay.draw();
    };

    // Find the line segment closest to a given point
    // const getClosestSegment = (
    //     path: google.maps.MVCArray<google.maps.LatLng>,
    //     latLng: google.maps.LatLng
    // ) => {
    //     let minDistance = Infinity;
    //     let closest: { pointA: google.maps.LatLng; pointB: google.maps.LatLng } | null = null;
    //     for (let i = 1; i < path.getLength(); i++) {
    //         const a = path.getAt(i - 1);
    //         const b = path.getAt(i);
    //         const mid = google.maps.geometry.spherical.interpolate(a, b, 0.5);
    //         const dist = google.maps.geometry.spherical.computeDistanceBetween(latLng, mid);
    //         if (dist < minDistance) {
    //             minDistance = dist;
    //             closest = { pointA: a, pointB: b };
    //         }
    //     }
    //     return closest;
    // };

    // Update the line segment color based on its type
    const updateLineColor = (m: Measurement, type?: "Primary" | "Secondary") => {
        m.type = type;

        // Determine color based on type
        let color;
        if (type === "Primary") {
            color = PRIMARY_LINE_COLOR;
        } else if (type === "Secondary") {
            color = SECONDARY_LINE_COLOR;
        } else {
            color = DEFAULT_LINE_COLOR;
        }

        // Update only polyline color
        m.polyline.setOptions({ strokeColor: color });
    };

    // Function to update segment polylines when path changes
    // const updateSegmentPolylines = (m: Measurement) => {
    //     // Clear existing segment polylines
    //     m.polyline.setMap(null);
    // };

    // Attach all click/mouse events needed for drawing
    const attachListeners = (m: Measurement) => {
        const { path } = m;

        // Add point on map click
        const clickListener = mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
            if (!e.latLng || m !== activeMeasurementRef.current) return;

            // Only allow two points
            if (path.getLength() >= 2) return;

            const index = path.getLength();
            path.push(e.latLng);
            addMarker(m, e.latLng, index);

            // If we have two points, show the popover and deactivate the tool
            if (path.getLength() === 2) {
                const pointA = path.getAt(0);
                const pointB = path.getAt(1);
                const id = generateSegmentId(pointA, pointB);
                const midpoint = google.maps.geometry.spherical.interpolate(pointA, pointB, 0.5);

                // Hide the ghost line
                m.ghostLine.setPath([]);
                m.ghostLine.setMap(null);

                // Show the popover first, before deactivating the tool
                onLineClick?.(id, midpoint,
                    // Type callback for when line type is selected
                    (type) => {
                        updateLineColor(m, type);

                        // Update the external measurement reference
                        const extMeasurement = measurementsRef.current.find(extM => extM.path === m.path);
                        if (extMeasurement && type) {
                            extMeasurement.segmentTypes.set(id, type);
                        }
                    },
                    // Cancel callback for when popover is cancelled
                    () => {
                        // Remove the line and its markers
                        m.polyline.setMap(null);
                        m.markers.forEach(marker => marker.setMap(null));

                        // Remove from internal refs
                        const internalIndex = measurementsRefInternal.current.indexOf(m);
                        if (internalIndex > -1) {
                            measurementsRefInternal.current.splice(internalIndex, 1);
                        }

                        // Remove from external ref
                        const externalIndex = measurementsRef.current.findIndex(measurement => measurement.path === m.path);
                        if (externalIndex > -1) {
                            measurementsRef.current.splice(externalIndex, 1);
                        }

                        // Remove overlay
                        m.overlay.setMap(null);
                    }
                );

                // Then deactivate the tool
                onDeactivate();
            }
        });

        // Add mousemove listener for ghost line
        const mouseMoveListener = mapInstance.addListener("mousemove", (e: google.maps.MapMouseEvent) => {
            if (!e.latLng || m !== activeMeasurementRef.current) {
                m.ghostLine.setPath([]);
                return;
            }

            // Only show ghost line if we have exactly one point
            if (path.getLength() === 1) {
                const startPoint = path.getAt(0);
                m.ghostLine.setPath([startPoint, e.latLng]);
                m.ghostLine.setMap(mapInstance);
            } else {
                m.ghostLine.setPath([]);
            }
        });

        // Cancel tool on right-click
        const rightClickListener = mapInstance.addListener("rightclick", () => {
            m.ghostLine.setPath([]);
            m.ghostLine.setMap(null);
            onDeactivate();
        });

        m.listeners.push(clickListener, mouseMoveListener, rightClickListener);

        // Add hover events to show tooltip
        if (path.getLength() === 2) {
            const pointA = path.getAt(0);
            const pointB = path.getAt(1);

            // Show tooltip on hover
            m.polyline.addListener("mouseover", () => {
                if (!pointA || !pointB) return;
                const midpoint = google.maps.geometry.spherical.interpolate(pointA, pointB, 0.5);
                const feet = google.maps.geometry.spherical.computeDistanceBetween(pointA, pointB) * 3.28084;
                showTooltip(m.tooltipDiv, m.overlay, midpoint, feet);
            });

            m.polyline.addListener("mouseout", () => {
                m.tooltipDiv.style.display = "none";
            });

            // Add click handler for editing existing lines
            m.polyline.addListener("click", () => {
                // Only show popover in edit mode
                if (!editMode) return;

                const id = generateSegmentId(pointA, pointB);
                const midpoint = google.maps.geometry.spherical.interpolate(pointA, pointB, 0.5);

                // For existing lines, we don't pass a cancel callback
                onLineClick?.(id, midpoint);
            });
        }
    };

    // Adds a draggable black circle marker at each point
    const addMarker = (m: Measurement, pos: google.maps.LatLng, index: number) => {
        const marker = new google.maps.Marker({
            position: pos,
            map: mapInstance,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: PRIMARY_LINE_COLOR, // Always black
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 1,
                scale: 5,
            },
            draggable: editMode,
            zIndex: 999,
        });

        // Update path when marker is dragged (only happens in edit mode)
        marker.addListener("drag", () => {
            const newPos = marker.getPosition();
            if (newPos) m.path.setAt(index, newPos);
        });

        marker.addListener("dragend", () => attachListeners(m));

        marker.addListener("rightclick", () => {
            if (activeMeasurementRef.current !== m) return;
            m.path.removeAt(index);
            marker.setMap(null);
            m.markers.splice(index, 1);
            attachListeners(m);
        });

        m.markers.push(marker);
    };

    // Starts a new measurement with polylines and tooltips
    const startNewMeasurement = () => {
        const path = new google.maps.MVCArray<google.maps.LatLng>();

        const measurement: Measurement = {
            polyline: new google.maps.Polyline({
                map: mapInstance,
                path,
                strokeColor: PRIMARY_LINE_COLOR,
                strokeOpacity: 1,
                strokeWeight: 2
            }),
            ghostLine: new google.maps.Polyline({
                map: mapInstance,
                path: [],
                strokeColor: PRIMARY_LINE_COLOR,
                strokeOpacity: 0.2,
                strokeWeight: 1.5,
                zIndex: 1,
                clickable: false
            }),
            markers: [],
            path,
            listeners: [],
            tooltipDiv: document.createElement("div"),
            overlay: new google.maps.OverlayView(),
            type: "Primary" // Set initial type to Primary
        };

        // Set up tooltip div
        Object.assign(measurement.tooltipDiv.style, {
            position: "absolute",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "4px 8px",
            fontSize: "12px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            display: "none",
            pointerEvents: "none",
        });

        // Set up overlay
        measurement.overlay.onAdd = () => measurement.overlay.getPanes()?.floatPane?.appendChild(measurement.tooltipDiv);
        measurement.overlay.draw = () => { };
        measurement.overlay.onRemove = () => measurement.tooltipDiv.remove();
        measurement.overlay.setMap(mapInstance);

        measurementsRefInternal.current.push(measurement);
        measurementsRef.current.push({
            polyline: measurement.polyline,
            path,
            segmentTypes: new Map()
        });
        activeMeasurementRef.current = measurement;
        attachListeners(measurement);
    };

    // Finalizes the current measurement (when exiting tool)
    const finalizeCurrentMeasurement = () => {
        const m = activeMeasurementRef.current;
        if (!m) return;

        // Clear all listeners
        m.listeners.forEach((l) => l.remove());
        m.listeners = [];

        // Hide ghost line
        m.ghostLine.setPath([]);
        m.ghostLine.setMap(null);

        // If measurement is incomplete (less than 2 points), remove it
        if (m.path.getLength() < 2) {
            // Remove markers
            m.markers.forEach(marker => marker.setMap(null));

            // Remove polyline
            m.polyline.setMap(null);

            // Remove from internal refs
            const internalIndex = measurementsRefInternal.current.indexOf(m);
            if (internalIndex > -1) {
                measurementsRefInternal.current.splice(internalIndex, 1);
            }

            // Remove from external ref
            const externalIndex = measurementsRef.current.findIndex(measurement => measurement.path === m.path);
            if (externalIndex > -1) {
                measurementsRef.current.splice(externalIndex, 1);
            }

            // Remove overlay
            m.overlay.setMap(null);
        } else {
            // Keep tooltips visible when in edit mode, otherwise hide them
            if (!editMode) {
                m.tooltipDiv.style.display = "none";
                m.overlay.setMap(null);
            }
        }

        activeMeasurementRef.current = null;
    };

    // Enable or disable marker dragging and reattach listeners
    const setMarkersEditable = (editable: boolean) => {
        measurementsRefInternal.current.forEach((m) => {
            // When drawing (isActive), only active measurement's markers are draggable
            // When not drawing, all markers follow the editMode state
            const shouldBeDraggable = isActive ?
                (m === activeMeasurementRef.current && editable) : // During drawing
                editable; // During normal edit mode

            m.markers.forEach((marker) => marker.setDraggable(shouldBeDraggable));

            // Remove old listeners
            m.listeners.forEach((l) => l.remove());
            m.listeners = [];

            // Reattach listeners - make sure ghost line is included for active measurement
            attachListeners(m);

            // Ensure overlay is visible for edit mode
            if (!m.overlay.getMap()) m.overlay.setMap(mapInstance);
        });
    };

    // When tool is activated or deactivated
    useEffect(() => {
        if (!mapInstance) return;
        if (isActive) {
            // Disable map panning when drawing
            mapInstance.setOptions({
                draggable: false,
                scrollwheel: false,
                disableDoubleClickZoom: true
            });

            // Make all existing measurements non-interactive
            measurementsRefInternal.current.forEach(m => {
                if (m !== activeMeasurementRef.current) {
                    // Make polyline non-interactive
                    m.polyline.setOptions({
                        clickable: false,
                        strokeOpacity: 0.5,
                        zIndex: 1  // Lower z-index to ensure it doesn't interfere with drawing
                    });

                    // Make markers non-interactive while drawing
                    m.markers.forEach(marker => {
                        marker.setOptions({
                            clickable: false,
                            draggable: false, // Force non-draggable during drawing for non-active measurements
                            zIndex: 1,
                            cursor: 'default'
                        });
                    });
                }
            });

            startNewMeasurement();
            setMarkersEditable(true);
        } else {
            // Restore map controls when not drawing
            mapInstance.setOptions({
                draggable: true,
                scrollwheel: true,
                disableDoubleClickZoom: false
            });

            // Restore interactivity to all measurements
            measurementsRefInternal.current.forEach(m => {
                // Make polylines clickable in edit mode
                m.polyline.setOptions({
                    clickable: editMode,
                    strokeOpacity: 1,
                    zIndex: 2  // Restore normal z-index
                });

                // Restore markers interactivity based on edit mode
                m.markers.forEach(marker => {
                    marker.setOptions({
                        clickable: true,
                        draggable: editMode,
                        zIndex: 999,
                        cursor: 'pointer'
                    });
                });
            });

            finalizeCurrentMeasurement();
            setMarkersEditable(editMode);
        }
    }, [isActive, editMode]); // Update dependencies to include editMode

    // Remove the annotateLineMode effect since we don't use it anymore
    useEffect(() => {
        if (!isActive) {
            // Update marker draggability and line clickability
            measurementsRefInternal.current.forEach(m => {
                m.markers.forEach(marker => {
                    marker.setDraggable(editMode);
                });

                // Make polylines clickable in edit mode
                m.polyline.setOptions({
                    clickable: editMode
                });
            });
        }
    }, [editMode, isActive]);

    return null;
};

export default MeasureDistance;
