import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../project/components/ui/dialog"
import { Button } from "../project/components/ui/botton"
import { Input } from "../project/components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../project/project-map/ui/select"
import { Checkbox } from "../project/project-map/ui/checkbox"
import { Label } from "../project/components/ui/label"

import type { Task } from "../project/project-map/types/task-types"

interface Props {
    isOpen: boolean
    onClose: () => void
    task: Task
    onSave: (id: string, updatedTask: Partial<Task>) => void
}

export const EditTaskModal = ({ isOpen, onClose, task, onSave }: Props) => {
    const [formState, setFormState] = useState<Partial<Task>>({})

    // Inicializa el formulario
    useEffect(() => {
        setFormState({ ...task })
    }, [task])

    const handleChange = (key: keyof Task, value: any) => {
        setFormState((prev) => ({ ...prev, [key]: value }))
    }

    const handleFeatureToggle = (feature: string) => {
        const features = formState.features || []
        if (features.includes(feature)) {
            handleChange(
                "features",
                features.filter((f) => f !== feature)
            )
        } else {
            handleChange("features", [...features, feature])
        }
    }

    const editableFieldsByType: Record<Task["type"], (keyof Task)[]> = {
        TX: ["txNumber", "status", "handholeType"],
        Service: ["serviceNumber", "relatedTxNumber", "status", "handholeType", "features"],
        Handhole: ["handholeNumber", "handholeType", "relatedTxNumber", "status"],
        TieIn: ["relatedTxNumber", "tieInDescription", "handholeType", "status"],
        Line: ["status"],
    }

    const editableKeys = editableFieldsByType[task.type] || []

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg bg-white">
                <DialogHeader>
                    <DialogTitle>Edit {task.type} Task</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        onSave(task.id, formState)
                        onClose()
                    }}
                    className="space-y-4"
                >
                    {editableKeys.map((key) => {
                        if (key === "status") {
                            return (
                                <div key={key} className="space-y-1">
                                    <Label>Status</Label>
                                    <Select
                                        value={formState.status || ""}
                                        onValueChange={(val) => handleChange("status", val)}
                                    >
                                        <SelectTrigger className="h-8 text-sm px-2">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="Approved">Approved</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )
                        }

                        if (key === "features") {
                            return (
                                <div key="features" className="space-y-1">
                                    <Label>Features</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {["OW", "TAP", "CC", "UG", "OH"].map((feature) => (
                                            <div key={feature} className="flex items-center space-x-2 text-sm">
                                                <Checkbox
                                                    id={feature}
                                                    checked={formState.features?.includes(feature)}
                                                    onCheckedChange={() => handleFeatureToggle(feature)}
                                                />
                                                <label htmlFor={feature}>{feature}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }

                        return (
                            <div key={key} className="space-y-1">
                                <Label>{key}</Label>
                                <Input
                                    value={formState[key] ?? ""}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    className="h-8 text-sm"
                                />
                            </div>
                        )
                    })}

                    <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
