# Test-Driven Development Workflow

Use for TDD discipline. Triggers: "tdd", "red green refactor", "test driven", "test first".

## The Cycle

```
RED    — Write a failing test (one assertion, minimal)
GREEN  — Write simplest code to pass
REFACTOR — Improve code, tests stay green
```

## Rules

1. **No production code without a failing test**
2. **Write the test you wish you had** — imagine the clean API
3. **Simplest thing that works** — no over-engineering to pass a test
4. **Red bar is LAW** — never write production code when tests pass
5. **Commit green, not red** — commit after Refactor, not before Green

## Step-by-Step

### RED: Write the test

```python
# test_calculator.py
def test_add_two_numbers():
    calc = Calculator()
    result = calc.add(2, 3)
    assert result == 5
```

- Test doesn't compile → stuck RED
- Name describes behavior, not implementation
- One logical assertion per test

### GREEN: Make it pass

```python
# calculator.py
class Calculator:
    def add(self, a, b):
        return 5  # hardcoded, but GREEN
```

- Hardcode if needed — the next test will force generalization
- Don't refactor yet! Only GREEN → REFACTOR

### Second test forces generalization

```python
def test_add_negative_numbers():
    calc = Calculator()
    assert calc.add(-1, 1) == 0
```

Now GREEN requires real logic:

```python
def add(self, a, b):
    return a + b
```

### REFACTOR: Improve without changing behavior

```python
# Extract common setup
@pytest.fixture
def calc():
    return Calculator()

def test_add_two_numbers(calc):
    assert calc.add(2, 3) == 5

def test_add_negative(calc):
    assert calc.add(-1, 1) == 0
```

## Triangulation

Add a second test case that forces the implementation to be correct:

```python
def test_add_two_numbers(): assert add(2, 3) == 5
def test_add_with_zero(): assert add(0, 7) == 7
```

`add(2,3)` alone could pass with `return 5`. `add(0,7)` forces generalization.

## Baby Steps

| When to take baby steps | How |
|---|---|
| Unfamiliar domain | Write smallest possible test |
| Complex algorithm | One assertion per test |
| Debugging | Test the exact failing input |
| Refactoring | One rename/extract at a time |

Big steps are fine when you're confident — TDD flexes. Take baby steps when uncertain.

## When to Use TDD vs Other Approaches

| Situation | Approach |
|---|---|
| New algorithm/utility | TDD (red-green-refactor) |
| Bug fix | Write test reproducing bug FIRST, then fix |
| Integration behavior | BDD-style (Given-When-Then) |
| Pre-written spec | Write tests from spec, then implement |
| UI component | RTL approach (render → query → assert) |
| Prototype/exploration | Write tests after, not before |

## Common Anti-Patterns

| Anti-pattern | Fix |
|---|---|
| Writing too many tests at once | One assertion, simplest pass |
| Over-engineering on GREEN | Hardcode first, triangulate |
| Skipping REFACTOR step | Code debt accumulates, always refactor |
| Testing internals | Test public API/behavior |
| Giant tests | Split into smaller focused tests |
| Tests that share state | Use fresh fixtures per test |
| Red bar → write more production code | Stop, revert to last green, smaller step |

## Kent Beck's Patterns (from TDD by Example)

- **Fake It ('Til You Make It)**: Return a constant, generalize with more tests
- **Triangulate**: Add test cases that force abstraction
- **Obvious Implementation**: Write the real implementation when confident
- **One to Many**: Test single → implement with collection
- **Leash**: Only change code to fix a broken test

## Commit Cadence

```
feat: add user email validation

- RED: test_rejects_invalid_email
- GREEN: implement regex validation
- REFACTOR: extract validation to UserModel
```

Each commit is one Red-Green-Refactor cycle on one behavior.

## Testing Within TDD

```python
# 1. RED — test doesn't pass
def test_empty_string_returns_zero():
    assert calculate("") == 0

# 2. GREEN — simplest pass
def calculate(s):
    return 0

# 3. REFACTOR — clean up, test still passes
# (nothing to refactor yet)

# Next cycle: single number
def test_single_number():
    assert calculate("5") == 5

def calculate(s):
    return int(s) if s else 0
```
