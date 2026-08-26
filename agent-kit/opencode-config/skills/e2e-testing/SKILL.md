# End-to-End Testing Strategy

Use for E2E testing strategy and planning. Triggers: "e2e testing", "end-to-end", "integration testing", "test pyramid", "page object".

## Test Pyramid

```
       /\
      /E2E\         Few — critical user journeys
     /------\
    /Integra\       Some — API, DB, service boundaries
   /----------\
  /  Unit      \    Many — isolated logic, fast
 /--------------\
```

- **Unit**: 70%+ of tests, fast (ms), no I/O
- **Integration**: 20%, test boundaries (DB, HTTP, file system)
- **E2E**: 10%, critical paths only (login, checkout, signup)

## Choosing a Tool

| Tool | Best For | Trade-off |
|---|---|---|
| **Playwright** | Modern web, cross-browser | JS/TS only |
| **Cypress** | Component + E2E, debugging | Single tab, no iframes |
| **Selenium** | Legacy, language diversity | Slow, brittle |
| **Puppeteer** | Chrome-only automation | No cross-browser |

Default to **Playwright** for new projects (fastest, best DX, multi-browser).

## Page Object Model

```ts
class LoginPage {
  constructor(private page: Page) {}

  async go() {
    await this.page.goto("/login")
  }

  async login(email: string, password: string) {
    await this.page.getByLabel("Email").fill(email)
    await this.page.getByLabel("Password").fill(password)
    await this.page.getByRole("button", { name: /log in/i }).click()
  }

  async errorMessage() {
    return this.page.getByRole("alert")
  }
}

test("invalid login", async ({ page }) => {
  const login = new LoginPage(page)
  await login.go()
  await login.login("bad@email.com", "wrong")
  await expect(login.errorMessage()).toBeVisible()
})
```

## data-testid Attributes

```tsx
// Component
<button data-testid="submit-btn" onClick={handleSubmit}>
  Submit
</button>

// Test
page.getByTestId("submit-btn")
```

Use `data-testid` only when accessible queries can't work. Add them exclusively for testing — never for styling or JS hooks.

## Test Isolation

- Each test gets a fresh state (DB reset, cookies cleared)
- Use `beforeEach` to seed test data via API, not UI
- Clean up created resources in `afterEach`
- Never depend on test order

```ts
test.beforeEach(async ({ page, request }) => {
  await request.post("/api/test/reset")
  await request.post("/api/test/seed", {
    data: { users: [{ email: "test@e.com", role: "admin" }] },
  })
})
```

## Handling Flaky Tests

| Technique | How |
|---|---|
| Retries | `retries: 2` in config |
| Wait strategies | `waitForURL`, `waitForResponse`, `toHaveURL` |
| Auto-retrying assertions | `toBeVisible`, `toContainText` (retry built-in) |
| Trace viewer | Record traces on retry for debugging |
| Screenshots | Capture on failure for comparison |
| No fixed delays | Never `page.waitForTimeout(1000)` |

## Test Artifacts

```ts
// playwright.config.ts
use: {
  screenshot: "only-on-failure",
  video: "retain-on-failure",
  trace: "on-first-retry",
}
```

## CI Pipeline Integration

```yaml
jobs:
  e2e:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-results
          path: test-results/
```

## What to E2E Test

**Test:**
- Core user journeys (signup, login, checkout, payment)
- Cross-page workflows
- Third-party integration flows
- Mobile responsive behavior

**Don't test:**
- Everything (that's unit/integration's job)
- Static pages with no interaction
- Visual styling details (use snapshot tests separately)
- Browser-specific CSS bugs

## Naming Convention

```
tests/
├── auth/
│   ├── login.spec.ts
│   ├── signup.spec.ts
│   └── password-reset.spec.ts
├── checkout/
│   ├── add-to-cart.spec.ts
│   └── payment.spec.ts
├── fixtures/
│   └── test-data.ts
└── pages/
    ├── login.page.ts
    └── checkout.page.ts
```
