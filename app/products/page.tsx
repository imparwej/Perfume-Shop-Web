import { Navbar } from "@/components/navbar";
import { ProductGrid } from "@/components/product-grid";
import { Footer } from "@/components/footer";
import { getAllProducts } from "@/lib/products";

export const metadata = {
  title: "The Collection | MAISON NOIR",
  description: "Explore our signature collection of luxury fragrances crafted with rare botanicals and precious essences.",
};

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="relative">
        {/* Hero Header */}
        <section className="pt-32 pb-16 px-6 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Discover Our World
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-6 text-balance">
            The Collection
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground leading-relaxed">
            Each fragrance in our collection is a masterpiece, meticulously crafted 
            using the world&apos;s finest ingredients to evoke emotion and memory.
          </p>
        </section>

        {/* Products Grid */}
        <ProductGrid products={products} />

        {/* Bottom CTA */}
        <section className="py-16 md:py-24 px-6 bg-secondary/30">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Personalized Service
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-4">
              Need Assistance?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our fragrance consultants are available to guide you through our collection 
              and help you find your signature scent.
            </p>
            <a
              href="mailto:concierge@maisonnoir.com"
              className="inline-block px-8 py-3 text-sm font-medium tracking-widest uppercase border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300"
            >
              Contact Concierge
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
