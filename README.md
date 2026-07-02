# Gathered

Initial Next.js foundation for Gathered, built with TypeScript, Tailwind CSS, ESLint, Prettier, Bun, and Nix/direnv.

## Requirements

- [Bun](https://bun.sh/)
- [Nix](https://nixos.org/download.html)
- [direnv](https://direnv.net/) with the shell hook enabled

## Setup

```bash
direnv allow
bun install
bun dev
```

Open `http://localhost:3000` to view the app.

When you `cd` into this directory, direnv loads the Nix development shell and `.env` values automatically.

## Scripts

- `bun dev` starts the local development server.
- `bun run build` creates a production build.
- `bun run start` serves the production build.
- `bun run lint` runs ESLint.
- `bun run format` formats files with Prettier.
- `bun run format:check` checks formatting.
- `bun run typecheck` runs TypeScript without emitting files.

## Structure

- `src/app` contains App Router routes and global styles.
- `src/components` contains shared UI and layout components.
- `src/features` contains domain-oriented feature modules.
- `src/lib` contains shared utilities and constants.
