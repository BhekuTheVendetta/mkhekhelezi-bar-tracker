
import { InventoryItem } from "@/pages/Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, TrendingDown, DollarSign } from "lucide-react";

interface InventoryDashboardProps {
  items: InventoryItem[];
}

export const InventoryDashboard = ({ items }: InventoryDashboardProps) => {
  const lowStockItems = items.filter(item => item.quantity <= item.minStock);
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const categoryStats = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total Items</p>
                <p className="text-2xl font-bold text-white">{totalItems}</p>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Inventory Value</p>
                <p className="text-2xl font-bold text-white">${totalValue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Low Stock Items</p>
                <p className="text-2xl font-bold text-white">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Categories</p>
                <p className="text-2xl font-bold text-white">{Object.keys(categoryStats).length}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-600/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span>Low Stock Alert</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockItems.map(item => (
                <div key={item.id} className="bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white">{item.name}</h4>
                  <p className="text-sm text-red-300">
                    Only {item.quantity} {item.unit} left
                  </p>
                  <Badge variant="destructive" className="mt-2">
                    Reorder needed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Overview */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Category Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="bg-slate-700/50 p-4 rounded-lg text-center">
                <p className="text-lg font-bold text-white">{count}</p>
                <p className="text-sm text-blue-200">{category}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
