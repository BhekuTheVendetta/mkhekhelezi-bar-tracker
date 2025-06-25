
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, User, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StockSheet {
  id: string;
  date: string;
  status: string;
  notes: string | null;
  created_by: string;
}

interface StockSheetDashboardProps {
  onViewSheet: (sheetId: string) => void;
}

export const StockSheetDashboard = ({ onViewSheet }: StockSheetDashboardProps) => {
  const [stockSheets, setStockSheets] = useState<StockSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStockSheets();
  }, []);

  const fetchStockSheets = async () => {
    try {
      const { data, error } = await supabase
        .from('stock_sheets')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setStockSheets(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load stock sheets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-slate-800/50 border-slate-600 animate-pulse">
            <CardHeader className="h-24 bg-slate-700/50 rounded-t-lg"></CardHeader>
            <CardContent className="h-32"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stockSheets.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-8 text-center">
            <DollarSign className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Stock Sheets Yet</h3>
            <p className="text-slate-400">Create your first stock sheet to start tracking inventory and finances.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stockSheets.map((sheet) => (
            <Card key={sheet.id} className="bg-slate-800/50 border-slate-600 hover:bg-slate-800/70 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">
                    {new Date(sheet.date).toLocaleDateString()}
                  </CardTitle>
                  <Badge variant={sheet.status === 'finalized' ? 'default' : 'secondary'}>
                    {sheet.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-slate-300 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(sheet.date).toDateString()}
                </div>
                
                <div className="flex items-center text-slate-300 text-sm">
                  <User className="w-4 h-4 mr-2" />
                  User {sheet.created_by.substring(0, 8)}...
                </div>

                {sheet.notes && (
                  <p className="text-slate-400 text-sm line-clamp-2">{sheet.notes}</p>
                )}

                <Button
                  onClick={() => onViewSheet(sheet.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
