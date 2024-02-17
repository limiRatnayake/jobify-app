import { Router } from "express";
import { login, logout, register } from "../controllers/authController.js";
import { validateRegisterInput, validateUserInput } from "../middleware/validationMiddleware.js";

const router = Router();

router.post("/register", validateRegisterInput, register);
router.post("/login", validateUserInput, login);
router.get("/logout", logout);

export default router;
