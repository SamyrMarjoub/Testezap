import { Request, Response } from "express";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email e senha são obrigatórios!" });
      return;
    }

    // Criando usuário no Firebase Authentication (Admin SDK)
    const user = await auth.createUser({
      email,
      password,
      displayName: username || "Usuário",
    });

    console.log("Usuário criado com sucesso:", user.uid);

    // Criando documento do usuário no Firestore
    const userRef = db.collection("users").doc(user.uid);
    await userRef.set({
      uid: user.uid,
      email: user.email,
      username: username || "Usuário",
      createdAt: new Date(),
      credits: 0,
    });

    console.log("Documento criado no Firestore para:", user.uid);

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
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ message: "Token não fornecido" });
      return;
    }

    // Verifica o token JWT e retorna os dados do usuário
    const decodedToken = await auth.verifyIdToken(idToken);

    res.status(200).json({
      message: "Login bem-sucedido!",
      userId: decodedToken.uid,
      email: decodedToken.email,
    });
  } catch (error: any) {
    console.error("Erro ao verificar token:", error.message);
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
};
