# API and Server Action Contracts — 001-hotel-booking-admin

All mutations and data access follow the constitution: defined contracts, Server Actions or API routes only for writes. Public reads can be Server Component data loading (no formal HTTP contract) or GET endpoints if needed.

## Overview

| Area | Mechanism | Contract |
|------|-----------|----------|
| Public: list rooms | Server Component (Prisma) or GET | See data-model Room fields |
| Public: submit booking | Server Action | `createBooking` — see below |
| Admin: auth | NextAuth (Credentials) | Login form → session |
| Admin: rooms CRUD | Server Actions | `createRoom`, `updateRoom`, `deleteRoom`; list via Server Component or GET |
| Admin: bookings list/filter | Server Component or GET | Query params: status, dateFrom, dateTo, guestSearch |
| Admin: booking status update | Server Action | `updateBookingStatus` |
| Admin: site content | Server Actions | `getSiteSetting`, `setSiteSetting` (or batch) |

Request/response shapes and validation (Zod) are described in the contract documents and in `openapi.yaml` for any REST endpoints.

## Conventions

- All mutation payloads validated with Zod on the server; reuse schemas from `lib/validations`.
- Errors return a consistent shape: `{ success: false, error: string, code?: string }`.
- Success returns `{ success: true, data?: T }` or the created/updated entity as appropriate.
- Locale (ar/en) is passed via path, cookie, or header as per i18n setup.
