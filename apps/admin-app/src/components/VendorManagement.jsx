import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Package,
  TrendingUp,
  MapPin
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

const VendorManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  // Sample vendor data
  const vendors = [
    {
      id: 1,
      name: 'Mama Kemi\'s Store',
      owner: 'Kemi Adebayo',
      email: 'mamakemi@gmail.com',
      phone: '+234 802 345 6789',
      category: 'Fresh Produce',
      location: 'Modern Market, Shop 15',
      status: 'active',
      rating: 4.8,
      totalProducts: 45,
      totalOrders: 234,
      revenue: '₦1,250,000',
      joinDate: '2025-01-10',
      lastActive: '2 hours ago',
      commission: 8.5
    },
    {
      id: 2,
      name: 'Fresh Market Store',
      owner: 'Ibrahim Sule',
      email: 'freshmarket@gmail.com',
      phone: '+234 805 678 9012',
      category: 'Groceries',
      location: 'Modern Market, Shop 8',
      status: 'pending',
      rating: 0,
      totalProducts: 0,
      totalOrders: 0,
      revenue: '₦0',
      joinDate: '2025-01-20',
      lastActive: '1 day ago',
      commission: 10.0
    },
    {
      id: 3,
      name: 'Spice Corner',
      owner: 'Fatima Mohammed',
      email: 'spicecorner@gmail.com',
      phone: '+234 803 456 7890',
      category: 'Spices & Seasonings',
      location: 'Modern Market, Shop 22',
      status: 'active',
      rating: 4.6,
      totalProducts: 28,
      totalOrders: 156,
      revenue: '₦780,000',
      joinDate: '2025-01-12',
      lastActive: '1 hour ago',
      commission: 9.0
    },
    {
      id: 4,
      name: 'Meat Palace',
      owner: 'John Okoro',
      email: 'meatpalace@gmail.com',
      phone: '+234 804 567 8901',
      category: 'Meat & Fish',
      location: 'Modern Market, Shop 5',
      status: 'suspended',
      rating: 3.2,
      totalProducts: 15,
      totalOrders: 67,
      revenue: '₦340,000',
      joinDate: '2025-01-08',
      lastActive: '3 days ago',
      commission: 12.0
    },
    {
      id: 5,
      name: 'Tech Hub',
      owner: 'Grace Oche',
      email: 'techhub@gmail.com',
      phone: '+234 806 789 0123',
      category: 'Electronics',
      location: 'Modern Market, Shop 30',
      status: 'active',
      rating: 4.9,
      totalProducts: 67,
      totalOrders: 89,
      revenue: '₦2,100,000',
      joinDate: '2025-01-15',
      lastActive: '30 mins ago',
      commission: 7.5
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

  const getCategoryColor = (category) => {
    const colors = {
      'Fresh Produce': 'bg-green-100 text-green-800',
      'Groceries': 'bg-blue-100 text-blue-800',
      'Spices & Seasonings': 'bg-orange-100 text-orange-800',
      'Meat & Fish': 'bg-red-100 text-red-800',
      'Electronics': 'bg-purple-100 text-purple-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || vendor.status === filterStatus
    const matchesCategory = filterCategory === 'all' || vendor.category === filterCategory
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const vendorStats = {
    total: vendors.length,
    active: vendors.filter(v => v.status === 'active').length,
    pending: vendors.filter(v => v.status === 'pending').length,
    suspended: vendors.filter(v => v.status === 'suspended').length,
    totalRevenue: vendors.reduce((sum, v) => sum + parseInt(v.revenue.replace(/[₦,]/g, '')), 0),
    avgRating: vendors.filter(v => v.rating > 0).reduce((sum, v) => sum + v.rating, 0) / vendors.filter(v => v.rating > 0).length
  }

  const categories = [...new Set(vendors.map(v => v.category))]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600 mt-1">
            Manage vendor applications, approvals, and performance monitoring.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-gray-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{vendorStats.total}</div>
                <p className="text-sm text-gray-600">Total Vendors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{vendorStats.active}</div>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{vendorStats.pending}</div>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  ₦{(vendorStats.totalRevenue / 1000000).toFixed(1)}M
                </div>
                <p className="text-sm text-gray-600">Total Revenue</p>
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
                  {vendorStats.avgRating.toFixed(1)}
                </div>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Management Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Vendors</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Directory</CardTitle>
              <CardDescription>
                Search and manage all vendors on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search vendors by name, owner, or email..."
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
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Vendors Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{vendor.name}</div>
                            <div className="text-sm text-gray-500">{vendor.owner}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {vendor.location}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(vendor.category)}>
                            {vendor.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(vendor.status)}>
                            {vendor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {vendor.rating > 0 ? (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span>{vendor.rating}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">No ratings</span>
                          )}
                        </TableCell>
                        <TableCell>{vendor.totalProducts}</TableCell>
                        <TableCell>{vendor.totalOrders}</TableCell>
                        <TableCell>{vendor.revenue}</TableCell>
                        <TableCell>{vendor.commission}%</TableCell>
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
                                Edit Vendor
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {vendor.status === 'pending' && (
                                <>
                                  <DropdownMenuItem className="text-green-600">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve Vendor
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject Application
                                  </DropdownMenuItem>
                                </>
                              )}
                              {vendor.status === 'active' && (
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Suspend Vendor
                                </DropdownMenuItem>
                              )}
                              {vendor.status === 'suspended' && (
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Reactivate Vendor
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

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Vendor Applications</CardTitle>
              <CardDescription>
                Review and approve new vendor applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendors.filter(v => v.status === 'pending').map((vendor) => (
                  <div key={vendor.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{vendor.name}</h3>
                        <p className="text-gray-600">Owner: {vendor.owner}</p>
                        <p className="text-gray-600">Category: {vendor.category}</p>
                        <p className="text-gray-600">Location: {vendor.location}</p>
                        <p className="text-sm text-gray-500">Applied: {vendor.joinDate}</p>
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
            {vendors.filter(v => v.status === 'active').map((vendor) => (
              <Card key={vendor.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{vendor.name}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>{vendor.rating}</span>
                    </div>
                  </CardTitle>
                  <CardDescription>{vendor.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Products</p>
                        <p className="text-2xl font-bold">{vendor.totalProducts}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Orders</p>
                        <p className="text-2xl font-bold">{vendor.totalOrders}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold text-green-600">{vendor.revenue}</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Performance Score</span>
                        <span>{Math.round(vendor.rating * 20)}%</span>
                      </div>
                      <Progress value={vendor.rating * 20} className="h-2" />
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

export default VendorManagement

