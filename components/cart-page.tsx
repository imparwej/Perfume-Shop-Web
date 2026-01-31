"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { CartItem, type CartItemData } from "./cart-item";
import { cn } from "@/lib/utils";

interface CartPageProps {
  items: CartItemData[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  className?: string;
}

export function CartPage({
  items,
  onUpdateQuantity,
  onRemove,
  className,
}: CartPageProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 150 ? 0 : 15;
  const total = subtotal + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header */}
      <div className="px-6 md:px-12 lg:px-16 pt-8 pb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="tracking-widest uppercase">Continue Shopping</span>
        </Link>

        <div className="mt-8">
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground tracking-tight">
            Your Cart
          </h1>
          <p className="mt-2 text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 md:px-12 lg:px-16 pb-24">
        <div className="max-w-7xl mx-auto">
          {items.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ShoppingBag
                className="w-16 h-16 text-muted-foreground/50 mb-6"
                strokeWidth={1}
              />
              <h2 className="font-serif text-2xl text-foreground mb-2">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Discover our exquisite collection of fragrances crafted with the
                finest ingredients.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-medium tracking-widest uppercase bg-foreground text-background hover:bg-foreground/90 transition-colors duration-300"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="border-t border-border/50">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={onUpdateQuantity}
                      onRemove={onRemove}
                    />
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-32 bg-secondary/30 p-8">
                  <h2 className="font-serif text-xl text-foreground mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 pb-6 border-b border-border/50">
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
                    {shipping > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Free shipping on orders over $150
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between py-6 border-b border-border/50">
                    <span className="font-serif text-lg text-foreground">
                      Total
                    </span>
                    <span className="font-serif text-xl text-foreground">
                      ${total.toLocaleString()}
                    </span>
                  </div>

                  {/* Checkout Button - Links to checkout where auth is enforced */}
                  <Link
                    href="/checkout"
                    className="block w-full mt-8 py-4 px-8 text-sm font-medium tracking-widest uppercase bg-foreground text-background hover:bg-foreground/90 transition-colors duration-300 text-center"
                  >
                    Proceed to Checkout
                  </Link>

                  {/* Additional Info */}
                  <div className="mt-8 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-1 mt-2 bg-muted-foreground rounded-full flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        Complimentary gift wrapping available at checkout
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-1 mt-2 bg-muted-foreground rounded-full flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        Secure payment with 256-bit encryption
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-1 mt-2 bg-muted-foreground rounded-full flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        14-day return policy for unopened items
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
