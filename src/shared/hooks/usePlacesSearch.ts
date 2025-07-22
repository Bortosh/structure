import { useState, useCallback } from "react";

interface PlaceResult {
    displayName: string;
    formattedAddress: string;
    location: {
        latitude: number;
        longitude: number;
    };
    placeId: string;
}

export function usePlacesSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);

    const handleSearchChange = useCallback(async (query: string) => {
        setSearchQuery(query);

        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setLoadingSearch(true);

        // ⚠️ Este endpoint está dando REQUEST_DENIED porque la API Key no tiene habilitado el acceso.
        // Una vez el cliente habilite la Places API y configure correctamente la key, funcionará sin cambios.

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query.trim())}&inputtype=textquery&fields=place_id,name,formatted_address,geometry&region=us&locationbias=point:25.7617,-80.1918&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch places");
            }

            const data = await response.json();
            console.log("🚀 ~ handleSearchChange ~ data:", data)

            const transformedResults: PlaceResult[] = data.candidates.map((result: any) => ({
                displayName: result.name,
                formattedAddress: result.formatted_address,
                location: {
                    latitude: result.geometry.location.lat,
                    longitude: result.geometry.location.lng,
                },
                placeId: result.place_id,
            }));


            setSearchResults(transformedResults);
        } catch (error) {
            console.error("Error searching places:", error);
            setSearchResults([]);
        } finally {
            setLoadingSearch(false);
        }
    }, []);

    const handlePlaceSelect = useCallback((place: PlaceResult) => {
        setSearchQuery(place.formattedAddress);
        setSearchResults([]); // Clear results after selection
    }, []);

    return {
        searchQuery,
        loadingSearch,
        searchResults,
        handleSearchChange,
        handlePlaceSelect,
        setSearchQuery,
    };
}
