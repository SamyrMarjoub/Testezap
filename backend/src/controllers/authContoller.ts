import { Request, Response } from "express";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email e senha são obrigatórios!" });
      return;
    }

    // Criando usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("Usuário criado com sucesso:", user.uid); // Log para verificar criação

    // Criando documento do usuário no Firestore
    const userRef = doc(db, "users", user.uid);
    try {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName || "Usuário",
        createdAt: new Date(),
        credits: 0,
      });
      console.log("Documento criado no Firestore para:", user.uid);
    } catch (firestoreError) {
      console.error("Erro ao criar documento no Firestore:", firestoreError);
    }

    res.status(201).json({
      message: "Usuário registrado com sucesso!",
      userId: user.uid,
      email: user.email,
    });
  } catch (error: any) {
    console.error("Erro ao registrar usuário:", error.message);
    res.status(500).json({ message: error.message || "Erro desconhecido" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;



    // Autenticar usuário no Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();

    res.status(200).json({
      message: "Login bem-sucedido!",
      userId: user.uid,
      email: user.email,
      token,
    });
  } catch (error: any) {
    console.error("Erro ao fazer login:", error.message);
    res.status(401).json({ message: "Credenciais inválidas" });
  }
}