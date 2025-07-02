
import { useNavigate } from "react-router-dom";
import { InventoryList } from "@/components/InventoryList";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { InventoryItem } from "./Index";

const LowStock = () => {
  const navigate = useNavigate();
  const { items, loading, updateItem, deleteItem } = useInventory();

  // Convert Supabase items to the expected format and filter for low stock
  const inventoryItems: InventoryItem[] = items
    .map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      minStock: item.min_stock,
      purchasePrice: item.purchase_price,
      sellingPrice: item.selling_price,
      supplier: item.supplier,
      lastUpdated: new Date(item.updated_at)
    }))
    .filter(item => item.quantity <= item.minStock);

  const handleUpdateItem = async (updatedItem: InventoryItem) => {
    await updateItem(updatedItem.id, {
      name: updatedItem.name,
      category: updatedItem.category,
      quantity: updatedItem.quantity,
      unit: updatedItem.unit,
      min_stock: updatedItem.minStock,
      purchase_price: updatedItem.purchasePrice,
      selling_price: updatedItem.sellingPrice,
      supplier: updatedItem.supplier,
    });
  };

  const handleDeleteItem = async (id: string) => {
    await deleteItem(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-xl">Loading inventory...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-blue-200 hover:text-white hover:bg-slate-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center space-x-3 mb-2">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              Low Stock Items
            </h1>
          </div>
          <p className="text-blue-200 text-lg">Items that need immediate attention for restocking</p>
        </div>

        {inventoryItems.length > 0 ? (
          <InventoryList 
            items={inventoryItems} 
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">All Items Well Stocked!</h2>
            <p className="text-blue-200">No items are currently running low on stock.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LowStock;
