import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAK13950pF8p9D7pnEgedsTRVtq1xxinvY",
  authDomain: "jennvelin-bafa4.firebaseapp.com",
  projectId: "jennvelin-bafa4",
  storageBucket: "jennvelin-bafa4.firebasestorage.app",
  messagingSenderId: "877499901455",
  appId: "1:877499901455:web:8c502d4bd97fb4a5fe657a",
  measurementId: "G-XCXW38HZMS"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const runList = document.getElementById("run-list");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    runList.innerHTML = "<p>Please log in to RSVP to runs.</p>";
    return;
  }

  const querySnapshot = await getDocs(collection(db, "runs"));
  querySnapshot.forEach((docSnap) => {
    const run = docSnap.data();
    const runId = docSnap.id;

    const isAttending = run.attendees && run.attendees.includes(user.uid);

    const runDiv = document.createElement("div");
    runDiv.className = "run-card";
    runDiv.innerHTML = `
      <h3>${run.title}</h3>
      <p><strong>Location:</strong> ${run.location}</p>
      <p><strong>Date:</strong> ${run.date}</p>
      <p>${run.description}</p>
      <button data-id="${runId}" class="rsvp-btn">
        ${isAttending ? "✅ You're Going" : "RSVP"}
      </button>
    `;

    runList.appendChild(runDiv);

    const btn = runDiv.querySelector(".rsvp-btn");
    btn.addEventListener("click", async () => {
      const runRef = doc(db, "runs", runId);

      if (isAttending) {
        await updateDoc(runRef, {
          attendees: arrayRemove(user.uid)
        });
        btn.textContent = "RSVP";
      } else {
        await updateDoc(runRef, {
          attendees: arrayUnion(user.uid)
        });
        btn.textContent = "✅ You're Going";
      }

      btn.disabled = true; // prevent double click
      location.reload(); // refresh to show updated state
    });
  });
});
