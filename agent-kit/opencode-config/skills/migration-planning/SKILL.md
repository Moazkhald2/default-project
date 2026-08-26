# Migration Planning Skill

## Golden Rule
**Always have a rollback plan — and test it.** A migration without a tested rollback is not ready for production.

## Database Migrations: Expand-Migrate-Contract

### Phase 1: Expand
Add the new schema alongside the old schema. Old code continues to use old schema.

```sql
-- Add new column, keep old one
ALTER TABLE users ADD COLUMN email_new VARCHAR(255);
-- Start dual-writing (from app code)
UPDATE users SET email_new = email WHERE email_new IS NULL;
```

### Phase 2: Migrate
Read from new schema, write to both. Verify correctness.

```sql
-- Backfill any new records
UPDATE users SET email_new = email WHERE email_new IS NULL;
-- Add NOT NULL constraint, indexes
ALTER TABLE users ALTER COLUMN email_new SET NOT NULL;
CREATE INDEX idx_users_email_new ON users(email_new);
```

### Phase 3: Contract
Remove old schema once all data is verified.

```sql
ALTER TABLE users DROP COLUMN email;
ALTER TABLE users RENAME COLUMN email_new TO email;
```

### Rollback Plan for Each Phase

| Phase | Rollback |
|-------|----------|
| Expand | Drop new schema, stop dual-writing |
| Migrate | Switch reads back to old schema, keep dual-writing |
| Contract | Add old column back, backfill from new column |

## Code Migrations: Strangler Fig Pattern

```
┌─────────────┐         ┌─────────────┐
│ Old Service │         │ New Service │
│ ── route A  │         │ ── route A  │
│ ── route B  │         │ ── route C  │
│ ── route C  │         └──────┬──────┘
└─────────────┘                │
       │                       │
       └─────── Router ────────┘
```

1. Deploy new service alongside old
2. Route new traffic to new service (via feature flag or gateway)
3. Verify correctness
4. Gradually increase traffic to new service
5. Once 100% on new service, decommission old

## Feature Flags for Migrations

```python
# Gradual rollout via feature flag
def get_user_email(user_id: str) -> str:
    if feature_flags.is_enabled("new-email-storage", user_id):
        return db.query("SELECT email_new FROM users WHERE id = ?", user_id)
    else:
        return db.query("SELECT email FROM users WHERE id = ?", user_id)
```

## Data Migration with Verification

### Steps

1. **Snapshot**: Take a snapshot of data before migration
2. **Backfill**: Migrate in batches (not one giant transaction)
3. **Verify**: Compare old vs new for each batch
4. **Validate**: Run integrity checks on migrated data
5. **Cutover**: Flip the switch, monitor for errors

### Batch Script Template

```python
BATCH_SIZE = 1000
last_id = 0

while True:
    records = db.query(
        "SELECT * FROM source WHERE id > ? ORDER BY id LIMIT ?",
        (last_id, BATCH_SIZE),
    )
    if not records:
        break

    for record in records:
        migrate_record(record)

    # Verify
    for record in records:
        source = db.query("SELECT * FROM source WHERE id = ?", (record.id,))
        target = db.query("SELECT * FROM target WHERE id = ?", (record.id,))
        assert source == target

    last_id = records[-1].id
    logger.info(f"Migrated up to id {last_id}")
```

## Risk Assessment

| Factor | Low Risk | Medium Risk | High Risk |
|--------|----------|-------------|-----------|
| Data volume | < 10K records | 10K–1M records | > 1M records |
| Table locking | No lock | Brief lock | Long lock |
| Rollback complexity | One command | Multiple steps | Data transformation |
| Downtime required | Zero-downtime | < 5 min | > 5 min |
| Verification | Built-in | Manual query | External tool needed |

## Checklist

### Before Migration

- [ ] Written rollback plan (and tested it)
- [ ] Data backups in place
- [ ] Migration tested on staging with production-like data
- [ ] Feature flags ready for gradual rollout
- [ ] Monitoring alerts configured for error rate spikes
- [ ] Communication sent to stakeholders

### During Migration

- [ ] Run in maintenance window if downtime is required
- [ ] Monitor error rates and latency in real time
- [ ] Pause and assess if error rate exceeds threshold
- [ ] Execute rollback if migration goes wrong (don't "fix forward")

### After Migration

- [ ] Verify data integrity (automated checks)
- [ ] Remove old schema/feature flags after stabilization period
- [ ] Update documentation (schema diagrams, API docs)
- [ ] Run performance tests (schema changes can affect query plans)
- [ ] Send completion summary to stakeholders

## Downtime Budgeting

```yaml
# Example migration plan
total_downtime_budget: 5 minutes
phases:
  - name: "Schema changes"
    estimated: 2m
    max_allowed: 3m
  - name: "Data migration"
    estimated: 1m
    max_allowed: 2m
  - name: "Verification"
    estimated: 1m
    max_allowed: 2m
  - name: "Cutover"
    estimated: 30s
    max_allowed: 1m
  - name: "Rollback (if needed)"
    estimated: 2m
    not_counted_against_budget: true
```
