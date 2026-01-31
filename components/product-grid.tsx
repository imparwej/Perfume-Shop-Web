"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard, type Product } from "./product-card";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function ProductGrid({
  products,
  title,
  subtitle,
  className,
}: ProductGridProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={cn("py-32 md:py-48 px-6 lg:px-8", className)}>
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        {(title || subtitle) && (
          <div 
            className={cn(
              "text-center mb-24 transition-all duration-1000",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {subtitle && (
              <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-6">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium text-foreground text-balance leading-tight">
                {title}
              </h2>
            )}
            
            {/* Decorative Line */}
            <div className="mt-12 flex items-center justify-center gap-4">
              <span className="w-16 h-px bg-border" />
              <span className="w-2 h-2 bg-accent/60 rounded-full" />
              <span className="w-16 h-px bg-border" />
            </div>
          </div>
        )}

        {/* Product Grid - Editorial spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={isVisible ? index : -1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
