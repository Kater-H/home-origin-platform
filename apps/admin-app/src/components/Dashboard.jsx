import { useState, useEffect } from 'react'
import { 
  Users, 
  Store, 
  ShoppingCart, 
  Bike,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
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
  Cell
} from 'recharts'
import ApiService from '../services/api'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fallback data in case API is not available
  const fallbackData = {
    stats: {
      totalUsers: 2847,
      userGrowth: 12.5,
      activeVendors: 156,
      vendorGrowth: 8.2,
      totalOrders: 1234,
      orderGrowth: 23.1,
      activeRiders: 89,
      riderGrowth: -2.4
    },
    salesData: [
      { name: 'Mon', sales: 12000, orders: 45 },
      { name: 'Tue', sales: 19000, orders: 67 },
      { name: 'Wed', sales: 15000, orders: 52 },
      { name: 'Thu', sales: 25000, orders: 89 },
      { name: 'Fri', sales: 32000, orders: 112 },
      { name: 'Sat', sales: 28000, orders: 98 },
      { name: 'Sun', sales: 22000, orders: 76 }
    ],
    categoryData: [
      { name: 'Fresh Produce', value: 35, color: '#10B981' },
      { name: 'Groceries', value: 25, color: '#3B82F6' },
      { name: 'Meat & Fish', value: 20, color: '#F59E0B' },
      { name: 'Electronics', value: 12, color: '#EF4444' },
      { name: 'Others', value: 8, color: '#8B5CF6' }
    ],
    recentOrders: [
      {
        id: 'ORD-2025-001',
        customer: 'John Doe',
        vendor: 'Mama Kemi\'s Store',
        amount: '₦2,500',
        status: 'delivered',
        time: '2 hours ago'
      },
      {
        id: 'ORD-2025-002',
        customer: 'Mary Jane',
        vendor: 'Fresh Market',
        amount: '₦1,800',
        status: 'processing',
        time: '3 hours ago'
      },
      {
        id: 'ORD-2025-003',
        customer: 'Grace Oche',
        vendor: 'Spice Corner',
        amount: '₦3,200',
        status: 'pending',
        time: '4 hours ago'
      }
    ]
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const data = await ApiService.getDashboardStats()
        setDashboardData(data)
        setError(null)
      } catch (err) {
        console.warn('Failed to fetch dashboard data, using fallback:', err)
        setDashboardData(fallbackData)
        setError('Using demo data - API connection failed')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const data = dashboardData || fallbackData
  const stats = data.stats || fallbackData.stats
  const salesData = data.salesData || fallbackData.salesData
  const categoryData = data.categoryData || fallbackData.categoryData
  const recentOrders = data.recentOrders || fallbackData.recentOrders

  const statsConfig = [
    {
      title: 'Total Users',
      value: stats.totalUsers?.toLocaleString() || '2,847',
      change: `${stats.userGrowth > 0 ? '+' : ''}${stats.userGrowth}%` || '+12.5%',
      trend: stats.userGrowth >= 0 ? 'up' : 'down',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Vendors',
      value: stats.activeVendors?.toString() || '156',
      change: `${stats.vendorGrowth > 0 ? '+' : ''}${stats.vendorGrowth}%` || '+8.2%',
      trend: stats.vendorGrowth >= 0 ? 'up' : 'down',
      icon: Store,
      color: 'green'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders?.toLocaleString() || '1,234',
      change: `${stats.orderGrowth > 0 ? '+' : ''}${stats.orderGrowth}%` || '+23.1%',
      trend: stats.orderGrowth >= 0 ? 'up' : 'down',
      icon: ShoppingCart,
      color: 'purple'
    },
    {
      title: 'Active Riders',
      value: stats.activeRiders?.toString() || '89',
      change: `${stats.riderGrowth > 0 ? '+' : ''}${stats.riderGrowth}%` || '-2.4%',
      trend: stats.riderGrowth >= 0 ? 'up' : 'down',
      icon: Bike,
      color: 'orange'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with Modern Market Connect today.
          </p>
          {error && (
            <p className="text-sm text-orange-600 mt-1">
              ⚠️ {error}
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            Export Report
          </Button>
          <Button>
            View Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 text-${stat.color}-600`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="flex items-center mt-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span className={`text-xs ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              Daily sales and order trends for the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'sales' ? `₦${value.toLocaleString()}` : value,
                    name === 'sales' ? 'Sales' : 'Orders'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.1}
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>
              Product category distribution this month
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
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-gray-600">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest orders from the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{order.id}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.customer} • {order.vendor}
                    </p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Orders
            </Button>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Platform health and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">API Services</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Operational</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Database</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Operational</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Payment Gateway</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Server Load</span>
                  <span>68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Storage Usage</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

