# Python Best Practices Skill

## Style (PEP 8)

- 4 spaces per level, no tabs
- 79 char lines (88 for Black users)
- `snake_case` for functions/variables, `UPPER_CASE` for constants, `PascalCase` for classes
- Run `ruff format` or `black` — don't argue about formatting
- Run `ruff check` or `flake8` — catch common issues

## Type Hints (PEP 484)

```python
from collections.abc import Sequence
from typing import assert_never, TypedDict, Self


class UserDict(TypedDict):
    id: int
    name: str
    email: str | None  # Python 3.10+ Union syntax


def get_users(active_only: bool = True) -> list[dict[str, Any]]:
    ...


class QuerySet:
    def filter(self, **kwargs: str | int) -> Self:  # PEP 673
        ...
```

- Use `list[X]` not `List[X]` (Python 3.9+)
- Use `X | None` not `Optional[X]` (Python 3.10+)
- Use `Self` return type for fluent APIs / builders
- Use `TypedDict` for structured dicts, `dataclass` for structured objects
- Use `type[X]` for class objects, not `X`

## Dataclasses

```python
from dataclasses import dataclass, field
from pathlib import Path


@dataclass(frozen=True, slots=True)  # frozen for immutability, slots for perf
class Config:
    host: str = "localhost"
    port: int = 8080
    data_dir: Path = field(default_factory=Path.cwd)
```

## Pathlib over os.path

```python
# ❌ Bad
import os
path = os.path.join(os.getcwd(), "data", "config.json")
with open(path) as f:
    ...

# ✅ Good
from pathlib import Path
path = Path.cwd() / "data" / "config.json"
content = path.read_text()
```

## Context Managers

```python
# Always close resources
with open("file.txt") as f:
    data = f.read()

with psycopg.connect(DSN) as conn:
    with conn.cursor() as cur:
        cur.execute("SELECT 1")

# Custom context manager
from contextlib import contextmanager

@contextmanager
def timer(name: str):
    start = time.perf_counter()
    try:
        yield
    finally:
        elapsed = time.perf_counter() - start
        logger.info(f"{name} took {elapsed:.3f}s")
```

## Comprehensions over map/filter

```python
# ✅ Good (readable)
result = [x * 2 for x in items if x > 0]

# ❌ Avoid (less readable)
result = list(map(lambda x: x * 2, filter(lambda x: x > 0, items)))
```

## f-strings

```python
# ✅ Good
name = "world"
print(f"Hello, {name}")

# ✅ Alignment
print(f"{name:>20}")

# ✅ Debugging (3.8+)
print(f"{name=}")

# ❌ Avoid
print("Hello, " + name)
print("Hello, %s" % name)
print("Hello, {}".format(name))
```

## enum

```python
from enum import StrEnum, auto


class Color(StrEnum):
    RED = auto()     # "red"
    GREEN = auto()   # "green"


class Status(IntEnum):
    PENDING = 1
    ACTIVE = 2
    SUSPENDED = 3
```

## lru_cache

```python
from functools import lru_cache

@lru_cache(maxsize=256)
def expensive_computation(n: int) -> int:
    ...
```

Use with care on functions with mutable or unhashable arguments.

## asyncio Patterns

```python
import asyncio
import httpx


async def fetch(url: str) -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        resp.raise_for_status()
        return resp.json()


async def main():
    urls = ["https://api.example.com/1", "https://api.example.com/2"]
    # Concurrent fetches
    results = await asyncio.gather(*[fetch(url) for url in urls], return_exceptions=True)
```

## Packaging (pyproject.toml)

```toml
[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"

[project]
name = "my-package"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "httpx>=0.27",
    "pydantic>=2",
]

[tool.ruff]
line-length = 100
target-version = "py311"
select = ["E", "F", "I", "N", "W", "UP"]

[tool.pytest.ini_options]
testpaths = ["tests"]
```

## Virtual Environments

| Tool | Command |
|------|---------|
| uv | `uv venv && uv sync` |
| Poetry | `poetry install` |
| venv | `python -m venv .venv && source .venv/bin/activate && pip install -e .` |

Prefer `uv` — it's 10-100x faster than pip and has integrated dependency resolution.

## Patterns to Avoid

- Mutable default arguments: `def f(x=[]):` → `def f(x=None):`
- `from module import *` — pollutes namespace
- Bare `except:` — catches `KeyboardInterrupt`, `SystemExit`
- `is` for value comparison — `is` checks identity, `==` checks equality
- `time.sleep()` in async code — use `asyncio.sleep()`
