// auth/signup.js
import { auth, db } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const messageBox = document.getElementById("signupMessage"); // <-- add in HTML

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirm").value.trim();

    // 🔒 Validation
    if (!name || !email || !password || !confirm) {
      return showMessage("All fields are required.", "error");
    }
    if (password !== confirm) {
      return showMessage("Passwords do not match.", "error");
    }
    if (password.length < 8) {
      return showMessage("Password must be at least 8 characters.", "error");
    }

    try {
      // ✨ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✨ Update profile with displayName
      await updateProfile(user, { displayName: name });

      // ✨ Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        bio: "Hey there! I'm new on Hi!Book 🚀", // default bio
        username: email.split("@")[0], // default username from email
        profilePic: "https://via.placeholder.com/150", // placeholder pic
        createdAt: serverTimestamp()
      });

      showMessage("Signup successful! Redirecting...", "success");

      setTimeout(() => {
        window.location.href = "home.html";
      }, 1000);

    } catch (error) {
      console.error("Signup error:", error.code, error.message);

      if (error.code === "auth/email-already-in-use") {
        showMessage("This email is already registered.", "error");
      } else if (error.code === "auth/weak-password") {
        showMessage("Password is too weak. Please choose a stronger one.", "error");
      } else {
        showMessage("Signup failed. Please try again later.", "error");
      }
    }
  });

  // 📌 Helper to show messages
  function showMessage(msg, type) {
    messageBox.textContent = msg;
    messageBox.className = `message ${type}`;
  }
});
