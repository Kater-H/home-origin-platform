import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Clock, 
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Users,
  Zap
} from 'lucide-react'

const PerformanceAnalytics = ({ riderId, currentRating, totalDeliveries, onlineHours }) => {
  const [analytics, setAnalytics] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  // Mock AI performance analytics
  const generatePerformanceAnalytics = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call to AI backend
      const response = await fetch('https://5000-ipln4xm1bd6mhk03wd98c-7569e807.manusvm.computer/api/ai/performance/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rider_id: riderId,
          current_rating: currentRating,
          total_deliveries: totalDeliveries,
          online_hours: onlineHours,
          period: selectedPeriod
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
        setRecommendations(data.recommendations)
      } else {
        // Fallback to mock data if API is not available
        generateMockAnalytics()
      }
    } catch (error) {
      console.error('Performance analytics failed:', error)
      generateMockAnalytics()
    }
    
    setIsLoading(false)
  }

  const generateMockAnalytics = () => {
    const mockAnalytics = {
      overall_score: 87,
      performance_trend: 'improving',
      metrics: {
        delivery_speed: {
          score: 92,
          average_time: '18 mins',
          benchmark: '20 mins',
          trend: 'up',
          improvement: '+15%'
        },
        customer_satisfaction: {
          score: 88,
          average_rating: currentRating,
          benchmark: 4.5,
          trend: 'up',
          improvement: '+8%'
        },
        reliability: {
          score: 95,
          on_time_rate: '94%',
          benchmark: '90%',
          trend: 'stable',
          improvement: '+2%'
        },
        efficiency: {
          score: 83,
          deliveries_per_hour: 3.2,
          benchmark: 3.0,
          trend: 'up',
          improvement: '+12%'
        }
      },
      peer_comparison: {
        rank: 'Top 15%',
        total_riders: 120,
        your_position: 18,
        areas_ahead: ['Delivery Speed', 'Reliability'],
        areas_behind: ['Customer Communication']
      },
      achievements: [
        { name: 'Speed Demon', description: 'Completed 50+ deliveries under estimated time', earned: true },
        { name: 'Customer Favorite', description: 'Maintained 4.8+ rating for 30 days', earned: true },
        { name: 'Reliability Champion', description: '95%+ on-time delivery rate', earned: true },
        { name: 'Efficiency Expert', description: '3.5+ deliveries per hour average', earned: false }
      ],
      weekly_trends: [
        { day: 'Mon', deliveries: 12, rating: 4.7, earnings: 3200 },
        { day: 'Tue', deliveries: 15, rating: 4.8, earnings: 4100 },
        { day: 'Wed', deliveries: 18, rating: 4.9, earnings: 4800 },
        { day: 'Thu', deliveries: 14, rating: 4.6, earnings: 3800 },
        { day: 'Fri', deliveries: 20, rating: 4.8, earnings: 5200 },
        { day: 'Sat', deliveries: 22, rating: 4.9, earnings: 5800 },
        { day: 'Sun', deliveries: 16, rating: 4.7, earnings: 4200 }
      ]
    }

    const mockRecommendations = [
      {
        type: 'improvement',
        priority: 'high',
        title: 'Improve Customer Communication',
        description: 'Send delivery updates to boost satisfaction scores',
        impact: '+0.2 rating points',
        action: 'Use in-app messaging for delivery updates'
      },
      {
        type: 'opportunity',
        priority: 'medium',
        title: 'Optimize Peak Hour Performance',
        description: 'Focus on 6-8 PM deliveries for higher earnings',
        impact: '+₦800 daily',
        action: 'Stay online during peak dinner hours'
      },
      {
        type: 'achievement',
        priority: 'low',
        title: 'Efficiency Expert Goal',
        description: 'Increase to 3.5+ deliveries per hour',
        impact: 'Unlock achievement badge',
        action: 'Optimize routes and reduce wait times'
      }
    ]

    setAnalytics(mockAnalytics)
    setRecommendations(mockRecommendations)
  }

  useEffect(() => {
    generatePerformanceAnalytics()
  }, [selectedPeriod])

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center text-purple-800">
          <BarChart3 className="w-5 h-5 mr-2" />
          AI Performance Analytics
          {analytics && (
            <Badge className="ml-2 bg-purple-100 text-purple-800">
              Score: {analytics.overall_score}/100
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Period Selector */}
        <div className="flex space-x-2 mb-4">
          {['week', 'month', 'quarter'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period ? 'bg-purple-600' : ''}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
            <p className="text-purple-600">Analyzing your performance...</p>
          </div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Overall Performance Score */}
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-8 h-8 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold">Overall Performance</h3>
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(analytics.overall_score)}`}>
                {analytics.overall_score}/100
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Performance is {analytics.performance_trend}
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(analytics.metrics).map(([key, metric]) => (
                <div key={key} className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{key.replace('_', ' ')}</h4>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                    {metric.score}/100
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>Your: {metric.average_time || metric.average_rating || metric.on_time_rate || metric.deliveries_per_hour}</p>
                    <p>Benchmark: {metric.benchmark}</p>
                  </div>
                  <div className="text-xs text-green-600 font-medium mt-1">
                    {metric.improvement} improvement
                  </div>
                </div>
              ))}
            </div>

            {/* Peer Comparison */}
            {analytics.peer_comparison && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Peer Comparison
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Your Rank</p>
                    <p className="text-lg font-bold text-purple-600">{analytics.peer_comparison.rank}</p>
                    <p className="text-xs text-gray-500">
                      #{analytics.peer_comparison.your_position} of {analytics.peer_comparison.total_riders}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Performance Level</p>
                    <p className="text-lg font-bold text-green-600">Above Average</p>
                    <p className="text-xs text-gray-500">Keep up the great work!</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-green-600">Areas where you excel:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analytics.peer_comparison.areas_ahead.map((area, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-600">Areas for improvement:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analytics.peer_comparison.areas_behind.map((area, index) => (
                        <Badge key={index} className="bg-orange-100 text-orange-800 text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Achievements */}
            {analytics.achievements && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Achievements
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analytics.achievements.map((achievement, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1">
                        {achievement.earned ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Target className="w-4 h-4 text-gray-400" />
                        )}
                        <h5 className={`font-medium ${achievement.earned ? 'text-green-800' : 'text-gray-600'}`}>
                          {achievement.name}
                        </h5>
                      </div>
                      <p className={`text-xs ${achievement.earned ? 'text-green-600' : 'text-gray-500'}`}>
                        {achievement.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  AI Recommendations
                </h4>
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {rec.type === 'improvement' && <AlertCircle className="w-4 h-4 text-orange-500" />}
                          {rec.type === 'opportunity' && <TrendingUp className="w-4 h-4 text-blue-500" />}
                          {rec.type === 'achievement' && <Target className="w-4 h-4 text-purple-500" />}
                          <h5 className="font-medium">{rec.title}</h5>
                        </div>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-green-600 font-medium">Impact: {rec.impact}</span>
                        <span className="text-blue-600">{rec.action}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Action Button */}
        <div className="mt-4">
          <Button 
            onClick={generatePerformanceAnalytics}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Refresh Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PerformanceAnalytics

