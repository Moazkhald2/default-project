# Taste Skill Rule — Anti-Slop Frontend Framework

Source: https://github.com/Leonxlnx/taste-skill (79k stars, MIT) — 13 variants installed in `~/.config/opencode/skills/`

## When to Invoke
- ANY frontend work: landing pages, portfolios, redesigns, dashboards (with style choice)
- User says: design, UI, frontend, landing, portfolio, premium, luxury, editorial

## Variants (pick ONE per task)
| Task | Install name | Folder |
|------|--------------|--------|
| Default (v2 experimental) | `design-taste-frontend` | taste-skill |
| Legacy v1 | `design-taste-frontend-v1` | taste-skill-v1 |
| GPT/Codex strict | `gpt-taste` | gpt-tasteskill |
| Calm premium | `high-end-visual-design` | soft-skill |
| Notion/Linear editorial | `minimalist-ui` | minimalist-skill |
| Brutalist/Swiss | `industrial-brutalist-ui` | brutalist-skill |
| Full output enforce | `full-output-enforcement` | output-skill |
| Upgrade existing | `redesign-existing-projects` | redesign-skill |
| Image→Code pipeline | `image-to-code` | image-to-code-skill |
| Google Stitch | `stitch-design-taste` | stitch-skill |
| Web images only | `imagegen-frontend-web` | imagegen-frontend-web |
| Mobile app images | `imagegen-frontend-mobile` | imagegen-frontend-mobile |
| Brand kit boards | `brandkit` | brandkit |

## Mandatory Workflow (v2)
1. **Brief Inference**: Output one-line Design Read: "Reading as: <page kind> for <audience>, <vibe> leaning <system>"
2. **Three Dials**: DESIGN_VARIANCE (8), MOTION_INTENSITY (6), VISUAL_DENSITY (4) — infer from vibe words
3. **Design System Map**: Use real system if brief matches (Fluent, Material, Carbon, Polaris, Primer, GOV.UK) — else Tailwind v4 + Motion
4. **Anti-Slop Bans**: No Inter default, no purple/blue glow, no 3 equal cards, no em-dash, no center hero when VARIANCE>4, no neon glows
5. **Pre-flight Check**: All rules before ship

## Stack Defaults
- Framework: React/Next.js RSC, Tailwind v4, Motion (from "motion/react"), next/font
- Icons: @phosphor-icons/react > hugeicons-react > radix > tabler (never lucide unless asked, NEVER hand-roll SVG)
- Images: picsum.photos or generated; one theme per page; real logos via Simple Icons

## Migration (ccode-to-codex)
- Use `migrate-to-codex`, `migrate-agents-to-codex` skills to port these to Codex CLI (.codex/skills/)
