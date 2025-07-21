import { useState } from "react";
import { InventoryItem } from "@/hooks/useInventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditItemDialog } from "./EditItemDialog";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InventoryListProps {
  items: InventoryItem[];
  onUpdateItem: (id: string, updates: Partial<InventoryItem>) => void;
  onDeleteItem: (id: string) => void;
}

export const InventoryList = ({ items, onUpdateItem, onDeleteItem }: InventoryListProps) => {
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
  };

  const handleDelete = (id: string) => {
    onDeleteItem(id);
    toast({
      title: "Success",
      description: "Item deleted successfully",
    });
  };

  const handleSave = (updatedItem: InventoryItem) => {
    onUpdateItem(updatedItem.id, updatedItem);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Inventory Items</h2>
        <div className="text-sm text-blue-200">
          {items.length} items • {items.filter(item => item.quantity <= item.min_stock).length} low stock
        </div>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id} className="bg-slate-800 border-slate-600">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg">{item.name}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      {item.category}
                    </Badge>
                    {item.quantity <= item.min_stock && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Low Stock
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="border-slate-600 text-blue-400 hover:bg-slate-700"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-blue-200">Quantity</p>
                  <p className="text-white font-medium">{item.quantity} {item.unit}</p>
                </div>
                <div>
                  <p className="text-blue-200">Min Stock</p>
                  <p className="text-white font-medium">{item.min_stock} {item.unit}</p>
                </div>
                <div>
                  <p className="text-blue-200">Purchase Price</p>
                  <p className="text-white font-medium">${item.purchase_price}</p>
                </div>
                <div>
                  <p className="text-blue-200">Selling Price</p>
                  <p className="text-white font-medium">${item.selling_price}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-blue-200">Supplier</p>
                  <p className="text-white font-medium">{item.supplier}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-blue-200">Last Updated</p>
                  <p className="text-white font-medium">{new Date(item.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingItem && (
        <EditItemDialog
          item={editingItem}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};