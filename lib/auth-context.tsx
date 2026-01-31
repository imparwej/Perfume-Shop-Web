"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

// User type - matches common backend auth patterns
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider?: "email" | "google" | "apple"; // Track auth provider
}

// OAuth provider types
export type OAuthProvider = "google" | "apple";

// Auth state and methods
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOAuth: (provider: OAuthProvider) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage key for mock auth
const AUTH_STORAGE_KEY = "maison_noir_auth_user";
const REDIRECT_KEY = "maison_noir_redirect_after_login";

// Helper to get/set redirect URL
export function setRedirectUrl(url: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(REDIRECT_KEY, url);
  }
}

export function getRedirectUrl(): string | null {
  if (typeof window !== "undefined") {
    const url = sessionStorage.getItem(REDIRECT_KEY);
    sessionStorage.removeItem(REDIRECT_KEY);
    return url;
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // MOCK: Read from localStorage
        // BACKEND: Replace with API call to validate session/token
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const userData = JSON.parse(stored) as User;
          setUser(userData);
        }
      } catch {
        // Invalid stored data, clear it
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        // MOCK: Simulate API delay and validation
        // BACKEND: Replace with actual API call
        // e.g., const response = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
        
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock validation - accept any email with password length >= 6
        if (password.length < 6) {
          return { success: false, error: "Invalid email or password" };
        }

        // Create mock user
        const mockUser: User = {
          id: `user_${Date.now()}`,
          email,
          name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        };

        // MOCK: Store in localStorage
        // BACKEND: The API would set an HTTP-only cookie instead
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
        setUser(mockUser);

        return { success: true };
      } catch {
        return { success: false, error: "An error occurred. Please try again." };
      }
    },
    []
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      name: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        // MOCK: Simulate API delay
        // BACKEND: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (password.length < 6) {
          return { success: false, error: "Password must be at least 6 characters" };
        }

        const mockUser: User = {
          id: `user_${Date.now()}`,
          email,
          name,
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
        setUser(mockUser);

        return { success: true };
      } catch {
        return { success: false, error: "An error occurred. Please try again." };
      }
    },
    []
  );

  const loginWithOAuth = useCallback(
    async (provider: OAuthProvider): Promise<{ success: boolean; error?: string }> => {
      try {
        // MOCK: Simulate OAuth popup/redirect flow
        // BACKEND: Replace with actual OAuth implementation:
        //
        // Option 1: Redirect flow (recommended for production)
        // window.location.href = `/api/auth/${provider}`;
        // return { success: true };
        //
        // Option 2: Popup flow
        // const popup = window.open(`/api/auth/${provider}`, 'oauth', 'width=500,height=600');
        // return new Promise((resolve) => {
        //   window.addEventListener('message', (e) => {
        //     if (e.data.type === 'oauth-success') resolve({ success: true });
        //   });
        // });
        //
        // Option 3: Using OAuth libraries (NextAuth.js, Auth.js, etc.)
        // import { signIn } from "next-auth/react";
        // await signIn(provider, { callbackUrl: getRedirectUrl() || "/" });
        
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock user from OAuth provider
        const mockOAuthUser: User = {
          id: `${provider}_${Date.now()}`,
          email: `user.${Date.now()}@gmail.com`,
          name: "Google User",
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=GU&backgroundColor=1a1a1a`,
          provider,
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockOAuthUser));
        setUser(mockOAuthUser);

        return { success: true };
      } catch {
        return { success: false, error: `Failed to sign in with ${provider}. Please try again.` };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    // MOCK: Clear localStorage
    // BACKEND: Call logout API endpoint to invalidate session
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithOAuth,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook to require auth - for use in checkout
export function useRequireAuth(redirectUrl: string = "/login") {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store current URL to redirect back after login
      setRedirectUrl(window.location.pathname);
      window.location.href = redirectUrl;
    }
  }, [isAuthenticated, isLoading, redirectUrl]);

  return { isAuthenticated, isLoading };
}
