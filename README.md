# FinTrack

FinTrack is a personal-finance analytics project being migrated from a React/Vite and SQLite prototype to a typed Next.js and PostgreSQL application. The modern implementation lives in `apps/web`; the original application remains at the repository root as a working regression reference while feature parity is built.

## Why this repository is different

This project focuses on financial-domain modelling and reporting rather than ecommerce or AI workflows:

- Money is stored as integer cents, avoiding floating-point rounding in persistence and calculations.
- Every account, transaction and budget belongs to a user at the schema and query layers.
- PostgreSQL constraints enforce positive values, transaction direction, account type, monthly budget uniqueness and referential integrity.
- Dashboard calculations are isolated in typed domain functions with unit tests.
- Repository integration tests exercise real PostgreSQL queries in CI.
- The dashboard falls back to clearly labelled demo data when no database is configured; it never presents demo values as live account data.

## Modern stack

| Area | Technology |
| --- | --- |
| Application | Next.js App Router, React, strict TypeScript |
| Database | PostgreSQL 17 with versioned SQL migrations |
| Data access | Parameterised `pg` queries scoped by user id |
| Testing | Vitest unit and PostgreSQL integration tests |
| Delivery | Docker multi-stage build and GitHub Actions |

## Structure

```text
apps/web/
  db/migrations/       versioned PostgreSQL schema
  scripts/             migration and labelled demo-seed commands
  src/app/             Next.js pages and health endpoint
  src/lib/finance.ts   typed money and dashboard calculations
  src/lib/db/          connection and user-scoped repository queries

src/ and server/       original Vite/Express/SQLite application
```

## Run the Next.js application

Requires Node.js 22.12+.

```powershell
cd apps/web
npm.cmd ci
npm.cmd run dev
```

Open `http://localhost:3000`. With no `DATABASE_URL`, the page uses the labelled demo dataset.

### PostgreSQL-backed preview

```powershell
cd apps/web
Copy-Item .env.example .env.local
docker compose up -d --wait
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd run dev
```

The Compose database binds only to `127.0.0.1:5433` and stores its data in the `fintrack_postgres` volume. Normal `docker compose down` preserves that volume; do not add `-v` unless deleting local data is intentional.

## Verification

```powershell
cd apps/web
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
docker build -t fintrack-web .
```

GitHub Actions repeats those gates, applies the schema to PostgreSQL 17, runs the real repository contract test and builds the container without publishing it.

## Migration status

The modern branch currently delivers the read-only analytics foundation, database schema, repository layer, health check, test coverage, container and CI pipeline. The original application still contains authentication and transaction editing; those flows should be migrated and security-reviewed before the Next.js application replaces it. This status is documented deliberately rather than presenting an incomplete rewrite as production-ready.
