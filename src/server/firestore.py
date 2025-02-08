import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
cred = credentials.Certificate("/Users/atharvadahegaonkar/Desktop/tor-rent/torent-85645-firebase-adminsdk-fbsvc-e38232a4be.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def add_default_count_field():
    users_ref = db.collection("users")
    users = users_ref.stream()

    for user in users:
        user_ref = users_ref.document(user.id)
        user_data = user.to_dict()

        # Check if default_count exists, if not, initialize it to 0
        if "default_count" not in user_data:
            user_ref.update({"default_count": 0})
            print(f"Updated user {user.id} with default_count = 0")

    print("✅ Default count field added to all users.")

if __name__ == "__main__":
    add_default_count_field()
