# Najaf Hotel Constitution
<!-- Sync: Filled from template for dynamic hotel management (Next.js). Amended v1.1.0: Prisma + Supabase; DATABASE_URL, DIRECT_URL required. -->

## Core Principles

### I. Next.js-First
The application MUST be built with Next.js. Prefer the App Router; use Server Components by default. All persisted data mutations (bookings, rooms, availability) MUST go through API routes or Server Actions—no client-only persistence. Static or dynamic rendering choices must be explicit and justified by the feature.

### II. Data Model (Single Source of Truth)
Core entities are non-negotiable: **Rooms** (type, capacity, rate, availability), **Bookings** (guest info, check-in/out dates, room, status), and **Guests** (or equivalent identifier). Room availability and inventory MUST be derived from stored data (bookings + room definitions), not hardcoded in the UI or config. Schema changes require a documented migration (Prisma migrations for Supabase).

### III. API & Contracts
All create/update/delete operations for rooms and bookings MUST use defined API routes or Server Actions with a clear request/response contract. Client state MUST NOT be the source of truth for availability or pricing. Contract changes require spec/plan alignment and backward compatibility or a documented migration.

### IV. Authentication (Minimum Viable)
Admin or staff management areas MUST be protected. At least one minimal auth mechanism (e.g., credential-based or NextAuth) is required for any action that modifies rooms, rates, or bookings. Public-facing pages (browse rooms, submit booking request) may remain unauthenticated as specified per feature.

### V. Simplicity (YAGNI)
No feature or dependency without a stated requirement in a spec or constitution. Prefer server-side rendering and server state; avoid unnecessary client-side complexity. Complexity must be justified in the implementation plan.

## Technology & Stack Constraints

- **Framework**: Next.js (current LTS); Node 18+.
- **Database**: Supabase (PostgreSQL). All access MUST go through Prisma; the Prisma schema is the single source of truth for the data model. Schema changes MUST use Prisma migrations.
- **Connection**: Supabase connection MUST use the standard Prisma env vars: **`DATABASE_URL`** (pooled connection for the app) and **`DIRECT_URL`** (direct connection for migrations and introspection). Both MUST be documented in `.env.example` and never committed.
- **UI**: No hardcoded room inventory or availability in components; data MUST come from the backend/API (via Prisma).
- **Deployment**: Build and start scripts MUST succeed; environment and secrets (DATABASE_URL, DIRECT_URL, auth) documented in project docs or `.env.example`.

## Development Workflow & Quality Gates

- All pull requests MUST pass lint and the Constitution Check defined in the implementation plan template.
- Schema or contract changes require a migration plan or versioning note in the spec.
- New features MUST reference a feature spec and plan that align with this constitution.

## Governance

This constitution supersedes ad-hoc technical decisions. All PRs and reviews MUST verify compliance with the principles above. Amendments require documentation, approval, and an impact note (e.g., Sync Impact Report) and MUST be reflected in dependent templates (e.g., plan-template Constitution Check). Use the project spec and implementation plan for per-feature guidance.

**Version**: 1.1.0 | **Ratified**: 2025-02-05 | **Last Amended**: 2025-02-05
