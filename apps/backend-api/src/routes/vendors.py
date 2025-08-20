from flask import Blueprint, jsonify, request
from src.models.models import Vendor, User, UserRole, Rider, VendorRider, Product, Order, db
from src.routes.user import token_required
from datetime import datetime
from sqlalchemy import func

vendors_bp = Blueprint('vendors', __name__)

@vendors_bp.route('/vendors', methods=['GET'])
def get_vendors():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        verified_only = request.args.get('verified', type=bool)
        
        query = Vendor.query.filter_by(is_active=True)
        
        if search:
            query = query.filter(
                Vendor.business_name.contains(search) |
                Vendor.business_description.contains(search)
            )
        
        if verified_only:
            query = query.filter_by(is_verified=True)
        
        vendors = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Include user information and stats
        vendors_data = []
        for vendor in vendors.items:
            vendor_dict = vendor.to_dict()
            vendor_dict['user'] = vendor.user.to_dict() if vendor.user else None
            
            # Add product count
            product_count = Product.query.filter_by(vendor_id=vendor.id, is_active=True).count()
            vendor_dict['product_count'] = product_count
            
            vendors_data.append(vendor_dict)
        
        return jsonify({
            'vendors': vendors_data,
            'total': vendors.total,
            'pages': vendors.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch vendors: {str(e)}'}), 500

@vendors_bp.route('/vendors/<int:vendor_id>', methods=['GET'])
def get_vendor(vendor_id):
    try:
        vendor = Vendor.query.filter_by(id=vendor_id, is_active=True).first_or_404()
        
        vendor_dict = vendor.to_dict()
        vendor_dict['user'] = vendor.user.to_dict() if vendor.user else None
        
        # Add statistics
        product_count = Product.query.filter_by(vendor_id=vendor.id, is_active=True).count()
        vendor_dict['product_count'] = product_count
        
        # Add assigned riders
        assigned_riders = db.session.query(Rider, VendorRider).join(
            VendorRider, Rider.id == VendorRider.rider_id
        ).filter(
            VendorRider.vendor_id == vendor.id,
            VendorRider.is_active == True
        ).all()
        
        riders_data = []
        for rider, assignment in assigned_riders:
            rider_dict = rider.to_dict()
            rider_dict['user'] = rider.user.to_dict() if rider.user else None
            rider_dict['assigned_at'] = assignment.assigned_at.isoformat() if assignment.assigned_at else None
            riders_data.append(rider_dict)
        
        vendor_dict['assigned_riders'] = riders_data
        
        return jsonify({'vendor': vendor_dict}), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch vendor: {str(e)}'}), 500

@vendors_bp.route('/vendors/profile', methods=['GET'])
@token_required
def get_vendor_profile(current_user):
    try:
        if current_user.role != UserRole.VENDOR:
            return jsonify({'message': 'Only vendors can access this endpoint'}), 403
        
        vendor = Vendor.query.filter_by(user_id=current_user.id).first()
        if not vendor:
            return jsonify({'message': 'Vendor profile not found'}), 404
        
        vendor_dict = vendor.to_dict()
        vendor_dict['user'] = current_user.to_dict()
        
        # Add statistics
        product_count = Product.query.filter_by(vendor_id=vendor.id, is_active=True).count()
        vendor_dict['product_count'] = product_count
        
        return jsonify({'vendor': vendor_dict}), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch vendor profile: {str(e)}'}), 500

@vendors_bp.route('/vendors/profile', methods=['POST'])
@token_required
def create_vendor_profile(current_user):
    try:
        if current_user.role != UserRole.VENDOR:
            return jsonify({'message': 'Only vendors can create vendor profiles'}), 403
        
        # Check if vendor profile already exists
        existing_vendor = Vendor.query.filter_by(user_id=current_user.id).first()
        if existing_vendor:
            return jsonify({'message': 'Vendor profile already exists'}), 400
        
        data = request.json
        
        vendor = Vendor(
            user_id=current_user.id,
            business_name=data['business_name'],
            business_description=data.get('business_description'),
            business_address=data.get('business_address'),
            business_phone=data.get('business_phone'),
            business_email=data.get('business_email'),
            business_registration=data.get('business_registration'),
            vat_number=data.get('vat_number'),
            delivery_fee=data.get('delivery_fee', 0.0),
            peak_delivery_fee=data.get('peak_delivery_fee', 0.0),
            free_delivery_threshold=data.get('free_delivery_threshold', 0.0),
            delivery_radius=data.get('delivery_radius', 5.0),
            preparation_time=data.get('preparation_time', 30)
        )
        
        db.session.add(vendor)
        db.session.commit()
        
        return jsonify({
            'message': 'Vendor profile created successfully',
            'vendor': vendor.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create vendor profile: {str(e)}'}), 500

@vendors_bp.route('/vendors/profile', methods=['PUT'])
@token_required
def update_vendor_profile(current_user):
    try:
        if current_user.role != UserRole.VENDOR:
            return jsonify({'message': 'Only vendors can update vendor profiles'}), 403
        
        vendor = Vendor.query.filter_by(user_id=current_user.id).first()
        if not vendor:
            return jsonify({'message': 'Vendor profile not found'}), 404
        
        data = request.json
        
        # Update allowed fields
        allowed_fields = [
            'business_name', 'business_description', 'business_address',
            'business_phone', 'business_email', 'business_registration',
            'vat_number', 'delivery_fee', 'peak_delivery_fee',
            'free_delivery_threshold', 'delivery_radius', 'preparation_time'
        ]
        
        for field in allowed_fields:
            if field in data:
                setattr(vendor, field, data[field])
        
        vendor.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Vendor profile updated successfully',
            'vendor': vendor.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update vendor profile: {str(e)}'}), 500

@vendors_bp.route('/vendors/<int:vendor_id>/riders', methods=['GET'])
@token_required
def get_vendor_riders(current_user, vendor_id):
    try:
        # Check access permissions
        if current_user.role == UserRole.VENDOR:
            vendor = Vendor.query.filter_by(user_id=current_user.id, id=vendor_id).first()
            if not vendor:
                return jsonify({'message': 'Access denied'}), 403
        elif current_user.role != UserRole.ADMIN:
            return jsonify({'message': 'Access denied'}), 403
        
        # Get assigned riders
        assigned_riders = db.session.query(Rider, VendorRider).join(
            VendorRider, Rider.id == VendorRider.rider_id
        ).filter(
            VendorRider.vendor_id == vendor_id,
            VendorRider.is_active == True
        ).all()
        
        riders_data = []
        for rider, assignment in assigned_riders:
            rider_dict = rider.to_dict()
            rider_dict['user'] = rider.user.to_dict() if rider.user else None
            rider_dict['assigned_at'] = assignment.assigned_at.isoformat() if assignment.assigned_at else None
            riders_data.append(rider_dict)
        
        return jsonify({'riders': riders_data}), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch vendor riders: {str(e)}'}), 500

@vendors_bp.route('/vendors/<int:vendor_id>/riders/<int:rider_id>', methods=['POST'])
@token_required
def assign_rider_to_vendor(current_user, vendor_id, rider_id):
    try:
        # Check access permissions
        if current_user.role == UserRole.VENDOR:
            vendor = Vendor.query.filter_by(user_id=current_user.id, id=vendor_id).first()
            if not vendor:
                return jsonify({'message': 'Access denied'}), 403
        elif current_user.role != UserRole.ADMIN:
            return jsonify({'message': 'Access denied'}), 403
        
        # Check if rider exists and is verified
        rider = Rider.query.filter_by(id=rider_id, is_verified=True, is_active=True).first()
        if not rider:
            return jsonify({'message': 'Rider not found or not verified'}), 404
        
        # Check if assignment already exists
        existing_assignment = VendorRider.query.filter_by(
            vendor_id=vendor_id, rider_id=rider_id, is_active=True
        ).first()
        
        if existing_assignment:
            return jsonify({'message': 'Rider already assigned to this vendor'}), 400
        
        # Create assignment
        assignment = VendorRider(vendor_id=vendor_id, rider_id=rider_id)
        db.session.add(assignment)
        db.session.commit()
        
        return jsonify({
            'message': 'Rider assigned successfully',
            'assignment': assignment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to assign rider: {str(e)}'}), 500

@vendors_bp.route('/vendors/<int:vendor_id>/riders/<int:rider_id>', methods=['DELETE'])
@token_required
def unassign_rider_from_vendor(current_user, vendor_id, rider_id):
    try:
        # Check access permissions
        if current_user.role == UserRole.VENDOR:
            vendor = Vendor.query.filter_by(user_id=current_user.id, id=vendor_id).first()
            if not vendor:
                return jsonify({'message': 'Access denied'}), 403
        elif current_user.role != UserRole.ADMIN:
            return jsonify({'message': 'Access denied'}), 403
        
        # Find and deactivate assignment
        assignment = VendorRider.query.filter_by(
            vendor_id=vendor_id, rider_id=rider_id, is_active=True
        ).first()
        
        if not assignment:
            return jsonify({'message': 'Assignment not found'}), 404
        
        assignment.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Rider unassigned successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to unassign rider: {str(e)}'}), 500

@vendors_bp.route('/vendors/<int:vendor_id>/analytics', methods=['GET'])
@token_required
def get_vendor_analytics(current_user, vendor_id):
    try:
        # Check access permissions
        if current_user.role == UserRole.VENDOR:
            vendor = Vendor.query.filter_by(user_id=current_user.id, id=vendor_id).first()
            if not vendor:
                return jsonify({'message': 'Access denied'}), 403
        elif current_user.role != UserRole.ADMIN:
            return jsonify({'message': 'Access denied'}), 403
        
        # Get analytics data
        total_products = Product.query.filter_by(vendor_id=vendor_id, is_active=True).count()
        total_orders = Order.query.filter_by(vendor_id=vendor_id).count()
        
        # Revenue calculation (sum of completed orders)
        from src.models.models import OrderStatus
        total_revenue = db.session.query(func.sum(Order.total_amount)).filter(
            Order.vendor_id == vendor_id,
            Order.status == OrderStatus.DELIVERED
        ).scalar() or 0
        
        # Recent orders
        recent_orders = Order.query.filter_by(vendor_id=vendor_id).order_by(
            Order.created_at.desc()
        ).limit(10).all()
        
        analytics = {
            'total_products': total_products,
            'total_orders': total_orders,
            'total_revenue': float(total_revenue),
            'recent_orders': [order.to_dict() for order in recent_orders]
        }
        
        return jsonify({'analytics': analytics}), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch analytics: {str(e)}'}), 500

