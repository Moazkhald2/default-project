# OWASP Top 10 Vulnerability Review

Use for OWASP Top 10 review. Triggers: "owasp", "owasp top 10", "web vulnerability", "application security".

## A1: Broken Access Control

**What to look for:**
- Missing auth checks on API endpoints
- IDOR (Insecure Direct Object Reference): `/api/user/123` without verifying ownership
- Role/privilege escalation: regular user accessing admin endpoints
- CORS misconfiguration allowing cross-origin reads
- JWT not verified on protected routes

**Fix:**
```python
# Flask example
@app.route("/api/orders/<order_id>")
@jwt_required
def get_order(order_id):
    user_id = get_jwt_identity()
    order = Order.query.get(order_id)
    if order.user_id != user_id:  # <-- missing before fix
        abort(403)
    return order.to_json()
```

## A2: Cryptographic Failures

**What to look for:**
- Passwords stored with MD5/SHA1 (not bcrypt/argon2)
- HTTP instead of HTTPS
- Weak TLS versions (TLS 1.0/1.1)
- Hardcoded encryption keys
- Using ECB mode for structured data
- Predictable random values

**Fix:**
```python
import bcrypt

hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))
assert bcrypt.checkpw(password.encode(), hashed)
```

## A3: Injection (SQL, NoSQL, Command, LDAP)

**What to look for:**
- String concatenation in SQL queries
- Raw `eval()`, `exec()`, `os.system()` with user input
- NoSQL injection without sanitization
- `child_process.exec()` with shell metacharacters

**Fix:**
```python
# BAD
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")

# GOOD
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))

# NoSQL (MongoDB) — sanitize operators
db.users.find({"email": email})  # Direct is safe
db.users.find({"$where": f"this.email == '{email}'"})  # BAD
```

## A4: Insecure Design

**What to look for:**
- No rate limiting on auth endpoints
- Missing "Forgot password" flow security (guessable tokens)
- Overly verbose error messages
- No request throttling
- Trusting client-side validation only

**Fix:**
- Rate limiter on all public endpoints
- Account lockout after N failed attempts
- Generic error messages: "Invalid credentials" (not "user not found")

## A5: Security Misconfiguration

**What to look for:**
- Debug/verbose error pages in production
- Default credentials still active
- Directory listing enabled
- Unnecessary open ports
- Missing security headers
- Cloud storage buckets publicly readable

**Tools:** `nmap`, `nikto`, `sslscan`

**Fix:**
```python
# Flask production config
app.config.update(
    DEBUG=False,
    ENV="production",
    SECRET_KEY=os.environ["SECRET_KEY"],
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE="Lax",
)
```

## A6: Vulnerable & Outdated Components

**What to look for:**
- Old versions with known CVEs (check: npm audit, pip audit, etc.)
- Unused dependencies
- Unpinned versions (`"express": "^4.x"` pins minor but not patch)
- Container images without updates

**Fix:**
```bash
# Pin exact versions in production
npm audit fix
pip-audit fix
# Use Dependabot / Renovate for automation
```

## A7: Identification & Authentication Failures

**What to look for:**
- No MFA on admin accounts
- Session tokens in URLs
- No session timeout
- Concurrent login allowed without notification
- Weak password policy

**Fix:**
- Implement MFA (TOTP, WebAuthn)
- JWT: short expiry + refresh rotation
- Session: inactivity timeout + absolute timeout
- Password: min 8 chars, bcrypt hash

## A8: Software & Data Integrity Failures

**What to look for:**
- Loading external scripts without SRI
- Unsigned software updates
- Insecure CI/CD pipeline (unverified artifacts)
- Use of compromised packages (typosquatting)

**Fix:**
```html
<!-- SRI hash -->
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-abc123..."
  crossorigin="anonymous">
</script>
```

**Package verification:**
```bash
# npm audit signatures (verify publisher)
npm audit signatures
# cargo: use --verify
cargo install --verify
```

## A9: Security Logging & Monitoring Failures

**What to look for:**
- No audit log for sensitive operations
- Logs don't include timestamps or user IDs
- Logs stored in same partition as application (fills up)
- No alerting on anomalies
- PII in logs

**Fix:**
```python
import structlog

logger = structlog.get_logger()
logger.info("user_login", user_id=user.id, ip=request.remote_addr, timestamp=datetime.utcnow())
# No PII, no passwords
```

## A10: SSRF (Server-Side Request Forgery)

**What to look for:**
- User input controlling URL in server requests
- `requests.get(user_input)` without validation
- Open redirect endpoints
- Cloud metadata endpoint accessible (`169.254.169.254`)

**Fix:**
```python
from urllib.parse import urlparse

ALLOWED_HOSTS = {"api.example.com", "internal.db"}

def safe_fetch(url: str):
    parsed = urlparse(url)
    if parsed.hostname not in ALLOWED_HOSTS:
        raise ValueError("Host not allowed")
    # Block private IPs
    if is_private_ip(parsed.hostname):
        raise ValueError("Private IP blocked")
    return requests.get(url, timeout=5)
```

## Verification Checklist

- [ ] Auth enforced on every endpoint (not just hidden UI)
- [ ] SQL/NoSQL/CMDi — parameterized everywhere
- [ ] Passwords bcrypt/argon2, no plaintext storage
- [ ] HTTPS enforced, HSTS set
- [ ] Dependencies scanned for CVEs
- [ ] Rate limiting on auth paths
- [ ] CSP/security headers present
- [ ] No hardcoded secrets
- [ ] Input validated server-side (type, length, pattern)
- [ ] Error messages generic (no stack traces)
- [ ] File uploads: extension whitelist, size limit, scanned
- [ ] Logs audit trail with timestamps and user IDs
