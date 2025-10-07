// frontend/src/lib/axios.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? "http://localhost:5001/api" : "/api",
  withCredentials: true, // אם משתמשים בקוקיז
});
