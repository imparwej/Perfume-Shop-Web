"use client";

import React, { useState } from "react";
import { CreditCard, Banknote, CheckCircle, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { apiFetch } from "@/lib/apiClient";

export type PaymentMethod = "online" | "cash";

interface PaymentSystemProps {
  amount: number;
  disabled?: boolean;
}

export function PaymentSystem({ amount, disabled = false }: PaymentSystemProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { items: cartItems, clearCart } = useCart();

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setShowDetails(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedMethod) return;

    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await apiFetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: selectedMethod,
          items: cartItems.map((item) => ({
            perfumeId: item.perfumeId,
            quantity: item.quantity,
          })),
        }),
      });

      if (!res) {
        alert("Session expired. Please login again.");
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        throw new Error("Order failed");
      }

      const data = await res.json();

      console.log("Order created:", data);

      clearCart();
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-medium tracking-wide">
        Select Payment Method
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          type="button"
          onClick={() => handleMethodSelect("online")}
          disabled={disabled || isProcessing}
          className={cn(
            "p-6 rounded-lg border-2",
            selectedMethod === "online"
              ? "border-foreground bg-foreground/5"
              : "border-border hover:border-foreground/30"
          )}
        >
          <CreditCard className="w-6 h-6" />
          <p>Online Payment</p>
        </button>

        <button
          type="button"
          onClick={() => handleMethodSelect("cash")}
          disabled={disabled || isProcessing}
          className={cn(
            "p-6 rounded-lg border-2",
            selectedMethod === "cash"
              ? "border-foreground bg-foreground/5"
              : "border-border hover:border-foreground/30"
          )}
        >
          <Banknote className="w-6 h-6" />
          <p>Cash on Delivery</p>
        </button>
      </div>

      {showDetails && selectedMethod && (
        <div className="p-6 border rounded-lg space-y-6">
          <p className="text-2xl font-semibold">
            ₹{amount.toLocaleString()}
          </p>

          <button
            onClick={handleProcessPayment}
            disabled={isProcessing}
            className="w-full px-6 py-4 bg-foreground text-background rounded-lg flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Confirm Order
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
