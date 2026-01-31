"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingBag, User, Menu, X, Sun, Moon, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Collection" },
  { href: "/about", label: "About" },
];

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return null;
}

function applyTheme(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const cartIconRef = useRef<HTMLAnchorElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Expose cart icon position globally for animations
  useEffect(() => {
    if (typeof window !== "undefined" && cartIconRef.current) {
      (window as any).__getCartIconPosition = () => {
        const rect = cartIconRef.current?.getBoundingClientRect();
        if (rect) {
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
        }
        return { x: window.innerWidth - 50, y: 50 };
      };
    }
  }, [cartIconRef]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <h1 className="font-serif text-xl md:text-2xl font-semibold tracking-[0.15em] text-foreground transition-all duration-300 group-hover:tracking-[0.2em]">
              MAISON NOIR
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              ref={cartIconRef}
              href="/cart"
              className="group relative p-3 text-foreground/70 hover:text-foreground transition-all duration-300 hover:bg-secondary/50 rounded-full"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background transition-transform duration-300 group-hover:scale-110">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              className="relative p-3 text-foreground/70 hover:text-foreground transition-all duration-300 hover:bg-secondary/50 rounded-full"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              <div className="relative h-5 w-5 overflow-hidden">
                <Sun
                  className={cn(
                    "absolute inset-0 h-5 w-5 transition-all duration-500",
                    mounted && theme === "dark"
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-90 scale-0 opacity-0"
                  )}
                  strokeWidth={1.5}
                />
                <Moon
                  className={cn(
                    "absolute inset-0 h-5 w-5 transition-all duration-500",
                    mounted && theme === "light"
                      ? "rotate-0 scale-100 opacity-100"
                      : "rotate-90 scale-0 opacity-0"
                  )}
                  strokeWidth={1.5}
                />
              </div>
            </button>

            {isAuthenticated && user ? (
              <div ref={userMenuRef} className="relative ml-2">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="group flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground/70 hover:text-foreground border border-transparent hover:border-border transition-all duration-300 rounded-full hover:bg-secondary/50"
                >
                  <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center">
                    <User className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                  <span className="tracking-wide max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    userMenuOpen && "rotate-180"
                  )} />
                </button>
                
                {/* User Dropdown Menu */}
                <div className={cn(
                  "absolute right-0 top-full mt-2 w-56 bg-background border border-border shadow-xl rounded-lg overflow-hidden transition-all duration-200 origin-top-right",
                  userMenuOpen 
                    ? "opacity-100 scale-100 pointer-events-auto" 
                    : "opacity-0 scale-95 pointer-events-none"
                )}>
                  <div className="p-4 border-b border-border">
                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-secondary/50 rounded-md transition-colors duration-200"
                    >
                      <User className="h-4 w-4" strokeWidth={1.5} />
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-secondary/50 rounded-md transition-colors duration-200"
                    >
                      <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                      Order History
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-secondary/50 rounded-md transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" strokeWidth={1.5} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="group flex items-center gap-2 ml-2 px-5 py-2.5 text-sm font-medium text-foreground/70 hover:text-foreground border border-transparent hover:border-border transition-all duration-300 rounded-full hover:bg-secondary/50"
              >
                <User className="h-4 w-4" strokeWidth={1.5} />
                <span className="tracking-wide">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground/80 hover:text-foreground transition-colors duration-300"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative w-6 h-6">
              <X
                className={cn(
                  "absolute inset-0 h-6 w-6 transition-all duration-300",
                  isOpen ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
                )}
                strokeWidth={1.5}
              />
              <Menu
                className={cn(
                  "absolute inset-0 h-6 w-6 transition-all duration-300",
                  !isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                )}
                strokeWidth={1.5}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-500 ease-out",
            isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-6 space-y-1 border-t border-border/50">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-4 text-2xl font-serif tracking-wide text-foreground/80 hover:text-foreground transition-all duration-300 hover:translate-x-2",
                  isOpen && "animate-slide-in-right"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Actions */}
            <div className="flex items-center gap-4 pt-6">
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="relative p-3 text-foreground/80 hover:text-foreground transition-colors duration-300 hover:bg-secondary/50 rounded-full"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={toggleTheme}
                className="relative p-3 text-foreground/80 hover:text-foreground transition-colors duration-300 hover:bg-secondary/50 rounded-full"
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                <div className="relative h-5 w-5 overflow-hidden">
                  <Sun
                    className={cn(
                      "absolute inset-0 h-5 w-5 transition-all duration-500",
                      mounted && theme === "dark"
                        ? "rotate-0 scale-100 opacity-100"
                        : "-rotate-90 scale-0 opacity-0"
                    )}
                    strokeWidth={1.5}
                  />
                  <Moon
                    className={cn(
                      "absolute inset-0 h-5 w-5 transition-all duration-500",
                      mounted && theme === "light"
                        ? "rotate-0 scale-100 opacity-100"
                        : "rotate-90 scale-0 opacity-0"
                    )}
                    strokeWidth={1.5}
                  />
                </div>
              </button>

              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/50 rounded-full">
                    <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center">
                      <User className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium text-foreground truncate max-w-[100px]">{user.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="p-2.5 text-foreground/80 hover:text-foreground border border-border/50 rounded-full hover:bg-secondary/50 transition-colors duration-200"
                    aria-label="Sign out"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground border border-border/50 transition-colors duration-300 rounded-full hover:bg-secondary/50"
                >
                  <User className="h-4 w-4" strokeWidth={1.5} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative text-sm font-medium tracking-[0.15em] uppercase text-foreground/70 hover:text-foreground transition-colors duration-300"
    >
      {children}
      <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-foreground transition-all duration-500 ease-out group-hover:w-full" />
    </Link>
  );
}
