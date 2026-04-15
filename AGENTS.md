# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

## Project Overview

**DeepTalk** - Markdown to HTML converter and LLM-powered article generator for WeChat public accounts.

Features:
1. Convert Markdown to styled HTML with multiple themes
2. Render for WeChat public account (inline CSS)
3. Preview Markdown/HTML in browser
4. Generate articles using LLM (OpenAI/DeepSeek)
5. Publish to WeChat draft box via API

Works with CLI tools like qoder, opencode, claude, codex, gemini.

## Commands

```bash
# Install dependencies
npm install

# Build TypeScript to dist/
npm run build

# Lint
npm run lint

# === Markdown to HTML ===

# Convert Markdown to HTML
npm run md2html -- -i input.md -o ./contents

# Preview Markdown
npm run preview-md -- -i input.md

# Preview HTML directory
npm run preview-html -- -i ./contents

# === WeChat Public Account ===

# Convert to WeChat format (inline CSS)
npm run wechat -- -i article.md --copy

# Publish to WeChat draft box
npm run publish -- -i article.md --title "标题"

# List drafts
npm run drafts

# === Web Interface ===

# Start web UI
npm run web

# === LLM Generation ===

# Generate article (requires API key)
npm run generate -- -t "topic" -c [tech|ai|invest]
```

## Configuration

Required environment variables (set in `.env`):

```env
# LLM API (for article generation)
OPENAI_API_KEY=your-api-key
# or
DEEPSEEK_API_KEY=your-key

# WeChat Public Account (for publishing)
WECHAT_APP_ID=wx...
WECHAT_APP_SECRET=...
```

## Architecture

```
src/
├── index.ts           # CLI entry (Commander.js)
├── skills/
│   ├── htmlGenerator.ts    # Standard HTML renderer
│   ├── wechatRenderer.ts   # WeChat renderer (inline CSS)
│   └── types.ts            # Type definitions
├── wechat/
│   └── api.ts              # WeChat API client
├── generators/        # LLM article generation
├── prompts/           # Category-specific prompts
├── templates/         # Article structure templates
├── web/               # Express web server
├── config/            # API configuration
└── utils/             # File utilities

.qoder/skills/
├── wechat-article/    # WeChat article skill
│   └── SKILL.md
└── design-system/     # Design system
    └── DESIGN.md

contents/              # Default content storage
output/                # LLM output directory
markdowns/             # Markdown source files (editable via /editor)
```

## Key Modules

### web/server.ts

Express web server providing:
- `/` - Article management dashboard
- `/editor` - Markdown editor with file management
- `/api/files` - List and retrieve HTML/Markdown files from contents/
- `/api/markdowns` - CRUD operations for markdowns/ directory
- `/api/render` - Convert Markdown to HTML preview

**Markdown Editor Features:**
- Sidebar file browser showing all markdown files
- Create new files
- Save files to `markdowns/` directory (Ctrl+S)
- Load and edit existing files
- Delete files
- Real-time HTML preview with theme switching
- Download as HTML

### wechatRenderer.ts

Renders Markdown to WeChat-compatible HTML:
- Inline CSS styles (WeChat filters `<style>` tags)
- Three themes: tech, business, minimal
- `renderForWeChat()` - full HTML document
- `renderForWeChatCopy()` - fragment for direct paste

### wechat/api.ts

WeChat Public Account API client:
- `getAccessToken()` - obtain access token
- `uploadImage()` - upload image to WeChat
- `createDraft()` - create draft article
- `publishDraft()` - publish draft
- `getDraftList()` - list drafts

### htmlGenerator.ts

Standard HTML renderer with three themes.

## WeChat API Notes

1. IP whitelist required in WeChat backend
2. Subscription account: 1 broadcast/day
3. Service account: 4 broadcasts/month
4. Draft box: unlimited

API documentation: https://developers.weixin.qq.com/doc/offiaccount/

## Skills

### wechat-article Skill

Located at `.qoder/skills/wechat-article/SKILL.md`

Defines:
- Input parameters (content, title, theme)
- Output format (inline CSS HTML)
- Styling rules (fonts, colors, spacing)

### design-system

Located at `.qoder/skills/design-system/DESIGN.md`

Defines:
- Color palette
- Typography scale
- Spacing system
- Component styles
