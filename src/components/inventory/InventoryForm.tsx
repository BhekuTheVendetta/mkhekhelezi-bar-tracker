
import { useState } from "react";
import { ItemFormFields } from "@/components/forms/ItemFormFields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventory } from "@/hooks/useInventory";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export const InventoryForm = () => {
  const navigate = useNavigate();
  const { saveItem, saving } = useInventory();
  
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.category || !formData.quantity) {
      console.log('Validation failed - missing required fields');
      return;
    }

    try {
      console.log('Form submission started with data:', formData);
      
      const itemToSave = {
        name: formData.name,
        category: formData.category,
        quantity: parseInt(formData.quantity) || 0,
        unit: formData.unit || 'pieces',
        min_stock: parseInt(formData.minStock) || 0,
        purchase_price: parseFloat(formData.purchasePrice) || 0,
        selling_price: parseFloat(formData.sellingPrice) || 0,
        supplier: formData.supplier || '',
      };

      console.log('Saving item with processed data:', itemToSave);
      await saveItem(itemToSave);

      // Reset form on successful save
      setFormData({
        name: "",
        category: "",
        quantity: "",
        unit: "",
        minStock: "",
        purchasePrice: "",
        sellingPrice: "",
        supplier: "",
      });
      
      console.log('Form reset after successful save');
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Add Inventory Item</h1>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="bg-blue-600 text-white border-blue-500 hover:bg-blue-700"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ItemFormFields
              formData={formData}
              onInputChange={handleInputChange}
              idPrefix="add-item"
            />
            
            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {saving ? "Saving..." : "Add Item"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
