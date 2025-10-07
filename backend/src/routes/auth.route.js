import express from "express";
import cloudinary from "../config/cloudinary.js";
import { protect } from "../middleware/auth.middleware.js"; // ודא שקיים אצלך
import User from "../models/user.model.js";

const router = express.Router();

/* דוגמת בריאות/בדיקה */
router.get("/auth/check", protect, (req, res) => {
  // אם protect מציב req.user
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  res.json(req.user);
});

/* עדכון פרופיל + העלאת תמונה ל-Cloudinary */
router.put("/auth/update-profile", protect, async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic, {
        folder: "avatars",
        transformation: [{ width: 256, height: 256, crop: "fill" }],
      });
      user.profilePic = upload.secure_url; // שמור URL בלבד
    }

    await user.save();
    const safeUser = user.toObject();
    delete safeUser.password;
    res.json(safeUser);
  } catch (err) {
    console.error("update-profile error:", err);
    res.status(400).json({ message: err.message || "Upload failed" });
  }
});

export default router;
