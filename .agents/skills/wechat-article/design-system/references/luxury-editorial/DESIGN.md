# Design System Inspired by Luxury Editorial

## 1. Visual Theme & Atmosphere

Luxury Editorial design embodies timeless elegance through refined typography, sophisticated color palettes, and generous whitespace. Inspired by high-end fashion magazines like Vogue, Harper's Bazaar, and luxury brand publications, this aesthetic prioritizes quality over quantity, letting each element breathe and command attention.

The visual foundation is built on dark, rich backgrounds (`#0a0a0a` to `#1a1a1a`) or pristine whites (`#fafafa`), paired with warm gold accents (`#c9a962`, `#d4af37`) that evoke prestige and exclusivity. The interplay between serif headlines and sans-serif body creates a sophisticated rhythm that guides readers through content with effortless grace.

Typography is the hero — elegant serif typefaces like Playfair Display, Cormorant, and EB Garamond create dramatic headlines with high contrast strokes. Body text uses refined sans-serifs (Inter, Söhne, Graphik) that complement without competing. The hierarchy flows from editorial headline (60-72px) through deck (24-28px) to body (17-18px), creating a clear visual narrative.

**Key Characteristics:**
- Dark backgrounds with gold accents — or light backgrounds with black serif text
- Elegant serif display fonts — high contrast, refined letterforms
- Generous letter-spacing on headlines — editorial sophistication
- Minimal color palette — black, white, and gold form the foundation
- Ample whitespace — luxury means space, not clutter
- Subtle animations and transitions — refinement in every detail

## 2. Color Palette & Roles

### Dark Mode (Primary)

**Backgrounds**
- **Deep Black**: `#0a0a0a` — Primary page background
- **Rich Black**: `#1a1a1a` — Card backgrounds, elevated surfaces
- **Soft Black**: `#242424` — Secondary containers
- **Off Black**: `#2a2a2a` — Tertiary surfaces

**Text**
- **Pure White**: `#ffffff` — Headlines, primary text
- **Soft White**: `#e8e8e8` — Body text, readable on dark
- **Muted White**: `#a0a0a0` — Secondary text, captions

**Accents**
- **Champagne Gold**: `#c9a962` — Primary accent, borders
- **Rich Gold**: `#d4af37` — Hover states, emphasis
- **Light Gold**: `#e5d4a1` — Secondary accents
- **Rose Gold**: `#b76e79` — Alternative accent for warmth

### Light Mode

**Backgrounds**
- **Pristine White**: `#fafafa` — Primary background
- **Soft White**: `#ffffff` — Card backgrounds
- **Warm Gray**: `#f5f5f0` — Section backgrounds
- **Light Silver**: `#ebebeb` — Borders, dividers

**Text**
- **Deep Black**: `#0a0a0a` — Headlines
- **Charcoal**: `#2a2a2a` — Body text
- **Warm Gray**: `#666666` — Secondary text

**Accents**
- **Antique Gold**: `#b8860b` — Primary accent
- **Dark Gold**: `#996515` — Hover states
- **Bronze**: `#8b4513` — Alternative accent

## 3. Typography Rules

### Font Families
- **Display Serif**: `Playfair Display`, `Cormorant Garamond`, `EB Garamond` — for headlines
- **Body Sans**: `Inter`, `Graphik`, `Söhne` — for body text
- **Caption**: `Inter`, `DM Sans` — for labels and metadata

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Hero | Playfair Display | 60px (3.75rem) | 400-700 | 1.1 | 2% | Elegant, dramatic |
| H1 | Playfair Display | 48px (3rem) | 700 | 1.15 | 1.5% | Section headlines |
| H2 | Cormorant Garamond | 32px (2rem) | 500 | 1.25 | 1% | Subsection titles |
| H3 | Cormorant Garamond | 24px (1.5rem) | 500 | 1.3 | 0.5% | Card headlines |
| Deck | Inter | 22px (1.375rem) | 300 | 1.5 | 0% | Introductions |
| Body | Inter | 17px (1.0625rem) | 400 | 1.7 | 0% | Standard text |
| Small | Inter | 14px (0.875rem) | 400 | 1.6 | 0% | Captions |
| Label | Inter | 12px (0.75rem) | 500 | 1.4 | 3% uppercase | Tags, metadata |
| Quote | Cormorant Italic | 24px (1.5rem) | 400 | 1.5 | 0% | Pull quotes |

### Principles
- **Serif for headlines, sans-serif for body**: Editorial convention that creates visual rhythm
- **Generous letter-spacing on display text**: Adds refinement and readability at large sizes
- **High contrast weights**: 700 for headlines, 400 for body, 300 for decks
- **Line-height increases with size**: Smaller text needs more leading for readability

## 4. Component Stylings

### Cards

**Featured Card**
- Background: `#1a1a1a` (dark mode) or `#ffffff` (light mode)
- Border: `1px solid rgba(201, 169, 98, 0.3)` — subtle gold
- Radius: `2px` — minimal, refined
- Padding: `32px`
- Shadow: `0 4px 20px rgba(0, 0, 0, 0.15)` — soft, elegant

**Content Card**
- Background: `transparent`
- Border-bottom: `1px solid rgba(201, 169, 98, 0.2)`
- Padding: `24px 0`
- No shadow — clean, minimal

### Headlines

**Editorial Headline**
- Font: `Playfair Display`
- Size: `48-60px`
- Weight: `700`
- Letter-spacing: `0.02em`
- Line-height: `1.1`
- Color: `#ffffff` (dark) or `#0a0a0a` (light)
- Optional: Thin gold underline (1px)

**Section Divider**
- Thin gold line: `1px solid #c9a962`
- Width: `60px`
- Margin: `32px auto`

### Buttons

**Primary Button**
- Background: `transparent`
- Border: `1px solid #c9a962`
- Text: `#c9a962`
- Padding: `14px 32px`
- Radius: `0`
- Font: `Inter 14px weight 500`
- Letter-spacing: `0.1em` (uppercase)
- Hover: Background `#c9a962`, Text `#0a0a0a`

**Filled Button**
- Background: `#c9a962`
- Text: `#0a0a0a`
- Border: `none`
- Hover: Background `#d4af37`

### Badges & Tags

**Category Tag**
- Background: `transparent`
- Border: `1px solid rgba(201, 169, 98, 0.5)`
- Text: `#c9a962`
- Padding: `6px 16px`
- Radius: `0`
- Font: `Inter 11px weight 500`
- Text-transform: `uppercase`
- Letter-spacing: `0.15em`

### Blockquotes

**Pull Quote**
- Font: `Cormorant Garamond italic`
- Size: `28px`
- Line-height: `1.5`
- Color: `#ffffff` (dark) or `#2a2a2a` (light)
- Border-left: `2px solid #c9a962`
- Padding-left: `24px`
- Margin: `48px 0`

**Featured Quote**
- Background: `rgba(201, 169, 98, 0.05)`
- Padding: `32px`
- Text-align: `center`
- Font: `Playfair Display 32px italic`

### Lists

- List-style: `none`
- Item padding: `12px 0`
- Item border-bottom: `1px solid rgba(255, 255, 255, 0.1)`
- Custom markers: Gold diamond or bullet

### Dividers

**Gold Line**
- Height: `1px`
- Background: `linear-gradient(90deg, transparent, #c9a962, transparent)`
- Width: `100%`
- Margin: `48px 0`

**Double Line**
- Two thin lines with `8px` gap
- Color: `rgba(201, 169, 98, 0.3)`

## 5. Layout Principles

### Container
- Max-width: `720px` (optimal reading width)
- Padding: `48px 24px`
- Margin: `0 auto`

### Spacing Scale
| Name | Value | Use |
|------|-------|-----|
| xs | 8px | Micro spacing |
| sm | 16px | Tight spacing |
| md | 24px | Standard spacing |
| lg | 32px | Component padding |
| xl | 48px | Section spacing |
| xxl | 72px | Major section breaks |
| hero | 96px | Hero spacing |

### Grid System
- Single column for body content
- Two-column for featured layouts
- Asymmetric grids for editorial interest

### Whitespace Philosophy
- Whitespace is luxury — use generously
- 48px minimum between sections
- 72px for major transitions
- Let headlines breathe with generous margins

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow | Background elements |
| Subtle | `0 2px 8px rgba(0,0,0,0.08)` | Light cards |
| Medium | `0 4px 20px rgba(0,0,0,0.15)` | Featured content |
| Dramatic | `0 8px 40px rgba(0,0,0,0.25)` | Hero elements |

**Shadow Philosophy**: Soft, diffused shadows that add subtle depth without harsh edges. Luxury design avoids visible shadow edges — gradients are smooth and imperceptible.

## 7. Do's and Don'ts

### Do
- Use serif fonts for headlines — elegance and tradition
- Apply generous letter-spacing to display text
- Maintain a minimal color palette — black, white, gold
- Add ample whitespace between elements
- Use thin, refined borders (1px) in gold
- Keep animations subtle and smooth
- Center-align featured content
- Use italic for emphasis and quotes

### Don't
- Don't mix more than 2 font families in one design
- Don't use bold weights for body text — stick to regular
- Don't add decorative elements — minimal is luxurious
- Don't use bright colors — muted and metallic only
- Don't crowd elements — give each space to breathe
- Don't use rounded corners — sharp edges are refined
- Don't apply heavy shadows — subtlety is elegance

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, reduced sizes |
| Tablet | 640-1024px | Adjusted padding |
| Desktop | >1024px | Full layout |

### Mobile Adaptations
- Headlines: 60px → 36px
- Body: 17px → 16px
- Padding: 48px → 24px
- Whitespace: Reduce by ~30%
- Maintain font choices and colors

## 9. Agent Prompt Guide

### Quick Color Reference (Dark Mode)
- Background: `#0a0a0a`
- Surface: `#1a1a1a`
- Text: `#ffffff`
- Muted text: `#a0a0a0`
- Accent: `#c9a962`

### Example Component Prompts
- "Create a luxury headline: Playfair Display 60px weight 700, white color, 2% letter-spacing, 1.1 line-height. Add a thin gold underline (60px wide, 1px solid #c9a962) centered below with 24px margin-top."

- "Design an editorial card: dark background #1a1a1a, 32px padding, subtle gold border rgba(201,169,98,0.3), 2px radius, soft shadow 0 4px 20px rgba(0,0,0,0.15). Title in Playfair Display 24px, body in Inter 17px."

- "Build a pull quote: Cormorant Garamond italic 28px, 2px solid gold left border, 24px left padding, 48px vertical margin, centered or left-aligned."

- "Create a category tag: Inter 11px weight 500, uppercase, 0.15em letter-spacing, gold border 1px, transparent background, 6px 16px padding, no radius."

### Iteration Guide
1. Start with a dark background and white text
2. Add Playfair Display for headlines with generous letter-spacing
3. Use Inter for body text at 17px with 1.7 line-height
4. Introduce gold (#c9a962) as the sole accent color
5. Add thin gold borders and dividers sparingly
6. Ensure generous whitespace (48px minimum between sections)
7. Use italic for quotes and emphasis

## 10. WeChat Compatibility Notes

### Font Fallbacks
```css
font-family: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
font-family: 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif;
```

### Inline Styles
All styles must be inlined. WeChat filters `<style>` tags.

### Tested Properties
- `font-family`: Works with fallbacks
- `letter-spacing`: Supported
- `border`: Solid borders work well
- `background-color`: Solid colors recommended
- `box-shadow`: Supported but test rendering

### Recommendations
- Use system font fallbacks for reliability
- Test gold colors on actual WeChat client
- Avoid complex gradients — use solid colors
- Keep typography hierarchy clear without relying on font-face
