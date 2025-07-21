import { useState, useCallback } from "react";
import { api } from "../lib/config";

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

        try {
            const response = await fetch(api.places.search, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    endpoint: "/maps/api/place/textsearch/json",
                    params: {
                        query: query.trim(),
                    },
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch places");
            }

            const data = await response.json();

            // Transform the response to match our interface
            const transformedResults: PlaceResult[] = data.results.map((result: any) => ({
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
