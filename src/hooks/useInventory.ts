
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  min_stock: number;
  purchase_price: number;
  selling_price: number;
  supplier: string;
  created_at: string;
  updated_at: string;
}

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      console.log('Fetching inventory items from Supabase...');
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching items:', error);
        throw error;
      }
      
      console.log('Fetched items:', data);
      setItems(data || []);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch inventory items: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveItem = async (itemData: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => {
    setSaving(true);
    try {
      console.log('Saving item to Supabase:', itemData);
      
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([itemData])
        .select()
        .single();

      if (error) {
        console.error('Error saving item:', error);
        throw error;
      }

      console.log('Item saved successfully:', data);
      setItems(prev => [data, ...prev]);
      
      toast({
        title: "Success",
        description: "Item saved successfully",
      });
      
      return data;
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: "Error", 
        description: "Failed to save item: " + error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      console.log('Updating item:', id, updates);
      
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating item:', error);
        throw error;
      }

      console.log('Item updated successfully:', data);
      setItems(prev => prev.map(item => item.id === id ? data : item));
      
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    } catch (error: any) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update item: " + error.message, 
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (id: string) => {
    try {
      console.log('Deleting item:', id);
      
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting item:', error);
        throw error;
      }

      console.log('Item deleted successfully');
      setItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete item: " + error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    saving,
    saveItem,
    updateItem,
    deleteItem,
    refetch: fetchItems
  };
};
