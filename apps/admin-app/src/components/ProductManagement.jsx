import React, { useState, useEffect } from 'react'
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, Package, 
  TrendingUp, AlertTriangle, Star, MoreHorizontal,
  Upload, Download, RefreshCw, Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [analytics, setAnalytics] = useState({})

  // Mock data for demonstration
  useEffect(() => {
    const mockProducts = [
      {
        product_id: 'prod_001',
        name: 'Fresh Tomatoes',
        description: 'Fresh, ripe tomatoes perfect for cooking',
        category_id: 'cat_fresh_produce',
        vendor_id: 'vendor_001',
        price: 500,
        discount_price: null,
        sku: 'TOM001',
        stock_quantity: 100,
        status: 'active',
        images: ['tomatoes.jpg'],
        tags: ['fresh', 'vegetables'],
        rating: 4.5,
        sales_count: 45,
        views_count: 234,
        created_at: '2025-01-15T10:00:00Z'
      },
      {
        product_id: 'prod_002',
        name: 'Rice (50kg bag)',
        description: 'Premium quality rice, 50kg bag',
        category_id: 'cat_groceries',
        vendor_id: 'vendor_002',
        price: 25000,
        discount_price: 23000,
        sku: 'RICE001',
        stock_quantity: 5,
        status: 'active',
        images: ['rice.jpg'],
        tags: ['staple', 'bulk'],
        rating: 4.8,
        sales_count: 78,
        views_count: 456,
        created_at: '2025-01-14T15:30:00Z'
      },
      {
        product_id: 'prod_003',
        name: 'Fresh Fish',
        description: 'Fresh catch of the day',
        category_id: 'cat_meat_fish',
        vendor_id: 'vendor_003',
        price: 1500,
        discount_price: null,
        sku: 'FISH001',
        stock_quantity: 0,
        status: 'out_of_stock',
        images: ['fish.jpg'],
        tags: ['fresh', 'protein'],
        rating: 4.2,
        sales_count: 23,
        views_count: 189,
        created_at: '2025-01-13T08:45:00Z'
      }
    ]

    const mockCategories = [
      { category_id: 'cat_fresh_produce', name: 'Fresh Produce' },
      { category_id: 'cat_groceries', name: 'Groceries' },
      { category_id: 'cat_meat_fish', name: 'Meat & Fish' }
    ]

    const mockVendors = [
      { vendor_id: 'vendor_001', name: 'Fresh Farm Market' },
      { vendor_id: 'vendor_002', name: 'Grain Suppliers Ltd' },
      { vendor_id: 'vendor_003', name: 'Ocean Fresh' }
    ]

    const mockAnalytics = {
      total_products: 156,
      active_products: 142,
      out_of_stock: 14,
      total_inventory_value: 2450000,
      low_stock_alerts: 8
    }

    setProducts(mockProducts)
    setCategories(mockCategories)
    setVendors(mockVendors)
    setAnalytics(mockAnalytics)
    setLoading(false)
  }, [])

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
      out_of_stock: { color: 'bg-red-100 text-red-800', label: 'Out of Stock' },
      discontinued: { color: 'bg-orange-100 text-orange-800', label: 'Discontinued' }
    }
    const config = statusConfig[status] || statusConfig.inactive
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getStockStatus = (quantity) => {
    if (quantity === 0) return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
    if (quantity <= 10) return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
    return <Badge className="bg-green-100 text-green-800">In Stock</Badge>
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory
    const matchesStatus = !selectedStatus || product.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      description: product?.description || '',
      category_id: product?.category_id || '',
      vendor_id: product?.vendor_id || '',
      price: product?.price || '',
      discount_price: product?.discount_price || '',
      sku: product?.sku || '',
      stock_quantity: product?.stock_quantity || '',
      status: product?.status || 'active',
      tags: product?.tags?.join(', ') || ''
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave({
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      })
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.category_id} value={category.category_id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vendor">Vendor *</Label>
                <Select value={formData.vendor_id} onValueChange={(value) => setFormData({...formData, vendor_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map(vendor => (
                      <SelectItem key={vendor.vendor_id} value={vendor.vendor_id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price (₦) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="discount_price">Discount Price (₦)</Label>
                <Input
                  id="discount_price"
                  type="number"
                  value={formData.discount_price}
                  onChange={(e) => setFormData({...formData, discount_price: parseFloat(e.target.value) || null})}
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value)})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="fresh, organic, local"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {product ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your product catalog and inventory</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{analytics.total_products}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-green-600">{analytics.active_products}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{analytics.out_of_stock}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-yellow-600">{analytics.low_stock_alerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inventory Value</p>
                <p className="text-lg font-bold">₦{analytics.total_inventory_value?.toLocaleString()}</p>
              </div>
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.category_id} value={category.category_id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {categories.find(c => c.category_id === product.category_id)?.name}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">₦{product.price.toLocaleString()}</div>
                      {product.discount_price && (
                        <div className="text-sm text-green-600">
                          Sale: ₦{product.discount_price.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{product.stock_quantity}</div>
                      {getStockStatus(product.stock_quantity)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(product.status)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Star className="w-3 h-3 text-yellow-400 mr-1" />
                        {product.rating}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.sales_count} sales • {product.views_count} views
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Package className="w-4 h-4 mr-2" />
                          Update Stock
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      {showAddModal && (
        <ProductForm
          onSave={(data) => {
            console.log('Adding product:', data)
            setShowAddModal(false)
          }}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSave={(data) => {
            console.log('Updating product:', data)
            setEditingProduct(null)
          }}
          onCancel={() => setEditingProduct(null)}
        />
      )}
    </div>
  )
}

export default ProductManagement

