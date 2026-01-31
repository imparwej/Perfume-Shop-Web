import Link from "next/link";

interface FooterProps {
  variant?: "full" | "minimal";
  className?: string;
}

export function Footer({ variant = "minimal", className }: FooterProps) {
  if (variant === "full") {
    return (
      <footer className={`py-16 px-6 border-t border-border/50 bg-secondary/20 ${className || ""}`}>
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-1">
              <p className="font-serif text-2xl text-foreground mb-4">
                MAISON NOIR
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Crafting timeless fragrances since 1892. Each scent tells a
                story of passion and artistry.
              </p>
            </div>

            {/* Links */}
            {[
              {
                title: "Explore",
                links: [
                  { label: "All Fragrances", href: "/products" },
                  { label: "New Arrivals", href: "/products" },
                  { label: "Bestsellers", href: "/products" },
                  { label: "Gift Sets", href: "/products" },
                ],
              },
              {
                title: "Discover",
                links: [
                  { label: "Our Story", href: "/about" },
                  { label: "Master Perfumers", href: "/about" },
                  { label: "Customer Reviews", href: "/reviews" },
                  { label: "Sustainability", href: "/about" },
                ],
              },
              {
                title: "Create",
                links: [
                  { label: "Custom Fragrances", href: "/customize" },
                  { label: "Fragrance Quiz", href: "/customize" },
                  { label: "Consultation", href: "/customize" },
                  { label: "Gift Registry", href: "/products" },
                ],
              },
              {
                title: "Support",
                links: [
                  { label: "Contact", href: "#" },
                  { label: "Shipping & Returns", href: "#" },
                  { label: "Care Guide", href: "#" },
                  { label: "FAQ", href: "#" },
                ],
              },
            ].map((section) => (
              <div key={section.title}>
                <p className="text-xs tracking-[0.2em] uppercase text-foreground mb-6">
                  {section.title}
                </p>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {new Date().getFullYear()} Maison Noir. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {[
                { label: "Instagram", href: "https://instagram.com" },
                { label: "Pinterest", href: "https://pinterest.com" },
                { label: "Twitter", href: "https://twitter.com" },
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {social.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Minimal variant
  return (
    <footer className={`py-12 px-6 border-t border-border/50 ${className || ""}`}>
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="font-serif text-lg text-foreground hover:opacity-80 transition-opacity">
          MAISON NOIR
        </Link>
        <p className="text-sm text-muted-foreground">
          {new Date().getFullYear()} Maison Noir. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
