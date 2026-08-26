# Architecture Decision Log Skill

## ADR Format

```markdown
# ADR-NNN: Title

## Status

[Proposed | Accepted | Deprecated | Superseded by ADR-NNN]

## Context

What is the problem we're solving? What constraints do we have?
What factors influenced this decision? Include relevant background.

## Decision

What did we decide? Be specific — include details that matter.

## Consequences

What trade-offs did we accept? What does this enable or prevent?

### Positive
- Benefit 1
- Benefit 2

### Negative
- Drawback 1
- Drawback 2

### Neutral
- Something to monitor

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Option A | Strong fit for X | Weak on Y |
| Option B | Good for Y | Complicated |

## References

- Related ADRs: ADR-001, ADR-005
- External links: RFC, blog posts, docs
```

## When to Write an ADR

Write an ADR when the decision is:

| Decision Type | ADR Needed? | Example |
|---------------|-------------|---------|
| Tech stack choice | ✅ Yes | "Use PostgreSQL over MySQL" |
| Architecture pattern | ✅ Yes | "Event-driven vs request-response" |
| Library selection | ✅ Yes | "Use httpx over requests" |
| API design | ✅ If significant | "REST vs GraphQL" |
| Database schema | ✅ If foundational | "Multi-tenant: separate DB vs row-level" |
| Refactoring strategy | ✅ If risky | "Strangler fig vs big bang" |
| Coding style | ❌ No — use style guide | "Spaces vs tabs" |
| Minor library version | ❌ No — use package manager | "Pin requests to 2.31" |
| Bug fix approach | ❌ No — a commit message suffices | "How to fix null pointer" |

### Rule of thumb
If someone will ask "why did we do this?" in 3 months and the answer isn't obvious from the code, write an ADR.

## Lightweight vs Detailed

### Lightweight (3-5 sentences)

```markdown
# ADR-012: Use httpx over requests for async support

## Status
Accepted

## Context
We need to make HTTP calls in async context (FastAPI endpoints).
The `requests` library doesn't support async natively.

## Decision
Use `httpx` which has both sync and async APIs with identical interfaces.

## Consequences
One fewer sync/async mismatch; httpx has slightly different streaming API.
```

### Detailed

Full format with Context, Decision, Consequences, Options Considered, References.

## Linking ADRs to Code

- **ADR file**: `docs/adr/NNN-title.md`
- **In code comments**:
  ```python
  # ADR-012: Using httpx for async support
  import httpx
  ```
- **In commit messages**:
  ```
  feat(api): add external payment gateway integration
  
  Implements ADR-015 — using Stripe for payment processing.
  ```
- **In PR descriptions**:
  ```
  ## References
  - ADR-015: Payment provider selection
  ```

## ADR Status Lifecycle

```
Proposed → Accepted → Deprecated
                  ↓
            Superseded by ADR-NNN
```

1. **Proposed** — Suggestion under review
2. **Accepted** — Decision made and implemented
3. **Deprecated** — No longer relevant but not replaced
4. **Superseded** — Replaced by a newer ADR (link to it)

## Tools

| Tool | Description |
|------|-------------|
| adr-tools | CLI: `adr new "Title"`, `adr list`, `adr link` |
| log4brains | Web UI + CLI, markdown-based |
| GitHub Pages | Publish ADRs as a static site |
| MKDocs | Combine ADRs with other docs |
| Plain markdown | In repo under `docs/adr/` — simplest, works everywhere |

## Keeping ADRs Current

- **Include in PR review checklist**: "Does this change contradict any ADRs?"
- **Annual review**: Check all ADRs still reflect reality
- **Supersede, don't delete**: Keep history of decisions
- **Template enforcement**: Use a CI check that new ADRs match the format
