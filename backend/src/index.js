// backend/src/index.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import debugRoutes from "./routes/debug.route.js";
import cloudinary from "./lib/cloudinary.js";

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// CORS (לפני ראוטים)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// אם ממש צריך לטפל ב-OPTIONS לכל מסלול ב-Express 5:
// app.options("(.*)", cors({ origin: ["http://localhost:5173","http://localhost:3000"], credentials: true }));

// פרסרים עם limit גבוה לקבצי Base64
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

app.use(cookieParser());

// ראוטים
app.use("/api/_debug", debugRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Static בפרודקשן – שים לב לשינוי '* ' -> '(.*)'
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("(.*)", (_req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// בדיקת Cloudinary (לא חובה, עוזר לדיבוג)
cloudinary.api.ping()
  .then(() => console.log("Cloudinary ping: OK"))
  .catch((e) => console.error("Cloudinary ping FAILED:", e?.message || e));

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
