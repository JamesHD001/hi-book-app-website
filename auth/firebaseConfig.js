// auth/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKjpnpAGwGwtyzv13AiETaFJTUgVSU3Xo",
  authDomain: "hi-bookapp.firebaseapp.com",
  projectId: "hi-bookapp",
  storageBucket: "hi-bookapp.firebasestorage.app",
  messagingSenderId: "833345574442",
  appId: "1:833345574442:web:0adb7e6e5008167525d553",
  measurementId: "G-DRB1QZP98C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
