export interface Marker {
    id: string;
    lat: number;
    lng: number;
    label: string;
    rotation?: number;

    // Optional fields depending on type
    txNumber?: string;
    serviceNumber?: string;
    relatedTxNumber?: string;
    features?: string[];
    handholeType?: string;
    handholeNumber?: string;
} 