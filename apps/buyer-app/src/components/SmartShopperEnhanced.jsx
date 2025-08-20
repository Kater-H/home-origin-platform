import { useState, useRef } from 'react'
import { Search, Sparkles, ShoppingCart, Plus, Zap, TrendingUp, Clock, Star, Upload, FileText, X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const SmartShopperEnhanced = ({ onAddToCart }) => {
  const [inputMode, setInputMode] = useState('text') // 'text' or 'file'
  const [shoppingList, setShoppingList] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [fileContent, setFileContent] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  // File processing functions
  const parseTextFile = (content) => {
    // Remove common list markers and clean up text
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, ''))
      .join(', ')
  }

  const parseCSVFile = (content) => {
    // Simple CSV parsing - assume first column contains items
    return content
      .split('\n')
      .map(line => line.split(',')[0].trim())
      .filter(item => item.length > 0)
      .join(', ')
  }

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        let parsedContent = ''

        if (file.name.endsWith('.txt')) {
          parsedContent = parseTextFile(content)
        } else if (file.name.endsWith('.csv')) {
          parsedContent = parseCSVFile(content)
        } else {
          // Default to text parsing
          parsedContent = parseTextFile(content)
        }

        resolve(parsedContent)
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  // File upload handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      await handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file) => {
    // Validate file
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['text/plain', 'text/csv', 'application/vnd.ms-excel']
    
    if (file.size > maxSize) {
      alert('File size must be less than 5MB')
      return
    }

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|csv)$/i)) {
      alert('Please upload a .txt or .csv file')
      return
    }

    try {
      setUploadedFile(file)
      const content = await processFile(file)
      setFileContent(content)
      setShoppingList(content) // Set the parsed content as shopping list
    } catch (error) {
      console.error('Error processing file:', error)
      alert('Error processing file. Please try again.')
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setFileContent('')
    setShoppingList('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // AI processing function
  const processShoppingList = async () => {
    const query = inputMode === 'file' ? fileContent : shoppingList
    if (!query.trim()) return

    setIsProcessing(true)
    setSuggestions([])

    try {
      const response = await fetch("https://0vhlizckl8p1.manus.space/api/ai/smart-shopper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
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
      alert('Error getting suggestions. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    processShoppingList()
  }

  const addToCart = (item) => {
    if (onAddToCart) {
      // Convert the suggestion item to the format expected by the cart
      const cartItem = {
        id: Date.now() + Math.random(), // Generate unique ID
        name: item.product,
        price: item.price,
        vendor: item.vendor,
        image: '/api/placeholder/80/80',
        category_id: 1,
        vendor_id: 1,
        weight: 1.0
      }
      onAddToCart(cartItem)
    }
  }

  const addAllToCart = () => {
    suggestions.forEach(item => addToCart(item))
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
      {/* Header with Mode Toggle */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Smart Shopper</h2>
                <p className="text-gray-600 text-sm">
                  Tell us what you need in plain English or upload your shopping list
                </p>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={inputMode === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('text')}
                className={inputMode === 'text' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                <FileText className="w-4 h-4 mr-2" />
                Type Your List
              </Button>
              <Button
                variant={inputMode === 'file' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('file')}
                className={inputMode === 'file' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {inputMode === 'text' ? (
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
              ) : (
                <div className="space-y-4">
                  {/* File Upload Area */}
                  {!uploadedFile ? (
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                        dragActive 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.csv"
                        onChange={handleFileInputChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Drop your shopping list here
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        or click to browse files
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports .txt and .csv files (max 5MB)
                      </p>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-900">{uploadedFile.name}</p>
                            <p className="text-sm text-green-700">
                              {(uploadedFile.size / 1024).toFixed(1)} KB • Ready to process
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeFile}
                          className="text-green-700 hover:text-green-900"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      {fileContent && (
                        <div className="mt-3 p-3 bg-white rounded-lg border">
                          <p className="text-xs text-gray-600 mb-1">Preview:</p>
                          <p className="text-sm text-gray-800 line-clamp-3">
                            {fileContent.length > 200 ? fileContent.substring(0, 200) + '...' : fileContent}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Process Button */}
                  <Button
                    type="submit"
                    disabled={!uploadedFile || isProcessing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing List...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4" />
                        <span>Process Shopping List</span>
                      </div>
                    )}
                  </Button>
                </div>
              )}
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

      {/* Quick Examples - Only show for text mode */}
      {inputMode === 'text' && suggestions.length === 0 && !isProcessing && (
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

      {/* AI Suggestions */}
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

          {/* Summary Card */}
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
                <Button 
                  className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                  onClick={addAllToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add All to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
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

export default SmartShopperEnhanced

