# Cheatsheet Creator

Create math formula sheets, quick reference cards, concept summaries, exam crib sheets, vocabulary glossaries, and step-by-step procedure cards.

## When to Use

- User wants a one-page formula sheet for a math topic
- User wants a compact summary for exam prep or study
- User wants a printable reference card or poster
- User wants a vocabulary glossary or procedure guide

## Workflow

1. **Ask**: topic, type of cheatsheet, layout preference, grade/level, any specific formulas to include
2. **Generate**: dense, well-organized cheatsheet in requested format
3. **Export**: deliver as markdown, HTML, or LaTeX for printing

## Types

| Type | Description | Best For |
|------|-------------|----------|
| Formula Sheet | Key equations organized by topic | Exam review, quick lookup |
| Quick Reference Card | Single-page, dense info | In-class use, desk reference |
| Concept Summary | Visual overview with connections | Understanding relationships |
| Exam Crib Sheet | Allowed formulas for tests | Test-day permitted reference |
| Vocabulary Glossary | Terms, definitions, examples | Building terminology |
| Procedure Card | Step-by-step problem solving | Homework help, tutoring |

## Design Principles

### Hierarchy
- Most important formulas: largest font, top of page
- Secondary formulas: medium font, middle sections
- Tertiary details: small font, footnotes

### Grouping
- Related formulas under clear section headers
- Use colored backgrounds or lines to group
- Logical flow: fundamental → derived → applications

### Density
- Maximize information-to-clutter ratio
- Use abbreviations consistently
- No full sentences — phrases and formulas only
- 40-60 distinct pieces of information per page

### Mnemonics
- Acronyms (PEMDAS, SOHCAHTOA)
- Visual patterns (unit circle hand trick)
- Rhymes or sayings
- Color coding for related concepts

### Examples
- One quick example per formula group
- Mini-worked examples showing substitution
- Highlight the key step

## Layout Options

### Single Page (Letter/A4)
```
┌─────────────────────────────────────┐
│  TOPIC NAME — Formula Sheet         │
│  ┌───────────────────────────────┐  │
│  │ SECTION 1 (largest font)      │  │
│  │ formula 1         example     │  │
│  │ formula 2         example     │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ SECTION 2                     │  │
│  │ formula 3         example     │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ Quick Tips:  mnemonic here    │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Two-Column
```
┌─────────────────┬───────────────────┐
│ COLUMN 1        │ COLUMN 2          │
│ Section A       │ Section C         │
│ formula 1       │ formula 5         │
│ formula 2       │ formula 6         │
│ example         │ example           │
│                 │                   │
│ Section B       │ Section D         │
│ formula 3       │ formula 7         │
│ formula 4       │ formula 8         │
│ example         │ example           │
│                 │                   │
│ Mnemonics       │ Common Mistakes   │
└─────────────────┴───────────────────┘
```

### Card Size (A5 / Index Card)
```
┌──────────────────┐
│ TOPIC            │
│ ─────────────── │
│ KEY FORMULAS     │
│ • formula 1      │
│ • formula 2      │
│ • formula 3      │
│                  │
│ EXAMPLE          │
│ quick worked     │
│                  │
│ TIP: mnemonic    │
└──────────────────┘
```

### Poster Size
- 24×36 inch poster for classroom wall
- Large section headers visible from 10ft
- Big formula blocks with color highlighting
- QR code linking to full explanation

### Bookmark Size
- 2×7 inch bookmark
- 8-12 key formulas
- One example
- Topic name at top

## Topic Cheatsheets

### Algebra

```markdown
# ALGEBRA FORMULA SHEET

## Linear Equations
| Form | Equation |
|------|----------|
| Slope-intercept | $y = mx + b$ |
| Point-slope | $y - y_1 = m(x - x_1)$ |
| Standard | $Ax + By = C$ |
| Slope | $m = \frac{y_2 - y_1}{x_2 - x_1}$ |

## Quadratic Equations
| Formula | |
|---------|-|
| Standard | $ax^2 + bx + c = 0$ |
| Vertex | $y = a(x - h)^2 + k$, vertex = $(h, k)$ |
| Quadratic formula | $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$ |
| Discriminant | $D = b^2 - 4ac$ |
| | $D > 0$: 2 real roots, $D = 0$: 1 real root, $D < 0$: 2 complex |

**Example:** $2x^2 + 5x - 3 = 0$
$x = \frac{-5 \pm \sqrt{25 + 24}}{4} = \frac{-5 \pm 7}{4}$
$x = \frac{1}{2}$ or $x = -3$

## Exponents
| Rule | Example |
|------|---------|
| $a^m \cdot a^n = a^{m+n}$ | $x^2 \cdot x^3 = x^5$ |
| $\frac{a^m}{a^n} = a^{m-n}$ | $\frac{x^5}{x^2} = x^3$ |
| $(a^m)^n = a^{mn}$ | $(x^2)^3 = x^6$ |
| $a^{-n} = \frac{1}{a^n}$ | $x^{-2} = \frac{1}{x^2}$ |
| $a^{1/n} = \sqrt[n]{a}$ | $x^{1/2} = \sqrt{x}$ |
| $a^0 = 1$ | $5^0 = 1$ |

## Factoring
| Pattern | Formula |
|---------|---------|
| Difference of squares | $a^2 - b^2 = (a-b)(a+b)$ |
| Perfect square | $a^2 \pm 2ab + b^2 = (a \pm b)^2$ |
| Sum of cubes | $a^3 + b^3 = (a+b)(a^2 - ab + b^2)$ |
| Difference of cubes | $a^3 - b^3 = (a-b)(a^2 + ab + b^2)$ |

## Systems of Equations
- **Substitution:** Solve one equation for a variable, plug into the other.
- **Elimination:** Add/subtract equations to cancel a variable.
- **Matrix form:** $A\vec{x} = \vec{b}$ → $\vec{x} = A^{-1}\vec{b}$
```

### Geometry

```markdown
# GEOMETRY FORMULA SHEET

## 2D Shapes

| Shape | Area | Perimeter |
|-------|------|-----------|
| Circle | $A = \pi r^2$ | $C = 2\pi r$ |
| Triangle | $A = \frac{1}{2}bh$ | $P = a+b+c$ |
| Rectangle | $A = lw$ | $P = 2(l+w)$ |
| Square | $A = s^2$ | $P = 4s$ |
| Parallelogram | $A = bh$ | $P = 2(a+b)$ |
| Trapezoid | $A = \frac{1}{2}(b_1+b_2)h$ | $P = a+b_1+c+b_2$ |

**Triangle example:** base=6, height=4 → $A = \frac{1}{2}(6)(4) = 12$

## 3D Shapes

| Shape | Volume | Surface Area |
|-------|--------|-------------|
| Sphere | $V = \frac{4}{3}\pi r^3$ | $SA = 4\pi r^2$ |
| Cylinder | $V = \pi r^2 h$ | $SA = 2\pi r^2 + 2\pi rh$ |
| Cone | $V = \frac{1}{3}\pi r^2 h$ | $SA = \pi r^2 + \pi rl$ |
| Rectangular prism | $V = lwh$ | $SA = 2(lw + lh + wh)$ |
| Cube | $V = s^3$ | $SA = 6s^2$ |
| Pyramid | $V = \frac{1}{3}Bh$ | $SA = B + \frac{1}{2}Pl$ |

## Theorems
- **Pythagorean:** $a^2 + b^2 = c^2$ (right triangles)
- **Triangle angle sum:** $\angle A + \angle B + \angle C = 180^\circ$
- **Circle:** Central angle = intercepted arc
- **Circle:** Inscribed angle = $\frac{1}{2}$ intercepted arc

## Coordinate Geometry
- **Distance:** $d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$
- **Midpoint:** $M = \left(\frac{x_1+x_2}{2}, \frac{y_1+y_2}{2}\right)$
- **Slope:** $m = \frac{y_2-y_1}{x_2-x_1}$
```

### Trigonometry

```markdown
# TRIGONOMETRY FORMULA SHEET

## SOHCAHTOA
| | |
|-|-|
| $\sin \theta = \frac{\text{opposite}}{\text{hypotenuse}}$ | $\csc \theta = \frac{1}{\sin \theta}$ |
| $\cos \theta = \frac{\text{adjacent}}{\text{hypotenuse}}$ | $\sec \theta = \frac{1}{\cos \theta}$ |
| $\tan \theta = \frac{\text{opposite}}{\text{adjacent}}$ | $\cot \theta = \frac{1}{\tan \theta}$ |

## Unit Circle (Key Angles)
```
Angle  | sin  | cos  | tan
0°     | 0    | 1    | 0
30°    | 1/2  | √3/2 | 1/√3
45°    | √2/2 | √2/2 | 1
60°    | √3/2 | 1/2  | √3
90°    | 1    | 0    | undef
```

**Mnemonic:** "All Students Take Calculus" — ASTC signs in quadrants I-IV

## Identities

**Pythagorean:**
- $\sin^2\theta + \cos^2\theta = 1$
- $1 + \tan^2\theta = \sec^2\theta$
- $1 + \cot^2\theta = \csc^2\theta$

**Double Angle:**
- $\sin 2\theta = 2\sin\theta\cos\theta$
- $\cos 2\theta = \cos^2\theta - \sin^2\theta = 2\cos^2\theta - 1 = 1 - 2\sin^2\theta$
- $\tan 2\theta = \frac{2\tan\theta}{1 - \tan^2\theta}$

**Law of Sines:** $\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C} = 2R$

**Law of Cosines:** $c^2 = a^2 + b^2 - 2ab\cos C$

**Example:** Triangle with a=3, b=4, C=60°
$c^2 = 9 + 16 - 2(3)(4)(0.5) = 25 - 12 = 13$
$c = \sqrt{13} \approx 3.61$
```

### Calculus

```markdown
# CALCULUS FORMULA SHEET

## Derivatives

| Function | Derivative |
|----------|-----------|
| $x^n$ | $nx^{n-1}$ |
| $e^x$ | $e^x$ |
| $\ln x$ | $\frac{1}{x}$ |
| $\sin x$ | $\cos x$ |
| $\cos x$ | $-\sin x$ |
| $\tan x$ | $\sec^2 x$ |
| $a^x$ | $a^x \ln a$ |
| $\log_a x$ | $\frac{1}{x \ln a}$ |
| $\arcsin x$ | $\frac{1}{\sqrt{1-x^2}}$ |
| $\arctan x$ | $\frac{1}{1+x^2}$ |

**Rules:**
- Product: $(fg)' = f'g + fg'$
- Quotient: $(\frac{f}{g})' = \frac{f'g - fg'}{g^2}$
- Chain: $(f(g(x)))' = f'(g(x)) \cdot g'(x)$

## Integrals

| Function | Integral |
|----------|---------|
| $x^n$ | $\frac{x^{n+1}}{n+1} + C, n \neq -1$ |
| $\frac{1}{x}$ | $\ln|x| + C$ |
| $e^x$ | $e^x + C$ |
| $\sin x$ | $-\cos x + C$ |
| $\cos x$ | $\sin x + C$ |
| $\sec^2 x$ | $\tan x + C$ |
| $\frac{1}{\sqrt{a^2 - x^2}}$ | $\arcsin(\frac{x}{a}) + C$ |
| $\frac{1}{a^2 + x^2}$ | $\frac{1}{a}\arctan(\frac{x}{a}) + C$ |

**Integration by parts:** $\int u\,dv = uv - \int v\,du$

## Series

**Taylor series:** $f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n$

**Common expansions:**
- $e^x = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots$
- $\sin x = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \cdots$
- $\cos x = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \cdots$
- $\frac{1}{1-x} = 1 + x + x^2 + x^3 + \cdots$ for $|x| < 1$

## Limits

- $\lim_{x \to 0} \frac{\sin x}{x} = 1$
- $\lim_{x \to 0} \frac{1 - \cos x}{x} = 0$
- $\lim_{x \to \infty} \left(1 + \frac{1}{x}\right)^x = e$
```

### Statistics

```markdown
# STATISTICS FORMULA SHEET

## Descriptive Statistics
- **Mean:** $\bar{x} = \frac{\sum x_i}{n}$
- **Median:** Middle value when sorted
- **Mode:** Most frequent value
- **Range:** $\max - \min$
- **Variance:** $s^2 = \frac{\sum (x_i - \bar{x})^2}{n-1}$
- **Std Dev:** $s = \sqrt{s^2}$
- **IQR:** $Q_3 - Q_1$

## Probability
- $P(A \cup B) = P(A) + P(B) - P(A \cap B)$
- $P(A|B) = \frac{P(A \cap B)}{P(B)}$
- **Bayes:** $P(A|B) = \frac{P(B|A)P(A)}{P(B)}$

## Distributions
- **Binomial:** $P(X=k) = \binom{n}{k} p^k (1-p)^{n-k}$
  - Mean: $np$, Variance: $np(1-p)$
- **Normal:** $f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}(\frac{x-\mu}{\sigma})^2}$
  - Standard normal: $Z = \frac{X - \mu}{\sigma}$

## Confidence Intervals
- **Mean ($\sigma$ known):** $\bar{x} \pm z_{\alpha/2} \cdot \frac{\sigma}{\sqrt{n}}$
- **Mean ($\sigma$ unknown):** $\bar{x} \pm t_{\alpha/2, n-1} \cdot \frac{s}{\sqrt{n}}$
- **Proportion:** $\hat{p} \pm z_{\alpha/2} \cdot \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}$

## Hypothesis Tests
| Test | Statistic |
|------|-----------|
| One-sample z (mean) | $z = \frac{\bar{x} - \mu_0}{\sigma/\sqrt{n}}$ |
| One-sample t (mean) | $t = \frac{\bar{x} - \mu_0}{s/\sqrt{n}}$ |
| Two-sample t | $t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}}$ |
| Chi-square | $\chi^2 = \sum \frac{(O-E)^2}{E}$ |
```

## Code Example: Two-Column HTML Cheatsheet

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cheatsheet</title>
<style>
  @page { size: letter; margin: 0.5in; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', 'Helvetica', Arial, sans-serif; font-size: 9pt; color: #1a1a1a; line-height: 1.3; }
  .container { columns: 2; column-gap: 0.4in; }
  .section { break-inside: avoid; margin-bottom: 0.3in; }
  h1 { font-size: 14pt; text-align: center; margin-bottom: 0.2in; column-span: all; border-bottom: 2px solid #2563eb; padding-bottom: 4px; }
  h2 { font-size: 10pt; color: #2563eb; border-bottom: 1px solid #93c5fd; padding-bottom: 2px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
  h3 { font-size: 9pt; color: #475569; margin-top: 6px; }
  .formula { padding: 2px 0; font-family: 'Times New Roman', serif; }
  .formula .name { display: inline-block; width: 1.8in; font-size: 8pt; color: #475569; }
  .example { background: #f8fafc; padding: 3px 6px; border-left: 2px solid #2563eb; margin: 3px 0; font-size: 8pt; border-radius: 0 2px 2px 0; }
  .tip { background: #fefce8; padding: 4px 6px; border: 1px solid #fde047; margin: 4px 0; font-size: 8pt; border-radius: 3px; }
  .mnemonic { color: #7c3aed; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; font-size: 8pt; margin: 3px 0; }
  th, td { border: 1px solid #e2e8f0; padding: 3px 4px; text-align: left; }
  th { background: #f1f5f9; font-weight: 600; font-size: 7.5pt; text-transform: uppercase; }
  .footer { column-span: all; text-align: center; font-size: 7pt; color: #94a3b8; margin-top: 0.2in; border-top: 1px solid #e2e8f0; padding-top: 4px; }
  @media print { body { font-size: 8pt; } .container { columns: 2; } }
  @media (prefers-color-scheme: dark) {
    body { background: #0f172a; color: #e2e8f0; }
    h2 { color: #60a5fa; }
    h3 { color: #94a3b8; }
    .formula .name { color: #94a3b8; }
    .example { background: #1e293b; }
    th { background: #1e293b; }
    th, td { border-color: #334155; }
    .footer { color: #475569; }
  }
</style>
</head>
<body>
<h1>TOPIC NAME — Formula Sheet</h1>
<div class="container">

<div class="section">
<h2>Section 1</h2>
<div class="formula"><span class="name">Equation Name</span> $y = mx + b$</div>
<div class="formula"><span class="name">Second Formula</span> $ax^2 + bx + c = 0$</div>
<div class="example"><strong>Ex:</strong> Quick worked example here</div>
</div>

<div class="section">
<h2>Section 2</h2>
<table>
  <tr><th>Rule</th><th>Formula</th><th>Example</th></tr>
  <tr><td>Product</td><td>$a^m \cdot a^n = a^{m+n}$</td><td>$x^2 \cdot x^3 = x^5$</td></tr>
  <tr><td>Power</td><td>$(a^m)^n = a^{mn}$</td><td>$(x^2)^3 = x^6$</td></tr>
</table>
</div>

<div class="section">
<h2>Quick Tips</h2>
<div class="tip"><span class="mnemonic">🔑 Mnemonic:</span> SOHCAHTOA — Sin=Opp/Hyp, Cos=Adj/Hyp, Tan=Opp/Adj</div>
<div class="tip"><span class="mnemonic">⚠️ Watch for:</span> Common mistakes and gotchas</div>
</div>

</div>
<div class="footer">Generated 2026-07-26 &bull; More resources at [URL]</div>
</body>
</html>
```

## User Prompt Examples

- "Create a one-page algebra formula sheet with the quadratic formula, factoring rules, and exponent laws"
- "Make a two-column calculus cheatsheet for exam day"
- "Generate a geometry vocabulary glossary with terms, definitions, and diagrams"
- "Create a bookmark-sized trig reference with unit circle and identities"
- "Build an A5 card for derivatives with product/quotient/chain rules"
- "Make a poster-sized statistics reference for the classroom wall"
- "Generate a procedure card for solving systems of equations"
