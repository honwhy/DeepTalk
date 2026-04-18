# Design System Inspired by Neo-Brutalism

## 1. Visual Theme & Atmosphere

Neo-Brutalism is a bold, unapologetic design movement that embraces raw aesthetics, high contrast, and intentional "imperfection." Unlike minimalism's subtle refinement, Neo-Brutalism celebrates confrontation through thick borders, vibrant colors, and deliberately crude typography. The style draws from Brutalist architecture's honest use of materials, translating concrete's raw beauty into digital spaces.

The visual foundation combines stark white backgrounds (`#ffffff`) with harsh black text (`#000000`), punctuated by electric accent colors like neon yellow (`#FFFF00`), hot pink (`#FF00FF`), and electric blue (`#0066FF`). Borders are deliberately thick (3-4px), shadows are solid (not blurred), and nothing tries to be "pretty" — everything is unapologetically functional.

Typography favors bold sans-serifs with geometric construction: Space Grotesk, Space Mono, DM Sans, and Instrument Sans. The hierarchy is created through extreme weight contrast (800 vs 400) and size jumps (48px headlines, 16px body) rather than subtle gradations.

**Key Characteristics:**
- High contrast black/white with electric accent colors — no subtle gradients
- Thick borders (3-4px solid) — visible structure as decoration
- Solid drop shadows (no blur) — offset shadows in accent colors
- Bold geometric sans-serifs — industrial, not elegant
- Intentionally "crude" elements — raw, honest, unpolished
- Grid-based layouts with visible structure — no hiding the scaffolding

## 2. Color Palette & Roles

### Primary
- **Pure Black** (`#000000`): Text, borders, structure — the backbone
- **Stark White** (`#ffffff`): Background — maximum contrast

### Accent Colors (Electric Palette)
- **Neon Yellow** (`#FFFF00`): Primary highlight, CTAs, emphasis boxes
- **Hot Pink** (`#FF00FF`): Secondary accent, warnings, special callouts
- **Electric Blue** (`#0066FF`): Links, interactive elements, tertiary accent
- **Signal Red** (`#FF0000`): Errors, important notices, alerts
- **Acid Green** (`#00FF00`): Success states, positive metrics

### Shadows & Borders
- **Shadow Black** (`#000000`): Solid offset shadows (no blur)
- **Shadow Accent**: Match accent color for colored shadows
- **Border Thickness**: 3-4px solid — consistent across all elements

### Neutral Variations
- **Off White** (`#f5f5f5`): Section backgrounds, subtle differentiation
- **Light Gray** (`#e0e0e0`): Disabled states, secondary borders

## 3. Typography Rules

### Font Families
- **Display**: `Space Grotesk`, fallbacks: `Arial Black, Gadget, sans-serif`
- **Body**: `DM Sans`, fallbacks: `Arial, Helvetica, sans-serif`
- **Monospace**: `Space Mono`, fallbacks: `Courier New, monospace`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Hero | Space Grotesk | 48px (3rem) | 800 | 1.0 | -2% | All caps optional |
| H1 | Space Grotesk | 36px (2.25rem) | 700 | 1.1 | -1% | Section titles |
| H2 | Space Grotesk | 28px (1.75rem) | 700 | 1.2 | 0% | Subsection titles |
| H3 | Space Grotesk | 22px (1.375rem) | 600 | 1.3 | 0% | Card titles |
| Body | DM Sans | 16px (1rem) | 400 | 1.6 | 0% | Standard text |
| Body Bold | DM Sans | 16px (1rem) | 700 | 1.6 | 0% | Emphasis |
| Small | DM Sans | 14px (0.875rem) | 400 | 1.5 | 0% | Captions, meta |
| Mono | Space Mono | 14px (0.875rem) | 400 | 1.6 | 0% | Code, technical |
| Label | Space Grotesk | 12px (0.75rem) | 700 | 1.0 | 2% | Tags, badges |

### Principles
- **Weight contrast over size contrast**: Use 800 vs 400 weight to create hierarchy
- **Geometric over humanist**: Angular, constructed letterforms fit the brutalist ethos
- **No italics**: Brutalism is upright and unapologetic
- **Limited type scale**: Jump between sizes dramatically (48px → 16px), no subtle steps

## 4. Component Stylings

### Cards

**Standard Card**
- Background: `#ffffff`
- Border: `4px solid #000000`
- Shadow: `4px 4px 0 #000000` (solid, no blur)
- Radius: `0` (sharp corners are brutalist)
- Padding: `24px`
- Hover: `translate(-2px, -2px)`, shadow becomes `6px 6px 0 #000000`

**Accent Card**
- Background: `#FFFF00` (or other accent)
- Border: `4px solid #000000`
- Shadow: `4px 4px 0 #000000`
- Text: `#000000` (always black on accent)

### Buttons

**Primary Button**
- Background: `#000000`
- Text: `#ffffff`
- Border: `3px solid #000000`
- Shadow: `4px 4px 0 #FFFF00`
- Padding: `14px 28px`
- Radius: `0`
- Font: `Space Grotesk 16px weight 700`
- Hover: Background `#FFFF00`, Text `#000000`

**Ghost Button**
- Background: `transparent`
- Text: `#000000`
- Border: `3px solid #000000`
- Shadow: `none`
- Hover: Background `#000000`, Text `#ffffff`

### Badges & Tags

**Standard Badge**
- Background: `#FFFF00`
- Text: `#000000`
- Padding: `4px 12px`
- Radius: `0`
- Border: `2px solid #000000`
- Font: `Space Grotesk 12px weight 700`

**Outline Badge**
- Background: `transparent`
- Text: `#000000`
- Border: `2px solid #000000`
- Padding: `4px 12px`

### Blockquotes

**Brutalist Quote**
- Background: `#f5f5f5`
- Border-left: `6px solid #000000`
- Border-top: `4px solid #000000`
- Padding: `20px 24px`
- Font: `Space Grotesk 20px weight 600`
- Shadow: `4px 4px 0 #FFFF00`

### Lists

- List-style: `none` (use custom markers)
- Item padding: `12px 0`
- Item border-bottom: `2px solid #000000`
- Custom markers: Colored squares or numbers in accent color

### Code Blocks

- Background: `#000000`
- Text: `#00FF00` (terminal green)
- Padding: `20px`
- Border: `3px solid #000000`
- Font: `Space Mono 14px`
- Shadow: `4px 4px 0 #FFFF00`

## 5. Layout Principles

### Container
- Max-width: `800px` (narrow, focused reading)
- Padding: `24px`
- Alignment: `left` (brutalism is not centered)

### Grid System
- Use visible grid lines as design elements
- 12-column grid with `20px` gap
- Elements span columns without padding inside grid

### Spacing Scale
| Name | Value | Use |
|------|-------|-----|
| xs | 4px | Micro spacing |
| sm | 8px | Tight spacing |
| md | 16px | Standard spacing |
| lg | 24px | Component padding |
| xl | 32px | Section spacing |
| xxl | 48px | Major section breaks |

### Border Radius Scale
- **None**: `0` — The brutalist default
- **Minimal**: `2px` — Only when absolutely necessary

### Whitespace Philosophy
- Whitespace is functional, not decorative
- Generous margins create breathing room for bold elements
- Don't fill space — let elements breathe

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow | Background elements |
| Raised | `4px 4px 0 #000000` | Cards, interactive elements |
| Hover | `6px 6px 0 #000000` | Active/hover states |
| Accent Shadow | `4px 4px 0 #FFFF00` | Highlighted elements |

**Shadow Philosophy**: All shadows are solid (no blur), offset diagonally. The shadow is a design element, not a subtle depth cue. Colored shadows draw attention to important elements.

## 7. Do's and Don'ts

### Do
- Use thick borders (3-4px) as visual structure
- Apply solid offset shadows in black or accent colors
- Create high contrast with pure black and white
- Use bold, geometric sans-serif fonts
- Make deliberate design choices — brutalism is intentional
- Use visible grid structures as decoration
- Add accent colors sparingly for maximum impact
- Embrace sharp corners — radius: 0

### Don't
- Don't use blurred shadows — solid only
- Don't add rounded corners — brutalism is angular
- Don't use subtle color variations — high contrast or nothing
- Don't apply decorative gradients — flat colors only
- Don't use elegant or humanist typefaces — go geometric
- Don't hide the structure — let borders and grids show
- Don't use drop shadows for "depth" — use them as graphic elements

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, reduced padding |
| Tablet | 640-1024px | 2-column grid |
| Desktop | >1024px | Full layout |

### Mobile Adaptations
- Stack all columns vertically
- Reduce shadow offset to `2px 2px`
- Maintain border thickness (crucial for brutalist identity)
- Reduce heading sizes by ~20%

## 9. Agent Prompt Guide

### Quick Color Reference
- Background: `#ffffff`
- Text: `#000000`
- Primary accent: `#FFFF00`
- Shadow: `4px 4px 0 #000000`

### Example Component Prompts
- "Create a brutalist card: white background, 4px solid black border, 4px 4px 0 black solid shadow, no border-radius, 24px padding. On hover, translate -2px -2px and increase shadow to 6px 6px."

- "Design a brutalist heading: Space Grotesk 48px weight 800, black color, no letter-spacing, uppercase optional. Add a 6px solid black border-left with 20px padding-left."

- "Build a neon accent button: yellow (#FFFF00) background, black text, 3px solid black border, Space Grotesk 16px weight 700, no border-radius, 4px 4px 0 black shadow. On hover, invert colors."

- "Create a brutalist code block: black background, terminal green (#00FF00) text, Space Mono 14px, 3px solid black border, 4px 4px 0 yellow shadow, 20px padding."

### Iteration Guide
1. Start with pure black text on stark white
2. Add thick (4px) black borders to define structure
3. Apply solid offset shadows (4px 4px 0) for elevation
4. Introduce one accent color (yellow, pink, or blue) for highlights
5. Use Space Grotesk for headlines, DM Sans for body
6. Keep corners sharp — no border-radius
7. Ensure high contrast and deliberate visual decisions

## 10. WeChat Compatibility Notes

### Inline CSS Requirement
All styles must be inlined for WeChat compatibility. Use the style attribute on every element.

### Safe Properties
- `border`: Fully supported with solid style
- `box-shadow`: Supported, but test rendering
- `font-weight`: 400-900 supported
- `background-color`: Solid colors work best

### Font Fallbacks
WeChat may not render custom fonts. Always include fallbacks:
```css
font-family: 'Space Grotesk', 'Arial Black', 'Gadget', sans-serif;
```

### Performance Tips
- Avoid complex nested shadows
- Use solid colors instead of gradients
- Keep border widths consistent (3-4px)
- Test on actual WeChat client before publishing
