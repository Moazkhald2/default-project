# Go Testing with the `testing` Package

Use for Go testing tasks. Triggers: "go test", "golang test", "go testing", "golang testing", "go benchmark".

## Test Functions

```go
func TestAdd(t *testing.T) {
    result := Add(2, 3)
    expected := 5
    if result != expected {
        t.Errorf("Add(2, 3) = %d; want %d", result, expected)
    }
}

// Fatal stops immediately, Error continues
func TestValidate(t *testing.T) {
    err := Validate("")
    if err == nil {
        t.Fatal("expected error for empty input")
    }
}
```

## Table-Driven Tests

```go
func TestDivide(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
        err      bool
    }{
        {name: "positive", a: 10, b: 2, expected: 5},
        {name: "by zero", a: 1, b: 0, err: true},
        {name: "negative", a: -6, b: 3, expected: -2},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result, err := Divide(tt.a, tt.b)
            if tt.err && err == nil {
                t.Error("expected error")
            }
            if !tt.err && result != tt.expected {
                t.Errorf("got %d, want %d", result, tt.expected)
            }
        })
    }
}
```

## Subtests

```go
func TestUserAPI(t *testing.T) {
    t.Run("create", func(t *testing.T) {
        // test creation
    })
    t.Run("get", func(t *testing.T) {
        // test retrieval
    })
    t.Run("delete/not-found", func(t *testing.T) {
        // test delete of non-existent
    })
}
```

## Benchmarking

```go
func BenchmarkSum(b *testing.B) {
    nums := []int{1, 2, 3, 4, 5}
    for i := 0; i < b.N; i++ {
        Sum(nums)
    }
}

// go test -bench=. -benchmem
// go test -bench=BenchmarkSum -benchtime=5x
// go test -bench=BenchmarkSum -count=5
```

## Fuzzing

```go
func FuzzParse(f *testing.F) {
    f.Add("valid-input")
    f.Add("")
    f.Add("   ")

    f.Fuzz(func(t *testing.T, input string) {
        result, err := Parse(input)
        if err == nil && result == "" {
            t.Errorf("Parse(%q) returned empty result without error", input)
        }
    })
}

// go test -fuzz=FuzzParse -fuzztime=30s
```

## Test Fixtures

```go
func setup(t *testing.T) (db *sql.DB, cleanup func()) {
    t.Helper() // marks as helper, not test
    db, err := sql.Open("sqlite3", ":memory:")
    if err != nil {
        t.Fatalf("setup failed: %v", err)
    }
    return db, func() { db.Close() }
}

func TestWithDB(t *testing.T) {
    db, cleanup := setup(t)
    defer cleanup()
    // use db
}

// TestMain for package-level setup
func TestMain(m *testing.M) {
    setupIntegrationEnv()
    code := m.Run()
    teardownIntegrationEnv()
    os.Exit(code)
}
```

## Coverage

```bash
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out  # browser report
go tool cover -func=coverage.out  # per-function %

# Only integration tests
go test -tags=integration -cover ./...
```

## HTTP Handler Testing (httptest)

```go
func TestHandler(t *testing.T) {
    handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, `{"status":"ok"}`)
    })

    req := httptest.NewRequest(http.MethodGet, "/health", nil)
    rec := httptest.NewRecorder()
    handler(rec, req)

    if rec.Code != http.StatusOK {
        t.Errorf("got %d, want %d", rec.Code, http.StatusOK)
    }
}

// Test with a full server
func TestServer(t *testing.T) {
    srv := httptest.NewServer(handlers.Register())
    defer srv.Close()

    resp, err := http.Get(srv.URL + "/api/users")
    // ...
}
```

## Temporary Files

```go
func TestFileProcessing(t *testing.T) {
    f, err := os.CreateTemp("", "test-*.txt")
    if err != nil {
        t.Fatal(err)
    }
    defer os.Remove(f.Name())

    f.WriteString("test data")
    f.Close()
    // process file
}
```

## Assertions Without Third-Party

```go
func assertEqual(t *testing.T, got, want interface{}) {
    t.Helper()
    if got != want {
        t.Errorf("got %v, want %v", got, want)
    }
}

func assertNoError(t *testing.T, err error) {
    t.Helper()
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
}
```

| Flag | Purpose |
|---|---|
| `-v` | Verbose output |
| `-run` | Regex filter: `-run TestUser` |
| `-count=1` | Disable caching |
| `-short` | Skip long tests: `if testing.Short() { t.Skip() }` |
| `-race` | Race detector |
| `-timeout 30s` | Test timeout |
