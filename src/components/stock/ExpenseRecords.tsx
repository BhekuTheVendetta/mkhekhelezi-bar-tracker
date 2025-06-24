
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Receipt, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
}

interface ExpenseRecordsProps {
  sheetId: string;
  isFinalized: boolean;
}

const expenseCategories = [
  'Utilities',
  'Rent',
  'Salaries',
  'Marketing',
  'Equipment',
  'Maintenance',
  'Insurance',
  'Other'
];

export const ExpenseRecords = ({ sheetId, isFinalized }: ExpenseRecordsProps) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    amount: '',
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchExpenses();
  }, [sheetId]);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('stock_sheet_id', sheetId)
        .order('created_at');

      if (error) throw error;
      setExpenses(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load expenses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const amount = parseFloat(formData.amount);

      const expenseData = {
        stock_sheet_id: sheetId,
        description: formData.description,
        category: formData.category,
        amount,
      };

      if (editingId) {
        const { error } = await supabase
          .from('expenses')
          .update(expenseData)
          .eq('id', editingId);
        
        if (error) throw error;
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('expenses')
          .insert(expenseData);
        
        if (error) throw error;
      }

      setFormData({ description: '', category: '', amount: '' });
      setShowForm(false);
      await fetchExpenses();
      
      toast({
        title: "Success",
        description: `Expense ${editingId ? 'updated' : 'added'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save expense",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (expense: Expense) => {
    setFormData({
      description: expense.description,
      category: expense.category,
      amount: expense.amount.toString(),
    });
    setEditingId(expense.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchExpenses();
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="h-64 bg-slate-800/50 rounded-lg animate-pulse"></div>;
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Receipt className="w-5 h-5 mr-2" />
            Expenses
            <span className="ml-4 text-red-400 text-lg">
              Total: R{totalExpenses.toFixed(2)}
            </span>
          </CardTitle>
          {!isFinalized && (
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && !isFinalized && (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-700/50 rounded-lg">
            <div>
              <Label className="text-white">Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-slate-600 border-slate-500 text-white"
                placeholder="Enter expense description"
                required
              />
            </div>

            <div>
              <Label className="text-white">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">Amount (R)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
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
                    setFormData({ description: '', category: '', amount: '' });
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
                <TableHead className="text-slate-300">Description</TableHead>
                <TableHead className="text-slate-300">Category</TableHead>
                <TableHead className="text-slate-300">Amount</TableHead>
                {!isFinalized && <TableHead className="text-slate-300">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id} className="border-slate-600">
                  <TableCell className="text-white">{expense.description}</TableCell>
                  <TableCell className="text-white">{expense.category}</TableCell>
                  <TableCell className="text-white font-medium">R{expense.amount.toFixed(2)}</TableCell>
                  {!isFinalized && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(expense)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(expense.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {expenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isFinalized ? 3 : 4} className="text-center text-slate-400 py-8">
                    No expenses recorded yet
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
