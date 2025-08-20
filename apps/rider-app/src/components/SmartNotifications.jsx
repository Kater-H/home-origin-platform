import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  Clock, 
  DollarSign,
  Zap,
  X,
  CheckCircle,
  Info,
  Star
} from 'lucide-react'

const SmartNotifications = ({ riderId, riderLocation, onNotificationAction }) => {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Mock smart notifications generation
  const generateSmartNotifications = async () => {
    setIsLoading(true)
    
    try {
      // In production, this would fetch from AI backend
      const mockNotifications = [
        {
          id: 'notif_001',
          type: 'opportunity',
          priority: 'high',
          title: 'High Demand Alert',
          message: 'Modern Market area has 85% higher demand than usual. Move there for better earnings!',
          icon: TrendingUp,
          color: 'green',
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          actionable: true,
          actions: [
            { label: 'Navigate There', action: 'navigate', data: { destination: 'Modern Market' } },
            { label: 'Dismiss', action: 'dismiss' }
          ],
          metadata: {
            estimated_earnings: '₦1,200-1,800/hour',
            distance: '0.8 km',
            confidence: 92
          }
        },
        {
          id: 'notif_002',
          type: 'performance',
          priority: 'medium',
          title: 'Rating Boost Opportunity',
          message: 'Your last 3 deliveries were faster than average. Keep it up to improve your rating!',
          icon: Star,
          color: 'blue',
          timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          actionable: false,
          metadata: {
            current_streak: 3,
            potential_rating_boost: '+0.1'
          }
        },
        {
          id: 'notif_003',
          type: 'route',
          priority: 'medium',
          title: 'Traffic Alert',
          message: 'Heavy traffic detected on your usual route to BSU Campus. Alternative route available.',
          icon: AlertTriangle,
          color: 'orange',
          timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
          actionable: true,
          actions: [
            { label: 'View Alternative', action: 'route', data: { route_id: 'alt_001' } },
            { label: 'Ignore', action: 'dismiss' }
          ],
          metadata: {
            time_saved: '5-8 minutes',
            traffic_level: 'heavy'
          }
        },
        {
          id: 'notif_004',
          type: 'earnings',
          priority: 'low',
          title: 'Daily Goal Progress',
          message: 'You\'re 75% towards your daily earnings goal of ₦12,000. 3 more deliveries should do it!',
          icon: DollarSign,
          color: 'purple',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          actionable: false,
          metadata: {
            current_earnings: 9000,
            goal: 12000,
            progress: 75,
            deliveries_needed: 3
          }
        },
        {
          id: 'notif_005',
          type: 'maintenance',
          priority: 'low',
          title: 'Vehicle Check Reminder',
          message: 'Based on your mileage, consider checking your bike\'s tire pressure for optimal performance.',
          icon: Info,
          color: 'gray',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          actionable: true,
          actions: [
            { label: 'Mark as Done', action: 'complete' },
            { label: 'Remind Later', action: 'snooze' }
          ],
          metadata: {
            last_check: '3 days ago',
            mileage_since: '180 km'
          }
        }
      ]
      
      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter(n => !n.read).length)
    } catch (error) {
      console.error('Failed to generate notifications:', error)
    }
    
    setIsLoading(false)
  }

  useEffect(() => {
    generateSmartNotifications()
    
    // Set up periodic refresh (every 2 minutes)
    const interval = setInterval(generateSmartNotifications, 2 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [riderId, riderLocation])

  const handleNotificationAction = (notificationId, action, data = null) => {
    if (action === 'dismiss') {
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } else if (action === 'navigate') {
      // Open navigation to destination
      const destination = data?.destination || 'Modern Market'
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`
      window.open(googleMapsUrl, '_blank')
      
      // Mark as read
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ))
    } else if (action === 'route') {
      // Show alternative route (mock action)
      alert('Alternative route displayed in navigation app')
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
    } else if (action === 'complete' || action === 'snooze') {
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
    }
    
    if (onNotificationAction) {
      onNotificationAction(notificationId, action, data)
    }
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const getNotificationColor = (color) => {
    const colors = {
      green: 'border-green-200 bg-green-50',
      blue: 'border-blue-200 bg-blue-50',
      orange: 'border-orange-200 bg-orange-50',
      purple: 'border-purple-200 bg-purple-50',
      gray: 'border-gray-200 bg-gray-50',
      red: 'border-red-200 bg-red-50'
    }
    return colors[color] || colors.gray
  }

  const getIconColor = (color) => {
    const colors = {
      green: 'text-green-600',
      blue: 'text-blue-600',
      orange: 'text-orange-600',
      purple: 'text-purple-600',
      gray: 'text-gray-600',
      red: 'text-red-600'
    }
    return colors[color] || colors.gray
  }

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return styles[priority] || styles.low
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return timestamp.toLocaleDateString()
  }

  return (
    <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-indigo-800">
          <div className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Smart Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark All Read
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
            <p className="text-indigo-600">Loading smart notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-6">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No notifications at the moment</p>
            <p className="text-sm text-gray-400">We'll notify you of opportunities and important updates</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification) => {
              const IconComponent = notification.icon
              return (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 ${getNotificationColor(notification.color)} ${
                    !notification.read ? 'border-l-4 border-l-indigo-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-white ${getIconColor(notification.color)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityBadge(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleNotificationAction(notification.id, 'dismiss')}
                            className="p-1 h-auto"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">
                        {notification.message}
                      </p>
                      
                      {/* Metadata */}
                      {notification.metadata && (
                        <div className="text-xs text-gray-600 mb-2 space-y-1">
                          {notification.metadata.estimated_earnings && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-3 h-3" />
                              <span>Potential: {notification.metadata.estimated_earnings}</span>
                            </div>
                          )}
                          {notification.metadata.distance && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>Distance: {notification.metadata.distance}</span>
                            </div>
                          )}
                          {notification.metadata.time_saved && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Time saved: {notification.metadata.time_saved}</span>
                            </div>
                          )}
                          {notification.metadata.progress !== undefined && (
                            <div className="flex items-center space-x-1">
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-purple-600 h-1.5 rounded-full" 
                                  style={{ width: `${notification.metadata.progress}%` }}
                                ></div>
                              </div>
                              <span>{notification.metadata.progress}%</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Actions */}
                      {notification.actionable && notification.actions && (
                        <div className="flex space-x-2 mb-2">
                          {notification.actions.map((action, index) => (
                            <Button
                              key={index}
                              variant={action.action === 'dismiss' ? 'outline' : 'default'}
                              size="sm"
                              onClick={() => handleNotificationAction(
                                notification.id, 
                                action.action, 
                                action.data
                              )}
                              className={`text-xs ${
                                action.action === 'dismiss' 
                                  ? '' 
                                  : `bg-${notification.color}-600 hover:bg-${notification.color}-700`
                              }`}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatTimeAgo(notification.timestamp)}</span>
                        {notification.metadata?.confidence && (
                          <span>Confidence: {notification.metadata.confidence}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {/* Refresh Button */}
        <div className="mt-4">
          <Button 
            onClick={generateSmartNotifications}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            disabled={isLoading}
          >
            <Zap className="w-4 h-4 mr-2" />
            Refresh Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default SmartNotifications

