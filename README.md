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

- Product catalog with variants (size, color, stock)
- Cart with quantity management, synced to server
- Checkout flow with Stripe payment
- Order history and status tracking
- Admin panel — manage products, orders, users
- Role-based access (Customer, Manager, Admin)
- Refresh token rotation for persistent sessions

---

## Architecture

front/ Next.js App Router
app/ Pages and layouts
components/ UI components
lib/
actions/ Server Actions (authenticated requests)
api/ Public API calls
types.ts Shared TypeScript interfaces

back/ Express REST API
src/
routes/ API endpoints
middleware/ Auth token validation
lib/ Prisma singleton
prisma/ Schema and migrations


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

---

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login, returns tokens |
| POST | /api/auth/refresh | Rotate access token |
| GET | /api/products | List products |
| GET | /api/products/:slug | Product detail |
| GET | /api/cart | User cart |
| POST | /api/cart | Add to cart |
| DELETE | /api/cart/:id | Remove from cart |
| POST | /api/orders | Create order |
| GET | /api/orders | Order history |
| POST | /api/payments/checkout | Create Stripe session |
| POST | /api/payments/webhook | Stripe webhook handler |