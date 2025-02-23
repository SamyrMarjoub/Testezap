import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Adicionando Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDQR-oYRMv2k66q1mP4B6VdcU6JaemIACc",
  authDomain: "testezap-1d30e.firebaseapp.com",
  projectId: "testezap-1d30e",
  storageBucket: "testezap-1d30e.firebasestorage.app",
  messagingSenderId: "287869169580",
  appId: "1:287869169580:web:148baa2ff64ed04ef7d409",
  measurementId: "G-N309J67HKH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Inicializando Firestore

// const analytics = getAnalytics(app);
export { app, auth, db }; // Agora Firestore (db) está exportado corretamente
