# SweetShop

E-commerce platform for clothing. Built as a full-stack learning project with a focus on clean architecture and real-world patterns.

**Live:** https://sweet-shop-one-flame.vercel.app

---

## Stack

**Frontend:** Next.js 15, TypeScript, Tailwind CSS  
**Backend:** Node.js, Express, TypeScript  
**Database:** PostgreSQL, Prisma ORM  
**Auth:** JWT + refresh tokens, httpOnly cookies  
**Payments:** Stripe Checkout  
**Infra:** Vercel (frontend), Render (backend), Neon (database)  
**CI/CD:** GitHub Actions — tests must pass before deploy  

---

## Features

- Product catalog with search, filtering by category, sorting, and pagination
- Product image gallery with variant selector (size, color)
- Cart with quantity management, synced to server
- Checkout flow with Stripe payment
- Order history and status tracking
- Admin panel — manage products (with variants), orders, users, categories
- Role-based access (Customer, Manager, Admin)
- Refresh token rotation for persistent sessions

---

## Architecture

```
front/                  Next.js App Router
  app/                  Pages and layouts
  components/           UI components
  lib/
    actions/            Server Actions (authenticated requests)
    api/                Public API calls
    types.ts            Shared TypeScript interfaces

back/                   Express REST API
  src/
    routes/             API endpoints
    middleware/         Auth token validation
    lib/                Prisma singleton
    __tests__/          Jest + Supertest integration tests
  prisma/               Schema and migrations
```

---

## Local Development

**Prerequisites:** Docker, Node.js 20+

```bash
git clone https://github.com/BolatKen/SweetShop
cd SweetShop
```

Start the database:
```bash
docker-compose up -d db
```

Backend:
```bash
cd back
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

Frontend:
```bash
cd front
cp .env.example .env.local
npm install
npm run dev
```

---

## Environment Variables

**back/.env**
```
DATABASE_URL=
JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
FRONTEND_URL=
PORT=
```

**front/.env.local**
```
NEXT_PUBLIC_API_URL=
```

---

## Testing

```bash
cd back && npm test
```

Tests run against a local PostgreSQL instance. GitHub Actions runs the full test suite on every push to `main` — deployment only happens if all tests pass.

Covered:
- Health check
- Auth — register, login, invalid credentials
- Products — list, detail, unauthorized create
- Cart — add, increment on duplicate, remove

---

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login, returns tokens |
| POST | /api/auth/refresh | Rotate access token |
| GET | /api/products | List with search, filter, sort, pagination |
| GET | /api/products/:slug | Product detail with variants |
| POST | /api/products | Create product (Admin) |
| PATCH | /api/products/:id | Update product (Admin) |
| DELETE | /api/products/:id | Delete product (Admin) |
| POST | /api/products/:id/variants | Add variant (Admin) |
| DELETE | /api/products/:id/variants/:variantId | Remove variant (Admin) |
| GET | /api/cart | User cart |
| POST | /api/cart | Add to cart |
| DELETE | /api/cart/:id | Remove from cart |
| POST | /api/orders | Create order |
| GET | /api/orders | Order history |
| POST | /api/payments/checkout | Create Stripe session |
| POST | /api/payments/webhook | Stripe webhook handler |
| GET | /api/admin/stats | Dashboard stats (Admin) |
| GET | /api/admin/orders | All orders (Admin) |
| PATCH | /api/admin/orders/:id | Update order status (Admin) |
| GET | /api/admin/users | All users (Admin) |
| PATCH | /api/admin/users/:id | Update user role (Admin) |