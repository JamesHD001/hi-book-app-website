// auth/login.js
import { auth } from "./firebaseConfig.js";
import { signInWithEmailAndPassword } from "firebase/auth";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        await signInWithEmailAndPassword(auth, email, password);

        loginMessage.textContent = "Login successful! Redirecting...";
        loginMessage.className = "message success";

        setTimeout(() => {
          window.location.href = "index.html"; // Change if you want to redirect elsewhere
        }, 2000);
      } catch (error) {
        loginMessage.textContent = error.message;
        loginMessage.className = "message error";
      }
    });
  }
});
