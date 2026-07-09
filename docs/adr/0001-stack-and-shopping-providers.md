# ADR 0001: Stack and shopping-provider direction

## Status

Accepted

## Date

2026-07-09

## Context

Gathered is currently a TypeScript web app with Next.js App Router, React,
Tailwind CSS, Clerk authentication, PostgreSQL, and Drizzle ORM. The
authenticated app already includes `/recipes`, `/pantry`, `/grocery-list`, and
`/settings`.

Sprint 1 also needs a conservative shopping-provider direction. Research in
`docs/shopping-provider-flow.md` found that Target and Amazon should be treated
as destination retailer sites for the MVP. Gathered should remain the source of
truth for meal plans, pantry context, shopping-list rows, provider assignment,
and user review.

## Decision

Use Next.js App Router with React, TypeScript, and Tailwind CSS for the web app.
Use PostgreSQL for persistence, Drizzle ORM for schema and query access, and
Clerk for authentication.

Next.js and React are the right default for Sprint 1 because the app already has
server-rendered authenticated routes, server actions, route handlers, and a
large ecosystem for auth, database, and deployment paths. SvelteKit would be a
reasonable alternative for a smaller UI surface and lower component ceremony,
but choosing it now would require replacing the existing scaffold and auth/data
patterns without a clear product benefit.

For mobile, keep domain logic in feature modules and avoid binding shopping,
recipe, pantry, and provider behavior directly to web-only components. A future
mobile app can reuse API contracts, database schema, auth identity, and shared
TypeScript domain code, with Expo/React Native as the most direct migration path
from the React stack. If mobile becomes the primary surface, web routes should
move toward thinner orchestration around shared service modules.

Use PostgreSQL because the product needs relational user-owned data for recipes,
ingredients, pantry items, grocery-list rows, provider assignments, and future
shopping metadata. Drizzle keeps the schema explicit in TypeScript, supports
migrations, and fits the current server-only database access pattern.

For shopping providers:

- Grocery ingredients default toward Target when supported.
- Household and other non-grocery rows default toward Amazon when supported.
- Ambiguous rows require user review.
- Unsupported rows remain manual checklist rows.
- MVP shopping behavior is provider/product/search/affiliate links where
  officially supported, followed by checkout on the retailer site.
- Do not assume direct cart creation, cart mutation, retailer account OAuth, or
  automated checkout for Target or Amazon.

## Consequences

The web app can continue shipping quickly on the current Next.js foundation, and
new server-only modules can protect secrets from client bundles. The tradeoff is
that future mobile work will need deliberate extraction of reusable domain
logic, API boundaries, and presentation-independent types.

PostgreSQL plus Drizzle gives Gathered durable relational modeling without a
large ORM runtime, but schema changes must include generated migrations and
local database validation.

The provider strategy keeps Sprint 1 compliant with known Target and Amazon
constraints. It avoids private APIs, scraping, browser automation, and false
claims about cart access. The tradeoff is that search links can produce weaker
matches, retailer availability can drift, affiliate behavior requires program
approval and disclosure, and deeper product search depends on future official
API or partner access.
