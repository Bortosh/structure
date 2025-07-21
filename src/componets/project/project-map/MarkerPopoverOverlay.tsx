// These are special tools that help the map and buttons show up and work
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// These are the types of information the pop-up (popover) needs to show up on the map
interface MarkerPopoverOverlayProps {
    map: google.maps.Map;                // This is the actual map you're working with
    position: google.maps.LatLng;        // Where on the map to show the pop-up
    children: React.ReactNode;           // What buttons or things will be shown inside the pop-up
    onClose?: () => void;                // What happens when you close the pop-up (optional)
    offsetX?: number;                    // Optional: move the pop-up left/right
    offsetY?: number;                    // Optional: move the pop-up up/down
}

// This is the actual pop-up component
const MarkerPopoverOverlay: React.FC<MarkerPopoverOverlayProps> = ({
    map,        // the map we show this pop-up on
    position,   // where the pop-up should appear on the map
    children,   // buttons/actions you want to show inside the pop-up (like drag, rotate, delete)
    onClose,    // what happens when you close it (optional)
    offsetX = 0, // you can move it sideways if you want (default is 0 = no movement)
    offsetY = 0, // you can move it up/down if you want (default is 0 = no movement)
}) => {

    // This holds the actual HTML container where the pop-up will be shown
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    // We need to track the custom Google overlay (this is how Google lets us put custom stuff on the map)
    const overlayRef = useRef<google.maps.OverlayView | null>(null);

    // These track when the map moves or zooms, so we can update where the pop-up goes
    const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

    // This runs when the pop-up gets shown, or when something changes
    useEffect(() => {
        if (!map || !position) return; // if no map or no position, do nothing!

        // CustomOverlay is a special "layer" that lets us put anything on top of Google Maps
        class CustomOverlay extends google.maps.OverlayView {
            div: HTMLDivElement | null = null; // this is the box (popover) we're adding

            // Happens when the pop-up is added to the map
            onAdd() {
                if (!this.div) {
                    this.div = document.createElement("div");  // we make a new box
                    this.div.style.position = "absolute";       // it stays in a fixed position
                    this.div.style.zIndex = "100";              // sits on top of other things

                    // 🛑 Stop Google Maps from hijacking click/drag events in the form
                    this.div.addEventListener("mousedown", (e) => e.stopPropagation());
                    this.div.addEventListener("touchstart", (e) => e.stopPropagation());

                    setContainer(this.div); // tell React this is our box

                    const panes = this.getPanes();             // Google gives us different map layers
                    panes?.floatPane.appendChild(this.div);    // we add our box to the floating pane (topmost)
                }
            }

            // This runs anytime we need to move the pop-up (map moves, zooms, etc.)
            draw() {
                if (!this.div) return;                    // no box, nothing to do
                const projection = this.getProjection();  // helps us figure out where things go on the screen
                if (!projection) return;

                const point = projection.fromLatLngToDivPixel(position); // convert map position to screen position
                if (!point) return;

                // Put the pop-up on the screen, at the right place
                this.div.style.left = `${point.x + offsetX}px`;  // left/right adjustment
                this.div.style.top = `${point.y + offsetY}px`;   // up/down adjustment
            }

            // Happens when we remove the pop-up (close it or leave)
            onRemove() {
                if (this.div && this.div.parentNode) {
                    this.div.parentNode.removeChild(this.div);  // remove the pop-up from the map
                }
                setContainer(null);                           // tell React we don't have a box anymore

                if (onClose) onClose();                       // run any close behavior if someone asked for it
            }
        }

        // We create the actual overlay and attach it to the map
        const overlay = new CustomOverlay();
        overlay.setMap(map);               // tells Google to show our overlay on this map
        overlayRef.current = overlay;      // we save it for later use

        // Whenever the map moves, zooms, or changes bounds, we redraw our pop-up
        const redraw = () => {
            overlayRef.current?.draw();
        };

        // Listen for map changes so we can reposition the pop-up when needed
        listenersRef.current = [
            map.addListener("bounds_changed", redraw),
            map.addListener("zoom_changed", redraw),
            map.addListener("center_changed", redraw),
        ];

        // This runs when we leave the page or remove the pop-up
        return () => {
            overlay.setMap(null); // remove the overlay from the map
            listenersRef.current.forEach((listener) => listener.remove()); // stop listening to map events
            listenersRef.current = []; // reset listeners
        };
    }, [map, position, offsetX, offsetY, onClose]); // runs whenever these change

    // If the position changes (from user moving), we redraw the pop-up in the new spot
    useEffect(() => {
        overlayRef.current?.draw();
    }, [position]);

    // If we don't have a box to show, we return nothing
    if (!container) return null;

    // If we do have a box, we put the buttons/actions inside it, and show it at the map spot
    return createPortal(
        <div className="bg-white border rounded shadow p-2 space-y-2 transform -translate-x-1/2" style={{ pointerEvents: "auto" }} tabIndex={0}>
            {children} {/* this shows buttons like Drag, Rotate, Delete */}
        </div>,
        container // this is the floating box attached to the map
    );
};

// Export so other files can use this pop-up component!
export default MarkerPopoverOverlay;
