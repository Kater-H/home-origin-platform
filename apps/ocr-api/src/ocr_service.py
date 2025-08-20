#!/usr/bin/env python3
"""
OCR Service for Smart Shopper
Handles image and PDF file processing to extract text for shopping list suggestions
"""

import os
import tempfile
import base64
from io import BytesIO
from PIL import Image
import pytesseract
from pdf2image import convert_from_bytes
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OCRService:
    """Service for processing images and PDFs using OCR"""
    
    def __init__(self):
        """Initialize OCR service with Tesseract configuration"""
        # Configure Tesseract for better text recognition
        self.tesseract_config = r'--oem 3 --psm 6'
        
    def process_image(self, image_data, file_type='png'):
        """
        Process an image file and extract text using OCR
        
        Args:
            image_data: Base64 encoded image data or PIL Image
            file_type: Type of image file (png, jpg, jpeg)
            
        Returns:
            dict: Contains extracted text and processing status
        """
        try:
            # Handle base64 encoded image data
            if isinstance(image_data, str):
                # Remove data URL prefix if present
                if image_data.startswith('data:image'):
                    image_data = image_data.split(',')[1]
                
                # Decode base64 image
                image_bytes = base64.b64decode(image_data)
                image = Image.open(BytesIO(image_bytes))
            elif isinstance(image_data, bytes):
                image = Image.open(BytesIO(image_data))
            else:
                image = image_data
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Extract text using Tesseract OCR
            extracted_text = pytesseract.image_to_string(image, config=self.tesseract_config)
            
            # Clean up the extracted text
            cleaned_text = self._clean_extracted_text(extracted_text)
            
            logger.info(f"Successfully extracted text from image: {len(cleaned_text)} characters")
            
            return {
                'success': True,
                'text': cleaned_text,
                'raw_text': extracted_text,
                'message': 'Text extracted successfully from image'
            }
            
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            return {
                'success': False,
                'text': '',
                'error': str(e),
                'message': 'Failed to extract text from image'
            }
    
    def process_pdf(self, pdf_data):
        """
        Process a PDF file and extract text using OCR
        
        Args:
            pdf_data: PDF file data as bytes
            
        Returns:
            dict: Contains extracted text and processing status
        """
        try:
            # Convert PDF to images
            images = convert_from_bytes(pdf_data, dpi=200, fmt='png')
            
            extracted_texts = []
            
            # Process each page
            for i, image in enumerate(images):
                logger.info(f"Processing PDF page {i + 1}/{len(images)}")
                
                # Extract text from this page
                page_text = pytesseract.image_to_string(image, config=self.tesseract_config)
                
                if page_text.strip():
                    extracted_texts.append(page_text)
            
            # Combine all extracted text
            combined_text = '\n\n'.join(extracted_texts)
            cleaned_text = self._clean_extracted_text(combined_text)
            
            logger.info(f"Successfully extracted text from PDF: {len(images)} pages, {len(cleaned_text)} characters")
            
            return {
                'success': True,
                'text': cleaned_text,
                'raw_text': combined_text,
                'pages_processed': len(images),
                'message': f'Text extracted successfully from {len(images)} page(s)'
            }
            
        except Exception as e:
            logger.error(f"Error processing PDF: {str(e)}")
            return {
                'success': False,
                'text': '',
                'error': str(e),
                'message': 'Failed to extract text from PDF'
            }
    
    def _clean_extracted_text(self, text):
        """
        Clean and normalize extracted text for better processing
        
        Args:
            text: Raw extracted text
            
        Returns:
            str: Cleaned text
        """
        if not text:
            return ""
        
        # Remove excessive whitespace and normalize line breaks
        lines = []
        for line in text.split('\n'):
            cleaned_line = line.strip()
            if cleaned_line:
                lines.append(cleaned_line)
        
        # Join lines and remove excessive spaces
        cleaned_text = '\n'.join(lines)
        
        # Remove multiple consecutive spaces
        import re
        cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
        
        return cleaned_text.strip()
    
    def extract_shopping_items(self, text):
        """
        Extract shopping items from OCR text using simple heuristics
        
        Args:
            text: Extracted text from OCR
            
        Returns:
            list: List of potential shopping items
        """
        if not text:
            return []
        
        items = []
        lines = text.split('\n')
        
        # Common patterns for shopping lists
        import re
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Remove common list markers
            line = re.sub(r'^[-*•◦▪▫‣⁃]\s*', '', line)
            line = re.sub(r'^\d+\.?\s*', '', line)
            line = re.sub(r'^\([^)]*\)\s*', '', line)
            
            # Skip very short or very long lines
            if len(line) < 2 or len(line) > 100:
                continue
            
            # Skip lines that look like headers or notes
            if any(word in line.lower() for word in ['shopping', 'list', 'grocery', 'store', 'market']):
                continue
            
            items.append(line.strip())
        
        return items[:50]  # Limit to 50 items to avoid overwhelming the system

def test_ocr_service():
    """Test function for OCR service"""
    ocr = OCRService()
    
    # Create a simple test image with text
    from PIL import Image, ImageDraw, ImageFont
    
    # Create a white image
    img = Image.new('RGB', (400, 200), color='white')
    draw = ImageDraw.Draw(img)
    
    # Add some text
    text = "Shopping List:\n1. Apples\n2. Bread\n3. Milk\n4. Eggs"
    draw.text((10, 10), text, fill='black')
    
    # Test image processing
    result = ocr.process_image(img)
    print("OCR Test Result:")
    print(f"Success: {result['success']}")
    print(f"Extracted text: {result['text']}")
    
    if result['success']:
        items = ocr.extract_shopping_items(result['text'])
        print(f"Extracted items: {items}")

if __name__ == "__main__":
    test_ocr_service()

