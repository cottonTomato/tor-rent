from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
import io

app = Flask(__name__)

# Allow all domains (*) and all methods
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/extract-aadhar", methods=["POST"])
def extract_aadhar():
    if "aadharImg" not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    image_file = request.files["aadharImg"]

    try:
        # Convert to PIL image
        print("Image file: ", image_file)
        image = Image.open(io.BytesIO(image_file.read()))
        
        # Perform OCR using pytesseract
        extracted_text = pytesseract.image_to_string(image)

        # Return extracted text
        return jsonify({"extracted_text": extracted_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Dummy Route
@app.route("/dummy", methods=["GET"])
def dummy():
    return jsonify({"message": "This is a dummy route!", "status": "success"})

if __name__ == "__main__":
    app.run(debug=True)
