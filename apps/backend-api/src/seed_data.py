from src.models.models import (
    db, User, UserRole, Category, Vendor, Rider, Product, 
    Order, OrderItem, OrderStatus, DeliveryType, VendorRider
)
from datetime import datetime, timedelta
import random

def create_sample_data():
    """Create sample data for the Home Origin platform"""
    
    # Create categories
    categories = [
        {
            'name': 'Spices & Seasonings',
            'description': 'Authentic African and Caribbean spices and seasonings',
            'image_url': '/images/categories/spices.jpg'
        },
        {
            'name': 'Rice & Grains',
            'description': 'Traditional rice varieties and grains',
            'image_url': '/images/categories/rice.jpg'
        },
        {
            'name': 'Fresh Produce',
            'description': 'Fresh fruits and vegetables from the Caribbean and Africa',
            'image_url': '/images/categories/produce.jpg'
        },
        {
            'name': 'Beverages',
            'description': 'Traditional drinks and beverages',
            'image_url': '/images/categories/beverages.jpg'
        },
        {
            'name': 'Snacks & Sweets',
            'description': 'Traditional snacks and sweet treats',
            'image_url': '/images/categories/snacks.jpg'
        },
        {
            'name': 'Cooking Essentials',
            'description': 'Essential cooking ingredients and oils',
            'image_url': '/images/categories/cooking.jpg'
        }
    ]
    
    category_objects = []
    for cat_data in categories:
        category = Category(**cat_data)
        db.session.add(category)
        category_objects.append(category)
    
    db.session.commit()
    
    # Create admin user
    admin_user = User(
        username='admin',
        email='admin@homeorigin.co.uk',
        first_name='Admin',
        last_name='User',
        phone='+44 20 1234 5678',
        role=UserRole.ADMIN,
        address_line1='123 Admin Street',
        city='London',
        postcode='SW1A 1AA',
        country='UK'
    )
    admin_user.set_password('admin123')
    db.session.add(admin_user)
    
    # Create vendor users and profiles
    vendor_data = [
        {
            'user': {
                'username': 'mama_kemi',
                'email': 'kemi@mamakemispices.co.uk',
                'first_name': 'Kemi',
                'last_name': 'Adebayo',
                'phone': '+44 20 7123 4567',
                'role': UserRole.VENDOR,
                'address_line1': '45 Peckham High Street',
                'city': 'London',
                'postcode': 'SE15 5DQ',
                'country': 'UK'
            },
            'vendor': {
                'business_name': "Mama Kemi's Nigerian Spices",
                'business_description': 'Authentic Nigerian spices and ingredients sourced directly from Nigeria. Family recipes passed down through generations.',
                'business_address': '45 Peckham High Street, London SE15 5DQ',
                'business_phone': '+44 20 7123 4567',
                'business_email': 'orders@mamakemispices.co.uk',
                'delivery_fee': 3.50,
                'peak_delivery_fee': 5.00,
                'free_delivery_threshold': 25.00,
                'delivery_radius': 8.0,
                'preparation_time': 45,
                'is_verified': True,
                'rating': 4.8
            }
        },
        {
            'user': {
                'username': 'caribbean_delights',
                'email': 'info@caribbeandelights.co.uk',
                'first_name': 'Marcus',
                'last_name': 'Johnson',
                'phone': '+44 20 8234 5678',
                'role': UserRole.VENDOR,
                'address_line1': '78 Brixton Road',
                'city': 'London',
                'postcode': 'SW9 6BE',
                'country': 'UK'
            },
            'vendor': {
                'business_name': 'Caribbean Delights',
                'business_description': 'Fresh Caribbean produce and traditional ingredients. Bringing the taste of the islands to London.',
                'business_address': '78 Brixton Road, London SW9 6BE',
                'business_phone': '+44 20 8234 5678',
                'business_email': 'hello@caribbeandelights.co.uk',
                'delivery_fee': 2.99,
                'peak_delivery_fee': 4.50,
                'free_delivery_threshold': 20.00,
                'delivery_radius': 6.0,
                'preparation_time': 30,
                'is_verified': True,
                'rating': 4.6
            }
        },
        {
            'user': {
                'username': 'ackee_saltfish',
                'email': 'orders@ackeesaltfish.co.uk',
                'first_name': 'Patrice',
                'last_name': 'Williams',
                'phone': '+44 20 7345 6789',
                'role': UserRole.VENDOR,
                'address_line1': '156 Tottenham High Road',
                'city': 'London',
                'postcode': 'N15 3RT',
                'country': 'UK'
            },
            'vendor': {
                'business_name': 'Ackee & Saltfish Market',
                'business_description': 'Specializing in Jamaican staples and hard-to-find Caribbean ingredients.',
                'business_address': '156 Tottenham High Road, London N15 3RT',
                'business_phone': '+44 20 7345 6789',
                'business_email': 'orders@ackeesaltfish.co.uk',
                'delivery_fee': 3.99,
                'peak_delivery_fee': 5.99,
                'free_delivery_threshold': 30.00,
                'delivery_radius': 7.0,
                'preparation_time': 40,
                'is_verified': True,
                'rating': 4.7
            }
        }
    ]
    
    vendor_objects = []
    for vendor_info in vendor_data:
        # Create user
        user = User(**vendor_info['user'])
        user.set_password('vendor123')
        db.session.add(user)
        db.session.flush()  # Get the user ID
        
        # Create vendor profile
        vendor_info['vendor']['user_id'] = user.id
        vendor = Vendor(**vendor_info['vendor'])
        db.session.add(vendor)
        vendor_objects.append(vendor)
    
    db.session.commit()
    
    # Create rider users and profiles
    rider_data = [
        {
            'user': {
                'username': 'kwame_rider',
                'email': 'kwame@homeorigin.co.uk',
                'first_name': 'Kwame',
                'last_name': 'Asante',
                'phone': '+44 7123 456789',
                'role': UserRole.RIDER,
                'address_line1': '23 Elephant Road',
                'city': 'London',
                'postcode': 'SE17 1LB',
                'country': 'UK'
            },
            'rider': {
                'vehicle_type': 'motorcycle',
                'license_number': 'DL123456789',
                'vehicle_registration': 'MO21 ABC',
                'is_verified': True,
                'is_available': True,
                'rating': 4.9,
                'total_deliveries': 156,
                'successful_deliveries': 152
            }
        },
        {
            'user': {
                'username': 'amara_delivery',
                'email': 'amara@homeorigin.co.uk',
                'first_name': 'Amara',
                'last_name': 'Okafor',
                'phone': '+44 7234 567890',
                'role': UserRole.RIDER,
                'address_line1': '67 Camberwell Green',
                'city': 'London',
                'postcode': 'SE5 7AA',
                'country': 'UK'
            },
            'rider': {
                'vehicle_type': 'bicycle',
                'license_number': 'DL987654321',
                'vehicle_registration': 'BI21 XYZ',
                'is_verified': True,
                'is_available': True,
                'rating': 4.7,
                'total_deliveries': 89,
                'successful_deliveries': 87
            }
        }
    ]
    
    rider_objects = []
    for rider_info in rider_data:
        # Create user
        user = User(**rider_info['user'])
        user.set_password('rider123')
        db.session.add(user)
        db.session.flush()  # Get the user ID
        
        # Create rider profile
        rider_info['rider']['user_id'] = user.id
        rider = Rider(**rider_info['rider'])
        db.session.add(rider)
        rider_objects.append(rider)
    
    db.session.commit()
    
    # Assign riders to vendors
    for i, vendor in enumerate(vendor_objects):
        for rider in rider_objects:
            assignment = VendorRider(vendor_id=vendor.id, rider_id=rider.id)
            db.session.add(assignment)
    
    db.session.commit()
    
    # Create sample products
    products_data = [
        # Mama Kemi's products
        {
            'vendor_id': vendor_objects[0].id,
            'category_id': category_objects[0].id,  # Spices
            'name': 'Jollof Rice Spice Mix',
            'description': 'Authentic Nigerian Jollof rice seasoning blend. Perfect for creating the traditional smoky flavor.',
            'price': 4.99,
            'sku': 'MK001',
            'weight': 0.1,
            'unit': 'packet',
            'stock_quantity': 50,
            'is_featured': True,
            'image_url': '/images/products/jollof-spice.jpg',
            'origin_country': 'Nigeria',
            'cultural_significance': 'Jollof rice is a beloved West African dish, often served at celebrations and family gatherings.'
        },
        {
            'vendor_id': vendor_objects[0].id,
            'category_id': category_objects[5].id,  # Cooking Essentials
            'name': 'Premium Palm Oil',
            'description': 'Pure red palm oil imported from Nigeria. Essential for authentic West African cooking.',
            'price': 8.99,
            'sku': 'MK002',
            'weight': 0.5,
            'unit': 'bottle',
            'stock_quantity': 30,
            'image_url': '/images/products/palm-oil.jpg',
            'origin_country': 'Nigeria',
            'cultural_significance': 'Palm oil is fundamental to West African cuisine, providing rich flavor and vibrant color.'
        },
        {
            'vendor_id': vendor_objects[0].id,
            'category_id': category_objects[0].id,  # Spices
            'name': 'Suya Spice Blend',
            'description': 'Traditional Nigerian suya spice mix with groundnuts, ginger, and aromatic spices.',
            'price': 3.99,
            'sku': 'MK003',
            'weight': 0.08,
            'unit': 'packet',
            'stock_quantity': 40,
            'image_url': '/images/products/suya-spice.jpg',
            'origin_country': 'Nigeria'
        },
        
        # Caribbean Delights products
        {
            'vendor_id': vendor_objects[1].id,
            'category_id': category_objects[2].id,  # Fresh Produce
            'name': 'Green Plantains',
            'description': 'Fresh green plantains perfect for frying or boiling. Essential Caribbean ingredient.',
            'price': 2.50,
            'sku': 'CD001',
            'weight': 1.0,
            'unit': 'bunch',
            'stock_quantity': 25,
            'is_featured': True,
            'image_url': '/images/products/green-plantains.jpg',
            'origin_country': 'Jamaica',
            'cultural_significance': 'Plantains are a staple in Caribbean cuisine, used in both sweet and savory dishes.'
        },
        {
            'vendor_id': vendor_objects[1].id,
            'category_id': category_objects[2].id,  # Fresh Produce
            'name': 'Scotch Bonnet Peppers',
            'description': 'Authentic Scotch bonnet peppers - the heart of Caribbean heat and flavor.',
            'price': 1.99,
            'sku': 'CD002',
            'weight': 0.1,
            'unit': 'pack',
            'stock_quantity': 20,
            'image_url': '/images/products/scotch-bonnet.jpg',
            'origin_country': 'Jamaica'
        },
        {
            'vendor_id': vendor_objects[1].id,
            'category_id': category_objects[3].id,  # Beverages
            'name': 'Sorrel Drink Concentrate',
            'description': 'Traditional Caribbean sorrel drink concentrate. Just add water and enjoy!',
            'price': 5.99,
            'sku': 'CD003',
            'weight': 0.5,
            'unit': 'bottle',
            'stock_quantity': 15,
            'image_url': '/images/products/sorrel-drink.jpg',
            'origin_country': 'Jamaica'
        },
        
        # Ackee & Saltfish Market products
        {
            'vendor_id': vendor_objects[2].id,
            'category_id': category_objects[2].id,  # Fresh Produce
            'name': 'Canned Ackee',
            'description': 'Premium quality canned ackee fruit - Jamaica\'s national fruit.',
            'price': 6.99,
            'sku': 'AS001',
            'weight': 0.54,
            'unit': 'can',
            'stock_quantity': 35,
            'is_featured': True,
            'image_url': '/images/products/canned-ackee.jpg',
            'origin_country': 'Jamaica',
            'cultural_significance': 'Ackee is Jamaica\'s national fruit and the key ingredient in the national dish, ackee and saltfish.'
        },
        {
            'vendor_id': vendor_objects[2].id,
            'category_id': category_objects[5].id,  # Cooking Essentials
            'name': 'Saltfish (Cod)',
            'description': 'Premium salted cod fish, perfect for traditional ackee and saltfish.',
            'price': 12.99,
            'sku': 'AS002',
            'weight': 0.5,
            'unit': 'pack',
            'stock_quantity': 20,
            'image_url': '/images/products/saltfish.jpg',
            'origin_country': 'Norway'
        },
        {
            'vendor_id': vendor_objects[2].id,
            'category_id': category_objects[1].id,  # Rice & Grains
            'name': 'Cassava Bread',
            'description': 'Traditional Caribbean cassava bread, gluten-free and delicious.',
            'price': 3.50,
            'sku': 'AS003',
            'weight': 0.3,
            'unit': 'loaf',
            'stock_quantity': 12,
            'image_url': '/images/products/cassava-bread.jpg',
            'origin_country': 'Trinidad'
        }
    ]
    
    product_objects = []
    for product_data in products_data:
        product = Product(**product_data)
        db.session.add(product)
        product_objects.append(product)
    
    db.session.commit()
    
    # Create sample customer users
    customer_data = [
        {
            'username': 'john_buyer',
            'email': 'john@example.com',
            'first_name': 'John',
            'last_name': 'Smith',
            'phone': '+44 7456 789012',
            'role': UserRole.BUYER,
            'address_line1': '12 Heritage Lane',
            'city': 'London',
            'postcode': 'SW2 3AB',
            'country': 'UK'
        },
        {
            'username': 'sarah_customer',
            'email': 'sarah@example.com',
            'first_name': 'Sarah',
            'last_name': 'Johnson',
            'phone': '+44 7567 890123',
            'role': UserRole.BUYER,
            'address_line1': '89 Cultural Street',
            'city': 'London',
            'postcode': 'E8 2QR',
            'country': 'UK'
        }
    ]
    
    customer_objects = []
    for customer_info in customer_data:
        customer = User(**customer_info)
        customer.set_password('customer123')
        db.session.add(customer)
        customer_objects.append(customer)
    
    db.session.commit()
    
    print("Sample data created successfully!")
    print(f"Created {len(category_objects)} categories")
    print(f"Created {len(vendor_objects)} vendors")
    print(f"Created {len(rider_objects)} riders")
    print(f"Created {len(product_objects)} products")
    print(f"Created {len(customer_objects)} customers")
    print("Admin user: admin / admin123")
    print("Vendor users: mama_kemi, caribbean_delights, ackee_saltfish / vendor123")
    print("Rider users: kwame_rider, amara_delivery / rider123")
    print("Customer users: john_buyer, sarah_customer / customer123")

