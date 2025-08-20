import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  ShoppingCart, 
  Bike,
  Truck,
  BarChart3,
  Settings,
  ChevronLeft,
  Image,
  Palette,
  Package,
  Folder,
  Brain,
  Sliders
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
      description: 'Overview & Analytics'
    },
    {
      title: 'Users',
      icon: Users,
      path: '/users',
      description: 'Manage Customers'
    },
    {
      title: 'Vendors',
      icon: Store,
      path: '/vendors',
      description: 'Vendor Management'
    },
    {
      title: 'Products',
      icon: Package,
      path: '/products',
      description: 'Product Catalog'
    },
    {
      title: 'Categories',
      icon: Folder,
      path: '/categories',
      description: 'Category Management'
    },
    {
      title: 'Orders',
      icon: ShoppingCart,
      path: '/orders',
      description: 'Order Monitoring'
    },
    {
      title: 'Riders',
      icon: Bike,
      path: '/riders',
      description: 'Rider Management'
    },
    {
      title: 'Delivery',
      icon: Truck,
      path: '/delivery',
      description: 'Delivery Management'
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      description: 'Reports & Insights'
    },
    {
      title: 'AI Analytics',
      icon: BarChart3,
      path: '/ai-analytics',
      description: 'AI/ML Performance'
    },
    {
      title: 'AI Dashboard',
      icon: Brain,
      path: '/ai-dashboard',
      description: 'Advanced AI Insights'
    },
    {
      title: 'Admin Controls',
      icon: Sliders,
      path: '/admin-controls',
      description: 'System & Performance Controls'
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings',
      description: 'Banners, Themes & Config'
    }
  ]

  return (
    <aside className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {isOpen && (
              <h2 className="text-lg font-semibold text-gray-900">
                Admin Panel
              </h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-1"
            >
              <ChevronLeft className={cn(
                "h-4 w-4 transition-transform",
                !isOpen && "rotate-180"
              )} />
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group",
                  isActive 
                    ? "bg-green-100 text-green-700 border border-green-200" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-green-600" : "text-gray-500 group-hover:text-gray-700"
                )} />
                
                {isOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {item.description}
                    </p>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          {isOpen ? (
            <div className="bg-green-50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-green-800">
                System Status
              </h3>
              <p className="text-xs text-green-600 mt-1">
                All systems operational
              </p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-green-700">Online</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar

