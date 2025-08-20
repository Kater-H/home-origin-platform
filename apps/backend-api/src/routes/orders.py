from flask import Blueprint, jsonify, request
from src.models.models import (
    Order, OrderItem, Product, Vendor, User, UserRole, Rider, 
    OrderStatus, DeliveryType, db
)
from src.routes.user import token_required
from datetime import datetime, timedelta
import uuid
import random
import string

orders_bp = Blueprint('orders', __name__)

def generate_order_number():
    """Generate a unique order number"""
    timestamp = datetime.now().strftime('%Y%m%d')
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"HO-{timestamp}-{random_part}"

def generate_pickup_code():
    """Generate a 6-digit pickup code"""
    return ''.join(random.choices(string.digits, k=6))

@orders_bp.route('/orders', methods=['GET'])
@token_required
def get_orders(current_user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        vendor_id = request.args.get('vendor_id', type=int)
        
        query = Order.query
        
        # Filter based on user role
        if current_user.role == UserRole.BUYER:
            query = query.filter_by(customer_id=current_user.id)
        elif current_user.role == UserRole.VENDOR:
            vendor = Vendor.query.filter_by(user_id=current_user.id).first()
            if vendor:
                query = query.filter_by(vendor_id=vendor.id)
            else:
                return jsonify({'orders': [], 'total': 0, 'pages': 0, 'current_page': page}), 200
        elif current_user.role == UserRole.RIDER:
            rider = Rider.query.filter_by(user_id=current_user.id).first()
            if rider:
                query = query.filter_by(rider_id=rider.id)
            else:
                return jsonify({'orders': [], 'total': 0, 'pages': 0, 'current_page': page}), 200
        # Admin can see all orders
        
        if status:
            query = query.filter_by(status=OrderStatus(status))
        
        if vendor_id and current_user.role == UserRole.ADMIN:
            query = query.filter_by(vendor_id=vendor_id)
        
        orders = query.order_by(Order.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Include related data
        orders_data = []
        for order in orders.items:
            order_dict = order.to_dict()
            order_dict['customer'] = order.customer.to_dict() if order.customer else None
            order_dict['vendor'] = order.vendor.to_dict() if order.vendor else None
            order_dict['rider'] = order.rider.to_dict() if order.rider else None
            
            # Include order items
            order_items = []
            for item in order.order_items:
                item_dict = item.to_dict()
                item_dict['product'] = item.product.to_dict() if item.product else None
                order_items.append(item_dict)
            order_dict['items'] = order_items
            
            orders_data.append(order_dict)
        
        return jsonify({
            'orders': orders_data,
            'total': orders.total,
            'pages': orders.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch orders: {str(e)}'}), 500

@orders_bp.route('/orders/<int:order_id>', methods=['GET'])
@token_required
def get_order(current_user, order_id):
    try:
        order = Order.query.get_or_404(order_id)
        
        # Check access permissions
        can_access = False
        if current_user.role == UserRole.ADMIN:
            can_access = True
        elif current_user.role == UserRole.BUYER and order.customer_id == current_user.id:
            can_access = True
        elif current_user.role == UserRole.VENDOR:
            vendor = Vendor.query.filter_by(user_id=current_user.id).first()
            if vendor and order.vendor_id == vendor.id:
                can_access = True
        elif current_user.role == UserRole.RIDER:
            rider = Rider.query.filter_by(user_id=current_user.id).first()
            if rider and order.rider_id == rider.id:
                can_access = True
        
        if not can_access:
            return jsonify({'message': 'Access denied'}), 403
        
        order_dict = order.to_dict()
        order_dict['customer'] = order.customer.to_dict() if order.customer else None
        order_dict['vendor'] = order.vendor.to_dict() if order.vendor else None
        order_dict['rider'] = order.rider.to_dict() if order.rider else None
        
        # Include order items
        order_items = []
        for item in order.order_items:
            item_dict = item.to_dict()
            item_dict['product'] = item.product.to_dict() if item.product else None
            order_items.append(item_dict)
        order_dict['items'] = order_items
        
        return jsonify({'order': order_dict}), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch order: {str(e)}'}), 500

@orders_bp.route('/orders', methods=['POST'])
@token_required
def create_order(current_user):
    try:
        if current_user.role != UserRole.BUYER:
            return jsonify({'message': 'Only buyers can create orders'}), 403
        
        data = request.json
        
        # Validate required fields
        if not data.get('vendor_id') or not data.get('items') or not data.get('delivery_type'):
            return jsonify({'message': 'Missing required fields'}), 400
        
        vendor = Vendor.query.get_or_404(data['vendor_id'])
        delivery_type = DeliveryType(data['delivery_type'])
        
        # Calculate order totals
        subtotal = 0
        order_items_data = []
        
        for item_data in data['items']:
            product = Product.query.get_or_404(item_data['product_id'])
            
            # Check stock
            if product.stock_quantity < item_data['quantity']:
                return jsonify({
                    'message': f'Insufficient stock for {product.name}. Available: {product.stock_quantity}'
                }), 400
            
            item_total = product.price * item_data['quantity']
            subtotal += item_total
            
            order_items_data.append({
                'product_id': product.id,
                'quantity': item_data['quantity'],
                'unit_price': product.price,
                'total_price': item_total,
                'special_instructions': item_data.get('special_instructions')
            })
        
        # Calculate fees
        delivery_fee = 0
        if delivery_type == DeliveryType.DELIVERY:
            # Check if order qualifies for free delivery
            if subtotal >= vendor.free_delivery_threshold:
                delivery_fee = 0
            else:
                # Use peak or regular delivery fee based on time (simplified logic)
                current_hour = datetime.now().hour
                is_peak_time = 17 <= current_hour <= 20  # 5 PM to 8 PM
                delivery_fee = vendor.peak_delivery_fee if is_peak_time else vendor.delivery_fee
        
        service_fee = subtotal * 0.05  # 5% service fee
        discount_amount = data.get('discount_amount', 0)
        total_amount = subtotal + delivery_fee + service_fee - discount_amount
        
        # Create order
        order = Order(
            order_number=generate_order_number(),
            customer_id=current_user.id,
            vendor_id=vendor.id,
            status=OrderStatus.PENDING,
            delivery_type=delivery_type,
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            service_fee=service_fee,
            discount_amount=discount_amount,
            total_amount=total_amount,
            delivery_address=data.get('delivery_address'),
            delivery_instructions=data.get('delivery_instructions'),
            customer_notes=data.get('customer_notes'),
            payment_method=data.get('payment_method', 'card'),
            payment_status='pending'
        )
        
        # Generate pickup code for pickup orders
        if delivery_type == DeliveryType.PICKUP:
            order.pickup_code = generate_pickup_code()
        
        # Set estimated delivery time
        prep_time = vendor.preparation_time
        if delivery_type == DeliveryType.DELIVERY:
            prep_time += 30  # Add 30 minutes for delivery
        
        order.estimated_delivery_time = datetime.utcnow() + timedelta(minutes=prep_time)
        
        db.session.add(order)
        db.session.flush()  # Get order ID
        
        # Create order items and update stock
        for item_data in order_items_data:
            order_item = OrderItem(
                order_id=order.id,
                **item_data
            )
            db.session.add(order_item)
            
            # Update product stock
            product = Product.query.get(item_data['product_id'])
            product.stock_quantity -= item_data['quantity']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create order: {str(e)}'}), 500

@orders_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@token_required
def update_order_status(current_user, order_id):
    try:
        order = Order.query.get_or_404(order_id)
        data = request.json
        new_status = OrderStatus(data['status'])
        
        # Check permissions based on status change
        can_update = False
        
        if current_user.role == UserRole.ADMIN:
            can_update = True
        elif current_user.role == UserRole.VENDOR:
            vendor = Vendor.query.filter_by(user_id=current_user.id).first()
            if vendor and order.vendor_id == vendor.id:
                # Vendors can update to confirmed, preparing, ready_for_pickup
                allowed_statuses = [OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP]
                if new_status in allowed_statuses:
                    can_update = True
        elif current_user.role == UserRole.RIDER:
            rider = Rider.query.filter_by(user_id=current_user.id).first()
            if rider and order.rider_id == rider.id:
                # Riders can update to out_for_delivery, delivered
                allowed_statuses = [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED]
                if new_status in allowed_statuses:
                    can_update = True
        elif current_user.role == UserRole.BUYER and order.customer_id == current_user.id:
            # Buyers can only cancel orders
            if new_status == OrderStatus.CANCELLED and order.status == OrderStatus.PENDING:
                can_update = True
        
        if not can_update:
            return jsonify({'message': 'Access denied or invalid status transition'}), 403
        
        # Update status and timestamps
        old_status = order.status
        order.status = new_status
        
        if new_status == OrderStatus.PREPARING and old_status != OrderStatus.PREPARING:
            order.preparation_started_at = datetime.utcnow()
        elif new_status == OrderStatus.READY_FOR_PICKUP and old_status != OrderStatus.READY_FOR_PICKUP:
            order.ready_for_pickup_at = datetime.utcnow()
        elif new_status == OrderStatus.OUT_FOR_DELIVERY and old_status != OrderStatus.OUT_FOR_DELIVERY:
            order.out_for_delivery_at = datetime.utcnow()
        elif new_status == OrderStatus.DELIVERED and old_status != OrderStatus.DELIVERED:
            order.delivered_at = datetime.utcnow()
            order.payment_status = 'completed'
            
            # Update vendor stats
            vendor = order.vendor
            vendor.total_orders += 1
            
            # Update rider stats if applicable
            if order.rider:
                rider = order.rider
                rider.total_deliveries += 1
                rider.successful_deliveries += 1
        
        # Add notes if provided
        if data.get('notes'):
            if current_user.role == UserRole.VENDOR:
                order.vendor_notes = data['notes']
            elif current_user.role == UserRole.RIDER:
                order.rider_notes = data['notes']
        
        order.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Order status updated successfully',
            'order': order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update order status: {str(e)}'}), 500

@orders_bp.route('/orders/<int:order_id>/assign-rider', methods=['PUT'])
@token_required
def assign_rider_to_order(current_user, order_id):
    try:
        order = Order.query.get_or_404(order_id)
        
        # Only vendors and admins can assign riders
        can_assign = False
        if current_user.role == UserRole.ADMIN:
            can_assign = True
        elif current_user.role == UserRole.VENDOR:
            vendor = Vendor.query.filter_by(user_id=current_user.id).first()
            if vendor and order.vendor_id == vendor.id:
                can_assign = True
        
        if not can_assign:
            return jsonify({'message': 'Access denied'}), 403
        
        data = request.json
        rider_id = data.get('rider_id')
        
        if rider_id:
            # Assign specific rider
            rider = Rider.query.filter_by(id=rider_id, is_active=True, is_verified=True).first()
            if not rider:
                return jsonify({'message': 'Rider not found or not available'}), 404
            
            order.rider_id = rider_id
        else:
            # Auto-assign available rider
            # Find available riders assigned to this vendor
            from src.models.models import VendorRider
            available_riders = db.session.query(Rider).join(
                VendorRider, Rider.id == VendorRider.rider_id
            ).filter(
                VendorRider.vendor_id == order.vendor_id,
                VendorRider.is_active == True,
                Rider.is_active == True,
                Rider.is_available == True,
                Rider.is_verified == True
            ).all()
            
            if not available_riders:
                return jsonify({'message': 'No available riders found'}), 404
            
            # Simple assignment - pick first available rider
            # In production, this could use more sophisticated logic (distance, rating, etc.)
            selected_rider = available_riders[0]
            order.rider_id = selected_rider.id
        
        order.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Rider assigned successfully',
            'order': order.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to assign rider: {str(e)}'}), 500

@orders_bp.route('/orders/analytics', methods=['GET'])
@token_required
def get_orders_analytics(current_user):
    try:
        # Only admin can access global analytics
        if current_user.role != UserRole.ADMIN:
            return jsonify({'message': 'Admin access required'}), 403
        
        from sqlalchemy import func
        
        # Total orders
        total_orders = Order.query.count()
        
        # Orders by status
        status_counts = db.session.query(
            Order.status, func.count(Order.id)
        ).group_by(Order.status).all()
        
        status_data = {status.value: count for status, count in status_counts}
        
        # Revenue
        total_revenue = db.session.query(func.sum(Order.total_amount)).filter(
            Order.status == OrderStatus.DELIVERED
        ).scalar() or 0
        
        # Recent orders
        recent_orders = Order.query.order_by(Order.created_at.desc()).limit(10).all()
        
        analytics = {
            'total_orders': total_orders,
            'orders_by_status': status_data,
            'total_revenue': float(total_revenue),
            'recent_orders': [order.to_dict() for order in recent_orders]
        }
        
        return jsonify({'analytics': analytics}), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch analytics: {str(e)}'}), 500

