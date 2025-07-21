import { useState } from "react";
import { useInventory, InventoryItem } from "@/hooks/useInventory";
import { InventoryList } from "@/components/InventoryList";
import { AddItemForm } from "@/components/AddItemForm";
import { Navbar } from "@/components/Navbar";
import { Package, Plus, BarChart3, AlertTriangle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  const { items, loading, saveItem, updateItem, deleteItem } = useInventory();
  const [activeTab, setActiveTab] = useState<"dashboard" | "inventory" | "add">("dashboard");

  // Calculate dashboard metrics
  const totalItems = items.length;
  const lowStockItems = items.filter(item => item.quantity <= item.min_stock).length;
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.purchase_price), 0);
  const totalPotentialRevenue = items.reduce((sum, item) => sum + (item.quantity * item.selling_price), 0);

  // Log metrics for debugging
  console.log('Index - Items:', items);
  console.log('Index - Metrics:', { totalItems, lowStockItems, totalValue, totalPotentialRevenue });

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
          {loading ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-2">Loading...</h2>
              <p className="text-blue-200">Fetching inventory data...</p>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {/* Total Items Card */}
                  <Card 
                    className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 cursor-pointer"
                    onClick={() => setActiveTab("inventory")}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <Package className="w-4 h-4" />
                        <span>Total Items</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalItems}</div>
                      <p className="text-blue-200 text-sm">Items in inventory</p>
                    </CardContent>
                  </Card>

                  {/* Low Stock Card */}
                  <Link to="/low-stock">
                    <Card className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 cursor-pointer">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center space-x-2 text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Low Stock</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{lowStockItems}</div>
                        <p className="text-blue-200 text-sm">Items needing restock</p>
                      </CardContent>
                    </Card>
                  </Link>

                  {/* Total Value Card */}
                  <Card className="bg-slate-800 border-slate-600 text-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <DollarSign className="w-4 h-4" />
                        <span>Total Value</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
                      <p className="text-blue-200 text-sm">Inventory cost</p>
                    </CardContent>
                  </Card>

                  {/* Potential Revenue Card */}
                  <Link to="/potential-revenue">
                    <Card className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 cursor-pointer">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center space-x-2 text-sm">
                          <DollarSign className="w-4 h-4" />
                          <span>Potential Revenue</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${totalPotentialRevenue.toFixed(2)}</div>
                        <p className="text-blue-200 text-sm">From {totalItems} items</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              )}
              {activeTab === "inventory" && (
                <InventoryList 
                  items={items} 
                  onUpdateItem={updateItem}
                  onDeleteItem={deleteItem}
                />
              )}
              {activeTab === "add" && <AddItemForm onAddItem={saveItem} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;