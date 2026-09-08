---
name: perf-check
description: Run Core Web Vitals checks — LCP fetchpriority, image dimensions, JS budget, lighthouse budgets
---

# perf-check

Enforce Web Vitals and perf budgets from Tasks 2 and 4.

## Checks

- Verify every `<img>` has `width`/`height`, no `lazy` on LCP, `fetchpriority=high` on hero
- Run `npm run build -w @app/web` and check `dist` JS total <520KB (`resource-summary:script:size` 520000 in `lighthouserc.json`)
- Run vitest web `App.test` — must pass LCP `fetchpriority` test
- Check `lighthouserc.json` budgets (`categories:performance` 0.9, `largest-contentful-paint` 2500, `cumulative-layout-shift` 0.1, `resource-summary:script:size` 520000)

## Steps

1. **Image dimensions**
   - Grep `apps/web/src` for `<img` and `PerfImage` — every instance must pass `width` + `height` (number) and `alt`, LCP instance must have `priority` (maps to `fetchPriority="high"` + `loading="eager"` + `decoding="async"`).
   - Fail if any `<img>` missing `width`/`height` or hero uses `loading="lazy"`.

2. **Build budget**
   - Run `npm run build -w @app/web` (Vite 8 Rolldown) — verify `dist/` emitted, `Heavy` lazy-chunk split, and total JS `dist/assets/*.js` <520KB.

3. **Vitest LCP test**
   - Run `npm run test -w @app/web` — `src/App.test.tsx` asserts hero `fetchpriority="high"`, `width`/`height` truthy, `loading !== "lazy"`. Must pass.

4. **Lighthouse budgets**
   - Verify `lighthouserc.json` `ci.assert.assertions` contains `categories:performance warn 0.9`, `largest-contentful-paint error 2500`, `cumulative-layout-shift error 0.1`, `resource-summary:script:size error 520000`.

5. **RUM beacon**
   - Verify `apps/web/src/lib/web-vitals.ts` calls `onCLS`/`onLCP`/`onINP` and beacons to `/api/vitals`; `apps/api/src/routes/health.ts` `POST /vitals` validates `{name:string,value:number}` (accepts `application/json` and `text/plain` sendBeacon legacy).

## Pass criteria

- All images sized, LCP not lazy, hero `fetchpriority=high`, build JS <520KB (or budget adjusted with justification), vitest LCP test PASS, lighthouse budgets present, `npm run lint` 0 errors.
