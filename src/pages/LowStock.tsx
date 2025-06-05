
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InventoryItem } from "./Index";
import { InventoryList } from "@/components/InventoryList";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const LowStock = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load inventory items from localStorage or use default data
    const savedItems = localStorage.getItem("inventoryItems");
    if (savedItems) {
      const items = JSON.parse(savedItems);
      // Convert date strings back to Date objects
      const itemsWithDates = items.map((item: any) => ({
        ...item,
        lastUpdated: new Date(item.lastUpdated)
      }));
      setInventoryItems(itemsWithDates);
    } else {
      // Use default items if none saved
      const defaultItems: InventoryItem[] = [
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
      ];
      setInventoryItems(defaultItems);
    }
  }, []);

  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.minStock);

  const updateItem = (updatedItem: InventoryItem) => {
    const updatedItems = inventoryItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    setInventoryItems(updatedItems);
    localStorage.setItem("inventoryItems", JSON.stringify(updatedItems));
  };

  const deleteItem = (id: string) => {
    const updatedItems = inventoryItems.filter(item => item.id !== id);
    setInventoryItems(updatedItems);
    localStorage.setItem("inventoryItems", JSON.stringify(updatedItems));
  };

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

        {lowStockItems.length > 0 ? (
          <InventoryList 
            items={lowStockItems} 
            onUpdateItem={updateItem}
            onDeleteItem={deleteItem}
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
