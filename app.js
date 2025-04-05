// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import { 
  getFirestore, 
  doc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAK13950pF8p9D7pnEgedsTRVtq1xxinvY",
  authDomain: "jennvelin-bafa4.firebaseapp.com",
  projectId: "jennvelin-bafa4",
  storageBucket: "jennvelin-bafa4.firebasestorage.app",
  messagingSenderId: "877499901455",
  appId: "1:877499901455:web:8c502d4bd97fb4a5fe657a",
  measurementId: "G-XCXW38HZMS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// SIGN UP with email verification + Firestore
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    // Save user to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      createdAt: new Date(),
      method: "email"
    });

    document.getElementById("message").textContent = "✅ Signup successful! Check your email to verify.";
  } catch (error) {
    document.getElementById("message").textContent = `❌ ${error.message}`;
  }
});

// LOGIN with emailVerified check
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user.emailVerified) {
      document.getElementById("message").textContent = "✅ Login successful!";
      document.getElementById("resend-verification").style.display = "none";
    } else {
      document.getElementById("message").textContent = "⚠️ Please verify your email before logging in.";
      document.getElementById("resend-verification").style.display = "block";
    }
  } catch (error) {
    document.getElementById("message").textContent = `❌ ${error.message}`;
  }
});

// RESEND VERIFICATION EMAIL
document.getElementById("resend-verification").addEventListener("click", async () => {
  const user = auth.currentUser;

  if (user && !user.emailVerified) {
    try {
      await sendEmailVerification(user);
      document.getElementById("message").textContent = "📨 Verification email resent!";
    } catch (error) {
      document.getElementById("message").textContent = `❌ ${error.message}`;
    }
  } else {
    document.getElementById("message").textContent = "⚠️ No unverified user is logged in.";
  }
});

// GOOGLE LOGIN + Save user to Firestore
document.getElementById("google-login").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save user to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
      method: "google"
    });

    document.getElementById("message").textContent = `✅ Welcome, ${user.displayName || user.email}!`;
    document.getElementById("resend-verification").style.display = "none";
  } catch (error) {
    document.getElementById("message").textContent = `❌ ${error.message}`;
  }
});
