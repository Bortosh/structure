
import { useState, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { Loader } from "@googlemaps/js-api-loader";

type MarkerLibrary = {
    AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement;
};

type PlacesLibrary = google.maps.PlacesLibrary; // ✅ Added

interface UseMapLoaderReturn {
    mapContainerRef: RefObject<HTMLDivElement | null>;
    mapInstance: google.maps.Map | null;
    markerLibrary: MarkerLibrary | null;
    placesLibrary: PlacesLibrary | null; // ✅ Added
}

const useMapLoader = (
    onMapClick?: (event: google.maps.MapMouseEvent) => void
): UseMapLoaderReturn => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
    const [markerLibrary, setMarkerLibrary] = useState<MarkerLibrary | null>(null);
    const [placesLibrary, setPlacesLibrary] = useState<PlacesLibrary | null>(null); // ✅ Added

    useEffect(() => {
        const loader = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
            version: "weekly",
            libraries: ["places", "geometry"], // ✅ this is fine (for backwards compatibility)
        });

        loader
            .load()
            .then(async () => {
                if (!window.google) {
                    console.error("Google Maps JS API failed to load.");
                    return;
                }

                const mapLib = await window.google.maps.importLibrary("maps") as google.maps.MapsLibrary;
                const markerLib = await window.google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
                const placesLib = await window.google.maps.importLibrary("places") as google.maps.PlacesLibrary; // ✅ Added

                const { AdvancedMarkerElement } = markerLib;

                if (!AdvancedMarkerElement) {
                    console.error("AdvancedMarkerElement not found in marker library");
                    return;
                }

                if (!mapContainerRef.current) {
                    console.error("Map container ref is null");
                    return;
                }

                const map = new mapLib.Map(mapContainerRef.current, {
                    center: { lat: 25.7617, lng: -80.1918 },
                    zoom: 12,
                    mapId: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_MAP_ID,
                    mapTypeId: "roadmap",
                    mapTypeControl: false,
                    streetViewControl: true,
                    fullscreenControl: false,
                    zoomControl: false,
                    clickableIcons: false,
                });

                setMapInstance(map);
                setMarkerLibrary({ AdvancedMarkerElement });
                setPlacesLibrary(placesLib); // ✅ Added

                if (onMapClick) {
                    map.addListener("click", onMapClick);
                }

                console.log("[Map] Initialized using useMapLoader");
            })
            .catch((err) => {
                console.error("[Map Loader Error]", err);
            });

        // ✅ Run only on mount
    }, []); // ← empty array makes sure it only runs once

    return { mapContainerRef, mapInstance, markerLibrary, placesLibrary }; // ✅ Added placesLibrary to return
};

export default useMapLoader;
