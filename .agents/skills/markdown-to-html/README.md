# Markdown to HTML Converter Skill

将 Markdown 转换为基础 HTML 结构，专注于内容转换而非样式设计。

## 快速开始

### 基本用法
```bash
# 使用 CLI 命令
npm run md2html -- -i input.md -o ./output

# 在 Web 界面中使用
npm run web
# 访问 http://localhost:3000/editor
```

### 代码调用
```typescript
import { convertMarkdownToHtml } from '../src/skills/markdownConverter';

const html = convertMarkdownToHtml(markdownContent, {
  title: '文章标题',
  author: '作者名称',
  theme: 'tech' // tech | minimal | business
});
```

## 功能特性

- ✅ 轻量级 Markdown 解析
- ✅ 基础 HTML 结构生成
- ✅ 代码高亮支持
- ✅ 多种主题支持
- ✅ 干净的输出，无复杂样式

## 主题预览

### Tech 主题（默认）
- 科技蓝色调 (#35b3ff)
- 浅色代码背景 (#f6f8fa)
- 适合技术文章和教程

### Minimal 主题
- 黑白灰色调
- 极简视觉风格
- 适合通用内容

### Business 主题
- 商务蓝色调 (#2d5a7b)
- 专业稳重的风格
- 适合商业报告和分析

## 与 wechat-article 技能协作

本技能专注于内容转换，可以与 `wechat-article` 技能配合使用：

```typescript
// 完整工作流程
import { convertMarkdownToHtml } from '../src/skills/markdownConverter';
import { optimizeForWeChat } from '../src/skills/wechatRenderer';

// 1. 基础转换
const basicHtml = convertMarkdownToHtml(markdown, {
  title: '文章标题',
  theme: 'tech'
});

// 2. 微信公众号优化
const wechatHtml = optimizeForWeChat(basicHtml, {
  theme: 'tech',
  optimizeLevel: 'full'
});
```

## 文件结构

```
.agents/skills/markdown-to-html/
├── SKILL.md              # 技能定义
├── README.md            # 使用说明
└── examples/            # 示例文件
    ├── basic-usage.md   # 基础用法示例
    └── output-example.html # 输出示例
```

## 依赖

- `marked` - Markdown 解析器
- `highlight.js` - 代码语法高亮

## 许可证

MIT