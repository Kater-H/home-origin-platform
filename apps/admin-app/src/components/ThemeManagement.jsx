import { useState, useEffect } from 'react'
import { 
  Palette, 
  Eye, 
  Save, 
  RotateCcw, 
  Copy, 
  Check,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

const ThemeManagement = () => {
  const [themes, setThemes] = useState([])
  const [activeTheme, setActiveTheme] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTheme, setEditingTheme] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    primary_color: '#10B981',
    secondary_color: '#3B82F6',
    accent_color: '#F59E0B',
    background_color: '#ffffff',
    text_color: '#1F2937',
    text_light: '#6B7280',
    success_color: '#10B981',
    warning_color: '#F59E0B',
    error_color: '#EF4444',
    info_color: '#3B82F6',
    border_color: '#E5E7EB'
  })

  // Mock data for demo
  const mockThemes = [
    {
      theme_id: 'default',
      name: 'Modern Green',
      primary_color: '#10B981',
      secondary_color: '#3B82F6',
      accent_color: '#F59E0B',
      background_color: '#ffffff',
      text_color: '#1F2937',
      text_light: '#6B7280',
      success_color: '#10B981',
      warning_color: '#F59E0B',
      error_color: '#EF4444',
      info_color: '#3B82F6',
      border_color: '#E5E7EB',
      is_active: true,
      created_at: '2025-01-01T00:00:00',
      updated_at: '2025-01-01T00:00:00'
    },
    {
      theme_id: 'blue_ocean',
      name: 'Blue Ocean',
      primary_color: '#3B82F6',
      secondary_color: '#06B6D4',
      accent_color: '#8B5CF6',
      background_color: '#ffffff',
      text_color: '#1F2937',
      text_light: '#6B7280',
      success_color: '#10B981',
      warning_color: '#F59E0B',
      error_color: '#EF4444',
      info_color: '#3B82F6',
      border_color: '#E5E7EB',
      is_active: false,
      created_at: '2025-01-01T00:00:00',
      updated_at: '2025-01-01T00:00:00'
    },
    {
      theme_id: 'sunset_orange',
      name: 'Sunset Orange',
      primary_color: '#F97316',
      secondary_color: '#EF4444',
      accent_color: '#F59E0B',
      background_color: '#ffffff',
      text_color: '#1F2937',
      text_light: '#6B7280',
      success_color: '#10B981',
      warning_color: '#F59E0B',
      error_color: '#EF4444',
      info_color: '#3B82F6',
      border_color: '#E5E7EB',
      is_active: false,
      created_at: '2025-01-01T00:00:00',
      updated_at: '2025-01-01T00:00:00'
    }
  ]

  useEffect(() => {
    fetchThemes()
  }, [])

  const fetchThemes = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // const response = await fetch('https://77h9ikcz967q.manus.space/api/themes')
      // const data = await response.json()
      // setThemes(data.themes || [])
      // setActiveTheme(data.themes.find(t => t.is_active))
      
      // Using mock data for now
      setThemes(mockThemes)
      setActiveTheme(mockThemes.find(t => t.is_active))
    } catch (error) {
      console.error('Failed to fetch themes:', error)
      setThemes(mockThemes)
      setActiveTheme(mockThemes.find(t => t.is_active))
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTheme = async (e) => {
    e.preventDefault()
    try {
      // TODO: Replace with actual API call
      console.log('Creating theme:', formData)
      
      // Mock creation
      const newTheme = {
        ...formData,
        theme_id: `theme_${Date.now()}`,
        is_active: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setThemes([...themes, newTheme])
      setShowCreateForm(false)
      resetForm()
    } catch (error) {
      console.error('Failed to create theme:', error)
    }
  }

  const handleUpdateTheme = async (e) => {
    e.preventDefault()
    try {
      // TODO: Replace with actual API call
      console.log('Updating theme:', editingTheme, formData)
      
      // Mock update
      setThemes(themes.map(theme => 
        theme.theme_id === editingTheme 
          ? { ...theme, ...formData, updated_at: new Date().toISOString() }
          : theme
      ))
      
      if (editingTheme === activeTheme?.theme_id) {
        setActiveTheme({ ...activeTheme, ...formData })
      }
      
      setEditingTheme(null)
      setShowCreateForm(false)
      resetForm()
    } catch (error) {
      console.error('Failed to update theme:', error)
    }
  }

  const handleActivateTheme = async (themeId) => {
    try {
      // TODO: Replace with actual API call
      console.log('Activating theme:', themeId)
      
      // Mock activation
      const updatedThemes = themes.map(theme => ({
        ...theme,
        is_active: theme.theme_id === themeId,
        updated_at: new Date().toISOString()
      }))
      
      setThemes(updatedThemes)
      setActiveTheme(updatedThemes.find(t => t.theme_id === themeId))
    } catch (error) {
      console.error('Failed to activate theme:', error)
    }
  }

  const handleDeleteTheme = async (themeId) => {
    if (themeId === 'default') {
      alert('Cannot delete the default theme')
      return
    }
    
    if (!confirm('Are you sure you want to delete this theme?')) return
    
    try {
      // TODO: Replace with actual API call
      console.log('Deleting theme:', themeId)
      
      // Mock deletion
      setThemes(themes.filter(theme => theme.theme_id !== themeId))
      
      if (themeId === activeTheme?.theme_id) {
        const defaultTheme = themes.find(t => t.theme_id === 'default')
        setActiveTheme(defaultTheme)
      }
    } catch (error) {
      console.error('Failed to delete theme:', error)
    }
  }

  const handleDuplicateTheme = async (theme) => {
    try {
      // TODO: Replace with actual API call
      console.log('Duplicating theme:', theme)
      
      // Mock duplication
      const newTheme = {
        ...theme,
        theme_id: `theme_${Date.now()}`,
        name: `${theme.name} (Copy)`,
        is_active: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setThemes([...themes, newTheme])
    } catch (error) {
      console.error('Failed to duplicate theme:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      primary_color: '#10B981',
      secondary_color: '#3B82F6',
      accent_color: '#F59E0B',
      background_color: '#ffffff',
      text_color: '#1F2937',
      text_light: '#6B7280',
      success_color: '#10B981',
      warning_color: '#F59E0B',
      error_color: '#EF4444',
      info_color: '#3B82F6',
      border_color: '#E5E7EB'
    })
  }

  const startEdit = (theme) => {
    setEditingTheme(theme.theme_id)
    setFormData({
      name: theme.name,
      primary_color: theme.primary_color,
      secondary_color: theme.secondary_color,
      accent_color: theme.accent_color,
      background_color: theme.background_color,
      text_color: theme.text_color,
      text_light: theme.text_light,
      success_color: theme.success_color,
      warning_color: theme.warning_color,
      error_color: theme.error_color,
      info_color: theme.info_color,
      border_color: theme.border_color
    })
    setShowCreateForm(true)
  }

  const generatePreviewStyle = (theme) => {
    return {
      '--color-primary': theme.primary_color,
      '--color-secondary': theme.secondary_color,
      '--color-accent': theme.accent_color,
      '--color-background': theme.background_color,
      '--color-text': theme.text_color,
      '--color-text-light': theme.text_light,
      '--color-success': theme.success_color,
      '--color-warning': theme.warning_color,
      '--color-error': theme.error_color,
      '--color-info': theme.info_color,
      '--color-border': theme.border_color
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading themes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Theme Management</h1>
          <p className="text-gray-600 mt-1">
            Customize the color scheme and appearance of the user frontend
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleActivateTheme('default')}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Theme
          </Button>
        </div>
      </div>

      {/* Active Theme Preview */}
      {activeTheme && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Active Theme: {activeTheme.name}</span>
            </CardTitle>
            <CardDescription>
              This theme is currently applied to the user frontend
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div 
                  className="w-full h-12 rounded border mb-2"
                  style={{ backgroundColor: activeTheme.primary_color }}
                ></div>
                <div className="text-xs font-medium">Primary</div>
                <div className="text-xs text-gray-500">{activeTheme.primary_color}</div>
              </div>
              <div className="text-center">
                <div 
                  className="w-full h-12 rounded border mb-2"
                  style={{ backgroundColor: activeTheme.secondary_color }}
                ></div>
                <div className="text-xs font-medium">Secondary</div>
                <div className="text-xs text-gray-500">{activeTheme.secondary_color}</div>
              </div>
              <div className="text-center">
                <div 
                  className="w-full h-12 rounded border mb-2"
                  style={{ backgroundColor: activeTheme.accent_color }}
                ></div>
                <div className="text-xs font-medium">Accent</div>
                <div className="text-xs text-gray-500">{activeTheme.accent_color}</div>
              </div>
              <div className="text-center">
                <div 
                  className="w-full h-12 rounded border mb-2"
                  style={{ backgroundColor: activeTheme.success_color }}
                ></div>
                <div className="text-xs font-medium">Success</div>
                <div className="text-xs text-gray-500">{activeTheme.success_color}</div>
              </div>
              <div className="text-center">
                <div 
                  className="w-full h-12 rounded border mb-2"
                  style={{ backgroundColor: activeTheme.warning_color }}
                ></div>
                <div className="text-xs font-medium">Warning</div>
                <div className="text-xs text-gray-500">{activeTheme.warning_color}</div>
              </div>
              <div className="text-center">
                <div 
                  className="w-full h-12 rounded border mb-2"
                  style={{ backgroundColor: activeTheme.error_color }}
                ></div>
                <div className="text-xs font-medium">Error</div>
                <div className="text-xs text-gray-500">{activeTheme.error_color}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTheme ? 'Edit Theme' : 'Create New Theme'}
            </CardTitle>
            <CardDescription>
              {editingTheme ? 'Update theme colors and settings' : 'Design a new color theme for the frontend'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingTheme ? handleUpdateTheme : handleCreateTheme} className="space-y-6">
              <div>
                <Label htmlFor="name">Theme Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter theme name"
                  required
                />
              </div>

              <Tabs defaultValue="primary" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="primary">Primary Colors</TabsTrigger>
                  <TabsTrigger value="semantic">Semantic Colors</TabsTrigger>
                  <TabsTrigger value="text">Text & Background</TabsTrigger>
                </TabsList>
                
                <TabsContent value="primary" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="primary_color">Primary Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="primary_color"
                          type="color"
                          value={formData.primary_color}
                          onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                          className="w-16"
                        />
                        <Input
                          value={formData.primary_color}
                          onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                          placeholder="#10B981"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="secondary_color">Secondary Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="secondary_color"
                          type="color"
                          value={formData.secondary_color}
                          onChange={(e) => setFormData({...formData, secondary_color: e.target.value})}
                          className="w-16"
                        />
                        <Input
                          value={formData.secondary_color}
                          onChange={(e) => setFormData({...formData, secondary_color: e.target.value})}
                          placeholder="#3B82F6"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="accent_color">Accent Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="accent_color"
                          type="color"
                          value={formData.accent_color}
                          onChange={(e) => setFormData({...formData, accent_color: e.target.value})}
                          className="w-16"
                        />
                        <Input
                          value={formData.accent_color}
                          onChange={(e) => setFormData({...formData, accent_color: e.target.value})}
                          placeholder="#F59E0B"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="semantic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="success_color">Success Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="success_color"
                          type="color"
                          value={formData.success_color}
                          onChange={(e) => setFormData({...formData, success_color: e.target.value})}
                          className="w-16"
                        />
                        <Input
                          value={formData.success_color}
                          onChange={(e) => setFormData({...formData, success_color: e.target.value})}
                          placeholder="#10B981"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="warning_color">Warning Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="warning_color"
                          type="color"
                          value={formData.warning_color}
                          onChange={(e) => setFormData({...formData, warning_color: e.target.value})}
                          className="w-16"
                        />
                        <Input
                          value={formData.warning_color}
                          onChange={(e) => setFormData({...formData, warning_color: e.target.value})}
                          placeholder="#F59E0B"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="error_color">Error Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="error_color"
                          type="color"
                          value={formData.error_color}
                          onChange={(e) => setFormData({...formData, error_color: e.target.value})}
                          className="w-16"
                        />
                        <Input
                          value={formData.error_color}
                          onChange={(e) => setFormData({...formData, error_color: e.target.value})}
                          placeholder="#EF4444"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="info_color">Info Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="info_color"
                          type="color"
                          value={formData.info_color}
                          onChange={(e) => setFormData({...formData, info_color: e.target.value})}
                          className="w-16"
                        />
                        <Input
                          value={formData.info_color}
                          onChange={(e) => setFormData({...formData, info_color: e.target.value})}
                          placeholder="#3B82F6"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="text" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="background_color">Background Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="background_color"
                          type="color"
                          value={formData.background_color}
                          onChange={(e) => setFormData({...formData, background_color: e.target.value})}
                          className="w-16"
                        />
                        <Input
                          value={formData.background_color}
                          onChange={(e) => setFormData({...formData, background_color: e.target.value})}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="text_color">Text Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="text_color"
                          type="color"
                          value={formData.text_color}
                          onChange={(e) => setFormData({...formData, text_color: e.target.value})}
                          className="w-16"
                        />
                        <Input
                          value={formData.text_color}
                          onChange={(e) => setFormData({...formData, text_color: e.target.value})}
                          placeholder="#1F2937"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="text_light">Light Text Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="text_light"
                          type="color"
                          value={formData.text_light}
                          onChange={(e) => setFormData({...formData, text_light: e.target.value})}
                          className="w-16"
                        />
                        <Input
                          value={formData.text_light}
                          onChange={(e) => setFormData({...formData, text_light: e.target.value})}
                          placeholder="#6B7280"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="border_color">Border Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="border_color"
                          type="color"
                          value={formData.border_color}
                          onChange={(e) => setFormData({...formData, border_color: e.target.value})}
                          className="w-16"
                        />
                        <Input
                          value={formData.border_color}
                          onChange={(e) => setFormData({...formData, border_color: e.target.value})}
                          placeholder="#E5E7EB"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Preview */}
              <div className="border rounded-lg p-4" style={generatePreviewStyle(formData)}>
                <h3 className="text-lg font-semibold mb-2" style={{ color: formData.text_color }}>
                  Theme Preview
                </h3>
                <div className="flex space-x-2 mb-4">
                  <div 
                    className="px-3 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: formData.primary_color }}
                  >
                    Primary Button
                  </div>
                  <div 
                    className="px-3 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: formData.secondary_color }}
                  >
                    Secondary Button
                  </div>
                  <div 
                    className="px-3 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: formData.accent_color }}
                  >
                    Accent Button
                  </div>
                </div>
                <p style={{ color: formData.text_color }}>
                  This is how your theme will look with regular text.
                </p>
                <p style={{ color: formData.text_light }}>
                  This is how secondary text will appear.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button type="submit">
                  {editingTheme ? 'Update Theme' : 'Create Theme'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingTheme(null)
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

      {/* Themes List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Themes</CardTitle>
          <CardDescription>
            Manage and switch between different color themes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Theme</TableHead>
                <TableHead>Colors</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {themes.map((theme) => (
                <TableRow key={theme.theme_id}>
                  <TableCell>
                    <div className="font-medium">{theme.name}</div>
                    <div className="text-sm text-gray-500">{theme.theme_id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.primary_color }}
                        title={`Primary: ${theme.primary_color}`}
                      ></div>
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.secondary_color }}
                        title={`Secondary: ${theme.secondary_color}`}
                      ></div>
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: theme.accent_color }}
                        title={`Accent: ${theme.accent_color}`}
                      ></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {theme.is_active ? (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(theme.updated_at).toLocaleDateString()}
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
                        {!theme.is_active && (
                          <DropdownMenuItem onClick={() => handleActivateTheme(theme.theme_id)}>
                            <Check className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => startEdit(theme)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateTheme(theme)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {theme.theme_id !== 'default' && (
                          <DropdownMenuItem 
                            onClick={() => handleDeleteTheme(theme.theme_id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
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

export default ThemeManagement

