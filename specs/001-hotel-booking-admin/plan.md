# Implementation Plan: Dynamic Hotel Site with Simple Booking and Admin Panel

**Branch**: `001-hotel-booking-admin` | **Date**: 2025-02-05 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/001-hotel-booking-admin/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

Build a dynamic hotel site where guests submit bookings via a simple form (no account); admins log in to manage rooms, rates, bookings, and site content. Full UI in Arabic and English (RTL support). Stack: Next.js (App Router), shadcn/ui, React Hook Form + Zod, Prisma, Supabase (DATABASE_URL, DIRECT_URL). All room and booking data is stored and served from the database; no hardcoded inventory. Admin area is protected; public pages are unauthenticated.

## Technical Context

**Language/Version**: TypeScript 5.x, Node 18+  
**Primary Dependencies**: Next.js (App Router), shadcn/ui, React Hook Form, Zod, Prisma, Supabase  
**Storage**: Supabase (PostgreSQL) via Prisma; connection via DATABASE_URL (pooled) and DIRECT_URL (migrations)  
**Testing**: Vitest or Jest for unit/component tests; optional Playwright for E2E  
**Target Platform**: Web (modern browsers); server-side on Node  
**Project Type**: web (single Next.js application: public site + admin under same app)  
**Performance Goals**: Public pages respond in under 2s; admin list/filter operations in under 1s  
**Constraints**: Bilingual (AR/EN) and RTL for Arabic; secure session for admin; no hardcoded room/rate data  
**Scale/Scope**: Single hotel property; admin users in low dozens; bookings in hundreds/thousands

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Next.js-First | App built with Next.js; App Router; Server Components by default; mutations via API routes or Server Actions only | PASS |
| II. Data Model | Rooms, Bookings, Guests as core entities; availability from stored data; Prisma schema as source of truth; migrations for schema changes | PASS |
| III. API & Contracts | All room/booking create/update/delete via defined API or Server Actions; clear request/response contracts | PASS |
| IV. Authentication | Admin area protected; credential-based or NextAuth for admin; public booking unauthenticated | PASS |
| V. Simplicity | No feature without spec/requirement; server-side preferred; complexity justified in plan | PASS |
| Tech: Supabase + Prisma | All DB access through Prisma; DATABASE_URL and DIRECT_URL in .env.example, never committed | PASS |
| Tech: No hardcoded inventory | Room list and rates from backend/API only | PASS |

**Post–Phase 1**: No violations introduced by data-model or contracts. Constitution Check remains PASS.

## Project Structure

### Documentation (this feature)

```text
specs/001-hotel-booking-admin/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 API/action contracts
└── tasks.md             # Phase 2 output (/speckit.tasks - not created by plan)
```

### Source Code (repository root)

Single Next.js App Router application (no separate backend/frontend repos).

```text
src/
├── app/
│   ├── layout.tsx           # Root layout; locale provider
│   ├── [locale]/            # Public site (AR/EN)
│   │   ├── layout.tsx
│   │   ├── page.tsx         # Home
│   │   ├── rooms/           # Room listing
│   │   ├── book/            # Booking form
│   │   └── ...
│   ├── (admin)/             # Admin route group
│   │   ├── layout.tsx       # Auth check, admin shell
│   │   ├── login/page.tsx
│   │   ├── dashboard/
│   │   ├── rooms/           # CRUD rooms
│   │   ├── bookings/        # List, filter, status
│   │   └── content/        # Site content / settings
│   └── api/                 # API routes if used (else Server Actions only)
│       ├── auth/            # Optional: auth callbacks
│       ├── bookings/
│       └── ...
├── components/
│   ├── ui/                  # shadcn components
│   ├── forms/               # RHF + Zod form components
│   ├── public/              # Public site components
│   └── admin/               # Admin-only components
├── lib/
│   ├── prisma.ts            # Prisma client singleton
│   ├── auth.ts              # Auth config (e.g. NextAuth)
│   ├── validations/         # Zod schemas
│   └── i18n/                # Messages AR/EN
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── types/                   # Shared TS types

public/
tests/
├── unit/
├── integration/
└── e2e/                     # Optional
```

**Structure Decision**: One Next.js app with route groups `[locale]` (public) and `(admin)` (protected). Server Components for data loading; Server Actions or API routes for mutations. Prisma and Supabase only; DATABASE_URL and DIRECT_URL for connection. Aligns with constitution (single source of truth, no client-only persistence).

## Complexity Tracking

> No constitution violations. This section left empty.
