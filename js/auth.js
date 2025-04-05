import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

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

const navbar = document.getElementById("navbar");

onAuthStateChanged(auth, (user) => {
  navbar.innerHTML = `
    <li><a href="index.html">Home</a></li>
    <li><a href="media.html">Media</a></li>
    <li><a href="runs.html">Runs</a></li>
    ${user ? `
      <li><a href="profile.html">Profile</a></li>
      <li><a href="#" id="logout-link">Logout</a></li>
    ` : `
      <li><a href="login.html">Login / Sign Up</a></li>
    `}
  `;

  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", async (e) => {
      e.preventDefault();
      await signOut(auth);
      location.href = "index.html";
    });
  }
});
