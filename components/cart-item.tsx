"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CartItemData {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  notes?: string;
}

interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  className?: string;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  className,
}: CartItemProps) {
  return (
    <div
      className={cn(
        "group flex gap-6 py-8 border-b border-border/50 last:border-b-0",
        className
      )}
    >
      {/* Product Image */}
      <Link
        href={`/products/${item.id}`}
        className="relative flex-shrink-0 w-24 h-32 sm:w-32 sm:h-40 overflow-hidden bg-secondary/30"
      >
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 96px, 128px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Row: Name and Remove */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="min-w-0">
            <Link
              href={`/products/${item.id}`}
              className="block font-serif text-lg sm:text-xl text-foreground hover:text-foreground/70 transition-colors duration-300 truncate"
            >
              {item.name}
            </Link>
            {item.size && (
              <p className="text-xs text-muted-foreground mt-1">{item.size}</p>
            )}
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="flex-shrink-0 p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
            aria-label={`Remove ${item.name} from cart`}
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Notes */}
        {item.notes && (
          <p className="text-xs tracking-wide text-muted-foreground mb-4 hidden sm:block">
            {item.notes}
          </p>
        )}

        {/* Bottom Row: Quantity and Price */}
        <div className="mt-auto flex items-end justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center border border-border">
            <button
              type="button"
              onClick={() =>
                onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
              }
              className="p-2 sm:p-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={1.5} />
            </button>
            <span className="w-8 sm:w-10 text-center text-sm text-foreground">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="p-2 sm:p-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Price */}
          <p className="font-serif text-lg sm:text-xl text-foreground">
            ${(item.price * item.quantity).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
