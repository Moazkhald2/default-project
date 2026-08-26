# Incident Response Skill

## Severity Classification

| Severity | Definition | Response Time | Examples |
|----------|------------|---------------|----------|
| **SEV-1** | System down, data loss, security breach | Immediate (< 15 min) | Payment service down, user data exposed |
| **SEV-2** | Major feature broken, degraded for many users | < 1 hour | Search broken, login slow for all users |
| **SEV-3** | Minor feature broken, affects few users | < 1 day | Avatar upload fails, wrong sorting on one page |
| **SEV-4** | Cosmetic, documentation, non-functional | Next sprint | Wrong color, typo, stale docs |

## Incident Timeline

```
[T-0:00]  Detection — alert fires, user report comes in
[T-0:05]  Triage — severity determined, responder assigned
[T-0:10]  Mitigation — stop the bleeding (rollback, feature flag, rate limit)
[T-0:30]  Resolution — root cause fixed
[T-1:00]  Verification — monitoring confirms normal
[T-1:30]  Communication — status update to stakeholders
[T-24h]   Postmortem — written and reviewed
```

## Detection and Mitigation

### Stop the Bleeding First

| Situation | Immediate Action |
|-----------|-----------------|
| Bad deploy | Roll back to previous version |
| Slow database | Kill runaway queries, increase pool, read from replica |
| Memory leak | Restart the service |
| Security breach | Isolate the affected system, rotate keys |
| External dependency down | Enable circuit breaker, serve degraded |
| Data corruption | Stop writes, snapshot current state |

### Communication During Incident

- **Dedicated channel**: #incident-YYYYMMDD-name in Slack
- **Status updates**: Every 15 min for SEV-1, every 30 min for SEV-2
- **Template**:
  ```
  Status: [Investigating / Mitigating / Resolved]
  Severity: SEV-1
  Impact: [what's broken, how many users affected]
  Timeline: [key events so far]
  Next action: [what we're doing now]
  ETA: [estimated time to resolution or "unknown"]
  ```

## Root Cause Analysis: 5 Whys

Example:

```
Problem: Users can't log in (500 error)

Why? → Database connection pool exhausted.
Why? → A background job opens connections without closing them.
Why? → The job's connection cleanup is in a `finally` block that's skipped.
Why? → A `sys.exit()` in the try block bypasses cleanup.
Why? → The team was unaware that `sys.exit()` raises `SystemExit`.

Root cause: Lack of training on Python exception handling patterns.
Fix: Use context managers for connections; code review checklist item for resource cleanup.
```

## Postmortem Template

```markdown
# Postmortem: [Title]

## Severity
SEV-1 / SEV-2 / SEV-3

## Summary
One paragraph describing what happened, impact, and how it was resolved.

## Timeline

| Time (UTC) | Event |
|------------|-------|
| 2024-01-15 14:00 | PagerDuty alert: payment service 5xx rate > 10% |
| 14:02 | Responder acknowledges |
| 14:05 | Identified recent deploy as cause |
| 14:08 | Rolled back to previous version |
| 14:12 | Error rate returning to normal |
| 14:20 | Confirmed all systems normal |

## Root Cause
[What caused the incident. 1-3 paragraphs.]

## Detection
[How was this detected? Alert, user report, monitoring?]
[If alert: why didn't it fire earlier / was it too noisy?]

## Mitigation
[What actions were taken to stop the bleeding?]

## Resolution
[What fixed the root cause?]

## Action Items

| Action | Owner | Ticket | Severity |
|--------|-------|--------|----------|
| Add test coverage for edge case X | @alice | PLAT-456 | P0 |
| Add monitoring for metric Y | @bob | PLAT-457 | P1 |
| Update runbook for Z scenario | @carol | PLAT-458 | P2 |

## Lessons Learned

### What went well
- Rollback was fast (under 6 minutes)
- Communication was clear and timely

### What went wrong
- We didn't have an alert for this specific error
- The runbook was outdated

### Where we got lucky
- It happened during working hours
- Only 200 users were affected

## Timeline of Comms
- 14:05: `#incident-20240115-payment` channel created
- 14:08: Status posted: "Rolling back deploy v2.4.1"
- 14:12: Status posted: "Error rate normalizing"
- 14:20: Status posted: "Incident resolved, postmortem in progress"
```

## Blameless Culture Rules

- **No "who did this"** — focus on systems and processes, not individuals
- **Assume good intent** — everyone made the best decision with the information they had
- **Systems thinking** — what process gaps allowed this to happen?
- **Action items over blame** — every finding leads to a concrete improvement

## Runbook Creation

Each service should have a runbook:

```
# Service: payment-service

## Overview
Handles payment processing via Stripe. Deployed on Kubernetes.

## Key Metrics
- p99 latency: < 500ms
- Error rate: < 0.1%
- Throughput: ~1000 req/s

## Alerts

### payment_5xx_rate_high
- Check: `kubectl logs -l app=payment-service --tail=100`
- Quick fix: Rollback to last-known-good version
- Runbook: Rollback procedure at /docs/runbooks/rollback.md

### payment_latency_high
- Check: Stripe API status at status.stripe.com
- Quick fix: Enable circuit breaker → `kubectl patch configmap payment-config -p '{"circuit_breaker": "open"}'`

## Common Commands
```bash
kubectl logs -l app=payment-service -f
kubectl rollout undo deployment/payment-service
kubectl exec -it deploy/payment-service -- curl localhost:8080/health
```
```

## On-Call Best Practices

- **Alert only on symptoms, not on causes** — "Service down" not "CPU > 90%"
- **Noisy alerts get fixed** — if an alert doesn't need action, silence it or tune thresholds
- **Handover** — Write a summary at end of shift for the next on-call engineer
- **Fatigue management** — No 24-hour on-call shifts; max 12 hours
- **Shadow rotation** — New team members shadow before taking primary rotation
