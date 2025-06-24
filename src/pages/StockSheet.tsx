
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StockSheetDashboard } from "@/components/stock/StockSheetDashboard";
import { CreateStockSheet } from "@/components/stock/CreateStockSheet";
import { StockSheetDetails } from "@/components/stock/StockSheetDetails";
import { Button } from "@/components/ui/button";
import { Plus, FileSpreadsheet } from "lucide-react";

export const StockSheet = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'create' | 'details'>('dashboard');
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);

  const handleViewSheet = (sheetId: string) => {
    setSelectedSheetId(sheetId);
    setActiveView('details');
  };

  const handleBackToDashboard = () => {
    setActiveView('dashboard');
    setSelectedSheetId(null);
  };

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
            <Button
              onClick={() => setActiveView('create')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Stock Sheet
            </Button>
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
          <StockSheetDashboard onViewSheet={handleViewSheet} />
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
