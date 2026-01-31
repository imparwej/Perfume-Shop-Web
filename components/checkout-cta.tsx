"use client";

import { useState } from "react";
import { ArrowRight, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutCTAProps {
  total: number;
  itemCount: number;
  onCheckout: () => void | Promise<void>;
  disabled?: boolean;
  className?: string;
}

export function CheckoutCTA({
  total,
  itemCount,
  onCheckout,
  disabled = false,
  className,
}: CheckoutCTAProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCheckout = async () => {
    if (disabled || isProcessing) return;
    setIsProcessing(true);
    try {
      // BACKEND: This is where you would:
      // 1. Create order in database: POST /api/orders
      // 2. Process payment: POST /api/payments (Stripe, PayPal, etc.)
      // 3. Clear cart after successful payment
      // 4. Redirect to order confirmation
      await onCheckout();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Premium CTA Button */}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={disabled || isProcessing}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative w-full group overflow-hidden",
          "py-5 px-8",
          "bg-foreground text-background",
          "transition-all duration-500 ease-out",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isHovered && !disabled && "shadow-lg"
        )}
      >
        {/* Animated shine effect */}
        <div
          className={cn(
            "absolute inset-0 -translate-x-full",
            "bg-gradient-to-r from-transparent via-white/10 to-transparent",
            "transition-transform duration-700 ease-out",
            isHovered && !disabled && "translate-x-full"
          )}
        />

        {/* Button content */}
        <div className="relative flex items-center justify-center gap-3">
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              <span className="text-sm font-medium tracking-widest uppercase">
                Processing
              </span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-sm font-medium tracking-widest uppercase">
                Complete Purchase
              </span>
              <ArrowRight
                className={cn(
                  "w-4 h-4 transition-transform duration-300",
                  isHovered && "translate-x-1"
                )}
                strokeWidth={1.5}
              />
            </>
          )}
        </div>
      </button>

      {/* Order summary line */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
        <span className="font-serif text-lg text-foreground">
          ${total.toLocaleString()}
        </span>
      </div>

      {/* Trust indicators */}
      <div className="pt-4 border-t border-border/50">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span className="tracking-wide">
            Secure checkout with complimentary gift wrapping
          </span>
        </div>
      </div>
    </div>
  );
}
