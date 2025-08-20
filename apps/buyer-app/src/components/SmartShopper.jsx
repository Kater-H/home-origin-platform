import { useState } from 'react'
import { Search, Sparkles, ShoppingCart, Plus, Zap, TrendingUp, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const SmartShopper = () => {
  const [shoppingList, setShoppingList] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  // Mock AI processing function
  const processShoppingList = async () => {
    setIsProcessing(true)
    setSuggestions([])

    try {
      const response = await fetch("https://0vhlizckl8p1.manus.space/api/ai/smart-shopper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: shoppingList }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setSuggestions(data.products.map(p => ({
        id: p.name.replace(/\s+/g, ".").toLowerCase(),
        product: p.name,
        quantity: p.unit ? `(${p.unit})` : "",
        price: p.price,
        vendor: p.vendor,
        rating: p.rating || 4.0,
        quality: p.quality || "Good"
      })))

    } catch (error) {
      console.error("Error fetching smart shopper suggestions:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (shoppingList.trim()) {
      processShoppingList()
    }
  }

  const addToCart = (item) => {
    console.log('Added to cart:', item)
  }

  const quickExamples = [
    { text: "Pepper soup ingredients for 6", icon: "🍲", category: "Cooking" },
    { text: "Fresh vegetables for a week", icon: "🥬", category: "Groceries" },
    { text: "Breakfast essentials", icon: "🍳", category: "Daily" },
    { text: "Birthday party supplies", icon: "🎂", category: "Events" }
  ]

  const aiFeatures = [
    { icon: Zap, title: "Instant Results", desc: "AI finds products in seconds" },
    { icon: TrendingUp, title: "Best Prices", desc: "Compare across vendors" },
    { icon: Clock, title: "Save Time", desc: "No manual searching needed" }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Compact Header with Side-by-Side Layout */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Main Smart Shopper Section */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Smart Shopper</h2>
                <p className="text-gray-600 text-sm">
                  Tell us what you need in plain English, and our AI finds the best products and prices
                </p>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <textarea
                  value={shoppingList}
                  onChange={(e) => setShoppingList(e.target.value)}
                  placeholder="e.g., I need ingredients for jollof rice for 4 people, some fresh vegetables, and chicken"
                  className="w-full p-4 pr-32 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none h-24 text-sm"
                  disabled={isProcessing}
                />
                <Button
                  type="submit"
                  disabled={!shoppingList.trim() || isProcessing}
                  className="absolute bottom-3 right-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Finding...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4" />
                      <span>Find Products</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* AI Features Sidebar */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Use Smart Shopper?</h3>
          {aiFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <feature.icon className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{feature.title}</h4>
                  <p className="text-xs text-gray-600">{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Examples - Compact Grid */}
      {suggestions.length === 0 && !isProcessing && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-3">Quick Start Examples:</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickExamples.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 text-left justify-start hover:bg-green-50 hover:border-green-200 transition-colors"
                onClick={() => setShoppingList(example.text)}
              >
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{example.icon}</span>
                    <Badge variant="secondary" className="text-xs">{example.category}</Badge>
                  </div>
                  <p className="text-xs text-gray-700 font-medium">{example.text}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggestions - Improved Layout */}
      {suggestions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-gray-900">AI Recommendations</h3>
              <Badge className="bg-green-100 text-green-800 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Optimized
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              {suggestions.length} items found
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {suggestions.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-gray-100">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base font-semibold text-gray-900 leading-tight">{item.product}</CardTitle>
                      <p className="text-xs text-gray-500 mt-1">{item.quantity}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      {item.quality}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Vendor</p>
                      <p className="text-sm font-medium text-gray-900">{item.vendor}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">{item.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        <p className="text-lg font-bold text-green-600">
                          ₦{item.price.toLocaleString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addToCart(item)}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Card - Compact */}
          <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Total Estimated Cost</p>
                <p className="text-sm text-gray-600">
                  {suggestions.length} items • Delivery fee calculated at checkout
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  ₦{suggestions.reduce((total, item) => total + item.price, 0).toLocaleString()}
                </p>
                <Button className="mt-2 bg-green-600 hover:bg-green-700 text-white">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add All to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar - Additional Content to Fill Space */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">500+</div>
          <div className="text-sm text-gray-600">Products Available</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">50+</div>
          <div className="text-sm text-gray-600">Verified Vendors</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="text-2xl font-bold text-orange-600">30min</div>
          <div className="text-sm text-gray-600">Average Delivery</div>
        </div>
      </div>
    </div>
  )
}

export default SmartShopper

