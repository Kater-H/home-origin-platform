import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  MapPin, 
  Target,
  Brain,
  Calendar,
  BarChart3
} from 'lucide-react'

const EarningsPredictor = ({ riderLocation, currentEarnings, onlineHours }) => {
  const [predictions, setPredictions] = useState(null)
  const [demandHotspots, setDemandHotspots] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('today')

  // Mock AI earnings prediction
  const generateEarningsPrediction = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call to AI backend
      const response = await fetch('https://5000-ipln4xm1bd6mhk03wd98c-7569e807.manusvm.computer/api/ai/earnings/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rider_id: 'rider_123',
          current_location: riderLocation,
          current_earnings: currentEarnings,
          online_hours: onlineHours,
          timeframe: selectedTimeframe,
          day_of_week: new Date().getDay(),
          hour_of_day: new Date().getHours()
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPredictions(data.predictions)
        setDemandHotspots(data.hotspots)
      } else {
        // Fallback to mock data if API is not available
        generateMockPredictions()
      }
    } catch (error) {
      console.error('Earnings prediction failed:', error)
      generateMockPredictions()
    }
    
    setIsLoading(false)
  }

  const generateMockPredictions = () => {
    const currentHour = new Date().getHours()
    const isWeekend = [0, 6].includes(new Date().getDay())
    
    const mockPredictions = {
      today: {
        predicted_total: currentEarnings + (isWeekend ? 3200 : 2800),
        remaining_potential: isWeekend ? 3200 : 2800,
        confidence: 87,
        peak_hours: ['12:00-14:00', '18:00-21:00'],
        factors: [
          { name: 'Current Performance', impact: '+15%', positive: true },
          { name: 'Weekend Bonus', impact: isWeekend ? '+20%' : '0%', positive: isWeekend },
          { name: 'Weather Conditions', impact: '+5%', positive: true },
          { name: 'Event Activity', impact: '+10%', positive: true }
        ]
      },
      week: {
        predicted_total: currentEarnings * 7 + (isWeekend ? 22000 : 19000),
        daily_average: isWeekend ? 3800 : 3200,
        confidence: 82,
        best_days: ['Friday', 'Saturday', 'Sunday'],
        growth_trend: '+12%'
      },
      month: {
        predicted_total: currentEarnings * 30 + 95000,
        weekly_average: 28000,
        confidence: 75,
        seasonal_factors: ['University semester', 'Holiday season'],
        growth_potential: '+18%'
      }
    }

    const mockHotspots = [
      {
        name: 'Modern Market Area',
        demand_level: 'high',
        estimated_earnings: '₦1,200-1,800/hour',
        distance: '0.5 km',
        peak_time: '12:00-14:00',
        confidence: 92
      },
      {
        name: 'BSU Campus',
        demand_level: 'medium',
        estimated_earnings: '₦800-1,200/hour',
        distance: '1.2 km',
        peak_time: '18:00-21:00',
        confidence: 85
      },
      {
        name: 'High Level Area',
        demand_level: 'medium',
        estimated_earnings: '₦600-1,000/hour',
        distance: '2.1 km',
        peak_time: '19:00-22:00',
        confidence: 78
      }
    ]

    setPredictions(mockPredictions)
    setDemandHotspots(mockHotspots)
  }

  useEffect(() => {
    generateEarningsPrediction()
  }, [selectedTimeframe, riderLocation])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getDemandColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const currentPrediction = predictions?.[selectedTimeframe]

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center text-green-800">
          <Brain className="w-5 h-5 mr-2" />
          AI Earnings Predictor
          {currentPrediction && (
            <Badge className="ml-2 bg-green-100 text-green-800">
              {currentPrediction.confidence}% Confidence
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Timeframe Selector */}
        <div className="flex space-x-2 mb-4">
          {['today', 'week', 'month'].map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
              className={selectedTimeframe === timeframe ? 'bg-green-600' : ''}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
            <p className="text-green-600">Analyzing earnings potential...</p>
          </div>
        ) : currentPrediction ? (
          <div className="space-y-4">
            {/* Main Prediction */}
            <div className="bg-white rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">
                    {selectedTimeframe === 'today' ? 'Predicted Total' : 
                     selectedTimeframe === 'week' ? 'Weekly Total' : 'Monthly Total'}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(currentPrediction.predicted_total || currentPrediction.predicted_total)}
                  </p>
                </div>
                
                {selectedTimeframe === 'today' && (
                  <div className="text-center">
                    <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Remaining Potential</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(currentPrediction.remaining_potential)}
                    </p>
                  </div>
                )}
                
                {selectedTimeframe === 'week' && (
                  <div className="text-center">
                    <BarChart3 className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Daily Average</p>
                    <p className="text-lg font-bold text-purple-600">
                      {formatCurrency(currentPrediction.daily_average)}
                    </p>
                  </div>
                )}
                
                {selectedTimeframe === 'month' && (
                  <div className="text-center">
                    <Calendar className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Weekly Average</p>
                    <p className="text-lg font-bold text-orange-600">
                      {formatCurrency(currentPrediction.weekly_average)}
                    </p>
                  </div>
                )}
                
                <div className="text-center">
                  <TrendingUp className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Growth Trend</p>
                  <p className="text-lg font-bold text-indigo-600">
                    {currentPrediction.growth_trend || '+12%'}
                  </p>
                </div>
              </div>
            </div>

            {/* Peak Hours/Best Days */}
            {(currentPrediction.peak_hours || currentPrediction.best_days) && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {selectedTimeframe === 'today' ? 'Peak Hours' : 'Best Days'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(currentPrediction.peak_hours || currentPrediction.best_days)?.map((time, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800">
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Factors Affecting Earnings */}
            {currentPrediction.factors && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium mb-3">Factors Affecting Earnings</h4>
                <div className="space-y-2">
                  {currentPrediction.factors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{factor.name}</span>
                      <span className={`font-medium ${factor.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {factor.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Demand Hotspots */}
        {demandHotspots.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Demand Hotspots
            </h4>
            <div className="space-y-3">
              {demandHotspots.map((hotspot, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="font-medium">{hotspot.name}</h5>
                      <p className="text-sm text-gray-600">{hotspot.distance} away</p>
                    </div>
                    <Badge className={getDemandColor(hotspot.demand_level)}>
                      {hotspot.demand_level} demand
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Potential Earnings</p>
                      <p className="font-medium text-green-600">{hotspot.estimated_earnings}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Peak Time</p>
                      <p className="font-medium">{hotspot.peak_time}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Confidence</span>
                      <span className="font-medium">{hotspot.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-green-600 h-1.5 rounded-full" 
                        style={{ width: `${hotspot.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4">
          <Button 
            onClick={generateEarningsPrediction}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            Refresh Predictions
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default EarningsPredictor

