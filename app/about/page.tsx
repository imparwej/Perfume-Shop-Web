import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { Award, Leaf, Users, Globe } from "lucide-react";

export const metadata = {
  title: "About Maison Noir - Premium Luxury Fragrances",
  description: "Discover the heritage, craftsmanship, and philosophy behind Maison Noir's luxury fragrances",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 px-6 border-b border-border/30">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              Our Story
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium text-foreground mb-6 text-balance">
              The House of <span className="italic">Maison Noir</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Founded in 1892 in the heart of Paris, Maison Noir represents the pinnacle 
              of olfactory artistry and uncompromising commitment to luxury.
            </p>
          </div>
        </section>

        {/* Heritage Section */}
        <section className="py-24 md:py-32 px-6 border-b border-border/30">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/perfume-noir-absolu.jpg"
                  alt="Maison Noir heritage"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                  Heritage
                </p>
                <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-8 leading-tight">
                  130 Years of <span className="italic">Olfactory Excellence</span>
                </h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    Since our founding in 1892, Maison Noir has been dedicated to the art and science of 
                    perfumery. What began as a modest atelier in Paris has evolved into a globally 
                    recognized luxury brand, renowned for its uncompromising standards and innovative spirit.
                  </p>
                  <p>
                    Each fragrance we create represents years of research, experimentation, and refinement. 
                    Our master perfumers, some with generations of expertise, work tirelessly to source 
                    the finest raw materials and craft scents that transcend time and trend.
                  </p>
                  <p>
                    We believe that true luxury is not merely about product—it's about the experience, 
                    the artistry, and the connection between fragrance and emotion. This philosophy guides 
                    every decision we make, from our sourcing practices to our commitment to sustainability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 md:py-32 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Our Values
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground">
                Principles That <span className="italic">Guide Us</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Award,
                  title: "Excellence",
                  description: "We pursue perfection in every aspect of our craft, from raw material selection to final packaging.",
                },
                {
                  icon: Leaf,
                  title: "Sustainability",
                  description: "Protecting our planet is paramount. We source responsibly and minimize our environmental impact.",
                },
                {
                  icon: Users,
                  title: "Artistry",
                  description: "Our master perfumers are artists who view fragrance as a form of expression and emotion.",
                },
                {
                  icon: Globe,
                  title: "Authenticity",
                  description: "We remain true to our heritage while embracing innovation and contemporary sensibilities.",
                },
              ].map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="p-8 bg-secondary/20 border border-border/30 hover:border-foreground/20 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Icon className="w-8 h-8 text-accent mb-4" strokeWidth={1.5} />
                    <h3 className="font-serif text-2xl text-foreground mb-4">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Master Perfumers Section */}
        <section className="py-24 md:py-32 px-6 border-t border-border/30 bg-secondary/20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Our Team
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-6">
                Master <span className="italic">Perfumers</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our collective of world-class perfumers brings together decades of expertise, 
                creativity, and an unwavering commitment to the craft.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Éric Beaumont",
                  title: "Chief Perfumer",
                  expertise: "45 years in the industry",
                  bio: "Legendary perfumer known for bold, transformative fragrances.",
                },
                {
                  name: "Isabella Rossi",
                  title: "Nose & Director",
                  expertise: "Floral & aldehyde specialist",
                  bio: "Master of timeless elegance and classic beauty.",
                },
                {
                  name: "Marcus Chen",
                  title: "Innovation Lead",
                  expertise: "Contemporary & experimental",
                  bio: "Pioneer of modern fragrance architecture and unexpected combinations.",
                },
              ].map((perfumer) => (
                <div key={perfumer.name} className="p-8 bg-background border border-border/50 hover:border-foreground/30 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-accent/10 mb-6 flex items-center justify-center">
                    <span className="text-2xl font-serif text-accent">{perfumer.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-serif text-2xl text-foreground mb-1">{perfumer.name}</h3>
                  <p className="text-sm text-accent mb-4">{perfumer.title}</p>
                  <p className="text-xs text-muted-foreground mb-4">{perfumer.expertise}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{perfumer.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32 px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-6">
              Experience <span className="italic">Maison Noir</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-12">
              Discover our complete collection and find your signature fragrance. 
              Whether you're seeking a timeless classic or a bold contemporary creation, 
              Maison Noir has a fragrance that speaks to your unique spirit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="px-8 py-4 text-sm font-medium tracking-widest uppercase bg-foreground text-background hover:shadow-lg transition-all duration-300"
              >
                Explore Collection
              </a>
              <a
                href="/customize"
                className="px-8 py-4 text-sm font-medium tracking-widest uppercase border border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              >
                Create Custom Scent
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
