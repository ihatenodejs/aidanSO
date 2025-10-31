# Before Next Commit

## Important

- [x] Upgrade to Next.js 16
- [x] Fix Turbopack in `server.ts`
- [x] Review hot reload setup
- [x] Add more ESLint rules (see [Next.js docs](https://nextjs.org))
- [x] Review doucmentation categories
- [x] Unscaled profile picture on footer
- [x] Blur behind mobile header menu

## Next Commit

- [x] Verify device info and clean up
- [x] Migrate from `tools/ccombine.ts` to `tools/sync-usage.ts` for agent-exporter integration

## To Evaluate

- [ ] Fix `components/layout/PageShell.tsx:30-38` to use static Tailwind class names (e.g., via a lookup map). The current `max-w-${maxWidth}` string is not statically analyzable, so Tailwind never generates those utilities and the max-width option is broken.

## Status Route Review

- [x] `lib/services/status.service.ts:78` — The service documentation promises a GET fallback when HEAD is unsupported, but the implementation never retries with GET. Any origin that rejects HEAD (common on CDNs) is marked down incorrectly.
- [x] `lib/services/status.service.ts:99` — Only HTTP 200 responses are treated as operational. Legitimate 2xx/3xx results (204 from health probes, 301/302 redirects, 304 from caches) are currently reported as outages.
- [x] `app/status/components/StatusPageClient.tsx:70` — Browser-side latency checks use `fetch(..., { mode: 'no-cors' })`, so every opaque response is assumed to succeed. Services returning HTTP errors still produce a responseTime, masking real failures client-side.
