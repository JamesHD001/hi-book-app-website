// ./auth/login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

// ✅ Your Firebase config (from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyCKjpnpAGwGwtyzv13AiETaFJTUgVSU3Xo",
  authDomain: "hi-bookapp.firebaseapp.com",
  projectId: "hi-bookapp",
  storageBucket: "hi-bookapp.firebasestorage.app",
  messagingSenderId: "833345574442",
  appId: "1:833345574442:web:0adb7e6e5008167525d553",
  measurementId: "G-DRB1QZP98C"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const messageBox = document.getElementById("loginMessage");

  // 👁 Toggle password visibility
  togglePassword.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePassword.textContent = type === "password" ? "👁️" : "🙈";
  });

  // 🚀 Handle login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      return showMessage("Please enter both email and password.", "error");
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      showMessage("Login successful! Redirecting...", "success");

      // Save session in localStorage
      localStorage.setItem("hibook_user", JSON.stringify({
        uid: user.uid,
        email: user.email
      }));

      setTimeout(() => {
        window.location.href = "home.html"; // redirect to restricted page
      }, 1000);

    } catch (error) {
      console.error("Login error:", error.code, error.message);

      if (error.code === "auth/user-not-found") {
        showMessage("No account found with this email.", "error");
      } else if (error.code === "auth/wrong-password") {
        showMessage("Incorrect password. Please try again.", "error");
      } else {
        showMessage("Login failed. Please try again later.", "error");
      }
    }
  });

  // 📌 Helper function for feedback
  function showMessage(msg, type) {
    messageBox.textContent = msg;
    messageBox.className = `message ${type}`;
  }
});
