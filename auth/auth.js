// auth.js
document.addEventListener("DOMContentLoaded", () => {
  const displayName = localStorage.getItem("displayName");
  const username = localStorage.getItem("username");

  if (!displayName || !username) {
    // If guest, redirect to login-prompt page or show modal
    window.location.href = "guest-prompt.html";
  }
});

// auth/auth.js
import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Not logged in → redirect to login page
    window.location.href = "login.html";
  }
});
