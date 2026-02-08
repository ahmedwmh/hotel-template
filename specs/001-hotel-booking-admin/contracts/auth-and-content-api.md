# Auth and Site Content Contracts

## Auth (NextAuth Credentials)

- **Login**: POST (or form POST) with `email` and `password`. NextAuth Credentials provider validates against User table (passwordHash). On success: session created; redirect to admin dashboard. On failure: redirect to login with error message (localized).
- **Session**: Cookie-based; all routes under `(admin)` check session; redirect to login if unauthenticated.
- **Logout**: Sign out clears session; redirect to login or public home.
- **Rate limiting**: Apply lockout or rate limit after N failed login attempts (e.g. 5); clear message to user. Implementation in middleware or NextAuth config.

## Site content / settings (Server Actions)

- **Get setting(s)**: Server Component or Server Action. Input: `key` or `keys[]`; optional `locale`. Returns value(s) for public display.
- **Set setting (admin only)**: Server Action. Input: `key`, `value`, optional `locale`. Validation: key allowed; value format per key. Response: `{ success: true }` or error.

Keys are defined in app (e.g. `hero_title`, `hero_subtitle`, `contact_email`, `contact_phone`). Stored in SiteSetting table; admin UI provides forms for each key or a generic key-value editor.
