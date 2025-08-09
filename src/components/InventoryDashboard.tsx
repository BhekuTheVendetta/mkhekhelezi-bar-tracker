import React from "react";
import { InventoryItem } from "@/hooks/useInventory"; // Updated import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Package, TrendingUp, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InventoryDashboardProps {
  items: InventoryItem[];
  onNavigateToInventory: () => void;
}

export const InventoryDashboard = ({ items, onNavigateToInventory }: InventoryDashboardProps) => {
  const navigate = useNavigate();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = items.filter(item => item.quantity <= item.min_stock); // Updated to min_stock
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.purchase_price), 0); // Updated to purchase_price
  const potentialRevenue = items.reduce((sum, item) => sum + (item.quantity * item.selling_price), 0); // Updated to selling_price

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card 
        className="bg-slate-800 border-slate-600 text-white cursor-pointer hover:bg-slate-700 transition-colors"
        onClick={onNavigateToInventory}
      >
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Total Items</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems}</div>
          <p className="text-blue-200">Total number of items in stock</p>
        </CardContent>
      </Card>

      <Card 
        className="bg-slate-800 border-slate-600 text-white cursor-pointer hover:bg-slate-700 transition-colors"
        onClick={() => navigate("/low-stock")}
      >
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Low Stock</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockItems.length}</div>
          <p className="text-blue-200">Items that need restocking</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Total Value</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          <p className="text-blue-200">Total purchase value of stock</p>
        </CardContent>
      </Card>

      <Card 
        className="bg-slate-800 border-slate-600 text-white cursor-pointer hover:bg-slate-700 transition-colors"
        onClick={() => navigate("/potential-revenue")}
      >
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Potential Revenue</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${potentialRevenue.toFixed(2)}</div>
          <p className="text-blue-200">Potential revenue from current stock</p>
        </CardContent>
      </Card>
    </div>
  );
};