# DeepTalk Agentic AI 能力增强提案（已实现）

> 已实现 /editor 页面的 AI 助手入口

## 核心思路

**不使用 src/skills/** 下的任何脚本**，而是：
1. 直接使用 LLM 生成 HTML（基于 wechat-article SKILL.md 的设计系统）
2. 使用 LLM 排版 Markdown
3. 将 wechat-article SKILL.md 的设计规范作为 LLM Prompt 的一部分

## 现有 Skill 资产（必须使用）

`.agents/skills/` 目录下的 Skills 定义了 AI 的工作方式：

| Skill | 用途 |
|-------|------|
| `wechat-article/SKILL.md` | **核心**：HTML 渲染主题、设计系统、模板定义 |
| `wechat-article/HTML-CSS-SPEC.md` | 内联 CSS 技术规范 |
| `wechat-article/design-system/references/*` | 各主题的 DESIGN.md 规范 |
| `wechat-publisher` | 公众号发布 |
| `wechat-fetcher` | 文章抓取 |
| `humanizer-zh` | AI 写作痕迹去除 |
| `cloudinary-image-host` | 图片托管 |

---

## OpenAI Agent SDK 集成

### 1. 依赖安装

```bash
npm install openai agents
# agents SDK 提供内置的 Agent、Tool、Run 等抽象
```

### 1. 核心原理：LLM 直接生成 HTML

**不使用 src/skills/** 下的任何脚本。LLM 根据 wechat-article/SKILL.md 的规范直接生成 HTML：

```typescript
// 伪代码：LLM 生成 HTML 的 Prompt 结构
const generateHtmlPrompt = `
你是一个专业的公众号文章排版专家。

## 设计系统（必须严格遵循）

参考文件：.agents/skills/wechat-article/design-system/references/{theme}/DESIGN.md
技术规范：.agents/skills/wechat-article/HTML-CSS-SPEC.md

## 输入

content: """
{markdownContent}
"""

## 任务

1. 将 Markdown 转换为微信公众号兼容的 HTML
2. 使用 {theme} 主题的设计规范
3. 所有 CSS 必须是内联样式（style="..."）
4. 代码使用 <pre><code> 标签
5. 图片使用 <img> 标签

## 输出格式

直接输出完整的 HTML 字符串，不需要代码块包裹。
`;
```

### 2. 工具定义（LLM 生成）

```typescript
// src/agents/tools/render.ts
import OpenAI from 'openai';
import { readFile } from 'fs/promises';
import { getConfig } from '../../config';

const themes = ['tech', 'business', 'claude', 'minimal', 'dark-finance', 'standard', 'neo-brutalist', 'luxury-editorial', 'japanese-zen', 'vintage-newspaper'];

const renderTool = Tool({
  name: 'render_html',
  description: `
将 Markdown 转换为微信公众号 HTML。LLM 根据 wechat-article SKILL.md 的设计系统直接生成。
主题：${themes.join('/')}，或 auto 自动选择。

使用此工具时：
1. 构建 Prompt 包含 wechat-article/SKILL.md 的设计规范
2. 调用 OpenAI 生成 HTML
3. 返回内联 CSS 的 HTML 字符串
  `,
  parameters: {
    type: 'object',
    properties: {
      content: { type: 'string', description: 'Markdown 内容' },
      theme: { type: 'string', description: `主题：${themes.join('|')}，默认 auto` },
      title: { type: 'string', description: '文章标题' }
    },
    required: ['content']
  },
  execute: async ({ content, theme = 'auto', title }) => {
    const { apiKey, baseURL } = getConfig();
    const openai = new OpenAI({ apiKey, baseURL });

    // 1. 加载设计规范（根据 theme）
    const designDoc = await loadDesignSystem(theme);  // 读取 DESIGN.md
    const cssSpec = await readFile('./.agents/skills/wechat-article/HTML-CSS-SPEC.md', 'utf-8');

    // 2. 构建 Prompt
    const systemPrompt = await buildRenderPrompt({
      designDoc,  // 来自 DESIGN.md
      cssSpec,    // 来自 HTML-CSS-SPEC.md
      theme,
      title
    });

    // 3. LLM 直接生成 HTML（不使用 src/skills/** 脚本）
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `请将以下 Markdown 转换为公众号 HTML：\n\n${content}` }
      ],
      temperature: 0.3,
    });

    return response.choices[0].message.content;
  }
});

async function loadDesignSystem(theme: string) {
  const themePath = theme === 'auto' 
    ? './.agents/skills/wechat-article/design-system/references/tech/DESIGN.md'
    : `./.agents/skills/wechat-article/design-system/references/${theme}/DESIGN.md`;
  return readFile(themePath, 'utf-8');
}

async function buildRenderPrompt({ designDoc, cssSpec, theme, title }) {
  return `
你是一个专业的公众号文章排版专家。

## 设计系统规范（必须严格遵循）

${designDoc}

## 技术规范（微信公众号兼容）

${cssSpec}

## 任务

将输入的 Markdown 转换为微信公众号兼容的 HTML：
1. 所有 CSS 必须是内联样式（style="属���:值"）
2. 不使用 <style> 标签
3. 代码使用 <pre><code> 标签包裹，style="background:#f5f5f5;padding:12px;border-radius:4px;font-family:monospace;"
4. 标题使用 <h2> 或 <h3>，加粗
5. 段落使用 <p>，行高 1.6
6. 图片使用 <img>，最大宽度 100%

## 主题

${theme === 'auto' ? '根据内容自动选择主题' : `使用 ${theme} 主题`}
`;
}
```

### 3. 排版 Markdown 的工具

```typescript
// src/agents/tools/format.ts
const formatMarkdownTool = Tool({
  name: 'format_markdown',
  description: '优化 Markdown 格式，使用 wechat-article 模板结构',
  parameters: {
    type: 'object',
    properties: {
      content: { type: 'string' },
      template: { type: 'string', description: 'tutorial|analysis|news|story|listicle|review|auto' }
    },
    required: ['content']
  },
  execute: async ({ content, template = 'auto' }) => {
    // 加载 wechat-article SKILL.md 中的模板定义
    const templateDoc = await loadTemplate(template);  // 来自 SKILL.md
    const openai = new OpenAI({ apiKey, baseURL });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: `你是一个公众号文章结构专家。\n\n${templateDoc}` },
        { role: 'user', content: `请优化以下文章结构：\n\n${content}` }
      ]
    });

    return response.choices[0].message.content;
  }
});
```

### 4. 发布工具（复用 wechat-publisher Skill）

```typescript
// src/agents/tools/publish.ts
const publishTool = Tool({
  name: 'wechat_publish',
  description: '发布 HTML 到微信公众号草稿箱（需要 WECHAT_APP_ID/WECHAT_APP_SECRET）',
  parameters: {
    type: 'object',
    properties: {
      html: { type: 'string' },
      title: { type: 'string' },
      coverImage: { type: 'string', description: '封面图 URL，可选' }
    },
    required: ['html', 'title']
  },
  execute: async ({ html, title, coverImage }) => {
    // 复用 .agents/skills/wechat-publisher/SKILL.md 的流程
    // 1. 上传封面图（如有）
    // 2. 调用 WeChat API createDraft
    // 3. 返回草稿 ID
  }
});
```

### 5. 抓取工具（复用 wechat-fetcher Skill）

```typescript
// src/agents/tools/fetch.ts
const fetchTool = Tool({
  name: 'wechat_fetch',
  description: '抓取微信公众号文章 URL 并转换为 Markdown',
  parameters: {
    type: 'object',
    properties: {
      url: { type: 'string', description: '微信公众号文章 URL (mp.weixin.qq.com)' }
    },
    required: ['url']
  },
  execute: async ({ url }) => {
    // 复用 .agents/skills/wechat-fetcher/SKILL.md 的抓取逻辑
    // 使用 fetcher.ts 模块直接抓取
  }
});
```

### 6. 人类化工具（复用 humanizer-zh）

```typescript
// src/agents/tools/humanize.ts
const humanizeTool = Tool({
  name: 'humanize_text',
  description: '去除 AI 写作痕迹，使文章更自然（基于 humanizer-zh SKILL.md）',
  parameters: {
    type: 'object',
    properties: {
      content: { type: 'string' }
    },
    required: ['content']
  },
  execute: async ({ content }) => {
    // 加载 humanizer-zh SKILL.md 的规则
    const rules = await readFile('./.agents/skills/humanizer-zh/SKILL.md', 'utf-8');

    const openai = new OpenAI({ apiKey, baseURL });
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: rules },
        { role: 'user', content: `请修改以下文章，去除 AI 写作痕迹：\n\n${content}` }
      ]
    });

    return response.choices[0].message.content;
  }
});
```

### 7. 图片上传（复用 cloudinary-image-host）

```typescript
// src/agents/tools/image.ts
const imageUploadTool = Tool({
  name: 'upload_image',
  description: '上传图片��� Cloudinary 获取永久 HTTP URL',
  parameters: {
    type: 'object',
    properties: {
      filepath: { type: 'string', description: '本地图片路径' },
      url: { type: 'string', description: '或远程图片 URL' }
    },
    required: []
  },
  execute: async ({ filepath, url }) => {
    // 复用 .agents/skills/cloudinary-image-host 的上传逻辑
  }
});
```

### 8. 文件读写（基础工具）

```typescript
// src/agents/tools/file.ts
const fileReadTool = Tool({
  name: 'file_read',
  description: '读取文件内容（支持 output/, markdowns/, contents/ 目录）',
  parameters: {
    type: 'object',
    properties: {
      filepath: { type: 'string' }
    },
    required: ['filepath']
  },
  execute: async ({ filepath }) => {
    const content = await readFile(filepath, 'utf-8');
    return { content, filepath };
  }
});

const fileWriteTool = Tool({
  name: 'file_write',
  description: '保存内容到文件',
  parameters: {
    type: 'object',
    properties: {
      filepath: { type: 'string' },
      content: { type: 'string' }
    },
    required: ['filepath', 'content']
  },
  execute: async ({ filepath, content }) => {
    await writeFile(filepath, content);
    return { success: true, filepath };
  }
});
```

### 9. Agent 配置（基于 SKILL.md 的 Prompt）

```typescript
// src/agents/index.ts
import { Agent } from 'openai/agents';
import { readFile } from 'fs/promises';
import {
  renderTool,
  formatMarkdownTool,
  publishTool,
  fetchTool,
  humanizeTool,
  imageUploadTool,
  fileReadTool,
  fileWriteTool
} from './tools';

const articleAgent = new Agent({
  name: 'article-writer',
  description: `
专业的公众号文章创作 Agent。

核心能力（基于 .agents/skills/ 下的 SKILL.md）：
- wechat-article: 直接使用 LLM 生成 HTML（不使用 src/skills/** 脚本）
- wechat-publisher: 发布到公众号
- wechat-fetcher: 抓取文章
- humanizer-zh: 去除 AI 写作痕迹
- cloudinary-image-host: 图片托管
  `,
  tools: [
    // 基础文件
    fileReadTool,
    fileWriteTool,
    // 核心能力
    renderTool,          // LLM 直接生成 HTML
    formatMarkdownTool, // LLM 排版 Markdown
    publishTool,         // 公众号发布
    fetchTool,           // 抓取文章
    humanizeTool,         // 人类化
    imageUploadTool,      // 图片上传
  ],
  instructions: `
你是一个专业的公众号文章创作 Agent。

## 核心工作流

**不要使用 src/skills/** 下的任何脚本。使用以下方式：

1. **渲染 HTML**：调用 render_tool，LLM 会根据 wechat-article/SKILL.md 的设计系统直接生成
2. **排版 Markdown**：调用 format_markdown_tool，LLM 使用模板结构优化
3. **发布文章**：调用 wechat_publish_tool
4. **抓取文章**：调用 wechat_fetch_tool
5. **人类化**：调用 humanize_text_tool（基于 humanizer-zh SKILL.md）

## 主题选择（与 wechat-article SKILL.md 一致）

当用户未指定主题时，根据内容自动选择：
- tech: 技术/编程/教程
- business: 商业/金融/管理
- claude: AI/Claude 相关
- minimal: 简约风格
- dark-finance, standard, neo-brutalist, luxury-editorial, japanese-zen, vintage-newspaper

## 注意事项

- 直接返回 HTML 给用户，不需要额外处理
- 代码块使用 <pre><code> 包裹
- 确保所有 CSS 是内联样式
`
});

export async function runAgent(prompt: string, context?: Record<string, unknown>) {
  const run = await articleAgent.createRun({
    model: 'gpt-4o',
    instructions: prompt,
    context,
  });

  return await run.waitForCompletion();
}
```

## 配置读取（环境变量）

参考 `.env.example`，所有 LLM 相关配置通过环境变量读取：

```bash
# .env 文件配置
OPENAI_API_KEY=your-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1

# 或使用 DeepSeek
DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
```

代码中使用 `src/config/index.ts` 的 `getConfig()` 读取：

```typescript
import { getConfig } from '../config';

// 在工具中读取配置
const { apiKey, baseURL } = getConfig();
const openai = new OpenAI({ apiKey, baseURL });
```

### 10. Web Server 集成

```typescript
// src/web/server.ts 新增接口

import { runAgent } from '../agents';

app.post('/api/agent/chat', async (req: Request, res: Response) => {
  const { message, context } = req.body;

  // 流式返回 Agent 事件
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const events = await runAgent(message, context);
  for await (const event of events) {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  }
  res.end();
});

// 任务状态
app.get('/api/agent/tasks', (req, res) => {
  res.json({ tasks: taskQueue });
});

// 取消任务
app.post('/api/agent/cancel', (req, res) => {
  const { taskId } = req.body;
  cancelTask(taskId);
  res.json({ success: true });
});
```

## 与 /editor 页面的融合

### 当前 /editor 页面功能

现有的 `/editor` 路由提供：
- 文件侧边栏管理（markdowns/ 目录）
- 手动 Markdown 编辑
- 手动渲染预览（调用 `/api/render` → `src/skills/htmlGenerator.ts`）
- 下载 HTML
- 抓取公众号文章

### 冲突分析

| 现有 /editor | PROPOSAL agentic-ai |
|-------------|-------------------|
| 手动编辑 Markdown | LLM 辅助写作 |
| 手动选择 theme | LLM 自动选择 theme |
| 调用 src/skills/** 脚本渲染 | **不使用** src/skills/**，LLM 直接生成 |
| 基础预览 | 基于 DESIGN.md 的专业渲染 |

### 融合方案

**以 PROPOSAL-agentic-ai 为核心特色**，将 Agent 能力作为 `/editor` 的智能助手：

1. **保留**：手动编辑 Markdown 的能力（用户可以直接打字）
2. **新增**：AI 对话助手面板（类似 ChatGPT）
3. **替换**：`/api/render` 使用 LLM + wechat-article SKILL.md 直接生成

### 融合后的 /editor 界面

```html
<!-- 工具栏新增 AI 对话按钮 -->
<button onclick="toggleAgent()">🤖 AI 助手</button>

<!-- 新增 AI 助手面板（默认隐藏） -->
<div id="agentPanel" class="panel">
  <div id="agentMessages"></div>
  <input id="agentInput" placeholder="告诉 AI 你想做什么...">
  <button onclick="sendToAgent()">发送</button>
</div>
```

用户与 AI 助手的交互：

```
用户: "帮我写一篇关于 React 19 的技术文章"
AI: [自动生成 Markdown 并填入编辑器]

用户: "这段文字有点生硬，帮我改自然一些"
AI: [调用 humanize_text_tool，返回修改后的内容]

用户: "用 business 主题渲染预览"
AI: [调用 render_html，LLM 直接生成 HTML，预览区更新]
```

### 实现方式

```typescript
// src/web/server.ts 更新 /editor 的渲染接口

app.post('/api/render', async (req: Request, res: Response) => {
  // 优先使用 LLM agent 渲染
  const { content, theme = 'auto' } = req.body;

  // 调用 Agent 的 render tool
  const html = await renderTool.execute({ content, theme });
  res.send(html);
});
```

这样：
1. **手动编辑** → 用户自己打字
2. **AI 助手** → `/api/agent/chat` 处理复杂任务（写作、渲染、发布）
3. **统一渲染** → 都用 LLM + wechat-article SKILL.md

---

## 实现步骤

### Phase 1: 核心（不使用 src/skills/**）

1. **创建 `src/agents/tools/render.ts`**：
   - 读取 `.agents/skills/wechat-article/design-system/references/{theme}/DESIGN.md`
   - 读取 `.agents/skills/wechat-article/HTML-CSS-SPEC.md`
   - 构建 Prompt，调用 OpenAI 直接生成 HTML

2. **创建 `src/agents/tools/format.ts`**：
   - 基于 wechat-article SKILL.md 的模板结构
   - 使用 LLM 优化 Markdown 格式

### Phase 2: 工具集成

3. **创建 `src/agents/tools/publish.ts`**：
   - 调用 WeChat API（复用现有 wechat/api.ts 逻辑）

4. **创建 `src/agents/tools/fetch.ts`**：
   - 抓取公众号文章

5. **创建 `src/agents/tools/humanize.ts`**：
   - 读取 humanizer-zh SKILL.md 规则
   - 使用 LLM 去除 AI 写作痕迹

6. **创建 `src/agents/tools/image.ts`**：
   - 上传到 Cloudinary

7. **创建 `src/agents/tools/file.ts`**：
   - 基础文件读写

### Phase 3: Agent 注册

8. **创建 `src/agents/index.ts`**：
   - 注册所有工具
   - 配置 Agent 和 instructions

9. **更新 `src/web/server.ts`**：
   - 添加 `/api/agent/chat` 接口

### Phase 4: 测试与优化

10. 测试不同主题的渲染效果
11. 添加 SSE 流式响应
12. 实现 Session 管理

---

## 前端集成：/editor 页面

### 已实现：AI 助手入口

在 `/editor` 页面工具栏新增 **🤖 AI 助手** 按钮，点击后从右侧滑出抽屉：

```
┌─────────────────────────────────────────┐
│ 📝 Markdown 编辑器              [🤖 AI 助手] │
├─────────────────────────────────────────┤
│ Files │  Editor          │  Preview        │
│------│----------------│----------------│
│      │ # 文章标题    │                │
│      │              │                │
│      │ 正文内容...  │                │
│      │              │                │
└─────────────────────────────────────────┘
       ↑
    抽屉从此处滑出
```

### 抽屉功能

| 区域 | 功能 |
|------|------|
| 消息区 | 显示 AI 回复和操作结果 |
| 快捷操作 | 🎨渲染 / 📝格式化 / ✨去痕 / 📤发布 / 📷上传 |
| 输入框 | 自然语言交互 |

### 快捷操作按钮

- **🎨 渲染 HTML**：调用 `/api/agent/render`，结果更新到预览区
- **📝 格式化**：调用 `/api/agent/format`，结果更新到编辑器
- **✨ 去除 AI 痕迹**：调用 `/api/agent/humanize`，结果更新到编辑器
- **📤 发布到公众号**：先渲染 HTML，再调用 `/api/agent/publish`
- **📷 上传图片**：调用 `/api/agent/upload-image`

### 自然语言交互

用户可直接输入指令：
- "用 tech 主题渲染"
- "优化文章结构"
- "把这篇文章改得更自然"
- "发布到公众号"

### API 接口调用方式

```javascript
// 渲染 HTML
await fetch('/api/agent/render', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: markdownContent,
    theme: 'auto',
    title: '文章标题'
  })
});

// 格式化 Markdown
await fetch('/api/agent/format', {
  method: 'POST',
  body: JSON.stringify({
    content: markdownContent,
    template: 'auto'
  })
});

// 去除 AI 痕迹
await fetch('/api/agent/humanize', {
  method: 'POST',
  body: JSON.stringify({ content: markdownContent })
});

// 发布到公众号
await fetch('/api/agent/publish', {
  method: 'POST',
  body: JSON.stringify({
    html: renderedHtml,
    title: '文章标题'
  })
});
```

### 后续优化

1. **流式响应**：SSE 返回 Agent 推理过程
2. **会话状态**：保存对话上下文
3. **更多操作**：批量处理、图片替换等