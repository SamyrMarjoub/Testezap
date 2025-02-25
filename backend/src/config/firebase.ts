import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import dotenv from 'dotenv';

// dotenv.config(); // Carrega as variáveis de ambiente
dotenv.config({ path: "src/config/.env" });

console.log("FIREBASE_STORAGE_BUCKET:", process.env.FIREBASE_STORAGE_BUCKET); // Depuração

// Verifica se a variável do bucket foi carregada corretamente
if (!process.env.FIREBASE_STORAGE_BUCKET) {
  throw new Error("A variável FIREBASE_STORAGE_BUCKET não está definida no .env");
}

// Carregar credenciais do Firebase Admin a partir do arquivo JSON
const serviceAccount = JSON.parse(fs.readFileSync("src/config/firebase-admin.json", "utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Usa a variável do .env
  });
}

// Obtém o bucket corretamente
const auth = getAuth();
const db = getFirestore();
const bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET);

export { auth, db, bucket };
