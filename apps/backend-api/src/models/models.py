from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import enum

db = SQLAlchemy()

class UserRole(enum.Enum):
    BUYER = "buyer"
    VENDOR = "vendor"
    RIDER = "rider"
    ADMIN = "admin"

class OrderStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    READY_FOR_PICKUP = "ready_for_pickup"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class DeliveryType(enum.Enum):
    DELIVERY = "delivery"
    PICKUP = "pickup"

# User Model
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20))
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.BUYER)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Address information
    address_line1 = db.Column(db.String(255))
    address_line2 = db.Column(db.String(255))
    city = db.Column(db.String(100))
    postcode = db.Column(db.String(20))
    country = db.Column(db.String(100), default='UK')
    
    # Relationships
    vendor_profile = db.relationship('Vendor', backref='user', uselist=False, cascade='all, delete-orphan')
    rider_profile = db.relationship('Rider', backref='user', uselist=False, cascade='all, delete-orphan')
    orders = db.relationship('Order', backref='customer', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'role': self.role.value if self.role else None,
            'is_active': self.is_active,
            'address_line1': self.address_line1,
            'address_line2': self.address_line2,
            'city': self.city,
            'postcode': self.postcode,
            'country': self.country,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

# Category Model
class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    products = db.relationship('Product', backref='category', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'image_url': self.image_url,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# Vendor Model
class Vendor(db.Model):
    __tablename__ = 'vendors'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    business_name = db.Column(db.String(200), nullable=False)
    business_description = db.Column(db.Text)
    business_address = db.Column(db.String(500))
    business_phone = db.Column(db.String(20))
    business_email = db.Column(db.String(120))
    
    # Business details
    business_registration = db.Column(db.String(100))
    vat_number = db.Column(db.String(50))
    
    # Delivery settings
    delivery_fee = db.Column(db.Float, default=0.0)
    peak_delivery_fee = db.Column(db.Float, default=0.0)
    free_delivery_threshold = db.Column(db.Float, default=0.0)
    delivery_radius = db.Column(db.Float, default=5.0)  # in miles
    preparation_time = db.Column(db.Integer, default=30)  # in minutes
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    rating = db.Column(db.Float, default=0.0)
    total_orders = db.Column(db.Integer, default=0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    products = db.relationship('Product', backref='vendor', lazy=True, cascade='all, delete-orphan')
    orders = db.relationship('Order', backref='vendor', lazy=True)
    assigned_riders = db.relationship('VendorRider', backref='vendor', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'business_name': self.business_name,
            'business_description': self.business_description,
            'business_address': self.business_address,
            'business_phone': self.business_phone,
            'business_email': self.business_email,
            'business_registration': self.business_registration,
            'vat_number': self.vat_number,
            'delivery_fee': self.delivery_fee,
            'peak_delivery_fee': self.peak_delivery_fee,
            'free_delivery_threshold': self.free_delivery_threshold,
            'delivery_radius': self.delivery_radius,
            'preparation_time': self.preparation_time,
            'is_active': self.is_active,
            'is_verified': self.is_verified,
            'rating': self.rating,
            'total_orders': self.total_orders,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

# Rider Model
class Rider(db.Model):
    __tablename__ = 'riders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Rider details
    vehicle_type = db.Column(db.String(50))  # bicycle, motorcycle, car
    license_number = db.Column(db.String(50))
    vehicle_registration = db.Column(db.String(20))
    
    # Status and availability
    is_active = db.Column(db.Boolean, default=True)
    is_available = db.Column(db.Boolean, default=False)
    is_verified = db.Column(db.Boolean, default=False)
    
    # Performance metrics
    rating = db.Column(db.Float, default=0.0)
    total_deliveries = db.Column(db.Integer, default=0)
    successful_deliveries = db.Column(db.Integer, default=0)
    
    # Current location (for tracking)
    current_latitude = db.Column(db.Float)
    current_longitude = db.Column(db.Float)
    last_location_update = db.Column(db.DateTime)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    assigned_vendors = db.relationship('VendorRider', backref='rider', lazy=True)
    deliveries = db.relationship('Order', backref='rider', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'vehicle_type': self.vehicle_type,
            'license_number': self.license_number,
            'vehicle_registration': self.vehicle_registration,
            'is_active': self.is_active,
            'is_available': self.is_available,
            'is_verified': self.is_verified,
            'rating': self.rating,
            'total_deliveries': self.total_deliveries,
            'successful_deliveries': self.successful_deliveries,
            'current_latitude': self.current_latitude,
            'current_longitude': self.current_longitude,
            'last_location_update': self.last_location_update.isoformat() if self.last_location_update else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

# Vendor-Rider Assignment Model
class VendorRider(db.Model):
    __tablename__ = 'vendor_riders'
    
    id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.id'), nullable=False)
    rider_id = db.Column(db.Integer, db.ForeignKey('riders.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'vendor_id': self.vendor_id,
            'rider_id': self.rider_id,
            'is_active': self.is_active,
            'assigned_at': self.assigned_at.isoformat() if self.assigned_at else None
        }

# Product Model
class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    original_price = db.Column(db.Float)  # for discounts
    
    # Product details
    sku = db.Column(db.String(100), unique=True)
    barcode = db.Column(db.String(100))
    weight = db.Column(db.Float)  # in kg
    unit = db.Column(db.String(20))  # piece, kg, liter, etc.
    
    # Inventory
    stock_quantity = db.Column(db.Integer, default=0)
    low_stock_threshold = db.Column(db.Integer, default=5)
    
    # Product status
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    
    # Images
    image_url = db.Column(db.String(255))
    additional_images = db.Column(db.Text)  # JSON array of image URLs
    
    # SEO and metadata
    tags = db.Column(db.Text)  # JSON array of tags
    origin_country = db.Column(db.String(100))
    cultural_significance = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    order_items = db.relationship('OrderItem', backref='product', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'vendor_id': self.vendor_id,
            'category_id': self.category_id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'original_price': self.original_price,
            'sku': self.sku,
            'barcode': self.barcode,
            'weight': self.weight,
            'unit': self.unit,
            'stock_quantity': self.stock_quantity,
            'low_stock_threshold': self.low_stock_threshold,
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'image_url': self.image_url,
            'additional_images': self.additional_images,
            'tags': self.tags,
            'origin_country': self.origin_country,
            'cultural_significance': self.cultural_significance,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

# Order Model
class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.id'), nullable=False)
    rider_id = db.Column(db.Integer, db.ForeignKey('riders.id'))
    
    # Order details
    status = db.Column(db.Enum(OrderStatus), default=OrderStatus.PENDING)
    delivery_type = db.Column(db.Enum(DeliveryType), nullable=False)
    
    # Pricing
    subtotal = db.Column(db.Float, nullable=False)
    delivery_fee = db.Column(db.Float, default=0.0)
    service_fee = db.Column(db.Float, default=0.0)
    discount_amount = db.Column(db.Float, default=0.0)
    total_amount = db.Column(db.Float, nullable=False)
    
    # Delivery information
    delivery_address = db.Column(db.String(500))
    delivery_instructions = db.Column(db.Text)
    estimated_delivery_time = db.Column(db.DateTime)
    actual_delivery_time = db.Column(db.DateTime)
    
    # Pickup information
    pickup_code = db.Column(db.String(10))  # QR code for pickup
    pickup_time = db.Column(db.DateTime)
    
    # Tracking
    preparation_started_at = db.Column(db.DateTime)
    ready_for_pickup_at = db.Column(db.DateTime)
    out_for_delivery_at = db.Column(db.DateTime)
    delivered_at = db.Column(db.DateTime)
    
    # Notes and feedback
    customer_notes = db.Column(db.Text)
    vendor_notes = db.Column(db.Text)
    rider_notes = db.Column(db.Text)
    
    # Payment
    payment_method = db.Column(db.String(50))
    payment_status = db.Column(db.String(50), default='pending')
    payment_reference = db.Column(db.String(100))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    order_items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'customer_id': self.customer_id,
            'vendor_id': self.vendor_id,
            'rider_id': self.rider_id,
            'status': self.status.value if self.status else None,
            'delivery_type': self.delivery_type.value if self.delivery_type else None,
            'subtotal': self.subtotal,
            'delivery_fee': self.delivery_fee,
            'service_fee': self.service_fee,
            'discount_amount': self.discount_amount,
            'total_amount': self.total_amount,
            'delivery_address': self.delivery_address,
            'delivery_instructions': self.delivery_instructions,
            'estimated_delivery_time': self.estimated_delivery_time.isoformat() if self.estimated_delivery_time else None,
            'actual_delivery_time': self.actual_delivery_time.isoformat() if self.actual_delivery_time else None,
            'pickup_code': self.pickup_code,
            'pickup_time': self.pickup_time.isoformat() if self.pickup_time else None,
            'preparation_started_at': self.preparation_started_at.isoformat() if self.preparation_started_at else None,
            'ready_for_pickup_at': self.ready_for_pickup_at.isoformat() if self.ready_for_pickup_at else None,
            'out_for_delivery_at': self.out_for_delivery_at.isoformat() if self.out_for_delivery_at else None,
            'delivered_at': self.delivered_at.isoformat() if self.delivered_at else None,
            'customer_notes': self.customer_notes,
            'vendor_notes': self.vendor_notes,
            'rider_notes': self.rider_notes,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'payment_reference': self.payment_reference,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

# Order Item Model
class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    
    # Special instructions for this item
    special_instructions = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'unit_price': self.unit_price,
            'total_price': self.total_price,
            'special_instructions': self.special_instructions,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

