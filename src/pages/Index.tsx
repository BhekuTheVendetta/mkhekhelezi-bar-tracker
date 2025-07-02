
import { useState } from "react";
import { InventoryDashboard } from "@/components/InventoryDashboard";
import { InventoryList } from "@/components/InventoryList";
import { AddItemForm } from "@/components/AddItemForm";
import { Navbar } from "@/components/Navbar";
import { Package, Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInventory } from "@/hooks/useInventory";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  purchasePrice: number;
  sellingPrice: number;
  supplier: string;
  lastUpdated: Date;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "inventory" | "add">("dashboard");
  const { items, loading, updateItem, deleteItem } = useInventory();

  // Convert Supabase items to the expected format
  const inventoryItems: InventoryItem[] = items.map(item => ({
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
  }));

  const addItem = (newItem: Omit<InventoryItem, "id">) => {
    // This functionality is now handled by the AddItemForm component
    // which uses the useInventory hook directly
    setActiveTab("inventory");
  };

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

  const handleNavigateToInventory = () => {
    setActiveTab("inventory");
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
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            Mkhekhelezi GLC
          </h1>
          <p className="text-blue-200 text-lg">Bar Inventory Management System</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800/50 p-1 rounded-lg backdrop-blur-sm">
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center space-x-2 ${
              activeTab === "dashboard" 
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white" 
                : "text-blue-200 hover:text-white hover:bg-slate-700"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </Button>
          
          <Button
            variant={activeTab === "inventory" ? "default" : "ghost"}
            onClick={() => setActiveTab("inventory")}
            className={`flex items-center space-x-2 ${
              activeTab === "inventory" 
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white" 
                : "text-blue-200 hover:text-white hover:bg-slate-700"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory</span>
          </Button>
          
          <Button
            variant={activeTab === "add" ? "default" : "ghost"}
            onClick={() => setActiveTab("add")}
            className={`flex items-center space-x-2 ${
              activeTab === "add" 
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white" 
                : "text-blue-200 hover:text-white hover:bg-slate-700"
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </Button>
        </div>

        {/* Content */}
        <div className="animate-in fade-in-0 duration-500">
          {activeTab === "dashboard" && (
            <InventoryDashboard 
              items={inventoryItems} 
              onNavigateToInventory={handleNavigateToInventory}
            />
          )}
          {activeTab === "inventory" && (
            <InventoryList 
              items={inventoryItems} 
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
            />
          )}
          {activeTab === "add" && <AddItemForm onAddItem={addItem} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
