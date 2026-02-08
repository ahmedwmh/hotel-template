# Admin Bookings Contract

All operations require an authenticated admin session.

## List bookings (Server Component data or GET)

**Query params** (optional):

- `status`: filter by Booking.status (PENDING | CONFIRMED | CANCELLED | CHECKED_IN | CHECKED_OUT)
- `dateFrom`: ISO date; bookings with checkIn >= dateFrom
- `dateTo`: ISO date; bookings with checkOut <= dateTo
- `guestSearch`: string; filter by guest name or email (contains)

**Response**: List of Booking with nested Guest and Room (id, name, slug, rate). Fields: id, reference, status, checkIn, checkOut, guest (name, email, phone), room (name, slug).

## Update booking status (Server Action or PATCH)

**Input**:

- `bookingId`: string, required
- `status`: one of PENDING | CONFIRMED | CANCELLED | CHECKED_IN | CHECKED_OUT

**Validation**: Booking exists and belongs to manageable set; status transition allowed (see data-model state transitions).

**Response**: `{ success: true, data: Booking }` or `{ success: false, error, code? }`.
