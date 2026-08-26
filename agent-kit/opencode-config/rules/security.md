# Security Rules

## Secrets
- NEVER commit API keys, tokens, passwords, or certificates
- Use environment variables or .env files (gitignored)
- If you see a secret in code, flag it immediately

## Code
- No eval() or dynamic code execution
- No command injection — use parameterized APIs
- Validate and sanitize all user input
- Use HTTPS for all external calls
- Set secure headers (CSP, HSTS, X-Frame-Options)

## Dependencies
- Pin dependency versions (no floating ranges)
- Run `npm audit` or equivalent before commits
- Avoid deprecated packages with known CVEs
