import { useState } from 'react'
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const UserAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Mock logged in state
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('profile') // 'login', 'register', 'profile'

  // Mock user data
  const userData = {
    name: 'Adaeze Okwu',
    email: 'adaeze.okwu@bsu.edu.ng',
    phone: '+234 803 456 7890',
    studentId: 'BSU/SCI/CSC/19/1234',
    address: 'BSU Female Hostel A, Room 205',
    university: 'Benue State University',
    department: 'Computer Science',
    level: '400 Level',
    joinDate: 'January 2024',
    totalOrders: 23,
    loyaltyPoints: 450
  }

  const LoginForm = () => (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Welcome Back</CardTitle>
        <p className="text-center text-[var(--market-gray)]">Sign in to your Modern Market account</p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email or Student ID</label>
            <input
              type="text"
              placeholder="Enter your email or BSU student ID"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--market-green)] focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--market-green)] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[var(--market-green)] hover:bg-[var(--market-green)]/90"
            onClick={() => setIsLoggedIn(true)}
          >
            Sign In
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className="text-[var(--market-green)] hover:underline text-sm"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )

  const RegisterForm = () => (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Join Modern Market</CardTitle>
        <p className="text-center text-[var(--market-gray)]">Create your account to start shopping</p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--market-green)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--market-green)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="+234 800 000 0000"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--market-green)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">BSU Student ID (Optional)</label>
            <input
              type="text"
              placeholder="BSU/FAC/DEPT/YR/NUMBER"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--market-green)] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--market-green)] focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[var(--market-green)] hover:bg-[var(--market-green)]/90"
          >
            Create Account
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className="text-[var(--market-green)] hover:underline text-sm"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )

  const UserProfile = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-[var(--market-green)] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{userData.name}</h2>
              <p className="text-[var(--market-gray)]">{userData.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className="bg-[var(--market-blue)] text-white">BSU Student</Badge>
                <Badge variant="outline">{userData.level}</Badge>
                <span className="text-sm text-[var(--market-gray)]">
                  Member since {userData.joinDate}
                </span>
              </div>
            </div>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-[var(--market-gray)]" />
              <div>
                <p className="text-sm text-[var(--market-gray)]">Full Name</p>
                <p className="font-medium">{userData.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-[var(--market-gray)]" />
              <div>
                <p className="text-sm text-[var(--market-gray)]">Email</p>
                <p className="font-medium">{userData.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-[var(--market-gray)]" />
              <div>
                <p className="text-sm text-[var(--market-gray)]">Phone</p>
                <p className="font-medium">{userData.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-[var(--market-gray)]" />
              <div>
                <p className="text-sm text-[var(--market-gray)]">Address</p>
                <p className="font-medium">{userData.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-[var(--market-gray)]">Student ID</p>
              <p className="font-medium">{userData.studentId}</p>
            </div>
            
            <div>
              <p className="text-sm text-[var(--market-gray)]">University</p>
              <p className="font-medium">{userData.university}</p>
            </div>
            
            <div>
              <p className="text-sm text-[var(--market-gray)]">Department</p>
              <p className="font-medium">{userData.department}</p>
            </div>
            
            <div>
              <p className="text-sm text-[var(--market-gray)]">Level</p>
              <p className="font-medium">{userData.level}</p>
            </div>
          </CardContent>
        </Card>

        {/* Order Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Order Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--market-green)]">{userData.totalOrders}</p>
                <p className="text-sm text-[var(--market-gray)]">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--market-orange)]">{userData.loyaltyPoints}</p>
                <p className="text-sm text-[var(--market-gray)]">Loyalty Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <MapPin className="w-4 h-4 mr-2" />
              Manage Addresses
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        {activeTab === 'login' && <LoginForm />}
        {activeTab === 'register' && <RegisterForm />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <UserProfile />
      </div>
    </div>
  )
}

export default UserAuth

