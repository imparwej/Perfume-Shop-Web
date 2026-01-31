"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { triggerCartAnimation } from "@/lib/cart-utils";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  notes?: string;
  size?: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
  index?: number;
}

export function ProductCard({ product, className, index = 0 }: ProductCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add to cart
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    // Trigger animation
    triggerCartAnimation(addButtonRef.current);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Prevent navigation if already navigating
    if (router) {
      router.push(`/products/${product.id}`);
    }
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col h-full bg-background opacity-0 animate-fade-in-up",
        className
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container - Using div instead of Link to avoid nested anchors */}
      <div
        className="relative aspect-[3/4] overflow-hidden bg-secondary/30 cursor-pointer group/image"
        onClick={() => router.push(`/products/${product.id}`)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(`/products/${product.id}`);
          }
        }}
        aria-label={`View details for ${product.name}`}
      >
        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-secondary/50 animate-pulse" />
        )}
        
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            "object-cover transition-all duration-700 ease-out",
            isHovered ? "scale-110" : "scale-100",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Gradient Overlay */}
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent transition-opacity duration-500",
            isHovered ? "opacity-100" : "opacity-0"
          )} 
        />

        {/* Quick Actions */}
        <div 
          className={cn(
            "absolute bottom-6 left-6 right-6 flex items-center gap-3 transition-all duration-500 ease-out",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          )}
        >
          <button
            ref={addButtonRef}
            type="button"
            onClick={handleAddToCart}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3",
              "bg-foreground/95 hover:bg-foreground text-background",
              "text-xs font-medium tracking-widest uppercase",
              "transition-all duration-300",
              "backdrop-blur-sm"
            )}
          >
            <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Add</span>
          </button>
          
          <button
            type="button"
            onClick={handleViewDetails}
            className={cn(
              "p-3 bg-foreground/95 hover:bg-foreground text-background",
              "transition-all duration-300",
              "backdrop-blur-sm"
            )}
            aria-label="View product details"
          >
            <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-6 lg:p-8 space-y-4">
        {/* Notes */}
        {product.notes && (
          <p className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground font-medium">
            {product.notes}
          </p>
        )}

        {/* Name */}
        <Link href={`/products/${product.id}`} className="group/link block">
          <h3 className="font-serif text-lg lg:text-xl font-medium text-foreground leading-tight">
            <span className="relative inline-block">
              {product.name}
              <span 
                className={cn(
                  "absolute -bottom-1.5 left-0 h-0.5 bg-foreground transition-all duration-500 ease-out",
                  isHovered ? "w-full" : "w-0"
                )} 
              />
            </span>
          </h3>
        </Link>

        {/* Size */}
        {product.size && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {product.size}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price Section */}
        <div className="pt-4 border-t border-border/30 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1 tracking-wide uppercase">Price</p>
            <p className="font-serif text-xl lg:text-2xl text-foreground font-light">
              ${product.price.toLocaleString()}
            </p>
          </div>
          
          <span 
            className={cn(
              "text-[11px] tracking-[0.2em] uppercase text-muted-foreground font-medium transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            View
          </span>
        </div>
      </div>
    </article>
  );
}
