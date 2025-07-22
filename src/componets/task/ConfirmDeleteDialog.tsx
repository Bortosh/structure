import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../project/components/ui/dialog'
import { Button } from '../project/components/ui/botton'

interface ConfirmDeleteDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white'>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground mb-4">
                    This action cannot be undone. The task will be permanently removed from the list.
                </p>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="default" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="default" onClick={onConfirm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
