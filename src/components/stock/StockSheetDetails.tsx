
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockMovements } from "./StockMovements";
import { SalesRecords } from "./SalesRecords";
import { ExpenseRecords } from "./ExpenseRecords";
import { IncomeStatement } from "./IncomeStatement";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Lock, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StockSheet {
  id: string;
  date: string;
  status: string;
  notes: string | null;
  created_by: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  };
}

interface StockSheetDetailsProps {
  sheetId: string;
}

export const StockSheetDetails = ({ sheetId }: StockSheetDetailsProps) => {
  const [stockSheet, setStockSheet] = useState<StockSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStockSheet();
  }, [sheetId]);

  const fetchStockSheet = async () => {
    try {
      const { data, error } = await supabase
        .from('stock_sheets')
        .select(`
          *,
          profiles:created_by (
            first_name,
            last_name,
            email
          )
        `)
        .eq('id', sheetId)
        .single();

      if (error) throw error;
      setStockSheet(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load stock sheet details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!stockSheet) return;
    
    setUpdating(true);
    try {
      const newStatus = stockSheet.status === 'draft' ? 'finalized' : 'draft';
      
      const { error } = await supabase
        .from('stock_sheets')
        .update({ status: newStatus })
        .eq('id', sheetId);

      if (error) throw error;

      setStockSheet({ ...stockSheet, status: newStatus });
      
      toast({
        title: "Success",
        description: `Stock sheet ${newStatus === 'finalized' ? 'finalized' : 'reopened'}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update stock sheet status",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-slate-600 animate-pulse">
          <CardHeader className="h-24"></CardHeader>
        </Card>
        <div className="h-96 bg-slate-800/50 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (!stockSheet) {
    return (
      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-8 text-center">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Stock Sheet Not Found</h3>
          <p className="text-slate-400">The requested stock sheet could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-2xl">
                Stock Sheet - {new Date(stockSheet.date).toLocaleDateString()}
              </CardTitle>
              <p className="text-slate-300 mt-1">
                Created by {stockSheet.profiles?.first_name 
                  ? `${stockSheet.profiles.first_name} ${stockSheet.profiles.last_name || ''}`.trim()
                  : stockSheet.profiles?.email?.split('@')[0] || 'Unknown'
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={stockSheet.status === 'finalized' ? 'default' : 'secondary'}>
                {stockSheet.status}
              </Badge>
              <Button
                onClick={handleStatusToggle}
                disabled={updating}
                variant={stockSheet.status === 'draft' ? 'default' : 'outline'}
                size="sm"
              >
                {stockSheet.status === 'draft' ? (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Finalize
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 mr-2" />
                    Reopen
                  </>
                )}
              </Button>
            </div>
          </div>
          {stockSheet.notes && (
            <p className="text-slate-400 mt-2">{stockSheet.notes}</p>
          )}
        </CardHeader>
      </Card>

      <Tabs defaultValue="movements" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-600">
          <TabsTrigger value="movements" className="data-[state=active]:bg-blue-600">
            Stock Movements
          </TabsTrigger>
          <TabsTrigger value="sales" className="data-[state=active]:bg-blue-600">
            Sales Records
          </TabsTrigger>
          <TabsTrigger value="expenses" className="data-[state=active]:bg-blue-600">
            Expenses
          </TabsTrigger>
          <TabsTrigger value="statement" className="data-[state=active]:bg-blue-600">
            Income Statement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="movements">
          <StockMovements sheetId={sheetId} isFinalized={stockSheet.status === 'finalized'} />
        </TabsContent>

        <TabsContent value="sales">
          <SalesRecords sheetId={sheetId} isFinalized={stockSheet.status === 'finalized'} />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpenseRecords sheetId={sheetId} isFinalized={stockSheet.status === 'finalized'} />
        </TabsContent>

        <TabsContent value="statement">
          <IncomeStatement sheetId={sheetId} date={stockSheet.date} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
