---
name: perf-check
description: Run Core Web Vitals checks — LCP fetchpriority, image dimensions, JS budget, lighthouse budgets
---

# perf-check

Enforce Web Vitals and perf budgets from Tasks 2 and 4.

## Checks

- Verify every \<img>\ has \width\/\height\, no \lazy\ on LCP, \etchpriority=high\ on hero
- Run \
  pm run build -w @app/web\ and check \dist\ JS total <220KB (\
  esource-summary:script:size\ 220000 in \lighthouserc.json\)
- Run vitest web \App.test\ — must pass LCP \etchpriority\ test
- Check \lighthouserc.json\ budgets (\categories:performance\ 0.9, \largest-contentful-paint\ 2500, \cumulative-layout-shift\ 0.1, \
  esource-summary:script:size\ 220000)

## Steps

1. **Image dimensions**
   - Grep \pps/web/src\ for \<img\ and \PerfImage\ — every instance must pass \width\ + \height\ (number) and \lt\, LCP instance must have \priority\ (maps to \etchPriority=\"high\"\ + \loading=\"eager\"\ + \decoding=\"async\"\).
   - Fail if any \<img>\ missing \width\/\height\ or hero uses \loading=\"lazy\"\.

2. **Build budget**
   - Run \
     pm run build -w @app/web\ (Vite 8 Rolldown) — verify \dist/\ emitted, \Heavy\ lazy-chunk split, and total JS \dist/assets/*.js\ <220KB.

3. **Vitest LCP test**
   - Run \
     pm run test -w @app/web\ — \src/App.test.tsx\ asserts hero \etchpriority=\"high\"\, \width\/\height\ truthy, \loading !== \"lazy\"\. Must pass.

4. **Lighthouse budgets**
   - Verify \lighthouserc.json\ \ci.assert.assertions\ contains \categories:performance warn 0.9\, \largest-contentful-paint error 2500\, \cumulative-layout-shift error 0.1\, \
     esource-summary:script:size error 220000\.

5. **RUM beacon**
   - Verify \pps/web/src/lib/web-vitals.ts\ calls \onCLS\/\onLCP\/\onINP\ and beacons to \/api/vitals\; \pps/api/src/routes/health.ts\ \POST /vitals\ validates \{name:string,value:number}\ via Zod passthrough.

## Pass criteria

- All images sized, LCP not lazy, hero \etchpriority=high\, build JS <220KB (or budget adjusted with justification), vitest LCP test PASS, lighthouse budgets present, \
  pm run lint --type-aware --type-check\ 0 errors.
