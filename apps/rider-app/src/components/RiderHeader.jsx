import { useState } from 'react'
import { Bike, Bell, User, Menu, X, Settings, LogOut, MapPin, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const RiderHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notificationCount] = useState(2) // Mock notification count
  const navigate = useNavigate()

  // Mock rider data
  const riderData = {
    name: 'Yakubu Musa',
    status: 'Online',
    rating: 4.8
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Rider Info */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <Bike className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-orange-600">Home Origin</h1>
                <p className="text-xs text-gray-600">Rider App</p>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-3 pl-4 border-l">
              <div>
                <h2 className="font-medium text-gray-900">{riderData.name}</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">{riderData.status}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400 text-xs">
                      {'★'.repeat(Math.floor(riderData.rating))}
                    </div>
                    <span className="text-xs text-[var(--market-gray)]">({riderData.rating})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                  {notificationCount}
                </Badge>
              )}
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>

            {/* User Profile */}
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
              <User className="w-5 h-5" />
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white py-4">
            <div className="flex flex-col space-y-2">
              <div className="px-4 py-2">
                <h2 className="font-medium text-gray-900">{riderData.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">{riderData.status}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400 text-xs">
                      {'★'.repeat(Math.floor(riderData.rating))}
                    </div>
                    <span className="text-xs text-[var(--market-gray)]">({riderData.rating})</span>
                  </div>
                </div>
              </div>
              <Link to="/orders">
                <Button variant="ghost" className="justify-start w-full">
                  Orders
                </Button>
              </Link>
              <Link to="/earnings">
                <Button variant="ghost" className="justify-start w-full">
                  Earnings
                </Button>
              </Link>
              <Button variant="ghost" className="justify-start w-full">
                <MapPin className="w-4 h-4 mr-2" />
                Go Offline
              </Button>
              <Button variant="ghost" className="justify-start w-full text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default RiderHeader

