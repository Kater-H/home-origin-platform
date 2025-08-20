import React, { useState } from 'react'
import { Settings, Image, Palette, Globe, Shield, Bell, Database, Truck, CreditCard, Brain, Activity, Clock, MapPin, DollarSign, Users, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BannerManagement from './BannerManagement'
import ThemeManagement from './ThemeManagement'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

const SettingsPage = () => {
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'Modern Market Connect',
    siteDescription: 'AI-Powered E-commerce & Okada Delivery for Makurdi',
    contactEmail: 'admin@modernmarket.com',
    supportPhone: '+234 123 456 7890',
    maintenanceMode: false,
    userRegistration: true,
    vendorRegistration: true,
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    deliveryRadius: '15',
    currency: 'NGN',
    timezone: 'Africa/Lagos',
    language: 'en',
    operatingHoursStart: '06:00',
    operatingHoursEnd: '22:00',
    maxDeliveryDistance: 15,
    vendorCommission: 10,
    riderCommission: 500,
    platformFee: 2.5,
    autoPayoutSchedule: 'weekly',
    minPayoutAmount: 5000,
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'medium',
    smartShopperEnabled: true,
    productRecommendations: true,
    aiModelVersion: 'v2.1'
  })

  const handleSettingChange = (key, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // System Status Component
  const SystemStatus = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            System Status
          </CardTitle>
          <p className="text-sm text-gray-600">Current status of all platform services</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-900">Database</p>
                <Badge variant="secondary" className="bg-green-100 text-green-800">operational</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-900">API</p>
                <Badge variant="secondary" className="bg-green-100 text-green-800">operational</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium text-yellow-900">Payments</p>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">maintenance</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-900">AI</p>
                <Badge variant="secondary" className="bg-green-100 text-green-800">operational</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Operational Settings Component
  const OperationalSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="w-5 h-5 mr-2" />
            Operational Settings
          </CardTitle>
          <p className="text-sm text-gray-600">Configure delivery zones, operating hours, and service parameters</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="operatingStart">Operating Hours - Start</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="operatingStart"
                  type="time"
                  value={systemSettings.operatingHoursStart}
                  onChange={(e) => handleSettingChange('operatingHoursStart', e.target.value)}
                />
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <Label htmlFor="operatingEnd">Operating Hours - End</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="operatingEnd"
                  type="time"
                  value={systemSettings.operatingHoursEnd}
                  onChange={(e) => handleSettingChange('operatingHoursEnd', e.target.value)}
                />
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="maxDeliveryDistance">Maximum Delivery Distance (km)</Label>
            <Input
              id="maxDeliveryDistance"
              type="number"
              value={systemSettings.maxDeliveryDistance}
              onChange={(e) => handleSettingChange('maxDeliveryDistance', e.target.value)}
            />
          </div>

          <div>
            <Label>Delivery Zones</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>BSU Campus</span>
                </div>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>Modern Market</span>
                </div>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
              <Button variant="outline" className="w-full">Add Delivery Zone</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Financial Settings Component
  const FinancialSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Financial Settings
          </CardTitle>
          <p className="text-sm text-gray-600">Configure commission rates, fees, and payment settings</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="vendorCommission">Default Vendor Commission (%)</Label>
              <Input
                id="vendorCommission"
                type="number"
                value={systemSettings.vendorCommission}
                onChange={(e) => handleSettingChange('vendorCommission', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="riderCommission">Rider Commission per Delivery (₦)</Label>
              <Input
                id="riderCommission"
                type="number"
                value={systemSettings.riderCommission}
                onChange={(e) => handleSettingChange('riderCommission', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="platformFee">Platform Fee (%)</Label>
              <Input
                id="platformFee"
                type="number"
                step="0.1"
                value={systemSettings.platformFee}
                onChange={(e) => handleSettingChange('platformFee', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="autoPayoutSchedule">Auto Payout Schedule</Label>
              <Select value={systemSettings.autoPayoutSchedule} onValueChange={(value) => handleSettingChange('autoPayoutSchedule', value)}>
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
              <Label htmlFor="minPayoutAmount">Minimum Payout Amount (₦)</Label>
              <Input
                id="minPayoutAmount"
                type="number"
                value={systemSettings.minPayoutAmount}
                onChange={(e) => handleSettingChange('minPayoutAmount', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Accepted Payment Methods</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Bank Transfer</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Cash on Delivery</span>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Notification Settings Component
  const NotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Settings
          </CardTitle>
          <p className="text-sm text-gray-600">Configure notification preferences and alert settings</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">Send notifications via email</p>
              </div>
              <Switch
                checked={systemSettings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-sm text-gray-500">Send notifications via SMS</p>
              </div>
              <Switch
                checked={systemSettings.smsNotifications}
                onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-gray-500">Send push notifications to mobile apps</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Admin Alerts</Label>
                <p className="text-sm text-gray-500">Receive alerts for critical system events</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Security Settings Component
  const SecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security Settings
          </CardTitle>
          <p className="text-sm text-gray-600">Configure security policies and authentication settings</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
            </div>
            <Switch
              checked={systemSettings.twoFactorAuth}
              onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={systemSettings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="passwordPolicy">Password Policy</Label>
              <Select value={systemSettings.passwordPolicy} onValueChange={(value) => handleSettingChange('passwordPolicy', value)}>
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
    </div>
  )

  // AI & Machine Learning Settings Component
  const AISettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI & Machine Learning
          </CardTitle>
          <p className="text-sm text-gray-600">Configure AI features and model settings</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Smart Shopper</Label>
              <p className="text-sm text-gray-500">Enable AI-powered product recommendations</p>
            </div>
            <Switch
              checked={systemSettings.smartShopperEnabled}
              onCheckedChange={(checked) => handleSettingChange('smartShopperEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Product Recommendations</Label>
              <p className="text-sm text-gray-500">Show personalized product recommendations</p>
            </div>
            <Switch
              checked={systemSettings.productRecommendations}
              onCheckedChange={(checked) => handleSettingChange('productRecommendations', checked)}
            />
          </div>

          <div>
            <Label htmlFor="aiModelVersion">AI Model Version</Label>
            <Select value={systemSettings.aiModelVersion} onValueChange={(value) => handleSettingChange('aiModelVersion', value)}>
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

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-900">Maintenance Mode</h4>
                  <p className="text-sm text-blue-700">Enable maintenance mode to temporarily disable the platform</p>
                </div>
              </div>
              <div className="mt-4">
                <Switch
                  checked={systemSettings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )

  // General Settings Component
  const GeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={systemSettings.siteName}
                onChange={(e) => handleSettingChange('siteName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={systemSettings.contactEmail}
                onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="siteDescription">Site Description</Label>
            <Input
              id="siteDescription"
              value={systemSettings.siteDescription}
              onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supportPhone">Support Phone</Label>
              <Input
                id="supportPhone"
                value={systemSettings.supportPhone}
                onChange={(e) => handleSettingChange('supportPhone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
              <Input
                id="deliveryRadius"
                type="number"
                value={systemSettings.deliveryRadius}
                onChange={(e) => handleSettingChange('deliveryRadius', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={systemSettings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={systemSettings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Lagos">Africa/Lagos</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={systemSettings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ha">Hausa</SelectItem>
                  <SelectItem value="ig">Igbo</SelectItem>
                  <SelectItem value="yo">Yoruba</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="userRegistration">User Registration</Label>
              <p className="text-sm text-gray-500">Allow new users to register</p>
            </div>
            <Switch
              id="userRegistration"
              checked={systemSettings.userRegistration}
              onCheckedChange={(checked) => handleSettingChange('userRegistration', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="vendorRegistration">Vendor Registration</Label>
              <p className="text-sm text-gray-500">Allow new vendors to register</p>
            </div>
            <Switch
              id="vendorRegistration"
              checked={systemSettings.vendorRegistration}
              onCheckedChange={(checked) => handleSettingChange('vendorRegistration', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage platform configuration, banners, and themes</p>
        </div>
      </div>

      {/* System Status at the top */}
      <SystemStatus />

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center space-x-1">
            <Globe className="w-3 h-3" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex items-center space-x-1">
            <Truck className="w-3 h-3" />
            <span className="hidden sm:inline">Operations</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center space-x-1">
            <CreditCard className="w-3 h-3" />
            <span className="hidden sm:inline">Financial</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-1">
            <Bell className="w-3 h-3" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center space-x-1">
            <Brain className="w-3 h-3" />
            <span className="hidden sm:inline">Advanced</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="operations">
          <OperationalSettings />
        </TabsContent>

        <TabsContent value="financial">
          <FinancialSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="advanced">
          <div className="space-y-6">
            <AISettings />
            
            {/* Banner and Theme Management in Advanced Tab */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="w-5 h-5 mr-2" />
                  Banner & Theme Management
                </CardTitle>
                <p className="text-sm text-gray-600">Manage banners and customize themes</p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="banners" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="banners">Banner Management</TabsTrigger>
                    <TabsTrigger value="themes">Theme Management</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="banners">
                    <BannerManagement />
                  </TabsContent>
                  
                  <TabsContent value="themes">
                    <ThemeManagement />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsPage

