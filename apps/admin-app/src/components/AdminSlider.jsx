import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Volume2, 
  Monitor, 
  Users, 
  TrendingUp, 
  DollarSign,
  Package,
  Truck,
  AlertTriangle,
  CheckCircle,
  Save
} from 'lucide-react';

const AdminSlider = () => {
  // State for different slider controls
  const [systemSettings, setSystemSettings] = useState({
    alertVolume: [75],
    dashboardRefresh: [30],
    maxConcurrentOrders: [50],
    deliveryRadius: [15],
    autoApprovalThreshold: [85],
    systemLoad: [60],
    notificationFrequency: [5],
    dataRetention: [90]
  });

  const [performanceMetrics, setPerformanceMetrics] = useState({
    cpuUsage: [45],
    memoryUsage: [62],
    diskUsage: [38],
    networkLatency: [120]
  });

  const [businessSettings, setBusinessSettings] = useState({
    commissionRate: [12],
    deliveryFee: [200],
    minimumOrder: [500],
    maxDeliveryTime: [45]
  });

  const handleSaveSettings = () => {
    // Mock save functionality
    console.log('Saving settings:', { systemSettings, performanceMetrics, businessSettings });
    // In real implementation, this would call an API
  };

  const getStatusColor = (value, type = 'normal') => {
    if (type === 'performance') {
      if (value < 50) return 'bg-green-500';
      if (value < 80) return 'bg-yellow-500';
      return 'bg-red-500';
    }
    return 'bg-blue-500';
  };

  const getStatusText = (value, type = 'normal') => {
    if (type === 'performance') {
      if (value < 50) return 'Good';
      if (value < 80) return 'Warning';
      return 'Critical';
    }
    return 'Active';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
          <p className="text-gray-600 mt-1">Manage system settings and performance parameters</p>
        </div>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save All Settings
        </Button>
      </div>

      {/* System Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            System Performance Metrics
          </CardTitle>
          <CardDescription>
            Real-time system performance indicators and resource usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CPU Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">CPU Usage</label>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(performanceMetrics.cpuUsage[0], 'performance')} text-white`}
                  >
                    {performanceMetrics.cpuUsage[0]}%
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {getStatusText(performanceMetrics.cpuUsage[0], 'performance')}
                  </span>
                </div>
              </div>
              <Slider
                value={performanceMetrics.cpuUsage}
                onValueChange={(value) => setPerformanceMetrics(prev => ({ ...prev, cpuUsage: value }))}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Memory Usage</label>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(performanceMetrics.memoryUsage[0], 'performance')} text-white`}
                  >
                    {performanceMetrics.memoryUsage[0]}%
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {getStatusText(performanceMetrics.memoryUsage[0], 'performance')}
                  </span>
                </div>
              </div>
              <Slider
                value={performanceMetrics.memoryUsage}
                onValueChange={(value) => setPerformanceMetrics(prev => ({ ...prev, memoryUsage: value }))}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Disk Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Disk Usage</label>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(performanceMetrics.diskUsage[0], 'performance')} text-white`}
                  >
                    {performanceMetrics.diskUsage[0]}%
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {getStatusText(performanceMetrics.diskUsage[0], 'performance')}
                  </span>
                </div>
              </div>
              <Slider
                value={performanceMetrics.diskUsage}
                onValueChange={(value) => setPerformanceMetrics(prev => ({ ...prev, diskUsage: value }))}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Network Latency */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Network Latency</label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-500 text-white">
                    {performanceMetrics.networkLatency[0]}ms
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {performanceMetrics.networkLatency[0] < 100 ? 'Excellent' : 
                     performanceMetrics.networkLatency[0] < 200 ? 'Good' : 'Poor'}
                  </span>
                </div>
              </div>
              <Slider
                value={performanceMetrics.networkLatency}
                onValueChange={(value) => setPerformanceMetrics(prev => ({ ...prev, networkLatency: value }))}
                max={500}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0ms</span>
                <span>250ms</span>
                <span>500ms</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-green-600" />
            System Configuration
          </CardTitle>
          <CardDescription>
            Adjust system behavior and operational parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alert Volume */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Alert Volume
                </label>
                <Badge variant="outline">{systemSettings.alertVolume[0]}%</Badge>
              </div>
              <Slider
                value={systemSettings.alertVolume}
                onValueChange={(value) => setSystemSettings(prev => ({ ...prev, alertVolume: value }))}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-500">System notification sound level</p>
            </div>

            {/* Dashboard Refresh Rate */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Dashboard Refresh
                </label>
                <Badge variant="outline">{systemSettings.dashboardRefresh[0]}s</Badge>
              </div>
              <Slider
                value={systemSettings.dashboardRefresh}
                onValueChange={(value) => setSystemSettings(prev => ({ ...prev, dashboardRefresh: value }))}
                min={5}
                max={120}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Auto-refresh interval for dashboard data</p>
            </div>

            {/* Max Concurrent Orders */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Max Concurrent Orders
                </label>
                <Badge variant="outline">{systemSettings.maxConcurrentOrders[0]}</Badge>
              </div>
              <Slider
                value={systemSettings.maxConcurrentOrders}
                onValueChange={(value) => setSystemSettings(prev => ({ ...prev, maxConcurrentOrders: value }))}
                min={10}
                max={200}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Maximum orders processed simultaneously</p>
            </div>

            {/* Delivery Radius */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Delivery Radius
                </label>
                <Badge variant="outline">{systemSettings.deliveryRadius[0]}km</Badge>
              </div>
              <Slider
                value={systemSettings.deliveryRadius}
                onValueChange={(value) => setSystemSettings(prev => ({ ...prev, deliveryRadius: value }))}
                min={5}
                max={50}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Maximum delivery distance from vendors</p>
            </div>

            {/* Auto Approval Threshold */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Auto Approval Threshold
                </label>
                <Badge variant="outline">{systemSettings.autoApprovalThreshold[0]}%</Badge>
              </div>
              <Slider
                value={systemSettings.autoApprovalThreshold}
                onValueChange={(value) => setSystemSettings(prev => ({ ...prev, autoApprovalThreshold: value }))}
                min={50}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Vendor approval confidence threshold</p>
            </div>

            {/* System Load Limit */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  System Load Limit
                </label>
                <Badge variant="outline">{systemSettings.systemLoad[0]}%</Badge>
              </div>
              <Slider
                value={systemSettings.systemLoad}
                onValueChange={(value) => setSystemSettings(prev => ({ ...prev, systemLoad: value }))}
                min={30}
                max={95}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Maximum system load before throttling</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-orange-600" />
            Business Configuration
          </CardTitle>
          <CardDescription>
            Manage business rules and financial parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Commission Rate */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Commission Rate</label>
                <Badge variant="outline">{businessSettings.commissionRate[0]}%</Badge>
              </div>
              <Slider
                value={businessSettings.commissionRate}
                onValueChange={(value) => setBusinessSettings(prev => ({ ...prev, commissionRate: value }))}
                min={5}
                max={25}
                step={0.5}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Platform commission from vendor sales</p>
            </div>

            {/* Delivery Fee */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Delivery Fee</label>
                <Badge variant="outline">₦{businessSettings.deliveryFee[0]}</Badge>
              </div>
              <Slider
                value={businessSettings.deliveryFee}
                onValueChange={(value) => setBusinessSettings(prev => ({ ...prev, deliveryFee: value }))}
                min={100}
                max={1000}
                step={50}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Standard delivery fee for orders</p>
            </div>

            {/* Minimum Order */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Minimum Order</label>
                <Badge variant="outline">₦{businessSettings.minimumOrder[0]}</Badge>
              </div>
              <Slider
                value={businessSettings.minimumOrder}
                onValueChange={(value) => setBusinessSettings(prev => ({ ...prev, minimumOrder: value }))}
                min={200}
                max={2000}
                step={100}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Minimum order value for delivery</p>
            </div>

            {/* Max Delivery Time */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Max Delivery Time</label>
                <Badge variant="outline">{businessSettings.maxDeliveryTime[0]} min</Badge>
              </div>
              <Slider
                value={businessSettings.maxDeliveryTime}
                onValueChange={(value) => setBusinessSettings(prev => ({ ...prev, maxDeliveryTime: value }))}
                min={15}
                max={120}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Maximum promised delivery time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks and system operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
              <Users className="w-5 h-5" />
              <span className="text-sm">Reset User Cache</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
              <Package className="w-5 h-5" />
              <span className="text-sm">Sync Products</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
              <Truck className="w-5 h-5" />
              <span className="text-sm">Update Delivery Routes</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Generate Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSlider;

