# Performance Rules

## General
- Profile before optimizing — measure, don't guess
- Avoid premature optimization
- Use lazy loading for heavy dependencies
- Cache expensive computations

## Database
- Use indexes on queried columns
- Avoid N+1 queries — batch where possible
- Use connection pooling
- Set appropriate timeouts

## Frontend
- Code-split large bundles
- Lazy-load routes and components
- Optimize images (compress, use modern formats)
- Minimize re-renders
