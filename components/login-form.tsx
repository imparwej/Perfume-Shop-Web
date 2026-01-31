"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, getRedirectUrl, type OAuthProvider } from "@/lib/auth-context";

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
  className?: string;
}

export function LoginForm({ onSubmit, className }: LoginFormProps) {
  const router = useRouter();
  const { login, loginWithOAuth, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If already authenticated, redirect
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirectUrl = getRedirectUrl() || "/";
      router.push(redirectUrl);
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      onSubmit?.({ email, password });
      // Get redirect URL (e.g., /checkout) or default to home
      const redirectUrl = getRedirectUrl() || "/";
      router.push(redirectUrl);
    } else {
      setError(result.error || "Login failed");
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    setError(null);
    setOauthLoading(provider);

    const result = await loginWithOAuth(provider);

    if (result.success) {
      const redirectUrl = getRedirectUrl() || "/";
      router.push(redirectUrl);
    } else {
      setError(result.error || `Failed to sign in with ${provider}`);
      setOauthLoading(null);
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto transition-all duration-1000",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <Link href="/" className="inline-block mb-8 group">
          <h2 className="font-serif text-2xl font-semibold tracking-[0.15em] text-foreground transition-all duration-300 group-hover:tracking-[0.2em]">
            MAISON NOIR
          </h2>
        </Link>
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4">
          Welcome Back
        </h1>
        <p className="text-muted-foreground">
          Sign in to access your account and exclusive benefits
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center animate-in fade-in slide-in-from-top-2 duration-300">
          {error}
        </div>
      )}

      {/* OAuth Sign-in Options */}
      <div className="space-y-3">
        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={() => handleOAuthLogin("google")}
          disabled={isLoading || oauthLoading !== null}
          className={cn(
            "group w-full h-14 flex items-center justify-center gap-3",
            "bg-background border border-border hover:border-foreground/30",
            "text-foreground font-medium text-sm tracking-wide",
            "transition-all duration-300",
            "hover:shadow-lg hover:shadow-foreground/5",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "relative overflow-hidden"
          )}
        >
          {/* Subtle hover background effect */}
          <span className="absolute inset-0 bg-foreground/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {oauthLoading === "google" ? (
            <span className="inline-block h-5 w-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
          ) : (
            <>
              {/* Google Icon */}
              <svg
                className="w-5 h-5 relative z-10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="relative z-10">Continue with Google</span>
            </>
          )}
        </button>
      </div>

      {/* Divider between OAuth and Email */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-xs text-muted-foreground uppercase tracking-widest">
            or continue with email
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className={cn(
              "block text-sm font-medium tracking-wide uppercase transition-colors duration-300",
              focusedField === "email" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              required
              disabled={oauthLoading !== null}
              autoComplete="email"
              className="w-full h-14 px-4 bg-transparent border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-all duration-300 focus:shadow-lg focus:shadow-foreground/5 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="your@email.com"
            />
            <div
              className={cn(
                "absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-500",
                focusedField === "email" ? "w-full" : "w-0"
              )}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className={cn(
              "block text-sm font-medium tracking-wide uppercase transition-colors duration-300",
              focusedField === "password" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              required
              disabled={oauthLoading !== null}
              autoComplete="current-password"
              className="w-full h-14 px-4 pr-12 bg-transparent border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-all duration-300 focus:shadow-lg focus:shadow-foreground/5 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300 p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Eye className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
            <div
              className={cn(
                "absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-500",
                focusedField === "password" ? "w-full" : "w-0"
              )}
            />
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
          >
            Forgot password?
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || oauthLoading !== null}
          className="group w-full h-14 bg-foreground text-background font-medium tracking-widest uppercase text-sm hover:shadow-xl hover:shadow-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 flex items-center justify-center gap-2 relative overflow-hidden"
        >
          {isLoading ? (
            <span className="inline-block h-5 w-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
          ) : (
            <>
              <span className="relative z-10">Sign In</span>
              <ArrowRight className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-sm text-muted-foreground flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            New to Maison Noir?
            <Sparkles className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Register Link */}
      <Link
        href="/register"
        className="group w-full h-14 border border-foreground/30 text-foreground font-medium tracking-widest uppercase text-sm hover:bg-foreground hover:text-background transition-all duration-500 flex items-center justify-center gap-2"
      >
        <span>Create Account</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>

      {/* Trust Badges */}
      <div className="mt-12 pt-8 border-t border-border/50">
        <p className="text-center text-xs text-muted-foreground leading-relaxed">
          By signing in, you agree to our{" "}
          <Link
            href="/terms"
            className="underline hover:text-foreground transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
