# Repository Guidelines

## Project Structure & Module Organization

- `app/` — Next.js App Router (route folders with `page.tsx`, `layout.tsx`, API under `app/api/**/route.ts`).
- `components/` — Reusable UI; React components in PascalCase (e.g., `Header.tsx`, `widgets/`).
- `lib/` — Shared utilities and server logic (e.g., `now-playing-server.ts`, `socket.ts`).
- `public/` — Static assets and data (e.g., `public/data/cc.json`).
- `tools/` — Dev scripts (e.g., `tools/ccombine.ts`).
- `server.ts` — Custom Next server + Socket.IO.
- Config: `next.config.ts`, `tailwind.config.ts`, `eslint.config.mjs`.

## Build, Test, and Development Commands

- Install deps: `bun install`
- Dev server: `bun run dev` (http://localhost:3000)
- Build production: `bun run build`
- Start production: `bun run start`
- Lint: `bun run lint`
- Docker (local): `docker compose up --build`
- Tooling example: `bunx tsx tools/ccombine.ts <new-cc.json> --base public/data/cc.json --out public/data/cc.json`

## Coding Style & Naming Conventions

- Language: TypeScript, React 19, Next.js 15 (App Router).
- Style: follow ESLint `next/core-web-vitals` + `next/typescript`; run `bun run lint` before PRs.
- Indentation: 2 spaces; include semicolons; prefer `const`/`let` over `var`.
- Naming: components in PascalCase (`MyWidget.tsx`); modules/utilities in kebab- or lowerCamel-case (`now-playing-server.ts`); routes use Next defaults (`page.tsx`, `route.ts`).
- Styling: Tailwind CSS; prefer utility classes over inline styles.

## Testing Guidelines

- No formal test suite yet. If adding tests, prefer:
  - Unit/components: Vitest + React Testing Library (`*.test.ts(x)` colocated or in `__tests__/`).
  - E2E: Playwright.
- Add a `test` script (e.g., `bun test`) and keep tests fast and deterministic.

## Commit & Pull Request Guidelines

- Commits: use concise, imperative messages with a conventional prefix: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`, `test:`. Example: `feat(now-playing): add Socket.IO auto-refresh`.
- PRs: include a clear description, linked issues, screenshots/GIFs for UI changes, and manual test steps. Ensure `lint` and `build` pass.

## Security & Configuration

- Use `.env.local` for secrets; do not commit keys. Required vars include `LASTFM_API_KEY`, `LISTENBRAINZ_TOKEN`.
- Default port `3000`. Production via Docker sets `NODE_ENV=production` and disables Next telemetry.

## Agent-Specific Notes

- Scope: this AGENTS.md applies to the repository root.
- Keep changes minimal, targeted, and consistent with existing patterns. Avoid broad refactors in feature PRs.
