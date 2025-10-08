// backend/src/lib/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// טען .env כאן כדי שלא תהיה תלות בסדר ה-import-ים
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // לדוגמה: "demo"
  api_key: process.env.CLOUDINARY_API_KEY,       // מספרי, לדוגמה: "123456789012345"
  api_secret: process.env.CLOUDINARY_API_SECRET, // מחרוזת סודית ארוכה
  secure: true,
});

export default cloudinary;
