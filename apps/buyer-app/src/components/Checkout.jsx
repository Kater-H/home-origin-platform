import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import DeliveryOptions from './DeliveryOptions';
import PersonalizedDeliveryTime from './PersonalizedDeliveryTime';
import { ShoppingCart, CreditCard, MapPin, Check, ArrowLeft } from 'lucide-react';

const Checkout = ({ cartItems = [], onBack, onOrderComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    deliveryFee: 0,
    total: 0
  });

  useEffect(() => {
    calculateOrderSummary();
  }, [cartItems, deliveryInfo]);

  const calculateOrderSummary = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = deliveryInfo?.total_fee || 0;
    const total = subtotal + deliveryFee;

    setOrderSummary({ subtotal, deliveryFee, total });
  };

  const handleDeliverySelect = (delivery) => {
    setDeliveryInfo(delivery);
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return deliveryInfo && deliveryInfo.destination_id;
      case 2:
        return customerInfo.name && customerInfo.phone;
      case 3:
        return paymentMethod;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handlePlaceOrder = () => {
    // Simulate order placement
    const order = {
      id: Date.now(),
      items: cartItems,
      customer: customerInfo,
      delivery: deliveryInfo,
      payment: { method: paymentMethod },
      summary: orderSummary,
      status: 'confirmed',
      timestamp: new Date().toISOString()
    };

    console.log('Order placed:', order);
    
    if (onOrderComplete) {
      onOrderComplete(order);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const steps = [
    { id: 1, title: 'Delivery', description: 'Choose delivery destination' },
    { id: 2, title: 'Information', description: 'Enter your details' },
    { id: 3, title: 'Payment', description: 'Select payment method' },
    { id: 4, title: 'Review', description: 'Confirm your order' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-gray-600">Complete your order in {steps.length} easy steps</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Delivery Options */}
          {currentStep === 1 && (
            <DeliveryOptions
              cartItems={cartItems}
              onDeliverySelect={handleDeliverySelect}
              selectedDestination={deliveryInfo?.destination_id}
            />
          )}

          {/* Step 2: Customer Information */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Customer Information
                </CardTitle>
                <CardDescription>
                  Enter your contact details for delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                      placeholder="e.g., +234 801 234 5678"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Special Instructions</Label>
                  <Input
                    id="notes"
                    value={customerInfo.notes}
                    onChange={(e) => handleCustomerInfoChange('notes', e.target.value)}
                    placeholder="Any special delivery instructions..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Payment Method */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  Payment Method
                </CardTitle>
                <CardDescription>
                  Choose how you want to pay for your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'cash' 
                        ? 'border-green-600 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Cash on Delivery</h4>
                        <p className="text-sm text-gray-600">Pay when your order arrives</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        paymentMethod === 'cash' 
                          ? 'border-green-600 bg-green-600' 
                          : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'cash' && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'transfer' 
                        ? 'border-green-600 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('transfer')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Bank Transfer</h4>
                        <p className="text-sm text-gray-600">Pay via bank transfer</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        paymentMethod === 'transfer' 
                          ? 'border-green-600 bg-green-600' 
                          : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'transfer' && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {paymentMethod === 'transfer' && (
                  <Alert>
                    <AlertDescription>
                      Bank transfer details will be provided after order confirmation.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Order Review */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Order Review</CardTitle>
                <CardDescription>
                  Please review your order details before confirming
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p><strong>Name:</strong> {customerInfo.name}</p>
                    <p><strong>Phone:</strong> {customerInfo.phone}</p>
                    {customerInfo.email && <p><strong>Email:</strong> {customerInfo.email}</p>}
                    {customerInfo.notes && <p><strong>Notes:</strong> {customerInfo.notes}</p>}
                  </div>
                </div>

                {/* Delivery Info */}
                <div>
                  <h4 className="font-medium mb-2">Delivery Information</h4>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <p><strong>Destination:</strong> {deliveryInfo?.destination?.name}</p>
                    <p><strong>Address:</strong> {deliveryInfo?.destination?.address}</p>
                    <p><strong>Delivery Fee:</strong> {
                      deliveryInfo?.free_delivery_applied 
                        ? 'FREE' 
                        : formatCurrency(deliveryInfo?.total_fee || 0)
                    }</p>
                    
                    {/* Personalized Delivery Time */}
                    <div className="pt-2 border-t border-gray-200">
                      <PersonalizedDeliveryTime
                        userId="user_123"
                        vendorId={cartItems[0]?.vendor_id || "vendor_1"}
                        customerLocation={deliveryInfo?.destination}
                        orderItems={cartItems}
                        showDetailedBreakdown={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p>{paymentMethod === 'cash' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={handleNextStep}
                disabled={!validateStep(currentStep)}
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handlePlaceOrder}
                className="bg-green-600 hover:bg-green-700"
              >
                Place Order
              </Button>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(orderSummary.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className={deliveryInfo?.free_delivery_applied ? 'text-green-600' : ''}>
                    {deliveryInfo?.free_delivery_applied ? 'FREE' : formatCurrency(orderSummary.deliveryFee)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(orderSummary.total)}</span>
                </div>
              </div>

              {deliveryInfo?.free_delivery_applied && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 font-medium">
                    🎉 You saved {formatCurrency(orderSummary.deliveryFee)} on delivery!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

