# JavaScript/TypeScript Testing with Jest/Vitest

Use for JS/TS testing tasks. Triggers: "jest", "vitest", "unit test js", "javascript test", "typescript test".

## Test Structure

```ts
describe("UserService", () => {
  beforeAll(() => { /* setup once */ })
  beforeEach(() => { /* setup each test */ })
  afterEach(() => { /* cleanup */ })
  afterAll(() => { /* teardown once */ })

  it("creates a user with valid data", async () => {
    const user = await UserService.create({ email: "a@b.com" })
    expect(user.email).toBe("a@b.com")
    expect(user.id).toBeDefined()
  })
})
```

## Mocking

### Manual mocks

```ts
// __mocks__/db.ts
export const query = jest.fn()
export const insert = jest.fn()
```

### jest.mock / vi.mock

```ts
jest.mock("../services/email")
// or with vitest:
vi.mock("../services/email")

import { sendEmail } from "../services/email"
// sendEmail is now a mock

sendEmail.mockResolvedValue({ sent: true })
sendEmail.mockRejectedValue(new Error("SMTP down"))
```

### Partial mocks

```ts
const spy = jest.spyOn(fs, "readFileSync").mockReturnValue("data")
```

### Module mock factory

```ts
vi.mock("../config", () => ({
  getConfig: vi.fn(() => ({ mode: "test" })),
}))
```

## Async Testing

```ts
it("resolves promise", async () => {
  await expect(asyncService()).resolves.toEqual({ ok: true })
})

it("rejects promise", async () => {
  await expect(badService()).rejects.toThrow("Invalid input")
})

it("handles multiple concurrent calls", async () => {
  const results = await Promise.all([fetch(1), fetch(2), fetch(3)])
  expect(results).toHaveLength(3)
})
```

## Snapshot Testing

```ts
it("renders correctly", () => {
  const tree = renderer.create(<Button label="Click" />).toJSON()
  expect(tree).toMatchSnapshot()
})

// Inline snapshot
expect(config).toMatchInlineSnapshot(`
  {
    "port": 3000,
  }
`)

// Update all snapshots: `jest --updateSnapshot` or `vitest -u`
```

## Timer Mocks

```ts
beforeEach(() => { jest.useFakeTimers() })
afterEach(() => { jest.useRealTimers() })

it("debounces input", () => {
  const handler = jest.fn()
  const debounced = debounce(handler, 300)
  debounced()
  debounced()
  jest.advanceTimersByTime(300)
  expect(handler).toHaveBeenCalledTimes(1)
})
```

## DOM Testing

```ts
it("handles click", () => {
  document.body.innerHTML = `<button id="btn">Click</button>`
  const btn = document.getElementById("btn")!
  btn.addEventListener("click", () => btn.textContent = "Clicked")
  btn.click()
  expect(btn.textContent).toBe("Clicked")
})
```

## Coverage Thresholds

```jsonc
// jest.config.json
{
  "coverageThreshold": {
    "global": {
      "lines": 80,
      "branches": 75,
      "functions": 80,
      "statements": 80
    },
    "./src/components/**/*.tsx": {
      "lines": 90
    }
  }
}
```

## Patterns

```ts
// Composable matchers
expect(result).toMatchObject({ user: { id: expect.any(Number) } })
expect(result).toStrictEqual(expected)
expect(array).toContainEqual({ id: 1 })
expect(fn).toHaveBeenCalledWith(expect.stringContaining("error"))

// Testing errors
it("throws on invalid input", () => {
  expect(() => validate(null)).toThrow("required")
})
```

| Pattern | Why |
|---|---|
| Mock at module level, not inside tests | Cleaner setup/teardown |
| Prefer `.resolves` / `.rejects` over try/catch | Less indentation |
| Use `describe.each` for param tables | Data-driven tests |
| Reset mocks in `beforeEach` | No leak between tests |
