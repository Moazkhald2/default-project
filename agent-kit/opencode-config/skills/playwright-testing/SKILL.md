# End-to-End Testing with Playwright

Use for Playwright E2E testing. Triggers: "playwright", "e2e playwright", "browser test", "playwright test".

## Setup

```bash
npm init playwright@latest
npx playwright install
```

## Basic Test

```ts
import { test, expect } from "@playwright/test"

test("homepage loads", async ({ page }) => {
  await page.goto("https://example.com")
  await expect(page).toHaveTitle(/Example/)
  await expect(page.locator("h1")).toContainText("Example")
})
```

## Locators (use accessible ones)

```ts
// Best: role + name
page.getByRole("button", { name: /submit/i })
page.getByRole("link", { name: /pricing/i })
page.getByRole("textbox", { name: /email/i })

// Also good
page.getByLabelText(/password/i)
page.getByPlaceholderText("Enter your name")
page.getByText("Welcome back")
page.getByTestId("user-profile")  // last resort
```

## Actions

```ts
await page.goto("/login")
await page.getByLabel("Email").fill("user@example.com")
await page.getByLabel("Password").fill("secret123")
await page.getByRole("button", { name: /log in/i }).click()
await page.waitForURL("/dashboard")
```

## Assertions

```ts
await expect(page).toHaveURL(/\/dashboard/)
await expect(page.getByText("Success")).toBeVisible()
await expect(page.getByRole("alert")).toContainText("Error")
await expect(page.locator("ul > li")).toHaveCount(3)
await expect(page.locator("input")).toBeDisabled()
await expect(page.locator("#chart")).toBeAttached()
```

## Network Interception

```ts
// Mock an API response
await page.route("**/api/users", async route => {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify([{ id: 1, name: "Mock User" }]),
  })
})

// Wait for a specific request
const [response] = await Promise.all([
  page.waitForResponse(resp => resp.url().includes("/api/submit")),
  page.getByRole("button").click(),
])
expect(response.status()).toBe(201)
```

## Visual Comparisons

```ts
test("screenshot comparison", async ({ page }) => {
  await page.goto("/profile")
  await expect(page).toHaveScreenshot("profile.png", {
    maxDiffPixels: 100,
    threshold: 0.2,
  })
})
```

## Mobile Emulation

```ts
// playwright.config.ts
const config = {
  projects: [
    {
      name: "Mobile Safari",
      use: {
        ...devices["iPhone 13"],
      },
    },
  ],
}

// In test: emulate geolocation
await context.setGeolocation({ latitude: 48.8566, longitude: 2.3522 })
await page.goto("/restaurants")
```

## Authentication Flows

```ts
// Store auth state once
test("authenticate", async ({ page }) => {
  await page.goto("/login")
  await page.getByLabel("Email").fill("test@example.com")
  await page.getByLabel("Password").fill("password")
  await page.getByRole("button").click()
  await page.context().storageState({ path: "auth.json" })
})

// Reuse in other tests
test.use({ storageState: "auth.json" })
test("dashboard loads", async ({ page }) => {
  await page.goto("/dashboard")
  await expect(page.getByText("Welcome")).toBeVisible()
})
```

## Browser Contexts

```ts
test("multi-user chat", async ({ browser }) => {
  const ctx1 = await browser.newContext()
  const ctx2 = await browser.newContext()
  const page1 = await ctx1.newPage()
  const page2 = await ctx2.newPage()
  // simulate two users
})
```

## CI Integration

```yaml
# .github/workflows/playwright.yml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
- run: npx playwright install --with-deps
- run: npx playwright test
- uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: playwright-report
    path: playwright-report/
```

## Configuration

```ts
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 2,
  workers: 4,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
})
```

| Feature | Pattern |
|---|---|
| Tracing | `trace: "on-first-retry"` |
| Video | `video: "retain-on-failure"` |
| Reuse auth | `storageState` |
| Parallel | `fullyParallel: true` |
| Retry flaky | `retries: 2` |
