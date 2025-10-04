// login.js
import { auth, db } from "./firebaseConfig.js";
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

// ✅ Email/password login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginMessage.textContent = "Login successful! Redirecting...";
    loginMessage.className = "message success";

    setTimeout(() => (window.location.href = "index.html"), 1500);
  } catch (error) {
    let message = "An error occurred. Please try again.";
    if (error.code === "auth/user-not-found") message = "No account found with this email.";
    if (error.code === "auth/wrong-password") message = "Incorrect password. Try again.";
    if (error.code === "auth/invalid-email") message = "Please enter a valid email address.";

    loginMessage.textContent = message;
    loginMessage.className = "message error";
  }
});

// ✅ Social Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Helper → Save user to Firestore if not exists
async function saveUserToFirestore(user) {
  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName || "",
      provider: user.providerData[0].providerId,
      createdAt: new Date()
    });
  }
}

// Google login
document.getElementById("googleLogin").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await saveUserToFirestore(result.user); // ✅ Save to Firestore
    window.location.href = "index.html";
  } catch (error) {
    console.error("Google login error:", error.message);
  }
});

// Facebook login
document.getElementById("facebookLogin").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    await saveUserToFirestore(result.user); // ✅ Save to Firestore
    window.location.href = "index.html";
  } catch (error) {
    console.error("Facebook login error:", error.message);
  }
});
