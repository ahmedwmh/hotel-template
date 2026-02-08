# Booking Contract

## Create booking (Server Action or POST)

**Purpose**: Guest submits a booking from the public form. No auth required.

**Input (validated with Zod)**:

- `guestName`: string, non-empty
- `guestEmail`: string, valid email
- `guestPhone`: string, optional
- `roomId`: string, must reference an active Room
- `checkIn`: string (ISO date) or Date
- `checkOut`: string (ISO date) or Date

**Validation rules**:

- checkOut > checkIn
- Room exists and is active
- No overlapping confirmed/pending booking for this room for the given dates (availability check)

**Success response**:

- `{ success: true, data: { id, reference?, status: "PENDING" } }` or equivalent with created booking id and optional reference number.

**Error response**:

- `{ success: false, error: string, code?: "VALIDATION" | "UNAVAILABLE" | "NOT_FOUND" }`
- Localized message for "room not available for these dates" when availability check fails.

**Idempotency**: Optional unique constraint or idempotency key to avoid duplicate submissions; if duplicate, return clear message or same success result.
