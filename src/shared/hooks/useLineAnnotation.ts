
import { useState, useEffect } from "react";

// Define the type for selected line segment
export interface SelectedLineSegment {
    id: string;
    midpoint: google.maps.LatLng;
    onCancel?: () => void;
}

export const useLineAnnotation = () => {
    // State for selected line segment
    const [selectedLineSegment, setSelectedLineSegment] = useState<SelectedLineSegment | null>(null);

    // Update map options when annotation mode changes
    useEffect(() => {
        const maps = window.google?.maps;
        if (!maps) return;

        // Add any global map configuration specific to line annotation mode here

        return () => {
            // Cleanup any event listeners or map settings
        };
    }, []);

    return {
        selectedLineSegment,
        setSelectedLineSegment
    };
};

export default useLineAnnotation; 