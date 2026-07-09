# Gathered

Initial Next.js foundation for Gathered, built with TypeScript, Tailwind CSS, ESLint, Prettier, Bun, and Nix/direnv.

## Requirements

- [Bun](https://bun.sh/)
- [Nix](https://nixos.org/download.html)
- [direnv](https://direnv.net/) with the shell hook enabled

## Setup

```bash
direnv allow
dev-db init
bun install
bun run db:migrate
bun dev
```

Open `http://localhost:3000` to view the app.

When you `cd` into this directory, direnv loads the Nix development shell and `.env` values automatically.

## Database

Gathered uses PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/) for server-side persistence. The Nix dev shell provides `dev-db`, a local-only Postgres cluster manager that stores data under `.postgres` in this repo.

First-time database setup:

```bash
dev-db init
```

Add this local connection string to `.env`:

```bash
DATABASE_URL=postgres://localhost:54330/gathered
```

Then run migrations and start the app:

```bash
bun run db:migrate
bun dev
```

Optional seed data can be loaded for your Clerk user:

```bash
SEED_CLERK_USER_ID=... bun run db:seed
```

`dev-db` uses Postgres trust authentication only for this local development cluster.

You can verify the app can connect locally by visiting `http://localhost:3000/api/health/db` after the dev server is running.

Database code lives in `src/db` and imports `server-only` so the Postgres client cannot be bundled into client-side code. Schema changes should be made in `src/db/schema.ts`, then committed with generated migrations:

```bash
bun run db:generate
bun run db:migrate
```

## Authentication

Gathered uses [Clerk](https://clerk.com/) for authentication. Clerk is the pragmatic Sprint 1 choice because it provides hosted sign-in/session management for Next.js now, keeps us out of custom credential flows, and has a path for Expo/mobile support later.

Create a Clerk application, then add these values to `.env`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
SEED_CLERK_USER_ID=...
```

Authenticated routes currently live at `/recipes`, `/meal-plan`, `/grocery-list`, and `/settings`. Unauthenticated users are redirected to Clerk sign-in, and signed-in users can sign out from the app header.

## Scripts

- `bun dev` starts the local development server.
- `bun run build` creates a production build.
- `bun run start` serves the production build.
- `dev-db init` initializes and starts the repo-local Postgres cluster, creates the `gathered` database, and prints the local `DATABASE_URL`.
- `dev-db start` starts the local Postgres cluster.
- `dev-db stop` stops the local Postgres cluster.
- `dev-db status` shows local Postgres cluster status.
- `dev-db reset` removes the local cluster data and socket directories.
- `dev-db psql` opens `psql` for the `gathered` database.
- `bun run db:generate` generates Drizzle migrations from schema changes.
- `bun run db:migrate` applies Drizzle migrations to `DATABASE_URL`.
- `bun run db:reset` removes and reinitializes the local cluster, then applies migrations.
- `bun run db:seed` adds filler recipes for `SEED_CLERK_USER_ID` without duplicating existing seed recipe names.
- `bun run db:studio` opens Drizzle Studio for the configured database.
- `bun run lint` runs ESLint.
- `bun run test` runs the Vitest unit test suite.
- `bun run format` formats files with Prettier.
- `bun run format:check` checks formatting.
- `bun run typecheck` runs TypeScript without emitting files.

## Structure

- `src/app` contains App Router routes and global styles.
- `src/components` contains shared UI and layout components.
- `src/features` contains domain-oriented feature modules.
- `src/lib` contains shared utilities and constants.
