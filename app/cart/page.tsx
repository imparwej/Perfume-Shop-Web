"use client";

import { Navbar } from "@/components/navbar";
import { CartPage } from "@/components/cart-page";
import { Footer } from "@/components/footer";
import { useCart } from "@/lib/cart-context";

export default function Cart() {
  const { items, updateQuantity, removeFromCart } = useCart();

  // Transform cart items to include additional display properties
  // BACKEND: This transformation would happen in the API response
  const cartItems = items.map((item) => ({
    ...item,
    size: "100ml Eau de Parfum", // Default size for display
    notes: undefined, // Notes would come from product data in backend
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartPage
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />

      <Footer />
    </div>
  );
}
