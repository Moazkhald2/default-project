# SQL Injection Detection & Prevention

Use for SQL injection review and remediation. Triggers: "sql injection", "sqli", "parameterized query", "prepared statement", "orm injection".

## Dangerous Patterns by Language

### Node.js (TypeScript/JavaScript)

```javascript
// BAD — string concatenation
const query = `SELECT * FROM users WHERE email = '${email}'`

// BAD — template literals with raw input
connection.query(`UPDATE users SET name = "${name}" WHERE id = ${id}`)

// GOOD — parameterized (mysql2, pg, better-sqlite3)
connection.execute("SELECT * FROM users WHERE email = ?", [email])

// GOOD — named params (pg)
client.query("SELECT * FROM users WHERE email = $1", [email])
```

### Python

```python
# BAD — f-string / % formatting
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")
cursor.execute("SELECT * FROM users WHERE email = '%s'" % email)

# GOOD — parameterized (psycopg2, sqlite3, mysql-connector)
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))

# BAD — Django raw with format
User.objects.raw(f"SELECT * FROM users WHERE email = '{email}'")

# GOOD — Django with params
User.objects.raw("SELECT * FROM users WHERE email = %s", [email])

# GOOD — Django ORM (safe by default)
User.objects.filter(email=email)
```

### Go

```go
// BAD — fmt.Sprintf
query := fmt.Sprintf("SELECT * FROM users WHERE email = '%s'", email)
db.Query(query)

// GOOD — parameterized
db.Query("SELECT * FROM users WHERE email = $1", email)
db.Exec("UPDATE users SET name = $1 WHERE id = $2", name, id)
```

### Java

```java
// BAD — Statement
Statement stmt = connection.createStatement();
ResultSet rs = stmt.executeQuery("SELECT * FROM users WHERE email = '" + email + "'");

// GOOD — PreparedStatement
PreparedStatement stmt = connection.prepareStatement(
    "SELECT * FROM users WHERE email = ?"
);
stmt.setString(1, email);
ResultSet rs = stmt.executeQuery();

// GOOD — JPA (safe by default)
@Query("SELECT u FROM User u WHERE u.email = :email")
User findByEmail(@Param("email") String email);
```

## ORM Safety

Most ORMs are safe by default for standard queries but can be vulnerable:

```python
# SQLAlchemy — SAFE
session.query(User).filter(User.email == email).all()

# SQLAlchemy — text() with params is safe
session.execute(text("SELECT * FROM users WHERE email = :email"), {"email": email})

# SQLAlchemy — text() WITH string concat is NOT safe
session.execute(text(f"SELECT * FROM users WHERE email = '{email}'"))

# Prisma — SAFE
prisma.user.findMany({ where: { email } })

# Sequelize — SAFE (parameterized)
User.findAll({ where: { email } })

# Sequelize — DANGEROUS (raw attribute)
User.findAll({ where: sequelize.literal(`email = '${email}'`) })
```

## Input Sanitization (Defense in Depth)

```python
# Sanitize before it reaches the database layer
import re

def sanitize_identifier(name: str) -> str:
    """Only allow alphanumeric and underscore for column/table names"""
    if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', name):
        raise ValueError(f"Invalid identifier: {name}")
    return name

# Sanitize ORDER BY / sort direction (can't be parameterized)
ALLOWED_SORT = {"asc", "desc"}
direction = "asc" if user_input in ALLOWED_SORT else "asc"
```

## Stored Procedure Risks

```sql
-- BAD — dynamic SQL inside procedure
CREATE PROCEDURE get_user(IN email VARCHAR(255))
BEGIN
    SET @sql = CONCAT('SELECT * FROM users WHERE email = ''', email, '''');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
END

-- GOOD — parameterized procedure
CREATE PROCEDURE get_user(IN email VARCHAR(255))
BEGIN
    SELECT * FROM users WHERE email = email;
END
```

## NoSQL Injection

```javascript
// MongoDB — BAD: $where with user input
db.users.find({ $where: `this.email === '${email}'` })

// MongoDB — OK: direct field match
db.users.find({ email: email })

// MongoDB — BAD: regex injection
db.users.find({ email: { $regex: userInput } })

// MongoDB — SAFE with regex
const escaped = userInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
db.users.find({ email: { $regex: escaped, $options: 'i' } })
```

## Detection Checklist

- [ ] All SQL queries use parameterized statements or prepared statements
- [ ] No string concatenation or interpolation in query strings
- [ ] Dynamic ORDER BY / LIMIT / OFFSET validated against allowlist
- [ ] ORM raw queries use parameter binding
- [ ] Stored procedures don't use dynamic SQL
- [ ] NoSQL $where / $regex sanitized
- [ ] Input type validation before DB layer (string, int, UUID)
- [ ] Database user has least-privilege permissions

## Testing for SQLi

```bash
# Automated scanning
sqlmap -u "https://example.com/api/users?id=1" --batch

# Manual payloads
# ' OR '1'='1
# " OR 1=1 --
# 1; DROP TABLE users --
# admin' --
# admin'/*

# Boolean-based
# ?id=1 AND 1=1  → same as ?id=1
# ?id=1 AND 1=2  → different response

# Time-based (MySQL)
# ?id=1 AND SLEEP(5)
```

## Framework Protections

| Framework | Built-in Protection | Gotcha |
|---|---|---|
| Django ORM | Parameterized by default | `.extra()`, `.raw()` need params |
| SQLAlchemy | Parameterized by default | `text()` with f-strings |
| Prisma | Parameterized by default | `$queryRawUnsafe` needs params |
| Sequelize | Parameterized by default | `sequelize.literal()` is raw |
| Spring JDBC | `JdbcTemplate` param | `Statement` class is not safe |
| Entity Framework | LINQ is safe | `FromSqlRaw` needs params |
| Go `database/sql` | All parameterized | `fmt.Sprintf` in queries |
| Rails ActiveRecord | Parameterized by default | `find_by_sql` needs params |

## Remediation Priority

1. Find all raw SQL → rewrite with parameterized
2. For ORMs: audit all `.raw()`, `.extra()`, `$queryRaw`, `FromSqlRaw` calls
3. Dynamic identifiers → allowlist validation
4. Add WAF rule blocking `' OR 1=1`, `UNION SELECT`, `--` patterns
5. Database user: `SELECT` only, no `DROP`/`ALTER`
