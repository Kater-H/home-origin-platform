import React, { useState, useEffect } from 'react'
import { 
  Plus, Search, Edit, Trash2, Eye, FolderPlus, 
  Folder, FolderOpen, MoreHorizontal, ArrowUp, ArrowDown,
  Grid, List, RefreshCw, Settings, Image, Palette
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
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('hierarchy') // hierarchy, list
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [selectedParent, setSelectedParent] = useState(null)
  const [analytics, setAnalytics] = useState({})

  // Mock data for demonstration
  useEffect(() => {
    const mockCategories = [
      {
        category_id: 'cat_fresh_produce',
        name: 'Fresh Produce',
        description: 'Fresh fruits, vegetables, and herbs',
        parent_id: null,
        slug: 'fresh_produce',
        icon: '🥬',
        color: '#10B981',
        sort_order: 1,
        is_active: true,
        is_featured: true,
        product_count: 45,
        total_sales: 234,
        total_revenue: 125000,
        view_count: 1234,
        created_at: '2025-01-10T10:00:00Z'
      },
      {
        category_id: 'cat_fruits',
        name: 'Fruits',
        description: 'Fresh seasonal fruits',
        parent_id: 'cat_fresh_produce',
        slug: 'fruits',
        icon: '🍎',
        color: '#10B981',
        sort_order: 1,
        is_active: true,
        is_featured: false,
        product_count: 20,
        total_sales: 120,
        total_revenue: 65000,
        view_count: 567,
        created_at: '2025-01-10T10:30:00Z'
      },
      {
        category_id: 'cat_vegetables',
        name: 'Vegetables',
        description: 'Fresh vegetables and leafy greens',
        parent_id: 'cat_fresh_produce',
        slug: 'vegetables',
        icon: '🥕',
        color: '#10B981',
        sort_order: 2,
        is_active: true,
        is_featured: false,
        product_count: 25,
        total_sales: 114,
        total_revenue: 60000,
        view_count: 667,
        created_at: '2025-01-10T11:00:00Z'
      },
      {
        category_id: 'cat_groceries',
        name: 'Groceries',
        description: 'Rice, beans, spices, oils and pantry essentials',
        parent_id: null,
        slug: 'groceries',
        icon: '🛒',
        color: '#F59E0B',
        sort_order: 2,
        is_active: true,
        is_featured: true,
        product_count: 78,
        total_sales: 456,
        total_revenue: 890000,
        view_count: 2345,
        created_at: '2025-01-09T14:00:00Z'
      },
      {
        category_id: 'cat_grains_cereals',
        name: 'Grains & Cereals',
        description: 'Rice, wheat, oats, and cereals',
        parent_id: 'cat_groceries',
        slug: 'grains_cereals',
        icon: '🌾',
        color: '#F59E0B',
        sort_order: 1,
        is_active: true,
        is_featured: false,
        product_count: 35,
        total_sales: 234,
        total_revenue: 450000,
        view_count: 1123,
        created_at: '2025-01-09T14:30:00Z'
      },
      {
        category_id: 'cat_meat_fish',
        name: 'Meat & Fish',
        description: 'Fresh meat, fish, and poultry',
        parent_id: null,
        slug: 'meat_fish',
        icon: '🐟',
        color: '#EF4444',
        sort_order: 3,
        is_active: true,
        is_featured: true,
        product_count: 32,
        total_sales: 189,
        total_revenue: 340000,
        view_count: 987,
        created_at: '2025-01-08T09:00:00Z'
      }
    ]

    const mockAnalytics = {
      total_categories: 15,
      active_categories: 14,
      featured_categories: 6,
      parent_categories: 8,
      child_categories: 7
    }

    setCategories(mockCategories)
    setAnalytics(mockAnalytics)
    setLoading(false)
  }, [])

  const getParentCategories = () => {
    return categories.filter(cat => !cat.parent_id)
  }

  const getChildCategories = (parentId) => {
    return categories.filter(cat => cat.parent_id === parentId)
  }

  const getCategoryHierarchy = () => {
    const parents = getParentCategories()
    return parents.map(parent => ({
      ...parent,
      children: getChildCategories(parent.category_id)
    }))
  }

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const CategoryForm = ({ category, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: category?.name || '',
      description: category?.description || '',
      parent_id: category?.parent_id || '',
      icon: category?.icon || '',
      color: category?.color || '#10B981',
      sort_order: category?.sort_order || 1,
      is_active: category?.is_active ?? true,
      is_featured: category?.is_featured ?? false,
      meta_title: category?.meta_title || '',
      meta_description: category?.meta_description || ''
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave(formData)
    }

    const parentCategories = getParentCategories().filter(cat => 
      !category || cat.category_id !== category.category_id
    )

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            {category ? 'Edit Category' : 'Add New Category'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="parent">Parent Category</Label>
                <Select value={formData.parent_id} onValueChange={(value) => setFormData({...formData, parent_id: value || null})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Parent (Top Level)</SelectItem>
                    {parentCategories.map(parent => (
                      <SelectItem key={parent.category_id} value={parent.category_id}>
                        {parent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="icon">Icon/Emoji</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  placeholder="🥬"
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    placeholder="#10B981"
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meta_title">Meta Title (SEO)</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="meta_description">Meta Description (SEO)</Label>
                <Input
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {category ? 'Update Category' : 'Add Category'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const CategoryCard = ({ category, level = 0 }) => {
    const children = getChildCategories(category.category_id)
    
    return (
      <div className={`${level > 0 ? 'ml-8 mt-2' : 'mb-4'}`}>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon || category.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{category.name}</h3>
                    {category.is_featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                    )}
                    {!category.is_active && (
                      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span>{category.product_count} products</span>
                    <span>{category.total_sales} sales</span>
                    <span>₦{category.total_revenue.toLocaleString()} revenue</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => setEditingCategory(category)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSelectedParent(category.category_id)
                      setShowAddModal(true)
                    }}>
                      <FolderPlus className="w-4 h-4 mr-2" />
                      Add Subcategory
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Products
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {children.map(child => (
          <CategoryCard key={child.category_id} category={child} level={level + 1} />
        ))}
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
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600">Organize your product catalog with categories</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'hierarchy' ? 'list' : 'hierarchy')}>
            {viewMode === 'hierarchy' ? <List className="w-4 h-4 mr-2" /> : <Grid className="w-4 h-4 mr-2" />}
            {viewMode === 'hierarchy' ? 'List View' : 'Hierarchy View'}
          </Button>
          <Button onClick={() => {
            setSelectedParent(null)
            setShowAddModal(true)
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold">{analytics.total_categories}</p>
              </div>
              <Folder className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Categories</p>
                <p className="text-2xl font-bold text-green-600">{analytics.active_categories}</p>
              </div>
              <FolderOpen className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured Categories</p>
                <p className="text-2xl font-bold text-yellow-600">{analytics.featured_categories}</p>
              </div>
              <Badge className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Parent Categories</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.parent_categories}</p>
              </div>
              <Folder className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Child Categories</p>
                <p className="text-2xl font-bold text-indigo-600">{analytics.child_categories}</p>
              </div>
              <FolderPlus className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Display */}
      {viewMode === 'hierarchy' ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">Category Hierarchy</h2>
          {getCategoryHierarchy()
            .filter(category => 
              !searchTerm || 
              category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              category.children.some(child => 
                child.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
            )
            .map(category => (
              <CategoryCard key={category.category_id} category={category} />
            ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Categories ({filteredCategories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.category_id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.icon || category.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-gray-500">{category.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {category.parent_id ? 
                        categories.find(c => c.category_id === category.parent_id)?.name || 'Unknown' :
                        'Top Level'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{category.product_count}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{category.total_sales} sales</div>
                        <div className="text-xs text-gray-500">
                          ₦{category.total_revenue.toLocaleString()} revenue
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {category.is_featured && (
                          <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                        )}
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
                          <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedParent(category.category_id)
                            setShowAddModal(true)
                          }}>
                            <FolderPlus className="w-4 h-4 mr-2" />
                            Add Subcategory
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Products
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
      )}

      {/* Modals */}
      {showAddModal && (
        <CategoryForm
          category={selectedParent ? { parent_id: selectedParent } : null}
          onSave={(data) => {
            console.log('Adding category:', data)
            setShowAddModal(false)
            setSelectedParent(null)
          }}
          onCancel={() => {
            setShowAddModal(false)
            setSelectedParent(null)
          }}
        />
      )}

      {editingCategory && (
        <CategoryForm
          category={editingCategory}
          onSave={(data) => {
            console.log('Updating category:', data)
            setEditingCategory(null)
          }}
          onCancel={() => setEditingCategory(null)}
        />
      )}
    </div>
  )
}

export default CategoryManagement

