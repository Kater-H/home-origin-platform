import React, { useState, useEffect } from 'react';

const AIInsights = ({ userId = 'u1' }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock AI insights data
  const mockInsights = {
    customer_segment: {
      segment_name: "Loyal Customer",
      segment_description: "Regular customer with good value",
      confidence: 0.87
    },
    shopping_patterns: {
      preferred_categories: ["Fresh Produce", "Grains", "Spices"],
      avg_order_value: 2500,
      shopping_frequency: "2-3 times per week",
      peak_shopping_time: "Evening (6-8 PM)"
    },
    recommendations_summary: {
      total_recommendations: 12,
      categories_suggested: 4,
      potential_savings: 450
    },
    demand_forecast: {
      next_purchase_prediction: "2-3 days",
      likely_products: ["Fresh Tomatoes", "Local Rice", "Palm Oil"],
      confidence: 0.78
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [userId]);

  const fetchInsights = async () => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In production, this would be:
      // const response = await fetch(`/api/ai/analytics/user-insights/${userId}`);
      // const data = await response.json();
      // setInsights(data.insights);
      
      setInsights(mockInsights);
    } catch (err) {
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-600 rounded mr-2"></span>
          AI Insights
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-600 rounded mr-2"></span>
          AI Insights
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">📊</div>
          <p className="text-gray-600">No insights available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-600 rounded mr-2 flex items-center justify-center">
            <span className="text-white text-xs">📊</span>
          </span>
          AI Insights
        </h3>
        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
          Personalized
        </span>
      </div>

      <div className="space-y-6">
        {/* Customer Segment */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
            Customer Profile
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">{insights.customer_segment.segment_name}</p>
              <p className="text-xs text-blue-700">{insights.customer_segment.segment_description}</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-blue-600">Confidence</div>
              <div className="text-sm font-semibold text-blue-900">
                {Math.round(insights.customer_segment.confidence * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Shopping Patterns */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
            Shopping Patterns
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-green-600 mb-1">Preferred Categories</div>
              <div className="text-green-900">
                {insights.shopping_patterns.preferred_categories.slice(0, 2).join(', ')}
                {insights.shopping_patterns.preferred_categories.length > 2 && '...'}
              </div>
            </div>
            <div>
              <div className="text-xs text-green-600 mb-1">Avg Order Value</div>
              <div className="text-green-900 font-medium">₦{insights.shopping_patterns.avg_order_value.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-green-600 mb-1">Frequency</div>
              <div className="text-green-900">{insights.shopping_patterns.shopping_frequency}</div>
            </div>
            <div>
              <div className="text-xs text-green-600 mb-1">Peak Time</div>
              <div className="text-green-900">{insights.shopping_patterns.peak_shopping_time}</div>
            </div>
          </div>
        </div>

        {/* Recommendations Summary */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <span className="w-4 h-4 bg-orange-500 rounded-full mr-2"></span>
            Recommendations Impact
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-orange-900">{insights.recommendations_summary.total_recommendations}</div>
              <div className="text-xs text-orange-600">Total Suggestions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-900">{insights.recommendations_summary.categories_suggested}</div>
              <div className="text-xs text-orange-600">Categories</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-900">₦{insights.recommendations_summary.potential_savings}</div>
              <div className="text-xs text-orange-600">Potential Savings</div>
            </div>
          </div>
        </div>

        {/* Demand Forecast */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <span className="w-4 h-4 bg-purple-500 rounded-full mr-2"></span>
            Next Purchase Prediction
          </h4>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-purple-900">Expected in {insights.demand_forecast.next_purchase_prediction}</p>
              <p className="text-xs text-purple-700">
                Likely products: {insights.demand_forecast.likely_products.slice(0, 2).join(', ')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-purple-600">Accuracy</div>
              <div className="text-sm font-semibold text-purple-900">
                {Math.round(insights.demand_forecast.confidence * 100)}%
              </div>
            </div>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${insights.demand_forecast.confidence * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
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

