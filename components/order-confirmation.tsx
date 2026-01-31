"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Package, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
}

interface OrderConfirmationProps {
  orderNumber: string;
  email: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  estimatedDelivery?: string;
  className?: string;
}

export function OrderConfirmation({
  orderNumber,
  email,
  items,
  subtotal,
  shipping,
  total,
  estimatedDelivery = "5-7 business days",
  className,
}: OrderConfirmationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [checkVisible, setCheckVisible] = useState(false);

  useEffect(() => {
    // Staggered animation sequence
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    const timer2 = setTimeout(() => setCheckVisible(true), 600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Success Icon */}
        <div
          className={cn(
            "flex justify-center mb-10",
            "transition-all duration-700 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <div className="relative">
            {/* Outer ring with animation */}
            <div
              className={cn(
                "w-24 h-24 rounded-full border-2 border-foreground/20",
                "flex items-center justify-center",
                "transition-all duration-500",
                checkVisible && "border-foreground/40"
              )}
            >
              {/* Inner circle */}
              <div
                className={cn(
                  "w-16 h-16 rounded-full bg-foreground",
                  "flex items-center justify-center",
                  "transition-all duration-500",
                  checkVisible ? "scale-100" : "scale-90"
                )}
              >
                <Check
                  className={cn(
                    "w-8 h-8 text-background",
                    "transition-all duration-300 delay-200",
                    checkVisible
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-50"
                  )}
                  strokeWidth={2.5}
                />
              </div>
            </div>

            {/* Decorative sparkles */}
            <Sparkles
              className={cn(
                "absolute -top-2 -right-2 w-5 h-5 text-accent",
                "transition-all duration-500 delay-700",
                checkVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
              )}
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Heading */}
        <div
          className={cn(
            "text-center mb-12",
            "transition-all duration-700 delay-200 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Order Confirmed
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4 text-balance">
            Thank You for Your Order
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Your order has been received and is being prepared with care. A
            confirmation email has been sent to{" "}
            <span className="text-foreground">{email}</span>
          </p>
        </div>

        {/* Order Details Card */}
        <div
          className={cn(
            "bg-secondary/30 p-8 md:p-10 mb-8",
            "transition-all duration-700 delay-400 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {/* Order Number & Delivery */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border/50 mb-6">
            <div>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                Order Number
              </p>
              <p className="font-serif text-lg text-foreground">{orderNumber}</p>
            </div>
            <div className="md:text-right">
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                Estimated Delivery
              </p>
              <div className="flex items-center gap-2 md:justify-end">
                <Package className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                <p className="text-foreground">{estimatedDelivery}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-6 pb-6 border-b border-border/50 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-20 h-24 bg-secondary/50 flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg text-foreground mb-1">
                    {item.name}
                  </h3>
                  {item.size && (
                    <p className="text-sm text-muted-foreground mb-1">
                      {item.size}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-foreground">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">
                ${subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-foreground">
                {shipping === 0 ? (
                  <span className="text-accent">Complimentary</span>
                ) : (
                  `$${shipping}`
                )}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-border/50">
              <span className="font-serif text-lg text-foreground">Total</span>
              <span className="font-serif text-xl text-foreground">
                ${total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          className={cn(
            "flex flex-col sm:flex-row gap-4 justify-center",
            "transition-all duration-700 delay-600 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-medium tracking-widest uppercase bg-foreground text-background hover:bg-foreground/90 transition-colors duration-300"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Support note */}
        <p
          className={cn(
            "text-center text-xs text-muted-foreground mt-12",
            "transition-all duration-700 delay-700 ease-out",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          Questions about your order? Contact us at{" "}
          <a
            href="mailto:support@maisonnoir.com"
            className="text-foreground hover:underline underline-offset-4"
          >
            support@maisonnoir.com
          </a>
        </p>
      </div>
    </div>
  );
}
