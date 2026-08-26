# Refactoring Skill

## Golden Rules

- **Always refactor with tests passing** — never refactor without a safety net
- **One change at a time** — never mix refactoring with feature work or bug fixes
- **Small steps** — if a refactor feels risky, you're taking too big a step
- **Characterization tests first** — for untested code, write characterization tests before touching it

## Characterization Tests (for Legacy Code)

When refactoring untested code:

1. Identify inputs and outputs of the unit
2. Write tests that capture current behavior (including bugs)
3. Name them: `test_characterization_<behavior>`
4. Refactor, then verify tests still pass
5. Once refactored, rename to meaningful test names and fix bug behavior

```python
def test_characterization_calculates_total_with_tax():
    result = calculate_total(100, "CA")
    assert result == 108.50  # Current behavior, even if tax rate is wrong
```

## Refactoring Catalog (by Code Smell)

### Long Method / Function
- **Extract Method** — Extract logical blocks into named functions
- **Replace Temp with Query** — Replace temp variables with function calls
- **Introduce Parameter Object** — Group related params into an object

### Large Class
- **Extract Class** — Split responsibilities into separate classes
- **Extract Subclass** — Variant behavior into subclass
- **Replace Conditional with Polymorphism** — Type-switching → dispatch

### Conditional Complexity
- **Decompose Conditional** — Extract conditions and branches into methods
- **Replace Nested Conditional with Guard Clauses** — Early returns
- **Replace Conditional with Strategy** — Algorithm selection

### Shotgun Surgery (one change → many files)
- **Move Function** — Move behavior to where data lives
- **Inline Function** — If a function is just indirection
- **Move Field** — Keep data and behavior together

### Data Clumps (same fields appear together repeatedly)
- **Extract Class** for the clump
- **Introduce Parameter Object** for method signatures

### Primitive Obsession
- **Replace Primitive with Object** (e.g., `string email` → `Email` value object)
- **Replace Type Code with Subclasses** / **with State/Strategy**

### Feature Envy (method uses another class more than its own)
- **Move Method** to the class it envies

## Incremental Refactoring Workflow

```
1. Check: all tests green?
2. Identify: what to refactor and why
3. Safety: add characterization tests if needed
4. Step: make ONE small transformation
5. Test: run tests
6. If red → revert the small change, reconsider approach
7. If green → commit ("refactor: ...")
8. Repeat from 4 until done
```

## Tools

### TypeScript/JavaScript
- `ts-migrate` — large-scale codemods
- `jscodeshift` — automated refactoring transforms
- IDE refactoring commands — rename symbol, extract method, move file

### Python
- `rope` — Python refactoring library
- `pyupgrade` — upgrade syntax to modern Python
- IDE: PyCharm refactoring tools, VS Code with Pylance

### Go
- `gorename` — safe renaming
- `gomvpkg` — move packages
- `eg` — example-based refactoring tool

## Never Refactor Without

- [ ] Tests passing (or characterization tests written)
- [ ] A clear goal ("improve readability of X" not "clean up the codebase")
- [ ] Separate commit/branch from feature work
- [ ] A rollback plan — if things go wrong, `git checkout` should be safe
