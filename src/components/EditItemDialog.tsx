
import { InventoryItem } from "@/pages/Index";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditItemForm } from "./forms/EditItemForm";

interface EditItemDialogProps {
  item: InventoryItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
}

export const EditItemDialog = ({ item, isOpen, onClose, onSave }: EditItemDialogProps) => {
  const handleSave = (updatedItem: InventoryItem) => {
    onSave(updatedItem);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Inventory Item</DialogTitle>
        </DialogHeader>
        
        <EditItemForm
          item={item}
          onSave={handleSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
