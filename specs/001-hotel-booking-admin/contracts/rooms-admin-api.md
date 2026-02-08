# Admin Rooms Contract

All operations require an authenticated admin session.

## List rooms (Server Component data or GET /api/admin/rooms)

- Returns list of Room with: id, name, slug, capacity, rate, isActive, createdAt.
- Optional query: `?activeOnly=true` to filter by isActive.

## Create room (Server Action or POST)

**Input (Zod)**:

- `name`: string, non-empty
- `slug`: string, unique, URL-safe (optional if generated from name)
- `capacity`: number, integer > 0
- `rate`: number >= 0
- `isActive`: boolean, default true

**Response**: `{ success: true, data: Room }` or `{ success: false, error, code? }`.

## Update room (Server Action or PATCH)

**Input**: Same as create; all fields optional except identity. `id` or `slug` to identify room.

**Response**: `{ success: true, data: Room }` or error.

## Delete or disable room (Server Action or DELETE)

- **Soft disable**: Set `isActive: false`; room no longer appears on public site or in booking form. Existing bookings remain.
- **Hard delete**: Optional; only if no future bookings (PENDING/CONFIRMED) for this room, or business rule documented (e.g. cancel those bookings first).

**Response**: `{ success: true }` or `{ success: false, error, code?: "HAS_BOOKINGS" }`.
