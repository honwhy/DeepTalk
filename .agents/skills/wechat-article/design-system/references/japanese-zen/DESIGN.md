# Design System Inspired by Japanese Zen Aesthetics

## 1. Visual Theme & Atmosphere

Japanese Zen design embodies the philosophy of "ma" (間) — the thoughtful use of negative space that gives meaning to presence. This aesthetic draws from traditional Japanese principles: wabi-sabi (imperfection as beauty), shibui (subtle elegance), and yūgen (profound grace). Every element exists with purpose; nothing is superfluous.

The visual foundation is profoundly minimal — warm off-whites (`#faf9f6`) or soft creams (`#f5f3ef`) create a gentle canvas that feels like handmade washi paper. Against this, charcoal text (`#2a2a2a`) and subtle ink-wash grays (`#8a8a8a`) flow with the calm certainty of brush strokes on rice paper. The rare accent appears as muted earth tones: warm terracotta (`#c17f59`), deep indigo (`#1a365d`), or soft moss green (`#5c7a5c`).

Typography prioritizes readability and tranquility. Serif fonts with gentle curves (Source Serif Pro, Crimson Text) echo traditional calligraphy, while clean sans-serifs (Hiragino Sans, Yu Gothic, Noto Sans) respect the geometric clarity of Japanese writing systems. Generous line-height (1.8-2.0) and wide letter-spacing create a meditative reading pace.

**Key Characteristics:**
- Abundant whitespace — ma (negative space) as design element
- Warm, natural color palette — paper, ink, earth, indigo
- Gentle typography with generous spacing — slow, contemplative reading
- Subtle texture and grain — washi paper aesthetic
- Asymmetric balance — intentional imperfection
- Minimal borders and lines — use space, not strokes
- Nature-inspired accents — wood, stone, water, sky

## 2. Color Palette & Roles

### Primary Colors

**Backgrounds**
- **Washi White**: `#faf9f6` — Primary background, warm paper tone
- **Cream**: `#f5f3ef` — Secondary background, aged paper
- **Soft Cream**: `#f8f6f1` — Card backgrounds
- **Light Warm**: `#f0ede6` — Elevated surfaces

**Text**
- **Sumi Black**: `#2a2a2a` — Primary text, like ink on paper
- **Charcoal**: `#4a4a4a` — Secondary text
- **Warm Gray**: `#6a6a6a` — Captions, metadata
- **Light Gray**: `#9a9a9a` — Muted text, timestamps

### Accent Colors (Use Sparingly)

**Earth Tones**
- **Terracotta**: `#c17f59` — Primary accent, warmth
- **Burnt Sienna**: `#a66854` — Secondary accent
- **Soft Clay**: `#d4a574` — Tertiary accent

**Traditional Japanese**
- **Indigo**: `#1a365d` — Deep, contemplative accent
- **Persimmon**: `#c84b31` — Warm highlight
- **Matcha**: `#5c7a5c` — Natural green accent
- **Sakura**: `#e8b4b8` — Subtle pink highlight

### Dividers & Borders
- **Ink Line**: `#d0cdc5` — Subtle dividers
- **Warm Line**: `#e0ddd5` — Very subtle separators
- **Accent Line**: Match accent color at 30% opacity

## 3. Typography Rules

### Font Families
- **Display**: `Source Serif Pro`, `Crimson Text`, `Georgia` — for headlines
- **Body**: `Noto Sans SC`, `Hiragino Sans`, `Yu Gothic` — for Chinese/Japanese
- **Body Latin**: `Source Sans Pro`, `Noto Sans` — for English body text
- **Caption**: `Noto Sans`, `Source Sans Pro` — for labels

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Hero | Source Serif Pro | 42px (2.625rem) | 400 | 1.3 | 0.02em | Calm, unhurried |
| H1 | Source Serif Pro | 32px (2rem) | 400 | 1.35 | 0.01em | Section titles |
| H2 | Source Serif Pro | 26px (1.625rem) | 400 | 1.4 | 0em | Subsection titles |
| H3 | Noto Sans | 20px (1.25rem) | 400 | 1.5 | 0em | Card headlines |
| Body | Noto Sans SC | 17px (1.0625rem) | 400 | 1.9 | 0.02em | Contemplative pace |
| Small | Noto Sans | 15px (0.9375rem) | 400 | 1.7 | 0em | Captions |
| Label | Noto Sans | 13px (0.8125rem) | 400 | 1.5 | 0.1em | Metadata |
| Quote | Source Serif Pro | 22px (1.375rem) | 400 italic | 1.7 | 0em | Wisdom, reflection |

### Principles
- **Light weights over bold**: 400 is default; 500 maximum for emphasis
- **Generous line-height**: 1.8-2.0 for body creates breathing room
- **Wide letter-spacing**: 0.02em for body, more for display
- **Vertical rhythm**: Spacing follows consistent multiples (8px base)
- **No all-caps**: Uppercase feels too aggressive for zen aesthetics

## 4. Component Stylings

### Cards

**Content Card**
- Background: `#f8f6f1` or transparent
- Border: `none` (use space as separator)
- Radius: `0` (sharp corners echo paper edges) or `2px` (minimal)
- Padding: `32px 0`
- Shadow: `none` — purity, no artifice

**Featured Card**
- Background: `#faf9f6`
- Border: `1px solid #e0ddd5`
- Radius: `2px`
- Padding: `40px`
- Shadow: `0 2px 8px rgba(42, 42, 42, 0.04)` — barely visible

### Headlines

**Zen Headline**
- Font: `Source Serif Pro 32-42px weight 400`
- Color: `#2a2a2a`
- Letter-spacing: `0.02em`
- Line-height: `1.3`
- Margin-bottom: `24px` (generous)
- No underline, no decoration

### Buttons

**Minimal Button**
- Background: `transparent`
- Text: `#2a2a2a`
- Border: `1px solid #2a2a2a`
- Padding: `14px 32px`
- Radius: `0`
- Font: `Noto Sans 15px weight 400`
- Letter-spacing: `0.05em`
- Hover: Background `#2a2a2a`, Text `#faf9f6`

**Accent Button**
- Background: `#c17f59` (terracotta)
- Text: `#faf9f6`
- Border: `none`
- Hover: Background `#a66854`

### Badges & Tags

**Category Tag**
- Background: `transparent`
- Text: `#6a6a6a`
- Border: `none`
- Padding: `0`
- Font: `Noto Sans 13px weight 400`
- Letter-spacing: `0.1em`
- Use: Subtle categorization without visual weight

**Dot Separator**
- Small circle: `4px`, color `#d0cdc5`
- Use between metadata items

### Blockquotes

**Zen Quote**
- Font: `Source Serif Pro italic 22px`
- Line-height: `1.7`
- Color: `#4a4a4a`
- Border-left: `2px solid #c17f59`
- Padding-left: `24px`
- Margin: `48px 0`
- No background — purity

**Full-width Quote**
- Center-aligned
- Font: `Source Serif Pro 28px`
- Color: `#2a2a2a`
- Padding: `64px 0`
- No border — space is the frame

### Lists

- List-style: `none`
- Item padding: `16px 0`
- Item border-bottom: `1px solid #e0ddd5` (subtle)
- Use: Clean, minimal lists

### Dividers

**Subtle Line**
- Height: `1px`
- Background: `#e0ddd5`
- Margin: `48px 0`
- Max-width: `60%` — centered

**Breathing Space**
- No line, just `64px` margin
- Use space as the divider

## 5. Layout Principles

### Container
- Max-width: `680px` — optimal for contemplative reading
- Padding: `48px 24px` — generous margins
- Margin: `0 auto`

### Spacing Scale
| Name | Value | Use |
|------|-------|-----|
| xs | 8px | Micro spacing |
| sm | 16px | Tight spacing |
| md | 24px | Standard spacing |
| lg | 32px | Component padding |
| xl | 48px | Section spacing |
| xxl | 64px | Major section breaks |
| zen | 96px | Contemplative pauses |

### Grid System
- Single column for body content
- Asymmetric layouts for visual interest
- Let content determine structure, not grids

### Whitespace Philosophy
- Whitespace is the primary design element
- 64px minimum between major sections
- Let content breathe — crowding destroys tranquility
- Use margin, not borders, to separate

### Asymmetric Balance
- Offset content for visual interest
- Use golden ratio (1:1.618) for proportions
- Embrace intentional imperfection (wabi-sabi)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow | Default state |
| Subtle | `0 1px 3px rgba(42,42,42,0.03)` | Light elevation |
| Soft | `0 2px 8px rgba(42,42,42,0.06)` | Featured content |

**Shadow Philosophy**: Zen design avoids visible shadows. If shadows are necessary, they should be nearly imperceptible — a hint of depth, not a statement. Elevation through background color variation is preferred.

## 7. Do's and Don'ts

### Do
- Use generous whitespace — ma is essential
- Apply warm, natural colors — paper, ink, earth
- Choose light font weights — 400 is elegant
- Set wide line-height — 1.8+ for body
- Use asymmetric layouts — intentional imperfection
- Keep borders minimal or non-existent
- Add texture subtly — paper grain effect
- Pace the reader — slow, contemplative

### Don't
- Don't crowd content — space is precious
- Don't use bold weights — too aggressive
- Don't add bright colors — nature tones only
- Don't apply heavy shadows — nearly invisible
- Don't use all-caps text — too loud
- Don't add decorative elements — purpose only
- Don't create rigid symmetry — organic balance
- Don't rush the reader — contemplation is the goal

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Maintain spacing, reduce size |
| Tablet | 640-1024px | Standard layout |
| Desktop | >1024px | Full margins |

### Mobile Adaptations
- Headlines: 42px → 28px
- Body: 17px → 16px
- Line-height: Maintain at 1.8+
- Padding: 48px → 32px
- Keep the generous spacing philosophy

### Reading Experience
- Preserve slow, contemplative pace on all devices
- Whitespace percentage should remain similar
- Don't compress mobile spacing too much

## 9. Agent Prompt Guide

### Quick Color Reference
- Background: `#faf9f6` (washi white)
- Text: `#2a2a2a` (sumi black)
- Muted text: `#6a6a6a`
- Divider: `#e0ddd5`
- Accent: `#c17f59` (terracotta)

### Example Component Prompts
- "Create a zen headline: Source Serif Pro 42px weight 400, sumi black (#2a2a2a), 0.02em letter-spacing, 1.3 line-height. No decoration, generous margin-bottom (24px)."

- "Design a content card: washi white (#faf9f6) background, no border, no shadow, 40px padding. Title in Source Serif Pro 26px weight 400, body in Noto Sans SC 17px weight 400, 1.9 line-height."

- "Build a pull quote: Source Serif Pro italic 22px, charcoal (#4a4a4a) text, 2px solid terracotta left border, 24px left padding, 48px vertical margin, 1.7 line-height."

- "Create a minimal button: transparent background, sumi black text, 1px solid sumi black border, no radius, 14px 32px padding, Noto Sans 15px weight 400, 0.05em letter-spacing."

### Iteration Guide
1. Start with warm off-white background (#faf9f6)
2. Add charcoal text (#2a2a2a) with generous line-height (1.9)
3. Use Source Serif Pro for headlines at light weight
4. Apply Noto Sans SC for body with 0.02em letter-spacing
5. Add whitespace — minimum 48px between sections
6. Use terracotta (#c17f59) as rare accent color
7. Remove borders and decorations — let space define structure
8. Ensure asymmetric, organic balance

## 10. WeChat Compatibility Notes

### Font Recommendations
```css
/* Primary fonts with fallbacks */
font-family: 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
font-family: 'Source Serif Pro', 'Georgia', 'Times New Roman', serif;
```

### Inline Styles
All styles must be inlined for WeChat.

### Tested Properties
- `font-family`: Use system fonts for reliability
- `letter-spacing`: Supported
- `line-height`: Fully supported
- `color`: All hex colors work
- `background-color`: Solid colors recommended

### Special Considerations
- Chinese fonts may not render perfectly — test on device
- Warm cream tones may appear differently on various screens
- Generous spacing helps readability on small mobile screens
- Avoid paper texture effects — use flat colors
