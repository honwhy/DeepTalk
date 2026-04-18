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

# Fetch WeChat article (save as Markdown)
npm run fetch-wechat -- -u "https://mp.weixin.qq.com/s/xxx"

# === Web Interface ===

# Start web UI
npm run web

# === LLM Generation ===

# Generate article (requires API key)
npm run generate -- -t "topic" -c [tech|ai|invest]

# Generate article and save to contents directory
npm run generate -- -t "topic" -c tech --contents
```

## Configuration

Required environment variables (set in `.env`):

```env
# LLM API (for article generation)
OPENAI_API_KEY=your-api-key
# or
DEEPSEEK_API_KEY=your-key
# Optional: custom base URL (defaults to https://api.openai.com/v1)
OPENAI_BASE_URL=https://api.openai.com/v1
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1

# WeChat Public Account (for publishing)
WECHAT_APP_ID=wx...
WECHAT_APP_SECRET=...

# Unsplash (optional, for auto image search in articles)
UNSPLASH_ACCESS_KEY=...
```

## Architecture

```
src/
├── index.ts               # CLI entry (Commander.js)
├── types.ts                # Top-level type definitions (Category, ArticleConfig, Article)
├── skills/
│   ├── index.ts            # Barrel export
│   ├── htmlGenerator.ts    # Standard HTML renderer
│   ├── wechatRenderer.ts   # WeChat renderer (inline CSS)
│   └── types.ts            # Theme & render type definitions
├── wechat/
│   ├── index.ts            # Barrel export
│   └── api.ts              # WeChat API client
├── generators/
│   └── index.ts            # LLM article generation (OpenAI)
├── prompts/
│   └── index.ts            # Category-specific system prompts
├── templates/
│   └── index.ts            # Article structure templates & auto-detection
├── web/
│   ├── index.ts            # Barrel export
│   └── server.ts           # Express web server & inline HTML pages
├── config/
│   └── index.ts            # API configuration (dotenv)
└── utils/
    ├── index.ts            # Barrel export, saveArticle(), formatDate()
    └── fetcher.ts          # WeChat article fetcher

.agents/skills/
├── wechat-article/         # WeChat article generation skill
│   ├── SKILL.md            # Skill definition (themes, templates, image handling)
│   ├── HTML-CSS-SPEC.md   # HTML/CSS technical spec for WeChat
│   ├── design-system/
│   │   └── references/    # Per-theme DESIGN.md specs
│   │       ├── tech/
│   │       ├── business/
│   │       ├── claude/
│   │       ├── minimal/
│   │       ├── dark-finance/
│   │       ├── standard/
│   │       ├── neo-brutalist/
│   │       ├── luxury-editorial/
│   │       ├── japanese-zen/
│   │       └── vintage-newspaper/
│   └── templates/          # Example HTML templates
├── wechat-fetcher/         # WeChat article fetcher skill
│   ├── SKILL.md
│   ├── config.json
│   ├── README.md
│   └── examples/
├── wechat-publisher/       # WeChat draft publisher skill
│   └── SKILL.md
└── humanizer-zh/           # AI writing trace remover (Chinese)
    ├── SKILL.md
    └── LICENSE

contents/              # Default content storage
output/                # LLM output directory (article list data source)
markdowns/             # Markdown source files (editable via /editor)
public/                # Static assets (logo.svg etc.)
```

## Key Modules

### types.ts

Top-level type definitions:
- `Category` - `'tech' | 'ai' | 'invest'`
- `TemplateType` - `'tutorial' | 'analysis' | 'news' | 'story' | 'listicle' | 'review' | 'auto'`
- `ThemeType` - `'tech' | 'business' | 'claude' | 'minimal' | 'auto'`
- `ArticleConfig` - LLM generation input config
- `Article` - LLM generation output structure

### skills/types.ts

Renderer-specific type definitions:
- `Theme` - `'tech' | 'minimal' | 'business'`
- `WeChatTheme` - `'tech' | 'business' | 'minimal'`
- `HtmlArticleConfig` - `generateHtml()` input config
- `WeChatRenderOptions` - `renderForWeChat()` options
- `WeChatArticle` - WeChat article structure

### web/server.ts

Express web server providing:
- `GET /` - Article management dashboard (shows files from output/)
- `GET /editor` - Markdown editor with file management
- `GET /api/files` - List HTML/Markdown files from output/
- `GET /api/files/:id` - Retrieve or render a file
- `POST /api/render` - Convert Markdown to HTML preview
- `GET /api/wechat/:id` - Get WeChat-compatible HTML for a file (inline CSS)
- `GET /api/markdowns` - List Markdown files from markdowns/
- `GET /api/markdowns/:id` - Get Markdown file content
- `POST /api/markdowns` - Save Markdown file
- `DELETE /api/markdowns/:id` - Delete Markdown file
- `POST /api/fetch-wechat` - Fetch WeChat article and save as Markdown
- Static: `/static`, `/output` → output/, `/markdowns` → markdowns/, `/public` → public/

**Markdown Editor Features:**
- Sidebar file browser showing all markdown files
- Create new files
- Save files to `markdowns/` directory (Ctrl+S)
- Load and edit existing files
- Delete files
- Real-time HTML preview with theme switching
- Download as HTML
- Fetch WeChat articles directly in editor

### wechatRenderer.ts

Renders Markdown to WeChat-compatible HTML:
- Inline CSS styles (WeChat filters `<style>` tags)
- Three themes: tech, business, minimal
- `renderForWeChat()` - full HTML document
- `renderForWeChatCopy()` - fragment for direct paste
- `getWeChatThemePreview()` - get theme CSS for preview
- `highlightCode()` - basic code highlighting for WeChat

### wechat/api.ts

WeChat Public Account API client (`WeChatAPI` class):
- `getAccessToken()` - obtain and cache access token
- `uploadImage()` - upload image buffer to WeChat
- `uploadImageFile()` - upload local image file
- `uploadImageFromUrl()` - download and upload image from URL
- `createDraft()` - create single-article draft
- `createDraftBatch()` - create multi-article draft
- `publishDraft()` - publish draft
- `getDraftList()` - list drafts
- `deleteDraft()` - delete a draft
- `getPublishStatus()` - check publish status
- `WeChatAPIError` - error class with errcode/errmsg
- `WeChatErrorCodes` - common error code map

### htmlGenerator.ts

Standard HTML renderer with three themes (tech, minimal, business).
Uses highlight.js for code syntax highlighting.

### generators/index.ts

LLM article generation:
- `generateArticle()` - generate article via OpenAI API
- `parseArticle()` - parse LLM output into Article structure

### prompts/index.ts

Category-specific system prompts:
- `getPromptTemplate()` - get prompt for a category
- `buildSystemPrompt()` - build full system prompt

### templates/index.ts

Article structure templates & auto-detection:
- `detectTemplateType()` - auto-detect template from content
- `detectTheme()` - auto-detect theme from content
- `getArticleTemplate()` - build template prompt for LLM
- `getTemplateInfo()` - get template metadata
- `getAvailableTemplates()` - list all template types
- `getAvailableThemes()` - list all theme types

### utils/index.ts

Utility barrel export + helpers:
- `saveArticle()` - save Article to output/ as Markdown
- `ensureOutputDir()` - ensure output/ directory exists
- `formatDate()` - format Date to Chinese locale string

### utils/fetcher.ts

WeChat article fetcher module:
- `fetchWeChatArticle()` - fetch article HTML from WeChat (with retry)
- `extractArticleTitle()` - extract title from HTML
- `extractArticleContent()` - extract content and convert to Markdown
- `extractAuthor()` - extract author info
- `extractPublishDate()` - extract publish date
- `extractCoverImage()` - extract cover image URL

## WeChat API Notes

1. IP whitelist required in WeChat backend
2. Subscription account: 1 broadcast/day
3. Service account: 4 broadcasts/month
4. Draft box: unlimited

API documentation: https://developers.weixin.qq.com/doc/offiaccount/

## Skills

### wechat-article Skill

Located at `.agents/skills/wechat-article/SKILL.md`

AI-driven Markdown-to-WeChat-HTML conversion skill. Defines:
- Input parameters (content, title, theme, template, images)
- Four themes: tech, business, claude, minimal (+ dark-finance, standard, neo-brutalist, luxury-editorial, japanese-zen, vintage-newspaper via design-system)
- Six templates: tutorial, analysis, news, story, listicle, review
- Smart image handling (auto/manual/none) with Unsplash integration
- Output format (inline CSS HTML, written to `output/`)
- Design system references at `wechat-article/design-system/references/`
- HTML/CSS technical spec at `wechat-article/HTML-CSS-SPEC.md`

### wechat-fetcher Skill

Located at `.agents/skills/wechat-fetcher/SKILL.md`

Defines:
- WeChat article fetching workflow
- Content extraction and Markdown conversion
- Error handling and retry logic

### wechat-publisher Skill

Located at `.agents/skills/wechat-publisher/SKILL.md`

Publishes HTML articles to WeChat draft box. Defines:
- Cover image handling (auto/extract/unsplash/generate/url/none)
- Image upload to WeChat media library
- Draft creation with thumb_media_id
- Error handling for WeChat API errors

### humanizer-zh Skill

Located at `.agents/skills/humanizer-zh/SKILL.md`

Removes AI-generated writing traces from Chinese text:
- Detects and fixes AI writing patterns
- Makes text sound more natural and human-written
- Based on Wikipedia's "AI writing characteristics" guide
