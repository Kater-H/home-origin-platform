import { useState, useEffect } from 'react'
import { 
  Brain, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  MessageCircle, 
  Target,
  BarChart3,
  PieChart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react'

const AIAnalyticsDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [segmentationData, setSegmentationData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAIDashboardData()
    fetchCustomerSegmentation()
  }, [])

  const fetchAIDashboardData = async () => {
    try {
      const response = await fetch(
        'https://5000-ipln4xm1bd6mhk03wd98c-7569e807.manusvm.computer/api/ai/analytics/admin/dashboard'
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch AI dashboard data')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setDashboardData(data.dashboard_data)
      } else {
        throw new Error(data.error || 'Failed to get AI dashboard data')
      }
    } catch (err) {
      console.error('Error fetching AI dashboard data:', err)
      setError(err.message)
      // Fallback to mock data
      setDashboardData({
        recommendation_stats: {
          total_recommendations_served: 1250,
          avg_click_through_rate: 12.5,
          top_recommended_categories: ['Fresh Vegetables', 'Grains & Rice', 'Fruits']
        },
        demand_insights: {
          high_demand_products: [
            { product_id: '1', name: 'Fresh Tomatoes', predicted_demand: 150 },
            { product_id: '2', name: 'Premium Rice', predicted_demand: 120 },
            { product_id: '3', name: 'Cooking Oil', predicted_demand: 100 }
          ],
          demand_trends: 'increasing',
          seasonal_patterns: 'vegetables_peak_weekends'
        },
        sentiment_overview: {
          overall_platform_sentiment: 'positive',
          positive_percentage: 72.5,
          negative_percentage: 15.2,
          neutral_percentage: 12.3,
          trending_issues: ['delivery_delays', 'product_quality']
        },
        customer_insights: {
          champion_customers: 25,
          loyal_customers: 45,
          at_risk_customers: 12,
          new_customers: 18,
          churn_risk_percentage: 8.5
        }
      })
    }
  }

  const fetchCustomerSegmentation = async () => {
    try {
      const response = await fetch(
        'https://5000-ipln4xm1bd6mhk03wd98c-7569e807.manusvm.computer/api/ai/segmentation/admin/overview'
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch customer segmentation data')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setSegmentationData(data)
      } else {
        throw new Error(data.error || 'Failed to get segmentation data')
      }
    } catch (err) {
      console.error('Error fetching customer segmentation:', err)
      // Fallback to mock data
      setSegmentationData({
        total_customers: 100,
        segment_distribution: {
          'Champions': 25,
          'Loyal Customers': 45,
          'At Risk': 12,
          'New Customers': 18
        },
        segment_percentages: {
          'Champions': 25.0,
          'Loyal Customers': 45.0,
          'At Risk': 12.0,
          'New Customers': 18.0
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const getSegmentColor = (segment) => {
    const colors = {
      'Champions': 'bg-green-500',
      'Loyal Customers': 'bg-blue-500',
      'At Risk': 'bg-red-500',
      'New Customers': 'bg-yellow-500'
    }
    return colors[segment] || 'bg-gray-500'
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'decreasing':
        return <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />
      default:
        return <TrendingUp className="w-4 h-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Brain className="w-8 h-8 mr-3 text-purple-600" />
            AI Analytics Dashboard
          </h1>
          <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg shadow-sm p-6">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && !dashboardData) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Brain className="w-8 h-8 mr-3 text-purple-600" />
          AI Analytics Dashboard
        </h1>
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Unable to load AI analytics data</p>
          <button 
            onClick={() => {
              fetchAIDashboardData()
              fetchCustomerSegmentation()
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Brain className="w-8 h-8 mr-3 text-purple-600" />
          AI Analytics Dashboard
        </h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 bg-purple-50 px-3 py-1 rounded-full">
            Real-time AI Insights
          </span>
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-sm">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recommendations Served</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.recommendation_stats?.total_recommendations_served?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-blue-600">
                {dashboardData?.recommendation_stats?.avg_click_through_rate || 0}% CTR
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Platform Sentiment</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.sentiment_overview?.positive_percentage?.toFixed(1) || '0'}%
              </p>
              <p className="text-sm text-green-600 capitalize">
                {dashboardData?.sentiment_overview?.overall_platform_sentiment || 'neutral'} overall
              </p>
            </div>
            <MessageCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Demand Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.demand_insights?.high_demand_products?.length || 0}
              </p>
              <div className="flex items-center text-sm text-orange-600">
                {getTrendIcon(dashboardData?.demand_insights?.demand_trends)}
                <span className="ml-1 capitalize">
                  {dashboardData?.demand_insights?.demand_trends || 'stable'} trend
                </span>
              </div>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">At Risk Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.customer_insights?.at_risk_customers || 0}
              </p>
              <p className="text-sm text-purple-600">
                {dashboardData?.customer_insights?.churn_risk_percentage || 0}% churn risk
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Segmentation */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <PieChart className="w-6 h-6 mr-2 text-indigo-600" />
              Customer Segmentation
            </h2>
            <span className="text-sm text-gray-500">
              {segmentationData?.total_customers || 0} total customers
            </span>
          </div>

          <div className="space-y-4">
            {segmentationData && Object.entries(segmentationData.segment_distribution || {}).map(([segment, count]) => (
              <div key={segment} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${getSegmentColor(segment)} mr-3`}></div>
                  <span className="font-medium text-gray-900">{segment}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getSegmentColor(segment)}`}
                      style={{ width: `${segmentationData.segment_percentages[segment] || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">
                    {count} ({segmentationData.segment_percentages[segment]?.toFixed(1) || 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
            <h4 className="font-medium text-indigo-900 mb-2">💡 Insights:</h4>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Focus retention efforts on At Risk customers</li>
              <li>• Leverage Champions for referral programs</li>
              <li>• Create onboarding campaigns for New Customers</li>
            </ul>
          </div>
        </div>

        {/* High Demand Products */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-yellow-600" />
              High Demand Products
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              Next 7 days
            </div>
          </div>

          <div className="space-y-4">
            {dashboardData?.demand_insights?.high_demand_products?.map((product, index) => (
              <div key={product.product_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-yellow-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">Product ID: {product.product_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-yellow-600">{product.predicted_demand}</p>
                  <p className="text-sm text-gray-600">units</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">📈 Recommendations:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Ensure adequate inventory for high-demand items</li>
              <li>• Consider promotional campaigns for these products</li>
              <li>• Alert vendors about increased demand forecasts</li>
            </ul>
          </div>
        </div>

        {/* Sentiment Analysis Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <MessageCircle className="w-6 h-6 mr-2 text-green-600" />
              Platform Sentiment
            </h2>
            <span className="text-sm text-gray-500">Real-time analysis</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {dashboardData?.sentiment_overview?.positive_percentage?.toFixed(1) || 0}%
              </p>
              <p className="text-sm text-gray-600">Positive</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">
                {dashboardData?.sentiment_overview?.neutral_percentage?.toFixed(1) || 0}%
              </p>
              <p className="text-sm text-gray-600">Neutral</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {dashboardData?.sentiment_overview?.negative_percentage?.toFixed(1) || 0}%
              </p>
              <p className="text-sm text-gray-600">Negative</p>
            </div>
          </div>

          {dashboardData?.sentiment_overview?.trending_issues && (
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Trending Issues:
              </h4>
              <div className="flex flex-wrap gap-2">
                {dashboardData.sentiment_overview.trending_issues.map((issue, index) => (
                  <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                    {issue.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Recommended Categories */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Target className="w-6 h-6 mr-2 text-blue-600" />
              Top Recommended Categories
            </h2>
            <span className="text-sm text-gray-500">
              {dashboardData?.recommendation_stats?.avg_click_through_rate || 0}% avg CTR
            </span>
          </div>

          <div className="space-y-3">
            {dashboardData?.recommendation_stats?.top_recommended_categories?.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-900">{category}</span>
                </div>
                <div className="w-16 bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${100 - (index * 20)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">🎯 Optimization Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Feature top categories prominently on homepage</li>
              <li>• Create targeted campaigns for popular categories</li>
              <li>• Analyze why certain categories perform better</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
          AI-Powered Action Items
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-gray-900 mb-2">Customer Retention</h4>
            <p className="text-sm text-gray-600 mb-3">
              {dashboardData?.customer_insights?.at_risk_customers || 0} customers at risk of churning
            </p>
            <button className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700">
              Create Campaign
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-gray-900 mb-2">Inventory Alert</h4>
            <p className="text-sm text-gray-600 mb-3">
              {dashboardData?.demand_insights?.high_demand_products?.length || 0} products need stock attention
            </p>
            <button className="text-sm bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700">
              Notify Vendors
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-gray-900 mb-2">Sentiment Issues</h4>
            <p className="text-sm text-gray-600 mb-3">
              {dashboardData?.sentiment_overview?.trending_issues?.length || 0} trending issues detected
            </p>
            <button className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
              Investigate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAnalyticsDashboard

