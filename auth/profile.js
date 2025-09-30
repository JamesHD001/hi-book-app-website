// auth/profile.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔑 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCKjpnpAGwGwtyzv13AiETaFJTUgVSU3Xo",
  authDomain: "hi-bookapp.firebaseapp.com",
  projectId: "hi-bookapp",
  storageBucket: "hi-bookapp.firebasestorage.app",
  messagingSenderId: "833345574442",
  appId: "1:833345574442:web:0adb7e6e5008167525d553",
  measurementId: "G-DRB1QZP98C"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM refs
const nameEl = document.getElementById("profile-name");
const usernameEl = document.getElementById("profile-username");
const bioEl = document.getElementById("profile-bio");
const picEl = document.getElementById("profile-picture");
const modal = document.getElementById("loginPromptModal");

// Redirect buttons
document.getElementById("goToLogin").addEventListener("click", () => {
  window.location.href = "login.html";
});
document.getElementById("goToSignup").addEventListener("click", () => {
  window.location.href = "signup.html";
});

// Listen for auth state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        nameEl.textContent = data.name || "No name";
        usernameEl.textContent = `@${data.username || "unknown"}`;
        bioEl.textContent = data.bio || "No bio yet.";
        picEl.src = data.profilePic || "./images/default-avatar.png";
      } else {
        console.warn("No profile data found, showing fallback");
        nameEl.textContent = user.displayName || "Anonymous User";
        usernameEl.textContent = user.email;
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  } else {
    // Show modal for guests
    modal.style.display = "block";
  }
});
// Close modal when clicking outside content
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// Close modal when clicking close button
document.querySelector(".close").onclick = function() {
  modal.style.display = "none";
}
