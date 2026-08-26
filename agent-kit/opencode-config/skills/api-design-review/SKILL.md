# API Design Review Skill

## RESTful Conventions

### Resource Naming
- **Plural nouns**: `/users`, `/orders`, `/products`
- **Nested for relations**: `/users/{id}/orders`, `/orders/{id}/items`
- **Not verbs**: `/getUsers` ❌ → `/users` ✅
- **Consistent casing**: `snake_case` or `camelCase`, not mixed
- **Version via header or prefix**: `/v1/users` or `Accept: application/vnd.api.v1+json`

### HTTP Methods

| Method | Action | Idempotent | Safe |
|--------|--------|------------|------|
| `GET` | Read | Yes | Yes |
| `POST` | Create | No | No |
| `PUT` | Full update / replace | Yes | No |
| `PATCH` | Partial update | No | No |
| `DELETE` | Remove | Yes | No |

### Status Codes

| Range | Meaning | Common Codes |
|-------|---------|--------------|
| 2xx | Success | `200 OK`, `201 Created`, `204 No Content` |
| 3xx | Redirection | `301 Moved`, `304 Not Modified` |
| 4xx | Client error | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable`, `429 Too Many` |
| 5xx | Server error | `500 Internal`, `502 Bad Gateway`, `503 Unavailable` |

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid field values",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address",
        "code": "INVALID_FORMAT"
      }
    ],
    "requestId": "req_abc123"
  }
}
```

### Pagination

```json
// Request
GET /users?page=2&per_page=25

// Response
{
  "data": [...],
  "meta": {
    "page": 2,
    "per_page": 25,
    "total": 1034,
    "total_pages": 42
  },
  "links": {
    "self": "/users?page=2&per_page=25",
    "first": "/users?page=1&per_page=25",
    "prev": "/users?page=1&per_page=25",
    "next": "/users?page=3&per_page=25",
    "last": "/users?page=42&per_page=25"
  }
}
```

For deep pagination, prefer **keyset/cursor pagination** over offset:

```json
GET /users?cursor=eyJpZCI6MTAwMH0&limit=25
```

## GraphQL Checklist

- [ ] Queries for reads, mutations for writes — no side effects in queries
- [ ] Pagination: use `Connection` type (Relay spec) or offset pagination consistently
- [ ] N+1 prevention: review resolvers for repeated fetches in lists — use DataLoader
- [ ] Field nullability: design carefully — nullable fields are easier to evolve
- [ ] Rate limiting on mutations, not just queries
- [ ] Complexity scoring for expensive queries

```graphql
type Query {
  users(first: Int, after: String): UserConnection
}

type UserConnection {
  edges: [UserEdge]
  pageInfo: PageInfo
  totalCount: Int
}

type UserEdge {
  cursor: String
  node: User
}
```

## API Versioning

| Strategy | Best For | Notes |
|----------|----------|-------|
| URL prefix (`/v1/`) | Simple, easy to route | Harder to maintain parallel versions |
| Header (`Accept: version=1`) | Clean URLs | Harder to discover, cache |
| Query param (`?v=1`) | Quick prototyping | Pollutes query space |
| Never version | Internal services | Keep backward-compatible |

## OpenAPI / Swagger Review Checklist

- [ ] Every operation has a `summary` and `description`
- [ ] All request bodies have a schema (not `{ }`)
- [ ] All responses include examples
- [ ] Error responses documented with their schema
- [ ] Auth scheme documented (Bearer, OAuth2, API key)
- [ ] Rate limiting documented in headers or description
- [ ] Deprecated operations marked with `deprecated: true`

## Security Review Checklist

- [ ] Authentication on every endpoint (except explicitly public)
- [ ] Authorization: user A cannot access user B's data
- [ ] Input validation on all fields — reject unexpected types
- [ ] Rate limiting on auth endpoints
- [ ] No secrets in URLs or response bodies
- [ ] CORS configured minimally (specific origins, not `*`)
