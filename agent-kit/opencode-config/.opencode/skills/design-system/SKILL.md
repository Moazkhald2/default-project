---
name: design-system
description: >
  Use for UI/UX design work, creating or maintaining design systems,
  color palettes, typography, component libraries, and visual branding.
  Works with visual-engineering category. Triggers: "design system",
  "UI design", "brand guide", "color palette", "typography",
  "component library", "visual design", "make it pretty".
---

# Design System Skill

Guidelines for creating cohesive, professional visual designs.

## Design Principles

1. **Consistency** — Repeating patterns create familiarity
2. **Hierarchy** — Visual weight communicates importance
3. **Spacing** — 8px grid system for all spacing
4. **Accessibility** — WCAG AA minimum (4.5:1 contrast ratio)
5. **Performance** — Minimal CSS, no unused styles

## Color System

### Palette Structure
```yaml
colors:
  primary:    # Brand color (actionable elements)
  secondary:  # Supporting brand color
  accent:     # Highlights, badges, callouts
  neutral:    # Text, backgrounds, borders (100-900 scale)
  success:    # Positive states
  warning:    # Caution states
  error:      # Error states
  info:       # Informational states
```

### Accessibility Rules
- Text on colored backgrounds: min 4.5:1 contrast
- Large text (18px+): min 3:1 contrast
- UI components: min 3:1 against adjacent colors
- Never communicate solely through color

## Typography

### Scale
```yaml
typography:
  font-family:
    - system-ui, -apple-system, sans-serif  # UI
    - 'Georgia', 'Times New Roman', serif   # Long-form
  scale:
    xs:   12px
    sm:   14px
    base: 16px
    lg:   18px
    xl:   24px
    2xl:  30px
    3xl:  36px
    4xl:  48px
```

### Line Height
- Body text: 1.5–1.7
- Headings: 1.2–1.3
- Tight UI: 1.0

## Spacing System

Base unit: 8px
```yaml
spacing:
  xxs:  2px   # Border radii, dividers
  xs:   4px   # Icons, badges
  sm:   8px   # Dense UI padding
  md:   16px  # Card padding, section gaps
  lg:   24px  # Section margins
  xl:   32px  # Page sections
  2xl:  48px  # Major sections
  3xl:  64px  # Page-level spacing
```

## Component Design Checklist

- [ ] Uses design tokens (no magic values)
- [ ] All states covered (default, hover, active, disabled, focus)
- [ ] Responsive (mobile-first)
- [ ] Accessible keyboard navigation
- [ ] Loading and empty states defined
- [ ] Error and success states defined
- [ ] RTL-ready layout
- [ ] Reduces to minimal viable markup

## Responsive Breakpoints

```yaml
breakpoints:
  sm:  640px   # Mobile landscape
  md:  768px   # Tablet
  lg:  1024px  # Desktop
  xl:  1280px  # Wide desktop
  2xl: 1536px  # Ultra-wide
```

## Visual QA Checklist

- [ ] No overflow or scrollbar issues
- [ ] Text not clipped or overlapping
- [ ] Colors match spec
- [ ] Spacing consistent with grid
- [ ] Font rendering consistent across browsers
- [ ] Touch targets min 44x44px on mobile
- [ ] Focus indicators visible on all interactive elements
