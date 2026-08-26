# Docker Compose Configuration

Use for Docker Compose tasks. Triggers: "docker compose", "docker-compose.yml", "compose file", "docker compose stack".

## Basic Structure

```yaml
version: "3.9"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: myapp
      POSTGRES_PASSWORD: ${DB_PASSWORD}

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

## Service Definition

| Key | Purpose |
|---|---|
| `build` | Dockerfile path or build context |
| `image` | Pre-built image |
| `ports` | Host:container port mapping |
| `volumes` | Named/bind mount volumes |
| `environment` | Env vars (`.env` file support) |
| `env_file` | Path to `.env` file |
| `command` | Override CMD |
| `healthcheck` | Service health probe |
| `depends_on` | Startup ordering |
| `restart` | Restart policy (no, always, on-failure, unless-stopped) |

## Networks

```yaml
services:
  app:
    networks:
      - frontend
      - backend
  db:
    networks:
      - backend
  nginx:
    networks:
      - frontend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # no external access
```

## Volumes

```yaml
services:
  db:
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
      - type: bind
        source: ./backups
        target: /backups

volumes:
  pgdata:
    driver: local
```

## Health Checks

```yaml
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # depends_on with health check
  app:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
```

## Profiles

```yaml
services:
  app:
    image: myapp

  adminer:
    image: adminer
    profiles:
      - dev
      - debug

  mailhog:
    image: mailhog/mailhog
    profiles:
      - dev

# Start with profile: docker compose --profile dev up
# Without profile: adminer and mailhog won't start
```

## Multi-Stage Build in Compose

```yaml
services:
  app:
    build:
      context: .
      target: production      # use production stage
      args:
        NODE_ENV: production
    # ...

  app-dev:
    build:
      context: .
      target: development     # use dev stage with hot reload
    volumes:
      - ./src:/app/src:ro
    profiles:
      - dev
```

## Environment Variables

```yaml
# docker-compose.yml
services:
  app:
    environment:
      - DATABASE_URL=postgres://user:${DB_PASSWORD}@db:5432/myapp
      - REDIS_URL=${REDIS_URL:-redis://redis:6379}
    env_file:
      - .env
      - .env.${APP_ENV}  # conditional

# .env file (never committed)
DB_PASSWORD=secret123
REDIS_URL=redis://redis:6379

# Use variable substitution
# docker compose config  # shows resolved YAML
```

## Common Stacks

### Web + DB + Cache

```yaml
services:
  app:
    build: .
    depends_on:
      db: { condition: service_healthy }
      redis: { condition: service_started }

  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]

  redis:
    image: redis:7-alpine

  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    ports:
      - "80:80"
    depends_on:
      - app
```

### Python + Celery + RabbitMQ

```yaml
services:
  app:
    build: .
    command: python manage.py runserver 0.0.0.0:8000
    ports: ["8000:8000"]

  worker:
    build: .
    command: celery -A tasks worker --loglevel=info
    depends_on: [rabbitmq, db]

  beat:
    build: .
    command: celery -A tasks beat --loglevel=info
    depends_on: [rabbitmq, db]

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports: ["5672:5672", "15672:15672"]

  db:
    image: postgres:16-alpine
```

## Debugging Commands

```bash
# View config
docker compose config
docker compose config --services

# Logs
docker compose logs -f app
docker compose logs --tail=100 app

# Execute in container
docker compose exec app bash
docker compose run --rm app npm test

# Check resource usage
docker compose top
docker compose ps

# Build with no cache
docker compose build --no-cache app

# Restart specific service
docker compose restart app
```

## Production Considerations

- Remove `ports` for internal services (they communicate via network)
- Set `restart: unless-stopped` on critical services
- Use `deploy` section for resource limits (Docker Swarm)
- Never hardcode secrets — use env vars or Docker secrets
- Pin image versions (not `:latest`)
- Add health checks to all services
- Use `.env` + `.env.example` pattern

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 512M
        reservations:
          cpus: "0.25"
          memory: 256M
```
