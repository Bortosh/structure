
import React, { useState, useEffect } from "react";
import type { MarkerType } from "../../componets/project/project-map/map-utils/marker-icons";

interface UseMapToolsProps {
    editModeRef: React.RefObject<boolean>;
    dropModeRef: React.RefObject<MarkerType | null>;
    onReset?: () => void; // Optional callback that runs when tools are reset
}

export const useMapTools = ({ editModeRef, dropModeRef, onReset }: UseMapToolsProps) => {
    // Tool visibility
    const [showToolbar, setShowToolbar] = useState(false);

    // Tool modes
    const [editMode, setEditMode] = useState(false);
    const [dropMode, setDropMode] = useState<MarkerType | null>(null);
    const [measureDistanceMode, setMeasureDistanceMode] = useState(false);

    // Update refs when state changes
    useEffect(() => {
        (dropModeRef as { current: MarkerType | null }).current = dropMode;
    }, [dropMode, dropModeRef]);

    useEffect(() => {
        (editModeRef as { current: boolean }).current = editMode;
    }, [editMode, editModeRef]);

    // Reset all tools (used when changing modes)
    const resetTools = () => {
        // Update our tool states
        setEditMode(false);
        (editModeRef as { current: boolean }).current = false;
        setDropMode(null);
        setMeasureDistanceMode(false);

        // Call the optional reset callback if provided
        if (onReset) onReset();
    };

    // Reset tools except annotation mode
    const resetToolsExceptAnnotation = () => {
        setEditMode(false);
        (editModeRef as { current: boolean }).current = false;
        setDropMode(null);
        setMeasureDistanceMode(false);

        // Call the optional reset callback if provided
        if (onReset) onReset();
    };

    // Effect for map options based on tools
    useEffect(() => {
        if (!window.google?.maps) return;

        // Any global tool-specific settings can go here
        // For example, we could change cursor styles or map interactions
    }, [editMode, dropMode, measureDistanceMode]);

    return {
        // Tool states
        showToolbar,
        setShowToolbar,
        editMode,
        setEditMode,
        dropMode,
        setDropMode,
        measureDistanceMode,
        setMeasureDistanceMode,

        // Tool functions
        resetTools,
        resetToolsExceptAnnotation
    };
};

export default useMapTools; 