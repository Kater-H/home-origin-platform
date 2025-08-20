import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Calendar, Package, AlertTriangle, BarChart3 } from 'lucide-react'

const DemandForecastInsights = ({ vendorId = 'vendor_123' }) => {
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDays, setSelectedDays] = useState(7)

  useEffect(() => {
    fetchDemandForecast()
  }, [vendorId, selectedDays])

  const fetchDemandForecast = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `https://5000-ipln4xm1bd6mhk03wd98c-7569e807.manusvm.computer/api/ai/demand/vendor/${vendorId}/forecast?days_ahead=${selectedDays}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch demand forecast')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setForecastData(data.forecasts || [])
      } else {
        throw new Error(data.error || 'Failed to get demand forecast')
      }
    } catch (err) {
      console.error('Error fetching demand forecast:', err)
      setError(err.message)
      // Fallback to mock data
      setForecastData([
        {
          product_id: '1',
          product_name: 'Fresh Tomatoes',
          total_predicted_demand: 150.5,
          avg_daily_demand: 21.5,
          daily_predictions: [
            { date: '2025-08-01', predicted_demand: 25 },
            { date: '2025-08-02', predicted_demand: 22 },
            { date: '2025-08-03', predicted_demand: 28 },
            { date: '2025-08-04', predicted_demand: 18 },
            { date: '2025-08-05', predicted_demand: 24 },
            { date: '2025-08-06', predicted_demand: 20 },
            { date: '2025-08-07', predicted_demand: 13 }
          ]
        },
        {
          product_id: '2',
          product_name: 'Premium Rice (5kg)',
          total_predicted_demand: 85.2,
          avg_daily_demand: 12.2,
          daily_predictions: [
            { date: '2025-08-01', predicted_demand: 15 },
            { date: '2025-08-02', predicted_demand: 12 },
            { date: '2025-08-03', predicted_demand: 14 },
            { date: '2025-08-04', predicted_demand: 10 },
            { date: '2025-08-05', predicted_demand: 13 },
            { date: '2025-08-06', predicted_demand: 11 },
            { date: '2025-08-07', predicted_demand: 10 }
          ]
        },
        {
          product_id: '3',
          product_name: 'Cooking Oil (1L)',
          total_predicted_demand: 42.8,
          avg_daily_demand: 6.1,
          daily_predictions: [
            { date: '2025-08-01', predicted_demand: 8 },
            { date: '2025-08-02', predicted_demand: 6 },
            { date: '2025-08-03', predicted_demand: 7 },
            { date: '2025-08-04', predicted_demand: 5 },
            { date: '2025-08-05', predicted_demand: 6 },
            { date: '2025-08-06', predicted_demand: 5 },
            { date: '2025-08-07', predicted_demand: 6 }
          ]
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (predictions) => {
    if (!predictions || predictions.length < 2) return <TrendingUp className="w-4 h-4 text-gray-500" />
    
    const firstHalf = predictions.slice(0, Math.floor(predictions.length / 2))
    const secondHalf = predictions.slice(Math.floor(predictions.length / 2))
    
    const firstAvg = firstHalf.reduce((sum, p) => sum + p.predicted_demand, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, p) => sum + p.predicted_demand, 0) / secondHalf.length
    
    if (secondAvg > firstAvg) {
      return <TrendingUp className="w-4 h-4 text-green-600" />
    } else if (secondAvg < firstAvg) {
      return <TrendingDown className="w-4 h-4 text-red-600" />
    } else {
      return <TrendingUp className="w-4 h-4 text-gray-500" />
    }
  }

  const getStockRecommendation = (avgDemand) => {
    const recommendedStock = Math.ceil(avgDemand * selectedDays * 1.2) // 20% buffer
    
    if (avgDemand > 20) {
      return { level: 'high', stock: recommendedStock, color: 'text-red-600 bg-red-50' }
    } else if (avgDemand > 10) {
      return { level: 'medium', stock: recommendedStock, color: 'text-yellow-600 bg-yellow-50' }
    } else {
      return { level: 'low', stock: recommendedStock, color: 'text-green-600 bg-green-50' }
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
            Demand Forecast
          </h2>
          <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse border rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && (!forecastData || forecastData.length === 0)) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
          Demand Forecast
        </h2>
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Unable to load demand forecast</p>
          <button 
            onClick={fetchDemandForecast}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
          Demand Forecast
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
            AI-Powered
          </span>
          <select
            value={selectedDays}
            onChange={(e) => setSelectedDays(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
          >
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {forecastData.map((product) => {
          const recommendation = getStockRecommendation(product.avg_daily_demand)
          
          return (
            <div key={product.product_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Package className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">{product.product_name}</h3>
                  {getTrendIcon(product.daily_predictions)}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${recommendation.color}`}>
                  {recommendation.level} demand
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(product.total_predicted_demand)}
                  </p>
                  <p className="text-sm text-gray-600">Total Demand</p>
                  <p className="text-xs text-gray-500">{selectedDays} days</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(product.avg_daily_demand)}
                  </p>
                  <p className="text-sm text-gray-600">Daily Average</p>
                  <p className="text-xs text-gray-500">units/day</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {recommendation.stock}
                  </p>
                  <p className="text-sm text-gray-600">Recommended Stock</p>
                  <p className="text-xs text-gray-500">+20% buffer</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    {getTrendIcon(product.daily_predictions)}
                    <span className="ml-1 text-sm font-medium">
                      {product.daily_predictions && product.daily_predictions.length > 1 ? 'Trending' : 'Stable'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">7-day trend</p>
                </div>
              </div>

              {/* Daily Predictions Chart (Simple Bar Chart) */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Daily Predictions
                </h4>
                <div className="flex items-end space-x-1 h-16">
                  {product.daily_predictions.map((day, index) => {
                    const maxDemand = Math.max(...product.daily_predictions.map(d => d.predicted_demand))
                    const height = (day.predicted_demand / maxDemand) * 100
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-blue-500 rounded-t"
                          style={{ height: `${height}%` }}
                          title={`${new Date(day.date).toLocaleDateString()}: ${Math.round(day.predicted_demand)} units`}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Action Recommendations */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-2">💡 Recommendations:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {recommendation.level === 'high' && (
                    <>
                      <li>• Ensure adequate stock levels - high demand expected</li>
                      <li>• Consider bulk purchasing for better margins</li>
                    </>
                  )}
                  {recommendation.level === 'medium' && (
                    <>
                      <li>• Maintain regular stock levels</li>
                      <li>• Monitor daily sales closely</li>
                    </>
                  )}
                  {recommendation.level === 'low' && (
                    <>
                      <li>• Consider promotional activities to boost demand</li>
                      <li>• Optimize inventory to reduce holding costs</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      {forecastData.length === 0 && (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No demand forecast available</p>
          <p className="text-sm text-gray-400 mt-2">
            Add more products to get demand insights!
          </p>
        </div>
      )}
    </div>
  )
}

export default DemandForecastInsights

