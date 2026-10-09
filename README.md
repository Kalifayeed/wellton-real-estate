# Wellton Real Estate

A production-grade, full-stack real-estate platform for **Wellton Real Estate** — a Nairobi-based
company helping clients buy, sell, rent and manage residential and commercial property.

The system implements the full funnel:
**Property Discovery → Interest → Inquiry → Lead → Agent → Viewing → Application/Negotiation → Closing**

It is not a brochure site. It is a real application with a data layer, authentication, role-based
authorization, dashboards, forms, business logic and workflows.

---

## Tech stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **Tailwind CSS 3.4** — custom premium design system
- **Prisma 5** + **PostgreSQL**
- **Custom JWT session auth** (`jose` + `bcryptjs`) with `httpOnly` cookies
- **zod** validation, **Server Actions** for mutations
- Local file storage for media + private document storage with an authenticated serving route

---

## Getting started

### 1. Database

The app expects a PostgreSQL database. A Docker container named `scholarrescue-db` was already
running on port `5432`. An isolated database + user were created for Wellton:

```sql
CREATE ROLE wellton_user LOGIN PASSWORD 'wellton_secret';
CREATE DATABASE wellton OWNER wellton_user;
```

`DATABASE_URL` in `.env` points to it:
`postgresql://wellton_user:wellton_secret@localhost:5432/wellton?schema=public`

### 2. Install & configure

```bash
npm install
cp .env.example .env   # already present; adjust values as needed
```

Generate the Prisma client and run the schema + seed:

```bash
npx prisma generate
npx prisma db push     # sync Prisma schema to the database
npx prisma db seed     # demo data (users, locations, amenities, properties, posts)
```

### 3. Run

```bash
npm run dev            # development
# or
npm run build && npm start   # production
```

Visit `http://localhost:3000`.

### Demo staff accounts

| Role   | Email              | Password      |
|--------|--------------------|---------------|
| Admin  | `admin@wellton.com`  | `Wellton@2026` |
| Manager| `manager@wellton.com`| `Wellton@2026` |
| Agent  | `agent@wellton.com`  | `Wellton@2026` |

---

## Features

### Public website
- **Home** — hero + property search, featured categories, featured sale/rental listings, Why Wellton, service CTAs, WhatsApp.
- **Buy / Rent / Properties** — real search with filters (purpose, location, type, beds, baths, price, furnishing, status), sorting, URL query-state persistence, empty/loading states.
- **Property detail** — gallery, key facts, description, amenities, rental terms, map, virtual tour, media, JSON-LD structured data, inquiry form, WhatsApp, online rental application.
- **Find a Property** / **Find a Rental** — detailed lead-capture forms.
- **Sell Your Property** / **Property Management** — owner & landlord submission flows.
- **Diaspora Buyers** — conversion-focused page for international clients.
- **Property Insights** — blog (list + detail).
- **About / Contact** — company positioning + contact form + map.

Every important interaction creates a **lead** in the internal dashboard and records an analytics event.

### Admin dashboard (`/admin` — Admin/Manager)
- **Dashboard** — operational stats (properties, leads, viewings, applications, submissions).
- **Properties** — create/edit/delete, media uploads, publish/unpublish, feature, status control.
- **Leads (CRM)** — list, detail, activity timeline, assign to agent, status, notes & follow-ups.
- **Viewings** — schedule, assign agent, update status.
- **Rental Applications** — statuses, secure document access.
- **Owner Submissions** — review and update workflow status (`SUBMITTED → … → LISTED`).
- **Insights** — blog CRUD, publish, SEO metadata.
- **Users** — create accounts, roles, active/disable.

### Agent workspace (`/agent` — Agent, also visible to Admin/Manager)
- **My Leads** — leads assigned to the agent.
- **My Viewings / Applications** — manage flow.

---

## Roles & authorization

Authorization is enforced **server-side** (middleware + server actions), **not** by hiding UI.

| Capability                      | Admin | Manager | Agent |
|--------------------------------|:-----:|:-------:|:-----:|
| Admin & site content           | ✅    | —       | —     |
| Create/edit properties         | ✅    | ✅      | —     |
| Delete properties              | ✅    | —       | —     |
| Assign/reassign leads          | ✅    | ✅      | —     |
| Update lead status / notes     | ✅    | ✅      | ✅ (own) |
| Manage viewings & applications | ✅    | ✅      | ✅ (own/assigned) |
| Access `/admin`                | ✅    | ✅      | redirected to `/agent` |
| Access `/agent`                | ✅    | ✅      | ✅ |

---

## Security

- JWT sessions in `httpOnly` cookies; secret from `AUTH_SECRET`.
- Middleware guards `/admin` and `/agent`.
- Server actions re-verify roles before mutating.
- zod validation + honeypot spam protection on public forms.
- Private application documents are stored outside `public/` and served only through
  `/api/documents/[id]` with an auth check (returns `401` unauth).
- SQL injection protected by Prisma (parameterised queries); secrets never exposed to the client.
- `robots.txt` disallows `/admin`, `/agent`, `/login`, `/api/`.

---

## Deployment

For the live **welltonproperties.co.ke** site, follow [DEPLOYMENT.md](DEPLOYMENT.md)
for Vercel, Supabase, production credentials, database migrations and DNS.
The Docker examples below are for local/self-hosted development and contain
development credentials; do not expose them as a production deployment.

### A. Run the production build (simple)

```bash
npm run build && npm start     # serves on http://localhost:3000
```

Static assets in `public/` (including `wellton-logo.svg` / `wellton-mark.svg`) are served directly.

### B. Docker (self-hosted)

The repo includes a production `Dockerfile` (Next.js `standalone` output) and a `docker-compose.yml`
(app + PostgreSQL).

The app container expects the database to be ready and its schema applied:

```bash
# 1. (Dev only) seed the database the app connects to
#    (set DATABASE_URL to the DB the container will reach)
docker compose up -d db
# 2. Apply the schema + demo data (from the host, against the compose DB)
DATABASE_URL="postgresql://wellton_user:wellton_secret@localhost:5432/wellton?schema=public" \
  npx prisma db push && npx prisma db seed
# 3. Build & run the app
docker compose up --build -d
```

`DATABASE_URL` inside the compose app service points at the `db` service
(`postgresql://wellton_user:wellton_secret@db:5432/wellton?schema=public`).

> The sitemap is built best-effort so a container image build never fails if the
> database is unreachable at build time.

### Environment variables for production

Provide real values (never commit `.env`):

- `DATABASE_URL`
- `AUTH_SECRET` — generate with `openssl rand -base64 32`
- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_ADDRESS`

---


---

## Architecture notes

- `src/app` — App Router pages (public + `/admin` + `/agent`).
- `src/components` — UI, layout, property, forms, admin shell.
- `src/actions` — server actions (public leads, submissions, admin mutations).
- `src/lib` — auth, config, constants, format, analytics, storage, validation, audit, prisma client.
- `prisma/schema.prisma` — data model with a Phase-2-friendly design (commission, revenue,
  lease management, rent collection, tenant/landlord accounts, land sales, developer projects
  can be introduced without restructuring).
- Placeholder contact details live in `src/lib/config.ts` — replace with real business info.
- Demo property images are local SVG placeholders under `public/uploads/properties/`.

---

## Phase 2 (designed for, not yet built)

Commission tracking, rental revenue tracking, management fees, landlord payments, lease management,
rent collection, maintenance requests, tenant accounts, client accounts, land sales, developer
projects, short-term rentals, full CRM, automated WhatsApp/email, Facebook lead forms, WhatsApp
Business API, mobile apps, valuation requests, landlord dashboards.

