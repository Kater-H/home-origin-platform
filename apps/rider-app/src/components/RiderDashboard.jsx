import { useState, useEffect } from 'react'
import { MapPin, DollarSign, Package, Clock, TrendingUp, Bike, CheckCircle, AlertCircle, Map } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import AIRouteOptimizer from './AIRouteOptimizer'
import EarningsPredictor from './EarningsPredictor'
import PerformanceAnalytics from './PerformanceAnalytics'
import SmartNotifications from './SmartNotifications'
import DeliveryTracker from './DeliveryTracker'

const RiderDashboard = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [riderLocation, setRiderLocation] = useState(null)

  // Mock data for dashboard
  const dashboardStats = {
    todayEarnings: 8500,
    weeklyEarnings: 45000,
    totalDeliveries: 23,
    completedToday: 8,
    averageRating: 4.8,
    onlineHours: 6.5
  }

  const availableOrders = [
    {
      id: '#ORD-2025-004',
      customer: 'Adaeze Okwu',
      pickupLocation: 'Modern Market',
      deliveryLocation: 'BSU Female Hostel A',
      distance: '2.3 km',
      estimatedTime: '15 mins',
      earnings: 800,
      isMultiVendor: true,
      vendorCount: 3,
      items: ['Fresh Tomatoes', 'Rice', 'Chicken Wings']
    },
    {
      id: '#ORD-2025-005',
      customer: 'Ibrahim Sule',
      pickupLocation: 'Modern Market',
      deliveryLocation: 'BSU Male Hostel B',
      distance: '1.8 km',
      estimatedTime: '12 mins',
      earnings: 600,
      isMultiVendor: false,
      vendorCount: 1,
      items: ['Palm Oil']
    }
  ]

  const activeDelivery = {
    id: '#ORD-2025-003',
    customer: 'Grace Oche',
    deliveryLocation: 'Modern Market Area, Shop 15',
    status: 'en_route_to_delivery',
    estimatedArrival: '5 mins',
    earnings: 700,
    pickupProgress: [
      { vendor: "Mama Kemi's Store", status: 'completed', item: 'Local Rice' },
      { vendor: 'Spice Corner', status: 'completed', item: 'Pepper Mix' }
    ]
  }

  const recentDeliveries = [
    {
      id: '#ORD-2025-001',
      customer: 'John Doe',
      earnings: 900,
      time: '2 hours ago',
      rating: 5
    },
    {
      id: '#ORD-2025-002',
      customer: 'Mary Jane',
      earnings: 750,
      time: '3 hours ago',
      rating: 4
    }
  ]

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline)
  }

  // Function to get and send rider's current location
  const sendRiderLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords
        setRiderLocation({ latitude, longitude })

        try {
          // Replace with actual rider ID from authentication context
          const riderId = 1 
          const response = await fetch(`https://0vhlizckl8p1.manus.space/api/riders/${riderId}/location`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude }),
          })

          if (!response.ok) {
            console.error('Failed to update rider location:', response.statusText)
          }
        } catch (error) {
          console.error('Error sending rider location:', error)
        }
      }, (error) => {
        console.error('Error getting geolocation:', error)
      })
    } else {
      console.warn('Geolocation is not supported by this browser.')
    }
  }

  useEffect(() => {
    // Send location every 30 seconds if online
    let intervalId
    if (isOnline) {
      sendRiderLocation() // Send immediately on going online
      intervalId = setInterval(sendRiderLocation, 30000) 
    } else {
      clearInterval(intervalId)
    }

    return () => clearInterval(intervalId)
  }, [isOnline])

  const handleViewRoute = (destination) => {
    // In a real application, this would open a mapping service with the optimized route
    // For demonstration, we'll open Google Maps with a generic search for the destination
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`
    window.open(googleMapsUrl, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Status Toggle */}
      <Card className={`border-2 ${isOnline ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}>
                <Bike className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {isOnline ? 'You are Online' : 'You are Offline'}
                </h2>
                <p className="text-[var(--market-gray)]">
                  {isOnline ? 'Ready to receive delivery requests' : 'Not receiving delivery requests'}
                </p>
              </div>
            </div>
            <Button 
              onClick={toggleOnlineStatus}
              className={`${isOnline ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--market-gray)]">Today's Earnings</p>
                <p className="text-xl font-bold text-green-600">₦{dashboardStats.todayEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--market-gray)]">Deliveries</p>
                <p className="text-xl font-bold text-blue-600">{dashboardStats.completedToday}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--market-gray)]">Online Hours</p>
                <p className="text-xl font-bold text-orange-600">{dashboardStats.onlineHours}h</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--market-gray)]">Rating</p>
                <p className="text-xl font-bold text-yellow-600">{dashboardStats.averageRating}</p>
              </div>
              <div className="text-yellow-400 text-2xl">★</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Delivery */}
      {activeDelivery && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Package className="w-5 h-5 mr-2" />
              Active Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{activeDelivery.id}</h3>
                  <p className="text-sm text-[var(--market-gray)]">Customer: {activeDelivery.customer}</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  En Route to Delivery
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Pickup Progress:</h4>
                {activeDelivery.pickupProgress.map((pickup, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{pickup.vendor}: {pickup.item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[var(--market-gray)]" />
                  <span className="text-sm">{activeDelivery.deliveryLocation}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[var(--market-gray)]">ETA: {activeDelivery.estimatedArrival}</p>
                  <p className="font-medium text-green-600">₦{activeDelivery.earnings}</p>
                </div>
              </div>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => handleViewRoute(activeDelivery.deliveryLocation)}
              >
                <Map className="w-4 h-4 mr-2" />
                View Route on Map
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Orders */}
      {isOnline && availableOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{order.id}</h3>
                        {order.isMultiVendor && (
                          <Badge variant="outline" className="text-xs">
                            {order.vendorCount} vendors
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-[var(--market-gray)]">Customer: {order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₦{order.earnings}</p>
                      <p className="text-xs text-[var(--market-gray)]">{order.distance} • {order.estimatedTime}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span>Pickup: {order.pickupLocation}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>Delivery: {order.deliveryLocation}</span>
                    </div>
                  </div>

                  {order.isMultiVendor && (
                    <div className="mb-3 p-2 bg-yellow-50 rounded-lg">
                      <p className="text-xs text-yellow-800 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Multi-vendor pickup required
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Items: {order.items.join(', ')}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-[var(--market-green)] hover:bg-[var(--market-green)]/90">
                      Accept Order
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentDeliveries.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{delivery.id}</p>
                  <p className="text-sm text-[var(--market-gray)]">{delivery.customer}</p>
                  <p className="text-xs text-[var(--market-gray)]">{delivery.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">₦{delivery.earnings}</p>
                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400 text-xs">
                      {'★'.repeat(delivery.rating)}
                    </div>
                    <span className="text-xs text-[var(--market-gray)]">({delivery.rating})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI-Powered Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Smart Notifications */}
        <SmartNotifications 
          riderId="rider_123"
          riderLocation={riderLocation}
          onNotificationAction={(id, action, data) => {
            console.log('Notification action:', id, action, data)
          }}
        />

        {/* AI Route Optimizer */}
        <AIRouteOptimizer 
          activeDelivery={activeDelivery}
          riderLocation={riderLocation}
          onRouteUpdate={(route) => {
            console.log('Route updated:', route)
          }}
        />
      </div>

      {/* Enhanced Delivery Tracker */}
      {activeDelivery && (
        <DeliveryTracker 
          activeDelivery={activeDelivery}
          onStatusUpdate={(deliveryId, status, location) => {
            console.log('Status update:', deliveryId, status, location)
          }}
          onCustomerContact={(customer, method) => {
            console.log('Customer contact:', customer, method)
          }}
        />
      )}

      {/* AI Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Predictor */}
        <EarningsPredictor 
          riderLocation={riderLocation}
          currentEarnings={dashboardStats.todayEarnings}
          onlineHours={dashboardStats.onlineHours}
        />

        {/* Performance Analytics */}
        <PerformanceAnalytics 
          riderId="rider_123"
          currentRating={dashboardStats.averageRating}
          totalDeliveries={dashboardStats.totalDeliveries}
          onlineHours={dashboardStats.onlineHours}
        />
      </div>
    </div>
  )
}

export default RiderDashboard

