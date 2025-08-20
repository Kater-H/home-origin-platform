import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Package, 
  Calculator, 
  Settings, 
  Eye,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

const DeliveryManagement = () => {
  const [deliverySettings, setDeliverySettings] = useState({
    enableDelivery: true,
    maxDeliveryDistance: 10,
    baseDeliveryFee: 200,
    freeDeliveryThreshold: 3000,
    estimatedPrepTime: 15
  });

  const [orders, setOrders] = useState([
    {
      id: '#ORD-2025-001',
      customer: 'Adaeze Okwu',
      items: ['Fresh Tomatoes (1kg)', 'Red Onions (500g)'],
      total: 2000,
      deliveryFee: 150,
      destination: 'BSU Female Hostel A',
      address: 'Room 205, BSU Female Hostel A',
      distance: 2.5,
      status: 'preparing',
      orderTime: '10:30 AM',
      estimatedDelivery: '11:15 AM',
      rider: null,
      deliveryNotes: 'Call when you arrive at the gate'
    },
    {
      id: '#ORD-2025-002',
      customer: 'Ibrahim Sule',
      items: ['Palm Oil (1L)'],
      total: 2500,
      deliveryFee: 0,
      destination: 'BSU Male Hostel B',
      address: 'Room 108, BSU Male Hostel B',
      distance: 1.8,
      status: 'ready',
      orderTime: '10:15 AM',
      estimatedDelivery: '11:00 AM',
      rider: 'Musa Ahmed',
      deliveryNotes: 'Free delivery applied'
    },
    {
      id: '#ORD-2025-003',
      customer: 'Grace Terna',
      items: ['Cooking Oil (750ml)', 'Salt (1kg)'],
      total: 1800,
      deliveryFee: 200,
      destination: 'North Bank Area',
      address: 'No. 45 Gboko Road, North Bank',
      distance: 4.2,
      status: 'in_transit',
      orderTime: '9:45 AM',
      estimatedDelivery: '10:45 AM',
      rider: 'John Terver',
      deliveryNotes: 'Second floor, blue gate'
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'preparing': return <Package className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'in_transit': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleSettingsUpdate = (field, value) => {
    setDeliverySettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Delivery Management</h1>
          <p className="text-gray-600">Manage your delivery orders and settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800">
            <Truck className="w-4 h-4 mr-1" />
            Delivery Active
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Delivery Orders</TabsTrigger>
          <TabsTrigger value="analytics">Delivery Analytics</TabsTrigger>
          <TabsTrigger value="settings">Delivery Settings</TabsTrigger>
        </TabsList>

        {/* Delivery Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Preparing</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {orders.filter(o => o.status === 'preparing').length}
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ready for Pickup</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {orders.filter(o => o.status === 'ready').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Transit</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {orders.filter(o => o.status === 'in_transit').length}
                    </p>
                  </div>
                  <Truck className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Delivery Fee</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(orders.reduce((sum, o) => sum + o.deliveryFee, 0) / orders.length)}
                    </p>
                  </div>
                  <Calculator className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Delivery Orders</CardTitle>
              <CardDescription>
                Track and manage your delivery orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                          </Badge>
                          {order.deliveryFee === 0 && (
                            <Badge className="bg-green-100 text-green-800">Free Delivery</Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Customer</p>
                            <p className="font-medium">{order.customer}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Destination</p>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span>{order.destination}</span>
                              <span className="text-gray-400">({order.distance}km)</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-600">Delivery Time</p>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span>{order.estimatedDelivery}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <span><strong>Order Total:</strong> {formatCurrency(order.total)}</span>
                            <span><strong>Delivery Fee:</strong> {order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}</span>
                            {order.rider && (
                              <span><strong>Rider:</strong> {order.rider}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            {order.status === 'preparing' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'ready')}
                              >
                                Mark Ready
                              </Button>
                            )}
                          </div>
                        </div>

                        {order.deliveryNotes && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                            <strong>Delivery Notes:</strong> {order.deliveryNotes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Delivery Time</span>
                    <span className="font-semibold">32 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>On-Time Delivery Rate</span>
                    <span className="font-semibold text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Distance</span>
                    <span className="font-semibold">2.8 km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Free Deliveries</span>
                    <span className="font-semibold">23%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Delivery Revenue</span>
                    <span className="font-semibold">{formatCurrency(12500)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Delivery Fee</span>
                    <span className="font-semibold">{formatCurrency(175)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Orders with Free Delivery</span>
                    <span className="font-semibold">15 orders</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Delivery Fee Waived</span>
                    <span className="font-semibold text-red-600">{formatCurrency(2625)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Delivery Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Delivery Configuration
              </CardTitle>
              <CardDescription>
                Configure your delivery preferences and pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="maxDistance">Maximum Delivery Distance (km)</Label>
                    <Input
                      id="maxDistance"
                      type="number"
                      value={deliverySettings.maxDeliveryDistance}
                      onChange={(e) => handleSettingsUpdate('maxDeliveryDistance', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="baseFee">Base Delivery Fee (₦)</Label>
                    <Input
                      id="baseFee"
                      type="number"
                      value={deliverySettings.baseDeliveryFee}
                      onChange={(e) => handleSettingsUpdate('baseDeliveryFee', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="freeThreshold">Free Delivery Threshold (₦)</Label>
                    <Input
                      id="freeThreshold"
                      type="number"
                      value={deliverySettings.freeDeliveryThreshold}
                      onChange={(e) => handleSettingsUpdate('freeDeliveryThreshold', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="prepTime">Estimated Preparation Time (minutes)</Label>
                    <Input
                      id="prepTime"
                      type="number"
                      value={deliverySettings.estimatedPrepTime}
                      onChange={(e) => handleSettingsUpdate('estimatedPrepTime', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  These settings work within the admin-defined delivery rules. Contact support if you need to modify delivery destinations or special pricing rules.
                </AlertDescription>
              </Alert>

              <Button className="w-full md:w-auto">
                Save Delivery Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Details - {selectedOrder.id}</CardTitle>
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <p><strong>Name:</strong> {selectedOrder.customer}</p>
                  <p><strong>Destination:</strong> {selectedOrder.destination}</p>
                  <p><strong>Address:</strong> {selectedOrder.address}</p>
                  <p><strong>Distance:</strong> {selectedOrder.distance} km</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Order Information</h4>
                  <p><strong>Order Time:</strong> {selectedOrder.orderTime}</p>
                  <p><strong>Estimated Delivery:</strong> {selectedOrder.estimatedDelivery}</p>
                  <p><strong>Status:</strong> 
                    <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.replace('_', ' ')}
                    </Badge>
                  </p>
                  {selectedOrder.rider && (
                    <p><strong>Assigned Rider:</strong> {selectedOrder.rider}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Order Items</h4>
                <ul className="space-y-1">
                  {selectedOrder.items.map((item, index) => (
                    <li key={index} className="text-sm">• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span>Order Total:</span>
                  <span className="font-semibold">{formatCurrency(selectedOrder.total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Fee:</span>
                  <span className="font-semibold">
                    {selectedOrder.deliveryFee === 0 ? 'FREE' : formatCurrency(selectedOrder.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                  <span>Total with Delivery:</span>
                  <span>{formatCurrency(selectedOrder.total + selectedOrder.deliveryFee)}</span>
                </div>
              </div>

              {selectedOrder.deliveryNotes && (
                <div className="p-3 bg-blue-50 rounded">
                  <h4 className="font-semibold mb-1">Delivery Notes</h4>
                  <p className="text-sm">{selectedOrder.deliveryNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DeliveryManagement;

