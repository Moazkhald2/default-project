# Testing Rules

## Expectations
- Write tests for all new code
- Maintain 80%+ coverage on critical paths
- Tests must be deterministic (no flaky tests)
- One assertion pattern per test

## Structure
- Mirror source tree in test directory
- Name: `<module>.test.ts` or `test_<module>.py`
- Use descriptive test names: `describe/context/it` or `Given/When/Then`

## Before Committing
- Run the full test suite
- No test should be skipped or commented out (use `.skip` with a TODO only)
- Fix or remove failing tests — never merge with red tests
