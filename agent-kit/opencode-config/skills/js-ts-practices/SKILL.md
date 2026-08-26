# JavaScript / TypeScript Best Practices Skill

## Strict TypeScript Config

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

- `strict: true` enables all strict checks — non-negotiable for new projects
- `noUncheckedIndexedAccess` catches undefined from object/dict access
- `exactOptionalPropertyTypes` prevents assigning `undefined` to optional properties

## Type Patterns

### Discriminated Unions

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function parseResult<T>(input: string): Result<T> {
  try {
    const value = JSON.parse(input) as T;
    return { ok: true, value };
  } catch (error) {
    return { ok: false, error: error as E };
  }
}

const result = parseResult<User>('{"name":"Alice"}');
if (result.ok) {
  console.log(result.value); // T — narrowed
} else {
  console.error(result.error); // E — narrowed
}
```

### Type Guards

```typescript
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj
  );
}
```

### Branded Types

```typescript
type Brand<T, B> = T & { __brand: B };
type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

function getUser(id: UserId): User { ... }
function getOrder(id: OrderId): Order { ... }

getUser(userId); // ✅ OK
getUser(orderId); // ❌ Type error
getUser("abc" as UserId); // ✅ Explicit cast
```

### Utility Types

```typescript
// Make selected fields required
type WithRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// Deep partial for nested updates
type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

// Non-nullable values from an object
type Values<T> = T[keyof T];

// Extract async return type
type AsyncReturnType<T extends (...args: any) => Promise<any>> = Awaited<ReturnType<T>>;
```

## Never Use `any`

```typescript
// ❌ Bad
function process(data: any) { ... }

// ✅ Good — unknown requires narrowing
function process(data: unknown) { ... }

// ✅ Good — specific type
function process(data: Record<string, string>) { ... }
```

## ES2024+ Features

```typescript
// Nullish coalescing — only replaces null/undefined
const name = input.name ?? 'default';

// Optional chaining
const city = user?.address?.city;

// Array.groupBy (ES2024)
const grouped = Map.groupBy(users, (u) => u.role);

// Promise.withResolvers (ES2024)
const { promise, resolve, reject } = Promise.withResolvers();

// Records & Tuples (Stage 2 — use with polyfill)
const record = #{ x: 1, y: 2 }; // Immutable object
```

## Async/Await Patterns

```typescript
// ✅ Good — explicit error handling
async function fetchData(): Promise<Result<User[]>> {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) return { ok: false, error: new Error(await response.text()) };
    const users = await response.json() as User[];
    return { ok: true, value: users };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}

// ✅ Concurrent fetches
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
]);
```

## Error Handling with Result Type

```typescript
// Instead of try/catch everywhere, use a Result type
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Wrap functions that can throw
function safe<T, E = Error>(fn: () => T): Result<T, E> {
  try {
    return { success: true, data: fn() };
  } catch (error) {
    return { success: false, error: error as E };
  }
}

const result = safe(() => JSON.parse(input));
if (!result.success) {
  return { ok: false, error: result.error };
}
// result.data is typed
```

## Prefer Functional Patterns

```typescript
// ✅ Good — pure functions
const add = (a: number, b: number): number => a + b;

// ✅ Good — immutability
const updated = { ...user, name: 'New Name' };
const filtered = items.filter((x) => x.active);

// ❌ Avoid — mutation
user.name = 'New Name';
```

## General JS/TS Rules

- **Prefer `const` over `let`** — rebinding is a code smell
- **No `var`** — use `const`/`let`
- **No `==`** — use `===` (except `x == null` which checks both null and undefined)
- **Default parameters over short-circuit**: `function f(x = 5)` not `x = x || 5`
- **Named exports over default exports** — better tree-shaking, easier refactoring
- **`ReadonlyArray<T>` over `T[]`** for function parameters that shouldn't be mutated
