from flask import Flask, render_template, jsonify,request
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv,find_dotenv
import os
import pprint
from pymongo import MongoClient
load_dotenv(find_dotenv())
password = os.environ.get("mongodb_pwd")
connection_string=f"mongodb+srv://atharva1204:{password}@userinfo.ceunf.mongodb.net/"
client = MongoClient(connection_string )


dbs = client.list_database_names()
test_db = client.Torent
collections = test_db.list_collection_names()
print(collections)


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def home():
  return render_template("index.html")

@app.route("/about",methods=['POST'])
def about():
  return jsonify({'message': 'Quiz submitted successfully',})

if __name__ == "_main_":
  app.run(debug=True)