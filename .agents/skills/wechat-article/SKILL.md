---
name: wechat-article
description: |
  将 Markdown 内容转换为微信公众号兼容的 HTML 格式。
  支持内联 CSS 样式、多种主题（airbnb/apple/binance/claude/coinbase/mastercard/notion/opencode.ai/spacex/stripe/vercel）、智能配图和代码高亮。
  同时支持对现有 HTML 进行排版优化（统一样式 + 微信兼容性修复）。
  可自动分析内容选择合适的模板和主题，支持 Unsplash API 获取配图。
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - WebFetch
metadata:
  trigger: 生成微信公众号文章、Markdown 转 HTML、公众号排版、HTML 排版优化
  source: 基于 design-system 设计系统
---

# 微信文章排版优化Skill

使用 design-system 定义的视觉风格系统，将Markdown内容转换成HTML，同时支持优化 HTML，使其更适合公众号。

## Purpose

关键特性：
- 内联 CSS 样式（公众号不支持 `<style>` 标签）
- 基于 design-system 的专业排版样式
- 代码高亮支持
- 多种主题风格（airbnb/apple/binance/claude/coinbase/mastercard/notion/opencode.ai/spacex/stripe/vercel）

## Input

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是* | Markdown 格式的文章内容（* 与 inputPath/sourceHtml 二选一） |
| inputPath | string | 是* | HTML 文件路径（支持 glob 模式如 `output/*.html`），与 content 二选一 |
| sourceHtml | string | 是* | HTML 字符串（备选输入方式），与 content 二选一 |
| title | string | 否 | 文章标题 |
| author | string | 否 | 作者名称 |
| theme | string | 否 | 主题：notion \| stripe \| claude \| vercel，默认 auto |
| filename | string | 否 | 输出文件名（不含扩展名），默认使用标题或时间戳 |
| images | string | 否 | 图片模式：auto \| manual \| none，默认 auto |
| imageCount | number | 否 | 配图数量（1-5），AI 会根据文章长度智能判断 |
| imageKeywords | string | 否 | 强制指定图片搜索关键词（逗号分隔），未提供时由 AI 从内容自动提取 |

## 环境变量

| 变量名 | 必填 | 说明 |
|--------|------|------|
| UNSPLASH_ACCESS_KEY | 否 | Unsplash API Access Key，用于自动获取配图。未设置时跳过图片处理 |
| UNSPLASH_IMAGE_COUNT | 否 | 默认配图数量（1-5），覆盖 imageCount 参数 |

## Output

将生成的 HTML 文件写入 `output/` 目录，文件名格式为 `{filename}.html`。

## 执行流程

当用户请求生成微信公众号文章时，**AI 直接执行以下步骤**（不调用外部 npm 脚本，由 AI 直接生成 HTML）：

> **重要提示**: 此 Skill 定义的是 AI 的工作流程，AI 应该直接解析 Markdown 并生成内联 CSS 的 HTML，而不是调用 `npm run wechat` 等外部命令。外部命令是项目的 CLI 工具，与此 Skill 是独立的实现方式。

### 执行分支

| 输入类型 | 执行流程 |
|----------|----------|
| `content`（Markdown） | 步骤 1-3 → 5-8 |
| `inputPath` / `sourceHtml`（HTML） | 步骤 4 → 5-8 |

### 1. 智能选择主题和模板（如未指定）

如果用户未指定 `theme`，AI 分析文章内容特征自动选择：

**Theme 自动选择规则：**
| 内容特征 | 推荐 Theme |
|----------|------------|
| 包含代码、技术术语、编程教程 | claude |
| 商业分析、行业报告、数据图表 | coinbase |
| 深度阅读、人文思考、散文随笔 | airbnb/notion |
| 通用内容、新闻简讯、日常分享 | standard |
| 其他无法分类的情况 | mastercard/standard |


### 2. 解析 Markdown

AI 自行解析 Markdown 语法，识别以下元素：
- 标题（H1-H6）
- 段落
- 引用块
- 代码块和行内代码
- 列表（有序/无序）
- 表格
- 图片
- 链接

### 3. 应用 Design System 样式和模板结构

根据选择的 theme，从 design-system 获取对应的设计规范，生成带有内联样式的 HTML。**不调用任何脚本或工具**，由 AI 完成全部转换。

```

### 4. HTML 排版优化（inputPath 模式）

当用户提供 `inputPath` 或 `sourceHtml` 时，执行以下流程：

#### 4.1 读取 HTML 内容

- 如果是 `inputPath`：使用 Read 工具读取文件内容
- 如果是 `sourceHtml`：直接使用提供的 HTML 字符串

#### 4.2 提取语义内容

AI 解析 HTML 结构，提取以下语义元素（**丢弃原始样式，仅保留结构和文本**）：

| 元素 | 处理方式 |
|------|----------|
| 标题 (h1-h6) | 保留文本 |
| 段落 (p) | 保留文本，丢弃原始样式 |
| 列表 (ul/ol/li) | 保留结构 |
| 表格 (table/tr/td/th) | 保留结构，包括 rowspan/colspan |
| 代码块 (pre/code) | 保留代码内容 |
| 图片 (img) | **保留 src 和 alt**（不替换，保持原图）|
| 链接 (a) | 保留 href 和文本 |
| 引用 (blockquote) | 保留文本 |

**需要丢弃的内容：**
- 所有 `style` 属性
- 所有 `class` 属性
- 所有 `id` 属性
- `<style>` 标签
- `<script>` 标签
- `<div>` 标签（转换为 `<section>` 或 `<p>`）

#### 4.3 确定主题

- 如果指定了 `theme`，使用指定主题
- 否则 `auto` 根据内容自动选择

#### 4.4 重新生成 HTML

根据选择的主题，从 design-system 获取样式规范，生成带有内联样式的新 HTML。

#### 4.5 微信兼容性修复

| 问题 | 修复方案 |
|------|----------|
| `<div>` 标签 | → `<section>` 或 `<p>` |
| `<style>` 标签 | 移除，内联样式到元素 |
| `<script>` 标签 | 移除 |
| 行内样式 `style="..."` | 丢弃，重新生成 |
| `class` / `id` 属性 | 丢弃 |
| 表格 `rowspan`/`colspan` | 保持兼容 |
| 图片 max-width | 确保 `100%` |
| 字体 | 使用系统字体栈 |

#### 4.6 生成输出文件名

```
原文件: output/article.html
输出文件: output/optimized-article.html
```

规则：
- 提取原文件名（不含路径和扩展名）
- 添加 `optimized-` 前缀
- 保留 `.html` 扩展名
- 输出到相同目录

#### 4.7 逐个写入文件

使用 Write 工具将优化后的 HTML 写入 `output/optimized-{原文件名}.html`。

**示例：**
```
优化 HTML 排版：output/old-article.html
→ 输出：output/optimized-old-article.html

批量处理：output/*.html
→ output/optimized-article1.html
→ output/optimized-article2.html
```

### 5. 图片处理（智能配图）

AI 自动分析文章内容，智能判断是否适合添加配图，并自动提取主题词搜索合适的图片。

**图片模式说明：**
| 模式 | 说明 |
|------|------|
| auto | AI 智能分析内容，自动判断是否配图（默认）|
| manual | 保留用户 Markdown 中原有的图片，不自动添加 |
| none | 不插入任何图片 |

**当 images=auto 时，执行以下智能配图流程：**

#### 步骤 1：内容分析 - 判断是否适合配图

AI 分析文章类型和内容特征，判断是否需要配图：

**适合配图的文章类型：**
| 类型 | 判断依据 | 配图建议 |
|------|----------|----------|
| 技术教程 | 包含操作步骤、界面说明、代码演示 | 推荐配图（展示界面、架构图、流程图）|
| 产品评测 | 介绍具体产品、工具、应用 | 推荐配图（产品截图、使用场景）|
| 行业分析 | 涉及数据、趋势、案例 | 推荐配图（数据可视化、行业相关场景）|
| 生活随笔 | 旅行、美食、生活方式 | 推荐配图（场景照片、氛围图）|
| 设计/艺术类 | 视觉相关内容 | 强烈推荐配图 |

**不适合配图的文章类型：**
| 类型 | 判断依据 | 处理方式 |
|------|----------|----------|
| 纯技术概念 | 抽象算法、纯理论讨论 | 跳过配图或仅添加1张概念图 |
| 代码密集型 | 大量代码片段，无界面展示 | 跳过配图 |
| 简短资讯 | 内容少于500字 | 跳过配图 |
| 哲学/思考类 | 纯文字思辨内容 | 跳过配图或添加1张氛围图 |

步骤 2：提取主题词

若判断适合配图，AI 从文章中提取搜索关键词：

**主题词提取规则：**
1. **识别核心主题**（2-3个关键词）
   - 分析标题、首段、小标题中的高频概念词
   - 提取文章讨论的主要对象（产品名、技术名、场景等）
   - 示例："React 性能优化指南" → `react, performance, web development`

2. **添加视觉修饰词**
   - 根据文章主题自动添加风格词：
     - apple/spacex主题: `technology, digital, programming, software`
     - binance/coinbase主题: `business, professional, corporate, office`
     - neo-brutalist/claude主题: `artistic, warm, lifestyle, nature`
     - notion/vercel主题: `minimal, clean, simple, modern`

3. **生成搜索查询**
   - 组合格式：`{核心主题} {风格修饰词}`
   - 示例：`artificial intelligence technology digital`

#### 步骤 3：确定配图数量

根据文章长度和内容密度自动确定：

| 文章长度 | 内容密度 | 推荐配图数 |
|----------|----------|------------|
| < 800字 | 低 | 1-2 张 |
| 800-1500字 | 中 | 2-3 张 |
| 1500-2500字 | 高 | 3-4 张 |
| > 2500字 | 很高 | 4-5 张 |

**数量控制优先级：**
1. 用户指定的 `imageCount` 参数
2. 环境变量 `UNSPLASH_IMAGE_COUNT`
3. AI 根据内容自动判断（默认 3 张）
4. 最大不超过 5 张

#### 步骤 4：调用 Unsplash API 搜索图片

**环境变量要求：**
- `UNSPLASH_ACCESS_KEY` 必须已设置（Unsplash Access Key）

**前置检查（仅验证存在性，不输出值）：**
```bash
!node -e "process.env.UNSPLASH_ACCESS_KEY ? console.log('UNSPLASH_ACCESS_KEY: 已设置') : console.log('UNSPLASH_ACCESS_KEY: 未设置')"
```

**API 调用：**
```
curl -X GET "https://api.unsplash.com/search/photos?query={AI提取的主题词}&per_page={配图数量}&orientation=landscape" \
-H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY"
```

**错误处理：**
- 若 `UNSPLASH_ACCESS_KEY` 未设置 → 跳过配图，继续生成文章
- 若 API 调用失败 → 跳过配图，记录原因
- 若搜索结果不足 → 减少配图数量或调整关键词重试

#### 步骤 5：智能插入图片

根据文章结构选择最佳插入位置：

**插入策略：**
```
文章结构
├── 标题区
│   └── 第1张：封面图（标题下方，营造氛围）
├── 引言/导语
├── 正文段落1
│   └── 第2张：支撑第1-2个段落的内容
├── 正文段落2
├── 正文段落3
│   └── 第3张：支撑中间段落的内容
├── 正文段落4
├── 结论/总结
│   └── 第4-5张（如有）：结尾氛围图或总结图
```

**插入位置规则：**
- 避免在代码块、表格、列表中间插入
- 优先选择段落之间的过渡位置
- 封面图必须放在标题和作者信息之后
- 图片之间至少间隔 2-3 个段落

#### 步骤 6：生成图片 HTML

使用内联样式生成图片元素：

```html
<!-- 封面图样式 -->
<figure style="margin: 24px 0; text-align: center;">
  <img src="{urls.regular}" alt="{文章主题}" style="max-width: 100%; height: auto; display: block; margin: 0 auto; border-radius: 8px;">
  <figcaption style="font-size: 12px; color: #999; margin-top: 8px;">
    Photo by <a href="{user.links.html}" style="color: #999; text-decoration: underline;">{user.name}</a> on <a href="https://unsplash.com" style="color: #999; text-decoration: underline;">Unsplash</a>
  </figcaption>
</figure>
```

**图片元数据使用：**
- `urls.regular` - 图片 URL（1080px 宽度，适合公众号）
- `alt_description` 或 `description` - 图片 alt 文本
- `user.name` - 摄影师署名
- `user.links.html` - 摄影师主页链接
- `links.html` - Unsplash 图片页面（可选）

### 7. 生成文件名

根据以下优先级确定输出文件名：
1. 用户指定的 filename 参数
2. 文章标题（转换为拼音或英文，去除特殊字符）
3. 时间戳格式：`article-{YYYYMMDD-HHmmss}`

### 8. 写入文件

使用 Write 工具将生成的 HTML 内容写入 `output/{filename}.html`。

**示例输出路径：**
```
output/my-article.html
output/tech-tutorial-20260415.html
output/article-20260415-143052.html
```


## 主题系统

主题样式定义在 `design-system/references/` 目录下，每个主题都有完整的 DESIGN.md 规范。

### 自动选择逻辑

当用户未指定 theme 时，AI 基于以下内容特征自动匹配：

```
内容分析维度：
├── 关键词匹配（代码、算法、API、编程语言 → claude/opencode.ai）
├── 语气分析（数据驱动、专业术语 → apple/spacex）
├── 情感基调（温暖、人文、叙事 → notion）
└── 默认回退（standard）
```


## 样式转换规则

在 Markdown 转 HTML 时必须遵循以下样式规则：

### 容器样式

```html
<section style="max-width: 677px; margin: 0 auto; padding: 20px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif; font-size: 16px; line-height: 1.75; color: #333;">
```

### 标题样式

**H1 标题：**
```html
<h1 style="font-size: 22px; font-weight: bold; color: #333; margin: 0 0 8px 0; text-align: center;">标题文本</h1>
```

**H2 标题：**
```html
<h2 style="font-size: 20px; font-weight: bold; color: #333; margin: 24px 0 16px 0;">标题文本</h2>
```

**H3 标题：**
```html
<h3 style="font-size: 18px; font-weight: bold; color: #333; margin: 20px 0 12px 0;">标题文本</h3>
```

### 正文样式

```html
<p style="margin: 16px 0; font-size: 16px; line-height: 1.75; color: #333; text-align: justify;">正文内容</p>
```

### 引用样式

```html
<blockquote style="margin: 16px 0; padding: 12px 16px; border-left: 4px solid #35b3ff; background-color: #f8f8f8; color: #666;">
引用内容
</blockquote>
```

### 代码块样式

```html
<pre style="margin: 16px 0; padding: 16px; background-color: #282c34; color: #abb2bf; border-radius: 6px; font-family: 'SFMono-Regular', Consolas, monospace; font-size: 14px; line-height: 1.5; overflow-x: auto; white-space: pre-wrap;"><code>代码内容</code></pre>
```

### 行内代码样式

```html
<code style="padding: 2px 6px; background-color: #f5f5f5; border-radius: 4px; font-family: 'SFMono-Regular', Consolas, monospace; font-size: 14px;">代码</code>
```

### 图片样式

**基础图片样式：**
```html
<img src="图片URL" alt="描述" style="max-width: 100%; height: auto; display: block; margin: 16px auto; border-radius: 4px;">
```

**Unsplash 配图样式（带署名）：**
```html
<figure style="margin: 20px 0; text-align: center;">
  <img src="图片URL" alt="图片描述" style="max-width: 100%; height: auto; display: block; margin: 0 auto; border-radius: 8px;">
  <figcaption style="font-size: 12px; color: #999; margin-top: 8px;">
    Photo by <a href="https://unsplash.com/@username" style="color: #999; text-decoration: underline;">作者名</a> on <a href="https://unsplash.com" style="color: #999; text-decoration: underline;">Unsplash</a>
  </figcaption>
</figure>
```

### 表格样式

```html
<table style="width: 100%; border-collapse: collapse; margin: 16px 0;display: block; overflow-x: auto;">
  <thead>
    <tr style="background-color: #f5f5f5;">
      <th style="padding: 12px; border: 1px solid #e8e8e8; text-align: left; font-weight: bold;">表头</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #e8e8e8;">内容</td>
    </tr>
  </tbody>
</table>
```

### 列表样式

**无序列表：**
```html
<ul style="margin: 16px 0; padding-left: 24px;">
  <li style="margin: 8px 0; line-height: 1.75;">列表项</li>
</ul>
```

**有序列表：**
```html
<ol style="margin: 16px 0; padding-left: 24px;">
  <li style="margin: 8px 0; line-height: 1.75;">列表项</li>
</ol>
```

---


## Important Notes

1. **内联样式**: 公众号编辑器会过滤 `<style>` 标签，所有样式必须内联
2. **图片限制**: 图片需要先上传到微信服务器或使用外链
3. **JavaScript**: 公众号不支持任何 JavaScript
4. **字体**: 使用系统默认字体，确保兼容性
5. **宽度**: 内容区域建议不超过 677px
6. **div 标签**: 公众号不支持 `<div>` 标签，使用 `<section>` 替代
7. **主题选择**: 根据文章内容选择合适的主题风格
8. **文件输出**: 默认将 HTML 写入 `output/` 目录，用户可直接在 Web 界面查看
9. **Unsplash 图片**: 使用 Unsplash API 获取的图片需遵守 [Unsplash 使用条款](https://unsplash.com/terms)，必须包含作者署名

## 相关文件

- `design-system/index.md` - Design System 使用指南
- `design-system/references/**/DESIGN.md` - 各种主题详细规范
- `design-system/references/airbnb/DESIGN.md` - 旅行杂志风格 
- `design-system/references/apple/DESIGN.md` - 苹果极简风格
- `design-system/references/binance/DESIGN.md` - 币安金融风格 
- `design-system/references/claude/DESIGN.md` - Anthropic 暖调风格 
- `design-system/references/coinbase/DESIGN.md` - Coinbase 风格 
- `design-system/references/japanese-zen/DESIGN.md` - 日式禅意风格 
- `design-system/references/luxury-editorial/DESIGN.md` - 奢华编辑风格 
- `design-system/references/mastercard/DESIGN.md` - 万事达暖调风格 
- `design-system/references/notion/DESIGN.md` - Notion 极简风格 
- `design-system/references/neo-brutalist/DESIGN.md` - 新粗野主义 
- `design-system/references/opencode.ai/DESIGN.md` - 终端极客风格
- `design-system/references/spacex/DESIGN.md` - SpaceX 电影风格 
- `design-system/references/standard/DESIGN.md` - 财经专业风格 
- `design-system/references/stripe/DESIGN.md` - Stripe 精致风格
- `design-system/references/vercel/DESIGN.md` - Vercel 开发者风格 
- `design-system/references/vintage-newspaper/DESIGN.md` - 复古报纸风格 
- `HTML-CSS-SPEC.md` - HTML/CSS 技术规范

## 示例用法

**基础用法（AI 智能判断是否配图）：**
```
生成微信公众号文章，内容为：{markdown内容}
```
AI 会自动分析内容，如果是技术教程、产品评测、生活随笔等适合配图的文章类型，会自动提取主题词搜索配图。

**强制指定配图数量和关键词：**
```
生成微信公众号文章，配图5张，关键词：人工智能, 机器学习, 神经网络
内容为：{markdown内容}
```

**手动模式（保留原有图片，不自动添加）：**
```
生成微信公众号文章，图片模式manual，内容为：{markdown内容}
```

**无图片模式：**
```
生成微信公众号文章，图片模式none，主题为airbnb，内容为：{markdown内容}
```

**纯文字文章示例（AI 会自动跳过配图）：**
```
生成微信公众号文章，内容为：
# 函数式编程的数学基础

函数式编程源于 lambda 演算，由阿隆佐·邱奇在1930年代提出...
```

## HTML 排版优化示例

**优化 HTML 排版（单文件）：**
```
优化 HTML 排版：output/old-article.html
```
→ 读取文件 → 提取语义内容 → 应用新主题 → 输出 `output/optimized-old-article.html`

**优化并指定主题：**
```
优化 HTML 排版：output/article.html，重新应用 standard 主题
```

**批量处理：**
```
优化 HTML 排版：output/*.html
```
→ 逐个处理每个 HTML 文件 → 输出到 `output/optimized-*.html`

**使用 sourceHtml（HTML 字符串）：**
```
优化 HTML 排版，内容为：<section>...</section>
```

