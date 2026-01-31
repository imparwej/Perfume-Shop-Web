"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Minus, Plus, Check, Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { triggerCartAnimation } from "@/lib/cart-utils";

export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  image: string;
  notes?: string;
  size?: string;
  description?: string;
  ingredients?: string[];
  story?: string;
}

interface ProductDetailsProps {
  product: ProductDetail;
  className?: string;
}

export function ProductDetails({ product, className }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = () => {
    // Add to cart state
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      quantity
    );

    // Trigger animation
    triggerCartAnimation(addButtonRef.current);

    // Show success state
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Back Navigation */}
      <div className="px-6 md:px-12 lg:px-16 pt-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group"
        >
          <span className="p-2 border border-border/50 rounded-full group-hover:border-foreground/30 group-hover:bg-secondary/50 transition-all duration-300">
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          </span>
          <span className="tracking-widest uppercase">Back to Collection</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="px-6 md:px-12 lg:px-16 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Product Image */}
            <div
              className={cn(
                "relative transition-all duration-1000",
                mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              )}
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-secondary/30 sticky top-32 group">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-secondary/50 animate-pulse" />
                )}
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={cn(
                    "object-cover transition-all duration-700",
                    imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
                    "group-hover:scale-105"
                  )}
                  onLoad={() => setImageLoaded(true)}
                  priority
                />
                
                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-6 right-6 p-3 bg-background/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    className={cn(
                      "w-5 h-5 transition-colors duration-300",
                      isWishlisted ? "fill-red-500 text-red-500" : "text-foreground"
                    )}
                    strokeWidth={1.5}
                  />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div
              className={cn(
                "flex flex-col lg:py-8 transition-all duration-1000 delay-200",
                mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              )}
            >
              {/* Category/Notes */}
              {product.notes && (
                <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4">
                  {product.notes}
                </p>
              )}

              {/* Product Name */}
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-4 tracking-tight">
                {product.name}
              </h1>

              {/* Size */}
              {product.size && (
                <p className="text-sm text-muted-foreground mb-6">
                  {product.size}
                </p>
              )}

              {/* Price */}
              <p className="font-serif text-2xl md:text-3xl text-foreground mb-8">
                ${product.price.toLocaleString()}
              </p>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-8">
                <span className="w-16 h-px bg-border" />
                <span className="w-1.5 h-1.5 bg-accent/50 rounded-full" />
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-10">
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Story Section */}
              {product.story && (
                <div className="mb-10 p-6 bg-secondary/30 border-l-2 border-accent/30">
                  <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                    The Story
                  </h3>
                  <p className="text-muted-foreground leading-relaxed italic font-serif text-lg">
                    "{product.story}"
                  </p>
                </div>
              )}

              {/* Ingredients */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                    Key Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.ingredients.map((ingredient, index) => (
                      <span
                        key={ingredient}
                        className={cn(
                          "px-4 py-2 text-sm text-foreground/80 border border-border/70 hover:border-foreground/30 hover:bg-secondary/50 transition-all duration-300 cursor-default opacity-0 animate-fade-in-up"
                        )}
                        style={{ animationDelay: `${index * 100 + 500}ms`, animationFillMode: "forwards" }}
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="mt-auto pt-8 border-t border-border/50">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-border bg-secondary/20">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-4 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-14 text-center text-foreground font-medium tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-4 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    ref={addButtonRef}
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={cn(
                      "flex-1 py-4 px-8 text-sm font-medium tracking-widest uppercase transition-all duration-500 relative overflow-hidden group",
                      isAdded
                        ? "bg-green-600 text-white"
                        : "bg-foreground text-background hover:shadow-xl hover:shadow-foreground/10"
                    )}
                  >
                    <span className={cn(
                      "flex items-center justify-center gap-2 transition-all duration-300",
                      isAdded ? "scale-100" : "group-hover:scale-105"
                    )}>
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <span>Add to Cart</span>
                      )}
                    </span>
                  </button>

                  {/* Share Button */}
                  <button
                    type="button"
                    className="p-4 border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-secondary/50 transition-all duration-300"
                    aria-label="Share product"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Subtotal */}
                <p className="mt-6 text-sm text-muted-foreground">
                  Subtotal:{" "}
                  <span className="text-foreground font-serif text-lg">
                    ${(product.price * quantity).toLocaleString()}
                  </span>
                </p>
              </div>

              {/* Additional Info */}
              <div className="mt-10 pt-8 border-t border-border/50 space-y-4">
                {[
                  "Complimentary gift wrapping available",
                  "Free shipping on orders over $150",
                  "14-day return policy for unopened items",
                ].map((info, index) => (
                  <div key={info} className="flex items-start gap-4 group">
                    <div className="w-1.5 h-1.5 mt-2 bg-accent/50 rounded-full group-hover:bg-accent transition-colors duration-300" />
                    <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                      {info}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
