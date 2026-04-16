# Design System Inspired by Vintage Newspaper

## 1. Visual Theme & Atmosphere

Vintage Newspaper design captures the timeless authority and trustworthiness of classic journalism. Drawing from centuries of newspaper tradition — from The New York Times to The Guardian — this aesthetic conveys credibility through structured layouts, classic typography, and the distinctive texture of newsprint.

The visual foundation mimics aged paper: warm cream backgrounds (`#f4f1ea` to `#e8e4d9`) with subtle grain texture create the feeling of holding a physical newspaper. Text appears in deep ink black (`#1a1a1a`) or traditional sepia (`#2d2a26`), with headlines set in bold condensed typefaces that command attention without shouting.

Typography follows strict editorial conventions: multi-column layouts, justified text (or carefully ragged), dramatic masthead headlines, and clear information hierarchy. Serif fonts dominate — Georgia, Playfair Display, or classic condensed faces — while maintaining excellent readability at small sizes, just as newspapers have done for generations.

**Key Characteristics:**
- Warm cream/sepia backgrounds — aged paper aesthetic
- Multi-column layouts — traditional news grid
- Bold condensed headlines — dramatic, authoritative
- Strict typographic hierarchy — editorial discipline
- Thin rules and borders — visual structure
- Dense text blocks — information-rich presentation
- Drop caps and pull quotes — editorial flourishes

## 2. Color Palette & Roles

### Primary Colors

**Backgrounds**
- **Newsprint**: `#f4f1ea` — Primary background, warm paper
- **Aged Paper**: `#e8e4d9` — Secondary background
- **Cream**: `#f0ebe0` — Highlighted sections
- **Light Sepia**: `#f5f0e5` — Card backgrounds

**Text**
- **Ink Black**: `#1a1a1a` — Primary text, headlines
- **Sepia**: `#2d2a26` — Body text, aged look
- **Dark Gray**: `#3a3a3a` — Secondary text
- **Medium Gray**: `#5a5a5a` — Captions, metadata

### Accent Colors
- **Printer's Red**: `#8b1a1a` — Breaking news, alerts
- **Navy**: `#1a2a4a` — Links, bylines
- **Dark Green**: `#2a4a2a` — Special sections

### Rules & Borders
- **Thin Rule**: `#c5c0b5` — Column separators
- **Medium Rule**: `#a09a8d` — Section dividers
- **Thick Rule**: `#2d2a26` — Major breaks

## 3. Typography Rules

### Font Families
- **Masthead**: `Playfair Display`, `Old Standard TT`, `UnifrakturMaguntia` — for logos
- **Headlines**: `Playfair Display`, `Crimson Text`, `Libre Baskerville` — for titles
- **Condensed Headlines**: `Oswald`, `Bebas Neue`, `Archivo Narrow` — for dramatic headers
- **Body**: `Georgia`, `Merriweather`, `Libre Baskerville` — for reading
- **Caption**: `Georgia`, `Crimson Text` — for metadata

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Masthead | Playfair Display | 48-64px | 700-900 | 1.0 | 0 | Dramatic, centered |
| Banner Headline | Oswald | 36-48px | 700 | 1.0 | -0.01em | Condensed, all caps |
| H1 | Playfair Display | 32px | 700 | 1.15 | 0 | Section headlines |
| H2 | Crimson Text | 24px | 600 | 1.25 | 0 | Subsection titles |
| H3 | Georgia | 18px | 700 | 1.3 | 0 | Card headlines |
| Body | Georgia | 16px | 400 | 1.6 | 0 | Justified or ragged |
| Small | Georgia | 14px | 400 | 1.5 | 0 | Captions |
| Byline | Georgia | 13px | 400 italic | 1.4 | 0.05em | Author credits |
| Label | Oswald | 11px | 500 | 1.0 | 0.1em | Category tags |

### Principles
- **Justified text for formal sections**: Traditional newspaper alignment
- **Ragged right for modern feel**: Left-aligned, naturally uneven
- **Dense text blocks**: Newspapers pack information efficiently
- **Drop caps for lead paragraphs**: Traditional editorial flourish
- **Hyphenation allowed**: Traditional typesetting practice

## 4. Component Stylings

### Cards

**Article Card**
- Background: `#f4f1ea` or transparent
- Border: `none` or `1px solid #c5c0b5` (thin rule)
- Radius: `0` — sharp corners, traditional
- Padding: `20px 0` (tight, newspaper density)
- Shadow: `none`

**Feature Card**
- Background: `#f0ebe0`
- Border: `2px solid #2d2a26` (thicker rule for emphasis)
- Padding: `24px`
- No shadow

### Headlines

**Banner Headline**
- Font: `Oswald 48px weight 700`
- Text-transform: `uppercase`
- Letter-spacing: `-0.01em`
- Color: `#1a1a1a`
- Text-align: `center`
- Rule below: `3px solid #2d2a26`
- Padding-bottom: `8px`
- Margin-bottom: `16px`

**Standard Headline**
- Font: `Playfair Display 32px weight 700`
- Color: `#1a1a1a`
- No decoration
- Optional: Thin rule above

### Drop Cap

**Initial Drop Cap**
- Font: `Playfair Display`
- Size: `48px` (3 lines tall)
- Float: `left`
- Color: `#1a1a1a`
- Margin-right: `8px`
- Line-height: `0.8`

### Buttons

**Text Link Style**
- Color: `#1a2a4a` (navy)
- Text-decoration: `underline`
- Hover: Color `#8b1a1a` (printer's red)

**Minimal Button**
- Background: `transparent`
- Text: `#1a1a1a`
- Border: `1px solid #1a1a1a`
- Padding: `10px 24px`
- Font: `Oswald 14px weight 500`
- Text-transform: `uppercase`
- Letter-spacing: `0.05em`

### Blockquotes

**Pull Quote**
- Font: `Georgia italic 20px`
- Color: `#2d2a26`
- Border-left: `3px solid #8b1a1a`
- Padding-left: `20px`
- Margin: `32px 0`
- Optional: Quote marks in large light gray

**Featured Quote**
- Center-aligned
- Font: `Playfair Display 28px italic`
- Color: `#1a1a1a`
- Padding: `32px 0`
- Border-top: `1px solid #c5c0b5`
- Border-bottom: `1px solid #c5c0b5`

### Lists

- List-style: `disc` inside
- Item padding: `8px 0`
- Item border-bottom: `1px dotted #c5c0b5`
- Dense, information-focused

### Dividers

**Thin Rule**
- Height: `1px`
- Background: `#c5c0b5`
- Margin: `24px 0`

**Double Rule**
- Two `1px` lines with `4px` gap
- Color: `#2d2a26`
- Use: Section breaks

**Thick Rule**
- Height: `3px`
- Background: `#2d2a26`
- Margin: `32px 0`
- Use: Major section breaks

### Metadata

**Byline**
- Font: `Georgia 13px italic`
- Color: `#5a5a5a`
- Format: "By [Author Name]"

**Dateline**
- Font: `Oswald 11px weight 500`
- Color: `#3a3a3a`
- Text-transform: `uppercase`
- Letter-spacing: `0.1em`
- Format: "[CITY] —" or date

## 5. Layout Principles

### Container
- Max-width: `760px` (narrow, newspaper column width)
- Padding: `32px 20px` (tight margins)
- Margin: `0 auto`

### Multi-Column Grid
- Desktop: 2-3 columns (newspaper style)
- Column gap: `20px`
- Column rule: `1px solid #c5c0b5`

### Spacing Scale
| Name | Value | Use |
|------|-------|-----|
| xs | 4px | Tight spacing |
| sm | 8px | Standard spacing |
| md | 16px | Component spacing |
| lg | 24px | Section spacing |
| xl | 32px | Major sections |
| xxl | 48px | Article breaks |

### Whitespace Philosophy
- Dense but readable — newspapers maximize content
- Clear section breaks with rules
- Tight leading (1.5-1.6) for dense text
- Rules compensate for minimal whitespace

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow | Default (paper) |
| Subtle | Box shadow light | Hover states |

**Shadow Philosophy**: Newspapers are flat — avoid shadows. Use rules and borders to create structure. If shadows are needed, keep them very subtle: `0 1px 2px rgba(0,0,0,0.1)`.

## 7. Do's and Don'ts

### Do
- Use warm cream/sepia backgrounds — newsprint aesthetic
- Apply multi-column layouts on desktop — traditional grid
- Set headlines in condensed or bold serif faces
- Use thin rules to separate sections — visual structure
- Add drop caps to lead paragraphs — editorial flourish
- Include bylines and datelines — journalistic convention
- Keep text dense but readable — information-rich
- Use justified or carefully ragged text — typesetting tradition

### Don't
- Don't use bright colors — traditional, muted palette
- Don't add rounded corners — sharp, like paper edges
- Don't apply heavy shadows — newspapers are flat
- Don't use sans-serif for body — serifs aid readability
- Don't waste space — density is traditional
- Don't skip the masthead area — newspaper identity
- Don't use modern flourishes — stay classic

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, maintain density |
| Tablet | 640-1024px | 2 columns |
| Desktop | >1024px | 2-3 columns |

### Mobile Adaptations
- Single column layout (multi-column breaks mobile reading)
- Headlines: 48px → 28px
- Body: 16px → 15px
- Keep dense text feel
- Maintain typographic hierarchy

### Reading Experience
- Preserve editorial structure on mobile
- Stack columns vertically
- Keep rules and separators
- Maintain newspaper authority

## 9. Agent Prompt Guide

### Quick Color Reference
- Background: `#f4f1ea` (newsprint)
- Text: `#1a1a1a` (ink black)
- Secondary text: `#2d2a26` (sepia)
- Rule: `#c5c0b5`
- Accent: `#8b1a1a` (printer's red)

### Example Component Prompts
- "Create a newspaper banner headline: Oswald 48px weight 700, uppercase, -0.01em letter-spacing, centered, ink black (#1a1a1a), 3px solid ink black rule below with 8px margin."

- "Design an article with drop cap: first letter Playfair Display 48px, float left, 8px right margin, body text Georgia 16px, 1.6 line-height, justified or ragged right."

- "Build a pull quote: Georgia italic 20px, sepia (#2d2a26) color, 3px solid printer's red left border, 20px left padding, 32px vertical margin, with optional large gray quotation marks."

- "Create a byline: Georgia 13px italic, medium gray (#5a5a5a), format 'By [Name]', followed by dateline in Oswald 11px uppercase with 0.1em letter-spacing."

### Iteration Guide
1. Start with warm cream background (#f4f1ea)
2. Add ink black text (#1a1a1a) in Georgia for body
3. Create banner headline in Oswald (condensed, bold)
4. Set up thin rules (#c5c0b5) for section separation
5. Add drop cap to first paragraph
6. Include byline and dateline metadata
7. Use printer's red (#8b1a1a) sparingly for emphasis
8. Maintain dense but readable text blocks

## 10. WeChat Compatibility Notes

### Font Recommendations
```css
/* Newspaper fonts with fallbacks */
font-family: 'Georgia', 'Times New Roman', 'Times', serif;
font-family: 'Playfair Display', 'Georgia', serif;
font-family: 'Oswald', 'Impact', 'Arial Narrow', sans-serif;
```

### Inline Styles
All styles must be inlined for WeChat.

### Column Layouts
Multi-column layouts may not work well in WeChat:
- Use single column for mobile/WeChat
- CSS columns property may not be supported
- Float-based layouts are safer

### Tested Properties
- `font-family`: System fonts reliable
- `text-align: justify`: Supported but may cause gaps
- `border`: Fully supported
- `background-color`: Solid colors work well

### Special Considerations
- Cream/sepia tones may appear differently
- Dense text may be harder to read on small screens
- Consider increasing line-height slightly for mobile
- Drop caps may need special handling in inline styles
