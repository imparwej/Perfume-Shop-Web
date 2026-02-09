"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Eye, EyeOff, ArrowRight, Sparkles, Mail, Lock, 
  Crown, Shield, Gem, Check, Star, ChevronRight, 
  Sparkle, Users, Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, type OAuthProvider } from "@/lib/auth-context";

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
  const [rememberMe, setRememberMe] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setMounted(true);
    
    // Mouse move effect for background glow
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setGlowPosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // If already authenticated, redirect
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      onSubmit?.({ email, password });
      router.push("/");
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
     router.push("/");
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
      {/* Animated background glow */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, 
            var(--primary)/5%, 
            transparent 40%)`,
        }}
      />

      {/* Header */}
      <div className="relative z-10 text-center mb-12">
        {/* Logo with glow */}
        <Link href="/" className="inline-block mb-10 group relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h2 className="font-serif text-2xl font-semibold tracking-[0.25em] text-foreground transition-all duration-300 group-hover:tracking-[0.3em] group-hover:scale-105 relative">
            MAISON NOIR
            <Sparkle className="absolute -top-3 -right-3 h-4 w-4 text-primary/50 opacity-0 group-hover:opacity-100 animate-pulse" />
          </h2>
        </Link>
        
        {/* Animated crown */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-xl animate-pulse" />
          <div className="relative">
            <Crown className="h-14 w-14 text-primary/80 mx-auto mb-6 drop-shadow-lg animate-float" />
            <Sparkles className="absolute top-0 right-10 h-6 w-6 text-amber-400/60 animate-spin-slow" />
            <Sparkles className="absolute bottom-2 left-12 h-4 w-4 text-primary/50 animate-ping" />
          </div>
        </div>
        
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-muted-foreground font-light text-sm tracking-wide">
          Sign in to access your account and exclusive benefits
        </p>
      </div>

      {/* VIP Marquee */}
      <div className="relative mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10" />
        <div className="flex gap-6 animate-marquee whitespace-nowrap">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-full">
                <Star className="h-3 w-3 text-primary/70 animate-spin-slow" />
                <span className="text-xs font-medium text-primary/80 tracking-wider">VIP ACCESS</span>
                <Star className="h-3 w-3 text-primary/70 animate-spin-slow" />
              </div>
              <Gem className="h-3 w-3 text-amber-400/60" />
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-full">
                <Package className="h-3 w-3 text-amber-500/70" />
                <span className="text-xs font-medium text-amber-600/80 tracking-wider">FREE SHIPPING</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="relative z-10 mb-6 p-4 bg-destructive/10 backdrop-blur-sm border border-destructive/30 rounded-2xl text-destructive text-sm text-center animate-in fade-in slide-in-from-top-2 duration-300 flex items-center justify-center gap-3">
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent rounded-2xl" />
          <Shield className="h-4 w-4 relative z-10" />
          <span className="relative z-10">{error}</span>
        </div>
      )}

      {/* OAuth Sign-in */}
      <div className="relative z-10 space-y-3 mb-8">
        <button
          type="button"
          onClick={() => handleOAuthLogin("google")}
          disabled={isLoading || oauthLoading !== null}
          className={cn(
            "group w-full h-14 flex items-center justify-center gap-3",
            "bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl",
            "border border-border/50 hover:border-primary/40",
            "text-foreground font-medium text-sm tracking-wide",
            "transition-all duration-500 rounded-2xl",
            "hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "relative overflow-hidden"
          )}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Animated border */}
          <div className="absolute inset-0 rounded-2xl p-[1px]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 via-30% to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
          </div>
          
          {oauthLoading === "google" ? (
            <div className="relative z-10">
              <div className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <svg
                className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300"
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
              <span className="relative z-10 font-medium group-hover:tracking-wider transition-all duration-300">
                Continue with Google
              </span>
            </>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-8 text-xs text-muted-foreground uppercase tracking-[0.3em] font-medium">
            OR SIGN IN WITH EMAIL
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        {/* Email Field */}
        <div className="space-y-3">
          <label
            htmlFor="email"
            className={cn(
              "block text-xs font-medium tracking-widest uppercase transition-all duration-300",
              focusedField === "email" 
                ? "text-primary animate-pulse" 
                : "text-muted-foreground"
            )}
          >
            Email Address
          </label>
          <div className="relative group">
            {/* Animated border */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
            
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Mail className={cn(
                "h-5 w-5 transition-all duration-500",
                focusedField === "email" 
                  ? "text-primary scale-125 animate-bounce" 
                  : "text-muted-foreground/60 group-hover:text-foreground group-hover:scale-110"
              )} />
            </div>
            
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
              className="w-full h-14 pl-12 pr-4 bg-gradient-to-br from-card/70 to-card/30 backdrop-blur-xl border border-border/50 text-foreground placeholder:text-muted-foreground/40 focus:border-primary/60 focus:outline-none transition-all duration-500 focus:shadow-2xl focus:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl group-hover:border-foreground/30 relative"
              placeholder="your@email.com"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-3">
          <label
            htmlFor="password"
            className={cn(
              "block text-xs font-medium tracking-widest uppercase transition-all duration-300",
              focusedField === "password" 
                ? "text-primary animate-pulse" 
                : "text-muted-foreground"
            )}
          >
            Password
          </label>
          <div className="relative group">
            {/* Animated border */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
            
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Lock className={cn(
                "h-5 w-5 transition-all duration-500",
                focusedField === "password" 
                  ? "text-primary scale-125 animate-bounce" 
                  : "text-muted-foreground/60 group-hover:text-foreground group-hover:scale-110"
              )} />
            </div>
            
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
              className="w-full h-14 pl-12 pr-12 bg-gradient-to-br from-card/70 to-card/30 backdrop-blur-xl border border-border/50 text-foreground placeholder:text-muted-foreground/40 focus:border-primary/60 focus:outline-none transition-all duration-500 focus:shadow-2xl focus:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl group-hover:border-foreground/30 relative"
              placeholder="Enter your password"
            />
            
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-primary transition-all duration-300 p-2 hover:scale-125 hover:rotate-12"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Eye className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Options Row */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only"
              />
              <div className={cn(
                "h-5 w-5 border rounded-md transition-all duration-500 flex items-center justify-center",
                "group-hover:scale-110 group-hover:border-primary/60",
                rememberMe
                  ? "bg-primary border-primary shadow-lg shadow-primary/30"
                  : "border-border bg-card/50 backdrop-blur-sm"
              )}>
                {rememberMe && (
                  <Check className="h-3 w-3 text-background animate-scale-in" strokeWidth={3} />
                )}
              </div>
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              Remember me
            </span>
          </label>

          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 relative group"
          >
            <span className="relative flex items-center gap-1">
              Forgot password?
              <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-primary to-primary/30 transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || oauthLoading !== null}
          className="group w-full h-14 bg-gradient-to-r from-primary via-primary/90 to-primary font-medium tracking-widest uppercase text-sm hover:shadow-2xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 flex items-center justify-center gap-2 relative overflow-hidden rounded-2xl hover:-translate-y-1 active:scale-95"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-100 group-hover:opacity-90 transition-opacity duration-300" />
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/30 via-40% to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
          </div>
          
          {/* Pulsing glow */}
          <div className="absolute -inset-[2px] bg-gradient-to-r from-primary via-primary/50 to-primary blur opacity-0 group-hover:opacity-50 group-hover:animate-pulse-slow transition-opacity duration-500" />
          
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {isLoading ? (
            <div className="relative z-10">
              <div className="h-5 w-5 border-2 border-background/40 border-t-background rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <span className="relative z-10 text-background font-semibold tracking-widest">
                Sign In
              </span>
              <ArrowRight className="h-4 w-4 relative z-10 text-background transition-all duration-300 group-hover:translate-x-2 group-hover:scale-125" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        </div>
        <div className="relative flex justify-center">
          <div className="bg-background px-8 flex items-center gap-4">
            <Sparkles className="w-4 h-4 text-primary/50 animate-pulse" />
            <span className="text-sm text-muted-foreground font-light tracking-wide">
              New to Maison Noir?
            </span>
            <Sparkles className="w-4 h-4 text-primary/50 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Register Link */}
      <Link
        href="/register"
        className="group w-full h-14 border border-border/50 bg-gradient-to-br from-card/50 via-card/30 to-card/10 backdrop-blur-xl text-foreground font-medium tracking-widest uppercase text-sm hover:border-primary/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-2 relative overflow-hidden rounded-2xl"
      >
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Shimmer border */}
        <div className="absolute inset-0 rounded-2xl p-[1px]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">
          Create Account
        </span>
        <ArrowRight className="h-4 w-4 relative z-10 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-125" />
      </Link>

      {/* Trust Badges */}
      <div className="mt-12 pt-8 border-t border-border/20">
        <div className="flex items-center justify-center gap-8 mb-6">
          {["SSL SECURE", "GDPR COMPLIANT", "AES-256 ENCRYPTED"].map((badge) => (
            <div key={badge} className="text-center group">
              <div className="w-10 h-10 border border-border/30 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm bg-card/40 group-hover:scale-110 transition-all duration-300 group-hover:border-primary/30">
                <Shield className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors duration-300" />
              </div>
              <p className="text-xs font-medium text-foreground/70 group-hover:text-foreground transition-colors duration-300">
                {badge}
              </p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground/70 leading-relaxed font-light tracking-wide">
          By signing in, you agree to our{" "}
          <Link
            href="/terms"
            className="underline hover:text-primary transition-colors duration-300"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline hover:text-primary transition-colors duration-300"
          >
            Privacy Policy
          </Link>
        </p>
      </div>

      {/* Stats Footer */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        {[
          { label: "Premium Members", value: "10K+", icon: Users },
          { label: "Exclusive Scents", value: "200+", icon: Package },
          { label: "Countries", value: "50+", icon: Star },
        ].map((stat, index) => (
          <div key={index} className="p-3 bg-card/20 backdrop-blur-sm border border-border/20 rounded-xl">
            <stat.icon className="h-4 w-4 text-primary/60 mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}