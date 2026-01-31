import { Navbar } from "@/components/navbar";
import { FragranceCustomizer } from "@/components/fragrance-customizer";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Fragrance Customizer - Maison Noir | Create Your Scent",
  description: "Create your perfect signature fragrance with our bespoke customizer",
};

export default function CustomizePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 px-6 border-b border-border/30">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              Bespoke Creation
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium text-foreground mb-6 text-balance">
              Design Your <span className="italic">Perfect Fragrance</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Collaborate with our master perfumers to create a custom fragrance that 
              reflects your unique personality and style.
            </p>
          </div>
        </section>

        {/* Customizer */}
        <FragranceCustomizer />

        {/* Process Section */}
        <section className="py-24 md:py-32 px-6 border-t border-border/30 bg-secondary/20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Our Process
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground">
                From Vision to <span className="italic">Creation</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Profile",
                  description: "Tell us about your preferences, style, and the occasions you'll wear your fragrance.",
                },
                {
                  step: "02",
                  title: "Consultation",
                  description: "Our master perfumer reviews your profile and begins crafting your custom blend.",
                },
                {
                  step: "03",
                  title: "Creation",
                  description: "We carefully combine rare ingredients to create your signature scent.",
                },
                {
                  step: "04",
                  title: "Delivery",
                  description: "Your bespoke fragrance arrives in premium packaging ready to wear.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative p-8 bg-background border border-border/50 group hover:border-foreground/30 transition-colors duration-300"
                >
                  <p className="text-4xl font-serif text-accent/30 mb-4">{item.step}</p>
                  <h3 className="text-lg font-medium text-foreground mb-4">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  
                  {/* Connecting line (hidden on last item) */}
                  {item.step !== "04" && (
                    <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-px bg-border group-hover:bg-foreground/30 transition-colors duration-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 md:py-32 px-6">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Frequently Asked Questions
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground">
                Custom Fragrances <span className="italic">Explained</span>
              </h2>
            </div>

            <div className="space-y-8">
              {[
                {
                  q: "How long does it take to create my custom fragrance?",
                  a: "Our master perfumers typically craft your bespoke fragrance within 7-10 business days from consultation. Rush orders may be available upon request.",
                },
                {
                  q: "Can I adjust my fragrance after it's created?",
                  a: "Absolutely. We offer one complimentary adjustment within 30 days of purchase if you'd like to refine your scent profile.",
                },
                {
                  q: "What happens to my fragrance profile?",
                  a: "We securely store your fragrance profile in our system, allowing you to reorder identical or slightly modified versions anytime.",
                },
                {
                  q: "How much does a custom fragrance cost?",
                  a: "Custom fragrances start at $350 for a 100ml bottle. Final pricing may vary based on the complexity of your desired scent profile.",
                },
              ].map((item, index) => (
                <div key={index} className="border-b border-border/50 pb-8 last:border-b-0">
                  <details className="group cursor-pointer">
                    <summary className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground group-open:text-accent transition-colors duration-300">
                        {item.q}
                      </h3>
                      <span className="text-accent/50 group-open:text-accent transition-transform duration-300 group-open:rotate-180">
                        ▼
                      </span>
                    </summary>
                    <p className="mt-4 text-muted-foreground leading-relaxed">{item.a}</p>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
