"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  className?: string;
}

/**
 * Newsletter subscription form component
 * BACKEND: Replace the handleSubmit function with actual API call
 * Example: await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) })
 */
export function NewsletterForm({ className }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setStatus("loading");
    
    try {
      // MOCK: Simulate API call
      // BACKEND: Replace with actual newsletter subscription API
      // const response = await fetch('/api/newsletter', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      // if (!response.ok) throw new Error('Subscription failed');
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setStatus("success");
      setMessage("Thank you for subscribing!");
      setEmail("");
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={status === "loading"}
          className="flex-1 h-14 px-6 bg-transparent border border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-300 disabled:opacity-50"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "h-14 px-8 text-sm font-medium tracking-widest uppercase transition-all duration-300 whitespace-nowrap",
            status === "success"
              ? "bg-green-600 text-white"
              : "bg-foreground text-background hover:bg-foreground/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {status === "loading" ? (
            <span className="inline-block h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
          ) : status === "success" ? (
            "Subscribed"
          ) : (
            "Subscribe"
          )}
        </button>
      </form>
      
      {/* Status message */}
      {message && (
        <p
          className={cn(
            "mt-4 text-sm text-center animate-in fade-in slide-in-from-bottom-2 duration-300",
            status === "error" ? "text-destructive" : "text-green-600"
          )}
        >
          {message}
        </p>
      )}
      
      {/* Consent text */}
      {status === "idle" && (
        <p className="mt-6 text-xs text-muted-foreground text-center">
          By subscribing, you agree to receive marketing communications from us.
        </p>
      )}
    </div>
  );
}
