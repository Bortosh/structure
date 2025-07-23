import React, { useState } from "react";
import { Button } from "../components/ui/botton";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";

export interface MarkerFormData {
    id: string;
    lat: number;
    lng: number;
    type: "TX" | "Service" | "Handhole" | "TieIn";
    txNumber?: string;
    serviceNumber?: string;
    relatedTxNumber?: string;
    status: string;
    features?: string[];
    handholeType?: string;
    handholeNumber?: string;
    tieInDescription?: string;
}

interface MarkerFormProps {
    id: string;
    lat: number;
    lng: number;
    type: "TX" | "Service" | "Handhole" | "TieIn";
    onSubmit: (data: MarkerFormData) => void;
    onCancel?: () => void;
}

const MarkerForm: React.FC<MarkerFormProps> = ({
    id,
    lat,
    lng,
    type,
    onSubmit,
    onCancel,
}) => {
    const [txNumber, setTxNumber] = useState("");
    const [serviceNumber, setServiceNumber] = useState("");
    const [relatedTxNumber, setRelatedTxNumber] = useState("");
    const [status, setStatus] = useState("Approved");
    const [features, setFeatures] = useState<string[]>([]);
    const [handholeType, setHandholeType] = useState("HH17");
    const [handholeNumber, setHandholeNumber] = useState("");
    const [tieInDescription, setTieInDescription] = useState("");

    const handleFeatureToggle = (feature: string) => {
        setFeatures((prev) =>
            prev.includes(feature)
                ? prev.filter((f) => f !== feature)
                : [...prev, feature]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const markerData: MarkerFormData = {
            id,
            lat,
            lng,
            type,
            txNumber,
            serviceNumber,
            relatedTxNumber,
            status,
            features,
            handholeType,
            handholeNumber,
            tieInDescription,
        };

        onSubmit(markerData);
    };

    const renderFields = () => {
        if (type === "TX") {
            return (
                <>
                    {/* TX Number */}
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="txNumber" className="text-sm flex-shrink-0">
                            TX Number
                        </Label>
                        <Input
                            id="txNumber"
                            value={txNumber}
                            onChange={(e) => setTxNumber(e.target.value)}
                            placeholder="#"
                            className="h-8 text-sm flex-grow"
                            required
                        />
                    </div>

                    {/* Status */}
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="status" className="text-sm flex-shrink-0">
                            Status
                        </Label>
                        <Select value={status} onValueChange={(val) => setStatus(val)}>
                            <SelectTrigger id="status" className="h-8 text-sm flex-grow px-2">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent align="start" sideOffset={0} className="min-w-[120px] bg-white">
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Existing">Existing</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            );
        }

        if (type === "Service") {
            return (
                <>
                    {/* Service Number */}
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="serviceNumber" className="text-sm flex-shrink-0">
                            Service #
                        </Label>
                        <Input
                            id="serviceNumber"
                            value={serviceNumber}
                            onChange={(e) => setServiceNumber(e.target.value)}
                            placeholder="#"
                            className="h-8 text-sm flex-grow"
                            required
                        />
                    </div>

                    {/* Related TX Number */}
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="relatedTxNumber" className="text-sm flex-shrink-0">
                            Related TX
                        </Label>
                        <Input
                            id="relatedTxNumber"
                            value={relatedTxNumber}
                            onChange={(e) => setRelatedTxNumber(e.target.value)}
                            placeholder="#"
                            className="h-8 text-sm flex-grow"
                            required
                        />
                    </div>

                    {/* Status */}
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="status" className="text-sm flex-shrink-0">
                            Status
                        </Label>
                        <Select value={status} onValueChange={(val) => setStatus(val)}>
                            <SelectTrigger id="status" className="h-8 text-sm flex-grow px-2">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent align="start" sideOffset={0} className="min-w-[120px]">
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Features */}
                    <div className="flex flex-col space-y-1 pt-2">
                        <Label>Features</Label>
                        <div className="flex flex-wrap gap-2">
                            {["OW", "TAP", "CC", "UG", "OH"].map((feature) => (
                                <div key={feature} className="flex items-center space-x-2 text-sm">
                                    <Checkbox
                                        id={feature}
                                        checked={features.includes(feature)}
                                        onCheckedChange={() => handleFeatureToggle(feature)}
                                    />
                                    <label htmlFor={feature}>{feature}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            );
        }

        if (type === "Handhole") {
            return (
                <>
                    {/* Handhole Type */}
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="handholeType" className="text-sm flex-shrink-0">
                            Type
                        </Label>
                        <Select value={handholeType} onValueChange={(val) => setHandholeType(val)}>
                            <SelectTrigger id="handholeType" className="h-8 text-sm flex-grow px-2">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent align="start" sideOffset={0} className="min-w-[120px]">
                                <SelectItem value="HH17">HH17</SelectItem>
                                <SelectItem value="HH24">HH24</SelectItem>
                                <SelectItem value="HH30">HH30</SelectItem>
                                <SelectItem value="HH48">HH48</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* HH Number */}
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="handholeNumber" className="text-sm flex-shrink-0">
                            HH #
                        </Label>
                        <Input
                            id="handholeNumber"
                            value={handholeNumber}
                            onChange={(e) => setHandholeNumber(e.target.value)}
                            placeholder="#"
                            className="h-8 text-sm flex-grow"
                            required
                        />
                    </div>

                    {/* Related TX Number */}
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="relatedTxNumber" className="text-sm flex-shrink-0">
                            Related TX
                        </Label>
                        <Input
                            id="relatedTxNumber"
                            value={relatedTxNumber}
                            onChange={(e) => setRelatedTxNumber(e.target.value)}
                            placeholder="#"
                            className="h-8 text-sm flex-grow"
                            required
                        />
                    </div>
                </>
            );
        }

        if (type === "TieIn") {
            return (
                <>
                    {/* TieIn Description */}
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="tieInDescription" className="text-sm flex-shrink-0">
                            Tie In
                        </Label>
                        <Input
                            id="tieInDescription"
                            value={tieInDescription}
                            onChange={(e) => setTieInDescription(e.target.value)}
                            placeholder="Bore to Tie In"
                            className="h-8 text-sm flex-grow"
                            required
                        />
                    </div>

                    {/* Related TX Number */}
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="relatedTxNumber" className="text-sm flex-shrink-0">
                            Related TX
                        </Label>
                        <Input
                            id="relatedTxNumber"
                            value={relatedTxNumber}
                            onChange={(e) => setRelatedTxNumber(e.target.value)}
                            placeholder="#"
                            className="h-8 text-sm flex-grow"
                            required
                        />
                    </div>
                </>
            );
        }

        return null;
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3 w-[180px] p-2">
            <div className="flex flex-col space-y-1">
                <h3 className="text-base font-semibold">{type} Marker</h3>
                <p className="text-xs text-muted-foreground">ID: {id}</p>
            </div>

            {renderFields()}

            <div className="flex justify-end space-x-2 pt-1">
                {onCancel && (
                    <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" size="sm">
                    Save
                </Button>
            </div>
        </form>
    );
};

export default MarkerForm;
