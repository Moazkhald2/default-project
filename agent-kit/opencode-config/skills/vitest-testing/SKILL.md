# Vitest Testing Patterns

Use for Vitest-specific testing. Triggers: "vitest", "vite test", "vitest testing", "migrate jest to vitest".

## Configuration

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test-setup.ts",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      thresholds: {
        lines: 80,
        branches: 75,
      },
    },
    // Thread pool
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
    // Retry flaky tests
    retry: 2,
  },
})
```

## Environment Presets

```ts
// @vitest/env-jsdom — browser-like (default)
// @vitest/env-happy-dom — faster, less complete
// @vitest/env-edge-runtime — edge workers

// Per file override:
// @vitest-environment happy-dom
```

## In-Source Testing

```ts
// src/math.ts
export function add(a: number, b: number) {
  return a + b
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest
  test("add", () => {
    expect(add(2, 3)).toBe(5)
  })
}
```

```ts
// vitest.config.ts
defineConfig({
  test: {
    includeSource: ["src/**/*.ts"],
  },
})
```

## Mocking

```ts
import { vi } from "vitest"

// Mock module
vi.mock("../db", () => ({
  query: vi.fn(),
}))

// Spy
const spy = vi.spyOn(localStorage, "getItem")
spy.mockReturnValue("cached-data")

// Timers
vi.useFakeTimers()
vi.advanceTimersByTime(1000)
vi.useRealTimers()

// Dynamic mock
vi.mock("../config", async (importOriginal) => {
  const mod = await importOriginal()
  return { ...mod, SECRET: "mock-value" }
})
```

## Benchmark Mode

```ts
// src/sort.bench.ts
import { bench, describe } from "vitest"

describe("sort", () => {
  const arr = Array.from({ length: 1000 }, () => Math.random())

  bench("native sort", () => {
    arr.slice().sort((a, b) => a - b)
  })

  bench("quick sort", () => {
    quickSort(arr.slice())
  })
})
// npx vitest bench
```

## UI Mode

```bash
npx vitest --ui
```

Opens a browser UI with test tree, filtering, re-running, coverage overlay.

## Workspaces

```ts
// vitest.workspace.ts
export default [
  {
    test: {
      name: "unit",
      include: ["packages/*/src/**/*.test.ts"],
    },
  },
  {
    test: {
      name: "integration",
      environment: "node",
      include: ["packages/*/test/integration/**/*.test.ts"],
      setupFiles: ["./test-integration-setup.ts"],
    },
  },
]
```

## Migration from Jest

| Jest | Vitest |
|---|---|
| `jest.fn()` | `vi.fn()` |
| `jest.mock()` | `vi.mock()` |
| `jest.spyOn()` | `vi.spyOn()` |
| `jest.useFakeTimers()` | `vi.useFakeTimers()` |
| `it.each` | `it.each` (same) |
| `@jest-environment jsdom` | `// @vitest-environment jsdom` |
| `jest.config.js` | `vitest.config.ts` |
| Requires Babel | Uses esbuild (10-20x faster) |

```bash
# Quick migration
npx vitest init
# Or: npx @vitest/plugin-migrate
```

## Key Features Summary

| Feature | How |
|---|---|
| HMR | Tests re-run on file change automatically |
| esbuild | Native TS/JSX transform, no Babel needed |
| Thread pool | Parallel test execution via worker threads |
| Coverage | `c8` (native) or `istanbul` for more features |
| Snapshot | Same as Jest API, stored per test file |
| Environment | `jsdom`, `happy-dom`, `node`, or custom |
| Retry | `retry: N` in config |
| Global API | `globals: true` to skip imports |
