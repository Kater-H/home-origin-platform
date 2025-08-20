import React, { useState, useRef } from 'react';
import OCRProcessor from '../utils/ocrProcessor';

const SmartShopperOCR = ({ onAddToCart }) => {
  const [mode, setMode] = useState('text'); // 'text', 'upload'
  const [textInput, setTextInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const ocrProcessor = new OCRProcessor();

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError('');
    setOcrResult(null);
    setSuggestions([]);
    if (newMode === 'text') {
      setUploadedFile(null);
    } else {
      setTextInput('');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    const validation = ocrProcessor.validateFile(file);
    if (!validation.valid) {
      setError(validation.errors.join('. '));
      return;
    }

    setUploadedFile(file);
    setError('');
    setOcrResult(null);
    setSuggestions([]);

    // Process file with OCR
    setIsProcessing(true);
    try {
      let result;
      const fileCategory = ocrProcessor.getFileCategory(file);
      
      if (fileCategory === 'image') {
        result = await ocrProcessor.processImageFile(file);
      } else if (fileCategory === 'pdf') {
        result = await ocrProcessor.processPdfFile(file);
      } else if (fileCategory === 'text') {
        result = await ocrProcessor.processTextFile(file);
      } else {
        result = await ocrProcessor.processFile(file);
      }

      if (result && result.success) {
        setOcrResult(result);
      } else {
        setError(result?.message || 'Failed to process file');
      }
    } catch (err) {
      setError('Error processing file: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Simulate file input change
      const fakeEvent = { target: { files: [file] } };
      handleFileUpload(fakeEvent);
    }
  };

  const processShoppingList = async () => {
    let textToProcess = '';
    
    if (mode === 'text') {
      textToProcess = textInput.trim();
    } else if (ocrResult && ocrResult.text) {
      textToProcess = ocrResult.text;
    }

    if (!textToProcess) {
      setError('Please provide some text to process');
      return;
    }

    setIsLoadingSuggestions(true);
    setError('');

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock suggestions based on the text
      const mockSuggestions = generateMockSuggestions(textToProcess);
      setSuggestions(mockSuggestions);
    } catch (err) {
      setError('Failed to generate suggestions');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const generateMockSuggestions = (text) => {
    // Extract potential items from text
    const items = ocrProcessor.extractShoppingItems(text);
    
    // Create mock product suggestions
    const mockProducts = [
      { id: 1, name: 'Fresh Tomatoes', vendor: "Mama Kemi's Store", price: 500, rating: 4.5, match: 95 },
      { id: 2, name: 'Premium Rice (5kg)', vendor: 'Benue Grains', price: 3500, rating: 4.8, match: 92 },
      { id: 3, name: 'Cooking Oil (1L)', vendor: 'Fresh Mart', price: 1200, rating: 4.3, match: 88 },
      { id: 4, name: 'Fresh Chicken', vendor: 'Poultry Farm', price: 2500, rating: 4.6, match: 85 },
      { id: 5, name: 'Fresh Onions', vendor: 'Garden Fresh', price: 800, rating: 4.2, match: 90 },
      { id: 6, name: 'Fresh Pepper', vendor: 'Spice World', price: 300, rating: 4.4, match: 87 }
    ];

    return mockProducts.slice(0, Math.min(items.length + 2, 6));
  };

  const addToCart = (product) => {
    // Mock add to cart functionality
    console.log('Adding to cart:', product);
    // In real implementation, this would call the cart API
  };

  const quickExamples = [
    { icon: '🍲', category: 'Cooking', text: 'Pepper soup ingredients for 6' },
    { icon: '🥬', category: 'Groceries', text: 'Fresh vegetables for a week' },
    { icon: '🍳', category: 'Daily', text: 'Breakfast essentials' },
    { icon: '🎂', category: 'Events', text: 'Birthday party supplies' }
  ];

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
          <span className="text-2xl">🧠</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Smart Shopper</h2>
          <p className="text-gray-600">Tell us what you need in plain English, upload your shopping list, or scan images/PDFs</p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => handleModeChange('text')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            mode === 'text'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          📝 Type Your List
        </button>
        <button
          onClick={() => handleModeChange('upload')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            mode === 'upload'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          📁 Upload File/Image
        </button>
      </div>

      {/* Text Input Mode */}
      {mode === 'text' && (
        <div className="space-y-4">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="e.g., I need ingredients for jollof rice for 4 people, some fresh vegetables, and chicken"
            className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            rows={4}
          />
          
          {/* Quick Examples */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Start Examples:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {quickExamples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setTextInput(example.text)}
                  className="p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{example.icon}</span>
                    <span className="font-medium text-sm text-gray-800">{example.category}</span>
                  </div>
                  <p className="text-xs text-gray-600">{example.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* File Upload Mode */}
      {mode === 'upload' && (
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {isProcessing ? (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-600">Processing your file with OCR...</p>
                <p className="text-sm text-gray-500">This may take a few moments</p>
              </div>
            ) : uploadedFile ? (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <p className="text-gray-800 font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • {uploadedFile.type}
                </p>
                {ocrResult && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-800 mb-2">✅ Text Extracted Successfully</p>
                    <p className="text-xs text-green-600">
                      Confidence: {Math.round((ocrResult.confidence || 0.85) * 100)}% • 
                      Processing time: {Math.round((ocrResult.processingTime || 2000) / 1000)}s
                      {ocrResult.pagesProcessed && ` • ${ocrResult.pagesProcessed} page(s)`}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📁</span>
                </div>
                <p className="text-gray-600">Drop your shopping list here</p>
                <p className="text-sm text-gray-500">or click to browse files</p>
                <p className="text-xs text-gray-400">
                  Supports JPEG, PNG, and PDF files (max 10MB)
                </p>
              </div>
            )}
          </div>

          {/* OCR Result Preview */}
          {ocrResult && ocrResult.text && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-800 mb-2">Extracted Text:</h3>
              <div className="bg-gray-50 rounded p-3 max-h-40 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">{ocrResult.text}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Process Button */}
      <div className="mt-6">
        <button
          onClick={processShoppingList}
          disabled={isLoadingSuggestions || isProcessing || (!textInput.trim() && !ocrResult?.text)}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isLoadingSuggestions ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Finding Products...
            </>
          ) : (
            <>
              🔍 {mode === 'upload' ? 'Process Shopping List' : 'Find Products'}
            </>
          )}
        </button>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🤖 AI Suggestions</h3>
          <div className="grid gap-4">
            {suggestions.map((product) => (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-800">{product.name}</h4>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {product.match}% match
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{product.vendor}</p>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-green-600">₦{product.price.toLocaleString()}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-green-600">⚡</span>
          </div>
          <h4 className="font-medium text-gray-800">Instant Results</h4>
          <p className="text-sm text-gray-600">AI finds products in seconds</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-blue-600">💰</span>
          </div>
          <h4 className="font-medium text-gray-800">Best Prices</h4>
          <p className="text-sm text-gray-600">Compare across vendors</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-purple-600">🔍</span>
          </div>
          <h4 className="font-medium text-gray-800">OCR Technology</h4>
          <p className="text-sm text-gray-600">Extract text from images & PDFs</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-green-600">500+</div>
          <div className="text-sm text-gray-600">Products Available</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-600">50+</div>
          <div className="text-sm text-gray-600">Verified Vendors</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-orange-600">30min</div>
          <div className="text-sm text-gray-600">Average Delivery</div>
        </div>
      </div>
    </div>
  );
};

export default SmartShopperOCR;

