import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";

dotenv.config({ path: "src/config/.env" });

console.log("FIREBASE_STORAGE_BUCKET:", process.env.FIREBASE_STORAGE_BUCKET); // Depuração

if (!process.env.FIREBASE_STORAGE_BUCKET) {
  throw new Error("A variável FIREBASE_STORAGE_BUCKET não está definida no .env");
}

if (!process.env.FIREBASE_CREDENTIALS) {
  throw new Error("A variável FIREBASE_CREDENTIALS não está definida no .env");
}

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS!);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, 
  });
}

// Obtém o bucket corretamente
const auth = getAuth();
const db = getFirestore();
const bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET);

export { auth, db, bucket };
