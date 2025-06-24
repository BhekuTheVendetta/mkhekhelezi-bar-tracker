
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IncomeStatementProps {
  sheetId: string;
  date: string;
}

interface FinancialData {
  totalSales: number;
  totalPurchases: number;
  totalExpenses: number;
  openingStock: number;
  closingStock: number;
  costOfGoodsSold: number;
  grossProfit: number;
  netProfit: number;
  salesByCategory: { [key: string]: number };
  expensesByCategory: { [key: string]: number };
}

export const IncomeStatement = ({ sheetId, date }: IncomeStatementProps) => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    calculateFinancials();
  }, [sheetId]);

  const calculateFinancials = async () => {
    try {
      // Fetch all data
      const [salesRes, movementsRes, expensesRes] = await Promise.all([
        supabase
          .from('sales_records')
          .select(`
            *,
            stock_items (category)
          `)
          .eq('stock_sheet_id', sheetId),
        supabase
          .from('stock_movements')
          .select('*')
          .eq('stock_sheet_id', sheetId),
        supabase
          .from('expenses')
          .select('*')
          .eq('stock_sheet_id', sheetId)
      ]);

      if (salesRes.error) throw salesRes.error;
      if (movementsRes.error) throw movementsRes.error;
      if (expensesRes.error) throw expensesRes.error;

      const sales = salesRes.data || [];
      const movements = movementsRes.data || [];
      const expenses = expensesRes.data || [];

      // Calculate totals
      const totalSales = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

      // Calculate stock values
      const openingStock = movements
        .filter(m => m.movement_type === 'opening')
        .reduce((sum, m) => sum + (m.total_cost || 0), 0);

      const totalPurchases = movements
        .filter(m => m.movement_type === 'purchase')
        .reduce((sum, m) => sum + (m.total_cost || 0), 0);

      const closingStock = movements
        .filter(m => m.movement_type === 'closing')
        .reduce((sum, m) => sum + (m.total_cost || 0), 0);

      // Cost of Goods Sold = Opening Stock + Purchases - Closing Stock
      const costOfGoodsSold = openingStock + totalPurchases - closingStock;
      const grossProfit = totalSales - costOfGoodsSold;
      const netProfit = grossProfit - totalExpenses;

      // Group by categories
      const salesByCategory: { [key: string]: number } = {};
      sales.forEach(sale => {
        const category = sale.stock_items?.category || 'Unknown';
        salesByCategory[category] = (salesByCategory[category] || 0) + sale.total_amount;
      });

      const expensesByCategory: { [key: string]: number } = {};
      expenses.forEach(expense => {
        expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
      });

      setFinancialData({
        totalSales,
        totalPurchases,
        totalExpenses,
        openingStock,
        closingStock,
        costOfGoodsSold,
        grossProfit,
        netProfit,
        salesByCategory,
        expensesByCategory
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to calculate financial data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    // This would typically use a library like jsPDF
    toast({
      title: "Export Feature",
      description: "PDF export would be implemented with jsPDF library",
    });
  };

  const exportToExcel = () => {
    if (!financialData) return;

    // Create CSV content
    const csvContent = [
      ['MKHEKHELEZI GLC - INCOME STATEMENT'],
      [`Date: ${new Date(date).toLocaleDateString()}`],
      [''],
      ['REVENUE'],
      ['Total Sales', `R${financialData.totalSales.toFixed(2)}`],
      [''],
      ['COST OF GOODS SOLD'],
      ['Opening Stock', `R${financialData.openingStock.toFixed(2)}`],
      ['Purchases', `R${financialData.totalPurchases.toFixed(2)}`],
      ['Closing Stock', `R${financialData.closingStock.toFixed(2)}`],
      ['Cost of Goods Sold', `R${financialData.costOfGoodsSold.toFixed(2)}`],
      [''],
      ['GROSS PROFIT', `R${financialData.grossProfit.toFixed(2)}`],
      [''],
      ['EXPENSES'],
      ...Object.entries(financialData.expensesByCategory).map(([category, amount]) => 
        [category, `R${amount.toFixed(2)}`]
      ),
      ['Total Expenses', `R${financialData.totalExpenses.toFixed(2)}`],
      [''],
      ['NET PROFIT', `R${financialData.netProfit.toFixed(2)}`]
    ];

    const csvString = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `income-statement-${date}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Income statement exported to CSV",
    });
  };

  if (loading) {
    return <div className="h-96 bg-slate-800/50 rounded-lg animate-pulse"></div>;
  }

  if (!financialData) {
    return (
      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-8 text-center">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Financial Data</h3>
          <p className="text-slate-400">Unable to generate income statement</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Income Statement - {new Date(date).toLocaleDateString()}
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={exportToPDF} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={exportToExcel} variant="outline" size="sm">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Statement */}
          <Card className="bg-slate-700/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white text-lg">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow className="border-slate-600">
                    <TableCell className="text-white font-semibold">REVENUE</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow className="border-slate-600">
                    <TableCell className="text-slate-300 pl-4">Total Sales</TableCell>
                    <TableCell className="text-white">R{financialData.totalSales.toFixed(2)}</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-slate-600">
                    <TableCell className="text-white font-semibold pt-4">COST OF GOODS SOLD</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow className="border-slate-600">
                    <TableCell className="text-slate-300 pl-4">Opening Stock</TableCell>
                    <TableCell className="text-white">R{financialData.openingStock.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow className="border-slate-600">
                    <TableCell className="text-slate-300 pl-4">Purchases</TableCell>
                    <TableCell className="text-white">R{financialData.totalPurchases.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow className="border-slate-600">
                    <TableCell className="text-slate-300 pl-4">Less: Closing Stock</TableCell>
                    <TableCell className="text-white">-R{financialData.closingStock.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow className="border-slate-600">
                    <TableCell className="text-white font-medium pl-4">Cost of Goods Sold</TableCell>
                    <TableCell className="text-white font-medium">R{financialData.costOfGoodsSold.toFixed(2)}</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-slate-600">
                    <TableCell className="text-green-400 font-bold">GROSS PROFIT</TableCell>
                    <TableCell className="text-green-400 font-bold">R{financialData.grossProfit.toFixed(2)}</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-slate-600">
                    <TableCell className="text-white font-semibold pt-4">EXPENSES</TableCell>
                    <TableCell className="text-white">R{financialData.totalExpenses.toFixed(2)}</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-slate-600">
                    <TableCell className={`font-bold ${financialData.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      NET {financialData.netProfit >= 0 ? 'PROFIT' : 'LOSS'}
                    </TableCell>
                    <TableCell className={`font-bold ${financialData.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      R{financialData.netProfit.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Breakdowns */}
          <div className="space-y-4">
            {/* Sales by Category */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-lg">Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {Object.entries(financialData.salesByCategory).map(([category, amount]) => (
                      <TableRow key={category} className="border-slate-600">
                        <TableCell className="text-slate-300">{category}</TableCell>
                        <TableCell className="text-white">R{amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Expenses by Category */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-lg">Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {Object.entries(financialData.expensesByCategory).map(([category, amount]) => (
                      <TableRow key={category} className="border-slate-600">
                        <TableCell className="text-slate-300">{category}</TableCell>
                        <TableCell className="text-white">R{amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
