"use client";

import React, { useState } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/botton";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export interface LineSegmentFormPopoverProps {
    id: string;
    midpoint: google.maps.LatLng;
    onSubmit: (data: {
        id: string;
        midpoint: google.maps.LatLng;
        pointAName: string;
        pointBName: string;
        cableType: string;
        type: "Primary" | "Secondary";
    }) => void;
    onCancel: () => void;
    onTypeChange: (type: "Primary" | "Secondary") => void;
}

const LineSegmentFormPopover: React.FC<LineSegmentFormPopoverProps> = ({
    id,
    midpoint,
    onSubmit,
    onCancel,
    onTypeChange,
}) => {
    const [pointAName, setPointAName] = useState("");
    const [pointBName, setPointBName] = useState("");
    const [cableType, setCableType] = useState("");
    const [type, setType] = useState<"Primary" | "Secondary">("Primary");

    const handleTypeChange = (newType: "Primary" | "Secondary") => {
        setType(newType);
        onTypeChange(newType);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pointAName || !pointBName || !cableType || !type) return;

        onSubmit({
            id,
            midpoint,
            pointAName,
            pointBName,
            cableType,
            type,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-2 w-[220px] space-y-3">
            <div className="flex flex-col space-y-1">
                <Label>Type</Label>
                <div className="flex gap-2">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="type"
                            value="Primary"
                            checked={type === "Primary"}
                            onChange={() => handleTypeChange("Primary")}
                        />
                        <span>Primary</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="type"
                            value="Secondary"
                            checked={type === "Secondary"}
                            onChange={() => handleTypeChange("Secondary")}
                        />
                        <span>Secondary</span>
                    </label>
                </div>
            </div>

            <div className="flex flex-col space-y-1">
                <Label htmlFor="pointA">Point A Name</Label>
                <Input
                    id="pointA"
                    value={pointAName}
                    onChange={(e) => setPointAName(e.target.value)}
                    required
                />
            </div>

            <div className="flex flex-col space-y-1">
                <Label htmlFor="pointB">Point B Name</Label>
                <Input
                    id="pointB"
                    value={pointBName}
                    onChange={(e) => setPointBName(e.target.value)}
                    required
                />
            </div>

            <div className="flex flex-col space-y-1">
                <Label htmlFor="cable">Cable Type</Label>
                <Select value={cableType} onValueChange={setCableType}>
                    <SelectTrigger id="cable">
                        <SelectValue placeholder="Select cable type" />
                    </SelectTrigger>
                    <SelectContent>
                        {["1/2", "2/2", "3/2", "4/2", "5/2", "6/2", "1/6", "2/6", "3/6"].map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" size="sm">
                    Save
                </Button>
            </div>
        </form>
    );
};

export default LineSegmentFormPopover;
