
import { useState, useEffect } from "react";
import { InventoryItem } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ItemFormFields } from "./ItemFormFields";

interface EditItemFormProps {
  item: InventoryItem;
  onSave: (item: InventoryItem) => void;
  onCancel: () => void;
}

export const EditItemForm = ({ item, onSave, onCancel }: EditItemFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    minStock: "",
    purchasePrice: "",
    sellingPrice: "",
    supplier: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity.toString(),
        unit: item.unit,
        minStock: item.minStock.toString(),
        purchasePrice: item.purchasePrice.toString(),
        sellingPrice: item.sellingPrice.toString(),
        supplier: item.supplier,
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.quantity || !formData.unit || !formData.minStock || !formData.purchasePrice || !formData.sellingPrice || !formData.supplier) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const updatedItem: InventoryItem = {
      ...item,
      name: formData.name,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      unit: formData.unit,
      minStock: parseInt(formData.minStock),
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      supplier: formData.supplier,
      lastUpdated: new Date(),
    };

    onSave(updatedItem);

    toast({
      title: "Success",
      description: "Item updated successfully",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ItemFormFields
        formData={formData}
        onInputChange={handleInputChange}
        idPrefix="edit"
      />

      <div className="flex space-x-3 pt-6">
        <Button 
          type="submit" 
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
};
