/**
 * A utility class to handle marker clustering on Google Maps
 */

interface MarkerClustererOptions {
    map: google.maps.Map;
    markers: google.maps.marker.AdvancedMarkerElement[];
    gridSize?: number;
    minClusterSize?: number;
}

export class MarkerClusterer {
    private map: google.maps.Map;
    private markers: google.maps.marker.AdvancedMarkerElement[];
    private gridSize: number;
    private minClusterSize: number;
    private clusters: any[] = [];

    constructor(options: MarkerClustererOptions) {
        this.map = options.map;
        this.markers = options.markers || [];
        this.gridSize = options.gridSize || 60;
        this.minClusterSize = options.minClusterSize || 2;

        this.init();
    }

    /**
     * Initialize the clusterer
     */
    private init(): void {
        if (this.markers.length > 0) {
            this.addMarkers(this.markers);
        }
    }

    /**
     * Add markers to the clusterer
     */
    public addMarkers(markers: google.maps.marker.AdvancedMarkerElement[]): void {
        // In a real implementation, this would group nearby markers into clusters
        // For now, we'll just add the markers to the map
        markers.forEach(marker => {
            if (marker) {
                marker.map = this.map;
            }
        });

        // Store the markers
        this.markers = [...this.markers, ...markers];
    }

    /**
     * Remove a marker from the clusterer
     */
    public removeMarker(marker: google.maps.marker.AdvancedMarkerElement): void {
        const index = this.markers.indexOf(marker);
        if (index !== -1) {
            this.markers.splice(index, 1);
            marker.map = null;
        }
    }

    /**
     * Clear all markers from the clusterer
     */
    public clearMarkers(): void {
        this.markers.forEach(marker => {
            marker.map = null;
        });
        this.markers = [];
    }
} 