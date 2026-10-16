# mai1015.com — design system

One system for the blog (Jekyll, `assets/css/site.css`) and the resume at `/resume/` (static page copied from the profile-site project by `publish-to-blog.py`). Tokens live in each `:root` block; this file is the contract for both.

## 1. Atmosphere and identity

An engineer's spec sheet: cool mineral paper, blue-black ink, mono metadata, one warm signal colour. The orange is taken from the work itself (Forge's brand orange, Zerkov's amber controls).

Two signatures:

- **Plates.** Every screenshot is a framed capture with a mono caption strip, like a figure plate in a manual. The hero is a cascade of three real plates, not an illustration.
- **Track switch.** One control re-cuts the page for a role: all, backend, Rust and tools, games. It mirrors the three resume variants and is linkable (`#backend`, `#rust`, `#games`).

## 2. Colour

| Role | Token | Light | Dark | Usage |
| --- | --- | --- | --- | --- |
| Ground | `--ground` | `#ECEEF1` | `#0F1216` | Page background |
| Surface | `--surface` | `#F7F8FA` | `#161A20` | Plates, bars, raised rows |
| Surface sunk | `--sunk` | `#E2E5EA` | `#1D222A` | Caption strips, pressed segments |
| Ink | `--ink` | `#14181F` | `#E8EBF0` | Headings, body |
| Ink 2 | `--ink-2` | `#444C5A` | `#AAB2BF` | Secondary text |
| Ink 3 | `--ink-3` | `#626B7B` | `#838C9C` | Metadata, captions |
| Rule | `--rule` | `#D3D7DE` | `#2A303A` | Dividers, frames |
| Rule strong | `--rule-strong` | `#AEB5C0` | `#414957` | Section rules, control outlines |
| Grid | `--grid` | `#DCE0E6` | `#1A1F26` | Hero drafting grid |
| Signal tint | `--signal-tint` | `#FBE7DB` | `#3A2015` | Hover wash, active row |
| Signal soft | `--signal-soft` | `#F2B28E` | `#8A4420` | Marker borders |
| Signal | `--signal` | `#E8590C` | `#FF7A33` | Markers, active rail |
| Signal ink | `--signal-ink` | `#AD3A08` | `#FF9A62` | Links, accent text (AA on ground) |
| Signal fill | `--signal-fill` | `#C8410B` | `#F2702B` | Primary button fill |
| On signal | `--on-signal` | `#FFFFFF` | `#14181F` | Text on signal fill |
| Shadow | `--shadow` | `20 24 31` | `0 0 0` | RGB triplet for plate shadows |

Code colours (blog only), light / dark: keyword `--code-kw` `#9C3A0C` / `#FF9A62`, string `--code-str` `#2D6A36` / `#8FD19E`, comment `--code-com` `#6B7280` / `#8A93A3`, number `--code-num` `#1D5CA6` / `#8DB8F2`, function `--code-fn` `#6A3D9E` / `#C9A6F2`, type `--code-type` `#0E6A70` / `#6FD3D9`, error `--code-err` `#B42318` / `#FF8A80`. Used only inside `.highlight`.

Rules: signal marks interaction or selection only. No colour outside this table. Plate shadows are two layers (contact + ambient), never a single blur.

## 3. Typography

| Level | Face | Size | Weight | Line | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display (name) | Archivo, `wdth` 70 | `clamp(3.25rem, 9.5vw, 7rem)` | 800 | 0.92 | -0.02em |
| H2 (section) | Archivo, `wdth` 80 | `clamp(1.75rem, 3.4vw, 2.5rem)` | 700 | 1.05 | -0.01em |
| H3 (entry) | Archivo, `wdth` 88 | `1.5rem` | 700 | 1.15 | -0.005em |
| Lead | IBM Plex Sans | `clamp(1.0625rem, 1.5vw, 1.25rem)` | 400 | 1.55 | 0 |
| Body | IBM Plex Sans | `1rem` | 400 | 1.6 | 0 |
| Small | IBM Plex Sans | `0.9375rem` | 400 | 1.55 | 0 |
| Label | IBM Plex Mono | `0.75rem` | 500 | 1.4 | 0.06em, uppercase |
| Data | IBM Plex Mono | `0.8125rem` | 400 | 1.5 | 0 |

Stacks: `--f-display: "Archivo", "Arial Narrow", "Helvetica Neue", sans-serif`; `--f-body: "IBM Plex Sans", system-ui, -apple-system, "Segoe UI", sans-serif`; `--f-mono: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace`. Three families: display, body, and mono for dates, stack lists and captions.

## 4. Spacing and layout

Base 4px. Tokens `--s-1` 4, `--s-2` 8, `--s-3` 12, `--s-4` 16, `--s-5` 24, `--s-6` 32, `--s-7` 48, `--s-8` 72, `--s-9` 112.

- Max width `--page` 1180px. Gutter `--gutter` 20px, 32px from 720px.
- Section rhythm: `--s-9` desktop, `--s-8` mobile.
- 12-column grid from 900px. Work entry: figure 7, text 5. Experience: meta 3, body 9.
- Radius: `--r-1` 3px (controls), `--r-2` 6px (plates). Nothing rounder.
- Breakpoints: 720px, 900px.

## 5. Components

### Plate
- **Structure**: `button.plate > img + span.plate-cap`. Opens the viewer.
- **Variants**: `.plate` (work figure), `.plate--thumb` (secondary), hero cascade (`.cascade .plate`), `.plate--spec` (a figure set in type when no capture exists: `figure.plate.plate--spec > dl.spec + p.spec-foot + figcaption.plate-cap`; mono `dt`, body `dd`, rule between rows, two columns from 720px).
- **States**: default; hover lifts 3px with deeper ambient shadow; active returns to 0; focus-visible 2px signal outline, 3px offset. `.plate--spec` is static: no lift, no zoom cursor, not in the viewer.
- **Accessibility**: real `button`, `alt` on image, caption is visible text.
- **Motion**: transform and box-shadow, 180ms.

### Track switch
- **Structure**: `div[role=group] > button[data-track][aria-pressed]`.
- **States**: default ink-2 on transparent; hover ink on sunk; pressed (`aria-pressed=true`) ink on surface with signal underline; focus-visible outline.
- **Behaviour**: toggles `hidden` on every `[data-t]` element; sets `data-track` on `<html>`; writes the hash. Static HTML is the "all" view so the page is complete without script.

### Button / link button
- **Variants**: `.btn` (outlined), `.btn--primary` (signal fill).
- **States**: hover (tint wash or darker fill), active scale 0.98, focus-visible outline, `.is-done` after copy.

### Entry (work), Role (experience), Row (lists)
- Entry: figure column plus text column, top rule strong.
- Role: mono meta column plus body column, top rule.
- Row: 3-column list row (name, description, link) with hover wash.

### Viewer
- `dialog#viewer` with image, caption, previous/next/close. Esc closes; arrow keys step.

## 6. Motion

| Type | Duration | Easing | Use |
| --- | --- | --- | --- |
| Micro | 120–180ms | `cubic-bezier(.2,.7,.3,1)` | Hover, press |
| Reveal | 420ms | same | Hero cascade on load, track re-cut |

Transform and opacity only. All motion is inside `prefers-reduced-motion: no-preference`; resting state is fully visible.

## 7. Depth

- Level 0: ground with a drafting grid behind the hero, masked to fade out.
- Level 1: plates. `0 1px 2px rgb(var(--shadow) / .10), 0 12px 32px -12px rgb(var(--shadow) / .28)`.
- Level 2: hovered plate and viewer. `0 2px 4px rgb(var(--shadow) / .12), 0 28px 56px -18px rgb(var(--shadow) / .40)`.
- The sticky view bar uses the ground colour at 86% with a blur, and a bottom rule.

## Content rules

- Employer material is limited to what the owner asked for: the Anamon slot mini-game and web client, the HELIX land renders, and the Leagues contract suite. Label them "Full-time work". Do not present studio artwork or marketing pages as authored work.
- The slot capture uses sample data in place of the live API; say so next to it.
- The Leagues figure lists contracts and their roles, written from the source. No code excerpts from employer repositories.
- Other screenshots come from independent projects.
- No phone number. No outcome figures until they are confirmed.
- Link only to public repositories.

## 8. Blog components

The blog is two-sided: a fixed identity panel on the left so the author is always on screen, writing on the right. It deliberately avoids landing-page furniture (slogan heroes, button rows, pill chips); the writing itself is the first thing in the column.

### Shell
- `body > .shell` is a grid of `aside.side` (`--side-w` 20rem) and `.col` from 1024px. The column holds `main` (max `--col` 52rem, left-aligned) and the footer; left padding `clamp(48px, 5vw, 72px)`.
- Under 1024px the panel collapses into a sticky 56px bar (32–36px avatar, handle, theme toggle) and the nav moves into `.mnav`, a mono link row under the bar that scrolls with the page.

### Identity panel
- Tokens: `--side-bg` `#14181F` (light theme) / `#090B0E` (dark theme, a step below the page ground), `--side-ink` `#E8EBF0`, `--side-ink-2` `#AAB2BF`, `--side-ink-3` `#838C9C`, `--side-rule` `#2A303A` / `#232831`, `--side-signal` `#FF7A33`, `--side-grid` white at 4.5%. The panel is dark in both themes; the 24px drafting grid is its texture.
- Content top to bottom: avatar (88px on a light plate, ringed rule then signal), handle in Archivo 800 `wdth` 70 at 2.75rem, mono role line, two-line bio, a `dl` of Now / Open to between rules, numbered nav (`01 Writing` … `04 Resume`, current item gets a 2px signal left bar and a signal index), social icon buttons (GitHub, LinkedIn, email, RSS) and the copyright pinned to the bottom. The panel scrolls on its own if the viewport is short.
- Theme preference is stored in `localStorage.theme` and applied as `data-theme` on `<html>` before paint, the same key the resume uses.

### Writing log (home)
- Page head: `h1.h-page` (Archivo 800 `wdth` 70, `clamp(2.5rem, 6vw, 4rem)`) and one mono line with the count and year range.
- Topic filter: the seven largest categories as mono text buttons with superscript counts, between rule-strong lines; pressed item underlined in signal; "Every topic" links to `/categories/`. Filtering hides rows and emptied years instantly, no reload.
- Years are outlined numerals (Archivo 800 `wdth` 70, transparent fill, 1px rule-strong stroke) heading an ordered log. Row: mono date column (4.25rem), title, mono category (right-aligned from 720px, under the title on phones). Hover: signal underline on the title, a 6px signal square in the margin, date turns signal ink.

### Article
- Post head: category label, title (Archivo 800 `wdth` 75, `clamp(2.125rem, 5vw, 3.5rem)`), mono meta row (date, reading time), tag chips, closed by a rule-strong line.
- Prose: Plex Sans 1.0625rem/1.7, measure `--measure` 44rem. H2/H3 in Archivo `wdth` 88. Inline code on sunk; code blocks on surface with a rule border and radius `--r-2`, horizontal scroll, never wrap. Tables scroll inside their own box. Images get a rule border.
- Tag chip: mono .75rem, rule border, surface fill, radius `--r-1`. Not interactive.
- Pager: two cards (older, newer), surface with rule-strong border, lift on hover.

### Pages
- Page head: title plus optional lead. `wide: true` lifts the measure (Projects).
- Project: rule-strong top border, name link in ink, body ink-2, mono stack line. `.project--fig` adds a link plate above the text (Level 1 shadow, Level 2 on hover).
- Topics page: mono index of every category with counts, then one log per category (date column shows month and year).

### Page swaps
- Cross-document view transitions (`@view-transition { navigation: auto; }`); the panel has `view-transition-name: side` so it holds still while the column cross-fades in 180ms. A speculation-rules script prerenders same-site links on hover (excluding `/resume/`, `/projects/amazon/` and the feed), so swaps are close to instant in Chromium and Safari and plain page loads elsewhere. All of it is off under `prefers-reduced-motion`.

### Content rules (blog)
- Post URLs, categories and Disqus identifiers stay as they were; do not rename categories (they are part of the permalink).
- MathJax 3 loads only on posts with `math: true` or a `Math` tag.
- The resume is published by running `profile-site/publish-to-blog.py` against this repo; do not edit `resume/` by hand.
