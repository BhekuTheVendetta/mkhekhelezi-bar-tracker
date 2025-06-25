
-- Create inventory_items table to store the inventory data
CREATE TABLE public.inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  min_stock INTEGER NOT NULL DEFAULT 0,
  purchase_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  selling_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  supplier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read inventory items
CREATE POLICY "Users can view inventory items"
  ON public.inventory_items
  FOR SELECT
  USING (true);

-- Create policy to allow all users to insert inventory items
CREATE POLICY "Users can create inventory items"
  ON public.inventory_items
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow all users to update inventory items
CREATE POLICY "Users can update inventory items"
  ON public.inventory_items
  FOR UPDATE
  USING (true);

-- Create policy to allow all users to delete inventory items
CREATE POLICY "Users can delete inventory items"
  ON public.inventory_items
  FOR DELETE
  USING (true);

-- Create an index for better performance
CREATE INDEX idx_inventory_items_category ON public.inventory_items(category);
CREATE INDEX idx_inventory_items_updated_at ON public.inventory_items(updated_at);
