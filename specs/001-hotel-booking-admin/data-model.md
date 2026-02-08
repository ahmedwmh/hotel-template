# Data Model — 001-hotel-booking-admin

**Branch**: `001-hotel-booking-admin`  
**Date**: 2025-02-05

Entities and relationships for the dynamic hotel site. Implement in Prisma schema; Supabase (PostgreSQL) via DATABASE_URL and DIRECT_URL.

---

## Entities

### Room

Represents a bookable room type. Public site lists only active rooms; availability is derived from bookings.

| Field       | Type     | Constraints / Notes                                      |
|------------|----------|-----------------------------------------------------------|
| id         | String   | PK, cuid or uuid                                          |
| name       | String   | Required; display name (e.g. "Double Standard")            |
| slug       | String   | Unique; for URLs                                           |
| capacity   | Int      | Required; number of guests                                 |
| rate       | Decimal  | Required; price per night (store in minor units or Decimal)|
| isActive   | Boolean  | Default true; false = hidden from public and not bookable |
| createdAt  | DateTime | Set on create                                             |
| updatedAt  | DateTime | Set on create/update                                       |

**Validation**: name non-empty; capacity > 0; rate >= 0; slug unique.

**State**: No formal state machine. `isActive` toggles visibility and bookability.

---

### Guest

Represents the person making a booking. Stored per booking for simplicity; can be normalized later (e.g. by email) if needed.

| Field       | Type   | Constraints / Notes                    |
|------------|--------|----------------------------------------|
| id         | String | PK, cuid or uuid                       |
| name       | String | Required                                |
| email      | String | Required; format validated              |
| phone      | String | Optional                                |
| createdAt  | DateTime | Set on create                         |

**Validation**: name non-empty; email valid format.

---

### Booking

Reservation request or confirmed stay. Links one room and one guest; dates and status drive availability.

| Field        | Type    | Constraints / Notes                                  |
|-------------|---------|-------------------------------------------------------|
| id          | String  | PK, cuid or uuid                                     |
| guestId     | String  | FK → Guest; required                                 |
| roomId      | String  | FK → Room; required                                   |
| checkIn     | DateTime| Required; date only (time ignored or midnight)        |
| checkOut    | DateTime| Required; date only; must be after checkIn            |
| status      | Enum    | PENDING | CONFIRMED | CANCELLED | CHECKED_IN | CHECKED_OUT |
| reference   | String  | Optional; unique human-readable ref for guest         |
| createdAt   | DateTime| Set on create                                        |
| updatedAt   | DateTime| Set on create/update                                 |

**Validation**: checkOut > checkIn; room must be active at creation time; availability check (no overlapping confirmed/pending booking for same room).

**State transitions**: PENDING → CONFIRMED | CANCELLED; CONFIRMED → CHECKED_IN → CHECKED_OUT; CONFIRMED → CANCELLED. Only CONFIRMED and PENDING count toward availability.

---

### User (Admin)

Authenticated admin; used for login and protecting admin routes. No self-registration.

| Field       | Type     | Constraints / Notes              |
|------------|----------|----------------------------------|
| id         | String   | PK, cuid or uuid                 |
| email      | String   | Unique; required                  |
| passwordHash | String | Required; hashed (e.g. bcrypt)   |
| name       | String   | Optional display name             |
| createdAt  | DateTime | Set on create                    |
| updatedAt  | DateTime | Set on create/update             |

**Validation**: email unique and valid; password meets policy (handled by auth layer).

---

### SiteSetting (or Key–Value Content)

Configurable content and settings for the public site (hero text, contact, etc.). Optional locale for bilingual values.

| Field    | Type   | Constraints / Notes                          |
|----------|--------|-----------------------------------------------|
| id       | String | PK, cuid or uuid                             |
| key      | String | Unique; e.g. "hero_title", "contact_email"   |
| value    | Text   | Required; JSON or plain text                  |
| locale   | String | Optional; "ar" | "en" | null (shared)        |
| updatedAt| DateTime | Set on create/update                        |

**Validation**: key unique per locale (or globally if locale null). Value structure defined per key in app logic.

---

## Relationships

- **Booking** → **Guest** (many-to-one): one booking has one guest.
- **Booking** → **Room** (many-to-one): one booking has one room.
- **Room** has many **Bookings**; **Guest** has many **Bookings** (for history/reuse if guest entity is shared later).

No direct relation from **User** to other entities; User is for auth only. **SiteSetting** is standalone.

---

## Availability Rule

A room is **available** for date range [checkIn, checkOut) if there is no **Booking** for that room with status in (PENDING, CONFIRMED, CHECKED_IN) and overlapping date range. Implement in Prisma with a query that counts overlapping bookings; use in Server Action (or API) before creating a booking.

---

## Migrations

All schema changes via Prisma migrations. Use `DIRECT_URL` for migration and introspection. Document in plan/spec when schema or contracts change.
