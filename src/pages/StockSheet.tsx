import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { StockSheetDashboard } from "@/components/stock/StockSheetDashboard";
import { CreateStockSheet } from "@/components/stock/CreateStockSheet";
import { StockSheetDetails } from "@/components/stock/StockSheetDetails";
import { Button } from "@/components/ui/button";
import { Plus, FileSpreadsheet, Download } from "lucide-react";
import { useInventory, InventoryItem } from "@/hooks/useInventory";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const StockSheet = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'create' | 'details'>('dashboard');
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);
  const { items, loading } = useInventory();

  const handleViewSheet = (sheetId: string) => {
    setSelectedSheetId(sheetId);
    setActiveView('details');
  };

  const handleBackToDashboard = () => {
    setActiveView('dashboard');
    setSelectedSheetId(null);
  };

  const exportToPDF = async () => {
    const input = document.getElementById('inventory-table');
    if (!input) {
      console.error('Inventory table not found');
      return;
    }

    try {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('inventory-report.pdf');
    } catch (error) {
      console.error('PDF export failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Stock Management</h1>
            <p className="text-blue-200">Track opening stock, purchases, sales, and expenses</p>
          </div>
          
          {activeView === 'dashboard' && (
            <>
              <Button
                onClick={() => setActiveView('create')}
                className="bg-green-600 hover:bg-green-700 mr-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Stock Sheet
              </Button>
              <Button
                onClick={exportToPDF}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export to PDF
              </Button>
            </>
          )}
          
          {activeView !== 'dashboard' && (
            <Button
              onClick={handleBackToDashboard}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-slate-900"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          )}
        </div>

        {activeView === 'dashboard' && (
          <div>
            <StockSheetDashboard onViewSheet={handleViewSheet} />
            <div id="inventory-table" className="mt-8 bg-slate-800 border-slate-600 p-4 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4">Current Inventory</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-2 px-4 text-blue-200">Item</th>
                    <th className="text-left py-2 px-4 text-blue-200">Category</th>
                    <th className="text-left py-2 px-4 text-blue-200">Quantity</th>
                    <th className="text-left py-2 px-4 text-blue-200">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-2 px-4 text-white">{item.name}</td>
                      <td className="py-2 px-4 text-blue-200">{item.category}</td>
                      <td className="py-2 px-4 text-white">{item.quantity}</td>
                      <td className="py-2 px-4 text-blue-200">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'create' && (
          <CreateStockSheet onSuccess={handleBackToDashboard} />
        )}

        {activeView === 'details' && selectedSheetId && (
          <StockSheetDetails sheetId={selectedSheetId} />
        )}
      </div>
    </div>
  );
};

export default StockSheet;