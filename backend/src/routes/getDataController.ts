import express from "express";
import { getUserData } from "../controllers/getDataController";

const router = express.Router();

router.get("/user/:uid", getUserData);

export default router;
