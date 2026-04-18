# Design System Inspired by Financial Dark Mode

## 1. Visual Theme & Atmosphere

This design system is crafted for mobile-first financial and investment content, featuring a dark mode aesthetic with cyan accent colors. The design prioritizes readability on small screens while conveying professionalism and trust — essential qualities for financial content.

The visual foundation is a deep gray gradient background (`linear-gradient(180deg, #121212 0%, #1a1a1a 100%)`) with content constrained to 640px max-width, optimized for mobile reading in WeChat and similar platforms. The color system uses `#00d4ff` (cyan) as the singular accent color, applied consistently across headings, labels, borders, and interactive elements. This creates a cohesive "tech-finance" visual identity where the accent color serves as both brand element and functional highlight.

Typography uses Noto Sans SC with system fallbacks, optimized for Chinese content with a 1.7 line-height for comfortable reading. The font sizes follow a clear hierarchy: 28px for hero titles, 22px for section headings, and 16px for body text. All text uses the `#e0e0e0` light gray tone, with `#ffffff` white reserved for emphasis headings only.

**Key Characteristics:**
- Dark mode gradient background with 640px max-width container — mobile-first reading experience
- Single accent color (`#00d4ff`) — cyan/tech-blue for all highlights and borders
- Multi-layer card system — distinct background colors create depth without shadows
- Data-driven layout — table-based grid for financial metrics display
- Inline CSS architecture — all styles inlined for WeChat compatibility
- Rounded corners throughout (10px-20px) — modern, approachable feel
- Dashed borders for visual separation — softer than solid lines
- Meta tag badges — pill-shaped labels for date, source, disclaimers

## 2. Color Palette & Roles

### Backgrounds
- **Page Background**: `linear-gradient(180deg, #121212 0%, #1a1a1a 100%)` — deep gray gradient
- **Section Background**: Same as page for visual continuity
- **Card Primary**: `#1f1f1f` — company cards, content containers
- **Card Secondary**: `#222222` — criteria boxes, summary sections
- **Data Item**: `#2a2a2a` — metric cells, nested elements
- **Disclaimer**: `#1a1a1a` — footer and legal text areas

### Text Colors
- **Primary Text**: `#e0e0e0` — body text, readable on dark backgrounds
- **Heading Text**: `#ffffff` — titles and emphasized headings
- **Accent Text**: `#00d4ff` — labels, numbers, highlights
- **Secondary Text**: `#aaaaaa` — subtitles, captions
- **Muted Text**: `#888` — meta information, timestamps
- **Footer Text**: `#666` — copyright, disclaimers

### Accent Colors
- **Cyan Primary**: `#00d4ff` — borders, labels, highlights
- **Cyan Surface**: `rgba(0, 212, 255, 0.15)` — badge backgrounds
- **Cyan Highlight**: `rgba(0, 212, 255, 0.1)` — blockquote background

### Borders & Dividers
- **Accent Border**: `#00d4ff` — left borders on headings
- **Card Border**: `#333` — container outlines
- **Dashed Divider**: `#444` — list item separators
- **Footer Divider**: `#444` dashed — section separation

## 3. Typography Rules

### Font Families
- **Primary**: `'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Monospace**: `monospace` — stock codes in badges

### Hierarchy

| Role | Font | Size | Weight | Line Height | Color | Notes |
|------|------|------|--------|-------------|-------|-------|
| Hero Title | Noto Sans SC | 28px | 700 | 1.3 | `#ffffff` | Main article title |
| Section Heading | Noto Sans SC | 22px | 600 | 1.3 | `#ffffff` | With left accent border |
| Card Title | Noto Sans SC | 21px | 600 | 1.3 | `#ffffff` | Company names |
| Body Text | Noto Sans SC | 16px | 400 | 1.7 | `#e0e0e0` | Standard reading text |
| Subtitle | Noto Sans SC | 15px | 500 | 1.7 | `#aaaaaa` | Article subtitle |
| Label Text | Noto Sans SC | 13px | 500 | 1.5 | `#00d4ff` | Data labels, badges |
| Data Value | Noto Sans SC | 14px | 400 | 1.5 | `#e0e0e0` | Metric values |
| Meta Text | Noto Sans SC | 13px | 400 | 1.5 | `#888` | Timestamps, sources |
| Caption | Noto Sans SC | 11px | 700 | - | `rgba(0, 212, 255, 0.15)` | Watermarks |

### Principles
- **Chinese-optimized**: Noto Sans SC as primary font ensures excellent rendering for Chinese characters
- **Generous line-height**: 1.7 for body text creates comfortable reading in dark mode
- **Weight contrast**: 700 for titles, 600 for headings, 400 for body — clear visual hierarchy
- **Limited size scale**: 28px/22px/21px/16px/14px/13px — focused, not scattered

## 4. Component Stylings

### Cards

**Company Card**
- Background: `#1f1f1f`
- Border: `1px solid #333`
- Radius: `16px`
- Padding: `24px`
- Margin-bottom: `24px`
- Shadow: none — depth through background color contrast

**Criteria Box**
- Background: `#222222`
- Border: none
- Radius: `16px`
- Padding: `22px`
- Shadow: `0 8px 25px rgba(0, 0, 0, 0.3)`
- Use: Highlighted content blocks, selection criteria

**Summary Section**
- Background: `linear-gradient(90deg, #222222, #2a2a2a)`
- Radius: `20px`
- Padding: `28px`
- Text-align: center
- Use: Conclusion, key takeaways

### Data Grid

**Metric Cell**
- Background: `#2a2a2a`
- Radius: `10px`
- Padding: `12px 14px`
- Display: 2-column grid via table
- Border-spacing: `0 14px`
- Label: 13px, `#00d4ff`, block display
- Value: 14px, `#e0e0e0`

**Grid Structure**
```
| TTM PE    | PB        |
| ROE       | 负债率    |
| 营收增速   | 净利润增速 |
```

### Badges & Tags

**Meta Badge**
- Background: `rgba(0, 212, 255, 0.15)`
- Text: `#00d4ff`
- Padding: `2px 10px`
- Radius: `20px` (pill shape)
- Font-size: `13px`
- Font-weight: `500`
- Use: Dates, sources, disclaimers

**Stock Code Badge**
- Background: `#333`
- Text: `#00d4ff`
- Padding: `4px 12px`
- Radius: `9999px` (full pill)
- Font: `13px monospace`
- Use: Stock ticker display

### Headings

**Section Heading Style**
- Font-size: `22px`
- Font-weight: `600`
- Color: `#ffffff`
- Padding-left: `12px`
- Border-left: `5px solid #00d4ff`
- Margin-bottom: `18px`

### Blockquotes & Highlights

**Highlight Block**
- Background: `rgba(0, 212, 255, 0.1)`
- Border-left: `4px solid #00d4ff`
- Padding: `14px 18px`
- Margin: `22px 0`
- Radius: `0 8px 8px 0`
- Font-style: italic

### Lists

**Criteria List**
- List-style: none
- Item padding: `14px 0`
- Item border-bottom: `1px dashed #444`
- Display: flex with gap
- Number style: `#00d4ff` colored, `min-width: 24px`

### Footer

**Disclaimer Block**
- Background: `#1a1a1a`
- Border: `1px solid #444`
- Radius: `12px`
- Padding: `20px`
- Font-size: `13px`
- Color: `#aaaaaa`
- Line-height: `1.5`

**Watermark**
- Position: fixed, bottom-right
- Font-size: `11px`
- Color: `rgba(0, 212, 255, 0.15)`
- Transform: `rotate(-8deg)`
- Font-weight: `700`
- Letter-spacing: `2px`
- z-index: `-1`
- pointer-events: `none`

## 5. Layout Principles

### Container
- Max-width: `640px` — mobile-optimized
- Margin: `0 auto` — centered
- Padding: `20px 15px 40px` — comfortable touch margins

### Spacing Scale
| Name | Value | Use |
|------|-------|-----|
| xs | 2px | Badge vertical padding |
| sm | 4px | Badge horizontal padding, cell padding |
| md | 10-12px | Cell radius, heading padding |
| lg | 14-18px | Card padding, margin between elements |
| xl | 20-24px | Card padding, section margins |
| xxl | 35-42px | Section margin-bottom |

### Section Spacing
- Section margin-bottom: `42px` — clear content separation
- Card margin-bottom: `24px` — card stacking rhythm
- Paragraph margin-bottom: `18px` — text block separation

### Border Radius Scale
| Name | Value | Use |
|------|-------|-----|
| Small | 8px | Blockquote corners |
| Medium | 10px | Data cells |
| Large | 12px | Disclaimer, disclaimer blocks |
| XL | 16px | Cards, criteria boxes |
| 2XL | 20px | Summary section, meta badges |
| Full | 9999px | Stock code badges |

## 6. Depth & Elevation

| Level | Background | Use | Border |
|-------|------------|-----|--------|
| Page | `#121212` → `#1a1a1a` gradient | Base layer | none |
| Card | `#1f1f1f` | Content containers | `1px solid #333` |
| Box | `#222222` | Highlighted sections | none |
| Cell | `#2a2a2a` | Data metrics | none |
| Badge | `rgba(0, 212, 255, 0.15)` | Tags, labels | none |

**Shadow Philosophy**: Minimal use of shadows. The only shadow is `0 8px 25px rgba(0, 0, 0, 0.3)` on criteria boxes for subtle elevation. Depth is achieved through background color layering rather than shadows or borders.

**Border Philosophy**: Solid borders for container outlines (`#333`), dashed borders for internal dividers (`#444`). The accent border (`#00d4ff`, 4-5px solid) is reserved exclusively for heading emphasis.

## 7. Do's and Don'ts

### Do
- Use the single accent color (`#00d4ff`) consistently across all highlights
- Apply the 5px left border accent on section headings
- Use dashed borders for list item separators
- Center-align hero section with meta badges
- Use pill-shaped badges for metadata (dates, sources)
- Create data grids using table layout with 50% width cells
- Apply 16px border radius to cards for approachable feel
- Use `rgba(0, 212, 255, 0.15)` for badge backgrounds
- Include disclaimer section at the end

### Don't
- Don't use multiple accent colors — stick to `#00d4ff` cyan
- Don't add drop shadows on cards — use background color contrast instead
- Don't use solid borders for list separators — dashed is softer
- Don't exceed 640px max-width — mobile-first design
- Don't forget the `box-shadow: 0 0 30px rgba(0, 212, 255, 0.1)` on the body for subtle glow
- Don't use pure white (`#ffffff`) for body text — use `#e0e0e0`
- Don't skip the hero meta badges (date, source, disclaimer)
- Don't use rounded corners on blockquote left side — `0 8px 8px 0`

## 8. Responsive Behavior

### Mobile-First Design
The design is built for 640px max-width, meaning it's already optimized for mobile screens. No additional breakpoints are needed for the primary use case (WeChat articles).

### Viewport Settings
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### Touch Considerations
- Card padding: `24px` — adequate touch target spacing
- Data cells: `12px 14px` padding — tappable areas
- Badge padding: `2px 10px` minimum — readable touch targets
- Line-height: `1.7` — comfortable text selection

### Content Adaptation
- 2-column data grid remains stable at all sizes
- Text reflows naturally within 640px constraint
- Cards stack vertically without layout shifts

## 9. Agent Prompt Guide

### Quick Color Reference
- Background: `linear-gradient(180deg, #121212 0%, #1a1a1a 100%)`
- Card background: `#1f1f1f`
- Cell background: `#2a2a2a`
- Accent: `#00d4ff`
- Accent surface: `rgba(0, 212, 255, 0.15)`
- Text primary: `#e0e0e0`
- Text heading: `#ffffff`
- Text secondary: `#aaaaaa`
- Border: `#333`

### Example Component Prompts
- "Create a company card: background #1f1f1f, 16px radius, 24px padding, 1px solid #333 border. Header with company name (21px weight 600 white) and stock code badge (#333 background, #00d4ff text, monospace, pill shape). Data grid using table with 2 columns, cells with #2a2a2a background, 10px radius, label in #00d4ff 13px, value in #e0e0e0 14px."

- "Design a section heading: 22px font, weight 600, #ffffff color, 12px left padding, 5px solid #00d4ff left border, 18px bottom margin."

- "Build a meta badge row: flex container centered, 15px gap. Each badge: rgba(0, 212, 255, 0.15) background, #00d4ff text, 2px 10px padding, 20px radius, 13px weight 500."

- "Create a highlight blockquote: rgba(0, 212, 255, 0.1) background, 4px solid #00d4ff left border, 14px 18px padding, 0 8px 8px 0 radius, italic font."

- "Design a criteria list: no list-style, each item 14px vertical padding, 1px dashed #444 bottom border (except last), flex layout with gap. Numbers in #00d4ff with min-width 24px."

### Iteration Guide
1. Start with dark gradient background + 640px container
2. Add hero section with centered title and meta badges
3. Create section headings with cyan left border accent
4. Build company cards with data grids
5. Apply consistent card backgrounds (`#1f1f1f`) and cell backgrounds (`#2a2a2a`)
6. Use `#00d4ff` as the only accent color
7. Add disclaimer section at the end
8. Include watermark (optional)

## 10. WeChat Compatibility Notes

### Inline CSS Requirement
All styles must be inlined (no `<style>` tags or external CSS). WeChat filters out `<style>` blocks.

### Safe Properties
- All standard CSS properties are supported
- `display: flex` works reliably
- `border-radius` supported
- `linear-gradient` backgrounds supported
- `box-shadow` supported

### Font Loading
- System fonts preferred for reliability
- Custom fonts (Noto Sans SC) may not render if not installed
- Fallback to system fonts ensures readability

### Image Handling
- Base64 embedded images recommended for reliability
- External images may be blocked or cached
- No background-image for critical content

### Interactive Elements
- No JavaScript execution
- Hover states ineffective
- Design for static presentation only
