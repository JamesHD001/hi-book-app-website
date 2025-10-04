// signup.js
import { auth, db } from "./firebaseConfig.js";
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");
const signupBtn = document.getElementById("signupBtn");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordHint = document.getElementById("passwordHint");

// ✅ Live validation for password
function validatePassword() {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (password.length < 8) {
    signupBtn.disabled = true;
    passwordHint.textContent = "Password must be at least 8 characters.";
    passwordHint.style.color = "red";
  } else if (password !== confirmPassword) {
    signupBtn.disabled = true;
    passwordHint.textContent = "Passwords do not match.";
    passwordHint.style.color = "red";
  } else {
    signupBtn.disabled = false;
    passwordHint.textContent = "Password is valid.";
    passwordHint.style.color = "green";
  }
}

passwordInput.addEventListener("input", validatePassword);
confirmPasswordInput.addEventListener("input", validatePassword);

// ✅ Save user to Firestore if not exists
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

// ✅ Email/Password Signup
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = passwordInput.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await saveUserToFirestore(userCredential.user);

    signupMessage.textContent = "Account created successfully! Redirecting...";
    signupMessage.className = "message success";

    setTimeout(() => (window.location.href = "login.html"), 1500);
  } catch (error) {
    let message = "An error occurred. Please try again.";
    if (error.code === "auth/email-already-in-use") message = "This email is already registered.";
    if (error.code === "auth/weak-password") message = "Password should be at least 8 characters.";
    if (error.code === "auth/invalid-email") message = "Please enter a valid email address.";

    signupMessage.textContent = message;
    signupMessage.className = "message error";
  }
});

// ✅ Social Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Google signup
document.getElementById("googleSignup").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await saveUserToFirestore(result.user); // ✅ Save to Firestore
    window.location.href = "index.html";
  } catch (error) {
    console.error("Google signup error:", error.message);
  }
});

// Facebook signup
document.getElementById("facebookSignup").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    await saveUserToFirestore(result.user); // ✅ Save to Firestore
    window.location.href = "index.html";
  } catch (error) {
    console.error("Facebook signup error:", error.message);
  }
});
