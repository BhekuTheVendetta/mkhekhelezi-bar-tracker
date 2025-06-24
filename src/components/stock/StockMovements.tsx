
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Package, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StockItem {
  id: string;
  name: string;
  category: string;
  unit: string;
}

interface StockMovement {
  id: string;
  item_id: string;
  movement_type: string;
  quantity: number;
  unit_cost: number | null;
  total_cost: number | null;
  stock_items: StockItem;
}

interface StockMovementsProps {
  sheetId: string;
  isFinalized: boolean;
}

export const StockMovements = ({ sheetId, isFinalized }: StockMovementsProps) => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    item_id: '',
    movement_type: 'opening',
    quantity: '',
    unit_cost: '',
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [sheetId]);

  const fetchData = async () => {
    try {
      const [movementsRes, itemsRes] = await Promise.all([
        supabase
          .from('stock_movements')
          .select(`
            *,
            stock_items (*)
          `)
          .eq('stock_sheet_id', sheetId)
          .order('created_at'),
        supabase
          .from('stock_items')
          .select('*')
          .order('name')
      ]);

      if (movementsRes.error) throw movementsRes.error;
      if (itemsRes.error) throw itemsRes.error;

      setMovements(movementsRes.data || []);
      setStockItems(itemsRes.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load stock movements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const quantity = parseFloat(formData.quantity);
      const unit_cost = formData.unit_cost ? parseFloat(formData.unit_cost) : null;
      const total_cost = unit_cost ? quantity * unit_cost : null;

      const movementData = {
        stock_sheet_id: sheetId,
        item_id: formData.item_id,
        movement_type: formData.movement_type,
        quantity,
        unit_cost,
        total_cost,
      };

      if (editingId) {
        const { error } = await supabase
          .from('stock_movements')
          .update(movementData)
          .eq('id', editingId);
        
        if (error) throw error;
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('stock_movements')
          .insert(movementData);
        
        if (error) throw error;
      }

      setFormData({ item_id: '', movement_type: 'opening', quantity: '', unit_cost: '' });
      setShowForm(false);
      await fetchData();
      
      toast({
        title: "Success",
        description: `Stock movement ${editingId ? 'updated' : 'added'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save stock movement",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (movement: StockMovement) => {
    setFormData({
      item_id: movement.item_id,
      movement_type: movement.movement_type,
      quantity: movement.quantity.toString(),
      unit_cost: movement.unit_cost?.toString() || '',
    });
    setEditingId(movement.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this movement?')) return;

    try {
      const { error } = await supabase
        .from('stock_movements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchData();
      toast({
        title: "Success",
        description: "Stock movement deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete stock movement",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="h-64 bg-slate-800/50 rounded-lg animate-pulse"></div>;
  }

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Stock Movements
          </CardTitle>
          {!isFinalized && (
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Movement
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && !isFinalized && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-slate-700/50 rounded-lg">
            <div>
              <Label className="text-white">Item</Label>
              <Select value={formData.item_id} onValueChange={(value) => setFormData({...formData, item_id: value})}>
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {stockItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">Type</Label>
              <Select value={formData.movement_type} onValueChange={(value) => setFormData({...formData, movement_type: value})}>
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opening">Opening Stock</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="closing">Closing Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">Quantity</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="bg-slate-600 border-slate-500 text-white"
                required
              />
            </div>

            <div>
              <Label className="text-white">Unit Cost</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.unit_cost}
                onChange={(e) => setFormData({...formData, unit_cost: e.target.value})}
                className="bg-slate-600 border-slate-500 text-white"
                placeholder="Optional"
              />
            </div>

            <div className="flex items-end gap-2">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingId ? 'Update' : 'Add'}
              </Button>
              {showForm && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ item_id: '', movement_type: 'opening', quantity: '', unit_cost: '' });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-600">
                <TableHead className="text-slate-300">Item</TableHead>
                <TableHead className="text-slate-300">Type</TableHead>
                <TableHead className="text-slate-300">Quantity</TableHead>
                <TableHead className="text-slate-300">Unit Cost</TableHead>
                <TableHead className="text-slate-300">Total Cost</TableHead>
                {!isFinalized && <TableHead className="text-slate-300">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id} className="border-slate-600">
                  <TableCell className="text-white">
                    {movement.stock_items.name}
                    <div className="text-xs text-slate-400">{movement.stock_items.category}</div>
                  </TableCell>
                  <TableCell className="text-white capitalize">{movement.movement_type}</TableCell>
                  <TableCell className="text-white">{movement.quantity} {movement.stock_items.unit}</TableCell>
                  <TableCell className="text-white">
                    {movement.unit_cost ? `R${movement.unit_cost.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell className="text-white">
                    {movement.total_cost ? `R${movement.total_cost.toFixed(2)}` : '-'}
                  </TableCell>
                  {!isFinalized && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(movement)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(movement.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {movements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isFinalized ? 5 : 6} className="text-center text-slate-400 py-8">
                    No stock movements recorded yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
