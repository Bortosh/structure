/**
 * Application configuration settings
 */

interface Config {
    googleMaps: {
        publicApiKey: string;
    };
}

export const config: Config = {
    googleMaps: {
        publicApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    },
};

// Validación general
if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    throw new Error('Missing VITE_GOOGLE_MAPS_API_KEY environment variable');
}

// Google Maps Map ID for Advanced Markers
export const googleMapsMapId = import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_MAP_ID || 'aed8f9e800b4c10f';

// Google Maps script URL with loading=async
export const googleMapsScriptUrl = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    if (!apiKey) {
        console.warn('No Google Maps API key provided. Map functionality will be limited.');
    }
    return `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,drawing,marker,geometry&callback=initMap&loading=async&v=beta`;
};

// Secure API endpoints that proxy Google Maps requests through our backend
export const api = {
    places: {
        search: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
        details: '/api/maps-proxy/place-details', // si luego usas proxy real para esto
    },
};
