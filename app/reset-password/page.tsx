"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Lock, Eye, EyeOff, ArrowRight, Sparkles, Loader2, 
  Shield, CheckCircle2, Clock, RefreshCw, Key,
  Sparkle, Gem, ShieldCheck, ChevronRight, Star,
  CircleAlert, LockKeyhole
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ResetPassword() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [msg, setMsg] = useState("");
  const [shake, setShake] = useState(false);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);

  const inputs = useRef<HTMLInputElement[]>([]);

  // Initialize particles and mouse tracking
  useEffect(() => {
    // Create floating particles
    const initialParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(initialParticles);

    // Mouse move effect for background glow
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setGlowPosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const t = setInterval(() => setTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleOtpChange = (i: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const copy = [...otp];
    copy[i] = value;
    setOtp(copy);

    if (value && i < 5) {
      inputs.current[i + 1]?.focus();
    } else if (!value && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) {
      inputs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowRight" && i < 5) {
      inputs.current[i + 1]?.focus();
    }
  };

  const resendOtp = async () => {
    setResending(true);
    setMsg("");

    try {
      await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setTimer(60);
      setMsg("OTP has been resent to your email");
      
      // Auto-clear success message after 3 seconds
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setMsg("Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const reset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const finalOtp = otp.join("");

    // Validate OTP length
    if (finalOtp.length !== 6) {
      setMsg("Please enter all 6 digits of the OTP");
      setLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    if (password !== confirm) {
      setMsg("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMsg("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: finalOtp, password }),
      });

      const text = await res.text();

      if (!res.ok) {
        setShake(true);
        setTimeout(() => setShake(false), 400);
        setMsg("Invalid OTP. Please try again.");
        setLoading(false);
        return;
      }

      setMsg("Password reset successfully!");
      setIsComplete(true);

      // Redirect to login after 2 seconds
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setMsg("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col relative overflow-hidden">
      {/* Animated background glow */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, 
            var(--primary)/5%, 
            transparent 40%)`,
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float-slow pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.id * 0.5}s`,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-block mb-10 group relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h2 className="font-serif text-2xl font-semibold tracking-[0.25em] text-foreground transition-all duration-300 group-hover:tracking-[0.3em] group-hover:scale-105 relative">
                MAISON NOIR
                <Sparkle className="absolute -top-3 -right-3 h-4 w-4 text-primary/50 opacity-0 group-hover:opacity-100 animate-pulse" />
              </h2>
            </Link>
            
            {/* Success State */}
            {isComplete ? (
              <div className="space-y-4">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping" />
                  <div className="absolute inset-4 bg-emerald-500/20 rounded-full animate-pulse" />
                  <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                    <LockKeyhole className="h-12 w-12 text-background" />
                  </div>
                  <Gem className="absolute -top-2 -right-2 h-6 w-6 text-amber-400 animate-bounce" />
                </div>
                <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                  Password Reset
                </h1>
                <p className="text-muted-foreground font-light text-sm tracking-wide">
                  Your password has been successfully updated
                </p>
              </div>
            ) : (
              <>
                {/* Animated lock icon */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/10 to-primary/20 blur-xl animate-pulse" />
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 flex items-center justify-center backdrop-blur-sm">
                      <Key className="h-12 w-12 text-primary/80 animate-float" />
                    </div>
                    <Sparkles className="absolute top-2 right-12 h-5 w-5 text-amber-400/60 animate-spin-slow" />
                    <Sparkles className="absolute bottom-4 left-16 h-4 w-4 text-primary/50 animate-ping" />
                  </div>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                  Reset Password
                </h1>
                <p className="text-muted-foreground font-light text-sm tracking-wide max-w-sm mx-auto">
                  Enter the 6-digit OTP sent to{" "}
                  <span className="font-semibold text-foreground bg-gradient-to-r from-primary/20 to-primary/10 px-2 py-1 rounded-lg">
                    {email}
                  </span>
                </p>
              </>
            )}
          </div>

          {/* Security Banner */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 rounded-full">
              <ShieldCheck className="h-4 w-4 text-primary/70" />
              <span className="text-xs font-medium text-primary/80 tracking-wider uppercase">SECURE RESET</span>
              <Star className="h-3 w-3 text-amber-400/60 animate-pulse" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Success Message Card */}
          {isComplete && (
            <div className="mb-8 p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-xl border border-emerald-500/30 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h3 className="font-medium text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
                    Password Updated Successfully
                    <Sparkle className="h-4 w-4 text-emerald-400/60 animate-pulse" />
                  </h3>
                  <p className="text-sm text-emerald-600/80 dark:text-emerald-300/80">
                    You will be redirected to the login page shortly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error/Success Message */}
          {msg && !isComplete && (
            <div className={cn(
              "mb-6 p-4 backdrop-blur-xl border rounded-2xl text-sm text-center animate-in fade-in slide-in-from-top-2 duration-300 flex items-center justify-center gap-3",
              msg.includes("error") || msg.includes("Error") || msg.includes("Invalid") || msg.includes("Failed")
                ? "bg-destructive/10 border-destructive/30 text-destructive"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
            )}>
              <CircleAlert className="h-4 w-4 flex-shrink-0" />
              <span>{msg}</span>
            </div>
          )}

          {/* Form */}
          {!isComplete && (
            <form onSubmit={reset} className="space-y-8">
              {/* OTP Input */}
              <div className="space-y-4">
                <label
                  className="block text-xs font-medium tracking-widest uppercase text-muted-foreground"
                >
                  6-Digit Verification Code
                </label>
                <div className={cn(
                  "flex gap-3 justify-center",
                  shake && "animate-shake"
                )}>
                  {otp.map((digit, i) => (
                    <div key={i} className="relative group">
                      {/* Animated border */}
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 rounded-xl blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                      
                      <input
                        ref={(el) => {
                          if (el) inputs.current[i] = el;
                        }}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onFocus={() => setFocusedField(`otp-${i}`)}
                        onBlur={() => setFocusedField(null)}
                        maxLength={1}
                        disabled={loading}
                        className={cn(
                          "w-14 h-14 bg-gradient-to-br from-card/70 to-card/30 backdrop-blur-xl",
                          "border-2 border-border/50 text-center text-2xl font-medium rounded-xl",
                          "text-foreground focus:border-primary/60 focus:outline-none",
                          "transition-all duration-500 focus:shadow-2xl focus:shadow-primary/20",
                          "disabled:opacity-50 disabled:cursor-not-allowed relative",
                          "group-hover:border-foreground/30"
                        )}
                      />
                    </div>
                  ))}
                </div>

                {/* Resend OTP Timer */}
                <div className="flex items-center justify-center gap-3 pt-4">
                  {timer > 0 ? (
                    <>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Resend OTP in <span className="font-semibold text-primary bg-gradient-to-r from-primary/20 to-primary/10 px-2 py-1 rounded-lg">{timer}s</span>
                      </p>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={resendOtp}
                      disabled={resending}
                      className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 relative overflow-hidden px-4 py-2 rounded-lg"
                    >
                      {/* Hover background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                      
                      {resending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin relative z-10" />
                          <span className="relative z-10">Sending...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180 relative z-10" />
                          <span className="relative z-10">Resend OTP</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Password Fields */}
              <div className="space-y-4">
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
                    New Password
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
                      disabled={loading}
                      autoComplete="new-password"
                      className="w-full h-14 pl-12 pr-12 bg-gradient-to-br from-card/70 to-card/30 backdrop-blur-xl border border-border/50 text-foreground placeholder:text-muted-foreground/40 focus:border-primary/60 focus:outline-none transition-all duration-500 focus:shadow-2xl focus:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl group-hover:border-foreground/30 relative"
                      placeholder="Enter your new password"
                    />
                    
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-primary transition-all duration-300 p-2 hover:scale-125 hover:rotate-12 z-10"
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

                <div className="space-y-3">
                  <label
                    htmlFor="confirm"
                    className={cn(
                      "block text-xs font-medium tracking-widest uppercase transition-all duration-300",
                      focusedField === "confirm" 
                        ? "text-primary animate-pulse" 
                        : "text-muted-foreground"
                    )}
                  >
                    Confirm Password
                  </label>
                  <div className="relative group">
                    {/* Animated border */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                    
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <Lock className={cn(
                        "h-5 w-5 transition-all duration-500",
                        focusedField === "confirm" 
                          ? "text-primary scale-125 animate-bounce" 
                          : "text-muted-foreground/60 group-hover:text-foreground group-hover:scale-110"
                      )} />
                    </div>
                    
                    <input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      onFocus={() => setFocusedField("confirm")}
                      onBlur={() => setFocusedField(null)}
                      required
                      disabled={loading}
                      autoComplete="new-password"
                      className="w-full h-14 pl-12 pr-12 bg-gradient-to-br from-card/70 to-card/30 backdrop-blur-xl border border-border/50 text-foreground placeholder:text-muted-foreground/40 focus:border-primary/60 focus:outline-none transition-all duration-500 focus:shadow-2xl focus:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl group-hover:border-foreground/30 relative"
                      placeholder="Confirm your new password"
                    />
                    
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-primary transition-all duration-300 p-2 hover:scale-125 hover:rotate-12 z-10"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? (
                        <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                      ) : (
                        <Eye className="h-5 w-5" strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Requirements */}
              <div className="p-4 bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-sm border border-border/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary/60 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Password Requirements</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                        Minimum 6 characters
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                        Use a mix of letters, numbers, and symbols
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                        Avoid common passwords
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
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
                
                {loading ? (
                  <div className="relative z-10 flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Updating Password...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10 text-background font-semibold tracking-widest">
                      Reset Password
                    </span>
                    <ArrowRight className="h-4 w-4 relative z-10 text-background transition-all duration-300 group-hover:translate-x-2 group-hover:scale-125" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
            </div>
            <div className="relative flex justify-center">
              <div className="bg-background px-8 flex items-center gap-4">
                <Sparkles className="w-4 h-4 text-primary/50 animate-pulse" />
                <span className="text-sm text-muted-foreground font-light tracking-wide">
                  Back to login
                </span>
                <Sparkles className="w-4 h-4 text-primary/50 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Back to Login Link */}
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
              Return to Login
            </span>
            <ArrowRight className="h-4 w-4 relative z-10 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-125" />
          </Link>

          {/* Security Note */}
          <div className="mt-12 pt-8 border-t border-border/20">
            <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-br from-card/30 to-card/10 backdrop-blur-sm border border-border/30 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-6 w-6 text-primary/70" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Secure Password Reset</h4>
                <p className="text-xs text-muted-foreground">
                  OTP is valid for 10 minutes. Create a strong, unique password for your security.
                </p>
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground/70 leading-relaxed font-light tracking-wide">
              Your security is our priority. All data is encrypted during transmission.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Trust Badges */}
      <div className="border-t border-border/20 py-8 backdrop-blur-sm bg-background/50 relative z-10">
        <div className="max-w-md mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                label: "End-to-End", 
                desc: "Fully encrypted", 
                icon: LockKeyhole,
                color: "from-blue-500/10 to-blue-500/5"
              },
              { 
                label: "Instant OTP", 
                desc: "Delivered in seconds", 
                icon: Clock,
                color: "from-emerald-500/10 to-emerald-500/5"
              },
              { 
                label: "No Data Stored", 
                desc: "We don't save passwords", 
                icon: Shield,
                color: "from-amber-500/10 to-amber-500/5"
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className={cn(
                  "w-12 h-12 rounded-xl border mx-auto mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                  "bg-gradient-to-br", item.color,
                  "border-border/40 group-hover:border-primary/30"
                )}>
                  <item.icon className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors duration-300" />
                </div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary/80 transition-colors duration-300">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}