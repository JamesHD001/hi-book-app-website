import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCKjpnpAGwGwtyzv13AiETaFJTUgVSU3Xo",
  authDomain: "hi-bookapp.firebaseapp.com",
  projectId: "hi-bookapp",
  storageBucket: "hi-bookapp.firebasestorage.app",
  messagingSenderId: "833345574442",
  appId: "1:833345574442:web:0adb7e6e5008167525d553",
  measurementId: "G-DRB1QZP98C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirm").value.trim();
  const formFeedback = document.getElementById("formFeedback");

  formFeedback.textContent = "";
  formFeedback.style.color = "red";

  // ✅ Client-side validation
  if (password.length < 8) {
    formFeedback.textContent = "Password must be at least 8 characters.";
    return;
  }
  if (password !== confirmPassword) {
    formFeedback.textContent = "Passwords do not match.";
    return;
  }

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName,
      email,
      bio: "Hi! I'm new here😊",
      profilePicture: "./images/default-avatar.png",
      createdAt: new Date()
    });

    formFeedback.style.color = "green";
    formFeedback.textContent = "Welcome to Hi!Book. Account created successfully✅! Redirecting...";
    setTimeout(() => (window.location.href = "home.html"), 2000);
  } catch (error) {
    console.error(error);
    formFeedback.textContent = "❌ " + error.message;
  }
});
