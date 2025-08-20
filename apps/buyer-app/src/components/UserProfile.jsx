import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, Edit, ShoppingBag, Star, Settings, LogOut } from 'lucide-react'

const UserProfile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Mock logged in state
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('profile') // 'login', 'register', 'profile'
  const [isEditing, setIsEditing] = useState(false)

  // Mock user data
  const [userData, setUserData] = useState({
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
    loyaltyPoints: 450,
    favoriteStores: ['Mama Kemi\'s Store', 'Fresh Mart', 'Benue Grains']
  })

  const LoginForm = () => (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-6">Sign in to your Modern Market account</p>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email or Student ID</label>
            <input
              type="text"
              placeholder="Enter your email or BSU student ID"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

          <button 
            type="button" 
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            onClick={() => setIsLoggedIn(true)}
          >
            Sign In
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className="text-green-600 hover:underline text-sm"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  const RegisterForm = () => (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-2">Join Modern Market</h2>
        <p className="text-center text-gray-600 mb-6">Create your account to start shopping</p>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="+234 800 000 0000"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">BSU Student ID (Optional)</label>
            <input
              type="text"
              placeholder="BSU/FAC/DEPT/YR/NUMBER"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

          <button 
            type="button" 
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            onClick={() => setIsLoggedIn(true)}
          >
            Create Account
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className="text-green-600 hover:underline text-sm"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  const ProfileView = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {userData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{userData.name}</h2>
            <p className="text-gray-600">{userData.email}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">BSU Student</span>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{userData.level}</span>
              <span className="text-sm text-gray-600">
                Member since {userData.joinDate}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{userData.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{userData.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{userData.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Student ID</p>
                <p className="font-medium">{userData.studentId}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">University</p>
                <p className="font-medium">{userData.university}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">{userData.department}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <p className="font-medium">{userData.level}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Order Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <ShoppingBag className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{userData.totalOrders}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-orange-500">{userData.loyaltyPoints}</p>
                <p className="text-sm text-gray-600">Loyalty Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <MapPin className="w-4 h-4" />
                <span>Manage Addresses</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Lock className="w-4 h-4" />
                <span>Change Password</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Account Settings</span>
              </button>
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="w-full flex items-center space-x-3 p-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Stores */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Favorite Stores</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userData.favoriteStores.map((store, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">{store}</p>
                  <p className="text-sm text-gray-600">Favorite Store</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {activeTab === 'login' && <LoginForm />}
          {activeTab === 'register' && <RegisterForm />}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <ProfileView />
      </div>
    </div>
  )
}

export default UserProfile

