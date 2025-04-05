// app.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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
const analytics = getAnalytics(app);

// More Firebase logic (auth, Firestore) will go here
