from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import requests

app = Flask(__name__)

# Set the upload folder
upload_folder = './uploaded'
os.makedirs(upload_folder, exist_ok=True)

# Your OCR.space API key
OCR_API_KEY = 'K85122767288957'

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload-aadhaar', methods=['POST'])
def upload_aadhaar():
    # Debugging: Print request files
    print("Request Files:", request.files)
    print("Request Form Data:", request.form)

    # Check if 'file' is in the request
    if 'file' not in request.files:
        print("No 'file' part in the request")
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']

    # Check if the file has a filename and is allowed
    if file.filename == '':
        print("No file selected")
        return jsonify({"error": "No file selected"}), 400

    if file and allowed_file(file.filename):
        # Secure the filename and save the file
        filename = secure_filename(file.filename)
        file_path = os.path.join(upload_folder, filename)
        print(f"Saving file to: {file_path}")  # Debugging print statement
        file.save(file_path)

        print(f"File saved at: {file_path}")  # Check if file is saved correctly

        # OCR processing code...
    else:
        print("Invalid file format")
        return jsonify({"error": "Invalid file format. Please upload a .png, .jpg, or .jpeg file."}), 400


def extract_aadhaar_number(text):
    import re
    match = re.search(r'\d{4}\s?\d{4}\s?\d{4}', text)
    return match.group(0) if match else "Not found"

if __name__ == '__main__':
    app.run(debug=True)
