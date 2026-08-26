# Go Idioms Skill

## Zero Values

Every type has a zero value — use it intentionally:

```go
var s string        // "" — zero value is usable
var n int           // 0
var p *int          // nil
var m map[string]int // nil — but can be read from
var ch chan int     // nil — blocks forever
var sl []int        // nil — len and append work on nil slices
```

**Pattern**: Initialize with zero value and only set non-default fields:

```go
type Config struct {
    Host    string
    Port    int
    Timeout time.Duration
}

// Default: Host="", Port=0, Timeout=0
// Just set what differs
cfg := Config{Port: 8080} // Host="", Timeout=0
```

## Comma-Ok Idiom

Use for map access, type assertions, and channel receives:

```go
// Map access
if val, ok := m[key]; ok {
    // val exists
}

// Type assertion
if user, ok := i.(User); ok {
    // i is User
}

// Channel receive (closed channel check)
select {
case val, ok := <-ch:
    if !ok {
        // channel closed
    }
}
```

## Interface Satisfaction

Interfaces are satisfied implicitly — no `implements` keyword:

```go
type Writer interface {
    Write(p []byte) (n int, err error)
}

// *os.File satisfies Writer automatically
// *bytes.Buffer satisfies Writer automatically

// Compile-time check (optional but recommended)
var _ Writer = (*MyWriter)(nil)
```

### Small Interfaces

- Prefer 1-3 method interfaces
- Famous examples: `io.Reader`, `io.Writer`, `io.Closer`, `fmt.Stringer`
- "The bigger the interface, the weaker the abstraction."

## Errors Are Values

```go
// ✅ Idiomatic — handle errors inline
if err := doSomething(); err != nil {
    return fmt.Errorf("doing something: %w", err)
}

// ✅ Sentinel errors
var ErrNotFound = errors.New("not found")

if errors.Is(err, ErrNotFound) { ... }

// ✅ Custom error types
type ValidationError struct {
    Field string
    Value any
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation failed: %s = %v", e.Field, e.Value)
}

var ve *ValidationError
if errors.As(err, &ve) { ... }
```

## Defer Patterns

```go
// ✅ Resource cleanup
f, err := os.Open(filename)
if err != nil {
    return err
}
defer f.Close()

// ✅ Mutex unlock
mu.Lock()
defer mu.Unlock()

// ✅ Timing
defer func(start time.Time) {
    log.Printf("took %v", time.Since(start))
}(time.Now())
```

## Goroutine Lifecycle

```go
// ❌ Bad — goroutine leak
go func() {
    for {
        select {
        case msg := <-ch:
            process(msg)
        }
    }
}()

// ✅ Good — cancellable goroutine
ctx, cancel := context.WithCancel(context.Background())
defer cancel()

go func() {
    for {
        select {
        case msg, ok := <-ch:
            if !ok {
                return
            }
            process(msg)
        case <-ctx.Done():
            return
        }
    }
}()
```

## Channel Ownership

- **Producer** creates and closes the channel
- **Consumer** reads from it
- One producer, multiple consumers is fine
- Multiple producers need coordination (e.g., `sync.WaitGroup`)

```go
ch := make(chan int, 100)

// Producer
go func() {
    defer close(ch)
    for _, item := range items {
        ch <- item
    }
}()

// Consumer
for item := range ch {
    process(item)
}
```

## Context Propagation

```go
// Context is the first parameter in API boundaries
func FetchUser(ctx context.Context, id string) (*User, error) {
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()

    return db.GetUser(ctx, id)
}
```

## Table-Driven Tests

```go
func TestCalculateDiscount(t *testing.T) {
    tests := []struct {
        name     string
        price    int
        discount int
        cost     int
        want     int
        wantErr  bool
    }{
        {name: "standard discount", price: 10000, discount: 20, cost: 5000, want: 8000},
        {name: "floored at cost",   price: 10000, discount: 70, cost: 4000, want: 4000},
        {name: "invalid discount",  price: 10000, discount: 150, cost: 0, wantErr: true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := CalculateDiscount(tt.price, tt.discount, tt.cost)
            if tt.wantErr {
                assert.Error(t, err)
                return
            }
            assert.NoError(t, err)
            assert.Equal(t, tt.want, got)
        })
    }
}
```

## sync Package Patterns

```go
// Mutex — protect shared state
var mu sync.Mutex
mu.Lock()
sharedCounter++
mu.Unlock()

// RWMutex — multiple readers, exclusive writer
var mu sync.RWMutex
mu.RLock()  // multiple readers allowed
read()
mu.RUnlock()
mu.Lock()   // exclusive
write()
mu.Unlock()

// Once — lazy init
var once sync.Once
var instance *Singleton
once.Do(func() {
    instance = &Singleton{}
})

// WaitGroup — wait for goroutines
var wg sync.WaitGroup
for _, task := range tasks {
    wg.Add(1)
    go func(t Task) {
        defer wg.Done()
        t.Process()
    }(task)
}
wg.Wait()

// Pool — reuse allocated objects
var bufPool = sync.Pool{
    New: func() any {
        return new(bytes.Buffer)
    },
}
buf := bufPool.Get().(*bytes.Buffer)
buf.Reset()
defer bufPool.Put(buf)
```

## gofmt

- Always run `gofmt` (or `go fmt ./...`) — non-negotiable
- Use `gofmt -s` for simplifications
- IDE integration: format on save

## Avoid package init()

- `init()` makes testing harder — order is implicit and fragile
- Use explicit initialization functions instead
- Exception: registering drivers (`database/sql`)

```go
// ❌ Bad
func init() {
    db = connectDB()
}

// ✅ Good
func InitDB() error {
    db = connectDB()
    return nil
}
```

## Package Naming

- Short, lowercase, no underscores or mixedCase: `http`, `httputil`, `user`
- Reversible: `user` package exports `User`, `user.ByName()` not `user.User`
- Avoid generic names: `utils`, `common`, `helpers` — find a real name
- Single-file packages are fine for small utilities
