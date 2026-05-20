import { create } from "zustand";
import API from "../api/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "sales";
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<boolean>;
  register: (payload: any) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  user: (() => {
    const rawUser = localStorage.getItem("user");
    try {
      return rawUser ? JSON.parse(rawUser) : null;
    } catch {
      return null;
    }
  })(),
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await API.post("/auth/login", credentials);
      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      set({
        token,
        user,
        loading: false,
        isAuthenticated: true,
        error: null,
      });
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Invalid credentials. Please try again.";
      set({ error: errMsg, loading: false });
      return false;
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await API.post("/auth/register", payload);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        token,
        user,
        loading: false,
        isAuthenticated: true,
        error: null,
      });
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Registration failed. Email might already be taken.";
      set({ error: errMsg, loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isAuthenticated: false, user: null, token: null });
      return;
    }

    try {
      const response = await API.get("/auth/me");
      const { user } = response.data;
      set({ user, isAuthenticated: true, error: null });
      localStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      // Token is invalid/expired
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ token: null, user: null, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),
}));
