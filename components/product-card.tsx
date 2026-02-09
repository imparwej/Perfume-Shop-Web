"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { triggerCartAnimation } from "@/lib/cart-utils";

/*  BACKEND-ALIGNED PRODUCT TYPE */
export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  notes?: string;
  size?: string;
  categoryName?: string | null;
}

interface ProductCardProps {
  product: Product;
  className?: string;
  index?: number;
}

export function ProductCard({
  product,
  className,
  index = 0,
}: ProductCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const { addToCart } = useCart();

  const imageSrc =
    product.imageUrl && product.imageUrl.trim() !== ""
      ? product.imageUrl
      : "/placeholder.svg";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // ✅ REAL cart item with backend perfumeId
    addToCart({
      id: product.id.toString(),  // frontend string id
      perfumeId: product.id,      // 🔥 backend numeric id
      name: product.name,
      price: product.price,
      image: imageSrc,
    });

    triggerCartAnimation(addButtonRef.current);
  };

  const handleViewDetails = () => {
    router.push(`/products/${product.id}`);
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
      <div
        className="relative aspect-[3/4] overflow-hidden bg-secondary/30 cursor-pointer"
        onClick={handleViewDetails}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-secondary/50 animate-pulse" />
        )}

        <Image
          src={imageSrc}
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

        <div
          className={cn(
            "absolute bottom-6 left-6 right-6 flex items-center gap-3 transition-all duration-500",
            isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          )}
        >
          <button
            ref={addButtonRef}
            type="button"
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-foreground text-background text-xs font-medium tracking-widest uppercase"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add
          </button>

          <button
            type="button"
            onClick={handleViewDetails}
            className="p-3 bg-foreground text-background"
            aria-label="View product details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6 space-y-4">
        {product.notes && (
          <p className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
            {product.notes}
          </p>
        )}

        <Link href={`/products/${product.id}`}>
          <h3 className="font-serif text-lg font-medium">{product.name}</h3>
        </Link>

        {product.size && (
          <p className="text-xs text-muted-foreground">{product.size}</p>
        )}

        <div className="flex-1" />

        <div className="pt-4 border-t border-border/30 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Price</p>
            <p className="font-serif text-xl">₹ {product.price}</p>
          </div>

          <span
            className={cn(
              "text-[11px] tracking-[0.2em] uppercase text-muted-foreground transition-all",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            View
          </span>
        </div>
      </div>
    </article>
  );
}
