# Writing Efficient Dockerfiles

Use for Dockerfile creation and optimization. Triggers: "dockerfile", "docker build", "docker image", "container build", "multi-stage".

## Base Image Selection

```dockerfile
# Prefer size: alpine < slim < distroless < full
FROM node:22-alpine        # ~120MB — good for most Node apps
FROM python:3.12-slim      # ~120MB — good for Python apps
FROM golang:1.22-alpine    # ~300MB — Go compiler included, multi-stage removes it
FROM alpine:3.19           # ~7MB — bare minimum
FROM gcr.io/distroless/base  # ~20MB — no shell, no package manager
FROM scratch                # ~0MB — static binaries only

# Avoid:
FROM node:latest           # ~1GB
FROM ubuntu:latest         # ~200MB with unnecessary packages
```

## Layer Caching Optimization

```dockerfile
# ORDER MATTERS — change less frequently first

# 1. System dependencies (rarely change)
FROM node:22-alpine AS base
RUN apk add --no-cache curl ca-certificates

# 2. Package manifest (only changes when deps change)
COPY package.json package-lock.json ./
RUN npm ci --only=production

# 3. Source code (changes most frequently)
COPY . .

# 4. Build step (if needed)
RUN npm run build
```

## Multi-Stage Builds

```dockerfile
# STAGE 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# STAGE 2: Production (small)
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
USER node
CMD ["node", "dist/server.js"]
```

### Go Example

```dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server .

FROM scratch
COPY --from=builder /app/server /server
EXPOSE 8080
CMD ["/server"]
```

### Python Example

```dockerfile
FROM python:3.12-slim AS builder
RUN pip install --user --no-cache-dirs poetry
COPY pyproject.toml poetry.lock ./
RUN python -m pip wheel --no-cache-dir --no-deps --wheel-dir /wheels -r <(poetry export -f requirements.txt)

FROM python:3.12-slim
COPY --from=builder /wheels /wheels
RUN pip install --no-cache /wheels/*
COPY . .
CMD ["python", "main.py"]
```

## RUN Layer Coalescing

```dockerfile
# BAD — three layers, each cached separately
RUN apt-get update
RUN apt-get install -y curl postgresql-client
RUN rm -rf /var/lib/apt/lists/*

# GOOD — single layer
RUN apt-get update && \
    apt-get install -y curl postgresql-client && \
    rm -rf /var/lib/apt/lists/*
```

## .dockerignore

```dockerignore
.git/
.gitignore
node_modules/
npm-debug.log
.env
.env.*
*.md
coverage/
test/
tests/
__pycache__/
*.pyc
.venv/
venv/
.idea/
.vscode/
*.log
dist/       # if building inside Docker
.dockerignore
```

## USER Directive (Security)

```dockerfile
# BAD — runs as root
FROM node:22-alpine
COPY . .
CMD ["node", "server.js"]

# GOOD — non-root user
FROM node:22-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --chown=appuser:appgroup . .
USER appuser
CMD ["node", "server.js"]

# Go — use nobody
FROM scratch
COPY --from=builder /server /server
USER 65534:65534  # nobody
CMD ["/server"]
```

## COPY vs ADD

```dockerfile
# COPY — preferred, explicit, no magic
COPY ./src ./src
COPY package.json .

# ADD — only use when:
ADD https://example.com/file.tar.gz /tmp/   # remote URL (rarely needed)
ADD archive.tar.gz /tmp/                    # auto-extract (explicit is better)
```

## Build Arguments

```dockerfile
ARG NODE_ENV=production
ARG APP_VERSION

RUN echo "Building version ${APP_VERSION}"

COPY . .
RUN if [ "$NODE_ENV" = "production" ]; then \
      npm run build; \
    fi
```

```bash
docker build \
  --build-arg NODE_ENV=production \
  --build-arg APP_VERSION=1.2.3 \
  -t myapp .
```

## ENTRYPOINT vs CMD

```dockerfile
# ENTRYPOINT — fixed, always runs
ENTRYPOINT ["node", "server.js"]

# CMD — default arguments (can be overridden)
CMD ["--port", "3000"]

# Together:
ENTRYPOINT ["node", "server.js"]
CMD ["--port", "3000"]
# docker run myapp --port 4000  # overrides CMD only

# Use EXEC form (not shell form):
ENTRYPOINT ["node", "server.js"]   # good — gets SIGTERM
ENTRYPOINT node server.js          # bad — runs via /bin/sh -c, no signals
```

## Optimization Checklist

| Technique | Benefit |
|---|---|
| Multi-stage builds | 10-100x smaller images |
| Alpine/slim base | 50-80% size reduction |
| Order COPY by change frequency | Max cache hits |
| Coalesce RUN commands | Fewer layers, faster build |
| `.dockerignore` | Smaller build context |
| `npm ci` over `npm install` | Deterministic, faster |
| `--no-cache-dir` pip | Smaller Python images |
| `CGO_ENABLED=0` | Static Go binaries |
| `USER` non-root | Security |
| Expose only needed ports | Surface area |

## Useful Patterns

```dockerfile
# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Labels
LABEL org.opencontainers.image.source="https://github.com/org/repo"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.description="My application"

# Timezone
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Clean package manager
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```
