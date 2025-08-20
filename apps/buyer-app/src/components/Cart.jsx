import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Plus, Minus, Trash2, MapPin, CreditCard, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const Cart = ({ isOpen, onClose, cartItems = [], onUpdateCart }) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      onUpdateCart(cartItems.filter(item => item.id !== id))
    } else {
      onUpdateCart(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const removeItem = (id) => {
    onUpdateCart(cartItems.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = 500
  const total = subtotal + deliveryFee

  const handleCheckout = async () => {
    setIsProcessingPayment(true)
    try {
      // In a real app, you'd create an order first, then process payment for that order_id
      // For this mock, we'll just send the total amount
      const response = await fetch('https://0vhlizckl8p1.manus.space/api/payment/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          payment_method: 'card', // Mocking card payment
          order_id: 1, // Placeholder order ID
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Payment successful!')
        setCartItems([]) // Clear cart on successful payment
        onClose() // Close cart after checkout
      } else {
        toast.error(data.message || 'Payment failed. Please try again.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('An error occurred during checkout.')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Shopping Cart
            </h2>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
        </div>

        <div className="p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🥗</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-[var(--market-gray)]">{item.vendor}</p>
                          <p className="text-lg font-bold text-[var(--market-green)]">
                            ₦{item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₦{deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-[var(--market-green)]">₦{total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-4 h-4 text-[var(--market-green)]" />
                    <span className="font-medium">Delivery Address</span>
                  </div>
                  <p className="text-sm text-[var(--market-gray)]">
                    BSU Female Hostel A, Room 205<br />
                    Benue State University, Makurdi
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Change Address
                  </Button>
                </CardContent>
              </Card>

              {/* Checkout Button */}
              <Link to="/checkout" onClick={onClose}>
                <Button 
                  className="w-full bg-[var(--market-green)] hover:bg-[var(--market-green)]/90 text-white py-3"
                  size="lg"
                  disabled={cartItems.length === 0}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Button>
              </Link>

              {/* Delivery Info */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  🏍️ <strong>Fast Delivery:</strong> Your order will be delivered by okada within 30-45 minutes
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart

