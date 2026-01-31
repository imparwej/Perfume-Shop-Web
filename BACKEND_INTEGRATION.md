# Backend Integration Guide

This document outlines how to connect Maison Noir to a real backend and database.

## Quick Start

All data operations are abstracted through context providers and utility functions. Replace mock implementations with API calls following the patterns below.

## Architecture Overview

```
┌─────────────┐
│   Pages     │  (UI Layer)
└──────┬──────┘
       │
┌──────▼──────────────┐
│  Context Providers  │  (State Management)
│  - AuthProvider     │
│  - CartProvider     │
│  - ThemeProvider    │
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│  Utility Functions  │  (Data Abstraction)
│  - /lib/products.ts │
│  - /lib/auth.ts     │
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│   Backend API       │  (Your Server)
│   Route Handlers    │
└─────────────────────┘
```

## Implementation Steps

### 1. Authentication System

**Current Location:** `/lib/auth-context.tsx`

#### Login Flow
Current mock implementation accepts any password >= 6 characters. Replace with:

```typescript
// /app/api/auth/login/route.ts
export async function POST(req: Request) {
  const { email, password } = await req.json();
  
  // 1. Validate input
  // 2. Query database for user
  // 3. Verify password hash (bcrypt)
  // 4. Create JWT token or session
  // 5. Return user data + set HTTP-only cookie
  
  return Response.json({ user, token });
}
```

In `/lib/auth-context.tsx`, replace the mock login:

```typescript
const login = useCallback(
  async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    const { user } = await response.json();
    setUser(user);
    return { success: true };
  },
  []
);
```

#### Registration Flow
```typescript
// /app/api/auth/register/route.ts
export async function POST(req: Request) {
  const { email, password, name } = await req.json();
  
  // 1. Validate input (email format, password strength)
  // 2. Check if user already exists
  // 3. Hash password with bcrypt
  // 4. Create user in database
  // 5. Create session/JWT
  // 6. Return user data
  
  return Response.json({ user, token });
}
```

#### OAuth Integration
For Google OAuth, use NextAuth.js or implement OAuth redirect:

```typescript
// /app/api/auth/[provider]/route.ts
export async function GET(req: Request, { params }: { params: { provider: string } }) {
  // Redirect to OAuth provider
  // Handle callback at /api/auth/[provider]/callback
}
```

#### Session Management
```typescript
// Add session validation on protected routes
export async function validateSession(req: Request) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  // or read from cookies if using server-side sessions
  
  // Verify JWT or look up session in database
  // Return user if valid, null if invalid
}
```

### 2. Products Data

**Current Location:** `/lib/products.ts`

All functions are currently synchronous. Convert to async API calls:

```typescript
// Before (Mock)
export function getAllProducts(): Product[] {
  return products;
}

// After (Backend)
export async function getAllProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) return undefined;
  return response.json();
}

export async function getProductDetail(id: string): Promise<ProductDetail | undefined> {
  const response = await fetch(`/api/products/${id}/detail`);
  if (!response.ok) return undefined;
  return response.json();
}
```

Create API route:

```typescript
// /app/api/products/route.ts
export async function GET() {
  // Query database for all products
  const products = await db.products.findMany({
    select: { id, name, price, image, notes, size }
  });
  return Response.json(products);
}

// /app/api/products/[id]/route.ts
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const product = await db.products.findUnique({
    where: { id: params.id }
  });
  return Response.json(product);
}
```

### 3. Shopping Cart

**Current Location:** `/lib/cart-context.tsx`

Cart state is client-side only. For persistence across sessions:

```typescript
// Persist cart to database/session
useEffect(() => {
  if (user?.id && items.length > 0) {
    // Save cart to database
    fetch('/api/carts', {
      method: 'POST',
      body: JSON.stringify({ items, userId: user.id })
    });
  }
}, [items, user]);

// Load cart on login
useEffect(() => {
  if (user?.id) {
    fetch(`/api/carts/${user.id}`)
      .then(r => r.json())
      .then(cart => setItems(cart.items));
  }
}, [user?.id]);
```

### 4. Orders & Checkout

**Current Location:** `/app/checkout/page.tsx`

Replace mock checkout with real order creation:

```typescript
// /app/api/orders/route.ts
export async function POST(req: Request) {
  const user = await validateSession(req); // Check auth
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { items, shippingAddress, billingAddress } = await req.json();
  
  // 1. Validate cart items (check pricing, availability)
  // 2. Calculate total with taxes/discounts
  // 3. Process payment (via Stripe, PayPal, etc.)
  // 4. Create order record in database
  // 5. Reduce inventory
  // 6. Send confirmation email
  
  const order = await db.orders.create({
    data: {
      userId: user.id,
      items: { create: items },
      total,
      status: 'completed',
      shippingAddress,
      billingAddress,
    }
  });
  
  return Response.json({ orderId: order.id });
}
```

### 5. Customer Reviews

**Current Location:** `/components/customer-reviews.tsx`

Add review submission:

```typescript
// /app/api/reviews/route.ts
export async function POST(req: Request) {
  const user = await validateSession(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { productId, rating, comment } = await req.json();
  
  // Validate user purchased product (check orders)
  // Create review in database
  const review = await db.reviews.create({
    data: {
      productId,
      userId: user.id,
      rating,
      comment,
      verified: true // Mark as verified purchase
    }
  });
  
  return Response.json(review);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  
  const reviews = await db.reviews.findMany({
    where: { productId },
    include: { user: { select: { name, avatar } } },
    orderBy: { createdAt: 'desc' }
  });
  
  return Response.json(reviews);
}
```

### 6. Custom Fragrances

**Current Location:** `/components/fragrance-customizer.tsx`

Save custom fragrance preferences:

```typescript
// /app/api/customizations/route.ts
export async function POST(req: Request) {
  const user = await validateSession(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { topNotes, heartNotes, baseNotes, intensity, occasion, email } = await req.json();
  
  const customization = await db.customizations.create({
    data: {
      userId: user.id,
      email: email || user.email,
      topNotes,
      heartNotes,
      baseNotes,
      intensity,
      occasion,
      status: 'pending' // Perfumer will review
    }
  });
  
  // Send email to user confirming submission
  await sendEmail({
    to: email || user.email,
    subject: 'Your Fragrance Customization Request',
    template: 'customization-received'
  });
  
  return Response.json(customization);
}
```

### 7. Newsletter Subscriptions

**Current Location:** `/components/newsletter-form.tsx`

Add to newsletter list:

```typescript
// /app/api/newsletter/subscribe/route.ts
export async function POST(req: Request) {
  const { email } = await req.json();
  
  // Check if already subscribed
  const existing = await db.subscribers.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ message: 'Already subscribed' });
  }
  
  // Add to mailing list
  const subscriber = await db.subscribers.create({
    data: { email, subscribedAt: new Date() }
  });
  
  // Optional: Add to external email service (Mailchimp, SendGrid, etc.)
  await mailchimp.addContact(email);
  
  return Response.json(subscriber);
}
```

## Database Schema (PostgreSQL/Prisma Example)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String? // Optional for OAuth users
  name      String
  avatar    String?
  provider  String? // "email", "google", "apple"
  
  orders    Order[]
  reviews   Review[]
  customizations Customization[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id    String @id @default(cuid())
  name  String
  price Float
  image String
  notes String
  size  String
  description String?
  story String?
  ingredients String[]
  
  reviews Review[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Order {
  id        String @id @default(cuid())
  userId    String
  user      User @relation(fields: [userId], references: [id])
  
  items     OrderItem[]
  total     Float
  status    String // "pending", "processing", "shipped", "delivered"
  
  shippingAddress String
  billingAddress  String
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model OrderItem {
  id        String @id @default(cuid())
  orderId   String
  order     Order @relation(fields: [orderId], references: [id])
  
  productId String
  quantity  Int
  price     Float
}

model Review {
  id        String @id @default(cuid())
  productId String
  product   Product @relation(fields: [productId], references: [id])
  
  userId    String
  user      User @relation(fields: [userId], references: [id])
  
  rating    Int // 1-5
  comment   String
  verified  Boolean @default(false)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Customization {
  id        String @id @default(cuid())
  userId    String?
  user      User? @relation(fields: [userId], references: [id])
  
  email     String
  topNotes     String[]
  heartNotes   String[]
  baseNotes    String[]
  intensity    String
  occasion     String
  
  status    String @default("pending") // "pending", "completed"
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Subscriber {
  id        String @id @default(cuid())
  email     String @unique
  subscribedAt DateTime @default(now())
}
```

## Security Checklist

- [ ] Hash passwords with bcrypt (never store plain text)
- [ ] Use JWT tokens or secure sessions for auth
- [ ] Implement CSRF protection on forms
- [ ] Validate all inputs server-side
- [ ] Use HTTPS for all API communication
- [ ] Set HTTP-only cookies for auth tokens
- [ ] Implement rate limiting on auth endpoints
- [ ] Validate user permissions before returning data
- [ ] Log security-relevant events
- [ ] Keep dependencies updated

## Testing Checklist

- [ ] Test all API endpoints with valid/invalid inputs
- [ ] Test authentication flows (login, register, logout)
- [ ] Test cart operations (add, remove, update)
- [ ] Test checkout process with real payment processor
- [ ] Test email notifications
- [ ] Load test with multiple concurrent users
- [ ] Test payment webhook handling
- [ ] Verify sensitive data is never logged

## Deployment Checklist

- [ ] Set environment variables for production
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure CDN for static assets
- [ ] Set up error monitoring (Sentry)
- [ ] Configure logging
- [ ] Set up analytics
- [ ] Test all endpoints in production
- [ ] Prepare rollback plan

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/maison_noir

# Authentication
JWT_SECRET=your_secret_key_here
NEXTAUTH_SECRET=another_secret_key
NEXTAUTH_URL=https://yourdomain.com

# OAuth Providers
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# Payment Processing
STRIPE_SECRET_KEY=xxx
STRIPE_PUBLIC_KEY=xxx

# Email Service
SENDGRID_API_KEY=xxx
SENDGRID_FROM_EMAIL=noreply@maisonnoir.com

# External Services
MAILCHIMP_API_KEY=xxx
```

## Performance Considerations

1. **Caching:** Use Redis for product catalog, user sessions
2. **Database:** Add indexes on frequently queried fields (productId, userId, email)
3. **Image Optimization:** Use CDN for product images
4. **API Response:** Implement pagination for large datasets
5. **Rate Limiting:** Protect endpoints from abuse

## Support & Resources

- Next.js API Routes: https://nextjs.org/docs/api-routes/introduction
- Prisma ORM: https://www.prisma.io/docs/
- NextAuth.js: https://next-auth.js.org/
- Stripe API: https://stripe.com/docs/api
- Password Hashing: https://github.com/kelektiv/node.bcrypt.js

---

**Ready to integrate?** Start with authentication, then move to products, orders, and reviews. Each layer can be developed independently.
