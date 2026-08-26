# LaTeX Formatter

Skill for writing compilable LaTeX code for math documents.

> **Reference standard:** George Grätzer *Math into LaTeX* (Birkhäuser 3rd ed 2013, 616p — also free 1996 short course `ctan.org/tex-archive/info/mil/mil.pdf` and mirror `static.latexstudio.net/.../math.into_.Latex_.4ed.pdf`) — the industry reference for AMS-LaTeX math typesetting. Use its patterns below for consistent, publishable output. See also `freecomputerbooks.com/Math-into-LaTex.html`.

## Gratzer AMS-LaTeX Core (from Math into LaTeX)
- Always load `amsmath,amssymb,amsthm,mathtools` for math; `amsmath` provides `align/gather/multline/cases/bmatrix/pmatrix/subarray/split`
- Prefer `\[...\]` over `$$...$$`, `\begin{equation}` for numbered, `\tag{}` for custom numbers
- Use `\DeclareMathOperator{\Ker}{Ker}` for operators, `\text{}` inside math for words, `\,` before `dx`, `\;` between terms
- For inline math keep `$...$`, for display use `$$...$$` only in Markdown/GitHub/KaTeX context (per `rules/taste-skill.md` unified dollars rule) — in LaTeX source prefer `\[...\]`

## When to Use

- User needs to write a math paper, homework, or exam in LaTeX
- User wants to format equations or proofs
- User is preparing a Beamer presentation
- User needs LaTeX code for a specific notation
- User wants to create a math worksheet or test

## Document Classes

### article (standard papers, homework)
```latex
\documentclass[12pt]{article}
\usepackage[utf8]{inputenc}
\usepackage{amsmath, amssymb, amsthm}
\usepackage[margin=1in]{geometry}
\usepackage{hyperref}

\title{Title}
\author{Author}
\date{\today}
```

### amsart (AMS-style papers)
```latex
\documentclass[11pt]{amsart}
\usepackage{amssymb, amsthm}
\usepackage[margin=1in]{geometry}

\title{Title}
\author{Author}
\date{}
```

### beamer (presentations)
```latex
\documentclass{beamer}
\usetheme{Madrid}
\usecolortheme{default}
\usepackage{amsmath, amssymb}

\title{Title}
\author{Author}
\date{}
```

## Essential Packages

| Package | Purpose |
|---------|---------|
| `amsmath` | Advanced math environments (align, gather, multline) |
| `amssymb` | Math symbols (mathbb, therefore, approx) |
| `amsthm` | Theorem environments (theorem, proof, lemma) |
| `geometry` | Page margins |
| `hyperref` | Clickable links, PDF metadata |
| `graphicx` | Image inclusion |
| `booktabs` | Professional tables |
| `natbib` | Bibliography management |
| `tikz` | Diagrams and figures |
| `pgfplots` | Graphs and charts |
| `xcolor` | Colored text and math |
| `enumitem` | Customizable lists |

## Math Notation Reference

### Inline vs Display

| Style | LaTeX | Output |
|-------|-------|--------|
| Inline | `$x^2 + y^2 = z^2$` | inline equation |
| Display | `\[ x^2 + y^2 = z^2 \]` | centered, no number |
| Display (numbered) | `\begin{equation} x^2 + y^2 = z^2 \end{equation}` | centered, numbered |

### Basic Notation

```
Fractions:     \frac{a}{b}
Exponents:     x^{n+1}
Subscripts:    a_{i}
Square root:   \sqrt{x} or \sqrt[n]{x}
Sum:           \sum_{i=1}^{n} x_i
Integral:      \int_{a}^{b} f(x)\,dx
Limit:         \lim_{x \to 0} f(x)
Product:       \prod_{i=1}^{n} x_i
```

### Advanced Notation

```
Matrices:
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}

Cases:
f(x) = \begin{cases}
x^2 & x \geq 0 \\
-x & x < 0
\end{cases}

Dots:  \dots  \cdots  \vdots  \ddots
```

### Greek Letters

```
\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta,
\kappa, \lambda, \mu, \nu, \xi, \pi, \rho, \sigma, \tau,
\phi, \chi, \psi, \omega

Capital: \Gamma, \Delta, \Theta, \Lambda, \Xi, \Pi, \Sigma, \Phi, \Psi, \Omega
```

### Common Symbols

```
\in              ∈ (element of)
\subset          ⊂
\subseteq        ⊆
\cup             ∪
\cap             ∩
\emptyset        ∅
\nabla           ∇
\partial         ∂
\infty           ∞
\approx          ≈
\equiv           ≡
\implies         ⇒
\iff             ⇔
\forall          ∀
\exists          ∃
\propto          ∝
\pm              ±
\circ            ∘
\to              →
\mapsto          ↦
```

## Multi-Line Equation Environments

### align (multiple lines, aligned at &)
```latex
\begin{align}
f(x) &= x^2 + 2x + 1 \\
     &= (x + 1)^2
\end{align}
```

### gather (multiple lines, centered)
```latex
\begin{gather}
x + y = 3 \\
2x - y = 1
\end{gather}
```

### multline (one equation split across lines)
```latex
\begin{multline}
f(x) = a + b + c + d + e \\
      + f + g + h + i
\end{multline}
```

## Theorems and Proofs

### Setup
```latex
\theoremstyle{plain}
\newtheorem{theorem}{Theorem}[section]
\newtheorem{lemma}[theorem]{Lemma}
\newtheorem{corollary}[theorem]{Corollary}

\theoremstyle{definition}
\newtheorem{definition}{Definition}[section]
\newtheorem{example}[definition]{Example}

\theoremstyle{remark}
\newtheorem{remark}{Remark}
```

### Usage
```latex
\begin{theorem}[Pythagoras]
In any right triangle with legs $a$, $b$ and hypotenuse $c$,
$a^2 + b^2 = c^2$.
\end{theorem}

\begin{proof}
Consider a square of side $a + b$...
\end{proof}
```

## Custom Commands

### Defining macros
```latex
% Vectors
\newcommand{\vec}[1]{\mathbf{#1}}

% Reals, integers, etc.
\newcommand{\R}{\mathbb{R}}
\newcommand{\Z}{\mathbb{Z}}
\newcommand{\N}{\mathbb{N}}

% Derivatives
\newcommand{\dd}[1]{\mathrm{d}#1}
\newcommand{\dv}[2]{\frac{\dd{#1}}{\dd{#2}}}

% Angle brackets
\newcommand{\ang}[1]{\langle #1 \rangle}

% Absolute value
\newcommand{\abs}[1]{\lvert #1 \rvert}
```

## TikZ Diagrams

### Basic triangle
```latex
\begin{tikzpicture}
\draw (0,0) -- (4,0) -- (2,3) -- cycle;
\draw (0,0) node[below] {$A$};
\draw (4,0) node[below] {$B$};
\draw (2,3) node[above] {$C$};
\end{tikzpicture}
```

### Function graph
```latex
\begin{tikzpicture}
\draw[->] (-3,0) -- (3,0) node[right] {$x$};
\draw[->] (0,-1) -- (0,5) node[above] {$y$};
\draw[domain=-2:2, smooth, thick] plot (\x, \x*\x) node[right] {$f(x)=x^2$};
\draw (0,0) node[below left] {$O$};
\end{tikzpicture}
```

## Tables

### Basic table
```latex
\begin{tabular}{|c|c|c|}
\hline
$x$ & $f(x)$ & $g(x)$ \\
\hline
0 & 1 & 2 \\
1 & 2 & 4 \\
2 & 4 & 8 \\
\hline
\end{tabular}
```

### Booktabs (professional)
```latex
\usepackage{booktabs}
\begin{tabular}{lrr}
\toprule
Variable & Mean & SD \\
\midrule
Age & 25.3 & 4.2 \\
Height & 170.1 & 8.5 \\
\bottomrule
\end{tabular}
```

## Figures

```latex
\begin{figure}[htbp]
\centering
\includegraphics[width=0.6\textwidth]{figure.png}
\caption{Description of the figure}
\label{fig:label}
\end{figure}
```

## Bibliographies

### natbib
```latex
\usepackage{natbib}
\bibliographystyle{plainnat}
\bibliography{references}
```

### Citation styles
```latex
\citet{key}   → Author (Year)
\citep{key}   → (Author, Year)
```

## Complete Document Templates

### Homework template
```latex
\documentclass[12pt]{article}
\usepackage{amsmath, amssymb, amsthm}
\usepackage[margin=1in]{geometry}
\setlength{\parindent}{0pt}

\newcommand{\R}{\mathbb{R}}

\begin{document}

\textbf{Name:} Student
\hfill
\textbf{Math 101 - Homework 3}

\vspace{0.5cm}

\textbf{Problem 1.} Solve $2x + 3 = 11$.

\begin{proof}[Solution]
$2x + 3 = 11$ \\
$2x = 8$ \\
$x = 4$

Check: $2(4) + 3 = 8 + 3 = 11$. $\square$
\end{proof}

\end{document}
```

### Beamer slide template
```latex
\documentclass{beamer}
\usetheme{Madrid}
\usepackage{amsmath, amssymb}

\title{The Quadratic Formula}
\author{Math Tutor}

\begin{document}

\begin{frame}
\titlepage
\end{frame}

\begin{frame}{Derivation}
\begin{align*}
ax^2 + bx + c &= 0 \\
x^2 + \frac{b}{a}x &= -\frac{c}{a} \\
\left(x + \frac{b}{2a}\right)^2 &= \frac{b^2 - 4ac}{4a^2} \\
x &= \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
\end{align*}
\end{frame}

\end{document}
```

## Best Practices

1. **Semantic markup**: Use `\begin{theorem}` not `\textbf{Theorem.}`
2. **Consistent spacing**: Use `\,` before differentials, `\ ` after punctuation
3. **Macros for repeated notation**: Define `\R`, `\Z` once
4. **Label and reference**: Use `\label{eq:quadratic}` and `\eqref{eq:quadratic}`
5. **Avoid over-nesting**: Keep document structure flat
6. **Use `\[ ... \]`**: Not `$$ ... $$` (better spacing and LaTeX support)
7. **Comment complex code**: `% This is a comment`
8. **Break long lines**: At operators or punctuation for readability

## Debugging Common Errors

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| `! Missing $ inserted` | Math outside math mode | Wrap in `$` or `\[ \]` |
| `! Extra } or forgotten $` | Mismatched braces | Check `{` `}` pairing |
| `! Undefined control sequence` | Missing package or typo | Check spelling, load package |
| `! Missing \right. inserted` | `\left` without `\right` on same line | Add `\right.` |
| `! File ended while scanning` | Unclosed environment | Check `\begin`/`\end` match |

## Output

Return complete, compilable LaTeX code. Include:
1. Document preamble with appropriate packages
2. Content with proper math formatting
3. Comments explaining key sections
4. Instructions on how to compile
