
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Calendar,
  Home
} from "lucide-react";
import { useInventory } from "@/hooks/useInventory";
import { useNavigate } from "react-router-dom";

const PotentialRevenue = () => {
  const navigate = useNavigate();
  const { items, loading } = useInventory();
  const [timeframe, setTimeframe] = useState("month");

  // Calculate analytics from real data
  const analytics = {
    totalPotentialRevenue: items.reduce((sum, item) => sum + (item.quantity * item.selling_price), 0),
    totalInvestment: items.reduce((sum, item) => sum + (item.quantity * item.purchase_price), 0),
    get potentialProfit() { return this.totalPotentialRevenue - this.totalInvestment; },
    get profitMargin() { return this.totalInvestment > 0 ? ((this.potentialProfit / this.totalInvestment) * 100) : 0; }
  };

  // Category breakdown data
  const categoryData = items.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = {
        category,
        revenue: 0,
        profit: 0,
        items: 0
      };
    }
    acc[category].revenue += item.quantity * item.selling_price;
    acc[category].profit += (item.selling_price - item.purchase_price) * item.quantity;
    acc[category].items += item.quantity;
    return acc;
  }, {} as Record<string, any>);

  const categoryChartData = Object.values(categoryData);

  // Mock monthly trend data (you can enhance this with actual historical data)
  const monthlyTrendData = [
    { month: "Jan", revenue: analytics.totalPotentialRevenue * 0.7, profit: analytics.potentialProfit * 0.7 },
    { month: "Feb", revenue: analytics.totalPotentialRevenue * 0.8, profit: analytics.potentialProfit * 0.8 },
    { month: "Mar", revenue: analytics.totalPotentialRevenue * 0.9, profit: analytics.potentialProfit * 0.9 },
    { month: "Apr", revenue: analytics.totalPotentialRevenue * 0.85, profit: analytics.potentialProfit * 0.85 },
    { month: "May", revenue: analytics.totalPotentialRevenue * 0.95, profit: analytics.potentialProfit * 0.95 },
    { month: "Jun", revenue: analytics.totalPotentialRevenue, profit: analytics.potentialProfit }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-xl">Loading analytics...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              Potential Revenue Analytics
            </h1>
            <p className="text-blue-200 text-lg">Real-time insights from your inventory data</p>
          </div>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="bg-blue-600 text-white border-blue-500 hover:bg-blue-700"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        {items.length === 0 ? (
          <Card className="bg-slate-800 border-slate-600">
            <CardContent className="p-8 text-center">
              <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Inventory Data</h3>
              <p className="text-slate-400 mb-4">Add some inventory items to see analytics and revenue projections.</p>
              <Button
                onClick={() => navigate("/add-item")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Your First Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
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
                  <div className="text-2xl font-bold">${analytics.totalPotentialRevenue.toFixed(2)}</div>
                  <p className="text-blue-200 text-sm">From {items.length} items</p>
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
                  <div className="text-2xl font-bold">${analytics.potentialProfit.toFixed(2)}</div>
                  <p className="text-blue-200 text-sm">{analytics.profitMargin.toFixed(1)}% margin</p>
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
                  <div className="text-2xl font-bold">${analytics.totalInvestment.toFixed(2)}</div>
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
            {categoryChartData.length > 0 && (
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
            )}

            {/* Monthly Trend Chart */}
            <Card className="bg-slate-800 border-slate-600 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Revenue Projection (6 Months)</span>
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
                      {items.map((item) => {
                        const itemRevenue = item.quantity * item.selling_price;
                        const itemProfit = (item.selling_price - item.purchase_price) * item.quantity;
                        const itemMargin = item.purchase_price > 0 ? ((item.selling_price - item.purchase_price) / item.purchase_price) * 100 : 0;
                        
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
          </>
        )}
      </div>
    </div>
  );
};

export default PotentialRevenue;
