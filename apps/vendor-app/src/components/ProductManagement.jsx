import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, AlertTriangle, Upload, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    unit: '',
    stock_quantity: '',
    low_stock_threshold: '',
    description: '',
    image_url: ''
  })

  // API Base URL - Update this to match your backend
  const API_BASE = 'https://zmhqivcvoekz.manus.space/api'

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/products?vendor_id=vendor_1`)
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.data.products || [])
      } else {
        // Use mock data if API fails
        setProducts(mockProducts)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setProducts(mockProducts)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`)
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data || [])
      } else {
        setCategories(mockCategories)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      setCategories(mockCategories)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      const productData = {
        ...formData,
        vendor_id: 'vendor_1', // This would come from authentication
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        low_stock_threshold: parseInt(formData.low_stock_threshold),
        status: 'active'
      }

      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      })

      const data = await response.json()

      if (data.success) {
        // Add the new product to the list
        setProducts(prev => [data.data, ...prev])
        
        // Reset form
        setFormData({
          name: '',
          category_id: '',
          price: '',
          unit: '',
          stock_quantity: '',
          low_stock_threshold: '',
          description: '',
          image_url: ''
        })
        
        setShowAddProduct(false)
        alert('Product added successfully!')
      } else {
        alert('Failed to add product: ' + data.error)
      }
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Failed to add product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setProducts(prev => prev.filter(p => p.product_id !== productId))
        alert('Product deleted successfully!')
      } else {
        alert('Failed to delete product: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product. Please try again.')
    }
  }

  // Mock data for fallback
  const mockProducts = [
    {
      product_id: 1,
      name: 'Fresh Tomatoes',
      category_name: 'Fresh Produce',
      price: 1200,
      stock_quantity: 25,
      unit: 'kg',
      status: 'active',
      sales_count: 45,
      image_url: '/api/placeholder/80/80',
      low_stock_threshold: 10
    },
    {
      product_id: 2,
      name: 'Local Rice',
      category_name: 'Groceries',
      price: 3500,
      stock_quantity: 8,
      unit: '2kg bag',
      status: 'active',
      sales_count: 32,
      image_url: '/api/placeholder/80/80',
      low_stock_threshold: 10
    }
  ]

  const mockCategories = [
    { category_id: 'cat_1', name: 'Fresh Produce' },
    { category_id: 'cat_2', name: 'Groceries' },
    { category_id: 'cat_3', name: 'Meat & Fish' },
    { category_id: 'cat_4', name: 'Spices' }
  ]

  const allCategories = ['all', ...categories.map(cat => cat.name)]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category_name === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'out_of_stock': return 'bg-red-100 text-red-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isLowStock = (product) => {
    return product.stock_quantity <= (product.low_stock_threshold || 10) && product.stock_quantity > 0
  }

  const AddProductForm = () => (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Add New Product</CardTitle>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowAddProduct(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--market-green)] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select 
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--market-green)] focus:border-transparent"
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price (₦) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--market-green)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Unit *</label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              placeholder="e.g., kg, pieces, liters"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--market-green)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Initial Stock *</label>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--market-green)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Low Stock Alert</label>
            <input
              type="number"
              name="low_stock_threshold"
              value={formData.low_stock_threshold}
              onChange={handleInputChange}
              placeholder="Minimum quantity (default: 10)"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--market-green)] focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Product Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--market-green)] focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Product description..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--market-green)] focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2 flex space-x-3">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[var(--market-green)] hover:bg-[var(--market-green)]/90"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setShowAddProduct(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-[var(--market-gray)]">Manage your inventory and product listings</p>
        </div>
        <Button 
          onClick={() => setShowAddProduct(!showAddProduct)}
          className="bg-[var(--market-green)] hover:bg-[var(--market-green)]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Add Product Form */}
      {showAddProduct && <AddProductForm />}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--market-gray)]" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--market-green)] focus:border-transparent"
                />
              </div>
            </div>
          <div className="flex space-x-2">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--market-green)] focus:border-transparent"
            >
              {allCategories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Products Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <Card key={product.product_id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-2xl">🥗</span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-[var(--market-gray)]">{product.category_name}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteProduct(product.product_id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--market-gray)]">Price</span>
                <span className="font-medium text-[var(--market-green)]">
                  ₦{product.price.toLocaleString()}/{product.unit}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--market-gray)]">Stock</span>
                <div className="flex items-center space-x-2">
                  {isLowStock(product) && (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className={`font-medium ${
                    product.stock_quantity === 0 
                      ? 'text-red-500' 
                      : isLowStock(product) 
                        ? 'text-yellow-600' 
                        : 'text-gray-900'
                  }`}>
                    {product.stock_quantity} {product.unit}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--market-gray)]">Sales</span>
                <span className="font-medium">{product.sales_count || 0} units</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--market-gray)]">Status</span>
                <Badge className={getStatusColor(product.status)}>
                  {product.status.replace('_', ' ')}
                </Badge>
              </div>

              {product.stock_quantity === 0 && (
                <Button size="sm" className="w-full bg-[var(--market-orange)] hover:bg-[var(--market-orange)]/90">
                  <Package className="w-4 h-4 mr-2" />
                  Restock
                </Button>
              )}

              {isLowStock(product) && product.stock_quantity > 0 && (
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-800 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Low stock alert
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {filteredProducts.length === 0 && (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-[var(--market-gray)] mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start by adding your first product to the inventory'
            }
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <Button 
              onClick={() => setShowAddProduct(true)}
              className="bg-[var(--market-green)] hover:bg-[var(--market-green)]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          )}
        </CardContent>
      </Card>
    )}
  </div>
)
}

export default ProductManagement

