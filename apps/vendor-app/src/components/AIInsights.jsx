import React, { useState, useEffect } from 'react';

const AIInsights = ({ vendorId = 'v1' }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock AI insights data for vendors
  const mockInsights = {
    demand_forecast: {
      next_7_days: [
        { product: 'Fresh Tomatoes', predicted_demand: 45, confidence: 0.85 },
        { product: 'Local Rice', predicted_demand: 32, confidence: 0.78 },
        { product: 'Palm Oil', predicted_demand: 28, confidence: 0.82 }
      ],
      trend: 'increasing',
      peak_demand_day: 'Saturday'
    },
    customer_insights: {
      top_customer_segments: [
        { segment: 'Loyal Customers', percentage: 35, growth: '+5%' },
        { segment: 'Regular Buyers', percentage: 40, growth: '+2%' },
        { segment: 'New Customers', percentage: 25, growth: '+8%' }
      ],
      avg_order_value: 2800,
      repeat_purchase_rate: 0.68
    },
    product_performance: {
      top_performers: [
        { product: 'Fresh Tomatoes', sales: 156, revenue: 124800, trend: 'up' },
        { product: 'Local Rice', sales: 89, revenue: 311500, trend: 'up' },
        { product: 'Palm Oil', sales: 67, revenue: 134000, trend: 'stable' }
      ],
      underperformers: [
        { product: 'Dried Fish', sales: 12, revenue: 36000, suggestion: 'Consider promotion' }
      ]
    },
    recommendations: {
      inventory: [
        'Increase Fresh Tomatoes stock by 20% for weekend',
        'Consider bulk discount for Local Rice',
        'Monitor Palm Oil pricing trends'
      ],
      marketing: [
        'Target loyal customers with premium products',
        'Create bundle offers for new customers',
        'Promote underperforming items with discounts'
      ]
    },
    sentiment_analysis: {
      overall_rating: 4.3,
      positive_reviews: 78,
      neutral_reviews: 15,
      negative_reviews: 7,
      common_positive_themes: ['Fresh products', 'Good pricing', 'Fast delivery'],
      areas_for_improvement: ['Packaging', 'Product variety']
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [vendorId]);

  const fetchInsights = async () => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would be:
      // const response = await fetch(`/api/ai/vendor-insights/${vendorId}`);
      // const data = await response.json();
      // setInsights(data.insights);
      
      setInsights(mockInsights);
    } catch (err) {
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">AI Insights</h2>
        <p className="text-gray-600 mb-4">Failed to load insights</p>
        <button 
          onClick={fetchInsights}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
          Powered by AI
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demand Forecast */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-5 h-5 bg-blue-500 rounded mr-2 flex items-center justify-center">
              <span className="text-white text-xs">📊</span>
            </span>
            Demand Forecast (Next 7 Days)
          </h3>
          
          <div className="space-y-3">
            {insights.demand_forecast.next_7_days.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-gray-900">{item.product}</div>
                  <div className="text-sm text-gray-600">
                    Confidence: {Math.round(item.confidence * 100)}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{item.predicted_demand}</div>
                  <div className="text-xs text-gray-500">units</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <div className="text-sm text-blue-800">
              <strong>Peak demand day:</strong> {insights.demand_forecast.peak_demand_day}
            </div>
            <div className="text-sm text-blue-800">
              <strong>Trend:</strong> {insights.demand_forecast.trend}
            </div>
          </div>
        </div>

        {/* Customer Insights */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-5 h-5 bg-green-500 rounded mr-2 flex items-center justify-center">
              <span className="text-white text-xs">👥</span>
            </span>
            Customer Insights
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">₦{insights.customer_insights.avg_order_value.toLocaleString()}</div>
                <div className="text-sm text-green-800">Avg Order Value</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{Math.round(insights.customer_insights.repeat_purchase_rate * 100)}%</div>
                <div className="text-sm text-green-800">Repeat Rate</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Customer Segments</div>
              {insights.customer_insights.top_customer_segments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">{segment.segment}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{segment.percentage}%</span>
                    <span className="text-xs text-green-600">{segment.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Performance */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-5 h-5 bg-orange-500 rounded mr-2 flex items-center justify-center">
              <span className="text-white text-xs">📦</span>
            </span>
            Product Performance
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Top Performers</div>
              {insights.product_performance.top_performers.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className={`mr-2 ${getTrendColor(product.trend)}`}>
                      {getTrendIcon(product.trend)}
                    </span>
                    <div>
                      <div className="font-medium text-gray-900">{product.product}</div>
                      <div className="text-xs text-gray-500">{product.sales} sales</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">₦{product.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {insights.product_performance.underperformers.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Needs Attention</div>
                {insights.product_performance.underperformers.map((product, index) => (
                  <div key={index} className="p-2 bg-yellow-50 rounded">
                    <div className="font-medium text-gray-900">{product.product}</div>
                    <div className="text-xs text-yellow-700">{product.suggestion}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-5 h-5 bg-purple-500 rounded mr-2 flex items-center justify-center">
              <span className="text-white text-xs">💭</span>
            </span>
            Customer Sentiment
          </h3>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{insights.sentiment_analysis.overall_rating}</div>
              <div className="text-sm text-gray-600">Overall Rating</div>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    className={star <= Math.round(insights.sentiment_analysis.overall_rating) ? 'text-yellow-400' : 'text-gray-300'}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-green-50 rounded">
                <div className="font-bold text-green-600">{insights.sentiment_analysis.positive_reviews}%</div>
                <div className="text-xs text-green-800">Positive</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-bold text-gray-600">{insights.sentiment_analysis.neutral_reviews}%</div>
                <div className="text-xs text-gray-800">Neutral</div>
              </div>
              <div className="p-2 bg-red-50 rounded">
                <div className="font-bold text-red-600">{insights.sentiment_analysis.negative_reviews}%</div>
                <div className="text-xs text-red-800">Negative</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">What customers love:</div>
              <div className="text-xs text-gray-600">
                {insights.sentiment_analysis.common_positive_themes.join(', ')}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Areas to improve:</div>
              <div className="text-xs text-gray-600">
                {insights.sentiment_analysis.areas_for_improvement.join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-5 h-5 bg-indigo-500 rounded mr-2 flex items-center justify-center">
            <span className="text-white text-xs">🤖</span>
          </span>
          AI Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Inventory Management</h4>
            <ul className="space-y-2">
              {insights.recommendations.inventory.map((rec, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Marketing & Sales</h4>
            <ul className="space-y-2">
              {insights.recommendations.marketing.map((rec, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button 
          onClick={fetchInsights}
          className="text-purple-500 hover:text-purple-600 text-sm font-medium"
        >
          Refresh Insights
        </button>
      </div>
    </div>
  );
};

export default AIInsights;

