import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Clock,
  Image as ImageIcon,
  Link,
  Palette,
  Play,
  Pause,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const BannerManagement = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    link_url: '',
    button_text: '',
    start_date: '',
    end_date: '',
    duration: 5000,
    background_color: '#10B981',
    text_color: '#ffffff',
    is_active: true
  })

  // Mock data for demo
  const mockBanners = [
    {
      banner_id: 'banner_welcome',
      title: 'Welcome to Modern Market Connect',
      content: 'Your one-stop shop for fresh produce and fast delivery in Makurdi',
      image_url: '/api/placeholder/800/400',
      link_url: '/products',
      button_text: 'Shop Now',
      duration: 5000,
      order: 1,
      background_color: '#10B981',
      text_color: '#ffffff',
      is_active: true,
      start_date: '2025-01-01T00:00:00',
      end_date: null,
      created_at: '2025-01-01T00:00:00',
      updated_at: '2025-01-01T00:00:00'
    },
    {
      banner_id: 'banner_delivery',
      title: 'Fast Okada Delivery',
      content: 'Get your orders delivered within 30 minutes by our trusted riders',
      image_url: '/api/placeholder/800/400',
      link_url: '/delivery',
      button_text: 'Learn More',
      duration: 4000,
      order: 2,
      background_color: '#3B82F6',
      text_color: '#ffffff',
      is_active: true,
      start_date: '2025-01-01T00:00:00',
      end_date: null,
      created_at: '2025-01-01T00:00:00',
      updated_at: '2025-01-01T00:00:00'
    },
    {
      banner_id: 'banner_vendors',
      title: 'Support Local Vendors',
      content: 'Shop from verified local vendors in Modern Market, Makurdi',
      image_url: '/api/placeholder/800/400',
      link_url: '/vendors',
      button_text: 'Browse Vendors',
      duration: 4500,
      order: 3,
      background_color: '#F59E0B',
      text_color: '#ffffff',
      is_active: false,
      start_date: '2025-01-01T00:00:00',
      end_date: '2025-12-31T23:59:59',
      created_at: '2025-01-01T00:00:00',
      updated_at: '2025-01-01T00:00:00'
    }
  ]

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // const response = await fetch('https://77h9ikcz967q.manus.space/api/banners')
      // const data = await response.json()
      // setBanners(data.banners || [])
      
      // Using mock data for now
      setBanners(mockBanners)
    } catch (error) {
      console.error('Failed to fetch banners:', error)
      setBanners(mockBanners)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBanner = async (e) => {
    e.preventDefault()
    try {
      // TODO: Replace with actual API call
      console.log('Creating banner:', formData)
      
      // Mock creation
      const newBanner = {
        ...formData,
        banner_id: `banner_${Date.now()}`,
        order: banners.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setBanners([...banners, newBanner])
      setShowCreateForm(false)
      resetForm()
    } catch (error) {
      console.error('Failed to create banner:', error)
    }
  }

  const handleUpdateBanner = async (e) => {
    e.preventDefault()
    try {
      // TODO: Replace with actual API call
      console.log('Updating banner:', editingBanner, formData)
      
      // Mock update
      setBanners(banners.map(banner => 
        banner.banner_id === editingBanner 
          ? { ...banner, ...formData, updated_at: new Date().toISOString() }
          : banner
      ))
      
      setEditingBanner(null)
      resetForm()
    } catch (error) {
      console.error('Failed to update banner:', error)
    }
  }

  const handleDeleteBanner = async (bannerId) => {
    if (!confirm('Are you sure you want to delete this banner?')) return
    
    try {
      // TODO: Replace with actual API call
      console.log('Deleting banner:', bannerId)
      
      // Mock deletion
      setBanners(banners.filter(banner => banner.banner_id !== bannerId))
    } catch (error) {
      console.error('Failed to delete banner:', error)
    }
  }

  const handleToggleStatus = async (bannerId) => {
    try {
      // TODO: Replace with actual API call
      console.log('Toggling banner status:', bannerId)
      
      // Mock toggle
      setBanners(banners.map(banner => 
        banner.banner_id === bannerId 
          ? { ...banner, is_active: !banner.is_active, updated_at: new Date().toISOString() }
          : banner
      ))
    } catch (error) {
      console.error('Failed to toggle banner status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      image_url: '',
      link_url: '',
      button_text: '',
      start_date: '',
      end_date: '',
      duration: 5000,
      background_color: '#10B981',
      text_color: '#ffffff',
      is_active: true
    })
  }

  const startEdit = (banner) => {
    setEditingBanner(banner.banner_id)
    setFormData({
      title: banner.title,
      content: banner.content,
      image_url: banner.image_url,
      link_url: banner.link_url,
      button_text: banner.button_text,
      start_date: banner.start_date ? banner.start_date.split('T')[0] : '',
      end_date: banner.end_date ? banner.end_date.split('T')[0] : '',
      duration: banner.duration,
      background_color: banner.background_color,
      text_color: banner.text_color,
      is_active: banner.is_active
    })
    setShowCreateForm(true)
  }

  const getStatusBadge = (banner) => {
    if (!banner.is_active) {
      return <Badge variant="secondary">Inactive</Badge>
    }
    
    const now = new Date()
    const startDate = banner.start_date ? new Date(banner.start_date) : null
    const endDate = banner.end_date ? new Date(banner.end_date) : null
    
    if (startDate && now < startDate) {
      return <Badge variant="outline">Scheduled</Badge>
    }
    
    if (endDate && now > endDate) {
      return <Badge variant="destructive">Expired</Badge>
    }
    
    return <Badge className="bg-green-100 text-green-800">Active</Badge>
  }

  const stats = {
    total: banners.length,
    active: banners.filter(b => b.is_active).length,
    scheduled: banners.filter(b => {
      const now = new Date()
      const startDate = b.start_date ? new Date(b.start_date) : null
      return startDate && now < startDate
    }).length,
    expired: banners.filter(b => {
      const now = new Date()
      const endDate = b.end_date ? new Date(b.end_date) : null
      return endDate && now > endDate
    }).length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading banners...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-600 mt-1">
            Manage slider banners for the user frontend landing page
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Banner
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Banners</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Play className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Pause className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingBanner ? 'Edit Banner' : 'Create New Banner'}
            </CardTitle>
            <CardDescription>
              {editingBanner ? 'Update banner details' : 'Add a new banner to the slider'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingBanner ? handleUpdateBanner : handleCreateBanner} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Banner title"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="button_text">Button Text</Label>
                  <Input
                    id="button_text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({...formData, button_text: e.target.value})}
                    placeholder="Call to action text"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Banner description"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div>
                  <Label htmlFor="link_url">Link URL</Label>
                  <Input
                    id="link_url"
                    value={formData.link_url}
                    onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                    placeholder="/products"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (ms)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    placeholder="5000"
                    min="1000"
                    step="500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="background_color">Background Color</Label>
                  <Input
                    id="background_color"
                    type="color"
                    value={formData.background_color}
                    onChange={(e) => setFormData({...formData, background_color: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="text_color">Text Color</Label>
                  <Input
                    id="text_color"
                    type="color"
                    value={formData.text_color}
                    onChange={(e) => setFormData({...formData, text_color: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="end_date">End Date (Optional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button type="submit">
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingBanner(null)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Banners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Banner List</CardTitle>
          <CardDescription>
            Manage all banners and their display settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Banner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.banner_id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-8 rounded border"
                        style={{ backgroundColor: banner.background_color }}
                      ></div>
                      <div>
                        <div className="font-medium">{banner.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {banner.content}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(banner)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Start: {banner.start_date ? new Date(banner.start_date).toLocaleDateString() : 'Immediate'}</div>
                      <div>End: {banner.end_date ? new Date(banner.end_date).toLocaleDateString() : 'No end date'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{banner.duration / 1000}s</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <span className="text-sm">{banner.order}</span>
                      <Button variant="ghost" size="sm">
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <div className="h-4 w-4">⋮</div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => startEdit(banner)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(banner.banner_id)}>
                          {banner.is_active ? (
                            <>
                              <Pause className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteBanner(banner.banner_id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
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
    </div>
  )
}

export default BannerManagement

