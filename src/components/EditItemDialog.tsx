
import { useState, useEffect } from "react";
import { InventoryItem } from "@/pages/Index";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditItemDialogProps {
  item: InventoryItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
}

const categories = ["Spirits", "Beer", "Wine", "Mixers", "Snacks", "Glassware", "Supplies"];
const units = ["bottles", "cases", "liters", "pieces", "boxes", "kegs"];

export const EditItemDialog = ({ item, isOpen, onClose, onSave }: EditItemDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    minStock: "",
    price: "",
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
        price: item.price.toString(),
        supplier: item.supplier,
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.quantity || !formData.unit || !formData.minStock || !formData.price || !formData.supplier) {
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
      price: parseFloat(formData.price),
      supplier: formData.supplier,
      lastUpdated: new Date(),
    };

    onSave(updatedItem);
    onClose();

    toast({
      title: "Success",
      description: "Item updated successfully",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-600 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Inventory Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-blue-200">Item Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category" className="text-blue-200">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {categories.map(category => (
                    <SelectItem key={category} value={category} className="text-white">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-quantity" className="text-blue-200">Current Quantity</Label>
              <Input
                id="edit-quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-unit" className="text-blue-200">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {units.map(unit => (
                    <SelectItem key={unit} value={unit} className="text-white">
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-minStock" className="text-blue-200">Minimum Stock Level</Label>
              <Input
                id="edit-minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => handleInputChange("minStock", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price" className="text-blue-200">Price per Unit ($)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-supplier" className="text-blue-200">Supplier</Label>
            <Input
              id="edit-supplier"
              value={formData.supplier}
              onChange={(e) => handleInputChange("supplier", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

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
              onClick={onClose}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
