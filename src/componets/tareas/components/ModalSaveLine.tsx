import { useState } from "react";
import { Dialog } from "@mui/material";
import { Button } from "../../project/components/ui/botton";

interface ModalSaveLineProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
}

export const ModalSaveLine: React.FC<ModalSaveLineProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [name, setName] = useState("");

    const handleSubmit = () => {
        if (name.trim()) {
            onSave(name.trim());
            setName("");
        }
    };

    const handleClose = () => {
        setName("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <div className="p-6 w-[300px]">
                <h3 className="text-lg font-semibold mb-4">Guardar línea</h3>
                <label className="block text-sm font-medium mb-2">Nombre</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:border-blue-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Línea principal"
                />
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="default" onClick={handleSubmit}>
                        Guardar
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};
