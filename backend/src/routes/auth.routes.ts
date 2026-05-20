import { Router } from "express";
import { registerUser, loginUser, getMe } from "../controllers/auth.controller";
import { registerValidation, loginValidation } from "../validations/auth.validation";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.get("/me", protect, getMe);

export default router;
