// Import the required Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbt4J3UyM0VK5gp4GM0meMzCRnlF8tGms",
  authDomain: "torent-85645.firebaseapp.com",
  projectId: "torent-85645",
  storageBucket: "torent-85645.appspot.com", // Fix storage bucket URL
  messagingSenderId: "1057599313097",
  appId: "1:1057599313097:web:aead7a21ed6f1dafa0e918",
  measurementId: "G-BJ19V43TY5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { db, storage }; // Export storage along with Firestore
