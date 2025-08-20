import { useState } from 'react'
import { 
  Save, 
  RefreshCw, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard, 
  Truck,
  Users,
  Store,
  Settings as SettingsIcon,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const Settings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    platformName: 'Modern Market Connect',
    platformDescription: 'AI-powered e-commerce and delivery platform for Makurdi',
    supportEmail: 'support@modernmarket.com',
    supportPhone: '+234 800 123 4567',
    
    // Operational Settings
    operatingHours: {
      start: '06:00',
      end: '22:00'
    },
    deliveryZones: ['BSU Campus', 'Modern Market', 'High Level', 'Wurukum', 'North Bank'],
    maxDeliveryDistance: 15,
    
    // Commission Settings
    defaultVendorCommission: 10.0,
    riderCommissionPerDelivery: 500,
    platformFee: 2.5,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    adminAlerts: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'medium',
    
    // Payment Settings
    paymentMethods: ['card', 'bank_transfer', 'cash'],
    autoPayoutSchedule: 'weekly',
    minimumPayoutAmount: 5000,
    
    // AI Settings
    smartShopperEnabled: true,
    recommendationsEnabled: true,
    aiModelVersion: 'v2.1',
    
    // Maintenance
    maintenanceMode: false,
    maintenanceMessage: 'System is under maintenance. Please check back later.'
  })

  const [unsavedChanges, setUnsavedChanges] = useState(false)

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
    setUnsavedChanges(true)
  }

  const handleNestedSettingChange = (parent, key, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value
      }
    }))
    setUnsavedChanges(true)
  }

  const handleSaveSettings = () => {
    // Here you would typically save to backend
    console.log('Saving settings:', settings)
    setUnsavedChanges(false)
    // Show success message
  }

  const systemStatus = {
    database: 'operational',
    api: 'operational',
    payments: 'maintenance',
    ai: 'operational',
    notifications: 'operational'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational': return CheckCircle
      case 'maintenance': return AlertTriangle
      case 'error': return AlertTriangle
      default: return Info
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure platform settings, policies, and system preferences.
          </p>
        </div>
        <div className="flex space-x-3">
          {unsavedChanges && (
            <Alert className="w-auto">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have unsaved changes
              </AlertDescription>
            </Alert>
          )}
          <Button 
            onClick={handleSaveSettings}
            disabled={!unsavedChanges}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2" />
            System Status
          </CardTitle>
          <CardDescription>
            Current status of all platform services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(systemStatus).map(([service, status]) => {
              const StatusIcon = getStatusIcon(status)
              return (
                <div key={service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`h-4 w-4 ${
                      status === 'operational' ? 'text-green-600' : 
                      status === 'maintenance' ? 'text-yellow-600' : 'text-red-600'
                    }`} />
                    <span className="font-medium capitalize">{service}</span>
                  </div>
                  <Badge className={getStatusColor(status)}>
                    {status}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Information</CardTitle>
              <CardDescription>
                Basic platform details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={settings.platformName}
                    onChange={(e) => handleSettingChange('platformName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="platformDescription">Platform Description</Label>
                <Textarea
                  id="platformDescription"
                  value={settings.platformDescription}
                  onChange={(e) => handleSettingChange('platformDescription', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="supportPhone">Support Phone</Label>
                <Input
                  id="supportPhone"
                  value={settings.supportPhone}
                  onChange={(e) => handleSettingChange('supportPhone', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Operational Settings
              </CardTitle>
              <CardDescription>
                Configure delivery zones, operating hours, and service parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Operating Hours - Start</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={settings.operatingHours.start}
                    onChange={(e) => handleNestedSettingChange('operatingHours', 'start', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Operating Hours - End</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={settings.operatingHours.end}
                    onChange={(e) => handleNestedSettingChange('operatingHours', 'end', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="maxDistance">Maximum Delivery Distance (km)</Label>
                <Input
                  id="maxDistance"
                  type="number"
                  value={settings.maxDeliveryDistance}
                  onChange={(e) => handleSettingChange('maxDeliveryDistance', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label>Delivery Zones</Label>
                <div className="mt-2 space-y-2">
                  {settings.deliveryZones.map((zone, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>{zone}</span>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm">Add Zone</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Financial Settings
              </CardTitle>
              <CardDescription>
                Configure commission rates, fees, and payment settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="vendorCommission">Default Vendor Commission (%)</Label>
                  <Input
                    id="vendorCommission"
                    type="number"
                    step="0.1"
                    value={settings.defaultVendorCommission}
                    onChange={(e) => handleSettingChange('defaultVendorCommission', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="riderCommission">Rider Commission per Delivery (₦)</Label>
                  <Input
                    id="riderCommission"
                    type="number"
                    value={settings.riderCommissionPerDelivery}
                    onChange={(e) => handleSettingChange('riderCommissionPerDelivery', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="platformFee">Platform Fee (%)</Label>
                  <Input
                    id="platformFee"
                    type="number"
                    step="0.1"
                    value={settings.platformFee}
                    onChange={(e) => handleSettingChange('platformFee', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payoutSchedule">Auto Payout Schedule</Label>
                  <Select 
                    value={settings.autoPayoutSchedule} 
                    onValueChange={(value) => handleSettingChange('autoPayoutSchedule', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="minPayout">Minimum Payout Amount (₦)</Label>
                  <Input
                    id="minPayout"
                    type="number"
                    value={settings.minimumPayoutAmount}
                    onChange={(e) => handleSettingChange('minimumPayoutAmount', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <Label>Accepted Payment Methods</Label>
                <div className="mt-2 space-y-2">
                  {['card', 'bank_transfer', 'cash'].map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <Switch
                        checked={settings.paymentMethods.includes(method)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleSettingChange('paymentMethods', [...settings.paymentMethods, method])
                          } else {
                            handleSettingChange('paymentMethods', settings.paymentMethods.filter(m => m !== method))
                          }
                        }}
                      />
                      <Label className="capitalize">{method.replace('_', ' ')}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure notification preferences and alert settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">Send notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Send notifications via SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-600">Send push notifications to mobile apps</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Admin Alerts</Label>
                    <p className="text-sm text-gray-600">Receive alerts for critical system events</p>
                  </div>
                  <Switch
                    checked={settings.adminAlerts}
                    onCheckedChange={(checked) => handleSettingChange('adminAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security policies and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="passwordPolicy">Password Policy</Label>
                  <Select 
                    value={settings.passwordPolicy} 
                    onValueChange={(value) => handleSettingChange('passwordPolicy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (6+ characters)</SelectItem>
                      <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                      <SelectItem value="high">High (12+ chars, symbols)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI & Machine Learning</CardTitle>
              <CardDescription>
                Configure AI features and model settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Smart Shopper</Label>
                  <p className="text-sm text-gray-600">Enable AI-powered product recommendations</p>
                </div>
                <Switch
                  checked={settings.smartShopperEnabled}
                  onCheckedChange={(checked) => handleSettingChange('smartShopperEnabled', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Product Recommendations</Label>
                  <p className="text-sm text-gray-600">Show personalized product recommendations</p>
                </div>
                <Switch
                  checked={settings.recommendationsEnabled}
                  onCheckedChange={(checked) => handleSettingChange('recommendationsEnabled', checked)}
                />
              </div>
              <div>
                <Label htmlFor="aiModel">AI Model Version</Label>
                <Select 
                  value={settings.aiModelVersion} 
                  onValueChange={(value) => handleSettingChange('aiModelVersion', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v1.0">v1.0 (Stable)</SelectItem>
                    <SelectItem value="v2.0">v2.0 (Enhanced)</SelectItem>
                    <SelectItem value="v2.1">v2.1 (Latest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
              <CardDescription>
                Enable maintenance mode to temporarily disable the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-gray-600">Temporarily disable platform access</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                />
              </div>
              {settings.maintenanceMode && (
                <div>
                  <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                  <Textarea
                    id="maintenanceMessage"
                    value={settings.maintenanceMessage}
                    onChange={(e) => handleSettingChange('maintenanceMessage', e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Settings

