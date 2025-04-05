import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAK13950pF8p9D7pnEgedsTRVtq1xxinvY",
  authDomain: "jennvelin-bafa4.firebaseapp.com",
  projectId: "jennvelin-bafa4",
  storageBucket: "jennvelin-bafa4.firebasestorage.app",
  messagingSenderId: "877499901455",
  appId: "1:877499901455:web:8c502d4bd97fb4a5fe657a",
  measurementId: "G-XCXW38HZMS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const msg = document.getElementById("message");
const container = document.getElementById("profile-container");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    document.getElementById("profile-name").textContent = data.displayName || "Not provided";
    document.getElementById("profile-email").textContent = data.email;
    document.getElementById("profile-position").textContent = data.position || "Not set";
    document.getElementById("profile-city").textContent = data.city || "Not set";

    document.getElementById("edit-name").value = data.displayName || "";
    document.getElementById("edit-position").value = data.position || "";
    document.getElementById("edit-city").value = data.city || "";

    if (data.photoURL) {
      const img = document.getElementById("profile-photo");
      img.src = data.photoURL;
      img.style.display = "block";
    }

    container.style.display = "block";
  } else {
    msg.textContent = "⚠️ Profile not found.";
  }
});

// Save changes
document.getElementById("edit-profile-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) return;

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

    msg.textContent = "✅ Profile updated!";
    setTimeout(() => location.reload(), 1000);
  } catch (error) {
    msg.textContent = `❌ ${error.message}`;
  }
});
