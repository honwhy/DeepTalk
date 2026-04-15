# DeepTalk 功能扩展 Proposal

## 背景

DeepTalk 当前已实现 Markdown 转 HTML 和预览功能。为进一步提升公众号写作体验，需要扩展以下能力：

1. 提炼公众号文章 HTML 生成 Skill
2. 引入 DESIGN.md 设计系统
3. 优化 Markdown 渲染（学习 doocs/md）
4. 对接微信公众号 API 一键发布

---

## 功能一：公众号文章 HTML Skill

### 目标

从现有 `contents/` 目录中的 HTML 提炼最佳实践，创建专用于公众号文章的 HTML 生成 Skill。

### 分析

**现有资产：**
- `contents/long_put.html` - 投资类文章样本
- `src/skills/htmlGenerator.ts` - 三种主题的 HTML 生成器

**公众号文章特点：**
- 内联 CSS（公众号不支持外部样式表）
- 特定字体和排版规范
- 图片需要上传到微信服务器
- 代码块需要特殊样式
- 引用块、列表等元素样式优化

### 实现方案

```
.qoder/
└── skills/
    └── wechat-article/
        ├── SKILL.md          # Skill 定义文件
        ├── templates/
        │   ├── tech.html     # 技术文章模板
        │   ├── ai.html       # AI 文章模板
        │   └── invest.html   # 投资文章模板
        └── examples/
            └── sample.html   # 示例文章
```

**SKILL.md 核心内容：**
```markdown
# WeChat Article Generator

## Purpose
生成符合微信公众号格式的 HTML 文章。

## Input
- title: 文章标题
- content: Markdown 内容
- category: tech | ai | invest
- style: 排版风格

## Output
符合公众号规范的 HTML，特点：
- 内联 CSS 样式
- 响应式图片
- 代码高亮
- 可直接复制到公众号编辑器

## Styling Rules
- 标题：22px，加粗，#333
- 正文：16px，#333，行高 1.75
- 引用：左边框 + 背景色
- 代码：等宽字体 + 背景色
- 图片：max-width: 100%
```

### 依赖

- 无外部依赖

---

## 功能二：引入 DESIGN.md 设计系统

### 目标

引入 [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) 的设计系统文档，提升 AI 生成内容的一致性和专业性。

### 分析

**awesome-design-md 价值：**
- 收集了 55+ 顶级品牌的设计系统文档
- Google Stitch 团队提出的纯 Markdown 设计规范
- 可作为 AI agent 生成 UI/内容的风格指南

**应用场景：**
- 定义 DeepTalk 的设计语言
- 统一文章排版风格
- 为 AI 生成提供风格约束

### 实现方案

```
.qoder/
└── skills/
    └── design-system/
        ├── DESIGN.md        # DeepTalk 设计系统
        ├── references/
        │   ├── google.md    # 参考设计系统
        │   ├── apple.md
        │   └── ...
        └── README.md        # 使用说明
```

**DESIGN.md 结构：**
```markdown
# DeepTalk Design System

## Colors
- Primary: #667eea
- Secondary: #764ba2
- Text: #333
- Background: #fff

## Typography
- Heading: -apple-system, sans-serif
- Body: 16px, line-height 1.75
- Code: Fira Code, monospace

## Spacing
- Section gap: 2rem
- Paragraph gap: 1rem

## Components
- Card: 12px radius, subtle shadow
- Button: 6px radius, primary color
- Code block: dark theme, 6px radius
```

### 依赖

- 从 VoltAgent/awesome-design-md 同步参考文档

---

## 功能三：优化 Markdown 渲染

### 目标

学习 [doocs/md](https://github.com/doocs/md)（9.2K Star）的渲染方案，提升公众号文章排版质量。

### 分析

**doocs/md 核心能力：**
1. Markdown 实时渲染为微信图文格式
2. 多种排版主题（科技、商务、简约等）
3. 代码高亮（支持多种语言）
4. 数学公式支持（KaTeX）
5. 图片处理（上传、压缩）
6. 一键复制到公众号编辑器

**关键技术点：**
- 内联样式转换（关键！公众号不支持 `<style>` 标签）
- 代码块语法高亮
- 表格、引用等元素样式
- 图片 base64 或微信图床

### 实现方案

**3.1 新增公众号专用渲染器**

```typescript
// src/skills/wechatRenderer.ts

interface WeChatRenderOptions {
  theme: 'tech' | 'business' | 'minimal';
  codeTheme: 'github' | 'monokai' | 'one-dark';
  enableMath: boolean;
  imageHandler: 'base64' | 'wechat' | 'external';
}

export function renderForWeChat(
  markdown: string,
  options: WeChatRenderOptions
): string {
  // 1. 解析 Markdown
  // 2. 转换为内联样式 HTML
  // 3. 处理图片
  // 4. 返回可复制内容
}
```

**3.2 内联样式转换**

```typescript
// 将 class 样式转换为内联 style
function inlineStyles(html: string, css: string): string {
  // 解析 CSS
  // 匹配 class
  // 注入内联样式
}
```

**3.3 新增主题（参考 doocs/md）**

| 主题 | 字体 | 配色 | 适用场景 |
|------|------|------|----------|
| tech | 系统字体 | 深色背景 | 技术教程 |
| business | 宋体 | 简约白底 | 商务报告 |
| vibrant | 圆体 | 渐变配色 | 活泼内容 |

**3.4 Web 编辑器增强**

在 `/editor` 页面新增：
- 「复制到公众号」按钮
- 公众号预览模式
- 排版主题选择

### 依赖

- `juice` - CSS 内联化工具
- `highlight.js` - 代码高亮
- `katex` - 数学公式（可选）

```bash
npm install juice highlight.js katex
```

---

## 功能四：公众号 API 发布

### 目标

对接微信公众号开发者 API，实现一键发布到草稿箱。

### 分析

**微信公众号 API 流程：**

```
1. 获取 access_token
   └── GET https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={APPID}&secret={APPSECRET}

2. 上传图片素材（可选）
   └── POST https://api.weixin.qq.com/cgi-bin/material/add_material?access_token={TOKEN}&type=image

3. 创建草稿
   └── POST https://api.weixin.qq.com/cgi-bin/draft/add?access_token={TOKEN}
   Body: { articles: [{ title, content, ... }] }

4. 发布草稿（可选）
   └── POST https://api.weixin.qq.com/cgi-bin/freepublish/submit?access_token={TOKEN}
```

**前置条件：**
- 公众号 AppID
- 公众号 AppSecret
- IP 白名单配置
- 服务号需要认证（订阅号有部分限制）

### 实现方案

**4.1 环境变量配置**

```env
# .env
WECHAT_APP_ID=wx...
WECHAT_APP_SECRET=...
```

**4.2 模块结构**

```typescript
// src/wechat/api.ts

export class WeChatAPI {
  private appId: string;
  private appSecret: string;
  private accessToken: string | null = null;
  private expiresAt: number = 0;

  async getAccessToken(): Promise<string>;
  async uploadImage(imagePath: string): Promise<string>;
  async createDraft(article: ArticleDraft): Promise<string>;
  async publishDraft(mediaId: string): Promise<string>;
}

interface ArticleDraft {
  title: string;
  content: string; // HTML 格式
  thumbMediaId?: string; // 封面图
  author?: string;
  digest?: string; // 摘要
  contentSourceUrl?: string; // 原文链接
}
```

**4.3 CLI 命令**

```bash
# 发布到草稿箱
npm run publish -- -i article.html
npm run publish -- -i article.md --title "标题"

# 直接发布（需确认）
npm run publish -- -i article.html --publish
```

**4.4 Web 界面**

在文章预览页新增：
- 「发布到公众号」按钮
- 发布状态显示
- 草稿管理列表

### 依赖

```bash
npm install axios
```

### 限制说明

- 订阅号：每天可群发 1 次
- 服务号：每月可群发 4 次
- 草稿箱无限制
- 图片素材总量限制

---

## 技术架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        CLI / Web UI                          │
├─────────────────────────────────────────────────────────────┤
│  Commands: md2html | preview | publish | web                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Skills Layer                            │
├───────────────┬───────────────┬───────────────┬─────────────┤
│ htmlGenerator │wechatRenderer │ design-system │   wechat    │
│   (现有)      │   (新增)      │    (新增)     │   api(新增) │
└───────────────┴───────────────┴───────────────┴─────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      External APIs                           │
├───────────────┬───────────────┬─────────────────────────────┤
│  OpenAI API   │ WeChat API    │   Image Hosting (可选)      │
└───────────────┴───────────────┴─────────────────────────────┘
```

---

## 实施计划

### Phase 1: 公众号渲染器 (优先级高)

- [ ] 研究 doocs/md 源码，提取关键渲染逻辑
- [ ] 实现内联样式转换
- [ ] 新增公众号主题
- [ ] 添加「复制到公众号」功能

### Phase 2: Skill 定义 (优先级中)

- [ ] 创建 `.qoder/skills/` 目录结构
- [ ] 编写 `wechat-article/SKILL.md`
- [ ] 整合现有 HTML 模板
- [ ] 添加示例文件

### Phase 3: 设计系统 (优先级中)

- [ ] 从 awesome-design-md 同步参考文档
- [ ] 编写 DeepTalk DESIGN.md
- [ ] 集成到 AI 生成流程

### Phase 4: 公众号 API (优先级高)

- [ ] 实现 WeChatAPI 类
- [ ] 添加环境变量配置
- [ ] 实现 publish 命令
- [ ] Web 界面集成

---

## 风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 公众号 API 限制 | 功能受限 | 文档说明限制条件 |
| 样式兼容性 | 排版问题 | 参考成熟方案 |
| Token 过期 | 发布失败 | 自动刷新机制 |
| 图片上传 | 依赖微信服务 | 支持多种图片处理方式 |

---

## 预期成果

1. **高质量公众号排版** - 一键生成专业排版文章
2. **AI 友好的 Skill 系统** - 支持 AI agent 自动生成
3. **设计一致性** - DESIGN.md 约束风格
4. **完整发布流程** - 从生成到发布的闭环

---

## 附录

### 参考资源

- [doocs/md](https://github.com/doocs/md) - 微信公众号 Markdown 编辑器
- [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) - DESIGN.md 合集
- [微信公众号开发文档](https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html)
- [公众号草稿箱 API](https://developers.weixin.qq.com/doc/offiaccount/Draft_Management/New_draft.html)

### 环境变量模板更新

```env
# .env.example

# === LLM 配置 ===
OPENAI_API_KEY=your-api-key
OPENAI_BASE_URL=https://api.openai.com/v1

# === 微信公众号配置 ===
WECHAT_APP_ID=wx...
WECHAT_APP_SECRET=...
```
