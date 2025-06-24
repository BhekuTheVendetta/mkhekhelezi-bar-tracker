
-- Create tables for stock management and financial tracking

-- Stock items table (separate from inventory for stock tracking)
CREATE TABLE public.stock_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily stock sheets
CREATE TABLE public.stock_sheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'finalized')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date)
);

-- Stock movements (opening, closing, purchases)
CREATE TABLE public.stock_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stock_sheet_id UUID REFERENCES public.stock_sheets(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.stock_items(id) NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('opening', 'purchase', 'closing')),
  quantity DECIMAL(10,2) NOT NULL,
  unit_cost DECIMAL(10,2),
  total_cost DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales records
CREATE TABLE public.sales_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stock_sheet_id UUID REFERENCES public.stock_sheets(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.stock_items(id) NOT NULL,
  quantity_sold DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- General expenses
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stock_sheet_id UUID REFERENCES public.stock_sheets(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stock_items
CREATE POLICY "Users can view stock items" ON public.stock_items FOR SELECT USING (true);
CREATE POLICY "Admin can manage stock items" ON public.stock_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- RLS Policies for stock_sheets
CREATE POLICY "Users can view stock sheets" ON public.stock_sheets FOR SELECT USING (true);
CREATE POLICY "Users can create stock sheets" ON public.stock_sheets FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admin can manage stock sheets" ON public.stock_sheets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- RLS Policies for stock_movements
CREATE POLICY "Users can view stock movements" ON public.stock_movements FOR SELECT USING (true);
CREATE POLICY "Users can manage stock movements" ON public.stock_movements FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'employee'))
);

-- RLS Policies for sales_records
CREATE POLICY "Users can view sales records" ON public.sales_records FOR SELECT USING (true);
CREATE POLICY "Users can manage sales records" ON public.sales_records FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'employee'))
);

-- RLS Policies for expenses
CREATE POLICY "Users can view expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Users can manage expenses" ON public.expenses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'employee'))
);

-- Insert some default stock items
INSERT INTO public.stock_items (name, category, unit) VALUES
('Jack Daniels', 'Spirits', 'bottles'),
('Heineken', 'Beer', 'cases'),
('Cabernet Sauvignon', 'Wine', 'bottles'),
('Coca Cola', 'Mixers', 'cases'),
('Vodka', 'Spirits', 'bottles'),
('Red Wine', 'Wine', 'bottles'),
('White Wine', 'Wine', 'bottles'),
('Whiskey', 'Spirits', 'bottles');
