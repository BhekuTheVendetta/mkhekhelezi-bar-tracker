
import { useState } from "react";
import { InventoryItem } from "@/pages/Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddItemFormProps {
  onAddItem: (item: Omit<InventoryItem, "id">) => void;
}

const categories = ["Spirits", "Beer", "Wine", "Mixers", "Snacks", "Glassware", "Supplies"];
const units = ["bottles", "cases", "liters", "pieces", "boxes", "kegs"];

export const AddItemForm = ({ onAddItem }: AddItemFormProps) => {
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

    const newItem: Omit<InventoryItem, "id"> = {
      name: formData.name,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      unit: formData.unit,
      minStock: parseInt(formData.minStock),
      price: parseFloat(formData.price),
      supplier: formData.supplier,
      lastUpdated: new Date(),
    };

    onAddItem(newItem);
    
    // Reset form
    setFormData({
      name: "",
      category: "",
      quantity: "",
      unit: "",
      minStock: "",
      price: "",
      supplier: "",
    });

    toast({
      title: "Success",
      description: "Item added to inventory successfully",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Package className="w-6 h-6 text-blue-400" />
            <span>Add New Inventory Item</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-blue-200">Item Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Jack Daniels"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-blue-200">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select category" />
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
                <Label htmlFor="quantity" className="text-blue-200">Current Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  placeholder="0"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit" className="text-blue-200">Unit</Label>
                <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select unit" />
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
                <Label htmlFor="minStock" className="text-blue-200">Minimum Stock Level</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => handleInputChange("minStock", e.target.value)}
                  placeholder="0"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-blue-200">Price per Unit ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier" className="text-blue-200">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
                placeholder="e.g., Premium Spirits Co."
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item to Inventory
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
