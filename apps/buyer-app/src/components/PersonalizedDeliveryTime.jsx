import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Truck, Clock, MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

const PersonalizedDeliveryTime = ({ 
  userId, 
  vendorId, 
  customerLocation, 
  orderItems = [],
  showDetailedBreakdown = false,
  className = ""
}) => {
  const [deliveryPrediction, setDeliveryPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchDeliveryTime = async () => {
    if (!userId || !vendorId || !customerLocation) return

    setLoading(true)
    setError(null)
    
    try {
      // Get current weather and traffic conditions (mock data)
      const weatherCondition = 'clear' // In reality, this would come from a weather API
      const trafficLevel = getCurrentTrafficLevel()
      const availableRiders = Math.floor(Math.random() * 5) + 1 // Mock rider availability

      const response = await fetch('https://5000-ipln4xm1bd6mhk03wd98c-7569e807.manusvm.computer/api/ai/delivery/predict-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          vendor_id: vendorId,
          customer_location: customerLocation,
          order_items: orderItems,
          weather_condition: weatherCondition,
          traffic_level: trafficLevel,
          time_of_day: new Date().getHours(),
          day_of_week: new Date().getDay(),
          available_riders: availableRiders,
          distance_km: 3.5, // Mock distance - in reality would be calculated
          user_delivery_history: {
            avg_delivery_time: 25 // Mock historical data
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setDeliveryPrediction(data)
        } else {
          setError('Failed to get delivery prediction')
        }
      } else {
        setError('Service temporarily unavailable')
      }
    } catch (error) {
      console.warn('Delivery time prediction failed:', error)
      setError('Unable to predict delivery time')
      // Fallback to default estimate
      setDeliveryPrediction({
        predicted_delivery_time: 30,
        confidence_interval: { min_time: 25, max_time: 40 },
        breakdown: { preparation_time: 15, travel_time: 15, buffer_time: 0 }
      })
    } finally {
      setLoading(false)
    }
  }

  const getCurrentTrafficLevel = () => {
    const hour = new Date().getHours()
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return 'heavy' // Rush hours
    } else if (hour >= 12 && hour <= 14) {
      return 'normal' // Lunch time
    } else {
      return 'light' // Off-peak
    }
  }

  useEffect(() => {
    fetchDeliveryTime()
  }, [userId, vendorId, customerLocation, orderItems])

  const formatDeliveryTime = (minutes) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`
    } else {
      const hours = Math.floor(minutes / 60)
      const mins = Math.round(minutes % 60)
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
    }
  }

  const getEstimatedArrival = (minutes) => {
    const arrival = new Date(Date.now() + minutes * 60 * 1000)
    return arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getDeliverySpeedBadge = (minutes) => {
    if (minutes <= 20) {
      return <Badge className="bg-green-100 text-green-800">⚡ Super Fast</Badge>
    } else if (minutes <= 35) {
      return <Badge className="bg-blue-100 text-blue-800">🚀 Fast</Badge>
    } else if (minutes <= 50) {
      return <Badge className="bg-yellow-100 text-yellow-800">🕐 Standard</Badge>
    } else {
      return <Badge className="bg-orange-100 text-orange-800">🐌 Slower</Badge>
    }
  }

  const renderDetailedBreakdown = () => {
    if (!showDetailedBreakdown || !deliveryPrediction?.breakdown) return null

    const { breakdown } = deliveryPrediction

    return (
      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Delivery Breakdown</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Preparation
            </span>
            <span>{Math.round(breakdown.preparation_time)} min</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3 text-blue-500" />
              Travel
            </span>
            <span>{Math.round(breakdown.travel_time)} min</span>
          </div>
          {breakdown.buffer_time > 0 && (
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-500" />
                Buffer
              </span>
              <span>{Math.round(breakdown.buffer_time)} min</span>
            </div>
          )}
        </div>

        {deliveryPrediction.factors_considered && (
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Factors considered:</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(deliveryPrediction.factors_considered).map(([key, value]) => (
                <Badge key={key} variant="outline" className="text-xs">
                  {key.replace(/_/g, ' ')}: {value}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-gray-600">Calculating delivery time...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <AlertCircle className="w-4 h-4 text-orange-500" />
        <span className="text-sm text-gray-600">Est. 25-35 min</span>
      </div>
    )
  }

  if (!deliveryPrediction) return null

  const { predicted_delivery_time, confidence_interval } = deliveryPrediction

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Truck className="w-4 h-4 text-[var(--market-green)]" />
        <div className="flex items-center gap-2">
          <span className="font-medium text-[var(--market-green)]">
            {formatDeliveryTime(predicted_delivery_time)}
          </span>
          {getDeliverySpeedBadge(predicted_delivery_time)}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Arrives by {getEstimatedArrival(predicted_delivery_time)}</span>
        </div>
        
        {confidence_interval && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>
              {formatDeliveryTime(confidence_interval.min_time)} - {formatDeliveryTime(confidence_interval.max_time)}
            </span>
          </div>
        )}
      </div>

      {/* Personalized messages */}
      {predicted_delivery_time <= 20 && (
        <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
          🎉 Great news! Your order will arrive faster than usual based on your location and current conditions.
        </div>
      )}

      {deliveryPrediction.factors_considered?.weather_condition === 'rain' && (
        <div className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded">
          🌧️ Delivery may take a bit longer due to rain. Our riders prioritize safety.
        </div>
      )}

      {deliveryPrediction.factors_considered?.traffic_level === 'heavy' && (
        <div className="text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded">
          🚦 Heavy traffic detected. We've adjusted the delivery time accordingly.
        </div>
      )}

      {renderDetailedBreakdown()}
    </div>
  )
}

export default PersonalizedDeliveryTime

