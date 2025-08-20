from flask import Blueprint, request, jsonify
import base64
import tempfile
import os
from werkzeug.utils import secure_filename
import logging

# Import our OCR service
from src.ocr_service import OCRService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ocr_bp = Blueprint('ocr', __name__)
ocr_service = OCRService()

ALLOWED_EXTENSIONS = {'txt', 'csv', 'png', 'jpg', 'jpeg', 'pdf'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@ocr_bp.route('/api/ocr/process', methods=['POST'])
def process_file():
    """Process uploaded file with OCR"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file provided',
                'message': 'Please upload a file'
            }), 400

        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected',
                'message': 'Please select a file to upload'
            }), 400

        # Check file extension
        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'error': 'Invalid file type',
                'message': f'Supported formats: {", ".join(ALLOWED_EXTENSIONS)}'
            }), 400

        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({
                'success': False,
                'error': 'File too large',
                'message': f'Maximum file size is {MAX_FILE_SIZE // (1024*1024)}MB'
            }), 400

        # Get file info
        filename = secure_filename(file.filename)
        file_extension = filename.rsplit('.', 1)[1].lower()
        
        logger.info(f"Processing file: {filename} ({file_size} bytes)")

        # Read file data
        file_data = file.read()
        
        # Process based on file type
        if file_extension in ['txt', 'csv']:
            # Handle text files
            try:
                text_content = file_data.decode('utf-8')
                result = {
                    'success': True,
                    'text': text_content,
                    'file_type': file_extension,
                    'message': f'Text file processed successfully'
                }
            except UnicodeDecodeError:
                return jsonify({
                    'success': False,
                    'error': 'Encoding error',
                    'message': 'Unable to decode text file. Please ensure it\'s UTF-8 encoded.'
                }), 400
                
        elif file_extension in ['png', 'jpg', 'jpeg']:
            # Handle image files with OCR
            result = ocr_service.process_image(file_data, file_extension)
            result['file_type'] = 'image'
            
        elif file_extension == 'pdf':
            # Handle PDF files with OCR
            result = ocr_service.process_pdf(file_data)
            result['file_type'] = 'pdf'
            
        else:
            return jsonify({
                'success': False,
                'error': 'Unsupported file type',
                'message': 'This file type is not supported'
            }), 400

        # Add file metadata to result
        result['filename'] = filename
        result['file_size'] = file_size
        
        # Extract shopping items if OCR was successful
        if result.get('success') and result.get('text'):
            items = ocr_service.extract_shopping_items(result['text'])
            result['extracted_items'] = items
            result['items_count'] = len(items)

        logger.info(f"File processed successfully: {filename}")
        return jsonify(result)

    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Processing error',
            'message': f'An error occurred while processing the file: {str(e)}'
        }), 500

@ocr_bp.route('/api/ocr/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'OCR API',
        'supported_formats': list(ALLOWED_EXTENSIONS),
        'max_file_size_mb': MAX_FILE_SIZE // (1024*1024)
    })

@ocr_bp.route('/api/ocr/test', methods=['POST'])
def test_ocr():
    """Test OCR functionality with sample data"""
    try:
        # Create a simple test
        test_text = "Shopping List:\n1. Apples\n2. Bread\n3. Milk\n4. Eggs"
        
        items = ocr_service.extract_shopping_items(test_text)
        
        return jsonify({
            'success': True,
            'test_text': test_text,
            'extracted_items': items,
            'message': 'OCR service is working correctly'
        })
        
    except Exception as e:
        logger.error(f"OCR test failed: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'OCR service test failed'
        }), 500

