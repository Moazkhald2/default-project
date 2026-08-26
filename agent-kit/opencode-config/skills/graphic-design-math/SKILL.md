# Graphic Design for Math Teaching Materials

Skill for applying graphic design principles to math education materials. Use for color scheme advice, typography, layout, templates, or accessibility decisions in any math teaching resource.

## Color Theory for Math

### Recommended Color Palettes

**Teaching Primary (high contrast, print-safe):**
```json
{
  "primary":   {"hex": "#2563EB", "cmyk": "88,73,0,0",   "use": "Theorems, headings, main actions"},
  "secondary": {"hex": "#059669", "cmyk": "81,0,79,36", "use": "Examples, positive outcomes"},
  "accent":    {"hex": "#DC2626", "cmyk": "0,82,74,11", "use": "Warnings, corrections, key points"},
  "neutral":   {"hex": "#1F2937", "cmyk": "0,0,0,85",   "use": "Body text, problem statements"},
  "muted":     {"hex": "#9CA3AF", "cmyk": "0,0,0,30",   "use": "Captions, hints, non-essential info"},
  "bg":        {"hex": "#FFFFFF", "cmyk": "0,0,0,0",    "use": "Background"},
  "bg-light":  {"hex": "#F3F4F6", "cmyk": "0,0,0,4",    "use": "Alternating rows, callout boxes"}
}
```

**Colorblind-Friendly Palette (CVD-safe):**
```json
{
  "safe-blue":    "#0077BB",
  "safe-orange":  "#EE7733",
  "safe-cyan":    "#33BBEE",
  "safe-magenta": "#CC3311",
  "safe-teal":    "#009988",
  "safe-gray":    "#BBBBBB"
}
```
Use shape + text labels alongside any color encoding — never rely on color alone.

**Pastel Kids (elementary):**
```json
{
  "sky":    "#93C5FD",
  "coral":  "#FCA5A5",
  "mint":   "#86EFAC",
  "sun":    "#FDE047",
  "lav":    "#C4B5FD",
  "pink":   "#F9A8D4"
}
```

### Color Meaning Consistency

| Color | Math Meaning | Always use for |
|-------|-------------|----------------|
| Blue | Definitions, key concepts | Vocabulary boxes, keyword highlights |
| Red | Correct answers, important | Answer keys, warnings, stop signs |
| Green | Examples, positive | Worked solutions, success checks |
| Purple | Formulas, rules | Formula boxes, property lists |
| Orange | Challenges, extensions | Enrichment problems, star challenges |
| Gray | Non-essential | Notes, hints, footnotes, captions |

### Accessibility (WCAG 2.1 AA)

| Requirement | Standard | How to meet |
|-------------|----------|-------------|
| Contrast ratio | 4.5:1 (normal text), 3:1 (large 18pt+) | Use [webaim.org/contrastchecker](https://webaim.org/contrastchecker) |
| Color independence | Info must not rely solely on color | Add icons `✓ ✗ ⚠` or text labels |
| Focus indicators | 3:1 contrast outline | `outline: 3px solid #2563EB;` |
| Print readability | 70% max black on white | Use `#1F2937` not `#000` for body text |

```css
/* WCAG AA compliant styles */
.math-content {
  color: #1F2937;            /* 12.6:1 on white ✓ */
  background: #FFFFFF;
  font-size: 12pt;
  line-height: 1.6;
}
.math-content .answer-key {
  color: #991B1B;            /* 8.6:1 on white ✓ */
  font-weight: 600;
}
.math-content .hint {
  color: #6B7280;            /* 4.6:1 on white ✓ */
  font-style: italic;
}
```

**Print vs Screen:**
- CMYK for print materials: worksheets, posters, handouts
- RGB/hex for screen: slides, web worksheets, digital assignments
- Convert: use `$cmyk_to_rgb` or Adobe Color for accurate translation
- Print on 120gsm+ paper to avoid show-through
- Leave 0.125in bleed for print materials with edge-to-edge color

## Typography

### Font Pairings

| Setting | Headings | Body | Math | When |
|---------|----------|------|------|------|
| Elementary worksheets | Poppins (600) | Comic Sans MS | Noto Sans Math | Playful, readable |
| Middle school | Lato (700) | Lato (400) | Latin Modern Math | Clean, modern |
| High school | Georgia (700) | Georgia (400) | STIX Two Math | Traditional academic |
| College/SAT prep | Source Serif 4 (700) | Source Serif 4 (400) | Asana Math | Publication quality |
| Slides | Montserrat (700) | Open Sans (400) | Fira Math | Readable from distance |
| Posters | Oswald (700) | Roboto (400) | Noto Sans Math | High impact, large format |

```css
/* Example: High school worksheet */
@import url('https://fonts.googleapis.com/css2?family=Georgia&display=swap');
body {
  font-family: 'Georgia', 'STIX Two Math', serif;
  font-size: 12pt;
  line-height: 1.5;
  color: #1F2937;
}
h1 { font-size: 18pt; font-weight: 700; color: #2563EB; }
h2 { font-size: 14pt; font-weight: 600; color: #1F2937; }
.math { font-family: 'STIX Two Math', serif; }
```

### Readability Minimums

| Format | Body min | Heading min | Notes |
|--------|----------|-------------|-------|
| Elementary worksheet | 16pt | 24pt | Never smaller than 14pt |
| Middle worksheet | 12pt | 18pt | Can go to 11pt for dense content |
| High school worksheet | 11pt | 16pt | 10pt for multi-line problems |
| College worksheet | 10pt | 14pt | 9pt for answer keys |
| Slides (projected) | 24pt | 36pt | Minimum for back-of-room readability |
| Poster | 24pt | 72pt | Body = readable at 3ft |
| Flashcards | 14pt | 20pt | Front question size |

### Font Hierarchy Template

```css
/* Complete font scale */
:root {
  --fs-title: 24pt;
  --fs-subtitle: 18pt;
  --fs-section: 15pt;
  --fs-body: 12pt;
  --fs-small: 10pt;
  --fs-caption: 9pt;

  --fw-bold: 700;
  --fw-semibold: 600;
  --fw-regular: 400;

  --ff-display: 'Poppins', sans-serif;
  --ff-body: 'Inter', sans-serif;
  --ff-math: 'STIX Two Math', serif;
}

h1 { font: var(--fw-bold) var(--fs-title) var(--ff-display); }
h2 { font: var(--fw-semibold) var(--fs-subtitle) var(--ff-display); }
h3 { font: var(--fw-semibold) var(--fs-section) var(--ff-body); }
p  { font: var(--fw-regular) var(--fs-body)/1.6 var(--ff-body); }
.math { font-family: var(--ff-math); }
```

## Layout Design

### Page Grid Templates

**Worksheet (Letter: 8.5×11in):**
```
┌─ 0.75in ─┬─────────────────┬──0.5in──┬─────────────────┬─0.75in─┐
│          │   Column 1       │         │   Column 2       │         │
│  margin  │                   │  gutter │                   │  margin │
│          │   ┌───────────┐  │         │   ┌───────────┐  │         │
│          │   │ Problem 1 │  │         │   │ Problem 2 │  │         │
│          │   └───────────┘  │         │   └───────────┘  │         │
│          │   ┌───────────┐  │         │   ┌───────────┐  │         │
│          │   │ Problem 3 │  │         │   │ Problem 4 │  │         │
│          │   └───────────┘  │         │   └───────────┘  │         │
└──────────┴─────────────────┴──────────┴─────────────────┴──────────┘
```

**CSS Grid Implementation:**
```css
.worksheet {
  display: grid;
  grid-template-columns: 0.75in 1fr 0.5in 1fr 0.75in;
  grid-template-rows: auto;
  width: 8.5in;
  min-height: 11in;
  margin: 0 auto;
  background: white;
}
.header { grid-column: 2 / 5; }
.problems {
  grid-column: 2 / 5;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 0.5in;
}
```

### Information Density Guidelines

| Level | Age | Problems per page | Words per problem | Visual weight |
|-------|-----|-------------------|-------------------|---------------|
| Sparse | K-2 | 4-8 | 5-15 | 70% whitespace |
| Moderate | 3-5 | 10-15 | 15-40 | 50% whitespace |
| Standard | 6-8 | 20-25 | 20-60 | 30% whitespace |
| Dense | 9-12 | 25-35 | 30-80 | 20% whitespace |
| Compact | College | 30-50 | 30-100 | 10% whitespace |

### Balance Principles

- **Symmetrical**: formal, traditional worksheets. Left/right columns mirror each other
- **Asymmetrical**: modern, dynamic. Large visual on one side, text block on other
- **Radial**: posters with center focal point radiating outward
- **Rule of thirds**: key content at intersection points of 3×3 grid overlay

## Material Types

### Worksheets
- Clean, spacious, clear problem numbering
- Font: 12-16pt depending on grade
- Margins: 0.5-0.75in
- Grid: 2-3 columns
- Visual hierarchy: section headers → problem numbers → problem text

### Slides
- Readable from 20ft: minimum 24pt body, 36pt headers
- One idea per slide maximum
- High contrast: dark text on light background
- Math rendered with KaTeX or MathJax, not images
- Consistent template: logo, page numbers, section markers

**Beamer (LaTeX) template:**
```latex
\usetheme{Madrid}
\usecolortheme{whale}
\setbeamercolor{structure}{fg=blue!70!black}
\setbeamerfont{title}{size=\huge, series=\bfseries}
\setbeamerfont{frametitle}{size=\Large, series=\bfseries}
```

**CSS Slide Template:**
```css
.slide {
  width: 1024px; height: 768px;
  padding: 48px 64px;
  background: white;
  font-family: 'Open Sans', sans-serif;
  display: flex;
  flex-direction: column;
}
.slide h1 {
  font-size: 36pt; font-weight: 700;
  color: #1F2937; margin-bottom: 16px;
}
.slide .content {
  flex: 1; font-size: 24pt; line-height: 1.6;
  color: #374151;
}
.slide .math { font-family: 'Fira Math', serif; }
```

### Posters
- Large text: 72pt+ title, 36pt+ body
- Minimal text — maximum visual
- Readable at 6ft distance
- Single strong focal point (central equation or diagram)
- Color-coded sections

### Flashcards
- Front: question only, 20pt bold
- Back: answer + explanation, 14pt body
- Size: 3×5in standard
- Vertical layout, centered content
- Cut lines: dashed borders for easy cutting

```html
<div class="flashcard">
  <div class="front">
    <div class="card-label">FRONT</div>
    <div class="card-math">\( \frac{d}{dx} \sin x = ? \)</div>
  </div>
  <div class="back">
    <div class="card-label">BACK</div>
    <div class="card-math answer">\( \cos x \)</div>
    <div class="explanation">Derivative of sine is cosine.</div>
  </div>
</div>
```

```css
.flashcard {
  width: 300px; height: 180px;
  border: 2px dashed #9CA3AF;
  border-radius: 8px;
  padding: 20px;
  page-break-inside: avoid;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
}
.front .card-math { font-size: 20pt; font-weight: 700; }
.back .card-math { font-size: 18pt; color: #059669; }
.back .explanation { font-size: 11pt; color: #6B7280; margin-top: 8px; }
.card-label {
  font-size: 8pt; text-transform: uppercase;
  letter-spacing: 2px; color: #9CA3AF;
  position: absolute; top: 4px; right: 8px;
}
@media print {
  .flashcard { break-inside: avoid; }
}
```

### Banners & Headers
- Course title in large bold font (48-72pt)
- Subtitle: topic/chapter (18-24pt)
- Decorative math symbols as background watermark
- Color: solid block of primary color with white text
- Dimensions: 800×200px for web, 12×4in for print

### Certificates
- Ornate border (use `border-image` or SVG)
- Student name large: 36pt script or bold serif
- Achievement description: 16pt body
- Date, signature line, score if applicable
- Seal/stamp: star or math symbol (π, ∑) as watermark

```css
.certificate {
  width: 11in; height: 8.5in;
  padding: 0.75in;
  border: 8px double #2563EB;
  background: #FFFBEB;
  text-align: center;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
}
.certificate h1 { font-size: 16pt; color: #6B7280; text-transform: uppercase; letter-spacing: 4px; }
.certificate .student-name {
  font-family: 'Great Vibes', cursive;
  font-size: 48pt; color: #1F2937;
  margin: 24px 0;
}
.certificate .detail { font-size: 14pt; color: #4B5563; margin: 8px 0; }
.certificate .signature { margin-top: 32px; border-top: 1px solid #9CA3AF; padding-top: 8px; display: inline-block; min-width: 200px; }
```

## SVG Generation

```svg
<!-- Simple geometric figure: right triangle -->
<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
  <polygon points="20,140 180,140 20,20"
           fill="#E0F2FE" stroke="#2563EB" stroke-width="3"/>
  <rect x="20" y="125" width="15" height="15"
        fill="none" stroke="#2563EB" stroke-width="2"/>
  <text x="100" y="160" text-anchor="middle" fill="#4B5563" font-size="12">a</text>
  <text x="12" y="85" text-anchor="middle" fill="#4B5563" font-size="12" transform="rotate(-90,12,85)">b</text>
  <text x="115" y="75" fill="#4B5563" font-size="12" transform="rotate(-50,115,75)">c</text>
</svg>
```

```svg
<!-- Math icon: pi symbol -->
<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <circle cx="40" cy="40" r="36" fill="#DBEAFE" stroke="#2563EB" stroke-width="3"/>
  <text x="40" y="52" text-anchor="middle" font-size="36" font-family="serif" font-weight="700" fill="#1E40AF">π</text>
</svg>
```

## Accessibility Checklist

- [ ] All colors pass WCAG AA contrast (4.5:1 body, 3:1 large)
- [ ] Color is never the only information carrier (add icons/shapes/text)
- [ ] Alt text on all images, SVGs, and diagrams
- [ ] Font size ≥ 12pt for body, ≥ 16pt for elementary
- [ ] Print version: CMYK or grayscale fallback
- [ ] Math content screen-reader accessible (MathML or aria-label)
- [ ] No reliance on hover-only interactions (for digital materials)
- [ ] Print materials include crop marks and 0.125in bleed
- [ ] Test in grayscale to verify readability

## Quick Reference

| Element | Print | Screen |
|---------|-------|--------|
| Color space | CMYK | RGB/hex |
| Resolution | 300 DPI | 72-150 DPI |
| Font embedding | Outline or embed | Web font @import |
| Units | in, pt, cm | px, rem, em |
| Proof | Print test page | Responsive check |
| Math rendering | LaTeX + pdf | KaTeX/MathJax |
