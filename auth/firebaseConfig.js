// auth/firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCKjpnpAGwGwtyzv13AiETaFJTUgVSU3Xo",
  authDomain: "hi-bookapp.firebaseapp.com",
  projectId: "hi-bookapp",
  storageBucket: "hi-bookapp.appspot.com",  // ✅ fixed
  messagingSenderId: "833345574442",
  appId: "1:833345574442:web:0adb7e6e5008167525d553",
  measurementId: "G-DRB1QZP98C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
