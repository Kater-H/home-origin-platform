import { useState } from 'react'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye,
  RefreshCw,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  MapPin,
  User,
  Store
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterTimeRange, setFilterTimeRange] = useState('today')

  // Sample order data
  const orders = [
    {
      id: 'ORD-2025-001',
      customer: {
        name: 'John Doe',
        email: 'john.doe@bsu.edu.ng',
        phone: '+234 801 234 5678'
      },
      vendors: [
        { name: 'Mama Kemi\'s Store', items: 3, amount: 1500 },
        { name: 'Spice Corner', items: 2, amount: 800 }
      ],
      rider: {
        name: 'Yakubu Musa',
        phone: '+234 803 456 7890'
      },
      status: 'delivered',
      totalAmount: 2300,
      deliveryFee: 500,
      deliveryAddress: 'BSU Campus, Male Hostel B',
      orderDate: '2025-01-29 14:30',
      deliveryTime: '2025-01-29 16:15',
      paymentMethod: 'card',
      paymentStatus: 'completed'
    },
    {
      id: 'ORD-2025-002',
      customer: {
        name: 'Mary Jane',
        email: 'mary.jane@bsu.edu.ng',
        phone: '+234 804 567 8901'
      },
      vendors: [
        { name: 'Fresh Market Store', items: 5, amount: 2200 }
      ],
      rider: {
        name: 'Ibrahim Sule',
        phone: '+234 805 678 9012'
      },
      status: 'out_for_delivery',
      totalAmount: 2200,
      deliveryFee: 600,
      deliveryAddress: 'BSU Campus, Female Hostel A',
      orderDate: '2025-01-29 15:45',
      deliveryTime: null,
      paymentMethod: 'cash',
      paymentStatus: 'pending'
    },
    {
      id: 'ORD-2025-003',
      customer: {
        name: 'Grace Oche',
        email: 'grace.oche@bsu.edu.ng',
        phone: '+234 806 789 0123'
      },
      vendors: [
        { name: 'Mama Kemi\'s Store', items: 2, amount: 1200 },
        { name: 'Meat Palace', items: 1, amount: 1500 }
      ],
      rider: {
        name: 'Yakubu Musa',
        phone: '+234 803 456 7890'
      },
      status: 'processing',
      totalAmount: 2700,
      deliveryFee: 500,
      deliveryAddress: 'Modern Market Area, Shop 15',
      orderDate: '2025-01-29 16:20',
      deliveryTime: null,
      paymentMethod: 'transfer',
      paymentStatus: 'completed'
    },
    {
      id: 'ORD-2025-004',
      customer: {
        name: 'Adaeze Okwu',
        email: 'adaeze.okwu@bsu.edu.ng',
        phone: '+234 807 890 1234'
      },
      vendors: [
        { name: 'Tech Hub', items: 1, amount: 15000 }
      ],
      rider: null,
      status: 'pending',
      totalAmount: 15000,
      deliveryFee: 800,
      deliveryAddress: 'BSU Campus, Female Hostel C',
      orderDate: '2025-01-29 17:10',
      deliveryTime: null,
      paymentMethod: 'card',
      paymentStatus: 'completed'
    },
    {
      id: 'ORD-2025-005',
      customer: {
        name: 'Samuel Terver',
        email: 'samuel.terver@bsu.edu.ng',
        phone: '+234 808 901 2345'
      },
      vendors: [
        { name: 'Spice Corner', items: 4, amount: 1800 }
      ],
      rider: null,
      status: 'cancelled',
      totalAmount: 1800,
      deliveryFee: 500,
      deliveryAddress: 'BSU Campus, Male Hostel A',
      orderDate: '2025-01-29 13:15',
      deliveryTime: null,
      paymentMethod: 'cash',
      paymentStatus: 'refunded'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock
      case 'processing': return Package
      case 'out_for_delivery': return Truck
      case 'delivered': return CheckCircle
      case 'cancelled': return XCircle
      default: return Clock
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    outForDelivery: orders.filter(o => o.status === 'out_for_delivery').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.totalAmount, 0)
  }

  // Sample chart data
  const orderTrends = [
    { time: '09:00', orders: 12 },
    { time: '10:00', orders: 19 },
    { time: '11:00', orders: 15 },
    { time: '12:00', orders: 25 },
    { time: '13:00', orders: 32 },
    { time: '14:00', orders: 28 },
    { time: '15:00', orders: 35 },
    { time: '16:00', orders: 22 },
    { time: '17:00', orders: 18 }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage all orders across the platform in real-time.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{orderStats.total}</div>
            <p className="text-sm text-gray-600">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{orderStats.pending}</div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{orderStats.processing}</div>
            <p className="text-sm text-gray-600">Processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{orderStats.outForDelivery}</div>
            <p className="text-sm text-gray-600">Out for Delivery</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{orderStats.delivered}</div>
            <p className="text-sm text-gray-600">Delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{orderStats.cancelled}</div>
            <p className="text-sm text-gray-600">Cancelled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              ₦{(orderStats.totalRevenue / 1000).toFixed(0)}K
            </div>
            <p className="text-sm text-gray-600">Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Order Trends Today</CardTitle>
          <CardDescription>
            Hourly order volume throughout the day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={orderTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order Directory</CardTitle>
          <CardDescription>
            Search and manage all orders with detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders by ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTimeRange} onValueChange={setFilterTimeRange}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vendors</TableHead>
                  <TableHead>Rider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Order Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status)
                  return (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">{order.id}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer.name}</div>
                          <div className="text-sm text-gray-500">{order.customer.email}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {order.deliveryAddress}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.vendors.map((vendor, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium">{vendor.name}</span>
                              <span className="text-gray-500 ml-2">
                                ({vendor.items} items - ₦{vendor.amount.toLocaleString()})
                              </span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.rider ? (
                          <div>
                            <div className="font-medium">{order.rider.name}</div>
                            <div className="text-sm text-gray-500">{order.rider.phone}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">₦{order.totalAmount.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">
                            + ₦{order.deliveryFee} delivery
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{order.paymentMethod}</div>
                          <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                            {order.paymentStatus}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(order.orderDate).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <User className="mr-2 h-4 w-4" />
                              Contact Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-4 w-4" />
                              Assign Rider
                            </DropdownMenuItem>
                            {order.status !== 'cancelled' && order.status !== 'delivered' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Cancel Order
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default OrderManagement

