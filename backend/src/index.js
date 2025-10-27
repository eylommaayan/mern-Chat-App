import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

// paths
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 5001;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: (process.env.CLIENT_URLS || "http://localhost:5173").split(",").map(s=>s.trim()), credentials: true }));

// api
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// static + SPA fallback (Express 5)
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(distPath));

  // ⬅️ זה התיקון: לא '/*' ולא '*'
  app.get("/(.*)", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
