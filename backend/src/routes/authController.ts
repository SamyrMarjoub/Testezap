import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authContoller";

const router = Router();

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);

export default router;
