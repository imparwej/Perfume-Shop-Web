import { Navbar } from "@/components/navbar";
import { CustomerReviews } from "@/components/customer-reviews";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Customer Reviews - Maison Noir | Premium Fragrances",
  description: "Read authentic reviews from our customers about our luxury fragrances",
};

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 px-6 border-b border-border/30">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              Testimonials
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium text-foreground mb-6 text-balance">
              Voices of Our <span className="italic">Community</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover why fragrance enthusiasts worldwide choose Maison Noir for authentic, 
              transformative scents crafted with uncompromising quality.
            </p>
          </div>
        </section>

        {/* All Reviews */}
        <CustomerReviews limit={12} />

        {/* CTA Section */}
        <section className="py-24 md:py-32 px-6 border-t border-border/30 bg-secondary/20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-6">
              Share Your Experience
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-12">
              Have you experienced Maison Noir? We'd love to hear your story. Your review helps 
              fellow fragrance enthusiasts discover their perfect scent.
            </p>
            <button
              type="button"
              className="px-8 py-4 text-sm font-medium tracking-widest uppercase bg-foreground text-background hover:shadow-lg transition-all duration-300"
            >
              Write a Review
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
