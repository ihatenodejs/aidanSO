# Repository Guidelines

## Project Structure & Module Organization

- `app/` is the Next.js App Router. Route groups (`ai/`, `status/`, `device/`, `docs/`, etc.) bundle their own `page.tsx`, `layout.tsx`, and API handlers under `app/api/**/route.ts`.
- `components/` holds reusable React 19 UI, organized by domain (e.g., `components/device`, `components/navigation/footer`). Stick to PascalCase filenames.
- `lib/` centralizes configuration, shared services (e.g., `now-playing-server.ts`, `services/DeviceService`), themes, and utilities (`lib/utils.ts` exports the Tailwind-aware `cn` helper).
- Tests currently live alongside features (`app/ai/usage/__tests__`, `components/navigation/footer/__tests__`, `tools/__tests__`); copy that pattern for new coverage.
- `tools/` contains Bun-powered CLIs such as `best-practices.ts` and `sync-usage.ts`. `server.ts` bootstraps the custom Next + Socket.IO server with port fallback logic.
- Static assets and data live in `public/`, including `public/data/cc.json` consumed by the AI usage pages.

## Build, Test, and Development Commands

- `bun install` installs dependencies; prefer Bun 1.3+.
- `bun run dev` starts the custom server at http://localhost:3000 (auto-increments the port if occupied).
- `bun run lint` runs ESLint with the Next.js presets; fix errors before committing.
- `bun run typecheck` performs a no-emit TypeScript pass.
- `bun run test` executes the Bun test runner (current suites cover tooling, footer config, and AI usage schema).
- `bun run best-practices` runs the optional developer checklist from `tools/best-practices`.
- `bun run start` serves the production bundle using `NODE_ENV=production`.
- `bun run build` relies on Next.js Turbopack. In the agent sandbox it fails while binding helper processes, so request the user to run this command locally when a build is needed.
- `docker compose up --build` reproduces the production stack; ensure `.env` variables are present first.

## Coding Style & Naming Conventions

- TypeScript + Next.js 16 + React 19; use functional components and keep client hooks behind `'use client'` boundaries.
- Follow 2-space indentation, include semicolons, and favor `const`/`let` over `var`.
- Components use PascalCase; utilities use lowerCamelCase or kebab-case; Next route segments follow framework conventions.
- Tailwind CSS is the styling baseline. Compose utility classes via `cn()` or tokens from `lib/theme` instead of inline styles.
- Keep lint and formatting clean. `bun run format` applies Prettier (with Tailwind plugin) across the repo.

## Testing Guidelines

- Use the Bun test runner (`bun run test`). Existing suites target schema validation, footer config, and tooling; colocate new tests as `*.test.ts(x)` near the code or under `__tests__/`.
- Keep tests deterministic—mock network calls to services like ListenBrainz or GitHub.
- Document any additional test helpers or environment variables when adding coverage.

## Commit & Pull Request Guidelines

- Write Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, etc.) in the imperative and keep changes scoped.
- PRs need a clear summary, linked issues, manual test notes, and UI screenshots/GIFs when relevant. Mention any new scripts or configuration requirements.
- Before requesting review, run `bun run lint`, `bun run typecheck`, and `bun run test`; ask the user to execute `bun run build` locally if verification is required.

## Security & Configuration Tips

- Store secrets in `.env.local`; required entries include `LASTFM_API_KEY` and `LISTENBRAINZ_TOKEN`. Git-ignored credentials must never be committed.
- Default port is 3000. Docker workflows set `NODE_ENV=production` and disable Next telemetry automatically.
- Rotate tokens immediately if exposed and scrub them from commit history.

## Agent-Specific Notes

- Operate from the repository root and avoid broad refactors unless asked. Mirror existing module boundaries and naming schemes.
- Because sandboxed builds cannot bind helper ports, skip `bun run build` and coordinate with the user for production verification.
- Halt and confirm with the user if unexpected worktree changes appear or if network access is required for a task.
