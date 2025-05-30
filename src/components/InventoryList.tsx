
import { useState } from "react";
import { InventoryItem } from "@/pages/Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Edit, Trash2, Package } from "lucide-react";
import { EditItemDialog } from "@/components/EditItemDialog";

interface InventoryListProps {
  items: InventoryItem[];
  onUpdateItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
}

export const InventoryList = ({ items, onUpdateItem, onDeleteItem }: InventoryListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const categories = ["all", ...new Set(items.map(item => item.category))];
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.minStock) return "low";
    if (item.quantity <= item.minStock * 1.5) return "medium";
    return "good";
  };

  const getStockBadge = (item: InventoryItem) => {
    const status = getStockStatus(item);
    if (status === "low") return <Badge variant="destructive">Low Stock</Badge>;
    if (status === "medium") return <Badge variant="secondary" className="bg-yellow-600">Medium</Badge>;
    return <Badge variant="default" className="bg-green-600">In Stock</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search items or suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {categories.map(category => (
                  <SelectItem key={category} value={category} className="text-white">
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <Card key={item.id} className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 hover:border-slate-500 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white text-lg">{item.name}</CardTitle>
                  <p className="text-blue-200 text-sm">{item.category}</p>
                </div>
                <Package className="w-6 h-6 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Quantity:</span>
                  <span className="text-white font-semibold">{item.quantity} {item.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Min Stock:</span>
                  <span className="text-white">{item.minStock} {item.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Price:</span>
                  <span className="text-white font-semibold">${item.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Supplier:</span>
                  <span className="text-white text-sm">{item.supplier}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                {getStockBadge(item)}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingItem(item)}
                    className="border-slate-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeleteItem(item.id)}
                    className="border-slate-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No items found</p>
            <p className="text-slate-500 text-sm">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}

      {editingItem && (
        <EditItemDialog
          item={editingItem}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={onUpdateItem}
        />
      )}
    </div>
  );
};
