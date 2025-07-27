// Import fungsi yang Anda butuhkan dari SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// TODO: Ganti dengan konfigurasi proyek Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyDXrxdH-9LkAwqETBgWg5AbhbnrV2gmNEg",
  authDomain: "bio-link-c0087.firebaseapp.com",
  projectId: "bio-link-c0087",
  storageBucket: "bio-link-c0087.firebasestorage.app",
  messagingSenderId: "662599971464",
  appId: "1:662599971464:web:6eacb935da74c82672653d"
};


// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Ekspor untuk digunakan di file lain
export { auth, db };


