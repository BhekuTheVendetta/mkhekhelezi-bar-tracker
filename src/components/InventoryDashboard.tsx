import { InventoryItem } from "@/pages/Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Package, TrendingUp, DollarSign } from "lucide-react";

interface InventoryDashboardProps {
  items: InventoryItem[];
}

export const InventoryDashboard = ({ items }: InventoryDashboardProps) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = items.filter(item => item.quantity <= item.minStock);
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.purchasePrice), 0);
  const potentialRevenue = items.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-slate-800 border-slate-600 text-white">
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

      <Card className="bg-slate-800 border-slate-600 text-white">
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

      <Card className="bg-slate-800 border-slate-600 text-white">
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
