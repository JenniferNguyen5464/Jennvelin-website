import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
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

// Sign Up
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

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

// Login
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
      document.getElementById("logout-btn").style.display = "block";
      await loadUserProfile(user.uid);
    } else {
      document.getElementById("message").textContent = "⚠️ Please verify your email before logging in.";
      document.getElementById("resend-verification").style.display = "block";
    }
  } catch (error) {
    document.getElementById("message").textContent = `❌ ${error.message}`;
  }
});

// Google Login
document.getElementById("google-login").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

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
    document.getElementById("logout-btn").style.display = "block";
    await loadUserProfile(user.uid);
  } catch (error) {
    document.getElementById("message").textContent = `❌ ${error.message}`;
  }
});

// Resend Email Verification
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

// Load Profile
async function loadUserProfile(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();

      document.getElementById("profile-name").textContent = data.displayName || "Not provided";
      document.getElementById("profile-email").textContent = data.email;
      document.getElementById("profile-position").textContent = data.position || "Not set";
      document.getElementById("profile-city").textContent = data.city || "Not set";

      document.getElementById("edit-name").value = data.displayName || "";
      document.getElementById("edit-position").value = data.position || "";
      document.getElementById("edit-city").value = data.city || "";

      const profilePhoto = document.getElementById("profile-photo");
      if (data.photoURL) {
        profilePhoto.src = data.photoURL;
        profilePhoto.style.display = "block";
      }

      document.getElementById("profile").style.display = "block";
      document.getElementById("edit-profile").style.display = "block";
    } else {
      document.getElementById("message").textContent = "⚠️ Profile not found in Firestore.";
    }
  } catch (error) {
    document.getElementById("message").textContent = `❌ Error loading profile: ${error.message}`;
  }
}

// Edit Profile Form
document.getElementById("edit-profile-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    document.getElementById("message").textContent = "❌ No user logged in.";
    return;
  }

  const name = document.getElementById("edit-name").value.trim();
  const position = document.getElementById("edit-position").value.trim();
  const city = document.getElementById("edit-city").value.trim();

  try {
    await setDoc(doc(db, "users", user.uid), {
      displayName: name,
      position: position,
      city: city,
      email: user.email,
      uid: user.uid,
      photoURL: user.photoURL || null,
      updatedAt: new Date()
    });

    document.getElementById("message").textContent = "✅ Profile updated!";
    await loadUserProfile(user.uid);
  } catch (error) {
    document.getElementById("message").textContent = `❌ ${error.message}`;
  }
});

// Log Out
document.getElementById("logout-btn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    document.getElementById("message").textContent = "👋 Logged out successfully.";

    // Hide all user-specific sections
    document.getElementById("profile").style.display = "none";
    document.getElementById("edit-profile").style.display = "none";
    document.getElementById("logout-btn").style.display = "none";
    document.getElementById("resend-verification").style.display = "none";
  } catch (error) {
    document.getElementById("message").textContent = `❌ Logout failed: ${error.message}`;
  }
});
