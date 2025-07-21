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

// Validate required environment variables
if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    throw new Error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable');
}

// Server-side only config validation
if (typeof window === 'undefined' && !import.meta.env.VITE_GOOGLE_MAPS_SERVER_API_KEY) {
    throw new Error('Missing GOOGLE_MAPS_SERVER_API_KEY environment variable');
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
}

// Secure API endpoints that proxy Google Maps requests through our backend
export const api = {
    // Geocoding and general Maps queries
    mapsProxy: '/api/maps-proxy',

    // Places API specific endpoints
    places: {
        search: '/api/maps-proxy',   // POST method
        details: '/api/maps-proxy/place-details',
    }
} 