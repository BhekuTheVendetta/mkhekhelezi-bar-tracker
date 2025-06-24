
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ShoppingCart, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StockItem {
  id: string;
  name: string;
  category: string;
  unit: string;
}

interface SalesRecord {
  id: string;
  item_id: string;
  quantity_sold: number;
  unit_price: number;
  total_amount: number;
  stock_items: StockItem;
}

interface SalesRecordsProps {
  sheetId: string;
  isFinalized: boolean;
}

export const SalesRecords = ({ sheetId, isFinalized }: SalesRecordsProps) => {
  const [sales, setSales] = useState<SalesRecord[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    item_id: '',
    quantity_sold: '',
    unit_price: '',
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [sheetId]);

  const fetchData = async () => {
    try {
      const [salesRes, itemsRes] = await Promise.all([
        supabase
          .from('sales_records')
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

      if (salesRes.error) throw salesRes.error;
      if (itemsRes.error) throw itemsRes.error;

      setSales(salesRes.data || []);
      setStockItems(itemsRes.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load sales records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const quantity_sold = parseFloat(formData.quantity_sold);
      const unit_price = parseFloat(formData.unit_price);
      const total_amount = quantity_sold * unit_price;

      const salesData = {
        stock_sheet_id: sheetId,
        item_id: formData.item_id,
        quantity_sold,
        unit_price,
        total_amount,
      };

      if (editingId) {
        const { error } = await supabase
          .from('sales_records')
          .update(salesData)
          .eq('id', editingId);
        
        if (error) throw error;
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('sales_records')
          .insert(salesData);
        
        if (error) throw error;
      }

      setFormData({ item_id: '', quantity_sold: '', unit_price: '' });
      setShowForm(false);
      await fetchData();
      
      toast({
        title: "Success",
        description: `Sales record ${editingId ? 'updated' : 'added'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save sales record",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (sale: SalesRecord) => {
    setFormData({
      item_id: sale.item_id,
      quantity_sold: sale.quantity_sold.toString(),
      unit_price: sale.unit_price.toString(),
    });
    setEditingId(sale.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sales record?')) return;

    try {
      const { error } = await supabase
        .from('sales_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchData();
      toast({
        title: "Success",
        description: "Sales record deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete sales record",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="h-64 bg-slate-800/50 rounded-lg animate-pulse"></div>;
  }

  const totalSales = sales.reduce((sum, sale) => sum + sale.total_amount, 0);

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Sales Records
            <span className="ml-4 text-green-400 text-lg">
              Total: R{totalSales.toFixed(2)}
            </span>
          </CardTitle>
          {!isFinalized && (
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Sale
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && !isFinalized && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-700/50 rounded-lg">
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
              <Label className="text-white">Quantity Sold</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.quantity_sold}
                onChange={(e) => setFormData({...formData, quantity_sold: e.target.value})}
                className="bg-slate-600 border-slate-500 text-white"
                required
              />
            </div>

            <div>
              <Label className="text-white">Unit Price (R)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => setFormData({...formData, unit_price: e.target.value})}
                className="bg-slate-600 border-slate-500 text-white"
                required
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
                    setFormData({ item_id: '', quantity_sold: '', unit_price: '' });
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
                <TableHead className="text-slate-300">Quantity Sold</TableHead>
                <TableHead className="text-slate-300">Unit Price</TableHead>
                <TableHead className="text-slate-300">Total Amount</TableHead>
                {!isFinalized && <TableHead className="text-slate-300">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id} className="border-slate-600">
                  <TableCell className="text-white">
                    {sale.stock_items.name}
                    <div className="text-xs text-slate-400">{sale.stock_items.category}</div>
                  </TableCell>
                  <TableCell className="text-white">{sale.quantity_sold} {sale.stock_items.unit}</TableCell>
                  <TableCell className="text-white">R{sale.unit_price.toFixed(2)}</TableCell>
                  <TableCell className="text-white font-medium">R{sale.total_amount.toFixed(2)}</TableCell>
                  {!isFinalized && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(sale)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(sale.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {sales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isFinalized ? 4 : 5} className="text-center text-slate-400 py-8">
                    No sales recorded yet
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
