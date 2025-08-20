import { useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Store,
  Download,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [metricType, setMetricType] = useState('revenue')

  // Sample analytics data
  const revenueData = [
    { date: '2025-01-23', revenue: 125000, orders: 45, users: 12 },
    { date: '2025-01-24', revenue: 142000, orders: 52, users: 18 },
    { date: '2025-01-25', revenue: 138000, orders: 48, users: 15 },
    { date: '2025-01-26', revenue: 165000, orders: 67, users: 22 },
    { date: '2025-01-27', revenue: 178000, orders: 72, users: 28 },
    { date: '2025-01-28', revenue: 195000, orders: 89, users: 35 },
    { date: '2025-01-29', revenue: 210000, orders: 95, users: 42 }
  ]

  const categoryData = [
    { name: 'Fresh Produce', value: 35, revenue: 450000, color: '#10B981' },
    { name: 'Groceries', value: 25, revenue: 320000, color: '#3B82F6' },
    { name: 'Meat & Fish', value: 20, revenue: 256000, color: '#F59E0B' },
    { name: 'Electronics', value: 12, revenue: 154000, color: '#EF4444' },
    { name: 'Others', value: 8, revenue: 102000, color: '#8B5CF6' }
  ]

  const vendorPerformance = [
    { name: 'Mama Kemi\'s Store', orders: 234, revenue: 1250000, rating: 4.8, growth: 15.2 },
    { name: 'Tech Hub', orders: 89, revenue: 2100000, rating: 4.9, growth: 28.5 },
    { name: 'Spice Corner', orders: 156, revenue: 780000, rating: 4.6, growth: 12.8 },
    { name: 'Fresh Market Store', orders: 67, revenue: 450000, rating: 4.4, growth: 8.3 },
    { name: 'Meat Palace', orders: 45, revenue: 340000, rating: 3.2, growth: -5.2 }
  ]

  const userGrowth = [
    { month: 'Sep', buyers: 120, vendors: 8, riders: 5 },
    { month: 'Oct', buyers: 185, vendors: 12, riders: 8 },
    { month: 'Nov', buyers: 245, vendors: 18, riders: 12 },
    { month: 'Dec', buyers: 320, vendors: 25, riders: 18 },
    { month: 'Jan', buyers: 425, vendors: 35, riders: 25 }
  ]

  const deliveryMetrics = [
    { area: 'BSU Campus', orders: 145, avgTime: 22, satisfaction: 4.7 },
    { area: 'Modern Market', orders: 89, avgTime: 15, satisfaction: 4.8 },
    { area: 'High Level', orders: 67, avgTime: 28, satisfaction: 4.5 },
    { area: 'Wurukum', orders: 45, avgTime: 35, satisfaction: 4.2 },
    { area: 'North Bank', orders: 32, avgTime: 42, satisfaction: 4.0 }
  ]

  const hourlyOrders = [
    { hour: '06:00', orders: 5 },
    { hour: '07:00', orders: 12 },
    { hour: '08:00', orders: 25 },
    { hour: '09:00', orders: 35 },
    { hour: '10:00', orders: 45 },
    { hour: '11:00', orders: 52 },
    { hour: '12:00', orders: 68 },
    { hour: '13:00', orders: 72 },
    { hour: '14:00', orders: 65 },
    { hour: '15:00', orders: 58 },
    { hour: '16:00', orders: 48 },
    { hour: '17:00', orders: 42 },
    { hour: '18:00', orders: 35 },
    { hour: '19:00', orders: 28 },
    { hour: '20:00', orders: 18 },
    { hour: '21:00', orders: 12 }
  ]

  const kpiData = {
    totalRevenue: 1282000,
    revenueGrowth: 18.5,
    totalOrders: 468,
    orderGrowth: 22.3,
    activeUsers: 485,
    userGrowth: 15.7,
    avgOrderValue: 2740,
    aovGrowth: -3.2,
    conversionRate: 12.8,
    conversionGrowth: 5.4,
    customerSatisfaction: 4.6,
    satisfactionGrowth: 2.1
  }

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `₦${(value / 1000).toFixed(0)}K`
    }
    return `₦${value.toLocaleString()}`
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights and performance metrics for Modern Market Connect.
          </p>
        </div>
        <div className="flex space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Today</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(kpiData.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+{kpiData.revenueGrowth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{kpiData.totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+{kpiData.orderGrowth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{kpiData.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+{kpiData.userGrowth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold">₦{kpiData.avgOrderValue.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
              <span className="text-xs text-red-600">{kpiData.aovGrowth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{kpiData.conversionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+{kpiData.conversionGrowth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfaction</p>
                <p className="text-2xl font-bold">{kpiData.customerSatisfaction}</p>
              </div>
              <Store className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+{kpiData.satisfactionGrowth}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Performance</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Orders Trend</CardTitle>
              <CardDescription>
                Daily revenue and order volume over the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? 'Revenue' : 'Orders'
                    ]}
                    labelFormatter={formatDate}
                  />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.1}
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="orders" 
                    fill="#3B82F6" 
                    opacity={0.8}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>
                  Revenue distribution across product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value}% (${formatCurrency(props.payload.revenue)})`,
                        'Share'
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {categoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{formatCurrency(item.revenue)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hourly Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Order Volume by Hour</CardTitle>
                <CardDescription>
                  Peak ordering times throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={hourlyOrders}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#8B5CF6" 
                      fill="#8B5CF6" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>
                  Daily sales trends and growth metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), 'Revenue']}
                      labelFormatter={formatDate}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Vendors</CardTitle>
                <CardDescription>
                  Vendor rankings by revenue and growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendorPerformance.map((vendor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{vendor.name}</h4>
                        <p className="text-sm text-gray-600">
                          {vendor.orders} orders • Rating: {vendor.rating}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(vendor.revenue)}</p>
                        <div className="flex items-center">
                          {vendor.growth > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                          )}
                          <span className={`text-xs ${
                            vendor.growth > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {vendor.growth > 0 ? '+' : ''}{vendor.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth Trends</CardTitle>
              <CardDescription>
                Growth in buyers, vendors, and riders over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="buyers" 
                    stackId="1"
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="vendors" 
                    stackId="1"
                    stroke="#10B981" 
                    fill="#10B981" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="riders" 
                    stackId="1"
                    stroke="#F59E0B" 
                    fill="#F59E0B" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance Metrics</CardTitle>
              <CardDescription>
                Detailed performance analysis for all vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendorPerformance.map((vendor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{vendor.name}</h3>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="font-semibold">{formatCurrency(vendor.revenue)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Growth</p>
                          <div className="flex items-center">
                            {vendor.growth > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                            )}
                            <span className={`font-semibold ${
                              vendor.growth > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {vendor.growth > 0 ? '+' : ''}{vendor.growth}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-xl font-bold">{vendor.orders}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <p className="text-xl font-bold">{vendor.rating}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Performance</p>
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${vendor.rating * 20}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Performance by Area</CardTitle>
              <CardDescription>
                Delivery metrics and customer satisfaction by location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveryMetrics.map((area, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{area.area}</h3>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Orders</p>
                          <p className="font-semibold">{area.orders}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Avg Time</p>
                          <p className="font-semibold">{area.avgTime} mins</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Satisfaction</p>
                          <p className="font-semibold">{area.satisfaction}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Delivery Speed</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.max(0, 100 - (area.avgTime - 15) * 2)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Customer Satisfaction</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${area.satisfaction * 20}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Analytics

