import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Package, ShoppingCart, DollarSign, Eye, Users, Clock, CheckCircle, Lightbulb, Truck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import DemandForecastInsights from './DemandForecastInsights'
import ProductSentimentInsights from './ProductSentimentInsights'

const VendorDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    salesGrowth: 0,
    ordersGrowth: 0,
    productsGrowth: 0,
    customersGrowth: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [salesData, setSalesData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [vendorInsights, setVendorInsights] = useState(null)

  useEffect(() => {
    // Fetch dashboard stats
    // Mock data for now, replace with actual API call
    setDashboardStats({
      totalSales: 125000,
      totalOrders: 89,
      totalProducts: 24,
      totalCustomers: 156,
      salesGrowth: 12.5,
      ordersGrowth: 8.3,
      productsGrowth: 4.2,
      customersGrowth: 15.7
    })

    // Fetch recent orders
    // Mock data for now, replace with actual API call
    setRecentOrders([
      {
        id: '#ORD-2025-001',
        customer: 'Adaeze Okwu',
        items: ['Fresh Tomatoes (1kg)', 'Onions (500g)'],
        total: 1800,
        status: 'pending',
        time: '5 minutes ago',
        isMultiVendor: true
      },
      {
        id: '#ORD-2025-002',
        customer: 'Ibrahim Sule',
        items: ['Rice (2kg)'],
        total: 3500,
        status: 'preparing',
        time: '12 minutes ago',
        isMultiVendor: false
      },
      {
        id: '#ORD-2025-003',
        customer: 'Grace Oche',
        items: ['Pepper (200g)', 'Ginger (100g)'],
        total: 800,
        status: 'ready',
        time: '25 minutes ago',
        isMultiVendor: true
      }
    ])

    // Fetch sales data
    // Mock data for now, replace with actual API call
    setSalesData([
      { name: 'Mon', sales: 12000 },
      { name: 'Tue', sales: 15000 },
      { name: 'Wed', sales: 18000 },
      { name: 'Thu', sales: 14000 },
      { name: 'Fri', sales: 22000 },
      { name: 'Sat', sales: 28000 },
      { name: 'Sun', sales: 16000 }
    ])

    // Fetch top products
    // Mock data for now, replace with actual API call
    setTopProducts([
      { name: 'Fresh Tomatoes', sales: 45, revenue: 54000 },
      { name: 'Local Rice', sales: 32, revenue: 112000 },
      { name: 'Onions', sales: 28, revenue: 33600 },
      { name: 'Pepper', sales: 24, revenue: 19200 }
    ])

    // Fetch AI insights
    const fetchVendorInsights = async () => {
      try {
        // Assuming vendor_id is available from authentication context or props
        const vendorId = 1; // Placeholder, replace with actual vendor ID
        const response = await fetch('https://0vhlizckl8p1.manus.space/api/ai/vendor-insights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ vendor_id: vendorId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setVendorInsights(data.insights);
      } catch (error) {
        console.error('Error fetching vendor insights:', error);
      }
    };

    fetchVendorInsights();
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'preparing': return 'bg-blue-100 text-blue-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3" />
      case 'preparing': return <Package className="w-3 h-3" />
      case 'ready': return <CheckCircle className="w-3 h-3" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Mama Kemi!</h1>
        <p className="text-[var(--market-gray)]">Here's what's happening with your store today.</p>
      </div>

      {/* AI Insights Card */}
      {vendorInsights && (
        <Card className="border-l-4 border-[var(--market-green)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-[var(--market-green)]" />
              <span>AI-Powered Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900 mb-2">{vendorInsights.top_selling_product.name}</p>
            <p className="text-sm text-[var(--market-gray)]">Top selling product with {vendorInsights.top_selling_product.sales_volume} units sold.</p>
            <p className="text-sm text-[var(--market-gray)] mt-2">Customer Sentiment: {vendorInsights.customer_sentiment}</p>
            <p className="text-sm text-[var(--market-gray)]">Stock Recommendation: {vendorInsights.stock_recommendation}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--market-gray)]">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">₦{dashboardStats.totalSales.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{dashboardStats.salesGrowth}% from last week
                </p>
              </div>
              <div className="w-12 h-12 bg-[var(--market-green)]/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[var(--market-green)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--market-gray)]">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalOrders}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{dashboardStats.ordersGrowth}% from last week
                </p>
              </div>
              <div className="w-12 h-12 bg-[var(--market-blue)]/10 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-[var(--market-blue)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--market-gray)]">Products</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalProducts}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{dashboardStats.productsGrowth}% from last week
                </p>
              </div>
              <div className="w-12 h-12 bg-[var(--market-orange)]/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-[var(--market-orange)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--market-gray)]">Customers</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalCustomers}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{dashboardStats.customersGrowth}% from last week
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/orders">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Manage Orders</h3>
                  <p className="text-sm text-gray-600">View and fulfill customer orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/products">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium">Manage Products</h3>
                  <p className="text-sm text-gray-600">Add, edit, and organize products</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/delivery">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Delivery Management</h3>
                  <p className="text-sm text-gray-600">Track deliveries and settings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, 'Sales']} />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="var(--market-green)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--market-green)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🥗</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-[var(--market-gray)]">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[var(--market-green)]">₦{product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{order.id}</p>
                      {order.isMultiVendor && (
                        <Badge variant="outline" className="text-xs">Multi-vendor</Badge>
                      )}
                    </div>
                    <p className="text-sm text-[var(--market-gray)]">{order.customer}</p>
                    <p className="text-xs text-[var(--market-gray)]">{order.items.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium text-[var(--market-green)]">₦{order.total.toLocaleString()}</p>
                    <p className="text-xs text-[var(--market-gray)]">{order.time}</p>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </Badge>
                  <Button size="sm" className="bg-[var(--market-green)] hover:bg-[var(--market-green)]/90">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI-Powered Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <DemandForecastInsights />
        <ProductSentimentInsights />
      </div>
    </div>
  )
}

export default VendorDashboard

