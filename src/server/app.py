from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO
import logging
import firebase_admin
from firebase_admin import credentials, firestore

logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")

if not firebase_admin._apps:
    cred = credentials.Certificate("/Users/atharvadahegaonkar/Desktop/tor-rent/torent-85645-firebase-adminsdk-fbsvc-e38232a4be.json")
    firebase_admin.initialize_app(cred)
    logging.info("Firebase initialized successfully")

# Connect Firestore Database
db = firestore.client()
logging.info("Firestore database connected")

# Initialize Flask
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def home():
    return render_template("index.html")

# Create User (Tenant or Landlord)
@app.route("/create_user", methods=["POST"])
def create_user():
    data = request.json
    logging.debug(f"Received data for user creation: {data}")
    
    try:
        user_ref = db.collection("users").document(data["user_id"])
        user_ref.set({
            "user_id": data["user_id"],
            "name": data["name"],
            "role": data["role"],  # "tenant" or "landlord"
            "score": data.get("score", 700)
        })
        logging.info(f"User {data['user_id']} created successfully!")
        return jsonify({"message": "User created successfully!", "user_id": data["user_id"]})
    except Exception as e:
        logging.error(f"Firestore error: {e}")
        return jsonify({"error": str(e)}), 500

# Create a Rental Agreement
@app.route("/create_agreement", methods=["POST"])
def create_agreement():
    data = request.json
    logging.debug(f"Received data for agreement creation: {data}")

    try:
        agreement_ref = db.collection("agreements").document()
        agreement_ref.set({
            "tenant_id": data["tenant_id"],
            "landlord_id": data["landlord_id"],
            "blockchain_contract_id": data["blockchain_contract_id"],
            "clauses": data["clauses"],
            "status": "Active",
            "created_at": firestore.SERVER_TIMESTAMP
        })
        logging.info(f"Agreement created successfully: {agreement_ref.id}")
        return jsonify({"message": "Agreement created successfully", "agreement_id": agreement_ref.id})
    except Exception as e:
        logging.error(f"Firestore error: {e}")
        return jsonify({"error": str(e)}), 500

# Raise an Issue
@app.route("/raise_issue", methods=["POST"])
def raise_issue():
    data = request.json
    logging.debug(f"Received data for issue creation: {data}")

    try:
        issue_ref = db.collection("issues").document()
        issue_ref.set({
            "tenant_id": data["tenant_id"],
            "landlord_id": data["landlord_id"],
            "description": data["description"],
            "status": "Pending",
            "created_at": firestore.SERVER_TIMESTAMP
        })
        logging.info(f"Issue created successfully: {issue_ref.id}")
        return jsonify({"message": "Issue raised successfully", "issue_id": issue_ref.id})
    except Exception as e:
        logging.error(f"Firestore error: {e}")
        return jsonify({"error": str(e)}), 500

# Make a Payment
@app.route("/make_payment", methods=["POST"])
def make_payment():
    data = request.json
    logging.debug(f"Received data for payment: {data}")

    try:
        payment_ref = db.collection("payments").document()
        payment_ref.set({
            "tenant_id": data["tenant_id"],
            "landlord_id": data["landlord_id"],
            "agreement_id": data["agreement_id"],
            "amount": data["amount"],
            "status": "Paid",
            "paid_at": firestore.SERVER_TIMESTAMP
        })
        logging.info(f"Payment recorded successfully: {payment_ref.id}")
        return jsonify({"message": "Payment successful", "payment_id": payment_ref.id})
    except Exception as e:
        logging.error(f"Firestore error: {e}")
        return jsonify({"error": str(e)}), 500

# Enforce Agreement (Landlord Actions)
@app.route("/enforce_agreement", methods=["POST"])
def enforce_agreement():
    data = request.json
    logging.debug(f"Received enforcement request: {data}")

    try:
        agreement_ref = db.collection("agreements").document(data["agreement_id"])
        agreement_ref.update({
            "status": data["new_status"]
        })
        logging.info(f"Agreement {data['agreement_id']} updated to {data['new_status']}")
        return jsonify({"message": f"Agreement updated to {data['new_status']}"})
    except Exception as e:
        logging.error(f"Firestore error: {e}")
        return jsonify({"error": str(e)}), 500

# Conflict Resolution
@app.route("/resolve_conflict", methods=["POST"])
def resolve_conflict():
    data = request.json
    logging.debug(f"Received conflict resolution data: {data}")

    try:
        conflict_ref = db.collection("conflict_resolution").document()
        conflict_ref.set({
            "tenant_id": data["tenant_id"],
            "landlord_id": data["landlord_id"],
            "issue_id": data["issue_id"],
            "resolution_notes": data["resolution_notes"],
            "resolved_at": firestore.SERVER_TIMESTAMP
        })
        logging.info(f"Conflict resolved: {conflict_ref.id}")
        return jsonify({"message": "Conflict resolved successfully", "conflict_id": conflict_ref.id})
    except Exception as e:
        logging.error(f"Firestore error: {e}")
        return jsonify({"error": str(e)}), 500

# Update Tenant or Landlord Score
@app.route("/update_score", methods=["POST"])
def update_score():
    data = request.json
    logging.debug(f"Received data for score update: {data}")

    try:
        score_ref = db.collection("scores").document(data["user_id"])
        score_ref.set({
            "user_id": data["user_id"],
            "score": data["score"]
        }, merge=True)
        logging.info(f"Score updated for {data['user_id']}")
        return jsonify({"message": "Score updated successfully"})
    except Exception as e:
        logging.error(f"Firestore error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    logging.info("Starting Flask server on http://127.0.0.1:5000/")
    app.run(debug=True)
