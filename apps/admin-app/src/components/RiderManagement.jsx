import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Clock,
  Star,
  Bike,
  CheckCircle,
  XCircle,
  Phone,
  TrendingUp,
  DollarSign
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
import { Progress } from '@/components/ui/progress'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const RiderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterAvailability, setFilterAvailability] = useState('all')

  // Sample rider data
  const riders = [
    {
      id: 1,
      name: 'Yakubu Musa',
      email: 'yakubu.rider@gmail.com',
      phone: '+234 803 456 7890',
      vehicleType: 'okada',
      licensePlate: 'ABC123KD',
      status: 'active',
      availability: 'online',
      currentLocation: 'Modern Market Area',
      rating: 4.8,
      totalDeliveries: 156,
      completedToday: 8,
      earnings: {
        today: 8500,
        week: 45000,
        month: 180000
      },
      onlineHours: 6.5,
      joinDate: '2025-01-12',
      lastActive: '30 mins ago',
      successRate: 98.5,
      avgDeliveryTime: 25
    },
    {
      id: 2,
      name: 'Ibrahim Sule',
      email: 'ibrahim.rider@gmail.com',
      phone: '+234 805 678 9012',
      vehicleType: 'okada',
      licensePlate: 'XYZ789KD',
      status: 'active',
      availability: 'offline',
      currentLocation: 'BSU Campus',
      rating: 4.6,
      totalDeliveries: 89,
      completedToday: 0,
      earnings: {
        today: 0,
        week: 28000,
        month: 120000
      },
      onlineHours: 0,
      joinDate: '2025-01-15',
      lastActive: '2 hours ago',
      successRate: 96.2,
      avgDeliveryTime: 28
    },
    {
      id: 3,
      name: 'Mohammed Aliyu',
      email: 'mohammed.rider@gmail.com',
      phone: '+234 807 890 1234',
      vehicleType: 'okada',
      licensePlate: 'DEF456KD',
      status: 'active',
      availability: 'busy',
      currentLocation: 'High Level Area',
      rating: 4.9,
      totalDeliveries: 203,
      completedToday: 12,
      earnings: {
        today: 12000,
        week: 52000,
        month: 210000
      },
      onlineHours: 8.2,
      joinDate: '2025-01-08',
      lastActive: '5 mins ago',
      successRate: 99.1,
      avgDeliveryTime: 22
    },
    {
      id: 4,
      name: 'Daniel Terver',
      email: 'daniel.rider@gmail.com',
      phone: '+234 809 012 3456',
      vehicleType: 'okada',
      licensePlate: 'GHI789KD',
      status: 'pending',
      availability: 'offline',
      currentLocation: 'Wurukum Area',
      rating: 0,
      totalDeliveries: 0,
      completedToday: 0,
      earnings: {
        today: 0,
        week: 0,
        month: 0
      },
      onlineHours: 0,
      joinDate: '2025-01-25',
      lastActive: '1 day ago',
      successRate: 0,
      avgDeliveryTime: 0
    },
    {
      id: 5,
      name: 'Samuel Ortom',
      email: 'samuel.rider@gmail.com',
      phone: '+234 810 123 4567',
      vehicleType: 'okada',
      licensePlate: 'JKL012KD',
      status: 'suspended',
      availability: 'offline',
      currentLocation: 'North Bank Area',
      rating: 3.2,
      totalDeliveries: 45,
      completedToday: 0,
      earnings: {
        today: 0,
        week: 0,
        month: 15000
      },
      onlineHours: 0,
      joinDate: '2025-01-18',
      lastActive: '3 days ago',
      successRate: 87.5,
      avgDeliveryTime: 35
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'online': return 'bg-green-100 text-green-800'
      case 'busy': return 'bg-orange-100 text-orange-800'
      case 'offline': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredRiders = riders.filter(rider => {
    const matchesSearch = rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rider.phone.includes(searchTerm)
    const matchesStatus = filterStatus === 'all' || rider.status === filterStatus
    const matchesAvailability = filterAvailability === 'all' || rider.availability === filterAvailability
    
    return matchesSearch && matchesStatus && matchesAvailability
  })

  const riderStats = {
    total: riders.length,
    active: riders.filter(r => r.status === 'active').length,
    online: riders.filter(r => r.availability === 'online').length,
    busy: riders.filter(r => r.availability === 'busy').length,
    pending: riders.filter(r => r.status === 'pending').length,
    totalDeliveries: riders.reduce((sum, r) => sum + r.totalDeliveries, 0),
    avgRating: riders.filter(r => r.rating > 0).reduce((sum, r) => sum + r.rating, 0) / riders.filter(r => r.rating > 0).length
  }

  // Sample chart data
  const deliveryTrends = [
    { day: 'Mon', deliveries: 45 },
    { day: 'Tue', deliveries: 67 },
    { day: 'Wed', deliveries: 52 },
    { day: 'Thu', deliveries: 89 },
    { day: 'Fri', deliveries: 112 },
    { day: 'Sat', deliveries: 98 },
    { day: 'Sun', deliveries: 76 }
  ]

  const performanceData = [
    { name: 'Excellent (4.5+)', value: 60, color: '#10B981' },
    { name: 'Good (4.0-4.4)', value: 25, color: '#3B82F6' },
    { name: 'Average (3.5-3.9)', value: 10, color: '#F59E0B' },
    { name: 'Poor (<3.5)', value: 5, color: '#EF4444' }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rider Management</h1>
          <p className="text-gray-600 mt-1">
            Manage delivery riders, track performance, and coordinate deliveries.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Rider
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bike className="h-5 w-5 text-gray-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{riderStats.total}</div>
                <p className="text-sm text-gray-600">Total Riders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{riderStats.active}</div>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div>
                <div className="text-2xl font-bold text-green-600">{riderStats.online}</div>
                <p className="text-sm text-gray-600">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{riderStats.busy}</div>
                <p className="text-sm text-gray-600">Busy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{riderStats.totalDeliveries}</div>
                <p className="text-sm text-gray-600">Total Deliveries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {riderStats.avgRating.toFixed(1)}
                </div>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Delivery Trends</CardTitle>
            <CardDescription>
              Total deliveries completed by all riders this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deliveryTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="deliveries" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rider Performance Distribution</CardTitle>
            <CardDescription>
              Distribution of riders by rating performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {performanceData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-gray-600">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rider Management Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Riders</TabsTrigger>
          <TabsTrigger value="online">Online Riders</TabsTrigger>
          <TabsTrigger value="pending">Pending Applications</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rider Directory</CardTitle>
              <CardDescription>
                Search and manage all riders on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search riders by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterAvailability} onValueChange={setFilterAvailability}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Riders Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rider</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Deliveries</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRiders.map((rider) => (
                      <TableRow key={rider.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{rider.name}</div>
                            <div className="text-sm text-gray-500">{rider.email}</div>
                            <div className="text-sm text-gray-500">{rider.phone}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {rider.currentLocation}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{rider.vehicleType}</div>
                            <div className="text-sm text-gray-500">{rider.licensePlate}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(rider.status)}>
                            {rider.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getAvailabilityColor(rider.availability)}>
                            {rider.availability}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {rider.rating > 0 ? (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span>{rider.rating}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">No ratings</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{rider.totalDeliveries}</div>
                            <div className="text-sm text-gray-500">
                              {rider.completedToday} today
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">₦{rider.earnings.today.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">
                              ₦{rider.earnings.month.toLocaleString()}/month
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{rider.successRate}% success</div>
                            <div className="text-sm text-gray-500">
                              {rider.avgDeliveryTime}min avg
                            </div>
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
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Rider
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="mr-2 h-4 w-4" />
                                Contact Rider
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {rider.status === 'pending' && (
                                <>
                                  <DropdownMenuItem className="text-green-600">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve Rider
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject Application
                                  </DropdownMenuItem>
                                </>
                              )}
                              {rider.status === 'active' && (
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Suspend Rider
                                </DropdownMenuItem>
                              )}
                              {rider.status === 'suspended' && (
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Reactivate Rider
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="online" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {riders.filter(r => r.availability === 'online' || r.availability === 'busy').map((rider) => (
              <Card key={rider.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{rider.name}</span>
                    <Badge className={getAvailabilityColor(rider.availability)}>
                      {rider.availability}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {rider.currentLocation}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Today's Deliveries</span>
                      <span className="font-medium">{rider.completedToday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Today's Earnings</span>
                      <span className="font-medium">₦{rider.earnings.today.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Online Hours</span>
                      <span className="font-medium">{rider.onlineHours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rating</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{rider.rating}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Rider
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Rider Applications</CardTitle>
              <CardDescription>
                Review and approve new rider applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riders.filter(r => r.status === 'pending').map((rider) => (
                  <div key={rider.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{rider.name}</h3>
                        <p className="text-gray-600">{rider.email}</p>
                        <p className="text-gray-600">{rider.phone}</p>
                        <p className="text-gray-600">Vehicle: {rider.vehicleType} - {rider.licensePlate}</p>
                        <p className="text-gray-600">Location: {rider.currentLocation}</p>
                        <p className="text-sm text-gray-500">Applied: {rider.joinDate}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {riders.filter(r => r.status === 'active' && r.rating > 0).map((rider) => (
              <Card key={rider.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{rider.name}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>{rider.rating}</span>
                    </div>
                  </CardTitle>
                  <CardDescription>{rider.currentLocation}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Deliveries</p>
                        <p className="text-2xl font-bold">{rider.totalDeliveries}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Success Rate</p>
                        <p className="text-2xl font-bold">{rider.successRate}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Earnings</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₦{rider.earnings.month.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Avg Delivery Time</span>
                        <span>{rider.avgDeliveryTime} mins</span>
                      </div>
                      <Progress value={Math.max(0, 100 - (rider.avgDeliveryTime - 20) * 2)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Performance Score</span>
                        <span>{Math.round(rider.rating * 20)}%</span>
                      </div>
                      <Progress value={rider.rating * 20} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RiderManagement

