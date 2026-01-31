"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  name: string;
  location: string;
  avatar?: string;
  rating: number;
  text: string;
  product: string;
  date: string;
  verified: boolean;
}

// Mock reviews data - BACKEND: Replace with API call
const reviews: Review[] = [
  {
    id: "1",
    name: "Isabella Moreau",
    location: "Paris, France",
    rating: 5,
    text: "Noir Absolu is absolutely divine. The oud and amber create a captivating warmth that lasts all day. I receive compliments every time I wear it. This is true luxury in a bottle.",
    product: "Noir Absolu",
    date: "December 2025",
    verified: true,
  },
  {
    id: "2",
    name: "Alexander Chen",
    location: "New York, USA",
    rating: 5,
    text: "I've tried countless fragrances, but Lumiere d'Or is something special. The saffron and honey notes create an unforgettable scent that feels both opulent and natural.",
    product: "Lumiere d'Or",
    date: "January 2026",
    verified: true,
  },
  {
    id: "3",
    name: "Sophia Andersson",
    location: "Stockholm, Sweden",
    rating: 5,
    text: "Rose Eternelle captures the essence of timeless elegance. It's become my signature scent. The quality is unmistakable - this is what true perfumery should be.",
    product: "Rose Eternelle",
    date: "November 2025",
    verified: true,
  },
  {
    id: "4",
    name: "Marcus Williams",
    location: "London, UK",
    rating: 5,
    text: "Velvet Soir is the perfect evening fragrance. Sophisticated, mysterious, and incredibly long-lasting. Worth every penny for such exquisite craftsmanship.",
    product: "Velvet Soir",
    date: "January 2026",
    verified: true,
  },
  {
    id: "5",
    name: "Elena Rossi",
    location: "Milan, Italy",
    rating: 5,
    text: "Ombre Mystique is unlike anything I've experienced. The incense and leather blend creates an aura of sophistication that's impossible to ignore. Absolutely stunning.",
    product: "Ombre Mystique",
    date: "December 2025",
    verified: true,
  },
];

interface CustomerReviewsProps {
  className?: string;
  limit?: number;
}

export function CustomerReviews({ className, limit = 6 }: CustomerReviewsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use only the limited reviews for display
  const displayedReviews = reviews.slice(0, Math.min(limit, reviews.length));

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? displayedReviews.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === displayedReviews.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(handleNext, 6000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const activeReview = displayedReviews[activeIndex];

  return (
    <section className={cn("py-24 md:py-32 px-6 bg-secondary/20", className)}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Testimonials
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground">
            What Our Clients Say
          </h2>
        </div>

        {/* Reviews Carousel */}
        <div ref={containerRef} className="relative">
          {/* Main Review Card */}
          <div className="relative bg-background border border-border/50 p-8 md:p-12 lg:p-16">
            {/* Quote Icon */}
            <div className="absolute top-8 right-8 md:top-12 md:right-12">
              <Quote className="w-12 h-12 md:w-16 md:h-16 text-accent/20" />
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-5 h-5 transition-colors duration-300",
                    i < activeReview.rating
                      ? "text-accent fill-accent"
                      : "text-border"
                  )}
                />
              ))}
            </div>

            {/* Review Text */}
            <blockquote
              className={cn(
                "font-serif text-xl md:text-2xl lg:text-3xl text-foreground leading-relaxed mb-10 transition-opacity duration-500",
                isAnimating ? "opacity-0" : "opacity-100"
              )}
            >
              "{activeReview.text}"
            </blockquote>

            {/* Author Info */}
            <div
              className={cn(
                "flex items-center gap-6 transition-opacity duration-500",
                isAnimating ? "opacity-0" : "opacity-100"
              )}
            >
              {/* Avatar */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-secondary">
                {activeReview.avatar ? (
                  <Image
                    src={activeReview.avatar}
                    alt={activeReview.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-foreground/10 text-foreground font-serif text-xl">
                    {activeReview.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-medium text-foreground">
                    {activeReview.name}
                  </p>
                  {activeReview.verified && (
                    <span className="text-[10px] tracking-wider uppercase text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {activeReview.location} · Purchased {activeReview.product}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {displayedReviews.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setIsAnimating(true);
                    setActiveIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === activeIndex
                      ? "w-8 bg-foreground"
                      : "bg-foreground/20 hover:bg-foreground/40"
                  )}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="w-12 h-12 flex items-center justify-center border border-border hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-12 h-12 flex items-center justify-center border border-border hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-16 border-t border-border/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "4.9", label: "Average Rating" },
              { value: "15K+", label: "Happy Customers" },
              { value: "98%", label: "Would Recommend" },
              { value: "50+", label: "Countries" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-3xl md:text-4xl text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
