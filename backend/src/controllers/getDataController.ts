import { Request, Response } from "express";
import { db } from "../config/firebase"; // Importando o Firestore do Firebase Admin SDK

export const getUserData = async (req: Request, res: Response): Promise<void> => {
    try {
        const { uid } = req.params;

        if (!uid) {
            res.status(400).json({ error: "UID is required" });
            return;
        }

        console.log("UID recebido:", uid);

        // Correção: método correto para o Firebase Admin SDK
        const userRef = db.collection("users").doc(uid);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.json(userSnap.data());
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
