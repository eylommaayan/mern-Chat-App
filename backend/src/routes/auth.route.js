import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

// ✅ הנתיבים הפעילים
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// ❗ שים את ה-404 רק בסוף, אחרי כל הנתיבים
router.use((_req, res) => res.status(404).json({ message: "Not found" }));

export default router;
