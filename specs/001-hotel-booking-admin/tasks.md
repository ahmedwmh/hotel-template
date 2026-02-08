# Tasks: Dynamic Hotel Site with Simple Booking and Admin Panel

**Input**: Design documents from `specs/001-hotel-booking-admin/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks grouped by user story for independent implementation and testing. Tests are not requested in the spec; no test tasks included.

**User additions**: (1) Admin login page; (2) Admin dashboard: bookings table with “contacted customer” column, rooms CRUD, room availability by date, simple reports (month / 3 months / year); (3) Public: dynamic slider/carousel, dynamic rooms & suites, search results page, booking form (full name, number, guests, availability check); (4) About and Contact pages dynamic (CRUD). Reference existing components under `src/` (e.g. HeroSection, Rooms, FindRoom, CheckingForm, About, Contact) when implementing in Next.js.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story (US1–US5). Setup/Foundational/Polish have no story label.
- Include exact file paths in task descriptions.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Next.js project initialization with stack from plan.md

- [x] T001 Create Next.js App Router project with TypeScript at repository root (or migrate existing) per plan structure in `specs/001-hotel-booking-admin/plan.md`
- [x] T002 Add dependencies: Prisma, NextAuth, shadcn/ui, React Hook Form, Zod, next-intl (or chosen i18n) in `package.json`
- [x] T003 [P] Configure Prisma with Supabase: `prisma/schema.prisma` with datasource using `env("DATABASE_URL")` and `directUrl = env("DIRECT_URL")`; add `.env.example` with DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
- [x] T004 [P] Initialize shadcn/ui and add required components (Button, Input, Form, Table, Select, Card, Label) under `src/components/ui/`
- [x] T005 [P] Add ESLint and Prettier config; ensure `src/app/`, `src/lib/`, `src/components/`, `prisma/` exist per plan

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema, auth, i18n, and shared lib so all user stories can proceed.

**Critical**: No user story work until this phase is complete.

- [x] T006 Define Prisma schema in `prisma/schema.prisma`: models Room, Guest, Booking, User, SiteSetting per `specs/001-hotel-booking-admin/data-model.md`; add `contactedAt` (DateTime?, optional) and/or `contactedByAdmin` (Boolean default false) on Booking for “did we contact customer”
- [ ] T007 Run initial migration: `npx prisma migrate dev --name init` (uses DIRECT_URL); ensure DATABASE_URL and DIRECT_URL are set in `.env`
- [x] T008 [P] Create Prisma client singleton in `src/lib/prisma.ts` (no multiple instances in dev)
- [x] T009 [P] Add Zod schemas in `src/lib/validations/`: booking (create booking input), room (create/update), guest, and shared date/email rules; export for use in Server Actions and forms
- [x] T010 Configure NextAuth in `src/lib/auth.ts` (or `src/app/api/auth/[...nextauth]/route.ts`): Credentials provider, session strategy; validate against User (email + passwordHash); add NEXTAUTH_SECRET and NEXTAUTH_URL to env
- [x] T011 Add auth middleware or layout guard: protect all routes under `src/app/(admin)/` (redirect unauthenticated to login); allow public access to `src/app/[locale]/` and booking API
- [x] T012 [P] Setup i18n: next-intl (or chosen lib) with locale in path or cookie; add message files for Arabic and English under `src/lib/i18n/` or `messages/`; RTL support for `ar` in root layout
- [x] T013 Create seed script (e.g. `prisma/seed.ts`): at least one User (admin) with hashed password; optional sample Room and SiteSetting keys; register in `package.json` as `prisma db seed`

---

## Phase 3: User Story 2 — Admin login and dashboard shell (Priority: P1)

**Goal**: Admin can log in and reach a protected dashboard. Login page and dashboard layout only; no booking/room management yet.

**Independent Test**: Visit `/admin/login`, sign in with seeded credentials, land on dashboard; open another tab to `/admin/bookings` without login → redirect to login; sign out and confirm redirect.

- [x] T014 [US2] Implement admin login page at `src/app/login/page.tsx`: form (email, password) with React Hook Form + Zod; call NextAuth signIn; on success redirect to dashboard; show localized error on invalid credentials
- [x] T015 [US2] Implement admin layout at `src/app/(admin)/layout.tsx`: auth check (redirect to `/admin/login` if unauthenticated); shell with sidebar/nav for Dashboard, Bookings, Rooms, Availability, Reports, Content; logout action
- [x] T016 [US2] Add dashboard home page at `src/app/(admin)/dashboard/page.tsx`: placeholder or simple welcome; links to Bookings, Rooms, Availability, Reports, Content (routes created in later phases)

---

## Phase 4: User Story 1 — Guest booking flow and dynamic public pages (Priority: P1) — MVP

**Goal**: Public site shows dynamic slider/carousel, rooms from DB, search results page, and a full booking form (full name, phone, guests, dates, room) with server-side availability check and confirmation. All copy/rooms from store; no hardcoded inventory.

**Independent Test**: Open public site, switch AR/EN, see slider and rooms from DB; use search/filters to get results; submit booking form with valid data and see confirmation; submit with unavailable dates and see clear error.

- [x] T017 [P] [US1] Add Server Action (or API) to fetch active rooms list in `src/app/api/rooms/route.ts` or Server Action in `src/lib/actions/rooms.ts`; return id, name, slug, capacity, rate for public use
- [x] T018 [P] [US1] Add Server Action to check room availability in `src/lib/actions/availability.ts`: input roomId, checkIn, checkOut; return boolean (no overlapping PENDING/CONFIRMED/CHECKED_IN bookings); reuse in booking creation
- [x] T019 [US1] Add Server Action to create booking in `src/lib/actions/bookings.ts`: validate input with Zod (guestName, guestEmail, guestPhone, roomId, checkIn, checkOut, totalGuests); create Guest + Booking; run availability check before create; return success with id/reference or localized error (e.g. room unavailable)
- [x] T020 [US1] Implement public room list page at `src/app/[locale]/rooms/page.tsx`: fetch rooms from Server Action or API; display in a table or grid (adapt pattern from existing `src/Components/Rooms` or `src/Components2/Rooms`); show name, capacity, rate; link to book
- [x] T021 [US1] Implement dynamic slider/carousel on home at `src/app/[locale]/page.tsx` (or `src/components/public/HeroCarousel.tsx`): load slides/content from SiteSetting or dedicated table (e.g. hero_slides); adapt UI from existing `src/Components5/HeroSection/HeroSection.jsx` (Keen Slider or shadcn Carousel); support AR/EN content
- [x] T022 [US1] Implement dynamic "Rooms and Suites" section: reuse room list from T017; component under `src/components/public/RoomsSection.tsx` or inside `src/app/[locale]/page.tsx`; data from DB only
- [x] T023 [US1] Implement search results page at `src/app/[locale]/rooms/search/page.tsx` (or `src/app/[locale]/find-room/page.tsx`): accept query params (dates, guests, etc.); fetch rooms and filter by availability/capacity; display results (adapt pattern from `src/Pages/InnerPage/FindRoom.jsx`)
- [x] T024 [US1] Implement booking form at `src/app/[locale]/book/page.tsx` (or inside room detail): full name, email, phone, check-in, check-out, room choice, total guests; React Hook Form + Zod; on submit call create-booking Server Action; show availability error or success message with reference; adapt fields from `src/Components4/CheckingForm/CheckingForm.jsx` and `src/Pages/InnerPage/FindRoom.jsx`
- [x] T025 [US1] Add confirmation UI after successful booking: success message and optional reference number; same page or redirect to `src/app/[locale]/book/confirmation/page.tsx` with query/state

---

## Phase 5: User Story 3 — Admin rooms CRUD (Priority: P2)

**Goal**: Admin can create, read, update, and delete (or disable) rooms. Changes reflect on public site.

**Independent Test**: Log in as admin, open Rooms, add a room, edit it, then disable or delete (per business rule); confirm public room list updates.

- [x] T026 [P] [US3] Add Server Actions for rooms in `src/lib/actions/admin-rooms.ts`: createRoom, updateRoom, deleteOrDisableRoom (soft disable preferred); validate with Zod; ensure only active rooms appear on public
- [x] T027 [US3] Implement admin rooms list at `src/app/(admin)/rooms/page.tsx`: table (shadcn Table) with columns id, name, slug, capacity, rate, isActive, actions (edit, disable/delete)
- [x] T028 [US3] Implement admin room create/edit form at `src/app/(admin)/rooms/new/page.tsx` and `src/app/(admin)/rooms/[id]/edit/page.tsx`: fields name, slug, capacity, rate, isActive; React Hook Form + Zod; call createRoom/updateRoom
- [x] T029 [US3] Implement delete or soft-disable in rooms list or detail: confirm dialog then call deleteOrDisableRoom; handle “has future bookings” with clear message if applicable

---

## Phase 6: User Story 4 — Admin bookings, availability view, reports (Priority: P2)

**Goal**: Admin sees all bookings in a clear table with “contacted customer” info; can filter/search and update status; can check room availability by date; sees simple reports (total bookings this month, 3 months, year).

**Independent Test**: Create a booking from public form; in admin open Bookings, see it with “contacted” column; mark as contacted and update status; open Availability, pick room and date range and see available/not; open Reports and see counts for month/3mo/year.

- [x] T030 [P] [US4] Add Server Actions in `src/lib/actions/admin-bookings.ts`: listBookings (with filters status, dateFrom, dateTo, guestSearch), updateBookingStatus, markBookingContacted (set contactedAt or contactedByAdmin)
- [x] T031 [US4] Implement admin bookings list at `src/app/(admin)/bookings/page.tsx`: table with columns guest name, email, phone, room, check-in, check-out, status, “contacted” (yes/no or date); filters for status, date range, guest search; actions to update status and mark contacted
- [x] T032 [US4] Implement admin room availability view at `src/app/(admin)/availability/page.tsx`: select room and date range; call availability logic (reuse from T018) or new Server Action; display “Available” or “Not available” with clear UX
- [x] T033 [US4] Add Server Action or API in `src/lib/actions/admin-reports.ts`: getBookingCounts(period: 'month' | '3months' | 'year'); return counts for current month, last 3 months, current year
- [x] T034 [US4] Implement admin reports page at `src/app/(admin)/reports/page.tsx`: display total bookings this month, 3 months, and year (cards or simple table); data from T033

---

## Phase 7: User Story 5 — Dynamic content: About, Contact, slider (Priority: P3)

**Goal**: About and Contact pages are editable in admin (CRUD); content comes from DB. Slider/carousel content is admin-managed. Public About and Contact render from stored content.

**Independent Test**: In admin edit About and Contact content (and hero/slider keys); save; open public About and Contact (and home slider) and confirm content and language.

- [x] T035 [P] [US5] Add Server Actions in `src/lib/actions/site-content.ts`: getSiteSetting(key, locale?), setSiteSetting(key, value, locale?); used for hero, about, contact, and any keyed content
- [x] T036 [US5] Implement admin content/settings UI at `src/app/(admin)/content/page.tsx`: list of keys (e.g. hero_title, hero_subtitle, about_text, contact_email, contact_phone); edit form per key with locale (ar/en); save via setSiteSetting
- [ ] T037 [US5] Implement public About page at `src/app/[locale]/about/page.tsx`: load content by key (e.g. about_* or single about body) and locale; render dynamically; adapt layout from `src/Pages/InnerPage/About.jsx`
- [ ] T038 [US5] Implement public Contact page at `src/app/[locale]/contact/page.tsx`: load contact email, phone, address (and any other keys) from SiteSetting by locale; render dynamically; adapt layout from `src/Pages/InnerPage/Contact.jsx`
- [ ] T039 [US5] Ensure home slider/carousel (T021) uses content from SiteSetting or admin-managed slides so admin can change slides/copy without code change

---

## Phase 8: Polish & Cross-Cutting

**Purpose**: Security, validation, and quality across all stories.

- [ ] T040 Add rate limiting or lockout for admin login (e.g. after N failed attempts) in NextAuth config or middleware in `src/app/(admin)/login/` or `src/middleware.ts`
- [ ] T041 Ensure all forms (booking, admin rooms, admin content) use Zod validation on server and show localized error messages (AR/EN)
- [ ] T042 Run quickstart flow from `specs/001-hotel-booking-admin/quickstart.md`: env, migrate, seed, run app; verify login, one booking, and admin list
- [ ] T043 [P] Add `.env.example` with DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, NEXTAUTH_URL and short comments; ensure no secrets in repo

---

## Dependencies & Execution Order

### Phase order

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3 (US2 – Login)**: Depends on Phase 2; can start first (no dependency on US1).
- **Phase 4 (US1 – Public + booking)**: Depends on Phase 2; can run in parallel with Phase 3 if desired.
- **Phase 5 (US3 – Rooms CRUD)**: Depends on Phase 2 and preferably Phase 3 (admin shell).
- **Phase 6 (US4 – Bookings, availability, reports)**: Depends on Phase 2 and Phase 3; uses Booking/Room data.
- **Phase 7 (US5 – Dynamic content)**: Depends on Phase 2 and Phase 3; can follow US1 for public About/Contact.
- **Phase 8 (Polish)**: After all story phases.

### User story completion order

- **US2 (P1)** first: login + dashboard shell so admin routes exist.
- **US1 (P1)** in parallel or right after: public site and booking (MVP).
- **US3 (P2)** then **US4 (P2)**: rooms then bookings/availability/reports.
- **US5 (P3)** last: dynamic About, Contact, slider content.

### Within each story

- Server Actions / API before pages that call them.
- List/detail pages before forms where order matters.

### Parallel opportunities

- T003, T004, T005 (Setup) can run in parallel.
- T008, T009, T012 (Foundational libs) can run in parallel after schema.
- T017, T018 (US1 data/availability) can run in parallel.
- T026 (US3 actions), T030 (US4 actions), T035 (US5 actions) are parallelizable with other story tasks in different files.

---

## Parallel Example: User Story 1

```text
# Data layer for US1 (parallel):
T017: Server Action/API for rooms list in src/lib/actions/rooms.ts or src/app/api/rooms/route.ts
T018: Server Action for availability in src/lib/actions/availability.ts

# Then sequential:
T019: Create booking action → T024: Booking form page → T025: Confirmation
T020: Rooms page; T021: Slider; T022: Rooms section; T023: Search results
```

---

## Implementation Strategy

### MVP first (minimal shippable)

1. Phase 1: Setup  
2. Phase 2: Foundational  
3. Phase 3: US2 (admin login + dashboard shell)  
4. Phase 4: US1 (public rooms, booking form, availability check, confirmation)  
5. Stop and validate: guest can book; admin can log in and see dashboard.  
6. Then add US3 (rooms CRUD), US4 (bookings table, contacted, availability view, reports), US5 (About/Contact/slider CRUD).

### Incremental delivery

- After Setup + Foundational: deploy with login and empty dashboard.  
- After US1: deploy public booking flow (MVP).  
- After US3: deploy room management.  
- After US4: deploy full admin bookings and reports.  
- After US5: deploy dynamic About, Contact, and slider.

### Task count summary

| Phase              | Task IDs   | Count |
|--------------------|------------|-------|
| Phase 1 Setup     | T001–T005   | 5     |
| Phase 2 Foundational | T006–T013 | 8     |
| Phase 3 US2       | T014–T016   | 3     |
| Phase 4 US1       | T017–T025   | 9     |
| Phase 5 US3       | T026–T029   | 4     |
| Phase 6 US4       | T030–T034   | 5     |
| Phase 7 US5       | T035–T039   | 5     |
| Phase 8 Polish    | T040–T043   | 4     |
| **Total**          |             | **43** |

**Suggested MVP scope**: Phases 1–4 (Setup + Foundational + US2 + US1) = 25 tasks.  
**Format**: All tasks use `- [ ] Txxx [P?] [US?] Description with file path` and are traceable to user stories or foundation.
