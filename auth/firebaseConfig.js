import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVrm6-sU1IDiGKQF0Yh09UPVHskbrs6Ew",
  authDomain: "hi-book-app.firebaseapp.com",
  projectId: "hi-book-app",
  storageBucket: "hi-book-app.appspot.com",
  messagingSenderId: "1043212997067",
  appId: "1:1043212997067:web:42874209d31b524c61a64e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
