import { Router } from "express";
import { login, logout, register } from "../controllers/authController.js";
import {
  validateRegisterInput,
  validateUserInput,
} from "../middleware/validationMiddleware.js";
import rateLimiter from "express-rate-limit";
const router = Router();

const appLimit = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { msg: "IP rate limit exceed, retry in 15min" },
});
router.post("/register", appLimit, validateRegisterInput, register);
router.post("/login", appLimit, validateUserInput, login);
router.get("/logout", logout);

export default router;
