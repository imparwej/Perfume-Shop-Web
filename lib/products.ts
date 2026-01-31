import type { Product } from "@/components/product-card";
import type { ProductDetail } from "@/components/product-details";

// ============================================================================
// PRODUCT DATA LAYER
// ============================================================================
// This file serves as the data abstraction layer for products.
// BACKEND: Replace all functions with API calls when backend is ready.
// Example: export async function getAllProducts() { return fetch('/api/products').then(r => r.json()) }
// ============================================================================

// Basic product list for grid views
export const products: Product[] = [
  {
    id: "noir-absolu",
    name: "Noir Absolu",
    price: 295,
    image: "/images/perfume-noir-absolu.jpg",
    notes: "Oud · Amber · Musk",
    size: "100ml Eau de Parfum",
  },
  {
    id: "rose-eternelle",
    name: "Rose Éternelle",
    price: 245,
    image: "/images/perfume-rose-eternelle.jpg",
    notes: "Rose · Bergamot · Sandalwood",
    size: "75ml Eau de Parfum",
  },
  {
    id: "velvet-soir",
    name: "Velvet Soir",
    price: 275,
    image: "/images/perfume-velvet-soir.jpg",
    notes: "Vanilla · Jasmine · Cedar",
    size: "100ml Eau de Parfum",
  },
  {
    id: "lumiere-dor",
    name: "Lumière d'Or",
    price: 325,
    image: "/images/perfume-lumiere-dor.jpg",
    notes: "Saffron · Orange Blossom · Honey",
    size: "100ml Eau de Parfum",
  },
  {
    id: "ombre-mystique",
    name: "Ombre Mystique",
    price: 285,
    image: "/images/perfume-ombre-mystique.jpg",
    notes: "Incense · Leather · Vetiver",
    size: "75ml Eau de Parfum",
  },
  {
    id: "blanc-celeste",
    name: "Blanc Céleste",
    price: 255,
    image: "/images/perfume-blanc-celeste.jpg",
    notes: "White Tea · Iris · Musk",
    size: "100ml Eau de Parfum",
  },
];

// Detailed product information for product detail pages
export const productDetails: Record<string, ProductDetail> = {
  "noir-absolu": {
    id: "noir-absolu",
    name: "Noir Absolu",
    price: 295,
    image: "/images/perfume-noir-absolu.jpg",
    notes: "Oud · Amber · Musk",
    size: "100ml Eau de Parfum",
    description:
      "A bold and captivating fragrance that opens with the rich, smoky warmth of oud, mellowed by golden amber. Deep base notes of white musk create an unforgettable trail that lingers elegantly on the skin.",
    story:
      "Inspired by the mystique of Arabian nights, Noir Absolu captures the essence of luxury and mystery. Each note tells a story of distant lands and precious treasures.",
    ingredients: ["Oud Wood", "Amber", "White Musk", "Bergamot", "Saffron"],
  },
  "rose-eternelle": {
    id: "rose-eternelle",
    name: "Rose Éternelle",
    price: 245,
    image: "/images/perfume-rose-eternelle.jpg",
    notes: "Rose · Bergamot · Sandalwood",
    size: "75ml Eau de Parfum",
    description:
      "A timeless floral composition centered on the queen of flowers. Fresh bergamot opens to reveal a heart of Bulgarian rose, grounded by creamy sandalwood and delicate musk.",
    story:
      "Named for the eternal rose gardens of Grasse, this fragrance embodies the romance and elegance of the French Riviera at golden hour.",
    ingredients: ["Bulgarian Rose", "Bergamot", "Sandalwood", "Musk", "Peony"],
  },
  "velvet-soir": {
    id: "velvet-soir",
    name: "Velvet Soir",
    price: 275,
    image: "/images/perfume-velvet-soir.jpg",
    notes: "Vanilla · Jasmine · Cedar",
    size: "100ml Eau de Parfum",
    description:
      "An intoxicating evening fragrance that wraps you in warmth. Sensual jasmine dances with rich vanilla, while cedar wood provides a sophisticated backbone.",
    story:
      "Crafted for those magical evenings when time seems to stand still. Velvet Soir is the olfactory equivalent of a candlelit room.",
    ingredients: ["Madagascar Vanilla", "Jasmine Sambac", "Cedar Wood", "Tonka Bean", "Benzoin"],
  },
  "lumiere-dor": {
    id: "lumiere-dor",
    name: "Lumière d'Or",
    price: 325,
    image: "/images/perfume-lumiere-dor.jpg",
    notes: "Saffron · Orange Blossom · Honey",
    size: "100ml Eau de Parfum",
    description:
      "A radiant and opulent fragrance that captures pure sunlight in a bottle. Precious saffron threads intertwine with delicate orange blossom, sweetened by wild honey.",
    story:
      "Inspired by the golden light of Mediterranean mornings, Lumière d'Or celebrates the warmth and richness of life's most precious moments.",
    ingredients: ["Persian Saffron", "Orange Blossom", "Acacia Honey", "Amber", "Iris"],
  },
  "ombre-mystique": {
    id: "ombre-mystique",
    name: "Ombre Mystique",
    price: 285,
    image: "/images/perfume-ombre-mystique.jpg",
    notes: "Incense · Leather · Vetiver",
    size: "75ml Eau de Parfum",
    description:
      "A mysterious and sophisticated fragrance with an enigmatic character. Sacred incense meets supple leather, anchored by earthy vetiver for depth and intrigue.",
    story:
      "Born from the shadows between day and night, Ombre Mystique speaks to those who embrace their complexity and depth.",
    ingredients: ["Olibanum Incense", "Italian Leather", "Haitian Vetiver", "Black Pepper", "Labdanum"],
  },
  "blanc-celeste": {
    id: "blanc-celeste",
    name: "Blanc Céleste",
    price: 255,
    image: "/images/perfume-blanc-celeste.jpg",
    notes: "White Tea · Iris · Musk",
    size: "100ml Eau de Parfum",
    description:
      "A pure and ethereal fragrance that evokes celestial serenity. Delicate white tea mingles with powdery iris and soft musk for an aura of effortless elegance.",
    story:
      "Like clouds parting to reveal a perfect sky, Blanc Céleste captures moments of clarity and peace in their purest form.",
    ingredients: ["White Tea", "Florentine Iris", "Cotton Musk", "Lily of the Valley", "Ambrette"],
  },
};

// ============================================================================
// API-READY FUNCTIONS
// ============================================================================
// These functions are structured to be easily converted to async API calls.
// Simply change the function signature to async and replace the body with fetch calls.

/**
 * Get all products for listing pages
 * BACKEND: export async function getAllProducts(): Promise<Product[]> {
 *   return fetch('/api/products').then(r => r.json())
 * }
 */
export function getAllProducts(): Product[] {
  return products;
}

/**
 * Get a single product by ID (basic info)
 * BACKEND: export async function getProductById(id: string): Promise<Product | undefined> {
 *   return fetch(`/api/products/${id}`).then(r => r.ok ? r.json() : undefined)
 * }
 */
export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

/**
 * Get detailed product information for product detail pages
 * BACKEND: export async function getProductDetail(id: string): Promise<ProductDetail | undefined> {
 *   return fetch(`/api/products/${id}/detail`).then(r => r.ok ? r.json() : undefined)
 * }
 */
export function getProductDetail(id: string): ProductDetail | undefined {
  return productDetails[id];
}

/**
 * Get featured products for homepage
 * BACKEND: export async function getFeaturedProducts(limit?: number): Promise<Product[]> {
 *   return fetch(`/api/products/featured?limit=${limit || 6}`).then(r => r.json())
 * }
 */
export function getFeaturedProducts(limit?: number): Product[] {
  return limit ? products.slice(0, limit) : products;
}

/**
 * Get all product IDs for static generation
 * BACKEND: export async function getAllProductIds(): Promise<string[]> {
 *   return fetch('/api/products/ids').then(r => r.json())
 * }
 */
export function getAllProductIds(): string[] {
  return products.map((p) => p.id);
}
