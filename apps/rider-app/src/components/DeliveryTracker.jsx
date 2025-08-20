import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Navigation, 
  Phone,
  MessageSquare,
  Camera,
  Package,
  Truck,
  User,
  Star
} from 'lucide-react'

const DeliveryTracker = ({ activeDelivery, onStatusUpdate, onCustomerContact }) => {
  const [deliveryStatus, setDeliveryStatus] = useState('pickup_in_progress')
  const [currentLocation, setCurrentLocation] = useState(null)
  const [estimatedArrival, setEstimatedArrival] = useState('5 mins')
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [customerFeedback, setCustomerFeedback] = useState(null)

  // Mock delivery statuses
  const deliveryStatuses = [
    { id: 'assigned', label: 'Order Assigned', completed: true },
    { id: 'pickup_in_progress', label: 'Pickup in Progress', completed: true },
    { id: 'items_collected', label: 'Items Collected', completed: false },
    { id: 'en_route', label: 'En Route to Customer', completed: false },
    { id: 'arrived', label: 'Arrived at Destination', completed: false },
    { id: 'delivered', label: 'Delivered', completed: false }
  ]

  // Mock real-time location tracking
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => {
          console.error('Location tracking error:', error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        }
      )

      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  // Mock ETA updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (deliveryStatus === 'en_route') {
        const currentETA = parseInt(estimatedArrival.split(' ')[0])
        if (currentETA > 1) {
          setEstimatedArrival(`${currentETA - 1} mins`)
        }
      }
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [deliveryStatus, estimatedArrival])

  const updateDeliveryStatus = (newStatus) => {
    setDeliveryStatus(newStatus)
    
    // Update completed statuses
    const statusIndex = deliveryStatuses.findIndex(s => s.id === newStatus)
    deliveryStatuses.forEach((status, index) => {
      status.completed = index <= statusIndex
    })

    // Send status update to backend
    if (onStatusUpdate) {
      onStatusUpdate(activeDelivery?.id, newStatus, currentLocation)
    }

    // Auto-update ETA based on status
    switch (newStatus) {
      case 'items_collected':
        setEstimatedArrival('8 mins')
        break
      case 'en_route':
        setEstimatedArrival('5 mins')
        break
      case 'arrived':
        setEstimatedArrival('Now')
        break
    }
  }

  const handleCustomerContact = (method) => {
    if (onCustomerContact) {
      onCustomerContact(activeDelivery?.customer, method)
    }
    
    if (method === 'call') {
      // In a real app, this would initiate a call
      alert(`Calling ${activeDelivery?.customer}...`)
    } else if (method === 'message') {
      // In a real app, this would open messaging interface
      alert(`Opening message interface for ${activeDelivery?.customer}...`)
    }
  }

  const takeDeliveryPhoto = () => {
    // In a real app, this would open camera interface
    alert('Camera interface would open here for delivery proof photo')
  }

  const submitDeliveryNotes = () => {
    if (deliveryNotes.trim()) {
      // Send notes to backend
      console.log('Delivery notes:', deliveryNotes)
      alert('Delivery notes saved successfully!')
      setDeliveryNotes('')
    }
  }

  const getStatusIcon = (status, completed) => {
    if (completed) {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    } else if (status.id === deliveryStatus) {
      return <div className="w-4 h-4 border-2 border-blue-500 rounded-full animate-pulse"></div>
    } else {
      return <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
    }
  }

  if (!activeDelivery) {
    return (
      <Card className="border-dashed border-gray-300">
        <CardContent className="p-6 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No active delivery to track</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-800">
          <Truck className="w-5 h-5 mr-2" />
          Delivery Tracker - {activeDelivery.id}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{activeDelivery.customer}</h3>
                  <p className="text-sm text-gray-600">{activeDelivery.deliveryLocation}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCustomerContact('call')}
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCustomerContact('message')}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* ETA Display */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>ETA: {estimatedArrival}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-green-500" />
                <span>₦{activeDelivery.earnings}</span>
              </div>
            </div>
          </div>

          {/* Delivery Progress */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium mb-4">Delivery Progress</h4>
            <div className="space-y-3">
              {deliveryStatuses.map((status, index) => (
                <div key={status.id} className="flex items-center space-x-3">
                  {getStatusIcon(status, status.completed)}
                  <div className="flex-1">
                    <p className={`text-sm ${
                      status.completed ? 'text-green-600 font-medium' : 
                      status.id === deliveryStatus ? 'text-blue-600 font-medium' : 
                      'text-gray-500'
                    }`}>
                      {status.label}
                    </p>
                  </div>
                  {status.id === deliveryStatus && (
                    <Badge className="bg-blue-100 text-blue-800">Current</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              {deliveryStatus === 'pickup_in_progress' && (
                <Button
                  onClick={() => updateDeliveryStatus('items_collected')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Items Collected
                </Button>
              )}
              
              {deliveryStatus === 'items_collected' && (
                <Button
                  onClick={() => updateDeliveryStatus('en_route')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Start Delivery
                </Button>
              )}
              
              {deliveryStatus === 'en_route' && (
                <Button
                  onClick={() => updateDeliveryStatus('arrived')}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Mark Arrived
                </Button>
              )}
              
              {deliveryStatus === 'arrived' && (
                <>
                  <Button
                    onClick={takeDeliveryPhoto}
                    variant="outline"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                  <Button
                    onClick={() => updateDeliveryStatus('delivered')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Delivery
                  </Button>
                </>
              )}
              
              <Button
                onClick={() => {
                  const destination = activeDelivery.deliveryLocation
                  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`
                  window.open(googleMapsUrl, '_blank')
                }}
                variant="outline"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Open Maps
              </Button>
            </div>
          </div>

          {/* Delivery Notes */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium mb-3">Delivery Notes</h4>
            <div className="space-y-3">
              <textarea
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="Add any delivery notes, special instructions, or issues..."
                className="w-full p-3 border rounded-lg text-sm resize-none"
                rows={3}
              />
              <Button
                onClick={submitDeliveryNotes}
                disabled={!deliveryNotes.trim()}
                className="w-full"
              >
                Save Notes
              </Button>
            </div>
          </div>

          {/* Pickup Progress (if multi-vendor) */}
          {activeDelivery.pickupProgress && (
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium mb-3">Pickup Progress</h4>
              <div className="space-y-2">
                {activeDelivery.pickupProgress.map((pickup, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{pickup.vendor}</p>
                      <p className="text-xs text-gray-600">{pickup.item}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Collected</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Feedback (after delivery) */}
          {deliveryStatus === 'delivered' && customerFeedback && (
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium mb-3">Customer Feedback</h4>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < customerFeedback.rating ? 'fill-current' : ''
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{customerFeedback.rating}/5</span>
              </div>
              {customerFeedback.comment && (
                <p className="text-sm text-gray-600 italic">
                  "{customerFeedback.comment}"
                </p>
              )}
            </div>
          )}

          {/* Emergency Contact */}
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <h4 className="font-medium text-red-800">Emergency Support</h4>
            </div>
            <p className="text-sm text-red-700 mb-3">
              If you encounter any issues during delivery, contact support immediately.
            </p>
            <Button
              variant="outline"
              className="w-full border-red-300 text-red-700 hover:bg-red-100"
              onClick={() => alert('Emergency support contacted')}
            >
              <Phone className="w-4 h-4 mr-2" />
              Contact Emergency Support
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DeliveryTracker

