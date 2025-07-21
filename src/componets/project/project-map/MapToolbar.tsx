
import { Button } from "../../project/components/ui/botton";
import {
    SquareArrowUp,
    SquareM,
    SquareSquare,
    Spline,
    Pencil,
    // PencilRuler,
    SquareX
} from "lucide-react"; // ✅ Added Square for Handhole

import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent
} from "../components/ui/tooltip";

import type { MarkerType } from "./map-utils/marker-icons"; // ✅ Import your MarkerType
import { cn } from "../../dashboard/components/utils/utils";

interface MapToolbarProps {
    // Controls the visibility of the toolbar panel
    showToolbar: boolean;
    toggleShowToolbar: () => void;

    // Controls whether markers & polylines are draggable/editable
    editMode: boolean;
    toggleEditMode: () => void;

    activeDropMode: MarkerType | null; // ✅ Now supports "Handhole"
    toggleDropTXMode: () => void;
    toggleDropServiceMode: () => void;
    toggleDropHandholeMode: () => void; // ✅ New handler
    toggleDropTieInMode: () => void; // Add new toggle function

    measureDistanceMode: boolean;
    toggleMeasureDistanceMode: () => void;

    cancelNewMarkerForm: () => void;
    resetTools: () => void;
}

const MapToolbar: React.FC<MapToolbarProps> = ({
    showToolbar,
    toggleShowToolbar,

    editMode,
    toggleEditMode,

    activeDropMode,
    toggleDropTXMode,
    toggleDropServiceMode,
    toggleDropHandholeMode,
    toggleDropTieInMode, // Add new prop

    measureDistanceMode,
    toggleMeasureDistanceMode,

    // cancelNewMarkerForm,
    // resetTools,
}) => {
    return (
        <TooltipProvider>
            <div className="absolute top-4 right-4 z-10 flex flex-col items-center gap-2 backdrop-blur-md rounded-lg p-2 shadow-lg">
                {/* Toggle Map Tools Panel */}
                <Button
                    variant={showToolbar ? "default" : "outline"}
                    onClick={toggleShowToolbar}
                    className="w-full bg-black text-white hover:bg-gray-900 shadow-md"
                >
                    Map Tools
                </Button>

                {showToolbar && (
                    <div className="flex flex-col gap-2 mt-2 px-1 items-center w-fit self-center">

                        {/* Drop TX Marker */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={activeDropMode === "TX" ? "default" : "outline"}
                                    onClick={toggleDropTXMode}
                                    size="icon"
                                    className={cn(
                                        "h-8 w-8",
                                        activeDropMode === "TX"
                                            ? "bg-black text-white hover:bg-gray-800"
                                            : "bg-white text-black hover:bg-gray-100"
                                    )}
                                >
                                    <SquareArrowUp className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">Drop TX Marker</TooltipContent>
                        </Tooltip>

                        {/* Drop Service Marker */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={activeDropMode === "Service" ? "default" : "outline"}
                                    onClick={toggleDropServiceMode}
                                    size="icon"
                                    className={cn(
                                        "h-8 w-8",
                                        activeDropMode === "Service"
                                            ? "bg-black text-white hover:bg-gray-800"
                                            : "bg-white text-black hover:bg-gray-100"
                                    )}
                                >
                                    <SquareM className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">Drop Service Marker</TooltipContent>
                        </Tooltip>

                        {/* Drop Handhole Marker */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={activeDropMode === "Handhole" ? "default" : "outline"}
                                    onClick={toggleDropHandholeMode}
                                    size="icon"
                                    className={cn(
                                        "h-8 w-8",
                                        activeDropMode === "Handhole"
                                            ? "bg-black text-white hover:bg-gray-800"
                                            : "bg-white text-black hover:bg-gray-100"
                                    )}
                                >
                                    <SquareSquare className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">Drop Handhole Marker</TooltipContent>
                        </Tooltip>

                        {/* Drop TieIn Marker */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={activeDropMode === "TieIn" ? "default" : "outline"}
                                    onClick={toggleDropTieInMode}
                                    size="icon"
                                    className={cn(
                                        "h-8 w-8",
                                        activeDropMode === "TieIn"
                                            ? "bg-black text-white hover:bg-gray-800"
                                            : "bg-white text-black hover:bg-gray-100"
                                    )}
                                >
                                    <SquareX className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">Drop Tie-In Marker</TooltipContent>
                        </Tooltip>

                        {/* Draw Lines */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={toggleMeasureDistanceMode}
                                    size="icon"
                                    className={cn(
                                        "h-8 w-8 shadow-md border border-gray-300 rounded-md",
                                        measureDistanceMode
                                            ? "bg-black text-white hover:bg-gray-800"
                                            : "bg-white text-black hover:bg-gray-100"
                                    )}
                                >
                                    <Spline className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">Draw Lines</TooltipContent>
                        </Tooltip>

                        {/* Edit Markers */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={toggleEditMode}
                                    size="icon"
                                    className={cn(
                                        "h-8 w-8 shadow-md border border-gray-300 rounded-md",
                                        editMode
                                            ? "bg-black text-white hover:bg-gray-800"
                                            : "bg-white text-black hover:bg-gray-100"
                                    )}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">Edit Markers</TooltipContent>
                        </Tooltip>

                    </div>
                )}
            </div>
        </TooltipProvider>
    );
};

export default MapToolbar;
