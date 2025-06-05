
import { useState } from "react";
import { InventoryItem } from "@/pages/Index";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  BarChart3,
  Calendar
} from "lucide-react";

// Mock data for demonstration - in a real app this would come from your database
const mockInventoryData: InventoryItem[] = [
  {
    id: "1",
    name: "Jack Daniels",
    category: "Spirits",
    quantity: 12,
    unit: "bottles",
    minStock: 5,
    purchasePrice: 35.99,
    sellingPrice: 45.99,
    supplier: "Premium Spirits Co.",
    lastUpdated: new Date("2024-05-28")
  },
  {
    id: "2",
    name: "Heineken",
    category: "Beer",
    quantity: 3,
    unit: "cases",
    minStock: 5,
    purchasePrice: 22.50,
    sellingPrice: 28.50,
    supplier: "Beer Distributors",
    lastUpdated: new Date("2024-05-29")
  },
  {
    id: "3",
    name: "Cabernet Sauvignon",
    category: "Wine",
    quantity: 8,
    unit: "bottles",
    minStock: 3,
    purchasePrice: 24.00,
    sellingPrice: 32.00,
    supplier: "Wine Merchants",
    lastUpdated: new Date("2024-05-27")
  },
  {
    id: "4",
    name: "Coca Cola",
    category: "Mixers",
    quantity: 2,
    unit: "cases",
    minStock: 4,
    purchasePrice: 14.75,
    sellingPrice: 18.75,
    supplier: "Beverage Supply",
    lastUpdated: new Date("2024-05-30")
  }
];

const PotentialRevenue = () => {
  const [timeframe, setTimeframe] = useState("month");

  // Calculate revenue analytics
  const totalPotentialRevenue = mockInventoryData.reduce(
    (sum, item) => sum + (item.quantity * item.sellingPrice), 0
  );
  
  const totalInvestment = mockInventoryData.reduce(
    (sum, item) => sum + (item.quantity * item.purchasePrice), 0
  );
  
  const potentialProfit = totalPotentialRevenue - totalInvestment;
  const profitMargin = ((potentialProfit / totalInvestment) * 100);

  // Category breakdown data
  const categoryData = mockInventoryData.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = {
        category,
        revenue: 0,
        profit: 0,
        items: 0
      };
    }
    acc[category].revenue += item.quantity * item.sellingPrice;
    acc[category].profit += (item.sellingPrice - item.purchasePrice) * item.quantity;
    acc[category].items += item.quantity;
    return acc;
  }, {} as Record<string, any>);

  const categoryChartData = Object.values(categoryData);

  // Mock monthly trend data
  const monthlyTrendData = [
    { month: "Jan", revenue: 2400, profit: 800 },
    { month: "Feb", revenue: 2800, profit: 950 },
    { month: "Mar", revenue: 3200, profit: 1100 },
    { month: "Apr", revenue: 2900, profit: 980 },
    { month: "May", revenue: 3400, profit: 1200 },
    { month: "Jun", revenue: 3800, profit: 1350 }
  ];

  // Pie chart colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#3B82F6"
    },
    profit: {
      label: "Profit", 
      color: "#10B981"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            Potential Revenue Analytics
          </h1>
          <p className="text-blue-200 text-lg">Detailed insights into your inventory's revenue potential</p>
        </div>

        {/* Key Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <DollarSign className="w-4 h-4" />
                <span>Total Potential Revenue</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPotentialRevenue.toFixed(2)}</div>
              <p className="text-blue-200 text-sm">From current inventory</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Potential Profit</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${potentialProfit.toFixed(2)}</div>
              <p className="text-blue-200 text-sm">{profitMargin.toFixed(1)}% margin</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <Package className="w-4 h-4" />
                <span>Total Investment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalInvestment.toFixed(2)}</div>
              <p className="text-blue-200 text-sm">Purchase cost</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-sm">
                <BarChart3 className="w-4 h-4" />
                <span>Best Category</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {categoryChartData.sort((a, b) => b.profit - a.profit)[0]?.category || 'N/A'}
              </div>
              <p className="text-blue-200 text-sm">Highest profit margin</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue by Category Bar Chart */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Revenue by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Profit Distribution Pie Chart */}
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Profit Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="profit"
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend Chart */}
        <Card className="bg-slate-800 border-slate-600 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Revenue Trend (Last 6 Months)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Detailed Breakdown Table */}
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Detailed Item Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-3 px-4 text-blue-200">Item</th>
                    <th className="text-left py-3 px-4 text-blue-200">Category</th>
                    <th className="text-left py-3 px-4 text-blue-200">Quantity</th>
                    <th className="text-left py-3 px-4 text-blue-200">Potential Revenue</th>
                    <th className="text-left py-3 px-4 text-blue-200">Potential Profit</th>
                    <th className="text-left py-3 px-4 text-blue-200">Margin %</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInventoryData.map((item) => {
                    const itemRevenue = item.quantity * item.sellingPrice;
                    const itemProfit = (item.sellingPrice - item.purchasePrice) * item.quantity;
                    const itemMargin = ((item.sellingPrice - item.purchasePrice) / item.purchasePrice) * 100;
                    
                    return (
                      <tr key={item.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="py-3 px-4 text-white font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-blue-200">{item.category}</td>
                        <td className="py-3 px-4 text-white">{item.quantity} {item.unit}</td>
                        <td className="py-3 px-4 text-green-400 font-medium">${itemRevenue.toFixed(2)}</td>
                        <td className="py-3 px-4 text-green-300">${itemProfit.toFixed(2)}</td>
                        <td className="py-3 px-4 text-yellow-400">{itemMargin.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PotentialRevenue;
