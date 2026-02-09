"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowDown, Award, Leaf, Shield, Clock } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { PremiumBanner } from "@/components/premium-banner";
import { ProductGrid } from "@/components/product-grid";
import { CustomerReviews } from "@/components/customer-reviews";
import { FragranceCustomizer } from "@/components/fragrance-customizer";
import { Footer } from "@/components/footer";
import { NewsletterForm } from "@/components/newsletter-form";


export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

useEffect(() => {
  fetch("http://localhost:8080/api/perfumes/featured")
    .then(res => res.json())
    .then(data => setFeaturedProducts(data));
}, []);

  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <PremiumBanner />

      <main className="relative">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center px-6 lg:px-8 text-center overflow-hidden"
        >
          {/* Parallax Background Elements */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          >
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary rounded-full blur-3xl" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto">
            <p
              className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-8 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
            >
              Discover the Art of Fragrance
            </p>

            <h1
              className="font-serif text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tighter text-foreground mb-8 text-balance opacity-0 animate-fade-in-up"
              style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
            >
              Timeless
              <br />
              <span className="italic font-normal">Elegance</span>
            </h1>

            <p
              className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed mb-16 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
            >
              Each fragrance is a journey through rare botanicals and precious
              essences, crafted by master perfumers with generations of
              expertise and uncompromising dedication to excellence.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "800ms", animationFillMode: "forwards" }}
            >
              <Link
                href="/products"
                className="group relative px-10 py-4 text-sm font-medium tracking-widest uppercase bg-foreground text-background overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-foreground/15"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Explore Collection
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/95 to-foreground translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out" />
              </Link>

              <Link
                href="#collection"
                className="group flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <span>View Signature</span>
                <ArrowDown className="w-4 h-4 animate-float" />
              </Link>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in"
            style={{ animationDelay: "1200ms", animationFillMode: "forwards" }}
          >
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent" />
          </div>
        </section>

        {/* Marquee Section */}
        <section className="py-6 border-y border-border/30 overflow-hidden bg-secondary/20">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 mx-4">
                {[
                  "Artisanal Craftsmanship",
                  "Rare Ingredients",
                  "Timeless Scents",
                  "Sustainable Luxury",
                  "Master Perfumers",
                  "Heritage Since 1892",
                ].map((text) => (
                  <span
                    key={text}
                    className="text-xs tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-8"
                  >
                    {text}
                    <span className="w-1.5 h-1.5 bg-accent/50 rounded-full" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Premium Features Bar */}
        <section className="py-20 md:py-28 px-6 lg:px-8 border-b border-border/30">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
              {[
                { icon: Award, title: "Award Winning", desc: "International recognition" },
                { icon: Leaf, title: "Sustainable", desc: "Eco-conscious luxury" },
                { icon: Shield, title: "Authentic", desc: "100% genuine products" },
                { icon: Clock, title: "Free Shipping", desc: "On orders over $150" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section id="collection">
          <ProductGrid
            products={featuredProducts}
            title="The Collection"
            subtitle="Signature Fragrances"
            className="bg-background"
          />
        </section>

        {/* Feature Section */}
        <section className="py-32 md:py-48 px-6 lg:px-8 bg-secondary/30 border-b border-border/30">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden group">
                <Image
                  src="/images/perfume-noir-absolu.jpg"
                  alt="Maison Noir craftsmanship"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
              </div>

              {/* Content */}
              <div className="lg:pl-8">
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                  Our Heritage
                </p>
                <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-foreground mb-10 tracking-tight">
                  The House of
                  <br />
                  <span className="font-normal italic">Maison Noir</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                  Founded in the heart of Paris, Maison Noir represents the
                  pinnacle of olfactory artistry. Our fragrances are composed
                  using the finest ingredients sourced from around the world,
                  each bottle telling a story of passion, precision, and
                  timeless beauty.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-12 text-lg">
                  Every creation begins with a vision—a moment, an emotion, a
                  memory transformed into an aromatic masterpiece that lingers
                  in the consciousness long after the final note fades.
                </p>

                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 text-sm font-medium tracking-widest uppercase text-foreground"
                >
                  <span className="relative">
                    Discover Our Story
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-500 group-hover:w-full" />
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-28 md:py-40 px-6 lg:px-8 border-y border-border/30">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
              {[
                { value: "130+", label: "Years of Heritage" },
                { value: "47", label: "Master Perfumers" },
                { value: "200+", label: "Rare Ingredients" },
                { value: "1M+", label: "Happy Customers" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="font-serif text-4xl md:text-5xl text-foreground mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fragrance Customizer Section */}
        <section className="py-24 md:py-32 px-6 bg-gradient-to-b from-secondary/20 to-background border-t border-border/30">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                  Personalization
                </p>
                <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-foreground mb-10 tracking-tight">
                  Create Your
                  <br />
                  <span className="font-normal italic">Perfect Scent</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Use our interactive fragrance customizer to design your own unique scent. Select from our curated palette of base notes, heart notes, and top notes to create a fragrance as individual as you are.
                </p>
                <Link
                  href="/customize"
                  className="group inline-flex items-center gap-3 text-sm font-medium tracking-widest uppercase text-foreground"
                >
                  <span className="relative">
                    Start Customizing
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-500 group-hover:w-full" />
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
              </div>
              <div className="rounded-lg overflow-hidden border border-border/50 bg-secondary/30">
                <FragranceCustomizer preview={true} />
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="py-32 md:py-48 px-6 lg:px-8 border-t border-border/30">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Trusted By Fragrance Connoisseurs
              </p>
              <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-foreground mb-6 tracking-tight">
                Voices of <span className="font-normal italic">Our Community</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Discover why fragrance enthusiasts worldwide choose Maison Noir
              </p>
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Read All Reviews <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <CustomerReviews limit={3} />
          </div>
        </section>
        <section className="py-28 md:py-40 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Stay Connected
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-6">
              Join Our World
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10">
              Be the first to discover new fragrances, exclusive collections,
              and the stories behind our creations.
            </p>

            <NewsletterForm />
          </div>
        </section>
      </main>

      <Footer variant="full" />
    </div>
  );
}
