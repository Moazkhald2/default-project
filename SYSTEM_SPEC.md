# SYSTEM SPECIFICATION & BRAND DESIGN SYSTEM

**The Math Mentor (`themathmentor.edu`) · Complete Brand Identity & Technical Execution Spec**  
_Unified Specification v2.0 — Consolidated from Brand Archives, Workbooks, LaTeX Styles, Typst Templates, and Exam Systems_

---

## 1. Brand Foundations & Identity Architecture

### 1.1 Brand Identity Overview

- **Brand Name**: The Math Mentor
- **Legal & Display Attribution**:
  ```
  Created by Mr/Moaz Khaled · Designed by Joe for Designs · All rights reserved to the author
  www.themathmentor.edu · @themathmentor
  ```
- **Founding Vision & Core Philosophy**:
  The Math Mentor combines mathematical precision with warm, empathetic pedagogy. Rooted in the visual elegance of foundational math symbols (the rotated summation $\Sigma$, letter $M$, arithmetic operations, and geometric constructs), the identity balances a **meritocratic framework** (hard work yielding tangible mastery) with a **tender, supportive environment** (low-anxiety, confidence-building guidance).

### 1.2 Official Taglines & Brand Slogans

| Context                    | Slogan / Copy                                                                                | Placement & Usage                                                |
| -------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Core Brand Slogan**      | _"The Lesson Counts."_                                                                       | Worksheets, footer signature, merchandise, video end-screens     |
| **Action & Mastery Motto** | _"Learn It. Do It. Own It."_                                                                 | Unit wrap-ups, closing cards (`closingbox`), achievement screens |
| **Cover Series Banner**    | _"THE COMPLETE TOOLBOX SERIES"_ / _"PRE-YEAR WORKBOOK SERIES"_                               | Front cover top headers, promotional banners                     |
| **Motivational Alternate** | _"Math You Champion"_ / _"It's no lie, I can multiply"_                                      | Social media graphics, elementary cards, stickers                |
| **Symbolic Tagline**       | _"Have $\pi$ in your pocket"_                                                                | Merch, stationery, secondary covers                              |
| **Mission Statement**      | _"Providing personalized guidance and support to help students reach their full potential."_ | Brand collateral, curriculum intro pages, web portal             |

### 1.3 Audience & Demographic Distribution

- **Students (75%)**: Core learners across Primary (Grades 4–6), Preparatory / Middle School (Grades 7–9), and Secondary / High School (Grades 10–12). Need step-by-step scaffolding, minimal visual clutter, high contrast, and encouraging tone.
- **Parents (15%)**: Seek transparent curriculum tracking, rigorous answer keys, and clear indicators of academic progress.
- **Colleagues & Educators (10%)**: Require clean modular templates, standard mathematical notation, and automated question-bank pipelines.

---

## 2. Visual Brand Tokens & Color Palette

### 2.1 Historical Reconciliation & Palette Unification

The brand archive historically featured 3 overlapping palettes:

1. **2024 Brand Identity PDF**: Mediterranean Blue (`#1982C4`), Inkwell Inception (`#2C2C31`), Gale Green (`#00784A`), Radiant Yellow (`#E8BB1A`).
2. **Artwork & HTML Exams**: Deep Green/Teal (`#006040`), Deep Red (`#C0392B`), Amber Gold (`#E0A000` / `#B8860B`), Warm Cream (`#FDF6E3` / `#FAF6EE`).
3. **LaTeX / Typst House v2 (`themathmentor.sty` / `house.sty` / `theme.json`)**: Deep Teal (`#0A9396`), Deep Navy (`#1A1A2E`), Cyan (`#01CBFC`), Light Terracotta (`#E76F51`), Sage (`#84A98C`), Gold (`#D4A373`), Paper (`#FAF9F6`).

**Unified Standard Decision**: The **House v2 / Artwork Unified Token Set** is the canonical standard for all code builds, publications, and digital applications.

### 2.2 Core Color Tokens

| Token Name               | Hex Code  | RGB               | HSL               | Semantic Role & UI Application                                          |
| ------------------------ | --------- | ----------------- | ----------------- | ----------------------------------------------------------------------- |
| `tmm-teal` / `primary`   | `#0A9396` | `(10, 147, 150)`  | `181°, 88%, 31%`  | Primary brand color, section titles, key rules, primary buttons         |
| `tmm-teal-light`         | `#E6F5F5` | `(230, 245, 245)` | `180°, 43%, 93%`  | Background for Worked Examples (I Do) and Tip cards                     |
| `tmm-teal-dark`          | `#0A6F72` | `(10, 111, 114)`  | `182°, 84%, 24%`  | Dark contrast title text for teal-bordered cards                        |
| `tmm-navy`               | `#1A1A2E` | `(26, 26, 46)`    | `240°, 28%, 14%`  | Cover background gradients, heavy headers, dark callouts, closing boxes |
| `tmm-cyan` / `secondary` | `#01CBFC` | `(1, 203, 252)`   | `192°, 99%, 50%`  | Secondary accent, sub-bullet badges, highlights, links                  |
| `tmm-cyan-light`         | `#E0FAFF` | `(224, 250, 255)` | `190°, 100%, 94%` | Theorem & property callout backgrounds                                  |
| `tmm-gold` / `accent`    | `#D4A373` | `(212, 163, 115)` | `30°, 54%, 64%`   | Rule cards, star achievements, cover rules, badges                      |
| `tmm-gold-light`         | `#FAF3E7` | `(250, 243, 231)` | `38°, 66%, 94%`   | Background for Key Rule cards                                           |
| `tmm-gold-dark`          | `#8A5A1E` | `(138, 90, 30)`   | `33°, 64%, 33%`   | Dark text on gold-tinted backgrounds                                    |
| `tmm-terra` / `danger`   | `#E76F51` | `(231, 111, 81)`  | `12°, 77%, 61%`   | Common Mistakes, caution badges, algebraic traps                        |
| `tmm-terra-light`        | `#FDF0ED` | `(253, 240, 237)` | `11°, 80%, 96%`   | Background for Common Mistakes cards                                    |
| `tmm-terra-dark`         | `#9C3B22` | `(156, 59, 34)`   | `12°, 64%, 37%`   | Header text for error warnings                                          |
| `tmm-sage` / `success`   | `#84A98C` | `(132, 169, 140)` | `133°, 18%, 59%`  | You Do practice cards, correct step badges, success notes               |
| `tmm-sage-light`         | `#EEF3EF` | `(238, 243, 239)` | `132°, 18%, 94%`  | Background for You Do student workspace cards                           |
| `tmm-sage-dark`          | `#3E5F4A` | `(62, 95, 74)`    | `142°, 21%, 31%`  | Workspace card titles and header accents                                |
| `tmm-ink` / `body`       | `#2D3436` | `(45, 52, 54)`    | `193°, 9%, 19%`   | Primary text color, vector diagram strokes, table borders               |
| `tmm-muted`              | `#636E72` | `(99, 110, 114)`  | `196°, 7%, 42%`   | Subtitles, footer text, teacher thinking prompts, meta                  |
| `tmm-paper`              | `#FAF9F6` | `(250, 249, 246)` | `45°, 25%, 97%`   | Self-check card background, answer key box fill, print tint             |
| `tmm-white`              | `#FFFFFF` | `(255, 255, 255)` | `0°, 0%, 100%`    | Card backgrounds, knockout logos, white text on dark cards              |

### 2.3 Translucent Blends & Frame Rules

To maintain print sharpness and rendering consistency, translucent elements use defined tints:

- **Card Left Stroke**: `2.5pt` solid accent color (`teal`, `gold`, `terra`, `sage`).
- **Card Outer Frame**: `0.5pt` with `70%` white mix (`accent.transparentize(70%)`).
- **Header Divider Line**: `0.6pt` with `65%` white mix (`#A9D9DA`).
- **Self-Check / AK Outer Box**: `0.8pt` with `55%` white mix (`#90CECF`).
- **Workspace Inner Box**: `1.0pt` with `45%` white mix (`#BBCFBF`).

### 2.4 Curriculum Grade Accent Colors

Each academic grade is assigned an accent color for covers, skill badges, and progress tracks:

```
Grade 4  : Terracotta     #E76F51  (Foundational arithmetic & shapes)
Grade 5  : Warm Amber     #CF7B1D  (Fractions, decimals, & early geometry)
Grade 6  : Berry Rose     #B33A63  (Ratios, proportions, & integers)
Grade 7  : Cobalt Blue    #2980B9  (Prep 1: Algebraic terms, parallel lines)
Grade 8  : Violet Purple  #8E44AD  (Prep 2: Real numbers, factorization, triangles)
Grade 9  : Deep Purple    #6C3483  (Prep 3: Linear equations, circle theorems)
Grade 10 : Brand Teal     #0A9396  (Sec 1: Quadratic equations, trigonometry)
Grade 11 : Navy Blue      #1A1A2E  (Sec 2: Advanced calculus, matrices)
```

### 2.5 Assessment & Difficulty Semantic Colors

- **Level 1 (Easy / Direct)**: Green `#27AE60` / `#2ECC71`
- **Level 2 (Medium / Multi-step)**: Blue `#2980B9` / `#2563EB`
- **Level 3 (Hard / Advanced)**: Purple/Orange `#8E44AD` / `#D97706`
- **Level 4 / Challenge (Extreme)**: Red/Violet `#C0392B` / `#7C3AED`

---

## 3. Typography & Typesetting Hierarchy

### 3.1 Font Stacks by Target Engine

| Target Output                      | Display / Headings            | Body Text                    | Math Rendering               | Fallback                    |
| ---------------------------------- | ----------------------------- | ---------------------------- | ---------------------------- | --------------------------- |
| **Typst Documents**                | `Century Gothic` (Bold)       | `Palatino Linotype` (10.5pt) | Typst Math Engine (`$...$`)  | `Liberation Serif`, `Arial` |
| **LaTeX Documents (Single-Stack)** | `Lato` (`\sffamily\bfseries`) | `Lato` (`\sffamily`, 10.5pt) | `amsmath`, `amssymb`, `Lato` | Computer Modern Sans        |
| **LaTeX Documents (Dual-Stack)**   | `TeX Gyre Adventor` (`qag`)   | `newpxtext` (Palatino)       | `newpxmath`                  | Times Roman                 |
| **Web & Interactive Exams**        | `Playfair Display` / `Lexend` | `Lexend` (Light/Regular)     | KaTeX (`0.16.9` auto-render) | System Sans-Serif           |
| **Bilingual Arabic Headers**       | `Amiri` (Bold 700)            | `Amiri` (Regular 400)        | Native / Latin math scripts  | Traditional Arabic          |

### 3.2 Typesetting & Legibility Rules

1. **Minimum Body Font Size**: Body copy must never drop below **10.5pt** (**11pt** preferred; **12pt** for Primary Grades 4–6).
2. **Line Leading**: Set paragraph leading to `1.1em` to `1.2em` (`\setstretch{1.12}`).
3. **Line Measure**: Restrict text blocks to **45–75 characters per line** for optimal reading speed and comprehension.
4. **Header / Body Contrast**: Headers use clean geometric sans-serif faces (`Century Gothic` / `Lato` / `Montserrat`) to contrast against warm serif body text (`Palatino` / `newpxtext`).
5. **Mathematical Variable Style**: In text, math is wrapped in `$...$`. Multi-letter variables and words inside math must be explicitly quoted (e.g., `$"AB"$`, `$"implies"$`).

---

## 4. Pedagogical & Cognitive Science Principles

The design of all worksheets, workbooks, and exam sheets is governed by research in cognitive load theory, sequential art, and instructional design:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE MATH MENTOR PEDAGOGY LOOP                         │
│                                                                             │
│   [ FIGURE FIRST ]  ──►  [ KEY RULE ]  ──►  [ COMMON MISTAKES ]             │
│   Visual Anchor          Formula/Law         Error Anticipation             │
│          │                                          │                       │
│          ▼                                          ▼                       │
│   [ I DO: WORKED STEP ] ──► [ YOU DO: WORKSPACE ] ──► [ SELF-CHECK & AK ]   │
│   Comic Steps + Brain Voice   Scaffolded Solve Box      Instant Feedback    │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Figure-First Rule (Cognitive Load Theory - Sweller)**:
   - In geometry, trigonometry, and graphing, the **diagram appears FIRST** before English text.
   - Diagrams must be rendered large ($\ge 65\text{–}85\%$ page width).
   - Captions must be exactly one concise line. English text explains mathematical behavior rather than reciting what the diagram already shows (avoids the _Split-Attention_ and _Redundancy_ effects).
2. **Sequential Worked Examples (I Do - McCloud / Comics Principle)**:
   - Formatted as a two-column panel sequence:
     - **Left Column ("MATH STEPS")**: Exact formal algebraic/geometric equations.
     - **Right Column ("WHAT WE THINK")**: The teacher's internal dialog ("Brain Voice") in friendly, italicized conversational tone.
3. **Scaffolded Independent Practice (You Do - Kumon Principle)**:
   - Incremental difficulty progression: $L_1$ (Direct single-step) $\to$ $L_2$ (2–3 steps) $\to$ $L_3$ (Multi-step / Challenge).
   - Includes dedicated un-scaffolded physical solve workspace with a subtle `"work it out here"` watermark.
   - Instant verification via compact answers at the bottom of the card (`Answers: 1) 55°  2) 125°`).
4. **Error Pre-emption (Common Mistakes Card)**:
   - Tri-part mental breakdown: `[WRONG]` badge + specific student error $\to$ `Why it happens` diagnosis $\to$ `[RIGHT]` badge + correct mathematical process.
5. **The 60-30-10 Color Rule**:
   - 60% Neutral white/paper base.
   - 30% Structural palette (Teal headers, Navy titles, Ink text).
   - 10% Energetic accents (Gold rule highlights, Terra error badges, Sage checkmarks).

---

## 5. Universal Layout Archetypes & Skeletons

### Scenario A: Complete Toolbox Sheet (4–6 Pages)

- **Page 1**: Standalone Full-Bleed Gradient Cover (`sheet_cover`).
- **Page 2**: Skill 1 Theory & Foundations (Large Vector Figure $\to$ Key Rule $\to$ Common Mistakes $\to$ Level 1 I Do Worked Example).
- **Page 3**: Skill 1 Practice & Skill 2 Intro (Skill 1 You Do $\to$ Skill 2 Figure $\to$ Key Rule).
- **Page 4**: Skill 2 Practice & Skill 3 Intro (Skill 2 I Do $\to$ You Do $\to$ Skill 3 Figure).
- **Page 5**: Skill 3 Practice & Advanced Challenges ($L_2 \to L_3$ Practice Drills).
- **Final Page**: Answer Key Header (`ak_header`) $\to$ Modular Answer Blocks (`ak_block`) $\to$ Self-Check Questionnaire (`selfcheck`) $\to$ Strong Closing Card (`closing`).

### Scenario B: Quiz / Test + Answer Key (2–3 Pages)

- **Header**: Official Ministry / Series Banner + Student Metadata (Name, Date, Score).
- **Body**: Numbered Question Cards (`#question(...)` in Typst) carrying structured metadata `<bank>`.
- **Final Page**: Answer Key & Diagnostic Grading Rubric.

### Scenario C: Single-Page Cheat Sheet (1 Page)

- **Layout**: High-density 2-column or card-grid layout.
- **Components**: `keyrule`, `tip`, and `figcard` components only; no full I Do / You Do workflows; body $\ge 11\text{pt}$, figures $\ge 65\%$ width.

### Scenario D: Practice Drill Sheet (1–2 Pages)

- **Layout**: `youdo_multi` container holding individual `pitem` blocks, each with its own physical solve box and immediate answer string.

### Scenario E: Pre-Year Workbook (Exactly 11 Pages)

- **Page 1**: Grade Cover (`grade_cover`).
- **Pages 2–4**: Skill 1 (p2: Rule + Easy $L_1$; p3: Medium $L_2$; p4: Hard $L_3$ + Self-Check).
- **Pages 5–7**: Skill 2 (p5: Rule + Easy $L_1$; p6: Medium $L_2$; p7: Hard $L_3$ + Self-Check).
- **Pages 8–10**: Skill 3 (p8: Rule + Easy $L_1$; p9: Medium $L_2$; p10: Hard $L_3$ + Self-Check).
- **Page 11**: Answer Key ($3\times$ `ak_block`) + Strong Closing (`closing`).

### Scenario F: Interactive Web Exam (HTML5 / KaTeX)

- **Screen 1 (Start Screen)**: Official Ministry Banner (Red `#C0392B`), Egyptian Eagle emblem, Gold seal stamp, student name input, exam duration timer.
- **Screen 2 (Active Quiz Engine)**: Sticky header with danger-pulsing countdown timer, progress bar, KaTeX question cards, choice pills with keyboard shortcuts (A, B, C, D), instant feedback modal.
- **Screen 3 (Results & Diagnostics)**: Score percentage, grade band badge (A+, A, B, C, D, F), time spent, full question-by-question review with step explanations.

---

## 6. Macro & Component Design System

### 6.1 Page Setup & Running Headers/Footers

- **Paper**: A4 ISO ($210\text{mm} \times 297\text{mm}$ / $595.28\text{pt} \times 841.89\text{pt}$).
- **Margins**: Top: $2.1\text{cm}$ ($59.5\text{pt}$), Bottom: $1.8\text{cm}$ ($51.0\text{pt}$), Left: $1.9\text{cm}$ ($53.8\text{pt}$), Right: $1.9\text{cm}$ ($53.8\text{pt}$).
- **Content Width**: $487.6\text{pt}$.
- **Header**:
  - Left: `THE MATH MENTOR` (Century Gothic / Lato, Bold, 8.5pt, Teal `#0A9396`, tracking +1.5pt).
  - Right: Unit & Sheet Title (Palatino / Lato, 8.5pt, Muted `#636E72`).
  - Rule: `0.6pt` solid line in `teal + 65% white` (`#A9D9DA`).
- **Footer**:
  - Left: Colophon text (7.5pt, Muted `#636E72`).
  - Right: Circled Page Number ($14\text{pt} \times 14\text{pt}$ circle, `0.7pt` Teal stroke, 8pt Bold Teal text).

---

### 6.2 Component Implementations: Typst vs. LaTeX

#### 1. Front Cover (`sheet_cover` / `sheetcover`)

- **Visuals**: Full-bleed background gradient at $-35^\circ$ angle (`grade_color` to `#1A1A2E`), centered knockout logo `logo-white.png` (width $8\text{cm}$), gold series title, stage box, 30pt bold title, 7cm gold rule (`1.5pt`), subtitle, white chip badges, italic gold slogan _"The Lesson Counts"_, and footer credits.

**Typst Code:**

```typst
#let sheet_cover(stage, title, color, chips, subtitle) = {
  page(margin: 0pt, header: none, footer: none, fill: gradient.linear(angle: -35deg, color, navy))[
    #block(width: 100%, height: 100%)[
      #v(7%)
      #align(center)[#image("assets/logo-white.png", width: 8cm)]
      #v(3%)
      #align(center)[#text(font: display, size: 10.5pt, fill: gold, weight: 700, spacing: 3pt)["THE MATH MENTOR · THE COMPLETE TOOLBOX SERIES"]]
      #v(1fr)
      #align(center)[#box(
        fill: white.transparentize(92%), stroke: 0.8pt + white.transparentize(70%),
        radius: 6pt, inset: (x: 18pt, y: 10pt),
      )[#text(font: display, size: 17pt, weight: 700, fill: white, spacing: 1.5pt)[#stage]]]
      #v(6pt)
      #align(center)[#text(font: display, size: 30pt, weight: 700, fill: white, spacing: 1.5pt)[#title]]
      #v(8pt)
      #align(center)[#line(length: 7cm, stroke: 1.5pt + gold)]
      #v(8pt)
      #align(center)[#text(size: 14pt, fill: white.transparentize(10%))[#subtitle]]
      #v(16pt)
      #align(center)[
        #for s in chips [
          #box(fill: white.transparentize(88%), radius: 5pt, inset: (x: 10pt, y: 4pt))[#text(font: display, size: 9.5pt, weight: 700, fill: white)[#s]]
          #h(7pt)
        ]
      ]
      #v(1fr)
      #align(center)[#text(size: 11pt, fill: gold, style: "italic")["The Lesson Counts"]]
      #v(14pt)
      #align(center)[
        #text(size: 8pt, fill: white.transparentize(30%))[Created by Mr/Moaz Khaled · Designed by Joe for Designs · All rights reserved]
        #v(2pt)
        #text(size: 8pt, fill: white.transparentize(30%))[www.themathmentor.edu · #text("@themathmentor")]
      ]
      #v(4%)
    ]
  ]
}
```

**LaTeX Code:**

```latex
\newcommand{\sheetcover}[5]{% stage, title, color, chips, subtitle
  \thispagestyle{empty}
  \AddToShipoutPictureBG*{%
    \begin{tikzpicture}[remember picture, overlay]
      \shade[shading=axis, shading angle=-35, left color=#3, right color=navy]
        (current page.north west) rectangle (current page.south east);
    \end{tikzpicture}}
  \begin{tikzpicture}[remember picture, overlay, font=\disp]
    \node[anchor=north] at ([yshift=-2.0cm]current page.north) {\includegraphics[width=8cm]{assets/logo-white.png}};
    \node[anchor=north] at ([yshift=-3.7cm]current page.north) {\textcolor{gold}{\dispB\fontsize{10.5}{12.5}\selectfont THE MATH MENTOR \textperiodcentered{} THE COMPLETE TOOLBOX SERIES}};
    \node[anchor=north] at ([yshift=-11.0cm]current page.north) {\tcbox[colback=white!8, colframe=white!30, arc=6pt, boxrule=0.8pt, left=18pt, right=18pt, top=10pt, bottom=10pt]{\textcolor{white}{\dispB\fontsize{17}{20}\selectfont #1}}};
    \node[anchor=north] at ([yshift=-13.2cm]current page.north) {\textcolor{white}{\dispB\fontsize{30}{34}\selectfont #2}};
    \draw[gold, line width=1.5pt] ([yshift=-15.5cm]current page.north) +(-3.5cm,0) -- +(3.5cm,0);
    \node[anchor=north] at ([yshift=-16.3cm]current page.north) {\textcolor{white!90}{\fontsize{14}{17}\selectfont #5}};
    \node[anchor=north] at ([yshift=-17.6cm]current page.north) {#4};
    \node[anchor=south] at ([yshift=2.7cm]current page.south) {\textcolor{gold}{\itshape\fontsize{11}{13}\selectfont The Lesson Counts}};
    \node[anchor=south] at ([yshift=1.4cm]current page.south) {\textcolor{white!70}{\fontsize{8}{10}\selectfont Created by Mr/Moaz Khaled \textperiodcentered{} Designed by Joe for Designs \textperiodcentered{} All rights reserved}};
    \node[anchor=south] at ([yshift=0.5cm]current page.south) {\textcolor{white!70}{\fontsize{8}{10}\selectfont www.themathmentor.edu \textperiodcentered{} @themathmentor}};
  \end{tikzpicture}
  \newpage}
```

---

#### 2. Section Headers (`skill_header` & `level_header`)

**Typst:**

```typst
#let skill_header(n, name, color) = [
  #box(fill: color, radius: 3pt, inset: (x: 6pt, y: 2pt))[#text(font: display, size: 9.5pt, weight: 700, fill: white)[Skill #n]]
  #h(6pt)
  #text(font: display, size: 12pt, weight: 700, fill: navy)[#name]
]

#let level_header(level, name, color) = [
  #box(fill: color.transparentize(82%), stroke: 0.8pt + color.transparentize(45%), radius: 3pt, inset: (x: 7pt, y: 2pt))[#text(font: display, size: 9.5pt, weight: 700, fill: color)[Level #level — #name]]
]
```

**LaTeX:**

```latex
\newcommand{\skillheader}[3]{% n, name, color
  \tcbox[colback=#3, colframe=#3, arc=3pt, boxrule=0pt, left=6pt, right=6pt, top=2pt, bottom=2pt]{\color{white}\dispB\fontsize{9.5}{11}\selectfont Skill #1}%
  \hspace{6pt}\textcolor{navy}{\dispB\fontsize{12}{14}\selectfont #2}\par
  \vspace{4pt}}

\newcommand{\levelheader}[3]{% level, name, color
  \tcbox[colback=#3!18, colframe=#3!55, arc=3pt, boxrule=0.8pt, left=7pt, right=7pt, top=2pt, bottom=2pt]{\textcolor{#3}{\dispB\fontsize{9.5}{11}\selectfont Level #1 --- #2}}\par
  \vspace{2pt}}
```

---

#### 3. Key Rule Card (`keyrule`)

**Typst:**

```typst
#let card(bg, accent, title, titlecolor, body-content) = block(
  breakable: false,
  fill: bg,
  stroke: (
    left: 2.5pt + accent,
    top: 0.5pt + accent.transparentize(70%),
    right: 0.5pt + accent.transparentize(70%),
    bottom: 0.5pt + accent.transparentize(70%),
  ),
  radius: 6pt,
  inset: (x: 9pt, y: 4pt),
  width: 100%,
  [
    #text(font: display, size: 9.5pt, weight: 700, fill: titlecolor, spacing: 1pt)[#title]
    #v(2pt)
    #body-content
  ],
)

#let keyrule(body-content) = card(goldlight, gold, "♣ KEY RULE — Memorize & Apply", rgb("#8a5a1e"), body-content)
```

**LaTeX:**

```latex
\newenvironment{keyrule}{%
  \begin{tcolorbox}[breakable, enhanced,
    colback=goldlight, colframe=gold, boxrule=0.5pt, leftrule=2.5pt, arc=6pt,
    before skip=3pt, after skip=3pt, left=9pt, right=9pt, top=3pt, bottom=3pt,
    title={$\clubsuit$ KEY RULE --- Memorize \& Apply}, attach title to upper, coltitle=goldDark,
    fonttitle=\dispB\fontsize{9.5}{11.5}\selectfont]}{%
  \end{tcolorbox}}
```

---

#### 4. Worked Example (`ido_two` / `idotwo`)

**Typst:**

```typst
#let ido_two(title-text, rows) = card(teallight, teal, title-text, rgb("#0a6f72"), [
  #grid(columns: (1fr, 1fr), column-gutter: 10pt)[
    #text(font: display, size: 8pt, weight: 700, fill: rgb("#0a6f72"), spacing: 1pt)[MATH STEPS]
    #text(font: display, size: 8pt, weight: 700, fill: rgb("#0a6f72"), spacing: 1pt)[WHAT WE THINK]
  ]
  #v(2pt)
  #line(length: 100%, stroke: 0.6pt + teal.transparentize(60%))
  #v(2pt)
  #for row in rows [
    #grid(columns: (1fr, 1fr), column-gutter: 8pt, align: (start, start))[
      #text(size: 9.5pt)[#row.at(0)]
      #text(size: 9pt, style: "italic", fill: muted)[#row.at(1)]
    ]
    #v(2pt)
  ]
])
```

**LaTeX:**

```latex
\newenvironment{idotwo}[1]{%
  \begin{tcolorbox}[breakable, enhanced,
    colback=teallight, colframe=teal60, boxrule=0.5pt, leftrule=2.5pt, arc=6pt,
    before skip=3pt, after skip=3pt, left=9pt, right=9pt, top=3pt, bottom=3pt,
    title={#1}, attach title to upper, coltitle=tealDark,
    fonttitle=\dispB\fontsize{9.5}{11.5}\selectfont]
  \setlength{\tabcolsep}{0pt}
  \begin{tabular}{@{}p{\dimexpr0.5\linewidth-5pt\relax}@{\hspace{10pt}}>{\RaggedRight\arraybackslash}p{\dimexpr0.5\linewidth-5pt\relax}@{}}
    \textcolor{tealDark}{\dispB\fontsize{8}{10}\selectfont MATH STEPS} &
    \textcolor{tealDark}{\dispB\fontsize{8}{10}\selectfont WHAT WE THINK}\\[2pt]
    \multicolumn{2}{@{}l}{\textcolor{teal60}{\rule{\linewidth}{0.6pt}}}\\[3pt]
}{%
  \end{tabular}\end{tcolorbox}}
```

---

#### 5. Independent Practice Workspace (`yodo` / `yodobox`)

**Typst:**

```typst
#let yodo(body-content, answers-text, box-height: 30pt) = card(sagelight, sage, "✎ YOUR WORKSPACE — You Do", rgb("#3e5f4a"), [
  #body-content
  #v(4pt)
  #block(
    stroke: 1pt + sage.transparentize(45%),
    radius: 4pt,
    inset: (x: 8pt, y: 6pt),
    width: 100%,
    height: box-height,
    [#v(1fr) #align(right + bottom, text(size: 7.5pt, fill: sage.transparentize(45%), font: display)[work it out here])],
  )
  #v(4pt)
  #text(size: 7.5pt, fill: muted, font: display)[Answers: #answers-text]
])
```

**LaTeX:**

```latex
\newlength{\yodoboxh}
\newcommand{\yodoans}{}
\newenvironment{yodobox}[3][20pt]{% [box-height] {content} {answers}
  \setlength{\yodoboxh}{#1}
  \renewcommand{\yodoans}{#3}
  \begin{tcolorbox}[breakable, enhanced,
    colback=sagelight, colframe=sage45, boxrule=0.5pt, leftrule=2.5pt, arc=6pt,
    before skip=3pt, after skip=3pt, left=9pt, right=9pt, top=3pt, bottom=3pt,
    title={\ding{59} YOUR WORKSPACE --- You Do}, attach title to upper, coltitle=sageDark,
    fonttitle=\dispB\fontsize{9.5}{11.5}\selectfont]
  #2}{%
  \par\vspace{4pt}
  \begin{tcolorbox}[enhanced, boxrule=1pt, colframe=sage45, colback=sagelight,
    arc=4pt, left=8pt, right=8pt, top=2pt, bottom=2pt,
    height=\yodoboxh, valign=bottom, halign=flush right]
    \textcolor{sage45}{\disp\fontsize{7.5}{9}\selectfont work it out here}
  \end{tcolorbox}
  \vspace{4pt}
  {\textcolor{muted}{\disp\fontsize{7.5}{9}\selectfont Answers: \yodoans}}%
  \end{tcolorbox}}
```

---

#### 6. Common Mistakes Box (`mistakes` / `mistakesbox`)

**Typst:**

```typst
#let mistake_entry(wrong, why, correct) = [
  #grid(columns: (auto, 1fr), align: (start, start))[
    #box(fill: terra, radius: 3pt, inset: (x: 5pt, y: 1.5pt))[#text(font: display, size: 7.5pt, weight: 700, fill: white)[WRONG]]
    #h(5pt)
    #text(size: 9.5pt, fill: ink)[#wrong]
  ]
  #v(1pt)
  #text(size: 8.5pt, fill: muted)[_Why it happens:_ #why]
  #v(1.5pt)
  #grid(columns: (auto, 1fr), align: (start, start))[
    #box(fill: sage, radius: 3pt, inset: (x: 5pt, y: 1.5pt))[#text(font: display, size: 7.5pt, weight: 700, fill: white)[RIGHT]]
    #h(5pt)
    #text(size: 9.5pt, fill: ink)[#correct]
  ]
]

#let mistakes(items) = card(terralight, terra, "⚠ COMMON MISTAKES — Don't Fall Into These", rgb("#9c3b22"), [
  #for item in items [
    #mistake_entry(item.at(0), item.at(1), item.at(2))
    #v(4pt)
  ]
])
```

**LaTeX:**

```latex
\newcommand{\badge}[2]{% color, text
  \tcbox[colback=#1, colframe=#1, arc=3pt, boxrule=0pt, left=5pt, right=5pt, top=1.5pt, bottom=1.5pt]{\color{white}\dispB\fontsize{7.5}{9}\selectfont #2}}

\newenvironment{mistakesbox}{%
  \begin{tcolorbox}[breakable, enhanced,
    colback=terralight, colframe=terra, boxrule=0.5pt, leftrule=2.5pt, arc=6pt,
    before skip=3pt, after skip=3pt, left=9pt, right=9pt, top=3pt, bottom=3pt,
    title={\faExclamationTriangle{} COMMON MISTAKES --- Don't Fall Into These}, attach title to upper, coltitle=terraDark,
    fonttitle=\dispB\fontsize{9.5}{11.5}\selectfont]}{%
  \end{tcolorbox}}

\newcommand{\mistake}[3]{% wrong, why, right
  \badge{terra}{WRONG}\hspace{5pt}{\fontsize{9.5}{12}\selectfont #1}\par
  \vspace{1pt}
  {\textcolor{muted}{\fontsize{8.5}{10.5}\selectfont \textit{Why it happens:} #2}}\par
  \vspace{1.5pt}
  \badge{sage}{RIGHT}\hspace{5pt}{\fontsize{9.5}{12}\selectfont #3}\par
  \vspace{4pt}}
```

---

#### 7. Answer Key & Self-Check Blocks

**Typst:**

```typst
#let ak_header() = [
  #text(font: display, size: 15pt, weight: 700, fill: navy)[Answer Key]
  #v(2pt)
  #text(size: 9.5pt, fill: muted)[Check your answers only after you finish — no peeking before!]
]

#let ak_block(skillname, entries) = block(
  breakable: false,
  fill: paper,
  stroke: 0.8pt + teal.transparentize(55%),
  radius: 6pt,
  inset: (x: 9pt, y: 4pt),
  width: 100%,
  [
    #text(font: display, size: 9.5pt, weight: 700, fill: teal)[#skillname]
    #v(2pt)
    #for (lvl, ans) in entries [
      #grid(columns: (auto, 1fr), align: (start, start))[
        #text(font: display, size: 8.5pt, weight: 700, fill: ink)[#lvl]
        #h(6pt)
        #text(size: 9pt, fill: ink)[#ans]
      ]
      #v(2pt)
    ]
  ],
)

#let selfcheck(items) = block(
  breakable: false,
  fill: paper,
  stroke: 0.8pt + teal.transparentize(55%),
  radius: 6pt,
  inset: (x: 9pt, y: 4pt),
  width: 100%,
  [
    #text(font: display, size: 9.5pt, weight: 700, fill: teal, spacing: 1pt)[☑ SELF-CHECK — Rate yourself]
    #v(3pt)
    #for item in items [
      #text(fill: ink)[☐ #item]
      #v(2pt)
    ]
  ],
)
```

**LaTeX:**

```latex
\newenvironment{akbox}[1]{%
  \begin{tcolorbox}[breakable, enhanced,
    colback=paper, colframe=teal55, boxrule=0.8pt, arc=6pt,
    before skip=3pt, after skip=3pt, left=9pt, right=9pt, top=3pt, bottom=3pt,
    title={#1}, attach title to upper, coltitle=teal,
    fonttitle=\dispB\fontsize{9.5}{11.5}\selectfont]}{%
  \end{tcolorbox}}

\newcommand{\akrow}[2]{\dispB\fontsize{8.5}{10.5}\selectfont #1\hspace{6pt}{\fontsize{9}{11}\selectfont #2}\par\vspace{2pt}}

\newenvironment{selfcheck}{%
  \begin{tcolorbox}[breakable, enhanced,
    colback=paper, colframe=teal55, boxrule=0.8pt, arc=6pt,
    before skip=3pt, after skip=3pt, left=9pt, right=9pt, top=3pt, bottom=3pt,
    title={\faCheckSquare{} SELF-CHECK --- Rate yourself}, attach title to upper, coltitle=teal,
    fonttitle=\dispB\fontsize{9.5}{11.5}\selectfont]}{%
  \end{tcolorbox}}

\newcommand{\checkitem}[1]{$\square$ #1\par\vspace{2pt}}
```

---

#### 8. Strong Closing Card (`closing` / `closingbox`)

**Typst:**

```typst
#let closing() = block(
  breakable: false,
  fill: navy,
  radius: 8pt,
  inset: (x: 14pt, y: 12pt),
  width: 100%,
  align(center)[
    #text(font: display, size: 20pt, weight: 700, fill: gold, spacing: 1pt)[Learn It. Do It. Own It.]
    #v(4pt)
    #text(size: 10.5pt, fill: white.transparentize(15%))[Every skill here is a bridge — cross it, and the next grade is already yours.]
  ],
)
```

**LaTeX:**

```latex
\newenvironment{closingbox}{%
  \begin{tcolorbox}[enhanced, colback=navy, colframe=navy, arc=8pt, boxrule=0pt,
    before skip=6pt, after skip=0pt, left=14pt, right=14pt, top=12pt, bottom=12pt]
  \centering}{%
  \end{tcolorbox}}

\newcommand{\closingtitle}{\textcolor{gold}{\dispB\fontsize{20}{24}\selectfont Learn It. Do It. Own It.}\par\vspace{4pt}}
\newcommand{\closingnote}{\textcolor{white!85}{\fontsize{10.5}{13}\selectfont Every skill here is a bridge --- cross it, and the next grade is already yours.}}
```

---

## 7. Diagram & Vector Art Standards

### 7.1 Mathematical Geometry Conventions

1. **Equal Angles**: Designated by identical arc marks (e.g., single arc vs double arc).
2. **Equal Segments**: Designated by perpendicular tick/hash marks across the line segments.
3. **Right Angles ($90^\circ$)**: Designated by an exact square corner box.
4. **Parallel Lines**: Designated by matching direction arrowheads on the parallel rays/lines.
5. **Vertex Notation**: 3-letter uppercase angles (e.g., $\angle ABC$) where the middle letter is strictly the vertex.

### 7.2 SVG Canvas & Styling Standard

- **Aspect Ratio**: Wide-aspect viewBox (e.g., `viewBox="0 0 560 150"` or `viewBox="0 0 340 230"`).
- **Stroke Width**: `2.0px` to `2.2px` for primary geometric contours; `1.0px` for construction lines.
- **Stroke Colors**:
  - Primary Shapes: Ink Dark `#2D3436`.
  - Highlights / Angles / Transversals: Teal `#0A9396`.
  - Secondary Accents: Terracotta `#E76F51` or Cyan `#01CBFC`.
- **Labels & Typography**: Font family `Century Gothic` / `Lato` / `Palatino`, font-size $\ge 13\text{px}\text{–}16\text{px}$ (guarantees readability at print size).
- **Page Width Target**: Render at $\ge 65\%\text{–}85\%$ page width.

### 7.3 TikZ & PGFPlots Best Practices (LaTeX)

- Preferred Libraries: `\usetikzlibrary{angles, quotes, intersections, arrows.meta, calc}`.
- Angle Marks: Use TikZ `quotes` syntax:
  ```latex
  \draw pic["$55^\circ$", angle eccentricity=1.7, angle radius=0.42cm] {angle = A--B--C};
  ```
- Function Graphs: Use `pgfplots` with `compat=1.18`, `axis lines = middle`, grid style `gray!30`.

---

## 8. Page Budgeting, Hard Rules & CI/CD Pipeline

### 8.1 The A4 Page Budget (791pt Rule)

- Standard A4 Height: `841.89pt`.
- Bottom Margin: `51.0pt` ($1.8\text{cm}$).
- **HARD LIMIT**: The bottom-most element on any content page must **NEVER exceed 791pt** (`842 - 51`). Running footers reside between `810pt` and `822pt`.
- **Target Page Fill Ratios**:
  - Rule / Theory Page: $\le 87\%$
  - Level 2 Practice Page: $\le 78\%$
  - Level 3 Practice & Self-Check Page: $\le 84\%$
  - Answer Key & Closing Page: $\le 75\%$

### 8.2 Component Heights Reference Table

_Estimated heights on standard A4 ($488\text{pt}$ content width):_

| Component      | Height Range                       | Notes                                                           |
| -------------- | ---------------------------------- | --------------------------------------------------------------- |
| `figcard`      | $190\text{pt} + \text{image\_h}$   | e.g., Types @ 85% = 138pt; Transversal @ 70% = 127pt            |
| `keyrule`      | $70\text{pt}\text{–}140\text{pt}$  | 2–3 lines of text + centered math                               |
| `mistakes`     | $76\text{pt}\text{–}130\text{pt}$  | 1 entry $\approx 76\text{pt}$; 2 entries $\approx 130\text{pt}$ |
| `ido_two`      | $105\text{pt}\text{–}154\text{pt}$ | 2 rows = 105pt; 3 rows = 132pt; 4 rows = 154pt                  |
| `yodo`         | $85\text{pt}\text{–}110\text{pt}$  | Includes 30pt default workspace box                             |
| `skill_header` | $15\text{pt}\text{–}18\text{pt}$   | Badge + title line                                              |
| `level_header` | $18\text{pt}\text{–}20\text{pt}$   | Tinted level badge                                              |
| `ak_block`     | $55\text{pt}\text{–}80\text{pt}$   | Per skill block                                                 |
| `selfcheck`    | $120\text{pt}\text{–}145\text{pt}$ | 3–4 checkbox items                                              |
| `closing`      | $54\text{pt}\text{–}65\text{pt}$   | Navy card with slogan                                           |

### 8.3 Hard Engineering Traps & Gotchas

1. **Typst Quoted String Bug**: All component table cells, `ido_two` rows, and `selfcheck` items **must be content blocks `[...]`**, never strings `"..."`. Quoted strings render `$...$` math literally.
2. **Typst Semicolon Dropping**: A semicolon immediately following a content block close `]` is dropped by the parser (`[#text()[x]; y]` renders "x y"). Place punctuation inside the block.
3. **PowerShell Multi-line Replace**: PowerShell `$c.Replace("\n", ...)` silently fails with CRLF formatting. Always use explicit file-editing agents or Python scripts for multi-line replacements.
4. **LaTeX `#n` Argument Scope**: In `\newenvironment`, `#1` arguments cannot be referenced in the _end_ code block. Store arguments into internal helper macros (`\def\yodoans{#3}`) in the _begin_ code block.
5. **LaTeX Ampersand Escaping**: Always escape `&` in titles as `\&`.

### 8.4 Automated Validation Script (`build.ps1` & PyMuPDF)

Every project includes an automated verification script that compiles the source, measures per-page vertical bounding boxes, and executes a leak scan:

```python
import fitz  # PyMuPDF

doc = fitz.open("output.pdf")
H = doc[0].rect.height  # 841.89 pt
for i, page in enumerate(doc):
    if i == 0:
        continue  # Page 1 is full-bleed cover
    blocks = page.get_text("blocks")
    content_blocks = [
        b[3]
        for b in blocks
        if "Created by" not in b[4] and "Next stop" not in b[4]
    ]
    max_y = max(content_blocks) if content_blocks else 0
    fill_pct = (max_y / H) * 100
    status = "OVERFLOW" if max_y > 791.0 else "PASS"
    print(f"Page {i+1}: bottom={max_y:.1f}pt ({fill_pct:.1f}%) -> {status}")
```

**Leak Detection Scan**:
The build pipeline scans output for raw unrendered tokens:
`$`, `\degree`, `degree`, `rArr`, `aang`, `sym.angle`, `text(`, `m \parallel n`.

---

## 9. Essential Asset Architecture (`/assets`)

The project root `/assets` directory contains the production-ready brand assets required for LaTeX, Typst, and Web builds:

| Asset Path | Format | Size | Description & Usage |
|---|---|---|---|---|
| `/assets/logo-main.png` | PNG | 94.1 KB | High-resolution horizontal color master logo ("THE MATH MENTOR" + Symbol) |
| `/assets/logo-main.svg` | SVG | 4.4 KB | Clean vector master horizontal logo for web & responsive print |
| `/assets/logo-symbol.png` | PNG | 50.7 KB | Geometric emblem / rotated sum "M" icon for watermarks and badges |
| `/assets/logo-symbol.svg` | SVG | 730 B | Clean vector symbol for vector shipout backgrounds and web icons |
| `/assets/logo-white.png` | PNG | 21.5 KB | Knockout white logo on transparent background for full-bleed dark covers |
| `/assets/logo-white.svg` | SVG | 4.5 KB | Clean vector knockout white logo for vector dark-mode headers |
| `/assets/symbol.png` | PNG | 50.7 KB | Root alias for `logo-symbol.png` |
| `/assets/symbol.svg` | SVG | 730 B | Root alias for `logo-symbol.svg` |
| `/assets/logo.svg` | SVG | 4.4 KB | Root alias for `logo-main.svg` |

---

_End of System Specification — The Math Mentor Design System v2.0_
