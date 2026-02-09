"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export interface User {
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  provider: "LOCAL" | "GOOGLE";
}

export type OAuthProvider = "google";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginWithOAuth: (provider: OAuthProvider) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API = "http://localhost:8080/api/auth";
const TOKEN_KEY = "maison_noir_token";

function decodeJWT(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 restore session on refresh
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      const payload = decodeJWT(token);
      if (payload?.sub) {
        setUser({
          name: payload.name,
          email: payload.sub,
          role: payload.role,
          provider: payload.provider,
        });
      }
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) return { success: false, error: "Invalid credentials" };

      localStorage.setItem(TOKEN_KEY, data.token);

      const payload = decodeJWT(data.token);

      setUser({
        name: payload.name,
        email: payload.sub,
        role: payload.role,
        provider: payload.provider,
      });

      return { success: true };
    } catch {
      return { success: false, error: "Server error" };
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: email.split("@")[0],
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) return { success: false, error: "Signup failed" };

      localStorage.setItem(TOKEN_KEY, data.token);

      const payload = decodeJWT(data.token);

      setUser({
        name: payload.name,
        email: payload.sub,
        role: payload.role,
        provider: payload.provider,
      });

      return { success: true };
    } catch {
      return { success: false, error: "Server error" };
    }
  }, []);

  const loginWithOAuth = useCallback(async () => {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/google?prompt=select_account";
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loginWithOAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
