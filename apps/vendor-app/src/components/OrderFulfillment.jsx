import { useState } from 'react'
import { Clock, CheckCircle, Package, Truck, User, MapPin, Phone, MessageCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const OrderFulfillment = () => {
  const [selectedTab, setSelectedTab] = useState('pending')

  // Mock orders data with multi-vendor support
  const orders = [
    {
      id: '#ORD-2025-001',
      customer: {
        name: 'Adaeze Okwu',
        phone: '+234 803 456 7890',
        address: 'BSU Female Hostel A, Room 205'
      },
      items: [
        { name: 'Fresh Tomatoes', quantity: 1, unit: 'kg', price: 1200 },
        { name: 'Red Onions', quantity: 1, unit: '500g', price: 800 }
      ],
      total: 2000,
      status: 'pending',
      orderTime: '2025-01-29 10:30 AM',
      isMultiVendor: true,
      otherVendors: ['Benue Grains', 'Fresh Poultry Hub'],
      totalOrderValue: 7500,
      rider: null,
      estimatedPickup: '11:15 AM'
    },
    {
      id: '#ORD-2025-002',
      customer: {
        name: 'Ibrahim Sule',
        phone: '+234 801 234 5678',
        address: 'BSU Male Hostel B, Room 108'
      },
      items: [
        { name: 'Palm Oil', quantity: 1, unit: '1L bottle', price: 2500 }
      ],
      total: 2500,
      status: 'preparing',
      orderTime: '2025-01-29 10:15 AM',
      isMultiVendor: false,
      otherVendors: [],
      totalOrderValue: 2500,
      rider: null,
      estimatedPickup: '11:00 AM'
    },
    {
      id: '#ORD-2025-003',
      customer: {
        name: 'Grace Oche',
        phone: '+234 805 987 6543',
        address: 'Modern Market Area, Shop 15'
      },
      items: [
        { name: 'Local Rice', quantity: 1, unit: '2kg bag', price: 3500 }
      ],
      total: 3500,
      status: 'ready',
      orderTime: '2025-01-29 09:45 AM',
      isMultiVendor: true,
      otherVendors: ['Spice Corner'],
      totalOrderValue: 4300,
      rider: {
        name: 'Yakubu Musa',
        phone: '+234 802 111 2222',
        vehicle: 'Honda CB125 - ABC 123 KD'
      },
      estimatedPickup: '10:30 AM'
    }
  ]

  const tabs = [
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { id: 'preparing', label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
    { id: 'ready', label: 'Ready', count: orders.filter(o => o.status === 'ready').length },
    { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length }
  ]

  const filteredOrders = orders.filter(order => order.status === selectedTab)

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'preparing': return 'bg-blue-100 text-blue-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'preparing': return <Package className="w-4 h-4" />
      case 'ready': return <CheckCircle className="w-4 h-4" />
      case 'completed': return <Truck className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const handleStatusUpdate = (orderId, newStatus) => {
    // Mock status update
    console.log(`Updating order ${orderId} to ${newStatus}`)
  }

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending': return 'preparing'
      case 'preparing': return 'ready'
      case 'ready': return 'completed'
      default: return currentStatus
    }
  }

  const getActionLabel = (status) => {
    switch (status) {
      case 'pending': return 'Accept Order'
      case 'preparing': return 'Mark Ready'
      case 'ready': return 'Confirm Pickup'
      default: return 'View'
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Fulfillment</h1>
        <p className="text-[var(--market-gray)]">Manage incoming orders and track fulfillment status</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.id
                  ? 'border-[var(--market-green)] text-[var(--market-green)]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <Badge className="ml-2 bg-[var(--market-orange)] text-white">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No {selectedTab} orders</h3>
              <p className="text-[var(--market-gray)]">
                {selectedTab === 'pending' 
                  ? 'New orders will appear here when customers place them'
                  : `No orders in ${selectedTab} status at the moment`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium">{order.id}</h3>
                      {order.isMultiVendor && (
                        <Badge variant="outline" className="text-xs">
                          Multi-vendor Order
                        </Badge>
                      )}
                    </div>
                    <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--market-gray)]">{order.orderTime}</p>
                    <p className="text-xs text-[var(--market-gray)]">
                      Pickup by: {order.estimatedPickup}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Customer Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-[var(--market-gray)] flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {order.customer.phone}
                      </p>
                      <p className="text-[var(--market-gray)] flex items-start">
                        <MapPin className="w-3 h-3 mr-1 mt-0.5" />
                        {order.customer.address}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Your Items
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.quantity} {item.unit} {item.name}</span>
                          <span className="font-medium">₦{item.price.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between font-medium">
                        <span>Your Total</span>
                        <span className="text-[var(--market-green)]">₦{order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary & Actions */}
                  <div>
                    <h4 className="font-medium mb-3">Order Summary</h4>
                    <div className="space-y-3">
                      {order.isMultiVendor && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800 mb-1">
                            <AlertCircle className="w-4 h-4 inline mr-1" />
                            Multi-vendor order
                          </p>
                          <p className="text-xs text-blue-600">
                            Also includes items from: {order.otherVendors.join(', ')}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Total order value: ₦{order.totalOrderValue.toLocaleString()}
                          </p>
                        </div>
                      )}

                      {order.rider && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-800">Assigned Rider</p>
                          <p className="text-sm text-green-700">{order.rider.name}</p>
                          <p className="text-xs text-green-600">{order.rider.vehicle}</p>
                          <div className="flex space-x-2 mt-2">
                            <Button size="sm" variant="outline" className="text-green-700 border-green-300">
                              <Phone className="w-3 h-3 mr-1" />
                              Call
                            </Button>
                            <Button size="sm" variant="outline" className="text-green-700 border-green-300">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Chat
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {order.status !== 'completed' && (
                          <Button 
                            onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status))}
                            className="flex-1 bg-[var(--market-green)] hover:bg-[var(--market-green)]/90"
                          >
                            {getActionLabel(order.status)}
                          </Button>
                        )}
                        
                        {order.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            Decline
                          </Button>
                        )}
                      </div>

                      {order.status === 'ready' && !order.rider && (
                        <div className="p-2 bg-yellow-50 rounded-lg">
                          <p className="text-xs text-yellow-800">
                            Waiting for rider assignment...
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default OrderFulfillment

