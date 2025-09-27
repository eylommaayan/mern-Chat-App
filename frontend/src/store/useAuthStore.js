// src/store/useAuthStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSignedIn: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data, });
      console.log("Auth check successful");
    } catch (err) {
      console.log("Error in checkAuth:", err);
      set({ authUser: null,  });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));