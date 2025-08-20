import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { MapPin, Plus, Edit, Trash2, Calculator, Gift, TrendingUp, Settings } from 'lucide-react';

const DeliveryManagement = () => {
  const [destinations, setDestinations] = useState([]);
  const [feeRules, setFeeRules] = useState([]);
  const [freeDeliveryRules, setFreeDeliveryRules] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('destinations');

  // Form states
  const [destinationForm, setDestinationForm] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    zone: '',
    accessibility_info: '',
    special_instructions: ''
  });

  const [feeRuleForm, setFeeRuleForm] = useState({
    name: '',
    rule_type: 'distance',
    base_fee: '',
    per_unit_fee: '',
    min_fee: '',
    max_fee: '',
    conditions: {},
    priority: '1'
  });

  const [freeDeliveryForm, setFreeDeliveryForm] = useState({
    name: '',
    rule_type: 'min_order_value',
    conditions: {},
    start_date: '',
    end_date: '',
    usage_limit: ''
  });

  const [showDestinationDialog, setShowDestinationDialog] = useState(false);
  const [showFeeRuleDialog, setShowFeeRuleDialog] = useState(false);
  const [showFreeDeliveryDialog, setShowFreeDeliveryDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const API_BASE = 'https://zmhqivcvokjp.manus.space/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [destRes, feeRes, freeRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE}/delivery/destinations`).catch(() => ({ ok: false })),
        fetch(`${API_BASE}/delivery/fee-rules`).catch(() => ({ ok: false })),
        fetch(`${API_BASE}/delivery/free-delivery-rules`).catch(() => ({ ok: false })),
        fetch(`${API_BASE}/delivery/analytics`).catch(() => ({ ok: false }))
      ]);

      if (destRes.ok) {
        const destData = await destRes.json();
        setDestinations(destData.destinations || []);
      }

      if (feeRes.ok) {
        const feeData = await feeRes.json();
        setFeeRules(feeData.rules || []);
      }

      if (freeRes.ok) {
        const freeData = await freeRes.json();
        setFreeDeliveryRules(freeData.rules || []);
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData.analytics || {});
      }

      // Fallback data if API is not available
      if (!destRes.ok && !feeRes.ok && !freeRes.ok) {
        setDestinations([
          { id: 1, name: 'BSU Main Campus', address: 'Benue State University, Makurdi', zone: 'Campus', is_active: true },
          { id: 2, name: 'BSU Student Hostels', address: 'BSU Student Accommodation, Makurdi', zone: 'Campus', is_active: true },
          { id: 3, name: 'Makurdi Central Market', address: 'Central Market, Makurdi', zone: 'Market', is_active: true }
        ]);
        setFeeRules([
          { id: 1, name: 'Base Distance Fee', rule_type: 'distance', base_fee: 100, per_unit_fee: 50, min_fee: 100, priority: 1, is_active: true },
          { id: 2, name: 'Weight Surcharge', rule_type: 'weight', base_fee: 0, per_unit_fee: 25, min_fee: 0, priority: 2, is_active: true }
        ]);
        setFreeDeliveryRules([
          { id: 1, name: 'Free Delivery Above ₦5000', rule_type: 'min_order_value', conditions: { min_amount: 5000 }, is_active: true }
        ]);
        setAnalytics({
          total_destinations: 3,
          total_fee_rules: 2,
          total_free_delivery_rules: 1,
          total_calculations: 45,
          average_delivery_fee: 275.50,
          free_deliveries_count: 12
        });
      }
    } catch (err) {
      setError('Failed to load delivery data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDestination = async () => {
    try {
      const response = await fetch(`${API_BASE}/delivery/destinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destinationForm)
      });

      if (response.ok) {
        fetchData();
        setShowDestinationDialog(false);
        setDestinationForm({
          name: '', address: '', latitude: '', longitude: '', zone: '', accessibility_info: '', special_instructions: ''
        });
      }
    } catch (err) {
      setError('Failed to create destination');
    }
  };

  const handleCreateFeeRule = async () => {
    try {
      const ruleData = {
        ...feeRuleForm,
        base_fee: parseFloat(feeRuleForm.base_fee) || 0,
        per_unit_fee: parseFloat(feeRuleForm.per_unit_fee) || 0,
        min_fee: parseFloat(feeRuleForm.min_fee) || 0,
        max_fee: feeRuleForm.max_fee ? parseFloat(feeRuleForm.max_fee) : null,
        priority: parseInt(feeRuleForm.priority) || 1
      };

      const response = await fetch(`${API_BASE}/delivery/fee-rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ruleData)
      });

      if (response.ok) {
        fetchData();
        setShowFeeRuleDialog(false);
        setFeeRuleForm({
          name: '', rule_type: 'distance', base_fee: '', per_unit_fee: '', min_fee: '', max_fee: '', conditions: {}, priority: '1'
        });
      }
    } catch (err) {
      setError('Failed to create fee rule');
    }
  };

  const handleCreateFreeDeliveryRule = async () => {
    try {
      let conditions = {};
      if (freeDeliveryForm.rule_type === 'min_order_value') {
        conditions = { min_amount: parseFloat(freeDeliveryForm.min_amount) || 0 };
      }

      const ruleData = {
        ...freeDeliveryForm,
        conditions,
        usage_limit: freeDeliveryForm.usage_limit ? parseInt(freeDeliveryForm.usage_limit) : null
      };

      const response = await fetch(`${API_BASE}/delivery/free-delivery-rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ruleData)
      });

      if (response.ok) {
        fetchData();
        setShowFreeDeliveryDialog(false);
        setFreeDeliveryForm({
          name: '', rule_type: 'min_order_value', conditions: {}, start_date: '', end_date: '', usage_limit: ''
        });
      }
    } catch (err) {
      setError('Failed to create free delivery rule');
    }
  };

  const seedData = async () => {
    try {
      const response = await fetch(`${API_BASE}/delivery/seed-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        fetchData();
        setError('');
      }
    } catch (err) {
      setError('Failed to seed data');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading delivery management...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Delivery Management</h1>
          <p className="text-gray-600">Manage delivery destinations, fee rules, and promotional offers</p>
        </div>
        <Button onClick={seedData} variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Seed Sample Data
        </Button>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Destinations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total_destinations || 0}</div>
            <p className="text-xs text-muted-foreground">Active delivery locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Rules</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total_fee_rules || 0}</div>
            <p className="text-xs text-muted-foreground">Active pricing rules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Delivery Rules</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total_free_delivery_rules || 0}</div>
            <p className="text-xs text-muted-foreground">Promotional offers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calculations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total_calculations || 0}</div>
            <p className="text-xs text-muted-foreground">Delivery fee calculations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Fee</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{analytics.average_delivery_fee?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">Average delivery cost</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Deliveries</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.free_deliveries_count || 0}</div>
            <p className="text-xs text-muted-foreground">Promotional deliveries used</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="destinations">Delivery Destinations</TabsTrigger>
          <TabsTrigger value="fee-rules">Fee Rules</TabsTrigger>
          <TabsTrigger value="free-delivery">Free Delivery</TabsTrigger>
        </TabsList>

        {/* Destinations Tab */}
        <TabsContent value="destinations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Delivery Destinations</h2>
            <Dialog open={showDestinationDialog} onOpenChange={setShowDestinationDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Destination
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Destination</DialogTitle>
                  <DialogDescription>Create a new delivery destination for the platform.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dest-name">Destination Name</Label>
                    <Input
                      id="dest-name"
                      value={destinationForm.name}
                      onChange={(e) => setDestinationForm({...destinationForm, name: e.target.value})}
                      placeholder="e.g., BSU Main Campus"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dest-address">Address</Label>
                    <Textarea
                      id="dest-address"
                      value={destinationForm.address}
                      onChange={(e) => setDestinationForm({...destinationForm, address: e.target.value})}
                      placeholder="Full address of the destination"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dest-lat">Latitude</Label>
                      <Input
                        id="dest-lat"
                        type="number"
                        step="any"
                        value={destinationForm.latitude}
                        onChange={(e) => setDestinationForm({...destinationForm, latitude: e.target.value})}
                        placeholder="7.7319"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dest-lng">Longitude</Label>
                      <Input
                        id="dest-lng"
                        type="number"
                        step="any"
                        value={destinationForm.longitude}
                        onChange={(e) => setDestinationForm({...destinationForm, longitude: e.target.value})}
                        placeholder="8.5211"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="dest-zone">Zone</Label>
                    <Input
                      id="dest-zone"
                      value={destinationForm.zone}
                      onChange={(e) => setDestinationForm({...destinationForm, zone: e.target.value})}
                      placeholder="e.g., Campus, Market, Residential"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dest-access">Accessibility Info</Label>
                    <Textarea
                      id="dest-access"
                      value={destinationForm.accessibility_info}
                      onChange={(e) => setDestinationForm({...destinationForm, accessibility_info: e.target.value})}
                      placeholder="Special access instructions"
                    />
                  </div>
                  <Button onClick={handleCreateDestination} className="w-full">
                    Create Destination
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {destinations.map((destination) => (
                    <TableRow key={destination.id}>
                      <TableCell className="font-medium">{destination.name}</TableCell>
                      <TableCell>{destination.address}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{destination.zone}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={destination.is_active ? "default" : "secondary"}>
                          {destination.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fee Rules Tab */}
        <TabsContent value="fee-rules" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Delivery Fee Rules</h2>
            <Dialog open={showFeeRuleDialog} onOpenChange={setShowFeeRuleDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Fee Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Fee Rule</DialogTitle>
                  <DialogDescription>Create a new delivery fee calculation rule.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rule-name">Rule Name</Label>
                    <Input
                      id="rule-name"
                      value={feeRuleForm.name}
                      onChange={(e) => setFeeRuleForm({...feeRuleForm, name: e.target.value})}
                      placeholder="e.g., Base Distance Fee"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rule-type">Rule Type</Label>
                    <Select value={feeRuleForm.rule_type} onValueChange={(value) => setFeeRuleForm({...feeRuleForm, rule_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="distance">Distance-based</SelectItem>
                        <SelectItem value="weight">Weight-based</SelectItem>
                        <SelectItem value="category">Category-based</SelectItem>
                        <SelectItem value="flat_rate">Flat Rate</SelectItem>
                        <SelectItem value="vendor_specific">Vendor Specific</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="base-fee">Base Fee (₦)</Label>
                      <Input
                        id="base-fee"
                        type="number"
                        value={feeRuleForm.base_fee}
                        onChange={(e) => setFeeRuleForm({...feeRuleForm, base_fee: e.target.value})}
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="per-unit-fee">Per Unit Fee (₦)</Label>
                      <Input
                        id="per-unit-fee"
                        type="number"
                        value={feeRuleForm.per_unit_fee}
                        onChange={(e) => setFeeRuleForm({...feeRuleForm, per_unit_fee: e.target.value})}
                        placeholder="50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min-fee">Min Fee (₦)</Label>
                      <Input
                        id="min-fee"
                        type="number"
                        value={feeRuleForm.min_fee}
                        onChange={(e) => setFeeRuleForm({...feeRuleForm, min_fee: e.target.value})}
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-fee">Max Fee (₦)</Label>
                      <Input
                        id="max-fee"
                        type="number"
                        value={feeRuleForm.max_fee}
                        onChange={(e) => setFeeRuleForm({...feeRuleForm, max_fee: e.target.value})}
                        placeholder="500"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={feeRuleForm.priority}
                      onChange={(e) => setFeeRuleForm({...feeRuleForm, priority: e.target.value})}
                      placeholder="1"
                    />
                  </div>
                  <Button onClick={handleCreateFeeRule} className="w-full">
                    Create Fee Rule
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Base Fee</TableHead>
                    <TableHead>Per Unit</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.rule_type}</Badge>
                      </TableCell>
                      <TableCell>₦{rule.base_fee}</TableCell>
                      <TableCell>₦{rule.per_unit_fee}</TableCell>
                      <TableCell>{rule.priority}</TableCell>
                      <TableCell>
                        <Badge variant={rule.is_active ? "default" : "secondary"}>
                          {rule.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Free Delivery Tab */}
        <TabsContent value="free-delivery" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Free Delivery Rules</h2>
            <Dialog open={showFreeDeliveryDialog} onOpenChange={setShowFreeDeliveryDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Free Delivery Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Free Delivery Rule</DialogTitle>
                  <DialogDescription>Create a new promotional free delivery rule.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="free-rule-name">Rule Name</Label>
                    <Input
                      id="free-rule-name"
                      value={freeDeliveryForm.name}
                      onChange={(e) => setFreeDeliveryForm({...freeDeliveryForm, name: e.target.value})}
                      placeholder="e.g., Free Delivery Above ₦5000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="free-rule-type">Rule Type</Label>
                    <Select value={freeDeliveryForm.rule_type} onValueChange={(value) => setFreeDeliveryForm({...freeDeliveryForm, rule_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="min_order_value">Minimum Order Value</SelectItem>
                        <SelectItem value="customer_loyalty">Customer Loyalty</SelectItem>
                        <SelectItem value="vendor_promo">Vendor Promotion</SelectItem>
                        <SelectItem value="campaign">Campaign</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {freeDeliveryForm.rule_type === 'min_order_value' && (
                    <div>
                      <Label htmlFor="min-amount">Minimum Amount (₦)</Label>
                      <Input
                        id="min-amount"
                        type="number"
                        value={freeDeliveryForm.min_amount}
                        onChange={(e) => setFreeDeliveryForm({...freeDeliveryForm, min_amount: e.target.value})}
                        placeholder="5000"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="datetime-local"
                        value={freeDeliveryForm.start_date}
                        onChange={(e) => setFreeDeliveryForm({...freeDeliveryForm, start_date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="datetime-local"
                        value={freeDeliveryForm.end_date}
                        onChange={(e) => setFreeDeliveryForm({...freeDeliveryForm, end_date: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="usage-limit">Usage Limit</Label>
                    <Input
                      id="usage-limit"
                      type="number"
                      value={freeDeliveryForm.usage_limit}
                      onChange={(e) => setFreeDeliveryForm({...freeDeliveryForm, usage_limit: e.target.value})}
                      placeholder="100"
                    />
                  </div>
                  <Button onClick={handleCreateFreeDeliveryRule} className="w-full">
                    Create Free Delivery Rule
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Conditions</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {freeDeliveryRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.rule_type}</Badge>
                      </TableCell>
                      <TableCell>
                        {rule.conditions?.min_amount && `Min: ₦${rule.conditions.min_amount}`}
                      </TableCell>
                      <TableCell>
                        {rule.usage_count || 0} / {rule.usage_limit || '∞'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.is_active ? "default" : "secondary"}>
                          {rule.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliveryManagement;

