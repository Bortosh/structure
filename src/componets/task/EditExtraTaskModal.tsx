import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../project/components/ui/dialog";
import { Button } from "../project/components/ui/botton";
import { Input } from "../project/components/ui/Input";
import { Label } from "../project/components/ui/label";
import { useTaskStore } from "../../globalState/taskStorageLegacy";

interface EditExtraTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: {
        id: string;
        name: string;
        projectName: string;
        description: string;
        status: string;
        deadline: string;
    };
}

export const EditExtraTaskModal: React.FC<EditExtraTaskModalProps> = ({
    isOpen,
    onClose,
    task,
}) => {
    const [formData, setFormData] = useState(task);
    const updateExtraTask = useTaskStore((state) => state.updateExtraTask);

    useEffect(() => {
        setFormData(task);
    }, [task]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSave = () => {
        updateExtraTask(task.id, formData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-gray-200">
                <DialogHeader>
                    <DialogTitle>Edit Extra Task</DialogTitle>
                </DialogHeader>

                <div className="grid gap-3 py-4">
                    <div className="grid gap-3 py-4">
                        <div className="grid gap-1">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                        </div>

                        <div className="grid gap-1">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" value={formData.description} onChange={handleChange} />
                        </div>

                        <div className="grid gap-1">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input id="deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} />
                        </div>

                        <div className="grid gap-1">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="border rounded px-3 py-2 text-sm"
                            >
                                <option value="Active">Active</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Finalized">Finalized</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button className="hover: cursor-pointer" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button className="hover: cursor-pointer" onClick={handleSave}>Save</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
