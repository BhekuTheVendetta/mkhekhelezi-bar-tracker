import { useState } from "react";
import { InventoryDashboard } from "@/components/InventoryDashboard";
import { InventoryList } from "@/components/InventoryList";
import { AddItemForm } from "@/components/AddItemForm";
import { Navbar } from "@/components/Navbar";
import { Package, Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Jack Daniels",
      category: "Spirits",
      quantity: 12,
      unit: "bottles",
      minStock: 5,
      purchasePrice: 35.99,
      sellingPrice: 45.99,
      supplier: "Premium Spirits Co.",
      lastUpdated: new Date("2024-05-28")
    },
    {
      id: "2",
      name: "Heineken",
      category: "Beer",
      quantity: 3,
      unit: "cases",
      minStock: 5,
      purchasePrice: 22.50,
      sellingPrice: 28.50,
      supplier: "Beer Distributors",
      lastUpdated: new Date("2024-05-29")
    },
    {
      id: "3",
      name: "Cabernet Sauvignon",
      category: "Wine",
      quantity: 8,
      unit: "bottles",
      minStock: 3,
      purchasePrice: 24.00,
      sellingPrice: 32.00,
      supplier: "Wine Merchants",
      lastUpdated: new Date("2024-05-27")
    },
    {
      id: "4",
      name: "Coca Cola",
      category: "Mixers",
      quantity: 2,
      unit: "cases",
      minStock: 4,
      purchasePrice: 14.75,
      sellingPrice: 18.75,
      supplier: "Beverage Supply",
      lastUpdated: new Date("2024-05-30")
    }
  ]);

  const addItem = (newItem: Omit<InventoryItem, "id">) => {
    const item: InventoryItem = {
      ...newItem,
      id: Date.now().toString(),
    };
    setInventoryItems([...inventoryItems, item]);
    setActiveTab("inventory");
  };

  const updateItem = (updatedItem: InventoryItem) => {
    setInventoryItems(items =>
      items.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
  };

  const deleteItem = (id: string) => {
    setInventoryItems(items => items.filter(item => item.id !== id));
  };

  const handleNavigateToInventory = () => {
    setActiveTab("inventory");
  };

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
              onUpdateItem={updateItem}
              onDeleteItem={deleteItem}
            />
          )}
          {activeTab === "add" && <AddItemForm onAddItem={addItem} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
