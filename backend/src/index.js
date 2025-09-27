import express from "express";
import dotenv from "dotenv";
import cookiesParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";


dotenv.config();
const app = express();



// ✅ Parsers (במקום body-parser הישן)
app.use(express.json());                         // קורא JSON מהבקשה → req.body
app.use(express.urlencoded({ extended: true })); // קורא נתוני טפסים (x-www-form-urlencoded)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookiesParser());                      // 
const PORT = process.env.PORT || 5001;

// 🧭 חיבור קבוצת הנתיבים של האימות תחת prefix קבוע
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  connectDB(); // חיבור למסד (אפשר גם לפני listen אם רוצים להבטיח DB לפני האזנה)
});
