
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
      // For now, we'll create mock data since inventory_items table doesn't exist
      // This simulates the data structure we expect
      const mockData: InventoryItem[] = [
        {
          id: "1",
          name: "Jack Daniels",
          category: "Spirits", 
          quantity: 12,
          unit: "bottles",
          min_stock: 5,
          purchase_price: 35.99,
          selling_price: 45.99,
          supplier: "Premium Spirits Co.",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "2", 
          name: "Heineken",
          category: "Beer",
          quantity: 3,
          unit: "cases",
          min_stock: 5,
          purchase_price: 22.50,
          selling_price: 28.50,
          supplier: "Beer Distributors",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "3",
          name: "Cabernet Sauvignon", 
          category: "Wine",
          quantity: 8,
          unit: "bottles",
          min_stock: 3,
          purchase_price: 24.00,
          selling_price: 32.00,
          supplier: "Wine Merchants",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "4",
          name: "Coca Cola",
          category: "Mixers",
          quantity: 2,
          unit: "cases", 
          min_stock: 4,
          purchase_price: 14.75,
          selling_price: 18.75,
          supplier: "Beverage Supply",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setItems(mockData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch inventory items",
        variant: "destructive",
      });
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveItem = async (itemData: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => {
    setSaving(true);
    try {
      // Simulate saving - for now we'll add to local state
      const newItem: InventoryItem = {
        ...itemData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setItems(prev => [newItem, ...prev]);
      toast({
        title: "Success",
        description: "Item saved successfully",
      });
      
      return newItem;
    } catch (error: any) {
      toast({
        title: "Error", 
        description: "Failed to save item",
        variant: "destructive",
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      // Simulate updating - for now we'll update local state
      setItems(prev => prev.map(item => 
        item.id === id 
          ? { ...item, ...updates, updated_at: new Date().toISOString() }
          : item
      ));
      
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update item", 
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (id: string) => {
    try {
      // Simulate deleting - for now we'll remove from local state
      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete item",
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
