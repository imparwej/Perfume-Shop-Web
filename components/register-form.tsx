"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Eye, EyeOff, ArrowRight, Check, User, Mail, Lock, 
  Shield, Gem, Crown, Sparkles, Award, Star, Gift, 
  ChevronRight, Sparkle, Heart, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

interface RegisterFormProps {
  onSubmit?: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => void;
  className?: string;
}

export function RegisterForm({ onSubmit, className }: RegisterFormProps) {
  const router = useRouter();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [benefitsVisible, setBenefitsVisible] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setBenefitsVisible(true), 300);
    
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
    
    const fullName = `${firstName} ${lastName}`.trim();
    const result = await register(email, password);
    
    if (result.success) {
      onSubmit?.({ firstName, lastName, email, password });
      router.push("/");
    } else {
      setError(result.error || "Registration failed");
      setIsLoading(false);
    }
  };

  // Password strength indicators
  const passwordChecks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "Contains a number", valid: /\d/.test(password) },
    { label: "Contains uppercase", valid: /[A-Z]/.test(password) },
    { label: "Special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const passwordStrength = passwordChecks.filter(check => check.valid).length;

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
      <div className="relative z-10 text-center mb-10">
        {/* Logo */}
        <Link href="/" className="inline-block mb-10 group relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h2 className="font-serif text-2xl font-semibold tracking-[0.25em] text-foreground transition-all duration-300 group-hover:tracking-[0.3em] group-hover:scale-105 relative">
            MAISON NOIR
            <Sparkle className="absolute -top-3 -right-3 h-4 w-4 text-primary/50 opacity-0 group-hover:opacity-100 animate-pulse" />
          </h2>
        </Link>
        
        {/* Animated crown and gift */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/10 to-primary/20 blur-xl animate-pulse" />
          <div className="relative flex items-center justify-center gap-4">
            <Crown className="h-14 w-14 text-primary/80 drop-shadow-lg animate-float" />
            <Gift className="h-10 w-10 text-amber-500/80 drop-shadow-lg animate-float-delayed" />
          </div>
          <Sparkles className="absolute top-2 right-12 h-5 w-5 text-amber-400/60 animate-spin-slow" />
          <Sparkles className="absolute bottom-4 left-16 h-4 w-4 text-primary/50 animate-ping" />
        </div>
        
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
          Join Our World
        </h1>
        <p className="text-muted-foreground font-light text-sm tracking-wide max-w-sm mx-auto">
          Create your account for exclusive access to luxury fragrances
        </p>
      </div>

      {/* VIP Benefits Grid */}
      <div className={cn(
        "mb-8 grid grid-cols-2 gap-4 transition-all duration-1000 delay-200",
        benefitsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        {[
          { 
            icon: Crown, 
            label: "VIP Status", 
            desc: "Premium membership", 
            color: "from-purple-500/20 to-purple-500/5",
            border: "border-purple-500/20"
          },
          { 
            icon: Clock, 
            label: "Early Access", 
            desc: "New collections first", 
            color: "from-amber-500/20 to-amber-500/5",
            border: "border-amber-500/20"
          },
          { 
            icon: Gift, 
            label: "Welcome Gift", 
            desc: "On first purchase", 
            color: "from-primary/20 to-primary/5",
            border: "border-primary/20"
          },
          { 
            icon: Heart, 
            label: "Priority Support", 
            desc: "24/7 assistance", 
            color: "from-rose-500/20 to-rose-500/5",
            border: "border-rose-500/20"
          },
        ].map((benefit, index) => (
          <div 
            key={index}
            className={cn(
              "p-4 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-xl",
              "border border-border/40 hover:border-primary/30",
              "transition-all duration-500 rounded-2xl group hover:-translate-y-1 hover:shadow-xl",
              benefit.color
            )}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center group-hover:scale-110 transition-all duration-500 border ${benefit.border}`}>
                <benefit.icon className="h-6 w-6 text-foreground/80 group-hover:text-foreground group-hover:animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:tracking-wide transition-all duration-300">
                  {benefit.label}
                </p>
                <p className="text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                  {benefit.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="relative z-10 mb-6 p-4 bg-destructive/10 backdrop-blur-sm border border-destructive/30 rounded-2xl text-destructive text-sm text-center animate-in fade-in slide-in-from-top-2 duration-300 flex items-center justify-center gap-3">
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent rounded-2xl" />
          <Shield className="h-4 w-4 relative z-10" />
          <span className="relative z-10">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          {[{
            id: "firstName",
            value: firstName,
            setter: setFirstName,
            label: "First Name",
            placeholder: "First"
          }, {
            id: "lastName",
            value: lastName,
            setter: setLastName,
            label: "Last Name",
            placeholder: "Last"
          }].map((field) => (
            <div key={field.id} className="space-y-3">
              <label
                htmlFor={field.id}
                className={cn(
                  "block text-xs font-medium tracking-widest uppercase transition-all duration-300",
                  focusedField === field.id 
                    ? "text-primary animate-pulse" 
                    : "text-muted-foreground"
                )}
              >
                {field.label}
              </label>
              <div className="relative group">
                {/* Animated border */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                
                {field.id === "firstName" && (
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <User className={cn(
                      "h-5 w-5 transition-all duration-500",
                      focusedField === field.id 
                        ? "text-primary scale-125 animate-bounce" 
                        : "text-muted-foreground/60 group-hover:text-foreground group-hover:scale-110"
                    )} />
                  </div>
                )}
                
                <input
                  id={field.id}
                  type="text"
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  onFocus={() => setFocusedField(field.id)}
                  onBlur={() => setFocusedField(null)}
                  required
                  autoComplete={field.id === "firstName" ? "given-name" : "family-name"}
                  className={cn(
                    "w-full h-14 bg-gradient-to-br from-card/70 to-card/30 backdrop-blur-xl",
                    "border border-border/50 text-foreground placeholder:text-muted-foreground/40",
                    "focus:border-primary/60 focus:outline-none transition-all duration-500",
                    "focus:shadow-2xl focus:shadow-primary/20 rounded-2xl",
                    "group-hover:border-foreground/30 relative",
                    field.id === "firstName" ? "pl-12 pr-4" : "px-4"
                  )}
                  placeholder={field.placeholder}
                />
              </div>
            </div>
          ))}
        </div>

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
              autoComplete="email"
              className="w-full h-14 pl-12 pr-4 bg-gradient-to-br from-card/70 to-card/30 backdrop-blur-xl border border-border/50 text-foreground placeholder:text-muted-foreground/40 focus:border-primary/60 focus:outline-none transition-all duration-500 focus:shadow-2xl focus:shadow-primary/20 rounded-2xl group-hover:border-foreground/30 relative"
              placeholder="your@email.com"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
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
            {password && (
              <div className="flex items-center gap-2">
                <div className="text-xs font-medium text-foreground/70">
                  Strength: {passwordStrength}/4
                </div>
                <div className="w-20 h-2 bg-border rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-500", {
                      "bg-gradient-to-r from-red-500 to-red-400": passwordStrength === 1,
                      "bg-gradient-to-r from-orange-500 to-orange-400": passwordStrength === 2,
                      "bg-gradient-to-r from-yellow-500 to-yellow-400": passwordStrength === 3,
                      "bg-gradient-to-r from-emerald-500 to-emerald-400": passwordStrength === 4,
                    })}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
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
              autoComplete="new-password"
              className="w-full h-14 pl-12 pr-12 bg-gradient-to-br from-card/70 to-card/30 backdrop-blur-xl border border-border/50 text-foreground placeholder:text-muted-foreground/40 focus:border-primary/60 focus:outline-none transition-all duration-500 focus:shadow-2xl focus:shadow-primary/20 rounded-2xl group-hover:border-foreground/30 relative"
              placeholder="Create a password"
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
          
          {/* Password Strength Checks */}
          {password.length > 0 && (
            <div className="grid grid-cols-2 gap-3 pt-4">
              {passwordChecks.map((check) => (
                <div
                  key={check.label}
                  className="flex items-center gap-2 group"
                >
                  <div
                    className={cn(
                      "h-5 w-5 rounded-lg border flex items-center justify-center transition-all duration-500",
                      check.valid
                        ? "bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border-emerald-500/40 text-emerald-600 scale-110 shadow-lg shadow-emerald-500/20"
                        : "border-border bg-card/50 backdrop-blur-sm group-hover:border-foreground/40"
                    )}
                  >
                    {check.valid && (
                      <Check className="h-3 w-3 animate-scale-in" strokeWidth={3} />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs transition-all duration-500",
                      check.valid 
                        ? "text-foreground font-semibold tracking-wide" 
                        : "text-muted-foreground group-hover:text-foreground/70"
                    )}
                  >
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Marketing Checkbox */}
        <label className="flex items-start gap-4 cursor-pointer group p-4 bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-xl border border-border/40 rounded-2xl hover:border-primary/30 transition-all duration-500 hover:-translate-y-1">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={acceptMarketing}
              onChange={(e) => setAcceptMarketing(e.target.checked)}
              className="sr-only"
            />
            <div
              className={cn(
                "h-6 w-6 border rounded-lg transition-all duration-500 flex items-center justify-center",
                "group-hover:scale-110 group-hover:border-primary/60",
                acceptMarketing
                  ? "bg-gradient-to-br from-primary to-primary/80 border-primary shadow-lg shadow-primary/30"
                  : "border-border bg-card/50 backdrop-blur-sm"
              )}
            >
              {acceptMarketing && (
                <Check className="h-4 w-4 text-background animate-scale-in" strokeWidth={3} />
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary/60" />
              <span className="text-sm font-semibold text-foreground group-hover:tracking-wide transition-all duration-300">
                Exclusive Updates
              </span>
            </div>
            <span className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors duration-300">
              Receive updates about new collections, limited editions, and special offers before anyone else.
            </span>
          </div>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
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
              <span className="relative z-10 text-background font-semibold tracking-widest group-hover:tracking-wider transition-all duration-300">
                Create Account
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
              Already have an account?
            </span>
            <Sparkles className="w-4 h-4 text-primary/50 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Login Link */}
      <Link
        href="/login"
        className="group w-full h-14 border border-border/50 bg-gradient-to-br from-card/50 via-card/30 to-card/10 backdrop-blur-xl text-foreground font-medium tracking-widest uppercase text-sm hover:border-primary/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-2 relative overflow-hidden rounded-2xl"
      >
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Shimmer border */}
        <div className="absolute inset-0 rounded-2xl p-[1px]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">
          Sign In Instead
        </span>
        <ArrowRight className="h-4 w-4 relative z-10 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-125" />
      </Link>

      {/* Trust Badges */}
      <div className="mt-12 pt-8 border-t border-border/20">
        <div className="flex items-center justify-center gap-8 mb-6">
          {["SECURE SIGNUP", "DATA ENCRYPTED", "PRIVATE & SAFE"].map((badge) => (
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
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-primary transition-colors duration-300">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-primary transition-colors duration-300">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}