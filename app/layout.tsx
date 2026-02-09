import React from "react";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { ThemeProvider } from "@/lib/theme-context";
import { AuthProvider } from "@/lib/auth-context";
import { AdminProvider } from "@/lib/admin-context";
import { CartProvider } from "@/lib/cart-context";

import { CartAnimationContainer } from "@/components/cart-animation-container";

import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MAISON NOIR | Luxury Perfumes",
  description: "Discover exquisite fragrances crafted with rare ingredients",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${serif.variable} ${sans.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <AdminProvider>
              <CartProvider>
                {children}
                <CartAnimationContainer />
              </CartProvider>
            </AdminProvider>
          </AuthProvider>
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  );
}
