import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Navigation, 
  Clock, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Zap,
  Route
} from 'lucide-react'

const AIRouteOptimizer = ({ activeDelivery, riderLocation, onRouteUpdate }) => {
  const [optimizedRoute, setOptimizedRoute] = useState(null)
  const [routeAnalysis, setRouteAnalysis] = useState(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [trafficConditions, setTrafficConditions] = useState('normal')

  // Mock AI route optimization
  const optimizeRoute = async () => {
    setIsOptimizing(true)
    
    try {
      // Simulate API call to AI backend
      const response = await fetch('https://5000-ipln4xm1bd6mhk03wd98c-7569e807.manusvm.computer/api/ai/route/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rider_id: 'rider_123',
          current_location: riderLocation,
          delivery: activeDelivery,
          traffic_conditions: trafficConditions,
          weather_conditions: 'clear',
          time_of_day: new Date().getHours()
        })
      })

      if (response.ok) {
        const data = await response.json()
        setOptimizedRoute(data.optimized_route)
        setRouteAnalysis(data.analysis)
      } else {
        // Fallback to mock data if API is not available
        generateMockOptimization()
      }
    } catch (error) {
      console.error('Route optimization failed:', error)
      generateMockOptimization()
    }
    
    setIsOptimizing(false)
  }

  const generateMockOptimization = () => {
    const mockRoute = {
      total_distance: '2.8 km',
      estimated_time: '12 mins',
      fuel_efficiency: '15% better',
      time_saved: '3 mins',
      route_points: [
        { name: 'Current Location', type: 'start', eta: 'Now' },
        { name: "Mama Kemi's Store", type: 'pickup', eta: '3 mins' },
        { name: 'Spice Corner', type: 'pickup', eta: '6 mins' },
        { name: 'Grace Oche - Modern Market Area', type: 'delivery', eta: '12 mins' }
      ],
      optimization_factors: [
        { factor: 'Traffic Avoidance', impact: '+2 mins saved' },
        { factor: 'Shortest Path', impact: '+0.5 km reduced' },
        { factor: 'Fuel Efficiency', impact: '+15% better' }
      ],
      confidence_score: 92
    }

    const mockAnalysis = {
      route_quality: 'excellent',
      traffic_impact: 'low',
      weather_impact: 'none',
      alternative_routes: 2,
      recommendations: [
        'Take the optimized route for best efficiency',
        'Avoid main road between 5-7 PM due to traffic',
        'Consider fuel stop after this delivery'
      ]
    }

    setOptimizedRoute(mockRoute)
    setRouteAnalysis(mockAnalysis)
  }

  useEffect(() => {
    if (activeDelivery && riderLocation) {
      optimizeRoute()
    }
  }, [activeDelivery, riderLocation, trafficConditions])

  const handleUseOptimizedRoute = () => {
    if (optimizedRoute && onRouteUpdate) {
      onRouteUpdate(optimizedRoute)
    }
    
    // Open optimized route in maps
    const destination = activeDelivery?.deliveryLocation || 'Modern Market Area'
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`
    window.open(googleMapsUrl, '_blank')
  }

  if (!activeDelivery) {
    return (
      <Card className="border-dashed border-gray-300">
        <CardContent className="p-6 text-center">
          <Route className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No active delivery to optimize</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-800">
          <Zap className="w-5 h-5 mr-2" />
          AI Route Optimizer
          {optimizedRoute && (
            <Badge className="ml-2 bg-green-100 text-green-800">
              {optimizedRoute.confidence_score}% Confidence
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isOptimizing ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-blue-600">Optimizing your route...</p>
          </div>
        ) : optimizedRoute ? (
          <div className="space-y-4">
            {/* Route Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-white rounded-lg">
                <Navigation className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Distance</p>
                <p className="font-semibold">{optimizedRoute.total_distance}</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <Clock className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600">ETA</p>
                <p className="font-semibold">{optimizedRoute.estimated_time}</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Time Saved</p>
                <p className="font-semibold text-green-600">{optimizedRoute.time_saved}</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <Zap className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Efficiency</p>
                <p className="font-semibold text-green-600">{optimizedRoute.fuel_efficiency}</p>
              </div>
            </div>

            {/* Route Steps */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center">
                <Route className="w-4 h-4 mr-2" />
                Optimized Route
              </h4>
              <div className="space-y-2">
                {optimizedRoute.route_points.map((point, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      point.type === 'start' ? 'bg-blue-500' :
                      point.type === 'pickup' ? 'bg-orange-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{point.name}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {point.eta}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Optimization Factors */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium mb-3">Optimization Benefits</h4>
              <div className="space-y-2">
                {optimizedRoute.optimization_factors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{factor.factor}</span>
                    <span className="text-green-600 font-medium">{factor.impact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            {routeAnalysis && routeAnalysis.recommendations && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center text-yellow-800">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  AI Recommendations
                </h4>
                <ul className="space-y-1">
                  {routeAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-yellow-700 flex items-start">
                      <CheckCircle className="w-3 h-3 mr-2 mt-0.5 text-yellow-600" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button 
                onClick={handleUseOptimizedRoute}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Use Optimized Route
              </Button>
              <Button 
                onClick={optimizeRoute}
                variant="outline"
                className="flex-1"
              >
                Re-optimize
              </Button>
            </div>

            {/* Traffic Conditions Selector */}
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Traffic:</span>
              <select 
                value={trafficConditions}
                onChange={(e) => setTrafficConditions(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="light">Light</option>
                <option value="normal">Normal</option>
                <option value="heavy">Heavy</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Button onClick={optimizeRoute} className="bg-blue-600 hover:bg-blue-700">
              <Zap className="w-4 h-4 mr-2" />
              Optimize Route
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AIRouteOptimizer

