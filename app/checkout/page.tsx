"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CheckoutCTA } from "@/components/checkout-cta";
import { OrderConfirmation } from "@/components/order-confirmation";
import { useAuth, setRedirectUrl } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

const sampleCartItems = [
  {
    id: "noir-absolu",
    name: "Noir Absolu",
    price: 295,
    quantity: 1,
    image: "/images/perfume-noir-absolu.jpg",
    size: "100ml Eau de Parfum",
  },
  {
    id: "rose-eternelle",
    name: "Rose Éternelle",
    price: 245,
    quantity: 2,
    image: "/images/perfume-rose-eternelle.jpg",
    size: "75ml Eau de Parfum",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { items: cartItems, totalPrice, totalItems, clearCart } = useCart();
  const [isComplete, setIsComplete] = useState(false);

  // Use cart items if available, otherwise fall back to sample items for demo
  const displayItems = cartItems.length > 0 ? cartItems.map(item => ({
    ...item,
    size: "100ml Eau de Parfum", // Default size for display
  })) : sampleCartItems;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setRedirectUrl("/checkout");
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const subtotal = cartItems.length > 0 ? totalPrice : sampleCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 150 ? 0 : 15;
  const total = subtotal + shipping;
  const itemCount = cartItems.length > 0 ? totalItems : sampleCartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    // Simulate checkout process
    // BACKEND: Replace with actual order creation API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearCart();
    setIsComplete(true);
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  // Don't render checkout if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <OrderConfirmation
          orderNumber={`MN-2026-${Math.floor(100000 + Math.random() * 900000)}`}
          email={user?.email || "customer@example.com"}
          items={displayItems}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          estimatedDelivery="February 2-5, 2026"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-lg mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Final Step
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4">
            Checkout
          </h1>
          <p className="text-muted-foreground">
            Review your order and complete your purchase
          </p>
        </div>

        {/* Order Preview */}
        <div className="bg-secondary/30 p-6 mb-8">
          <h2 className="font-serif text-lg text-foreground mb-4">
            Order Summary
          </h2>
          <div className="space-y-4">
            {displayItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-foreground">
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout CTA */}
        <CheckoutCTA
          total={total}
          itemCount={itemCount}
          onCheckout={handleCheckout}
        />
      </main>
      
      <Footer />
    </div>
  );
}
