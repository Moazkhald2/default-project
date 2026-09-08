# Animated Emojis & Stickers — Resource Guide

Reference for adding moving (animated) emojis and reaction stickers to the **Math LMS Mentor** site.

> Legal rule of thumb: only use assets with an explicit web/commercial license
> (CC0, MIT, CC-BY, CC-BY-SA, Lottie Simple License, or "free for commercial use").
> Anything labeled "free for personal use only" must NOT be used on a business/client site
> unless a commercial license is confirmed. Always open the asset page's license details.

---

## 1) Free animated emoji sets (open source / permissive)

Designed for web use with explicit licenses.

| Set                                | Notes                                                                                                                           | License                                                | Link                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------- |
| **Noto Emoji Animations (Google)** | Official animated Noto Emoji repo; desktop + mobile-ready files; consistent, high-quality. Best for consistent animated emojis. | Open source (Google)                                   | https://googlefonts.github.io/noto-emoji-animation/ |
| **JoyPixels Animations**           | Animated emoji pack.                                                                                                            | Free for personal use; **commercial requires license** | https://github.com/luizbizzio/emojis                |
| **Twemoji + community animations** | Twitter's open-source emoji (CC BY 4.0), static by default; community makes animated variants.                                  | CC BY 4.0 (verify animation pack)                      | https://github.com/luizbizzio/emojis                |
| **OpenMoji**                       | Open-source emoji set; mostly static, good base to animate.                                                                     | CC BY-SA 4.0                                           | https://github.com/luizbizzio/emojis                |

---

## 2) Free animated sticker / GIF / Lottie sources

"Sticker-style" moving graphics (transparent bg, bouncy motion), often commercial-friendly.

| Source                              | Notes                                                                                                   | License               | Link                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------- |
| **LottieFiles (free section)**      | Large free Lottie library; many under Lottie Simple License (commercial allowed, often no attribution). | Lottie Simple License | https://www.moonb.io/blog/free-lottie-animations                    |
| **Lordicon / Icons8**               | Curated free animated icons/stickers; some need attribution.                                            | Varies per asset      | https://www.moonb.io/blog/free-lottie-animations                    |
| **General animated icon libraries** | Thousands of animated icons in GIF/SVG/WebP; many free for commercial use.                              | Varies                | https://www.magnific.com/animated-icons                             |
| **Emoji animation vectors / GIFs**  | "Free for commercial use" animated emoji graphics.                                                      | Varies                | https://www.magnific.com/free-photos-vectors/emoji-animation        |
| **Cartoon emoji stickers**          | Vector/PNG/PSD "free for commercial use".                                                               | Varies                | https://www.magnific.com/free-photos-vectors/cartoon-emoji-stickers |
| **Comic-style emoji vectors**       | Downloadable comic-look emoji graphics.                                                                 | Varies                | https://www.magnific.com/vectors/comic-style-emoji                  |

Search those sites for "emoji sticker", "reaction", or "chat sticker" and filter by license.

---

## 3) Built-in Unicode emojis (simplest, free everywhere)

Paste standard emojis directly; they render with the visitor's system font. No downloads, no license issues.

- As text: `😊` `🚀` `✅`
- HTML entity: `&#128516;` (😄)
- Pros: zero hosting, no attribution. Cons: look varies by OS/browser.

---

## 4) Open-source emoji image sets (consistent look, web-ready)

Self-host PNG/SVG/WebP or load via CDN.

| Set                                 | Notes                                                    | License      | Link                                                            |
| ----------------------------------- | -------------------------------------------------------- | ------------ | --------------------------------------------------------------- |
| **EmojiOne**                        | "Web's first complete open source emoji set", 100% free. | Free         | https://365webresources.com/best-emoji-icon-sets-free-download/ |
| **OpenMoji**                        | Designers/developers; available via Iconify/Icônes.      | CC BY-SA 4.0 | https://365webresources.com/best-emoji-icon-sets-free-download/ |
| **Twemoji (Twitter)**               | Widely used SVG/PNG emoji images.                        | CC BY 4.0    | https://icones.js.org/                                          |
| **Microsoft 2D/3D emojis**          | 1100+ free emoji icons (Figma/SVG/PNG).                  | Free         | https://365webresources.com/best-emoji-icon-sets-free-download/ |
| **Telegram-style / pixel / themed** | Many free Figma/SVG/PNG sets.                            | Varies       | https://365webresources.com/best-emoji-icon-sets-free-download/ |

---

## 5) Icon libraries with emoji-style sets

- **Iconify** — unified search of 200k+ open-source icons across 150+ sets incl. emoji collections; MIT. https://icones.js.org/
- **Icônes** — browse OpenMoji, Streamline Emojis, etc. with license info + direct download. https://icones.js.org/
- **Vecteezy emoji theme** — royalty-free emoji-style graphics/backgrounds. https://www.vecteezy.com/free-vector/emoji-theme

---

## 6) Funny / "extreme" reaction emojis & stickers

For exaggerated reactions (shock, rage, maniac laugh, crying).

| Source                                 | Notes                                                                                   | License                                                             | Link                                                         |
| -------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| **emoji.gg — Funny emojis & stickers** | Large directory of free custom "Funny" emojis/stickers (extreme reactions, meme faces). | Varies per pack                                                     | https://emoji.gg/emojis/funny                                |
| **MakeEmoji — Animated Emoticons**     | Create custom animated emoticons (shake/spin/party).                                    | Varies                                                              | https://makeemoji.com/emoji-makers/emoticons                 |
| **AnimGifMoji**                        | Turn any GIF into emoji/sticker format.                                                 | Varies                                                              | https://www.animgifmoji.com/blog/discord/discord-sticker-gif |
| **GIPHY / Tenor**                      | Search "extreme reaction", "shocked emoji", "crying laughing"; download as GIF/WebP.    | Free to embed w/ attribution; filter by usage rights for commercial | https://www.animgifmoji.com/blog/discord/discord-sticker-gif |
| **Mojimi / sticker makers**            | Upload drawing/photo, generate 30+ emotion variants.                                    | Some free, some paid                                                | https://blog.mojimi.ai/tag/funny-stickers/                   |

DIY: AI-generate cartoon emoji faces (prompt: "cartoon emoji face, extremely shocked, eyes popping out, bold lines, white background"), remove bg, animate if desired.

---

## 7) Format decision guide

| Format                        | Best for                              | Notes                                         |
| ----------------------------- | ------------------------------------- | --------------------------------------------- |
| **GIF / APNG / WebP**         | Easiest drop-in `<img>`               | WebP/APNG better quality/size than GIF        |
| **Lottie (JSON / dotLottie)** | Crisp, scalable, small                | Needs Lottie web player or lightweight loader |
| **SVG + CSS/JS**              | Custom animatable parts (eyes, mouth) | `@keyframes` or JS for effects                |
| **Unicode emoji**             | Zero-asset reactions                  | System-font dependent look                    |

Keep stickers small (48–96px) and lazy-load many to avoid slowing the page.

---

## 8) Integration patterns (React / Vite site)

### Animated emoji as WebP/APNG/GIF

```html
<img src="/assets/emojis/laugh.webp" alt="Laughing emoji" width="48" height="48" loading="lazy" />
```

### Lottie

```html
<div id="emoji-lottie"></div>
<script src="https://unpkg.com/@lottiefiles/web-player@latest/dist/web-player.js"></script>
<script>
  new LottiePlayer("#emoji-lottie").load("/assets/emojis/laugh.lottie");
</script>
```

### As text emojis

Just paste into JSX/HTML: `🚀 ✅ 😊`

### Via Iconify (React)

```bash
npm i @iconify/react
```

```tsx
import { Icon } from "@iconify/react";
<Icon icon="openmoji:rolling-on-the-floor-laughing" width="48" />;
```

---

## 9) Recommended quick picks for Math LMS Mentor

- **Consistent animated emojis** → Noto Emoji Animations (Google).
- **Sticker-style reactions** → LottieFiles free commercial animations (Lottie or GIF).
- **Icon-style motion** → free animated icon library, treated as emoji-like reactions.
- **Funny/extreme reactions** → emoji.gg Funny pack or GIPHY filtered by usage rights.

### Suggested local asset folder

```
apps/web/public/assets/emojis/   <- drop .webp / .gif / .lottie here
apps/web/src/components/           <- future <Sticker/> / <AnimatedEmoji/> components
```

> TODO: confirm tech stack (this site is React + Vite + Tailwind v4) and style
> (cute / minimal / 3D / comic) to pick 2–3 specific packs and add ready components.
