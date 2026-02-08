# Phase 0: Research — 001-hotel-booking-admin

**Branch**: `001-hotel-booking-admin`  
**Date**: 2025-02-05

All technical context items were provided by the user; this document records decisions and best-practice choices for the stack.

---

## 1. Next.js App Router and Data Flow

**Decision**: Use Next.js with App Router; Server Components by default for reading rooms and bookings; mutations via Server Actions (preferred) or API routes.

**Rationale**: Aligns with constitution (Next.js-First, mutations through API/Server Actions). Server Components keep data loading on the server and avoid client-only persistence. Single codebase for public and admin.

**Alternatives considered**: Pages Router (deprecated for new apps); separate API service (rejected for simplicity).

---

## 2. Forms: React Hook Form + Zod + shadcn

**Decision**: Use React Hook Form for form state, Zod for schema validation (shared with server), shadcn/ui for form controls (Input, Select, Button, etc.). Validate on client and re-validate on server in Server Actions.

**Rationale**: RHF + Zod is a common, maintainable pattern; Zod schemas can be reused in Server Actions. shadcn gives accessible, consistent UI and fits Next.js.

**Alternatives considered**: Formik (less TypeScript-first); plain controlled components (more boilerplate).

---

## 3. Database: Prisma + Supabase (DATABASE_URL, DIRECT_URL)

**Decision**: Use Supabase (PostgreSQL) as the database. Connect via Prisma only. Use `DATABASE_URL` for the app (pooled) and `DIRECT_URL` for migrations and introspection. Document both in `.env.example`; never commit real values.

**Rationale**: Matches constitution and user stack. Supabase provides hosted Postgres; Prisma gives type-safe access and migrations. DIRECT_URL is required for Prisma migrations with Supabase pooling.

**Alternatives considered**: Prisma with other Postgres hosts (user chose Supabase); raw SQL (rejected for maintainability).

---

## 4. Admin Authentication

**Decision**: Use NextAuth.js with Credentials provider for admin login. Session-based; protect all routes under `(admin)` with middleware or layout checks. No self-registration; admins created via seed or trusted process.

**Rationale**: Constitution requires “at least one minimal auth mechanism” for admin; credentials provider is sufficient. NextAuth is well-supported with Next.js and allows adding OAuth later if needed.

**Alternatives considered**: Custom JWT/session (more work); Supabase Auth (possible but user specified Next.js stack; can be revisited).

---

## 5. Internationalization (Arabic + English)

**Decision**: Use next-intl (or equivalent) for app and admin UI: locale in path (`[locale]`) or cookie; message files per language (AR/EN); RTL applied for Arabic via `dir` and CSS. Persist language choice (e.g. cookie or path).

**Rationale**: Spec requires full bilingual support and RTL for Arabic. next-intl works with App Router and supports RTL and server/client components.

**Alternatives considered**: react-i18next (more client-heavy); manual JSON + RTL (more custom code).

---

## 6. Room Availability and Booking Validation

**Decision**: Compute availability from stored data: for a given room and date range, check that no existing confirmed (or pending) booking overlaps. Validate in Server Action (or API) before creating a booking; return a clear, localized error if unavailable. Use Prisma queries (e.g. count overlapping bookings) for consistency.

**Rationale**: Constitution requires availability from stored data; spec requires validation at submission and clear messages. Server-side check prevents races and keeps client simple.

**Alternatives considered**: Client-only check (rejected: not source of truth); background job for conflicts (overkill for single-hotel scale).

---

## 7. Duplicate Submission and Security

**Decision**: Use one or more of: (1) Zod validation + idempotency key or unique constraint (e.g. guest + room + check-in) where business-appropriate, (2) disable submit button after first click, (3) CSRF protection via Next.js/NextAuth. For login: rate limiting or lockout after N failed attempts (e.g. middleware or NextAuth config).

**Rationale**: Spec and constitution require security best practices and clear behavior on duplicate or rapid submissions. Minimal implementation: validation + button state + server-side checks.

**Alternatives considered**: No idempotency (risk of double bookings); no rate limiting (weaker security).

---

## 8. Dynamic Site Content (Hero, Offers, Contact)

**Decision**: Store editable content in the database (e.g. `SiteSetting` or key–value table with locale). Admin UI to edit; public site reads via Prisma in Server Components. No hardcoded copy for hero, contact, or other managed content.

**Rationale**: Spec requires “everything dynamic” and admin-managed content. Single source of truth in DB keeps constitution compliance and allows AR/EN per field if needed.

**Alternatives considered**: CMS (out of scope); config files (not admin-editable).
