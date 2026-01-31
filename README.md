# Maison Noir - Premium Luxury Fragrance E-Commerce Platform

A sophisticated, fully-featured luxury fragrance e-commerce platform built with Next.js 16, React, and TypeScript. Featuring premium animations, customer reviews, fragrance customization, and guest checkout flow.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/md-parwezs-projects-d3b84b42/v0-luxury-perfume-navbar)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app)

## Live Demo

**[View Live Demo](https://vercel.com/md-parwezs-projects-d3b84b42/v0-luxury-perfume-navbar)**

## Features

### Core E-Commerce Functionality
- **Product Catalog**: Beautifully designed product grid with 6+ signature fragrances
- **Product Details**: Rich detail pages with descriptions, ingredients, notes, and customer reviews
- **Shopping Cart**: Real-time cart state management with add-to-cart bubble animations
- **Checkout Flow**: Multi-step secure checkout with order confirmation
- **Order Confirmation**: Professional order receipts with order numbers

### User Experience
- **Guest Browsing**: Full product browsing and cart functionality without login
- **Smart Authentication**: Login/Register only enforced at checkout
- **User Profile**: Personalized navbar with user menu and sign out
- **Responsive Design**: Mobile-first approach optimized for all screen sizes
- **Premium Animations**: Smooth fade-ins, parallax, marquee, and micro-interactions

### Advanced Features
- **Customer Reviews**: Auto-rotating carousel with verified customer testimonials
- **Fragrance Customizer**: 4-step interactive form to design custom fragrances
  - Select preferred top, heart, and base notes
  - Choose intensity level (light, moderate, intense)
  - Select occasions (everyday, evening, special, romantic)
  - Get personalized master perfumer recommendations
- **Newsletter Subscription**: Email signup with backend-ready implementation
- **About Page**: Brand heritage with master perfumer profiles
- **Dedicated Review Page**: Full customer testimonial gallery

### Accessibility & Performance
- **Keyboard Navigation**: Full keyboard support with visible focus states
- **Screen Reader Ready**: ARIA labels and semantic HTML
- **Performance**: Image optimization, lazy loading, efficient animations
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

## Technology Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 with CSS variables |
| **State** | React Context (Cart & Auth) |
| **Icons** | Lucide React |
| **Animations** | CSS + React hooks |
| **Fonts** | Google Fonts (Cormorant Garamond, Inter) |
| **UI Framework** | shadcn/ui (underlying components) |

## Project Structure

```
maison-noir/
├── app/
│   ├── page.tsx                      # Homepage with hero, features, products
│   ├── products/
│   │   ├── page.tsx                 # Product listing page
│   │   └── [id]/page.tsx            # Individual product detail page
│   ├── cart/page.tsx                # Shopping cart page
│   ├── checkout/page.tsx            # Checkout flow (auth protected)
│   ├── login/page.tsx               # Login page
│   ├── register/page.tsx            # Registration page
│   ├── reviews/page.tsx             # All customer reviews page
│   ├── customize/page.tsx           # Fragrance customizer page
│   ├── about/page.tsx               # Brand story & master perfumers
│   ├── layout.tsx                   # Root layout with providers
│   └── globals.css                  # Global styles & animations
│
├── components/
│   ├── navbar.tsx                   # Main navigation with cart & user profile
│   ├── footer.tsx                   # Footer (shared across all pages)
│   ├── product-card.tsx             # Individual product card component
│   ├── product-grid.tsx             # Product grid with lazy loading
│   ├── product-details.tsx          # Product detail view & add to cart
│   ├── cart-page.tsx                # Cart items display & management
│   ├── login-form.tsx               # Login with email/password & Google OAuth
│   ├── register-form.tsx            # Registration form
│   ├── customer-reviews.tsx         # Testimonial carousel component
│   ├── fragrance-customizer.tsx     # 4-step fragrance design wizard
│   ├── newsletter-form.tsx          # Email subscription component
│   ├── cart-bubble-animation.tsx    # Add-to-cart bubble animation
│   └── cart-animation-container.tsx # Animation lifecycle manager
│
├── lib/
│   ├── auth-context.tsx             # Authentication state & mock login
│   ├── cart-context.tsx             # Cart state management
│   ├── cart-utils.ts                # Cart animation utilities
│   ├── products.ts                  # Product data & API-ready functions
│   └── utils.ts                     # Helper utilities (cn function, etc)
│
├── public/images/                   # Product images
├── README.md                        # This file
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/maison-noir.git
cd maison-noir

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open browser
# Visit http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

## Key Features Explained

### 1. Guest Checkout Flow
Users can:
- Browse all products without login ✓
- Add items to cart without login ✓
- Modify cart quantities ✓
- Only login when proceeding to checkout
- Complete order after authentication

### 2. Add-to-Cart Animation
When users click "Add to Cart":
1. A small bubble animates from the button
2. Smooth cubic-bezier easing
3. Bubble flows toward the cart icon in navbar
4. Particle effects and glow for premium feel
5. Cart count updates in real-time

### 3. Fragrance Customizer
Multi-step interactive form:

**Step 1: Select Notes**
- Choose up to 2 notes from each category (top, heart, base)
- Visual feedback showing selected count

**Step 2: Choose Intensity**
- Light: Subtle, intimate presence
- Moderate: Balanced, versatile wear
- Intense: Bold, commanding aura

**Step 3: Select Occasion**
- Everyday, Evening, Special Occasion, Romantic
- Visual icons for each type

**Step 4: Contact Info**
- Email submission
- Master perfumer review process
- 24-hour response time

### 4. Customer Reviews
- Auto-rotating carousel of testimonials
- 5-star ratings with verified badges
- Customer location and purchase info
- Manual navigation and dot indicators
- Trust metrics (4.9 rating, 15K+ customers, 98% would recommend)

## Authentication System

### Mock Authentication (Development)
Located in `/lib/auth-context.tsx`:
- Email/password validation
- Google OAuth UI (callback ready)
- Session storage with localStorage
- User context for entire app

### Production Integration
Replace mock implementation with:
```typescript
// Example: Connect to real API
const result = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});

// Or use NextAuth.js / Auth.js
import { signIn } from "next-auth/react";
await signIn('google', { callbackUrl: '/checkout' });
```

## Data & API Integration

### Product Data
All product data is in `/lib/products.ts`:
- `getAllProducts()` - Get all products
- `getProductById(id)` - Get single product
- `getProductDetail(id)` - Get detailed info
- `getFeaturedProducts(limit)` - Get featured items

**To connect to backend:**
```typescript
// Convert to async API calls
export async function getAllProducts() {
  return fetch('/api/products').then(r => r.json());
}
```

### Cart Management
Located in `/lib/cart-context.tsx`:
- `addToCart(item, quantity)`
- `removeFromCart(id)`
- `updateQuantity(id, quantity)`
- `clearCart()`
- `totalItems`, `totalPrice`

### User Preferences
Newsletter and customization preferences can be stored:
```typescript
// Save preferences
await fetch('/api/user/preferences', {
  method: 'POST',
  body: JSON.stringify({ marketing: true })
});
```

## Backend Integration Checklist

- [ ] **Authentication**
  - [ ] Replace mock auth with real API
  - [ ] Implement JWT/session tokens
  - [ ] Add Google OAuth with actual credentials
  - [ ] Email verification flow

- [ ] **Products**
  - [ ] Create `/api/products` endpoint
  - [ ] Implement `/api/products/[id]` detail route
  - [ ] Add product search & filtering
  - [ ] Implement pagination

- [ ] **Cart**
  - [ ] Create `/api/cart` endpoints
  - [ ] Implement cart persistence (database)
  - [ ] Add inventory management

- [ ] **Orders**
  - [ ] Create `/api/orders` endpoints
  - [ ] Implement payment processing (Stripe)
  - [ ] Add order tracking
  - [ ] Email notifications

- [ ] **Reviews**
  - [ ] Create `/api/reviews` endpoints
  - [ ] Implement review moderation
  - [ ] Add rating aggregation

- [ ] **Customization**
  - [ ] Create `/api/customize` endpoint
  - [ ] Implement email notifications
  - [ ] Create admin dashboard for perfumers

## Customization

### Change Colors
Edit CSS variables in `app/globals.css`:
```css
:root {
  --background: oklch(0.98 0.002 90);
  --foreground: oklch(0.15 0.01 30);
  --accent: oklch(0.65 0.08 45);
  /* ... more colors */
}
```

### Change Fonts
Update font imports in `app/layout.tsx` and `app/globals.css`:
```typescript
// Use different Google fonts
import { Playfair_Display, Poppins } from 'next/font/google';
```

### Add Products
Update `/lib/products.ts`:
```typescript
export const products = [
  {
    id: "your-id",
    name: "Product Name",
    price: 295,
    image: "/images/product.jpg",
    notes: "Top · Heart · Base",
  },
  // ... more products
];
```

### Modify Animations
Edit keyframes in `app/globals.css`:
```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Performance Optimizations

- **Image Optimization**: Using Next.js Image component for automatic optimization
- **Lazy Loading**: Product images load on demand
- **Code Splitting**: Pages load only required code
- **CSS Animations**: Hardware-accelerated for smooth performance
- **Efficient State**: Minimal re-renders with Context API
- **Intersection Observer**: Scroll-triggered animations

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome/Chromium | Latest ✓ |
| Firefox | Latest ✓ |
| Safari | Latest ✓ |
| Edge | Latest ✓ |
| Mobile (iOS/Android) | Latest ✓ |

## Deployment

### Deploy to Vercel (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect repo to Vercel
# Visit vercel.com and select this repo

# 3. Vercel automatically deploys on push
```

### Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

## Accessibility Features

- **Keyboard Navigation**: Full support (Tab, Enter, Escape)
- **Focus Management**: Clear visible focus indicators
- **ARIA Labels**: Descriptive labels for screen readers
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Color Contrast**: WCAG AA compliant ratios
- **Form Labels**: Associated labels for all inputs

## SEO

- **Meta Tags**: Dynamic metadata for each page
- **Open Graph**: Social media preview optimization
- **Structured Data**: JSON-LD for rich snippets
- **Sitemap**: Automatic sitemap generation
- **Robots.txt**: Search engine crawling rules

## Common Tasks

### Add a New Product
1. Add to `/lib/products.ts` in `products` array
2. Add detail info to `productDetails` object
3. Image will auto-load from `/public/images/`

### Modify Checkout Flow
Edit `/app/checkout/page.tsx` and `/components/checkout-cta.tsx`

### Change Homepage Content
Edit sections in `/app/page.tsx`

### Add New Pages
Create new folder in `/app` with `page.tsx`

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Build Errors
```bash
# Clear next cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Build again
npm run build
```

### Images Not Loading
- Check image exists in `/public/images/`
- Verify image path in product data
- Check file extension is correct (jpg, png, webp)

## Contributing

This is a luxury brand e-commerce platform. For modifications:
1. Maintain premium design standards
2. Test on mobile devices
3. Verify animations are smooth
4. Check accessibility compliance

## License

Proprietary - Maison Noir Brand

## Support

For questions or issues:
- Email: support@maisonnoir.com
- Documentation: Check comments in source code
- Issues: File detailed bug reports with steps to reproduce

---

**Built with [v0.app](https://v0.app) - AI-powered UI generation by Vercel**
