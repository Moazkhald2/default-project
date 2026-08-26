# CI/CD Pipeline Configuration

Use for CI/CD pipeline tasks. Triggers: "ci/cd", "github actions", "pipeline", "continuous integration", "deployment", "github workflow".

## GitHub Actions Structure

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
```

## Matrix Builds

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20, 22]
        exclude:
          - os: macos-latest
            node: 18
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm ci
      - run: npm test

  # Python example
  test-python:
    strategy:
      matrix:
        python-version: ["3.10", "3.11", "3.12"]
    steps:
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      - run: pip install -r requirements.txt
      - run: pytest
```

## Caching Dependencies

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: "npm"

# Python
- uses: actions/setup-python@v5
  with:
    python-version: "3.12"
    cache: "pip"

# Go
- uses: actions/setup-go@v5
  with:
    go-version: "1.22"
    cache: true

# Custom cache
- uses: actions/cache@v4
  with:
    path: |
      ~/.cargo/registry
      ~/.cargo/git
      target
    key: ${{ runner.os }}-cargo-${{ hashFiles('Cargo.lock') }}
    restore-keys: |
      ${{ runner.os }}-cargo-
```

## Conditionals

```yaml
steps:
  # Run only on push, not PR
  - name: Deploy
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'

  # Run on specific path changes
  - name: Backend Tests
    if: contains(github.event.pull_request.files.*.path, 'backend/')

  # Skip if not needed
  - name: Lint
    if: github.actor != 'dependabot[bot]'

  # Conditional on previous step
  - name: Publish
    if: steps.build.outputs.version != ''
```

## Environment Secrets

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          API_KEY: ${{ secrets.API_KEY }}
        run: ./deploy.sh

# Environment protection:
# Settings > Environments > production > Required reviewers
```

## Artifacts

```yaml
jobs:
  build:
    steps:
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 5

  deploy:
    needs: build
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
      - run: ./deploy.sh
```

## Complete CI Examples

### Node.js

```yaml
name: Node.js CI
on:
  push: { branches: [main] }
  pull_request: { branches: [main] }

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: "npm" }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: "npm" }
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v4

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm audit --audit-level=high
      - run: npx gitleaks detect

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with: { name: build, path: dist/ }
```

### Python

```yaml
name: Python CI
on:
  push: { branches: [main] }
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.10", "3.11", "3.12"]

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: testpass
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
          cache: "pip"
      - run: pip install -r requirements-dev.txt
      - run: ruff check .
      - run: pytest --cov --cov-report=xml
      - uses: codecov/codecov-action@v4
      - run: pip-audit
```

### Go

```yaml
name: Go CI
on:
  push: { branches: [main] }
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        go-version: ["1.21", "1.22"]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: ${{ matrix.go-version }}
          cache: true
      - run: go vet ./...
      - run: go test -race -coverprofile=coverage.out ./...
      - run: go tool cover -func=coverage.out
      - run: govulncheck ./...
```

## Deployment Environments

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - run: ./deploy.sh staging

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - run: ./deploy.sh production
```

## Approval Gates

```yaml
deploy-production:
  needs: [test, build]
  runs-on: ubuntu-latest
  environment:
    name: production
    # Settings → Environments → production → Add required reviewers
  steps:
    - run: ./deploy.sh
```

## Rollback Strategies

```yaml
# Blue/green deployment
jobs:
  deploy:
    steps:
      - name: Deploy to blue
        run: ./deploy.sh blue
      - name: Health check
        run: ./smoke-test.sh blue
      - name: Switch traffic
        run: ./switch-traffic.sh blue green
      - name: Drain green
        run: ./drain.sh green

# Canary
  deploy:
    steps:
      - name: Deploy 10% canary
        run: ./deploy-canary.sh 10
      - name: Monitor metrics
        run: ./monitor.sh --timeout 300s
      - name: Roll forward
        if: success()
        run: ./deploy-canary.sh 100
      - name: Roll back
        if: failure()
        run: ./rollback-canary.sh
```

## Workflow Tips

| Need | Solution |
|---|---|
| Skip CI for docs | `[skip ci]` in commit message |
| Manual trigger | `workflow_dispatch:` |
| Schedule | `schedule: [{ cron: "0 6 * * 1" }]` |
| Reusable workflow | `on: workflow_call` |
| Composite action | `actions/` directory with `action.yml` |
| Job outputs | `outputs: result: ${{ steps.test.outputs.result }}` |
| Cancel duplicates | `concurrency.cancel-in-progress: true` |
| Path filtering | `on.push.paths: ['src/**']` |
