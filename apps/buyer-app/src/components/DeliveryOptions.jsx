import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { MapPin, Calculator, Gift, Truck, Clock } from 'lucide-react';

const DeliveryOptions = ({ 
  cartItems = [], 
  onDeliverySelect, 
  selectedDestination, 
  calculatedFee 
}) => {
  const [destinations, setDestinations] = useState([]);
  const [deliveryQuote, setDeliveryQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = 'https://zmhqivcvoekz.manus.space/api';

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (selectedDestination && cartItems.length > 0) {
      calculateDeliveryFee();
    }
  }, [selectedDestination, cartItems]);

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${API_BASE}/delivery/destinations`);
      if (response.ok) {
        const data = await response.json();
        setDestinations(data.destinations || []);
      } else {
        // Fallback destinations if API is not available
        setDestinations([
          { id: 1, name: 'BSU Main Campus', address: 'Benue State University, Makurdi', zone: 'Campus' },
          { id: 2, name: 'BSU Student Hostels', address: 'BSU Student Accommodation, Makurdi', zone: 'Campus' },
          { id: 3, name: 'Makurdi Central Market', address: 'Central Market, Makurdi', zone: 'Market' },
          { id: 4, name: 'North Bank Area', address: 'North Bank, Makurdi', zone: 'Residential' }
        ]);
      }
    } catch (err) {
      setError('Failed to load delivery destinations');
      // Use fallback data
      setDestinations([
        { id: 1, name: 'BSU Main Campus', address: 'Benue State University, Makurdi', zone: 'Campus' },
        { id: 2, name: 'BSU Student Hostels', address: 'BSU Student Accommodation, Makurdi', zone: 'Campus' },
        { id: 3, name: 'Makurdi Central Market', address: 'Central Market, Makurdi', zone: 'Market' },
        { id: 4, name: 'North Bank Area', address: 'North Bank, Makurdi', zone: 'Residential' }
      ]);
    }
  };

  const calculateDeliveryFee = async () => {
    if (!selectedDestination || cartItems.length === 0) return;

    setLoading(true);
    try {
      // Prepare order items for calculation
      const orderItems = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        weight: item.weight || 0.5, // Default weight if not specified
        category_id: item.category_id || 1,
        vendor_id: item.vendor_id || 1
      }));

      // Calculate total order value for free delivery eligibility
      const totalValue = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const response = await fetch(`${API_BASE}/delivery/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination_id: selectedDestination,
          order_items: orderItems,
          pickup_locations: [
            { latitude: 7.7300, longitude: 8.5200 } // Default pickup location
          ],
          customer_id: 1 // Default customer for testing
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDeliveryQuote(data.quote);
        if (onDeliverySelect) {
          onDeliverySelect(data.quote);
        }
      } else {
        // Fallback calculation
        const baseFee = 150;
        const distanceFee = Math.random() * 100; // Simulated distance fee
        const totalFee = totalValue >= 5000 ? 0 : baseFee + distanceFee; // Free delivery above ₦5000
        
        const fallbackQuote = {
          destination_id: selectedDestination,
          total_fee: totalFee,
          base_fee: baseFee,
          distance_fee: distanceFee,
          free_delivery_applied: totalValue >= 5000,
          applied_rules: [
            { rule_name: 'Base Distance Fee', calculated_fee: baseFee },
            { rule_name: 'Distance Calculation', calculated_fee: distanceFee }
          ]
        };
        
        setDeliveryQuote(fallbackQuote);
        if (onDeliverySelect) {
          onDeliverySelect(fallbackQuote);
        }
      }
    } catch (err) {
      setError('Failed to calculate delivery fee');
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationChange = (destinationId) => {
    const destination = destinations.find(d => d.id === parseInt(destinationId));
    if (destination && onDeliverySelect) {
      onDeliverySelect({ destination_id: destinationId, destination });
    }
  };

  const getZoneColor = (zone) => {
    switch (zone?.toLowerCase()) {
      case 'campus': return 'bg-green-100 text-green-800';
      case 'market': return 'bg-blue-100 text-blue-800';
      case 'residential': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Delivery Destination Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Select Delivery Destination
          </CardTitle>
          <CardDescription>
            Choose where you want your order delivered
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <Select onValueChange={handleDestinationChange} value={selectedDestination?.toString()}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a delivery destination" />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((destination) => (
                <SelectItem key={destination.id} value={destination.id.toString()}>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="font-medium">{destination.name}</div>
                      <div className="text-sm text-gray-500">{destination.address}</div>
                    </div>
                    <Badge className={`ml-2 ${getZoneColor(destination.zone)}`}>
                      {destination.zone}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedDestination && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">Selected Destination</span>
              </div>
              {destinations.find(d => d.id === selectedDestination) && (
                <div>
                  <p className="font-medium">{destinations.find(d => d.id === selectedDestination).name}</p>
                  <p className="text-sm text-gray-600">{destinations.find(d => d.id === selectedDestination).address}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delivery Fee Calculation */}
      {selectedDestination && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Delivery Fee Calculation
            </CardTitle>
            <CardDescription>
              Real-time delivery cost breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Calculating delivery fee...</span>
                </div>
              </div>
            ) : deliveryQuote ? (
              <div className="space-y-4">
                {/* Fee Breakdown */}
                <div className="space-y-2">
                  {deliveryQuote.applied_rules?.map((rule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">{rule.rule_name}</span>
                      <span className="text-sm font-medium">{formatCurrency(rule.calculated_fee)}</span>
                    </div>
                  ))}
                </div>

                {/* Free Delivery Notice */}
                {deliveryQuote.free_delivery_applied && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Free Delivery Applied!</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Your order qualifies for free delivery
                    </p>
                  </div>
                )}

                {/* Total Fee */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Delivery Fee:</span>
                    <span className={`text-xl font-bold ${deliveryQuote.free_delivery_applied ? 'text-green-600' : 'text-gray-900'}`}>
                      {deliveryQuote.free_delivery_applied ? 'FREE' : formatCurrency(deliveryQuote.total_fee)}
                    </span>
                  </div>
                </div>

                {/* Estimated Delivery Time */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Estimated Delivery Time</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    30-45 minutes from order confirmation
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select a destination to calculate delivery fee
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delivery Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-600" />
            Delivery Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Delivery Method</h4>
              <p className="text-sm text-gray-600">Okada (Motorcycle) Delivery</p>
              <p className="text-xs text-gray-500 mt-1">Fast and reliable delivery service</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Delivery Hours</h4>
              <p className="text-sm text-gray-600">8:00 AM - 8:00 PM</p>
              <p className="text-xs text-gray-500 mt-1">Monday to Sunday</p>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">Important Notes</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Please ensure someone is available to receive the delivery</li>
              <li>• Delivery fee may vary based on distance and order weight</li>
              <li>• Free delivery available for orders above ₦5,000</li>
              <li>• Contact our support if you need to change delivery address</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryOptions;

