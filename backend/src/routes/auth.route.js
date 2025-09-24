// backend/src/routes/auth.route.js
import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,          // ← להוסיף
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// נתיבי אימות
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

// בדיקת התחברות/חזרת פרטי משתמש
router.get("/check", protectRoute, checkAuth);

// 404 לכל מה שלא נתפס
router.use((_req, res) => res.status(404).json({ message: "Not found" }));

export default router;
