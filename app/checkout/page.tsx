"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PaymentSystem } from "@/components/payment-system";
import ProtectedRoute from "@/components/protected-route";

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="max-w-4xl mx-auto px-6 py-16 space-y-10">
          <h1 className="text-4xl font-serif text-center">Checkout</h1>

          <PaymentSystem amount={100} />
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
