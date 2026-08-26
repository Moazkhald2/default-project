# Worksheet Designer

Skill for designing visually appealing math worksheets. Use when the user asks to create a worksheet, practice problems, quiz, or homework assignment.

## Layout Principles

### Grid & Spacing
- Problems arranged in a grid: 2 columns for elementary, 2-3 for middle, 3-4 for high school
- Consistent spacing: `0.5in` between problems within a column, `1in` between columns
- Margins: `0.75in` all sides (elementary), `0.5in` (high school)
- Workspace: `2-3in` blank space below each problem (elementary), `1-1.5in` (high school)

### Header Block
```
┌────────────────────────────────────────────┐
│  Topic: Solving Linear Equations           │
│  Name: __________________  Date: ________  │
│  Score: ___ / 20                          │
└────────────────────────────────────────────┘
```

### Visual Elements
- **Answer boxes**: `\boxed{}` in LaTeX, `border: 2px solid #333;` in CSS
- **Fill-in underlines**: `\underline{\hspace{2cm}}` in LaTeX, `border-bottom: 2px dotted #999;` in CSS
- **Problem numbers**: `\bigcirc{1}` or `\textbf{1.}` — circled for elementary, bold number for older
- **Progress checkboxes**: `☐` at start of each problem row
- **Section dividers**: thin horizontal rule (`\hline` or `border-top`)

## Worksheet Types

### 1. Drill Practice
- 20-30 problems, increasing difficulty in quartiles
- First 25%: basic recall, 25-50%: simple application, 50-75%: multi-step, 75-100%: challenge
- Answer key: same layout, answers in `\textcolor{red}{}` or `.correct { color: #c00; }`

### 2. Puzzle Worksheets
- **Crossword**: grid with math terms. Across/down clues are problems. Grid size: 10x10 to 15x15
- **Word search**: 12-15 math terms hidden. Below: definitions as clues
- **Code breaker**: solve → map answer digit to letter → reveal message
  ```
  Solve:   A = 3+2  B = 10-4  C = 2×3 ...
  Message: _ _ _   _ _ _ _   (A C B) → "5 6 6"
  ```

### 3. Color-by-Number
- Grid of 20-30 problems, each answer maps to a color
- `answer_map = {2: "#FF0000", 5: "#00AA00", -1: "#0000FF", ...}`
- Image: simple geometric design or character outline
- Provide a color key at bottom

### 4. Maze
- Entrance at top-left, exit at bottom-right
- Each junction has a problem. Correct answer → correct path, wrong → dead end
- Maze grid: 6x6 (elementary) to 10x10 (high school)
- Layout: each cell contains a small problem
- Answer key: highlight the correct path

### 5. Scavenger Hunt
- 10-15 cards/stations, each with a problem and a "next clue" code
- Problem A answer → directs to station D, etc.
- Student records: station letter, problem, answer, next station
- Layout: cards are 1/4 page each, cut and posted around room

### 6. Real-World Application
- 5-8 themed word problems (sports, money, cooking, travel)
- Each includes context paragraph + 1-3 sub-questions
- Visual: small icon/illustration per theme (use emoji or SVG)
- Workspace: large blank area for showing work

### 7. Mixed Review
- 15-20 problems covering 3-4 topic areas
- Sections with headers: "Part A: Fractions", "Part B: Decimals", etc.
- Each section: 4-6 problems, labeled with topic icon

## Grade Levels

### Elementary (K-5)
| Element | Specification |
|---------|--------------|
| Text size | 16pt body, 20pt problems, 24pt title |
| Font | Comic Sans MS, Arial, or KG Primary Penmanship |
| Page layout | Large margins (1in), lots of whitespace |
| Decorations | Fun border, emoji icons next to problems |
| Workspace | Full-width blank box per problem |
| Answer boxes | Large, dashed outline |
| Max problems | 10-15 per page |

### Middle School (6-8)
| Element | Specification |
|---------|--------------|
| Text size | 12pt body, 14pt problems, 18pt title |
| Font | Arial, Helvetica, Lato (sans-serif) |
| Page layout | 2-column grid, 0.75in margins |
| Decorations | Thin border, section headers with small icons |
| Workspace | Half-width lined space per problem |
| Max problems | 20-25 per page |

### High School (9-12)
| Element | Specification |
|---------|--------------|
| Text size | 11pt body, 12pt problems, 16pt title |
| Font | Computer Modern, Georgia, Noto Serif |
| Page layout | 3-column grid, 0.5in margins |
| Decorations | Minimal — clean lines only |
| Workspace | Compact inset box or adjacent space |
| Max problems | 25-35 per page |

### College
| Element | Specification |
|---------|--------------|
| Text size | 10pt body, 11pt problems, 14pt title |
| Font | Computer Modern (LaTeX default) |
| Page layout | 3-4 column, 0.5in margins, tight |
| Decorations | None — publication quality |
| Workspace | Minimal (scratch paper assumed) |
| Max problems | 30-50 per page |

## Output Formats

### LaTeX (exam class)

```latex
\documentclass[12pt]{exam}
\usepackage{amsmath, amssymb, graphicx, xcolor}
\pagestyle{headandfoot}
\header{\textbf{Topic: Linear Equations}}{}{Name: \rule{3cm}{0.4pt}}
\footer{}{Page \thepage}{Date: \rule{3cm}{0.4pt}}
\pointpoints{pt}{pts}
\marginpointname{pt}

\begin{document}
\begin{questions}
\question[2] Solve for $x$:
  \[ 3x + 7 = 22 \]
  \answerline

\question[3] Solve and graph:
  \[ 2(x - 4) + 3 = 11 \]
  \fillwithlines{3cm}

\question[4] Write and solve an equation:
  \textit{Three times a number plus five equals twenty. Find the number.}
  \fillwithlines{4cm}
\end{questions}
\end{document}
```

### HTML/CSS (Web)

```html
<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: 'Arial', sans-serif;
    margin: 0.75in;
    font-size: 14pt;
  }
  .header {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 3px solid #2c5282;
    padding-bottom: 12px;
    margin-bottom: 20px;
  }
  .header h1 { font-size: 18pt; color: #2c5282; margin: 0; }
  .header .info { font-size: 12pt; text-align: right; }
  .header .info input {
    border: none;
    border-bottom: 1px solid #999;
    width: 120px;
    font-size: 12pt;
  }
  .problems { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .problem {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    page-break-inside: avoid;
  }
  .problem-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px; height: 28px;
    border-radius: 50%;
    background: #2c5282;
    color: white;
    font-weight: bold;
    font-size: 12pt;
    margin-right: 8px;
  }
  .problem .pts { font-size: 10pt; color: #718096; }
  .answer-line { border-bottom: 2px dotted #a0aec0; margin-top: 12px; padding-bottom: 4px; }
  .workspace { min-height: 60px; background: #f7fafc; border-radius: 4px; margin-top: 8px; }
  .checkbox { width: 18px; height: 18px; border: 2px solid #4a5568; border-radius: 3px; display: inline-block; margin-right: 8px; vertical-align: middle; }

  /* Answer Key */
  .correct { color: #c53030; font-weight: bold; }
</style>
</head>
<body>

<div class="header">
  <div>
    <h1>Solving Linear Equations</h1>
    <div style="margin-top:4px; font-size:11pt; color:#666;">
      Name: <input type="text"> &nbsp; Date: <input type="text"> &nbsp;
      Score: <span style="border:1px solid #999; padding:2px 8px;">/20</span>
    </div>
  </div>
</div>

<div class="problems">
  <div class="problem">
    <span class="problem-num">1</span>
    <span class="pts">[2 pts]</span>
    <p>Solve for <em>x</em>: <strong>3x + 7 = 22</strong></p>
    <div class="answer-line"></div>
    <div class="workspace"></div>
  </div>
  <div class="problem">
    <span class="problem-num">2</span>
    <span class="pts">[3 pts]</span>
    <p>Solve: <strong>2(x − 4) + 3 = 11</strong></p>
    <div class="answer-line"></div>
    <div class="workspace"></div>
  </div>
</div>

</body>
</html>
```

### Answer Key Layout

```latex
% Answer key — same layout, add \AnswerKey command or
\printanswers
\renewcommand{\answer}{\textcolor{red}{\textbf{Ans: }}}
```

In HTML:
```css
.answer-key .answer {
  color: #c53030;
  font-weight: 600;
  font-style: italic;
}
.answer-key .problem { opacity: 0.7; }
```

## Quick Checklist

- Header with topic, name, date, score box
- Clear problem numbering with visual hierarchy
- Consistent spacing and margins per grade level
- Workspace adequate for scratch work
- Answer key provided (red italic answers, reduced opacity)
- Page count appropriate (1-2 pages for elementary, 1-4 for older)
- Font size matches grade level spec
- Instructions at top: clear, bold, 1-2 sentences
