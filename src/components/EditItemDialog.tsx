import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InventoryItem } from "@/hooks/useInventory";
import { EditItemForm } from "./forms/EditItemForm";

// Export the interface for use in other files
export interface EditItemDialogProps {
  item: InventoryItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
}

// Type the component explicitly
const EditItemDialog: React.FC<EditItemDialogProps> = ({ item, isOpen, onClose, onSave }) => {
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

export default EditItemDialog;