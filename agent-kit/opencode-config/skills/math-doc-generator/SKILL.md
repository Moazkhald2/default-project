# Math Document Generator

Generate math documents in multiple formats: LaTeX/PDF, HTML, Markdown, DOCX, and plain text.

## When to Use

- User asks to create a math lesson, handout, test, exam, solution set, study guide, or syllabus
- User needs a document exported to a specific format (PDF, HTML, DOCX, etc.)
- User wants a complete, styled math document ready for distribution

## Workflow

1. **Ask**: document type, topic, grade/level, output format, any special requirements
2. **Generate**: full document content in requested format
3. **Export**: provide instructions for rendering/distribution

## Output Formats

### LaTeX / PDF

Complete compilable LaTeX. Use the appropriate document class:

```latex
% --- Article (lessons, handouts, study guides) ---
\documentclass[11pt]{article}
\usepackage{amsmath,amssymb,amsfonts,amsthm}
\usepackage{geometry,enumitem,hyperref,xcolor,tikz}
\geometry{margin=1in}
\setlength{\parindent}{0pt}

% --- Exam (tests, quizzes) ---
\documentclass[11pt]{exam}
\usepackage{amsmath,amssymb,amsfonts}
\usepackage{geometry,hyperref}
\geometry{margin=0.75in}
\pointpoints{point}{points}
\bonuspointpoints{bonus point}{bonus points}
\renewcommand{\solutiontitle}{\noindent\textbf{Solution:}\enspace}

% --- Book (full courses, syllabi) ---
\documentclass[11pt]{book}
\usepackage{amsmath,amssymb,amsfonts,amsthm}
\usepackage{geometry,hyperref,imakeidx}
\geometry{margin=1in}
\newtheorem{theorem}{Theorem}[chapter]
\newtheorem{definition}{Definition}[chapter]
```

#### Lesson Notes Template

```latex
\documentclass[11pt]{article}
\usepackage{amsmath,amssymb,amsfonts,amsthm}
\usepackage{geometry,enumitem,tikz}
\geometry{margin=1in}
\setlength{\parindent}{0pt}

\title{LESSON TITLE}
\author{SUBJECT | Grade LEVEL}
\date{DATE}

\begin{document}
\maketitle

\section*{Learning Objectives}
\begin{itemize}
  \item Objective 1
  \item Objective 2
  \item Objective 3
\end{itemize}

\section*{Warm-Up}
% 2-3 review problems activating prior knowledge

\section*{Explanation}
% Core content with definitions, theorems, examples

\subsection*{Example 1}
\begin{align*}
  % Worked example
\end{align*}

\section*{Guided Practice}
% Problems worked together

\section*{Independent Practice}
% Problems for students

\section*{Summary}
% Key takeaways

\section*{Exit Ticket}
% 1-2 quick checks

\end{document}
```

#### Exam Template

```latex
\documentclass[11pt]{exam}
\usepackage{amsmath,amssymb,amsfonts}
\usepackage{geometry}
\geometry{margin=0.75in}

\pointpoints{point}{points}
\bonuspointpoints{bonus point}{bonus points}
\renewcommand{\solutiontitle}{\noindent\textbf{Solution:}\enspace}

\printanswers % Comment out to hide solutions

\begin{document}

\begin{center}
\large\textbf{EXAM TITLE}\\
\vspace{0.2cm}
\normalsize SUBJECT | DATE \\
\vspace{0.1cm}
Name: \underline{\hspace{5cm}} \hfill Total: \underline{\hspace{1.5cm}}/100
\end{center}

\vspace{0.3cm}

\instructions{
  \begin{itemize}
    \item Time allowed: 60 minutes.
    \item Show all work for full credit.
    \item No calculators permitted.
    \item This exam has \numquestions\ questions on \numpages\ pages.
  \end{itemize}
}

\begin{questions}

\question[10]
Problem statement.
\begin{solution}
Solution here.
\end{solution}

\question
Multi-part question.
\begin{parts}
  \part[5] Part (a)
  \begin{solution}
  Solution for (a).
  \end{solution}
  \part[5] Part (b)
  \begin{solution}
  Solution for (b).
  \end{solution}
\end{parts}

\bonusquestion[5]
Bonus problem.
\begin{solution}
Bonus solution.
\end{solution}

\end{questions}

\newpage
\section*{Answer Key}
\begin{enumerate}
  \item Answer 1
  \item Answer 2
\end{enumerate}

\end{document}
```

### HTML (MathJax / KaTeX)

Self-contained HTML for web publishing.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document Title</title>
<!-- KaTeX (faster, no jQuery) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body, {delimiters: [
    {left: '$$', right: '$$', display: true},
    {left: '$', right: '$', display: false}
  ]});"></script>
<style>
  body { font-family: 'Segoe UI', system-ui, sans-serif; max-width: 800px; margin: 2em auto; padding: 0 1em; line-height: 1.6; color: #1a1a1a; }
  h1 { border-bottom: 2px solid #2563eb; padding-bottom: 0.3em; }
  h2 { color: #2563eb; margin-top: 1.5em; }
  .example { background: #f0f9ff; padding: 1em; border-left: 4px solid #2563eb; margin: 1em 0; border-radius: 0 4px 4px 0; }
  .problem { background: #fafafa; padding: 1em; border: 1px solid #e5e5e5; margin: 0.5em 0; border-radius: 4px; }
  .solution { background: #f0fdf4; padding: 1em; border-left: 4px solid #16a34a; margin: 0.5em 0 1em 0; border-radius: 0 4px 4px 0; display: none; }
  .solution-toggle { cursor: pointer; color: #2563eb; text-decoration: underline; }
  .objective { background: #fefce8; padding: 0.5em 1em; border-left: 4px solid #eab308; margin: 1em 0; border-radius: 0 4px 4px 0; }
  table { border-collapse: collapse; width: 100%; margin: 1em 0; }
  th, td { border: 1px solid #d1d5db; padding: 0.5em; text-align: left; }
  th { background: #f3f4f6; }
  .equation-number { float: right; color: #6b7280; }
  @media (prefers-color-scheme: dark) {
    body { background: #0f172a; color: #e2e8f0; }
    h2 { color: #60a5fa; }
    .example { background: #1e293b; border-left-color: #60a5fa; }
    .problem { background: #1e293b; border-color: #334155; }
    .solution { background: #052e16; border-left-color: #22c55e; }
    .objective { background: #422006; border-left-color: #eab308; }
    th { background: #1e293b; }
    th, td { border-color: #334155; }
  }
</style>
</head>
<body>

<h1>Document Title</h1>
<p class="objective"><strong>Objectives:</strong> Objective 1 &bull; Objective 2</p>

<h2>Section Title</h2>
<p>Content with inline math: $E = mc^2$ and display math:</p>
$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

<div class="example">
  <strong>Example 1:</strong> Solve $2x + 3 = 7$.
  <div class="solution">
    $2x + 3 = 7 \implies 2x = 4 \implies x = 2$
  </div>
</div>

<h2>Practice Problems</h2>
<div class="problem">1. Problem text here.</div>
<div class="problem">2. Problem text here.</div>

<h2>Answer Key</h2>
<ol>
  <li>Answer 1</li>
  <li>Answer 2</li>
</ol>

</body>
</html>
```

### Markdown (GitHub + VS Code mdmath + LMS KaTeX — unified)

Readable math docs using LaTeX notation in markdown. **Delimiter rule:** use `dollars` (`$...$` inline, `$$...$$` display) — compatible with VS Code mdmath (422k installs), GitHub MathJax (May 2022), and LMS KaTeX (katex@0.16.9). Set `mdmath.delimiters: "dollars"` in `.vscode/settings.json`.

- For HTML export use KaTeX auto-render delimiters `{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}` (see HTML template below)
- GitHub renders same delimiters via MathJax natively — no extra CI
- VS Code mdmath provides live preview + `Ctrl+K ,` save HTML / `Ctrl+K T` ToC — recommend extension `goessner.mdmath` in `.vscode/extensions.json`

```markdown
# Document Title

**Subject:** Algebra I | **Grade:** 9 | **Date:** 2026-07-26

## Learning Objectives

- Solve linear equations in one variable
- Apply the distributive property to simplify expressions
- Check solutions by substitution

## Key Concepts

### Linear Equations

A **linear equation** has the form $ax + b = c$ where $a \neq 0$.

**Steps to solve:**
1. Simplify both sides (distribute, combine like terms)
2. Move variable terms to one side
3. Move constant terms to the other side
4. Divide by the coefficient

## Worked Examples

### Example 1: Basic Equation

Solve $3x + 5 = 20$.

$$
\begin{aligned}
3x + 5 &= 20 \\
3x &= 15 \\
x &= 5
\end{aligned}
$$

**Check:** $3(5) + 5 = 15 + 5 = 20 \checkmark$

## Practice Problems

| Problem | Answer |
|---------|--------|
| $2x - 7 = 11$ | $x = 9$ |
| $5(x + 2) = 25$ | $x = 3$ |
| $\frac{x}{4} + 3 = 7$ | $x = 16$ |

## Summary

- Isolate the variable using inverse operations
- Always check your solution
- Equations can have one solution, no solution ($0 = 5$), or infinitely many ($0 = 0$)
```

### DOCX (via Pandoc)

To generate DOCX from markdown: `pandoc document.md -o document.docx --mathjax`

Or provide manual Word formatting instructions with table-based layouts.

### Plain Text

```text
=== LESSON: SOLVING LINEAR EQUATIONS ===
Subject: Algebra I | Grade: 9

OBJECTIVES:
- Solve ax + b = c equations
- Use the distributive property

KEY FORMULA:
  If ax + b = c, then x = (c - b) / a, where a != 0

STEPS:
  1. Simplify both sides
  2. Move variable terms to left
  3. Move constants to right
  4. Divide by coefficient

EXAMPLE:
  Solve 3x + 5 = 20
  3x + 5 = 20
  3x = 15
  x = 5
  Check: 3(5) + 5 = 20 v

PRACTICE:
  1. 2x - 7 = 11  -> x = 9
  2. 5(x + 2) = 25 -> x = 3
  3. x/4 + 3 = 7  -> x = 16
```

## Document Types

### Lesson Notes

Structure: Objectives → Warm-Up → Explanation → Examples → Guided Practice → Independent Practice → Summary → Exit Ticket

### Handouts

Structure: Topic header → Key formulas → 2-3 worked examples → Quick practice (4-6 problems) → Answers

### Tests / Exams

Structure: Header (title, subject, date, name line, total points) → Instructions → Sections (multiple choice, short answer, extended response, bonus) → Points per question → Space for work → Answer key (separate)

### Solutions

Structure: Problem statement → Step-by-step solution → Final answer boxed → Grading rubric (point allocation per step)

### Study Guides

Structure: Organized by topic/module → Key definitions → Formulas → Common mistakes → Practice problems with answers → Cross-references to textbook sections

### Syllabus

Structure: Course title & description → Prerequisites → Learning outcomes → Textbook & materials → Schedule (weekly topics, assignments, exams) → Grading policy → Classroom policies → Important dates

## Format Export Instructions

| Format | Tool | Command |
|--------|------|---------|
| LaTeX → PDF | `pdflatex` | `pdflatex document.tex` (run 2x for references) |
| HTML | Any browser | Open file directly |
| Markdown → PDF | `pandoc` | `pandoc doc.md -o doc.pdf --pdf-engine=xelatex` |
| Markdown → DOCX | `pandoc` | `pandoc doc.md -o doc.docx` |
| LaTeX → DOCX | `pandoc` | `pandoc doc.tex -o doc.docx` |
| HTML → PDF | Browser print | Ctrl+P → Save as PDF |

## User Prompt Examples

- "Create a lesson on quadratic functions for grade 10"
- "Make a calculus final exam with 10 questions and an answer key"
- "Generate a study guide for trigonometry identities"
- "Create an HTML handout on the Pythagorean theorem"
- "Build a syllabus for Introduction to Statistics"
- "Export this lesson as DOCX and PDF"
