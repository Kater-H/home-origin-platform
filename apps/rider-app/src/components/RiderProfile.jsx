import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Star, 
  Award, 
  Settings, 
  Edit,
  Phone,
  Mail,
  MapPin,
  Bike,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  Shield,
  Camera,
  Bell,
  Eye,
  EyeOff
} from 'lucide-react'

const RiderProfile = ({ riderId, onProfileUpdate }) => {
  const [riderData, setRiderData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    orderAlerts: true,
    performanceUpdates: true,
    earningsReports: true,
    maintenanceReminders: true
  })

  // Mock rider data
  useEffect(() => {
    const mockRiderData = {
      id: 'rider_123',
      name: 'Yakubu Musa',
      email: 'yakubu.musa@modernmarket.com',
      phone: '+234 803 123 4567',
      profileImage: '/api/placeholder/100/100',
      rating: 4.8,
      totalDeliveries: 1247,
      totalEarnings: 485000,
      joinDate: '2023-03-15',
      status: 'active',
      verificationStatus: 'verified',
      
      // Performance metrics
      performance: {
        onTimeDeliveryRate: 94,
        customerSatisfaction: 4.8,
        averageDeliveryTime: 18,
        completionRate: 98,
        responseTime: 2.3
      },
      
      // Vehicle information
      vehicle: {
        type: 'motorcycle',
        brand: 'Honda',
        model: 'CB150R',
        plateNumber: 'ABC-123-XY',
        registrationExpiry: '2025-12-31',
        insuranceExpiry: '2025-08-15'
      },
      
      // Documents
      documents: {
        driversLicense: { status: 'verified', expiry: '2027-03-20' },
        vehicleRegistration: { status: 'verified', expiry: '2025-12-31' },
        insurance: { status: 'verified', expiry: '2025-08-15' },
        backgroundCheck: { status: 'verified', date: '2023-03-10' }
      },
      
      // Achievements
      achievements: [
        { id: 'speed_demon', name: 'Speed Demon', description: '100+ fast deliveries', earned: true },
        { id: 'customer_favorite', name: 'Customer Favorite', description: '4.8+ rating for 6 months', earned: true },
        { id: 'reliability_champion', name: 'Reliability Champion', description: '95%+ on-time rate', earned: false },
        { id: 'milestone_1000', name: '1000 Deliveries', description: 'Completed 1000 deliveries', earned: true }
      ],
      
      // Recent activity
      recentActivity: [
        { date: '2025-07-31', type: 'delivery', description: 'Completed 8 deliveries', earnings: 8500 },
        { date: '2025-07-30', type: 'achievement', description: 'Earned "Customer Favorite" badge' },
        { date: '2025-07-29', type: 'performance', description: 'Rating improved to 4.8' },
        { date: '2025-07-28', type: 'delivery', description: 'Completed 12 deliveries', earnings: 11200 }
      ]
    }
    
    setRiderData(mockRiderData)
    setEditForm(mockRiderData)
  }, [riderId])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    if (!isEditing) {
      setEditForm({ ...riderData })
    }
  }

  const handleSaveProfile = () => {
    setRiderData({ ...editForm })
    setIsEditing(false)
    
    if (onProfileUpdate) {
      onProfileUpdate(editForm)
    }
    
    alert('Profile updated successfully!')
  }

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const uploadProfileImage = () => {
    // In a real app, this would open file picker
    alert('Profile image upload would be implemented here')
  }

  const getVerificationBadge = (status) => {
    const badges = {
      verified: { color: 'bg-green-100 text-green-800', icon: Shield, text: 'Verified' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
      expired: { color: 'bg-red-100 text-red-800', icon: Clock, text: 'Expired' }
    }
    return badges[status] || badges.pending
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!riderData) {
    return (
      <div className="text-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <p className="text-blue-600">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {riderData.profileImage ? (
                  <img 
                    src={riderData.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full p-2"
                onClick={uploadProfileImage}
              >
                <Camera className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-2xl font-bold border rounded px-2 py-1"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">{riderData.name}</h1>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getVerificationBadge(riderData.verificationStatus).color}>
                      <Shield className="w-3 h-3 mr-1" />
                      {getVerificationBadge(riderData.verificationStatus).text}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      Rider ID: {riderData.id}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={isEditing ? handleSaveProfile : handleEditToggle}
                >
                  {isEditing ? (
                    <>
                      <Settings className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
              
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="border rounded px-2 py-1 text-sm flex-1"
                    />
                  ) : (
                    <span className="text-sm text-gray-600">{riderData.email}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="border rounded px-2 py-1 text-sm flex-1"
                    />
                  ) : (
                    <span className="text-sm text-gray-600">
                      {showSensitiveInfo ? riderData.phone : '***-***-4567'}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                  >
                    {showSensitiveInfo ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
              
              {/* Performance Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-lg">{riderData.rating}</span>
                  </div>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Package className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-lg">{riderData.totalDeliveries.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-600">Deliveries</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="font-bold text-lg">{formatCurrency(riderData.totalEarnings)}</span>
                  </div>
                  <p className="text-xs text-gray-600">Total Earnings</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span className="font-bold text-lg">{Math.floor((new Date() - new Date(riderData.joinDate)) / (1000 * 60 * 60 * 24 * 30))}</span>
                  </div>
                  <p className="text-xs text-gray-600">Months Active</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(riderData.performance).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium capitalize mb-2">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="text-2xl font-bold text-blue-600">
                  {typeof value === 'number' && key.includes('Rate') ? `${value}%` : 
                   typeof value === 'number' && key.includes('Time') ? `${value} mins` :
                   value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bike className="w-5 h-5 mr-2" />
            Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Vehicle Type</label>
                <p className="capitalize">{riderData.vehicle.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Brand & Model</label>
                <p>{riderData.vehicle.brand} {riderData.vehicle.model}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Plate Number</label>
                <p className="font-mono">{riderData.vehicle.plateNumber}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Registration Expiry</label>
                <p>{formatDate(riderData.vehicle.registrationExpiry)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Insurance Expiry</label>
                <p>{formatDate(riderData.vehicle.insuranceExpiry)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Document Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(riderData.documents).map(([key, doc]) => {
              const badge = getVerificationBadge(doc.status)
              return (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    {doc.expiry && (
                      <p className="text-sm text-gray-600">Expires: {formatDate(doc.expiry)}</p>
                    )}
                    {doc.date && (
                      <p className="text-sm text-gray-600">Completed: {formatDate(doc.date)}</p>
                    )}
                  </div>
                  <Badge className={badge.color}>
                    <badge.icon className="w-3 h-3 mr-1" />
                    {badge.text}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riderData.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.earned 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    achievement.earned ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Award className={`w-5 h-5 ${
                      achievement.earned ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className={`font-medium ${
                      achievement.earned ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(notificationSettings).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {key === 'orderAlerts' && 'Get notified about new orders and delivery updates'}
                    {key === 'performanceUpdates' && 'Receive insights about your performance metrics'}
                    {key === 'earningsReports' && 'Get daily and weekly earnings summaries'}
                    {key === 'maintenanceReminders' && 'Receive vehicle maintenance reminders'}
                  </p>
                </div>
                <Button
                  variant={enabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleNotificationChange(key)}
                >
                  {enabled ? 'On' : 'Off'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RiderProfile

