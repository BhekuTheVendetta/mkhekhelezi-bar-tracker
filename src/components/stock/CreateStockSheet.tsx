
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Save } from "lucide-react";

interface CreateStockSheetProps {
  onSuccess: () => void;
}

export const CreateStockSheet = ({ onSuccess }: CreateStockSheetProps) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('stock_sheets')
        .insert({
          date,
          created_by: user.id,
          notes: notes.trim() || null,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stock sheet created successfully",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create stock sheet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Create New Stock Sheet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-white">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-white">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes or comments for this stock sheet..."
                className="bg-slate-700 border-slate-600 text-white"
                rows={4}
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Stock Sheet'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
