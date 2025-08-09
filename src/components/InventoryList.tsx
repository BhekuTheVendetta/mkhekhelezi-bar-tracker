import { useState } from "react";
import { InventoryItem } from "@/hooks/useInventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Home, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EditItemDialog, { EditItemDialogProps } from "@/components/EditItemDialog";

interface InventoryListProps {
  items: InventoryItem[];
  onUpdateItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}

const InventoryList = ({ items, onUpdateItem, onDeleteItem }: InventoryListProps) => {
  const navigate = useNavigate();
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  console.log('InventoryList - Items:', items);

  const handleSave = async (updatedItem: InventoryItem) => {
    try {
      await onUpdateItem(updatedItem.id, {
        name: updatedItem.name,
        category: updatedItem.category,
        quantity: updatedItem.quantity,
        unit: updatedItem.unit,
        min_stock: updatedItem.min_stock,
        purchase_price: updatedItem.purchase_price,
        selling_price: updatedItem.selling_price,
        supplier: updatedItem.supplier,
      });
      setEditItem(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('InventoryList - Save Error:', error);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              Inventory List
            </h1>
            <p className="text-blue-200 text-lg">Manage your inventory items</p>
          </div>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="bg-blue-600 text-white border-blue-500 hover:bg-blue-700"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Inventory Items</h3>
            <p className="text-slate-400 mb-4">Add some items to your inventory.</p>
            <Button
              onClick={() => navigate("/add-item")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add New Item
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            Inventory List
          </h1>
          <p className="text-blue-200 text-lg">Manage your inventory items</p>
        </div>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="bg-blue-600 text-white border-blue-500 hover:bg-blue-700"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 px-4 text-blue-200">Item</th>
                  <th className="text-left py-3 px-4 text-blue-200">Category</th>
                  <th className="text-left py-3 px-4 text-blue-200">Quantity</th>
                  <th className="text-left py-3 px-4 text-blue-200">Unit</th>
                  <th className="text-left py-3 px-4 text-blue-200">Purchase Price</th>
                  <th className="text-left py-3 px-4 text-blue-200">Selling Price</th>
                  <th className="text-left py-3 px-4 text-blue-200">Supplier</th>
                  <th className="text-left py-3 px-4 text-blue-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="py-3 px-4 text-white font-medium">{item.name}</td>
                    <td className="py-3 px-4 text-blue-200">{item.category}</td>
                    <td className="py-3 px-4 text-white">{item.quantity}</td>
                    <td className="py-3 px-4 text-blue-200">{item.unit}</td>
                    <td className="py-3 px-4 text-white">${item.purchase_price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-white">${item.selling_price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-blue-200">{item.supplier}</td>
                    <td className="py-3 px-4 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditItem(item);
                          setIsDialogOpen(true);
                        }}
                        className="text-blue-200 border-blue-500 hover:bg-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteItem(item.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {editItem && (
        <EditItemDialog
          item={editItem}
          isOpen={isDialogOpen}
          onClose={() => {
            setEditItem(null);
            setIsDialogOpen(false);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default InventoryList;