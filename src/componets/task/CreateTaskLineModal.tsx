import React, { useState } from "react";
import { Input } from "../project/components/ui/Input";
import { Button } from "../project/components/ui/botton";
import { Label } from "../project/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../project/project-map/ui/select";

import type { TaskLineData, LineType } from "../project/project-map/types/task-types";

export interface CreateTaskLineModalProps {
    id: string;
    midpoint: google.maps.LatLng;
    onSubmit: (data: TaskLineData) => void;
    onCancel: () => void;
    onTypeChange: (type: LineType) => void;
}

const CreateTaskLineModal: React.FC<CreateTaskLineModalProps> = ({
    id,
    midpoint,
    onSubmit,
    onCancel,
    onTypeChange,
}) => {
    const [name, setName] = useState(""); // 👈 NUEVO
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
        if (!name || !pointAName || !pointBName || !cableType) return;

        onSubmit({
            id,
            name, // 👈 NUEVO
            midpoint,
            pointAName,
            pointBName,
            cableType,
            type,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 w-full max-w-md space-y-4 bg-white rounded-xl">
            <h2 className="text-lg font-semibold text-center">Create Line</h2>
            <div className="flex flex-col space-y-1">
                <Label htmlFor="lineName">Line Name</Label>
                <Input
                    id="lineName"
                    className="border border-gray-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            {/* Type */}
            <div className="flex flex-col space-y-1">
                <Label>Type</Label>
                <div className="flex items-center gap-4">
                    {["Primary", "Secondary"].map((t) => (
                        <label key={t} className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                name="type"
                                value={t}
                                checked={type === t}
                                onChange={() => handleTypeChange(t as LineType)}
                                className="accent-black"
                            />
                            {t}
                        </label>
                    ))}
                </div>
            </div>

            {/* Point A */}
            <div className="flex flex-col space-y-1">
                <Label htmlFor="pointA">Point A Name</Label>
                <Input
                    id="pointA"
                    className="border border-gray-300"
                    value={pointAName}
                    onChange={(e) => setPointAName(e.target.value)}
                    required
                />
            </div>

            {/* Point B */}
            <div className="flex flex-col space-y-1">
                <Label htmlFor="pointB">Point B Name</Label>
                <Input
                    id="pointB"
                    className="border border-gray-300"
                    value={pointBName}
                    onChange={(e) => setPointBName(e.target.value)}
                    required
                />
            </div>

            {/* Cable Type */}
            <div className="flex flex-col space-y-1">
                <Label htmlFor="cable">Cable Type</Label>
                <Select value={cableType} onValueChange={setCableType}>
                    <SelectTrigger id="cable">
                        <SelectValue placeholder="Select cable type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        {["1/2", "2/2", "3/2", "4/2", "5/2", "6/2", "1/6", "2/6", "3/6"].map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4">
                <Button
                    type="button"
                    className="bg-gray-200 text-black hover:bg-gray-300"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                    Save
                </Button>
            </div>
        </form>
    );
};

export default CreateTaskLineModal;
