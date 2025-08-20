from flask import Blueprint, jsonify, request
from src.models.models import Rider, User, UserRole, Order, OrderStatus, VendorRider, db
from src.routes.user import token_required
from datetime import datetime
from sqlalchemy import func

riders_bp = Blueprint('riders', __name__)

@riders_bp.route('/riders', methods=['GET'])
@token_required
def get_riders(current_user):
    try:
        # Only admin and vendors can list riders
        if current_user.role not in [UserRole.ADMIN, UserRole.VENDOR]:
            return jsonify({'message': 'Access denied'}), 403
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        available_only = request.args.get('available', type=bool)
        verified_only = request.args.get('verified', type=bool)
        
        query = Rider.query.filter_by(is_active=True)
        
        if available_only:
            query = query.filter_by(is_available=True)
        
        if verified_only:
            query = query.filter_by(is_verified=True)
        
        # If vendor, only show assigned riders
        if current_user.role == UserRole.VENDOR:
            from src.models.models import Vendor
            vendor = Vendor.query.filter_by(user_id=current_user.id).first()
            if vendor:
                query = query.join(VendorRider).filter(
                    VendorRider.vendor_id == vendor.id,
                    VendorRider.is_active == True
                )
        
        riders = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Include user information and stats
        riders_data = []
        for rider in riders.items:
            rider_dict = rider.to_dict()
            rider_dict['user'] = rider.user.to_dict() if rider.user else None
            
            # Add delivery stats
            active_deliveries = Order.query.filter(
                Order.rider_id == rider.id,
                Order.status.in_([OrderStatus.OUT_FOR_DELIVERY])
            ).count()
            rider_dict['active_deliveries'] = active_deliveries
            
            riders_data.append(rider_dict)
        
        return jsonify({
            'riders': riders_data,
            'total': riders.total,
            'pages': riders.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch riders: {str(e)}'}), 500

@riders_bp.route('/riders/<int:rider_id>', methods=['GET'])
@token_required
def get_rider(current_user, rider_id):
    try:
        rider = Rider.query.filter_by(id=rider_id, is_active=True).first_or_404()
        
        # Check access permissions
        can_access = False
        if current_user.role == UserRole.ADMIN:
            can_access = True
        elif current_user.role == UserRole.RIDER and rider.user_id == current_user.id:
            can_access = True
        elif current_user.role == UserRole.VENDOR:
            # Check if rider is assigned to vendor
            from src.models.models import Vendor
            vendor = Vendor.query.filter_by(user_id=current_user.id).first()
            if vendor:
                assignment = VendorRider.query.filter_by(
                    vendor_id=vendor.id, rider_id=rider_id, is_active=True
                ).first()
                if assignment:
                    can_access = True
        
        if not can_access:
            return jsonify({'message': 'Access denied'}), 403
        
        rider_dict = rider.to_dict()
        rider_dict['user'] = rider.user.to_dict() if rider.user else None
        
        # Add statistics
        active_deliveries = Order.query.filter(
            Order.rider_id == rider.id,
            Order.status.in_([OrderStatus.OUT_FOR_DELIVERY])
        ).count()
        rider_dict['active_deliveries'] = active_deliveries
        
        # Add recent deliveries
        recent_deliveries = Order.query.filter_by(rider_id=rider.id).order_by(
            Order.created_at.desc()
        ).limit(10).all()
        rider_dict['recent_deliveries'] = [order.to_dict() for order in recent_deliveries]
        
        return jsonify({'rider': rider_dict}), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch rider: {str(e)}'}), 500

@riders_bp.route('/riders/profile', methods=['GET'])
@token_required
def get_rider_profile(current_user):
    try:
        if current_user.role != UserRole.RIDER:
            return jsonify({'message': 'Only riders can access this endpoint'}), 403
        
        rider = Rider.query.filter_by(user_id=current_user.id).first()
        if not rider:
            return jsonify({'message': 'Rider profile not found'}), 404
        
        rider_dict = rider.to_dict()
        rider_dict['user'] = current_user.to_dict()
        
        # Add statistics
        active_deliveries = Order.query.filter(
            Order.rider_id == rider.id,
            Order.status.in_([OrderStatus.OUT_FOR_DELIVERY])
        ).count()
        rider_dict['active_deliveries'] = active_deliveries
        
        return jsonify({'rider': rider_dict}), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch rider profile: {str(e)}'}), 500

@riders_bp.route('/riders/profile', methods=['POST'])
@token_required
def create_rider_profile(current_user):
    try:
        if current_user.role != UserRole.RIDER:
            return jsonify({'message': 'Only riders can create rider profiles'}), 403
        
        # Check if rider profile already exists
        existing_rider = Rider.query.filter_by(user_id=current_user.id).first()
        if existing_rider:
            return jsonify({'message': 'Rider profile already exists'}), 400
        
        data = request.json
        
        rider = Rider(
            user_id=current_user.id,
            vehicle_type=data.get('vehicle_type'),
            license_number=data.get('license_number'),
            vehicle_registration=data.get('vehicle_registration')
        )
        
        db.session.add(rider)
        db.session.commit()
        
        return jsonify({
            'message': 'Rider profile created successfully',
            'rider': rider.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create rider profile: {str(e)}'}), 500

@riders_bp.route('/riders/profile', methods=['PUT'])
@token_required
def update_rider_profile(current_user):
    try:
        if current_user.role != UserRole.RIDER:
            return jsonify({'message': 'Only riders can update rider profiles'}), 403
        
        rider = Rider.query.filter_by(user_id=current_user.id).first()
        if not rider:
            return jsonify({'message': 'Rider profile not found'}), 404
        
        data = request.json
        
        # Update allowed fields
        allowed_fields = [
            'vehicle_type', 'license_number', 'vehicle_registration'
        ]
        
        for field in allowed_fields:
            if field in data:
                setattr(rider, field, data[field])
        
        rider.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Rider profile updated successfully',
            'rider': rider.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update rider profile: {str(e)}'}), 500

@riders_bp.route('/riders/availability', methods=['PUT'])
@token_required
def update_rider_availability(current_user):
    try:
        if current_user.role != UserRole.RIDER:
            return jsonify({'message': 'Only riders can update availability'}), 403
        
        rider = Rider.query.filter_by(user_id=current_user.id).first()
        if not rider:
            return jsonify({'message': 'Rider profile not found'}), 404
        
        data = request.json
        is_available = data.get('is_available')
        
        if is_available is None:
            return jsonify({'message': 'is_available field is required'}), 400
        
        rider.is_available = is_available
        rider.updated_at = datetime.utcnow()
        db.session.commit()
        
        status = 'available' if is_available else 'unavailable'
        return jsonify({
            'message': f'Rider status updated to {status}',
            'rider': rider.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update availability: {str(e)}'}), 500

@riders_bp.route('/riders/location', methods=['PUT'])
@token_required
def update_rider_location(current_user):
    try:
        if current_user.role != UserRole.RIDER:
            return jsonify({'message': 'Only riders can update location'}), 403
        
        rider = Rider.query.filter_by(user_id=current_user.id).first()
        if not rider:
            return jsonify({'message': 'Rider profile not found'}), 404
        
        data = request.json
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        
        if latitude is None or longitude is None:
            return jsonify({'message': 'Latitude and longitude are required'}), 400
        
        rider.current_latitude = latitude
        rider.current_longitude = longitude
        rider.last_location_update = datetime.utcnow()
        rider.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Location updated successfully',
            'rider': rider.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update location: {str(e)}'}), 500

@riders_bp.route('/riders/deliveries', methods=['GET'])
@token_required
def get_rider_deliveries(current_user):
    try:
        if current_user.role != UserRole.RIDER:
            return jsonify({'message': 'Only riders can access this endpoint'}), 403
        
        rider = Rider.query.filter_by(user_id=current_user.id).first()
        if not rider:
            return jsonify({'message': 'Rider profile not found'}), 404
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        
        query = Order.query.filter_by(rider_id=rider.id)
        
        if status:
            query = query.filter_by(status=OrderStatus(status))
        
        orders = query.order_by(Order.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Include related data
        orders_data = []
        for order in orders.items:
            order_dict = order.to_dict()
            order_dict['customer'] = order.customer.to_dict() if order.customer else None
            order_dict['vendor'] = order.vendor.to_dict() if order.vendor else None
            orders_data.append(order_dict)
        
        return jsonify({
            'deliveries': orders_data,
            'total': orders.total,
            'pages': orders.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch deliveries: {str(e)}'}), 500

@riders_bp.route('/riders/analytics', methods=['GET'])
@token_required
def get_rider_analytics(current_user):
    try:
        if current_user.role != UserRole.RIDER:
            return jsonify({'message': 'Only riders can access this endpoint'}), 403
        
        rider = Rider.query.filter_by(user_id=current_user.id).first()
        if not rider:
            return jsonify({'message': 'Rider profile not found'}), 404
        
        # Get analytics data
        total_deliveries = Order.query.filter_by(rider_id=rider.id).count()
        completed_deliveries = Order.query.filter_by(
            rider_id=rider.id, status=OrderStatus.DELIVERED
        ).count()
        
        active_deliveries = Order.query.filter(
            Order.rider_id == rider.id,
            Order.status.in_([OrderStatus.OUT_FOR_DELIVERY])
        ).count()
        
        # Calculate success rate
        success_rate = (completed_deliveries / total_deliveries * 100) if total_deliveries > 0 else 0
        
        # Recent deliveries
        recent_deliveries = Order.query.filter_by(rider_id=rider.id).order_by(
            Order.created_at.desc()
        ).limit(10).all()
        
        analytics = {
            'total_deliveries': total_deliveries,
            'completed_deliveries': completed_deliveries,
            'active_deliveries': active_deliveries,
            'success_rate': round(success_rate, 2),
            'rating': rider.rating,
            'recent_deliveries': [order.to_dict() for order in recent_deliveries]
        }
        
        return jsonify({'analytics': analytics}), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch analytics: {str(e)}'}), 500

@riders_bp.route('/riders/<int:rider_id>/verify', methods=['PUT'])
@token_required
def verify_rider(current_user, rider_id):
    try:
        # Only admin can verify riders
        if current_user.role != UserRole.ADMIN:
            return jsonify({'message': 'Admin access required'}), 403
        
        rider = Rider.query.get_or_404(rider_id)
        data = request.json
        
        rider.is_verified = data.get('is_verified', True)
        rider.updated_at = datetime.utcnow()
        db.session.commit()
        
        status = 'verified' if rider.is_verified else 'unverified'
        return jsonify({
            'message': f'Rider {status} successfully',
            'rider': rider.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to verify rider: {str(e)}'}), 500

