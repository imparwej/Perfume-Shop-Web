"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function PremiumBanner() {
  return (
    <div className="relative w-full py-4 px-6 lg:px-8 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border-b border-accent/20">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/customize"
          className="flex items-center justify-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
        >
          <span>Explore our Fragrance Customizer experience</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
