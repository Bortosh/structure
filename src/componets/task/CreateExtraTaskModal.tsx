import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../project/components/ui/dialog"
import { Input } from "../project/components/ui/Input"
import { Label } from "../project/components/ui/label"
import { Button } from "../project/components/ui/botton"
import { useTaskStore } from "../../globalState/taskStorageLegacy"
import { v4 as uuidv4 } from "uuid"
import { useProjectLegacyStore } from "../../globalState/projectLegacyStore"

interface CreateExtraTaskModalProps {
    isOpen: boolean
    onClose: () => void
}

export const CreateExtraTaskModal: React.FC<CreateExtraTaskModalProps> = ({ isOpen, onClose }) => {
    const addExtraTask = useTaskStore((state) => state.addExtraTask)
    const { currentPRojectId, selectedLegacyProject } = useProjectLegacyStore()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [deadline, setDeadline] = useState("")
    const [team, setTeam] = useState("")

    const isFormValid = name && description && deadline && currentPRojectId

    const handleSubmit = () => {
        if (!isFormValid) {
            alert("All fields are required.")
            return
        }

        const newTask = {
            id: uuidv4(),
            name,
            projectName: selectedLegacyProject ? selectedLegacyProject.name : '',
            description,
            status: 'Active',
            deadline,
            team,
            projectId: currentPRojectId
        }

        addExtraTask(newTask)
        onClose()
        resetForm()
    }

    const resetForm = () => {
        setName("")
        setDescription("")
        setDeadline("")
        setTeam("")
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-gray-200">
                <DialogHeader>
                    <DialogTitle>Create Extra Task</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Extra Task Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                    </div>

                    <div className="flex justify-end gap-5">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={!isFormValid}>
                            Save
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
