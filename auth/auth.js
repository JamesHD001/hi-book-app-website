// auth/auth.js
import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    const modal = document.getElementById("loginPromptModal");
    const profileSection = document.querySelector(".profile-section");

    if (!user) {
      // Not logged in → show modal
      if (modal) modal.style.display = "flex";
      if (profileSection) profileSection.style.display = "none";
    } else {
      // Logged in → hide modal and show profile
      if (modal) modal.style.display = "none";
      if (profileSection) profileSection.style.display = "block";

      // Fill profile with Firebase user info
      const profileName = document.getElementById("profile-name");
      const profileUsername = document.getElementById("profile-username");

      if (profileName) profileName.textContent = user.displayName || "Hi!Book User";
      if (profileUsername) profileUsername.textContent = user.email || "@unknown";
    }
  });
});
