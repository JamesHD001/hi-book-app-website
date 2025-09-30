// auth/signup.js
import { auth, db } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const signupMessage = document.getElementById("signupMessage");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();

      if (password !== confirmPassword) {
        signupMessage.textContent = "Passwords do not match.";
        signupMessage.className = "message error";
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user profile to Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: new Date().toISOString(),
        });

        signupMessage.textContent = "Account created successfully! Redirecting...";
        signupMessage.className = "message success";

        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } catch (error) {
        signupMessage.textContent = error.message;
        signupMessage.className = "message error";
      }
    });
  }
});
