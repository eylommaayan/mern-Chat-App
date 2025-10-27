// src/index.js
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js"; // משתמשים ב-app שיוצא מ-socket.js

// ---- paths / constants ----
const PORT = Number(process.env.PORT) || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- middleware ----
app.use(express.json());
app.use(cookieParser());

// אפשר להגדיר כמה אוריג'ינים דרך .env: CLIENT_URLS=http://localhost:5173,https://yourdomain.com
const CLIENT_ORIGINS = (process.env.CLIENT_URLS || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: CLIENT_ORIGINS,
    credentials: true,
  })
);

// ---- routes ----
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ---- static + SPA fallback (Express 5) ----
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(distPath));

  // ⬇️ לא להשתמש ב- "*", זה יפיל ב-Express 5
  app.get("/*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ---- start ----
server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
