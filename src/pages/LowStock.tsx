import { useNavigate } from "react-router-dom";
import { useInventory, InventoryItem } from "@/hooks/useInventory";
import { InventoryList } from "@/components/InventoryList";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const LowStock = () => {
  const navigate = useNavigate();
  // Use the useInventory hook to get inventory data and functions
  const { items, loading, updateItem, deleteItem } = useInventory();

  // Filter items where quantity is less than or equal to min_stock
  const lowStockItems = items.filter(item => item.quantity <= item.min_stock);

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

        {loading ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-2">Loading...</h2>
            <p className="text-blue-200">Fetching inventory data...</p>
          </div>
        ) : lowStockItems.length > 0 ? (
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