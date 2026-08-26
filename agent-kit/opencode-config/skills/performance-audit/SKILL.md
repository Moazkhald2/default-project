# Performance Audit Skill

## Principle
**Measure before and after.** Never optimize without profiling first. Your intuition about bottlenecks is usually wrong.

## Profiling Tools

### Web (Frontend)
- **Chrome DevTools Performance tab** — record runtime performance, identify long tasks
- **Lighthouse** — LCP, FID, CLS, TBT, SI scores
- **WebPageTest** — detailed waterfall, filmstrip, third-party impact
- **Bundle Analyzer** — `webpack-bundle-analyzer`, `vite-bundle-visualizer`

### Node.js
```bash
# CPU profiling
node --prof app.js
node --prof-process isolate-*.log > processed.txt

# Flame graphs
node --perf-basic-prof app.js

# Heap snapshots
node --expose-gc --inspect app.js
# Then use Chrome DevTools Memory tab
```

### Python
```bash
# cProfile
python -m cProfile -o output.prof my_script.py

# py-spy (sampling profiler, safe for production)
py-spy record -o flamegraph.svg --pid 12345
py-spy top --pid 12345

# memory_profiler
python -m memory_profiler my_script.py
```

### Go
```bash
# pprof
go test -bench=. -cpuprofile=cpu.prof
go tool pprof -http=:8080 cpu.prof

# Runtime tracing
go test -trace=trace.out
go tool trace trace.out
```

### Databases
```sql
-- PostgreSQL
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT ...;

-- MySQL
EXPLAIN ANALYZE SELECT ...;

-- SQLite
EXPLAIN QUERY PLAN SELECT ...;
```

## What to Look For

### Frontend
- **Large bundles** — Check for duplicated dependencies, moment.js locale bloat, polyfill overuse
- **Render blocking** — CSS/JS in `<head>`, unused CSS, render-blocking third-party scripts
- **Layout thrashing** — Forced reflows from reading then writing DOM in alternation
- **Image optimization** — Missing dimensions, no lazy loading, wrong format (AVIF/WebP)
- **Excessive re-renders** — React: `React.memo`, `useMemo`, `useCallback`; Vue: `computed`

### Backend
- **N+1 queries** — ORM lazy loading in loops; use `SELECT..IN` or eager loading
- **Inefficient pagination** — `OFFSET` pagination degrades with page depth; use keyset pagination
- **Missing indexes** — Sequential scans on large tables
- **Cache miss ratio** — Check cache hit rates; tune TTLs and eviction policies
- **Connection pool exhaustion** — Too few connections or long-running queries holding connections
- **Serialization overhead** — JSON serialization of large payloads; consider streaming

### Memory
- **Memory leaks** — Growing heap over time; detached DOM nodes; global caches without eviction
- **Object retention** — Closures holding references to large objects; event listeners not cleaned up
- **Buffer bloat** — Reading entire files into memory instead of streaming

## Caching Strategies

| Pattern | Use Case | Implementation |
|---------|----------|----------------|
| Cache-aside | Read-heavy, moderate write | App checks cache, falls back to DB |
| Write-through | Write-heavy, consistency | Write to cache first, then DB |
| Write-behind | High throughput | Write to cache, async write to DB |
| CDN | Static assets, images | CDN edge caching with cache-control |
| Browser cache | Static assets | `Cache-Control` + `ETag` headers |
| Stale-while-revalidate | Slightly stale OK | Serve stale, refresh in background |

## Performance Budget

Set explicit budgets and enforce them in CI:

| Metric | Budget |
|--------|--------|
| Total bundle size | < 200 KB (gzip) |
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| API response time (p95) | < 200ms |
| DB query time (p95) | < 50ms |

## Workflow

1. **Identify** — What's slow? User reports? Monitoring alerts?
2. **Hypothesis** — What do you think is the bottleneck?
3. **Profile** — Measure with appropriate tool
4. **Analyze** — Compare hypothesis vs reality
5. **Optimize** — Apply the smallest effective change
6. **Re-profile** — Verify improvement
7. **Ship or revert** — If no improvement, revert and re-hypothesize
