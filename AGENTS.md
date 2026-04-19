# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

## Version 2.0 Update (技能拆分)

项目已进行重大架构更新，将 `wechat-article` 技能拆分为两个独立的技能：
1. **markdown-to-html** - 专注于 Markdown 到 HTML 的基础转换
2. **wechat-article** - 专注于微信公众号的样式优化和兼容性处理

**主要变化**：
- 新增 `markdown-to-html` 技能目录和实现
- 重构 `wechat-article` 技能，移除 Markdown 解析逻辑
- 创建技能协作接口 `src/skills/integration.ts`
- 更新 CLI 命令和 Web API 以支持新架构
- 保持向后兼容性（可通过 `--legacy` 参数使用旧版方式）

## 技能概览

当前共有 **6 个技能**：

1. **cloudinary-image-host** - 将本地图片上传到 Cloudinary，获取永久 HTTP 链接
2. **humanizer-zh** - 去除文本中的 AI 生成痕迹，使文本更自然
3. **markdown-to-html** - 将 Markdown 转换为干净的 HTML 结构
4. **wechat-article** - 将 HTML 内容优化为符合微信公众号格式的文章
5. **wechat-fetcher** - 抓取微信公众号文章并转换为 Markdown 格式
6. **wechat-publisher** - 将 HTML 文章发布到微信公众号草稿箱

## WeChat 技能与项目能力集成

### wechat-fetcher 技能
**调用方式**：
- **CLI**: `npm run fetch-wechat -- -u "https://mp.weixin.qq.com/s/xxx"`
- **Web 界面**: 访问 `http://localhost:3000/editor`，点击"抓取公众号文章"按钮
- **代码调用**: 导入 `src/utils/fetcher.ts` 中的 `fetchWeChatArticle()` 函数
- **Web API**: `POST /api/fetch-wechat` 端点

**核心实现**：
- `src/utils/fetcher.ts` - 抓取逻辑和内容提取
- `src/index.ts:450` - CLI 命令定义
- `src/web/server.ts:306` - Web API 端点

### wechat-article 技能
**调用方式**：
- **CLI**: `npm run wechat -- -i article.md --copy`（新版技能协作流程）
- **CLI（旧版）**: `npm run wechat -- -i article.md --copy --legacy`
- **代码调用**: 导入 `src/skills/integration.ts` 中的 `processMarkdownToWeChat()` 函数
- **Web 界面**: 在编辑器中选择"转换为公众号格式"

**核心实现**：
- `src/skills/integration.ts` - 技能协作接口
- `src/skills/wechatRenderer.ts` - 公众号渲染器（已重构）
- `src/index.ts:231` - CLI 命令定义

### wechat-publisher 技能
**调用方式**：
- **CLI**: `npm run publish -- -i article.md --title "标题"`
- **代码调用**: 导入 `src/wechat/api.ts` 中的 `WeChatAPI` 类
- **Web 界面**: 在文章管理页面点击"发布到公众号"

**核心实现**：
- `src/wechat/api.ts` - 微信 API 客户端
- `src/index.ts:319` - CLI 命令定义

### 技能协作工作流程
```
AI 生成 Markdown → markdown-to-html → 基础 HTML → wechat-article → 微信公众号 HTML → wechat-publisher → 公众号草稿箱
```

**CLI 命令映射**：
- `npm run fetch-wechat` → wechat-fetcher 技能
- `npm run wechat` → markdown-to-html + wechat-article 技能协作
- `npm run publish` → wechat-publisher 技能

**Web 界面集成**：
- 编辑器页面 (`/editor`) 集成了所有 wechat-* 技能功能
- 文章管理页面 (`/`) 提供发布功能
- 通过 REST API 调用底层实现

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
npm run md2html -- -i input.md -o ./output

# Preview Markdown
npm run preview-md -- -i input.md

# Preview HTML directory
npm run preview-html -- -i ./output

# === WeChat 技能相关命令 ===

# wechat-fetcher 技能：抓取微信公众号文章
npm run fetch-wechat -- -u "https://mp.weixin.qq.com/s/xxx"

# wechat-article 技能协作流程：转换为公众号格式
npm run wechat -- -i article.md --copy

# 使用旧版转换方式（不推荐）
npm run wechat -- -i article.md --copy --legacy

# wechat-publisher 技能：发布到公众号草稿箱
npm run publish -- -i article.md --title "标题"

# 查看草稿列表
npm run drafts

# === Web 界面 ===

# 启动 Web 管理界面（集成所有 wechat-* 技能功能）
npm run web

# === LLM 文章生成 ===

# 生成文章（需要 API key）
npm run generate -- -t "topic" -c [tech|ai|invest]

# 生成文章并保存到 contents 目录
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

contents/              # Default content storage (deprecated, please use output/)
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

### 技能架构（v2.0 更新）

项目已进行技能拆分，将原有的 `wechat-article` 技能拆分为两个独立的技能：

#### markdown-to-html 技能
**定位**：通用 Markdown 到 HTML 转换器，专注于内容结构转换
**位置**：`.agents/skills/markdown-to-html/SKILL.md`
**核心功能**：
- 将 Markdown 转换为干净的 HTML 结构
- 应用基础样式确保可读性
- 支持代码高亮（使用 highlight.js）
- 支持多种主题（tech/minimal/business）
- 输出标准 HTML 文档
**不包含**：
- 微信公众号兼容性处理
- CSS 内联化（juice）
- 复杂的设计系统应用
- 智能配图功能

#### wechat-article 技能（更新后）
**定位**：微信公众号文章优化器，专注于样式应用和兼容性
**位置**：`.agents/skills/wechat-article/SKILL.md`
**核心功能**：
- 应用 design-system 设计规范
- 遵循 HTML-CSS-SPEC.md 技术规范
- 智能配图功能
- 微信公众号兼容性转换
- CSS 内联化（juice）
- 布局转换（Grid/Flex → Table）
- 标签清理（div → section）
**输入**：HTML 内容（通常来自 markdown-to-html 技能）

#### 技能协作工作流程
```
AI 生成 Markdown → markdown-to-html → 基础 HTML → wechat-article → 微信公众号 HTML
```

#### 代码实现
- `src/skills/markdownConverter.ts` - Markdown 转换器实现
- `src/skills/wechatRenderer.ts` - 公众号渲染器（已重构）
- `src/skills/integration.ts` - 技能协作接口
- `src/skills/index.ts` - 技能模块导出

#### 使用方式
```typescript
// 完整工作流程
import { processMarkdownToWeChat } from './skills/integration';

const wechatHtml = await processMarkdownToWeChat(markdownContent, {
  title: '文章标题',
  author: '作者名称',
  mdTheme: 'tech',
  wechatTheme: 'tech',
  outputCopyFormat: true, // 生成可直接复制到公众号编辑器的格式
});
```

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
