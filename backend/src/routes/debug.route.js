// backend/src/routes/debug.route.js
import express from "express";
import cloudinary from "../lib/cloudinary.js";
const router = express.Router();

router.post("/cloudinary", async (_req, res) => {
  try {
    const tiny =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/P7J6YQAAAABJRU5ErkJggg==";
    const out = await cloudinary.uploader.upload(tiny, {
      folder: "chatty/debug",
      resource_type: "image",
    });
    res.json({ ok: true, url: out.secure_url });
  } catch (e) {
    console.error("DEBUG cloudinary error:", e);
    res.status(502).json({ ok: false, message: e?.message || "upload failed" });
  }
});
export default router;
