import {
    Dialog,
    DialogContent
} from "../../project/components/ui/dialog";

import CreateTaskLineModal from "../CreateTaskLineModal";
import type { TaskLineData, LineType } from "../../project/project-map/types/task-types";

interface Props {
    isOpen: boolean;
    id: string;
    midpoint: google.maps.LatLng;
    onSubmit: (data: TaskLineData) => void;
    onCancel: () => void;
    onTypeChange: (type: LineType) => void;
}

export const CreateTaskLineWrapperModal = ({
    isOpen,
    id,
    midpoint,
    onSubmit,
    onCancel,
    onTypeChange,
}: Props) => {
    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="sm:max-w-[500px] flex items-center justify-center min-h-[400px] bg-white">
                <CreateTaskLineModal
                    id={id}
                    midpoint={midpoint}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    onTypeChange={onTypeChange}
                />
            </DialogContent>
        </Dialog>
    );
};
