import { useState, useEffect } from 'react'
import { MapPin, Clock, CheckCircle, Truck, Phone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const OrderTracking = () => {
  const [currentStatus, setCurrentStatus] = useState(2) // 0: confirmed, 1: preparing, 2: picked up, 3: en route, 4: delivered
  const [estimatedTime, setEstimatedTime] = useState(25) // minutes

  // Mock order data
  const orderData = {
    id: '#ORD-2025-001',
    items: [
      { name: 'Fresh Tomatoes', quantity: 2, price: 1200 },
      { name: 'Rice (Local)', quantity: 1, price: 3500 },
      { name: 'Chicken Wings', quantity: 1, price: 2800 }
    ],
    vendor: 'Modern Market - Multiple Vendors',
    rider: {
      name: 'Ibrahim Sule',
      phone: '+234 801 234 5678',
      rating: 4.8,
      vehicle: 'Honda CB125 - ABC 123 KD'
    },
    total: 8000,
    deliveryAddress: 'BSU Female Hostel A, Room 205'
  }

  const statusSteps = [
    { id: 0, title: 'Order Confirmed', description: 'Your order has been confirmed', icon: CheckCircle },
    { id: 1, title: 'Vendor Preparing', description: 'Vendors are preparing your items', icon: Clock },
    { id: 2, title: 'Picked Up', description: 'Rider has collected your order', icon: Truck },
    { id: 3, title: 'En Route', description: 'On the way to your location', icon: MapPin },
    { id: 4, title: 'Delivered', description: 'Order delivered successfully', icon: CheckCircle }
  ]

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEstimatedTime(prev => Math.max(0, prev - 1))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-[var(--market-gray)]">Order {orderData.id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge className="bg-[var(--market-green)] text-white">
                  {statusSteps[currentStatus]?.title}
                </Badge>
                <span className="text-sm text-[var(--market-gray)]">
                  ETA: {estimatedTime} minutes
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusSteps.map((step, index) => {
                  const IconComponent = step.icon
                  const isCompleted = index <= currentStatus
                  const isCurrent = index === currentStatus
                  
                  return (
                    <div key={step.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-[var(--market-green)] text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${isCurrent ? 'text-[var(--market-green)]' : ''}`}>
                          {step.title}
                        </h4>
                        <p className="text-sm text-[var(--market-gray)]">{step.description}</p>
                        {isCurrent && (
                          <p className="text-xs text-[var(--market-green)] mt-1">
                            Current status • Updated 2 minutes ago
                          </p>
                        )}
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`w-px h-8 ml-4 ${
                          isCompleted ? 'bg-[var(--market-green)]' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Live Map Placeholder */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Live Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-[var(--market-green)] mx-auto mb-2" />
                  <p className="text-[var(--market-gray)]">Live map tracking</p>
                  <p className="text-sm text-[var(--market-gray)]">
                    Rider location updates every 30 seconds
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Details & Rider Info */}
        <div className="space-y-6">
          {/* Rider Information */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[var(--market-green)] rounded-full flex items-center justify-center text-white font-bold">
                    {orderData.rider.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium">{orderData.rider.name}</h4>
                    <div className="flex items-center space-x-1">
                      <div className="flex text-yellow-400 text-sm">
                        {'★'.repeat(Math.floor(orderData.rider.rating))}
                      </div>
                      <span className="text-xs text-[var(--market-gray)]">
                        ({orderData.rider.rating})
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-[var(--market-gray)]">
                  <p>{orderData.rider.vehicle}</p>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 bg-[var(--market-green)] hover:bg-[var(--market-green)]/90">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-[var(--market-green)]">₦{orderData.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[var(--market-green)] mt-1" />
                <div>
                  <p className="text-sm">{orderData.deliveryAddress}</p>
                  <p className="text-xs text-[var(--market-gray)] mt-1">
                    Benue State University, Makurdi
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Need Help?</h4>
              <p className="text-sm text-[var(--market-gray)] mb-3">
                Having issues with your order? Contact our support team.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default OrderTracking

