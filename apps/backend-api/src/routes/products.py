from flask import Blueprint, jsonify, request
from src.models.models import Product, Category, Vendor, User, UserRole, db
from src.routes.user import token_required
from datetime import datetime
import uuid

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        category_id = request.args.get('category_id', type=int)
        vendor_id = request.args.get('vendor_id', type=int)
        search = request.args.get('search', '')
        featured = request.args.get('featured', type=bool)
        
        query = Product.query.filter_by(is_active=True)
        
        if category_id:
            query = query.filter_by(category_id=category_id)
        
        if vendor_id:
            query = query.filter_by(vendor_id=vendor_id)
        
        if search:
            query = query.filter(
                Product.name.contains(search) | 
                Product.description.contains(search) |
                Product.tags.contains(search)
            )
        
        if featured is not None:
            query = query.filter_by(is_featured=featured)
        
        products = query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Include vendor and category information
        products_data = []
        for product in products.items:
            product_dict = product.to_dict()
            product_dict['vendor'] = product.vendor.to_dict() if product.vendor else None
            product_dict['category'] = product.category.to_dict() if product.category else None
            products_data.append(product_dict)
        
        return jsonify({
            'products': products_data,
            'total': products.total,
            'pages': products.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch products: {str(e)}'}), 500

@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.filter_by(id=product_id, is_active=True).first_or_404()
        
        product_dict = product.to_dict()
        product_dict['vendor'] = product.vendor.to_dict() if product.vendor else None
        product_dict['category'] = product.category.to_dict() if product.category else None
        
        return jsonify({'product': product_dict}), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch product: {str(e)}'}), 500

@products_bp.route('/products', methods=['POST'])
@token_required
def create_product(current_user):
    try:
        # Only vendors can create products
        if current_user.role != UserRole.VENDOR:
            return jsonify({'message': 'Only vendors can create products'}), 403
        
        # Get vendor profile
        vendor = Vendor.query.filter_by(user_id=current_user.id).first()
        if not vendor:
            return jsonify({'message': 'Vendor profile not found'}), 404
        
        data = request.json
        
        # Generate SKU if not provided
        sku = data.get('sku')
        if not sku:
            sku = f"HO-{vendor.id}-{str(uuid.uuid4())[:8].upper()}"
        
        product = Product(
            vendor_id=vendor.id,
            category_id=data['category_id'],
            name=data['name'],
            description=data.get('description'),
            price=data['price'],
            original_price=data.get('original_price'),
            sku=sku,
            barcode=data.get('barcode'),
            weight=data.get('weight'),
            unit=data.get('unit', 'piece'),
            stock_quantity=data.get('stock_quantity', 0),
            low_stock_threshold=data.get('low_stock_threshold', 5),
            is_featured=data.get('is_featured', False),
            image_url=data.get('image_url'),
            additional_images=data.get('additional_images'),
            tags=data.get('tags'),
            origin_country=data.get('origin_country'),
            cultural_significance=data.get('cultural_significance')
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'message': 'Product created successfully',
            'product': product.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create product: {str(e)}'}), 500

@products_bp.route('/products/<int:product_id>', methods=['PUT'])
@token_required
def update_product(current_user, product_id):
    try:
        product = Product.query.get_or_404(product_id)
        
        # Only the vendor who owns the product or admin can update it
        if current_user.role == UserRole.VENDOR:
            vendor = Vendor.query.filter_by(user_id=current_user.id).first()
            if not vendor or product.vendor_id != vendor.id:
                return jsonify({'message': 'Access denied'}), 403
        elif current_user.role != UserRole.ADMIN:
            return jsonify({'message': 'Access denied'}), 403
        
        data = request.json
        
        # Update allowed fields
        allowed_fields = [
            'category_id', 'name', 'description', 'price', 'original_price',
            'barcode', 'weight', 'unit', 'stock_quantity', 'low_stock_threshold',
            'is_featured', 'image_url', 'additional_images', 'tags',
            'origin_country', 'cultural_significance'
        ]
        
        for field in allowed_fields:
            if field in data:
                setattr(product, field, data[field])
        
        # Only admin can change active status
        if current_user.role == UserRole.ADMIN and 'is_active' in data:
            product.is_active = data['is_active']
        
        product.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Product updated successfully',
            'product': product.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to update product: {str(e)}'}), 500

@products_bp.route('/products/<int:product_id>', methods=['DELETE'])
@token_required
def delete_product(current_user, product_id):
    try:
        product = Product.query.get_or_404(product_id)
        
        # Only the vendor who owns the product or admin can delete it
        if current_user.role == UserRole.VENDOR:
            vendor = Vendor.query.filter_by(user_id=current_user.id).first()
            if not vendor or product.vendor_id != vendor.id:
                return jsonify({'message': 'Access denied'}), 403
        elif current_user.role != UserRole.ADMIN:
            return jsonify({'message': 'Access denied'}), 403
        
        # Soft delete - just mark as inactive
        product.is_active = False
        product.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to delete product: {str(e)}'}), 500

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.filter_by(is_active=True).all()
        return jsonify({
            'categories': [category.to_dict() for category in categories]
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Failed to fetch categories: {str(e)}'}), 500

@products_bp.route('/categories', methods=['POST'])
@token_required
def create_category(current_user):
    try:
        # Only admin can create categories
        if current_user.role != UserRole.ADMIN:
            return jsonify({'message': 'Admin access required'}), 403
        
        data = request.json
        
        category = Category(
            name=data['name'],
            description=data.get('description'),
            image_url=data.get('image_url')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify({
            'message': 'Category created successfully',
            'category': category.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to create category: {str(e)}'}), 500

