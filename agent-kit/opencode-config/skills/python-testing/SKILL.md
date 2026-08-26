# Python Testing with pytest

Use for Python testing tasks. Triggers: "pytest", "python test", "test python", "unit test python", "conftest".

## Fixtures

```python
# conftest.py — shared fixtures
import pytest
from unittest.mock import Mock, patch

@pytest.fixture
def db_session():
    session = create_test_session()
    yield session
    session.rollback()
    session.close()

@pytest.fixture(autouse=True)
def mock_redis():
    with patch("app.cache.redis_client") as mock:
        mock.get.return_value = None
        yield mock
```

- Use `conftest.py` for fixtures shared across test files
- `autouse=True` for fixtures every test needs (cleanup, env vars)
- `scope="session"` for expensive resources (DB connection, HTTP client)
- `scope="module"` for fixtures reusable within a file

## Parametrize

```python
@pytest.mark.parametrize("input,expected", [
    ("hello", 5),
    ("", 0),
    pytest.param(None, -1, marks=pytest.mark.xfail),
])
def test_length(input, expected):
    assert len(input or "") == expected

# Multiple params — cartesian product
@pytest.mark.parametrize("auth", ["anon", "user", "admin"])
@pytest.mark.parametrize("method", ["GET", "POST", "DELETE"])
def test_endpoint(auth, method):
    ...
```

## Mocking (unittest.mock)

```python
from unittest.mock import Mock, patch, PropertyMock

# Patch a function
@patch("app.service.send_email")
def test_signup(mock_send_email, db_session):
    mock_send_email.return_value = {"status": "sent"}
    result = signup("test@example.com")
    mock_send_email.assert_called_once()

# Patch a class method
@patch.object(ExternalAPI, "fetch", return_value={"data": []})
def test_empty_fetch(mock_fetch):
    ...

# Mock property
@patch("app.config.SETTINGS", new_callable=PropertyMock)
def test_config(mock_settings):
    mock_settings.return_value = {"debug": True}
```

## Async Testing (pytest-asyncio)

```python
# pytest.ini: asyncio_mode = auto
@pytest.mark.asyncio
async def test_async_service():
    result = await async_service.process()
    assert result.status == "done"

@pytest.mark.asyncio
async def test_async_timeout():
    with pytest.raises(asyncio.TimeoutError):
        async with asyncio_timeout(0.1):
            await slow_operation()
```

## Structuring Test Files

```
tests/
├── conftest.py              # shared fixtures
├── unit/
│   ├── test_models.py
│   └── test_services.py
├── integration/
│   ├── test_database.py
│   └── test_api.py
└── conftest.py              # maybe empty or override
```

## Running Tests

```bash
# Basic
pytest
pytest tests/unit
pytest tests/test_models.py::test_create

# Flags
pytest -v                          # verbose
pytest -x                          # stop on first failure
pytest --cov=src --cov-report=term  # coverage
pytest -n auto                     # parallel with pytest-xdist
pytest -k "async"                  # keyword filter
pytest --lf                         # run last failed only
pytest --ff                         # run failed first
pytest --durations=10               # show 10 slowest tests

# Markers
pytest -m "slow or integration"     # run tagged tests
```

## Coverage

```bash
# pyproject.toml
[tool.coverage.run]
source = ["src"]
omit = ["*/tests/*", "*/migrations/*"]

[tool.coverage.report]
fail_under = 80
show_missing = true
```

## Testable Code Patterns

- **DI over globals**: pass dependencies as parameters, don't import singletons
- **Side effect boundaries**: push I/O to edges (DB, HTTP, filesystem)
- **Small functions**: one behavior per test, no setup sprawl
- **Factories over fixtures**: use factory functions for model instances

## Common Pitfalls

| Anti-pattern | Fix |
|---|---|
| `@patch`ing everything | Test the public API, not internals |
| Tests sharing mutable state | Use `scope="function"` fixtures |
| Mocking what you don't own | Use `responses` / `pytest-httpx` for HTTP |
| `assert True` in loops | Collect results and assert once |
| Time-dependent tests | Freeze time with `pytest-freezegun` |
