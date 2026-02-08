# Quickstart — 001-hotel-booking-admin

**Branch**: `001-hotel-booking-admin`  
**Date**: 2025-02-05

Get the Next.js hotel app running locally with Prisma and Supabase.

---

## Prerequisites

- Node 18+
- npm or pnpm
- Supabase project (for DATABASE_URL and DIRECT_URL)
- Git (optional; for branch `001-hotel-booking-admin`)

---

## 1. Clone and branch

```bash
git clone <repo-url>
cd "Najaf Hotel"
git checkout 001-hotel-booking-admin
```

---

## 2. Install dependencies

```bash
npm install
```

(Or `pnpm install` if using pnpm.)

---

## 3. Environment variables

Copy the example env file and fill in values. **Never commit real credentials.**

```bash
cp .env.example .env
```

Required in `.env`:

- **DATABASE_URL** — Supabase connection string (pooled). Use the connection string from Supabase project settings (e.g. "Transaction" pooler).
- **DIRECT_URL** — Supabase direct connection string (for Prisma migrations and introspection). Use the non-pooled connection string from Supabase.
- **NEXTAUTH_SECRET** — Random secret for NextAuth session encryption (e.g. `openssl rand -base64 32`).
- **NEXTAUTH_URL** — App URL (e.g. `http://localhost:3000` for local dev).

Example (values are placeholders):

```env
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

Ensure `.env` is in `.gitignore` and that `.env.example` documents these variables without real values.

---

## 4. Database (Prisma + Supabase)

Generate Prisma client and run migrations using the DIRECT_URL:

```bash
npx prisma generate
npx prisma migrate deploy
```

(First time: create migration with `npx prisma migrate dev --name init` if migrations are not yet in repo.)

Optional: seed an admin user and sample room:

```bash
npx prisma db seed
```

(Requires `prisma.seed` script in `package.json` and a seed file that creates a User and optionally Room records.)

---

## 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use locale in path if applicable (e.g. `/en`, `/ar`).

- **Public**: Home, rooms list, booking form.
- **Admin**: `/admin/login` (or configured path); log in with seeded credentials, then use dashboard, rooms, bookings, and content/settings.

---

## 6. First steps

1. Log in as admin and create at least one **Room** (name, capacity, rate, active).
2. Open the public site, select language (AR/EN), and submit a **Booking** for that room.
3. In admin, open **Bookings**, find the booking, and change status to **Confirmed**.
4. Optionally edit **Site content** (hero, contact) and confirm the public site shows updated content in both languages.

---

## Troubleshooting

- **Prisma connection errors**: Check DATABASE_URL and DIRECT_URL; use DIRECT_URL for migrations. Ensure Supabase project is running and IP/credentials are correct.
- **NextAuth errors**: Ensure NEXTAUTH_URL matches the URL you use (e.g. no trailing slash); NEXTAUTH_SECRET must be set.
- **No admin user**: Run seed or create a User manually (password hashed with same algorithm as Credentials provider).
