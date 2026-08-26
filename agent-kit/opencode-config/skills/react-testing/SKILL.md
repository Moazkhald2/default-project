# React Component Testing with Testing Library

Use for React component testing. Triggers: "react testing", "testing library", "component test", "react test", "rtl".

## Setup

```tsx
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  )
}
```

## Query Priority (use accessible queries first)

| Priority | Query | When |
|---|---|---|
| 1st | `getByRole` | Buttons, headings, links, inputs |
| 2nd | `getByLabelText` | Form fields |
| 3rd | `getByPlaceholderText` | When no label |
| 4th | `getByText` | Non-interactive elements |
| 5th | `getByTestId` | Last resort, use `data-testid` |

```tsx
// Do
screen.getByRole("button", { name: /submit/i })
screen.getByLabelText(/email/i)
screen.getByRole("heading", { level: 2 })

// Avoid
screen.getByTestId("submit-button")
```

## Async Behavior

```tsx
it("loads data on mount", async () => {
  render(<UserProfile userId={1} />)

  expect(screen.getByText(/loading/i)).toBeInTheDocument()

  const name = await screen.findByText("Alice")
  expect(name).toBeInTheDocument()

  // Wait for disappearance
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })
})
```

## userEvent (preferred over fireEvent)

```tsx
it("submits form", async () => {
  const user = userEvent.setup()
  render(<LoginForm />)

  await user.type(screen.getByLabelText(/email/i), "a@b.com")
  await user.type(screen.getByLabelText(/password/i), "secret123")
  await user.click(screen.getByRole("button", { name: /log in/i }))

  expect(await screen.findByText(/welcome/i)).toBeInTheDocument()
})
```

## Mocking Hooks

```tsx
// Mock a hook module
vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ user: { name: "Alice" }, logout: vi.fn() }),
}))

// Mock a context
const mockValue = { theme: "dark", toggle: vi.fn() }
vi.mock("../context/ThemeContext", () => ({
  useTheme: () => mockValue,
}))
```

## Testing Error Boundaries

```tsx
it("catches render error", () => {
  const Thrower = () => { throw new Error("crash") }
  render(
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Thrower />
    </ErrorBoundary>
  )
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
})
```

## Best Practices

- **Test behavior, not implementation** — don't test state or props directly
- **Use accessible queries** — `getByRole`, `getByLabelText`, `getByText`
- **One assertion per test** — or a logical group of related assertions
- **Don't test the library** — don't assert that `useState` works
- **Avoid `wrapper` patterns** — prefer `renderWithProviders` function
- **User-centric** — write tests as if you're using the app

## Common Queries

```tsx
screen.getByRole("textbox", { name: /email/i })      // input
screen.getByRole("combobox", { name: /country/i })   // select
screen.getByRole("checkbox", { name: /agree/i })     // checkbox
screen.getByRole("radio", { name: /option 1/i })     // radio
screen.getByRole("list")                              // ul/ol
screen.getByRole("listitem")                          // li
screen.getByRole("navigation")                        // nav
screen.getByDisplayValue("hello")                     // input value
```
