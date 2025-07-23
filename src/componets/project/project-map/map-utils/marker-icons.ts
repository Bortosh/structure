// components/ProjectMap/utils/markerIcons.ts

export type MarkerType = "TX" | "Service" | "Handhole" | "TieIn";

/**
 * Creates a custom marker icon as an HTMLDivElement.
 *
 * @param type - The marker type ("TX" | "Service" | "Handhole" | "TieIn").
 * @param rotation - The rotation angle in degrees.
 * @returns An HTMLDivElement containing the SVG icon.
 */
export const createMarkerIcon = (type: MarkerType, rotation: number = 0): HTMLDivElement => {
    const icon = document.createElement("div");

    if (type === "TX") {
        let svgContent = "";

        switch (rotation % 360) {
            case 0:
                svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="m16 12-4-4-4 4"/>
            <path d="M12 16V8"/>
          </svg>`;
                break;

            case 90:
                svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="M8 12h8"/>
            <path d="m12 16 4-4-4-4"/>
          </svg>`;
                break;

            case 180:
                svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="M12 8v8"/>
            <path d="m8 12 4 4 4-4"/>
          </svg>`;
                break;

            case 270:
                svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="m12 8-4 4 4 4"/>
            <path d="M16 12H8"/>
          </svg>`;
                break;

            default:
                console.warn(`Unsupported rotation angle: ${rotation}. Falling back to 0 degrees.`);
                svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="m16 12-4-4-4 4"/>
            <path d="M12 16V8"/>
          </svg>`;
                break;
        }

        icon.innerHTML = svgContent;
    } else if (type === "Service") {
        icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
           stroke="blue" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2"/>
        <path d="M8 16V8l4 4 4-4v8"/>
      </svg>`;
    } else if (type === "Handhole") {
        icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
           fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <rect x="8" y="8" width="8" height="8" rx="1"/>
      </svg>`;
    } else if (type === "TieIn") {
        icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
        <path d="m15 9-6 6"/>
        <path d="m9 9 6 6"/>
      </svg>`;
    }

    return icon;
};
