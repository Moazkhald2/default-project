# Docstring Generator Skill

## Core Principle

**Explain WHY, not WHAT.** The code already says what it does. Docstrings explain why it does it, what the caller needs to know, and what could go wrong.

## What Every Docstring Should Cover

1. **Purpose** — What is this for? Single sentence summary.
2. **Params** — Types, constraints, invalid values, defaults
3. **Returns** — Type, what it represents, possible values
4. **Raises / Throws** — When and why
5. **Side effects** — Mutations, I/O, network calls, cache invalidation
6. **Examples** — One minimal usage example

## Language-Specific Styles

### TypeScript / JavaScript (JSDoc / TSDoc)

```typescript
/**
 * Calculates the discounted price for a product.
 *
 * Applies a percentage discount to the base price. If the result
 * would be below cost price, returns the cost price instead.
 *
 * @param basePrice - The original price in cents (must be > 0)
 * @param discountPercent - The discount to apply (0-100)
 * @param costPrice - The minimum floor price in cents
 * @returns The final price in cents after discount, floored at costPrice
 *
 * @throws {RangeError} If discountPercent is outside 0-100
 *
 * @example
 * // Standard discount
 * calculateDiscountPrice(10000, 20, 5000)
 * // => 8000
 *
 * @example
 * // Floored at cost price
 * calculateDiscountPrice(10000, 70, 4000)
 * // => 4000
 */
function calculateDiscountPrice(
  basePrice: number,
  discountPercent: number,
  costPrice: number
): number { ... }
```

### Python (Google Style — recommended)

```python
def calculate_discount_price(
    base_price: int,
    discount_percent: int,
    cost_price: int,
) -> int:
    """Calculate the discounted price for a product.

    Applies a percentage discount to the base price. If the result
    would be below cost price, returns the cost price instead.

    Args:
        base_price: The original price in cents (must be > 0).
        discount_percent: The discount to apply (0-100).
        cost_price: The minimum floor price in cents.

    Returns:
        The final price in cents after discount, floored at cost_price.

    Raises:
        ValueError: If discount_percent is outside 0-100.

    Example:
        >>> calculate_discount_price(10000, 20, 5000)
        8000
        >>> calculate_discount_price(10000, 70, 4000)
        4000
    """
    ...
```

### Go

```go
// CalculateDiscountPrice calculates the discounted price for a product.
//
// Applies a percentage discount to the base price. If the result would
// be below cost price, returns the cost price instead.
//
// basePrice is in cents (must be > 0).
// discountPercent is the discount to apply (0-100).
// costPrice is the minimum floor price in cents.
//
// Returns the final price in cents after discount, floored at costPrice.
// Returns an error if discountPercent is outside 0-100.
func CalculateDiscountPrice(basePrice int, discountPercent int, costPrice int) (int, error) { ... }
```

### Rust

```rust
/// Calculates the discounted price for a product.
///
/// Applies a percentage discount to the base price. If the result
/// would be below cost price, returns the cost price instead.
///
/// # Arguments
/// * `base_price` - The original price in cents (must be > 0)
/// * `discount_percent` - The discount to apply (0-100)
/// * `cost_price` - The minimum floor price in cents
///
/// # Returns
/// The final price in cents after discount, floored at costPrice.
///
/// # Errors
/// Returns `InvalidDiscount` if discount_percent is outside 0-100.
///
/// # Examples
/// ```
/// assert_eq!(calculate_discount_price(10000, 20, 5000), 8000);
/// ```
fn calculate_discount_price(
    base_price: u64,
    discount_percent: u8,
    cost_price: u64,
) -> Result<u64, Error> { ... }
```

## Good vs Bad

### Good Docstring
```python
def send_email(to: str, subject: str, body: str) -> bool:
    """Send an email via the transactional API.

    Uses SendGrid under the hood. Queues the email asynchronously —
    the return value only indicates acceptance, not delivery.

    Args:
        to: Recipient email address. Must be verified in SendGrid for prod.
        subject: Email subject line (max 998 chars per RFC 2822).
        body: HTML body, raw HTML (not markdown).

    Returns:
        True if the email was accepted by the API, False on rate limit.

    Raises:
        ConnectionError: If the API is unreachable after 3 retries.
    """
```

### Bad Docstring
```python
def send_email(to, subject, body):
    """Send email."""
    # Code here
```

## When NOT to Write a Docstring

- **Self-documenting code**: `getUserById(id)` doesn't need "Get user by ID"
- **Trivial getters/setters**: `def name(self): return self._name`
- **Overrides**: Parent docstring suffices (use `{@inheritDoc}` or equivalent)
- **Obvious private helpers**: If it's private and 3 lines, the code is the doc

## Tools

- **TypeScript**: `typedoc`, `api-extractor` — generate docs from JSDoc
- **Python**: `pdoc`, `sphinx` with napoleon extension (auto-detect Google/NumPy style)
- **Docstring generators**: GitHub Copilot, Cody, Cursor can generate — always review for correctness
