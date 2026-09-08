# Color Palettes & Typography — Dark/Light Mode Inspiration

Reference for choosing the **Math LMS Mentor** color system and font pairing,
with dark/light mode and WCAG accessibility in mind.

---

## 1) Source board / tools

| Source                                              | What it gives                                            | Link                                                                                                                            |
| --------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Pinterest — Dark & Light Mode Palette board**     | Curated dual-theme palette inspiration.                  | https://www.pinterest.com/ideas/dark-and-light-mode-color-palette/924100573564/                                                 |
| **Pinterest pin — specific palette**                | One concrete light/dark palette example.                 | https://www.pinterest.com/pin/2111131073998815/                                                                                 |
| **CodeAlly — Colors**                               | Color tool / palette helper.                             | https://codeally.dk/en/colors/                                                                                                  |
| **Muzli — Dark Mode inspiration**                   | Dark UI design gallery.                                  | https://muz.li/inspiration/dark-mode/                                                                                           |
| **Nate Bal — Dark Mode Best Practices**             | Practical dark-mode do's and don'ts.                     | https://natebal.com/best-practices-for-dark-mode/                                                                               |
| **AllAccessible — WCAG Contrast Guide 2025**        | Contrast/accessibility rules to meet.                    | https://www.allaccessible.org/blog/color-contrast-accessibility-wcag-guide-2025                                                 |
| **Font Roulette — Light vs Dark Typography**        | Why font pairings fail in dark mode + fixes.             | https://www.font-roulette.com/blog/light-vs-dark-typography-why-your-perfect-font-pairing-fails-in-dark-mode-and-how-to-fix-it/ |
| **Web.dev — `light-dark()` + color-scheme**         | Modern CSS pattern for theme-dependent colors.           | https://web.dev/articles/light-dark                                                                                             |
| **IxDF — What is Dark Mode? (2026)**                | Do/don't: no 1:1 invert, high-contrast UI, dark-gray bg. | https://ixdf.org/literature/topics/dark-mode                                                                                    |
| **Nicepage — Dark vs Light UX + a11y checklist**    | Checklist, contrast targets, examples.                   | https://nicepage.com/blog/dark-vs-light-mode-a-practical-ux-guide-with-accessibility-checklist-610198                           |
| **VEV — 6 dark-mode palette ideas**                 | Neon/desaturated accent patterns on dark.                | https://www.vev.design/blog/dark-mode-website-color-palette/                                                                    |
| **Stripo — Dark mode template best practices**      | Avoid pure black, gradients, etc.                        | https://support.stripo.email/en/articles/13375252-best-practices-for-dark-mode-template-design                                  |
| **Design Studio UI/UX — 10 dark-mode UI practices** | Desaturated colors, image handling, examples.            | https://www.designstudiouiux.com/blog/dark-mode-ui-design-best-practices/                                                       |
| **Webflow — 5 dark-mode sites**                     | Case studies with design choices.                        | https://webflow.com/blog/dark-mode-website                                                                                      |
| **Accessibility Innovations — Contrast tips**       | Light/dark specifics, WCAG ratios.                       | https://accessibilityinnovations.com/color-contrast/                                                                            |
| **WebAbility — WCAG contrast guide 2026**           | Practical walkthrough + testing.                         | https://www.webability.io/blog/color-contrast-for-accessibility                                                                 |
| **MDN — `prefers-color-scheme`**                    | Detect OS theme via media query.                         | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme                                                    |
| **MDN — `color-scheme`**                            | Declare light/dark support to the browser.               | https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme                                                                   |

---

## 2) Dark mode best practices (from Nate Bal + Muzli)

- Don't use pure `#000000` backgrounds — use a very dark gray (e.g. `#121212` / `#1A1A1A`)
  to reduce eye strain and let elevation (shadows/borders) read.
- Avoid pure white text; use off-white (`#E0E0E0`–`#F5F5F5`) for body copy.
- Use **elevation via subtle surfaces**, not heavy shadows:
  bg `#121212` → surface `#1E1E1E` → raised `#2A2A2A`.
- Desaturate accent colors in dark mode to ~70–80% saturation (full-sat hues glare).
- Use opacity/overlay for dividers instead of hard border lines.
- Give interactive elements clear hover/focus states (borders, glows).
- **Never naively invert** light colors — create brand-specific dark variants.
- Provide a **manual toggle** (header/settings) that overrides the system preference;
  store choice in `localStorage`; respect `prefers-color-scheme` by default.
- Use **filled icons** over outlined ones in dark mode (better visibility); tint accessibly.
- Images: apply `filter: brightness(0.8) contrast(1.2)` or serve `<picture>` dark variants;
  avoid stark white media frames.
- Keep animations subtle; reduce transition speed in low-light. Forms: darker inputs,
  lighter placeholders, desaturated (not alarm) reds for errors.

---

## 3) Typography in dark mode (from Font Roulette + Nate Bal)

- Fonts tuned for light mode often look **too thin / low-contrast** on dark bg.
- Fixes:
  - Increase font **weight** slightly in dark mode (e.g. 400 → 500).
  - Increase **letter-spacing** a touch for headings on dark surfaces.
  - Use slightly **lighter** background tints behind text blocks to lift contrast.
  - Avoid ultra-thin weights (<300) for body text in dark mode.
- Prefer clean **sans-serif** faces (e.g. Roboto, Open Sans) — less bleed on dark bg.
- **Line-height** 1.5–1.8; paragraph width **45–75 characters/line** for reading flow.
- H1s can use a slightly **lighter shade** to draw attention without glare.
- Keep a single, consistent type scale across both themes; only adjust
  weight/color, not size, to avoid layout shift between modes.

### Free, screen-friendly font choices (Google Fonts)

Pick ONE primary UI font; keep weights simple (400/500/600/700).

| Font              | Why                                                         | Link                                            |
| ----------------- | ----------------------------------------------------------- | ----------------------------------------------- |
| **Inter**         | Excellent for UI, many weights, crisp at small sizes.       | https://fonts.google.com/specimen/Inter         |
| **Roboto**        | System-like, clean, good Windows/Android hinting.           | https://fonts.google.com/specimen/Roboto        |
| **Open Sans**     | Neutral, friendly, versatile body/UI.                       | https://fonts.google.com/specimen/Open+Sans     |
| **Noto Sans**     | Great multilingual coverage (use if non-Arabic i18n later). | https://fonts.google.com/specimen/Noto+Sans     |
| **IBM Plex Sans** | Technical, crisp — good for dashboards / code-heavy UI.     | https://fonts.google.com/specimen/IBM+Plex+Sans |

> Body 400–500, headings 600–700. In dark mode, consider one step lighter
> body weight (e.g. 500 → 400) to counter glow/bleed.
> **Decision (2026-08-26): No Arabic / bilingual support — English-only UI.**
> Do NOT load Noto Sans Arabic / IBM Plex Sans Arabic or add `:lang(ar)` rules.

---

## 4) WCAG contrast rules (from AllAccessible, 2025)

- **Body text:** ≥ 4.5:1 against background (AA).
- **Large text** (≥24px or ≥18.66px bold): ≥ 3:1.
- **UI components / icons:** ≥ 3:1 against adjacent colors.
- **Best practice (AAA):** 7:1 for body text.
- Test both themes with a contrast checker before shipping.
- Don't rely on color alone — pair with icons/labels (good for math feedback states).

---

## 5) Building a dual-theme palette (template)

Use a token system so light/dark share roles, not hardcoded hexes.

| Role             | Light                 | Dark                            |
| ---------------- | --------------------- | ------------------------------- |
| Background       | `#FAFAFA` / `#FFFFFF` | `#121212`                       |
| Surface          | `#FFFFFF`             | `#1E1E1E`                       |
| Surface raised   | `#F1F3F5`             | `#2A2A2A`                       |
| Text primary     | `#1A1A1A`             | `#ECECEC`                       |
| Text muted       | `#5A5A5A`             | `#A0A0A0`                       |
| Accent (primary) | `#3B5BFF` (saturated) | `#7C9CFF` (desaturated/lighter) |
| Success          | `#1E8E3E`             | `#4CCB6B`                       |
| Warning          | `#B26A00`             | `#E0A800`                       |
| Danger           | `#C5221F`             | `#F0716F`                       |
| Border/divider   | `rgba(0,0,0,0.08)`    | `rgba(255,255,255,0.10)`        |

> For a math LMS, reserve semantic colors for feedback:
> success (correct), danger (wrong), warning (hint), accent (brand/CTA).

---

## 6) Recommended implementation pattern (2025/2026, from Nate Bal)

The most robust + maintainable combo for a React/Vite/Tailwind site:

1. Set `color-scheme: light dark` on `:root`.
2. Use `data-theme="dark|light"` on `<html>` for explicit user override.
3. Persist choice in `localStorage`; default to system `prefers-color-scheme`.
4. Name CSS variables by role, not shade:
   `--surface-0 / --surface-1 / --surface-2`, `--text-primary / --text-secondary`.
5. Prefer `light-dark(var, var)` where browser support allows (progressive enhancement).
6. Listen for `prefers-color-scheme` changes and update if user hasn't overridden.
7. Add a header toggle that flips `data-theme` and saves the preference.

```css
:root {
  color-scheme: light dark;
}
:root[data-theme="dark"] {
  --surface-0: #121212;
  --surface-1: #1e1e1e;
  --surface-2: #2a2a2a;
  --text-primary: #ececec;
  --text-secondary: #a0a0a0;
}
```

```ts
// theme init (runs before paint to avoid flash)
const saved = localStorage.getItem("theme");
const sysDark = matchMedia("(prefers-color-scheme: dark)").matches;
document.documentElement.dataset.theme = saved ?? (sysDark ? "dark" : "light");
```

Alternative minimal toggle using the `color-scheme` property (pairs with
`color-scheme: light dark;` in CSS; also themed form controls/scrollbars):

```ts
const root = document.documentElement;
const stored = localStorage.getItem("theme");
if (stored) root.style.colorScheme = stored;
document.getElementById("theme-toggle")!.onclick = () => {
  const cur = getComputedStyle(root).colorScheme || "light";
  const next = cur.includes("dark") ? "light" : "dark";
  root.style.colorScheme = next;
  localStorage.setItem("theme", next);
};
```

## 7) Common dark-mode mistakes to avoid

- Naively inverting light colors (illegible results).
- Ignoring icons (they blend into the background).
- Forcing dark mode (always offer a choice/toggle).
- Overusing gradients (clutters the UI).
- Neglecting mobile touch targets / responsiveness in dark mode.
- Extreme contrast causing halation (blurring) for astigmatic users — stay ≤ ~7:1, pair color with icons/labels.

## 8) Curated tools & assets (free)

### Contrast & accessibility checkers

- **WebAIM Contrast Checker** — quick AA/AAA text checks. https://webaim.org/resources/contrastchecker/
- **TPGi Colour Contrast Analyser** — desktop app, WCAG 2.x, pick colors from screen. https://www.tpgi.com/color-contrast-analyser/

### Testing & debugging tools (free)

- **Chrome DevTools — Rendering panel** — emulate `prefers-color-scheme`, inspect contrast live. https://developer.chrome.com/docs/devtools/rendering/
- **Firefox DevTools** — built-in contrast checker + color picker. https://firefox-source-docs.mozilla.org/devtools-user/
- **Lighthouse (Chrome/Edge)** — accessibility audit; flags low-contrast text/UI. https://developer.chrome.com/docs/lighthouse/overview/
- **CSS-Tricks — Dark mode with CSS variables** — practical tokens + JS toggle tutorial. https://css-tricks.com/dark-mode-with-css-custom-properties/

### Palette builders & visualizers

- **Coolors** — fast generator, lock/export. https://coolors.co
- **Khroma** — AI-assisted palettes from a seed color. https://khroma.co
- **Realtime Colors** — preview palette on a fake UI (buttons/cards/inputs). https://realtimecolors.com
- **Material Design color system** — primary/secondary surfaces + dark guidance. https://material.io/design/color/the-color-system.html

### Icons & illustrations (SVG → recolor per theme)

- **Heroicons** — outline/solid, Tailwind-friendly. https://heroicons.com
- **Feather Icons** — minimal clean strokes. https://feathericons.com
- **Phosphor Icons** — consistent family, many weights (good fill/stroke control). https://phosphoricons.com
- **unDraw** — free recolorable illustrations. https://undraw.co

> For dark mode: prefer **filled** icons and tint them with accessible colors (see §2).

### UI / component libraries with dark mode

- **Tailwind UI** — free components with `dark:` variants. https://tailwindui.com
- **Mantine** — React, built-in dark mode. https://mantine.dev
- **Chakra UI** — React, token-based theming. https://chakra-ui.com
- **Radix UI** — headless; pair with your own light/dark tokens. https://www.radix-ui.com
- **Heroicons / Phosphor** also work headless with the token approach.

> This site is **React + Vite + Tailwind v4** — Radix UI + CSS variables, or
> Tailwind's `dark:` / `@theme` tokens, are the natural fit.

---

## 9) Ready-to-use CSS starter (framework-free tokens)

Drop-in base using only free standards; tweak to brand hexes (§10).

```css
:root {
  /* Light mode tokens */
  --bg-page: #ffffff;
  --bg-surface: #f7f7f8;
  --text-primary: #0a0a0a;
  --text-secondary: #444444;
  --border: #e5e5e5;
  --accent: #2563eb;
  --font-sans: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  --weight-body: 400;
  --weight-heading: 600;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode tokens */
    --bg-page: #121212;
    --bg-surface: #1e1e1e;
    --text-primary: #f1f1f1;
    --text-secondary: #c4c4c4;
    --border: #333333;
    --accent: #3b82f6; /* one accent color; adjust lightness, not hue */
    --weight-body: 400;
    --weight-heading: 600;
  }
}

body {
  background: var(--bg-page);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-weight: var(--weight-body);
  line-height: 1.5;
}
h1,
h2,
h3 {
  font-weight: var(--weight-heading);
}
a {
  color: var(--accent);
}
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}
```

### Quick light/dark palette recommendations (from the guides above)

- **Light:** bg `#FFFFFF`/`#F7F7F8`, text `#0A0A0A`/`#444444`, accent `#2563EB`.
- **Dark:** bg `#121212`, surface `#1E1E1E`, text `#F1F1F1`/`#C4C4C4`,
  accents sparing + desaturated (e.g. `#3B82F6`, `#84CC16`, `#EC4899`).
- One accent across both modes; tune lightness, not hue. Don't invert 1:1.

---

## 10) Suggested next steps for Math LMS Mentor

- Confirm brand accent color (the site logos suggest a primary brand hue — check
  `apps/web/public/logo-*.svg` for the exact hex: `#0A9396` teal, `#1A1A2E` navy,
  `#636E72` gray, `#D4A373` sand).
- Define CSS variables / Tailwind theme tokens for both themes (Tailwind v4
  `@theme` + `prefers-color-scheme` or a class-based `dark:` strategy).
- Pick a font (Inter recommended; **Noto Sans** if Arabic support is needed) and
  verify it in BOTH modes per §3.
- Run the contrast checker (WebAIM) on every feedback state (correct/wrong/hint).
- Add a header theme toggle using the §6 pattern (`data-theme` + `localStorage`).

> TODO: lock brand hexes into final light/dark token set and build the toggle.
