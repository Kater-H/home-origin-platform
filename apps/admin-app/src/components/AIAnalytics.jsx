import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';

const AIAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(false);

  // Mock AI analytics data
  const mockAnalytics = {
    recommendation_engine: {
      status: 'trained',
      total_products: 8,
      total_users: 4,
      accuracy: 0.85,
      last_trained: '2024-07-30T18:30:00Z'
    },
    demand_forecaster: {
      status: 'trained',
      model_type: 'RandomForestRegressor',
      accuracy: 0.78,
      predictions_made: 156,
      last_trained: '2024-07-30T18:30:00Z'
    },
    customer_segmentation: {
      status: 'trained',
      n_clusters: 4,
      total_customers: 100,
      segments: {
        'Champions': 25,
        'Loyal Customers': 35,
        'Potential Loyalists': 30,
        'At Risk': 10
      },
      last_trained: '2024-07-30T18:30:00Z'
    },
    sentiment_analyzer: {
      status: 'available',
      type: 'rule_based',
      reviews_analyzed: 89,
      sentiment_distribution: {
        positive: 65,
        neutral: 20,
        negative: 15
      }
    },
    performance_metrics: {
      api_calls_today: 234,
      avg_response_time: 145,
      success_rate: 0.98,
      recommendations_clicked: 67
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would be:
      // const response = await fetch('/api/ai/analytics/summary');
      // const data = await response.json();
      // setAnalytics(data.summary);
      
      setAnalytics(mockAnalytics);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetrainModels = async () => {
    setTraining(true);
    
    try {
      // Simulate training delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In production, this would be:
      // const response = await fetch('/api/ai/models/retrain_all', { method: 'POST' });
      // const data = await response.json();
      
      // Refresh analytics after training
      await fetchAnalytics();
    } catch (err) {
      console.error('Error retraining models:', err);
    } finally {
      setTraining(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'trained': 'bg-green-100 text-green-800',
      'available': 'bg-blue-100 text-blue-800',
      'not_trained': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">AI Analytics Dashboard</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">AI Analytics Dashboard</h2>
        <p className="text-gray-600 mb-4">Failed to load analytics data</p>
        <Button onClick={fetchAnalytics}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Analytics Dashboard</h2>
        <div className="flex gap-2">
          <Button onClick={fetchAnalytics} variant="outline">
            Refresh Data
          </Button>
          <Button 
            onClick={handleRetrainModels} 
            disabled={training}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {training ? 'Training...' : 'Retrain All Models'}
          </Button>
        </div>
      </div>

      {training && (
        <Alert>
          <AlertDescription>
            AI models are being retrained. This may take a few minutes...
          </AlertDescription>
        </Alert>
      )}

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{analytics.performance_metrics.api_calls_today}</div>
            <div className="text-sm text-gray-600">API Calls Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{analytics.performance_metrics.avg_response_time}ms</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{Math.round(analytics.performance_metrics.success_rate * 100)}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{analytics.performance_metrics.recommendations_clicked}</div>
            <div className="text-sm text-gray-600">Recommendations Clicked</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Models Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommendation Engine */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recommendation Engine
              {getStatusBadge(analytics.recommendation_engine.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Products</span>
                <span className="font-medium">{analytics.recommendation_engine.total_products}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Users</span>
                <span className="font-medium">{analytics.recommendation_engine.total_users}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Accuracy</span>
                <span className="font-medium">{Math.round(analytics.recommendation_engine.accuracy * 100)}%</span>
              </div>
              <Progress value={analytics.recommendation_engine.accuracy * 100} className="h-2" />
              <div className="text-xs text-gray-500">
                Last trained: {formatDate(analytics.recommendation_engine.last_trained)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demand Forecaster */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Demand Forecaster
              {getStatusBadge(analytics.demand_forecaster.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Model Type</span>
                <span className="font-medium text-xs">{analytics.demand_forecaster.model_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Predictions Made</span>
                <span className="font-medium">{analytics.demand_forecaster.predictions_made}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Accuracy</span>
                <span className="font-medium">{Math.round(analytics.demand_forecaster.accuracy * 100)}%</span>
              </div>
              <Progress value={analytics.demand_forecaster.accuracy * 100} className="h-2" />
              <div className="text-xs text-gray-500">
                Last trained: {formatDate(analytics.demand_forecaster.last_trained)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Segmentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Customer Segmentation
              {getStatusBadge(analytics.customer_segmentation.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Customers</span>
                <span className="font-medium">{analytics.customer_segmentation.total_customers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Clusters</span>
                <span className="font-medium">{analytics.customer_segmentation.n_clusters}</span>
              </div>
              <div className="space-y-2">
                {Object.entries(analytics.customer_segmentation.segments).map(([segment, count]) => (
                  <div key={segment} className="flex justify-between text-sm">
                    <span className="text-gray-600">{segment}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500">
                Last trained: {formatDate(analytics.customer_segmentation.last_trained)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Analyzer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Sentiment Analyzer
              {getStatusBadge(analytics.sentiment_analyzer.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <span className="font-medium text-xs">{analytics.sentiment_analyzer.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Reviews Analyzed</span>
                <span className="font-medium">{analytics.sentiment_analyzer.reviews_analyzed}</span>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Sentiment Distribution</div>
                {Object.entries(analytics.sentiment_analyzer.sentiment_distribution).map(([sentiment, count]) => (
                  <div key={sentiment} className="flex justify-between text-sm">
                    <span className="text-gray-600 capitalize">{sentiment}</span>
                    <span className="font-medium">{count}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAnalytics;

