# SQL Optimization Skill

## Principle
**Always measure before optimizing.** Use `EXPLAIN ANALYZE` to find actual bottlenecks. Your guess about which query is slow is probably wrong.

## Reading EXPLAIN ANALYZE

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id;
```

Key metrics to look for:
- **Seq Scan on large tables** — missing index
- **Nested Loop with large row counts** — wrong join strategy
- **Sort with high memory** — needs index for ORDER BY
- **Shared Hit Blocks** — how much is cached vs read from disk
- **Actual Time** vs **Estimated Time** — bad statistics

## Index Strategies

### B-Tree (default)
```sql
-- Single column
CREATE INDEX idx_users_email ON users(email);

-- Composite — column order matters!
-- Put equality conditions first, range conditions last
CREATE INDEX idx_users_status_created
ON users(status, created_at);
-- Best for: WHERE status = 'active' AND created_at > '2024-01-01'
```

### Partial Index
```sql
-- Only index active users (saves space, faster writes)
CREATE INDEX idx_active_users ON users(email)
WHERE status = 'active';
```

### Covering Index
```sql
-- Includes all columns needed by query — no table access needed
CREATE INDEX idx_users_email_covering
ON users(email) INCLUDE (name, avatar_url);
```

### GIN Index
```sql
-- Full-text search, arrays, JSONB
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_docs_content ON docs USING GIN(to_tsvector('english', content));
```

### GiST Index
```sql
-- Geographic, range, nearest-neighbor
CREATE INDEX idx_locations_coords ON locations USING GiST(coords);
```

## Query Planning

### Join Types

| Join Type | When Used |
|-----------|-----------|
| **Nested Loop** | Small inner table, good with indexes — fast for first few rows |
| **Hash Join** | Medium tables, no index needed — builds hash of one table |
| **Merge Join** | Both tables sorted on join key — good for large sorted datasets |

### Subquery vs CTE

```sql
-- CTE: materialized by default in PostgreSQL 12+, optimization fence removed
-- Use CTE for readability, recursive queries, or referencing the same subquery multiple times
WITH active_users AS (
    SELECT id, name FROM users WHERE status = 'active'
)
SELECT * FROM active_users;

-- Subquery: can be inlined and optimized with outer query
-- Often faster for simple cases
SELECT * FROM (
    SELECT id, name FROM users WHERE status = 'active'
) AS active_users;
```

### Window Functions

```sql
-- ✅ Efficient ranking without self-join
SELECT
    name,
    salary,
    RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) as dept_rank
FROM employees;

-- 🔴 Inefficient alternative (avoid)
SELECT e1.name, e1.salary, COUNT(*) as rank
FROM employees e1
JOIN employees e2 ON e1.dept_id = e2.dept_id AND e1.salary <= e2.salary
GROUP BY e1.id;
```

## Pagination

### Keyset Pagination (Recommended)

```sql
-- First page
SELECT id, name, created_at
FROM users
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- Next page (cursor: created_at = '2024-01-15', id = 42)
SELECT id, name, created_at
FROM users
WHERE (created_at, id) < ('2024-01-15', 42)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

### Offset Pagination (Avoid for deep pages)

```sql
-- 🔴 Gets slower as page number increases — scans all skipped rows
SELECT id, name
FROM users
ORDER BY id
OFFSET 100000 LIMIT 20;
```

## Anti-Patterns

### N+1 Queries

```sql
-- 🔴 BAD: Query in a loop
for user in users:
    db.query("SELECT * FROM orders WHERE user_id = ?", user.id)

-- ✅ GOOD: Single query
SELECT * FROM orders WHERE user_id IN (?, ?, ?, ...)
```

### SELECT *

```sql
-- 🔴 BAD: Pulling all columns
SELECT * FROM users;

-- ✅ GOOD: Only what you need
SELECT id, name, email FROM users;
```

### Implicit Type Casts

```sql
-- 🔴 BAD: varchar vs int comparison — full scan
SELECT * FROM users WHERE phone = 12345;

-- ✅ GOOD: Match types
SELECT * FROM users WHERE phone = '12345';
```

### Functions on Indexed Columns

```sql
-- 🔴 BAD: Function prevents index use
SELECT * FROM orders WHERE DATE(created_at) = '2024-01-01';

-- ✅ GOOD: Range scan uses index
SELECT * FROM orders
WHERE created_at >= '2024-01-01'
  AND created_at < '2024-01-02';
```

## RDBMS-Specific Features

| Feature | PostgreSQL | MySQL | SQLite |
|---------|-----------|-------|--------|
| Partial index | ✅ | ✅ (5.7+) | ✅ (3.8+) |
| Covering index | ✅ (INCLUDE) | ✅ (covering) | ❌ |
| GIN/GiST | ✅ | ❌ | ❌ |
| CTE | ✅ | ✅ (8.0+) | ✅ (3.8.3+) |
| Recursive CTE | ✅ | ✅ | ✅ |
| Window functions | ✅ | ✅ (8.0+) | ✅ (3.25+) |
| JSONB | ✅ | ✅ | ✅ |
| Full-text search | ✅ | ✅ | ✅ (FTS5) |
| BRIN index | ✅ | ❌ | ❌ |
