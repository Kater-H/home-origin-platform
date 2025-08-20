#!/usr/bin/env python3
"""
Database initialization script for Home Origin Backend
This script creates the database tables and populates them with sample data.
"""

import os
import sys

# Add the project root to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.main import app
from src.models.models import db
from src.seed_data import create_sample_data

def init_database():
    """Initialize the database with tables and sample data"""
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Database tables created successfully!")
        
        print("Creating sample data...")
        create_sample_data()
        print("Sample data created successfully!")
        
        print("\nDatabase initialization complete!")
        print("You can now start the Flask application with: python src/main.py")

if __name__ == '__main__':
    init_database()

