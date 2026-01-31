"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, getRedirectUrl } from "@/lib/auth-context";

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
    
    const fullName = `${firstName} ${lastName}`.trim();
    const result = await register(email, password, fullName);
    
    if (result.success) {
      onSubmit?.({ firstName, lastName, email, password });
      // BACKEND: Store marketing preference with API call
      // await fetch('/api/user/preferences', { method: 'POST', body: JSON.stringify({ marketing: acceptMarketing }) })
      const redirectUrl = getRedirectUrl() || "/";
      router.push(redirectUrl);
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
  ];

  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto",
        className
      )}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <Link href="/" className="inline-block mb-8">
          <h2 className="font-serif text-2xl font-semibold tracking-wide text-foreground">
            MAISON NOIR
          </h2>
        </Link>
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4">
          Create Account
        </h1>
        <p className="text-muted-foreground">
          Join our exclusive world of luxury fragrances
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center animate-in fade-in slide-in-from-top-2 duration-300">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium tracking-wide uppercase text-muted-foreground"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
              className="w-full h-14 px-4 bg-transparent border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-300"
              placeholder="First"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium tracking-wide uppercase text-muted-foreground"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              autoComplete="family-name"
              className="w-full h-14 px-4 bg-transparent border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-300"
              placeholder="Last"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium tracking-wide uppercase text-muted-foreground"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full h-14 px-4 bg-transparent border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-300"
            placeholder="your@email.com"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium tracking-wide uppercase text-muted-foreground"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full h-14 px-4 pr-12 bg-transparent border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-300"
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Eye className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
          
          {/* Password Strength */}
          {password.length > 0 && (
            <div className="pt-3 space-y-2">
              {passwordChecks.map((check) => (
                <div
                  key={check.label}
                  className="flex items-center gap-2 text-sm"
                >
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full flex items-center justify-center transition-colors duration-300",
                      check.valid
                        ? "bg-foreground text-background"
                        : "border border-border"
                    )}
                  >
                    {check.valid && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                  </div>
                  <span
                    className={cn(
                      "transition-colors duration-300",
                      check.valid ? "text-foreground" : "text-muted-foreground"
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
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={acceptMarketing}
              onChange={(e) => setAcceptMarketing(e.target.checked)}
              className="sr-only"
            />
            <div
              className={cn(
                "h-5 w-5 border transition-all duration-300 flex items-center justify-center",
                acceptMarketing
                  ? "bg-foreground border-foreground"
                  : "border-border group-hover:border-foreground/50"
              )}
            >
              {acceptMarketing && (
                <Check className="h-3 w-3 text-background" strokeWidth={3} />
              )}
            </div>
          </div>
          <span className="text-sm text-muted-foreground leading-relaxed">
            I would like to receive exclusive updates about new collections, 
            limited editions, and special offers.
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group w-full h-14 bg-foreground text-background font-medium tracking-widest uppercase text-sm hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="inline-block h-5 w-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
          <span className="bg-background px-4 text-sm text-muted-foreground">
            Already have an account?
          </span>
        </div>
      </div>

      {/* Login Link */}
      <Link
        href="/login"
        className="group w-full h-14 border border-foreground text-foreground font-medium tracking-widest uppercase text-sm hover:bg-foreground hover:text-background transition-all duration-300 flex items-center justify-center gap-2"
      >
        Sign In
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>

      {/* Trust Badges */}
      <div className="mt-12 pt-8 border-t border-border/50">
        <p className="text-center text-xs text-muted-foreground leading-relaxed">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
