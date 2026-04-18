# WeChat Article Generator Skill

生成符合微信公众号格式的 HTML 文章，使用 design-system 定义的视觉风格系统。

## Purpose

将 Markdown 内容转换为可直接复制到微信公众号编辑器的 HTML 格式。关键特性：
- 内联 CSS 样式（公众号不支持 `<style>` 标签）
- 基于 design-system 的专业排版样式
- 代码高亮支持
- 多种主题风格（tech / business / claude / minimal）

## Input

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | Markdown 格式的文章内容 |
| title | string | 否 | 文章标题 |
| author | string | 否 | 作者名称 |
| theme | string | 否 | 主题：tech \| business \| claude \| minimal，默认 auto |
| template | string | 否 | 模板：tutorial \| analysis \| news \| story \| listicle \| review，默认 auto |
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

### 1. 智能选择主题和模板（如未指定）

如果用户未指定 `theme` 或 `template`，AI 分析文章内容特征自动选择：

**Theme 自动选择规则：**
| 内容特征 | 推荐 Theme |
|----------|------------|
| 包含代码、技术术语、编程教程 | tech |
| 商业分析、行业报告、数据图表 | business |
| 深度阅读、人文思考、散文随笔 | claude |
| 通用内容、新闻简讯、日常分享 | minimal |
| 其他无法分类的情况 | dark-finance、standard |

**Template 自动选择规则：**
| 内容特征 | 推荐 Template |
|----------|---------------|
| 教程类：步骤说明、操作指南、"如何..." | tutorial |
| 分析类：观点论述、趋势分析、深度解读 | analysis |
| 资讯类：新闻快讯、行业动态、事件报道 | news |
| 故事类：个人经历、案例故事、叙事文 | story |
| 清单类：排行榜、要点汇总、N个技巧 | listicle |
| 评测类：产品体验、工具对比、优缺点 | review |

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

根据选择的 theme 和 template，从 design-system 获取对应的设计规范，生成带有内联样式的 HTML。**不调用任何脚本或工具**，由 AI 完成全部转换。

不同模板对应的文章结构：

**tutorial（教程模板）**
```
标题
├── 简介（说明学习目标和预期收获）
├── 前置条件/准备工作
├── 步骤详解（Step 1, Step 2...）
├── 常见问题
└── 总结与延伸阅读
```

**analysis（分析模板）**
```
标题
├── 背景介绍
├── 核心观点
├── 论证分析（多角度论述）
├── 数据/案例支撑
├── 反方观点与回应
└── 结论与展望
```

**news（资讯模板）**
```
标题
├── 导语（5W1H 核心信息）
├── 事件详情
├── 各方反应
├── 影响分析
└── 延伸阅读
```

**story（故事模板）**
```
标题
├── 引子（吸引注意力的开头）
├── 背景铺垫
├── 情节发展
├── 高潮/转折点
├── 结局
└── 感悟/启示
```

**listicle（清单模板）**
```
标题
├── 引言（说明清单价值）
├── 要点 1
├── 要点 2
├── ...
├── 要点 N
└── 快速总结
```

**review（评测模板）**
```
标题
├── 产品/工具简介
├── 评测维度说明
├── 详细体验
├── 优缺点分析
├── 适用人群
└── 购买/使用建议
```

### 4. 图片处理（智能配图）

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

#### 步骤 2：提取主题词

若判断适合配图，AI 从文章中提取搜索关键词：

**主题词提取规则：**
1. **识别核心主题**（2-3个关键词）
   - 分析标题、首段、小标题中的高频概念词
   - 提取文章讨论的主要对象（产品名、技术名、场景等）
   - 示例："React 性能优化指南" → `react, performance, web development`

2. **添加视觉修饰词**
   - 根据文章主题自动添加风格词：
     - tech主题: `technology, digital, programming, software`
     - business主题: `business, professional, corporate, office`
     - claude主题: `artistic, warm, lifestyle, nature`
     - minimal主题: `minimal, clean, simple, modern`

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
GET https://api.unsplash.com/search/photos
Headers:
  Authorization: Client-ID $UNSPLASH_ACCESS_KEY
Query Parameters:
  query: {AI提取的主题词}
  per_page: {配图数量}
  orientation: landscape
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

### 5. 生成文件名

根据以下优先级确定输出文件名：
1. 用户指定的 filename 参数
2. 文章标题（转换为拼音或英文，去除特殊字符）
3. 时间戳格式：`article-{YYYYMMDD-HHmmss}`

### 6. 写入文件

使用 Write 工具将生成的 HTML 内容写入 `output/{filename}.html`。

**示例输出路径：**
```
output/my-article.html
output/tech-tutorial-20260415.html
output/article-20260415-143052.html
```

### 与项目 CLI 工具的区别

| 方式 | 命令/调用 | 说明 |
|------|-----------|------|
| **Skill 方式** | AI 直接执行 | 由 AI 解析 Markdown 并生成 HTML，使用本 Skill 定义的流程和样式 |
| **CLI 方式** | `npm run wechat -- -i input.md` | 调用项目内置的 TypeScript 渲染器，输出到 `output/` 目录 |

**选择建议：**
- 需要 AI 智能配图、自动选择主题 → 使用 Skill 方式
- 已有 Markdown 文件，快速转换 → 使用 CLI 方式
- 需要自定义模板逻辑 → 使用 CLI 方式

## 主题系统

主题样式定义在 `design-system/references/` 目录下，每个主题都有完整的 DESIGN.md 规范。

### 自动选择逻辑

当用户未指定 theme 时，AI 基于以下内容特征自动匹配：

```
内容分析维度：
├── 关键词匹配（代码、算法、API、编程语言 → tech）
├── 语气分析（数据驱动、专业术语 → business）
├── 情感基调（温暖、人文、叙事 → claude）
└── 默认回退（minimal）
```

### tech（科技风）- 默认

基于 SpaceX 设计系统，适合技术教程、代码文章。

**核心特征：**
- 主色调：#35b3ff（科技蓝）
- 深色代码背景：#282c34
- 工业感排版，简洁有力

**颜色系统：**
| 名称 | 色值 | 用途 |
|------|------|------|
| Primary | #35b3ff | 主色调，引用边框、链接 |
| Text Primary | #333333 | 主要文字 |
| Text Secondary | #666666 | 次要文字 |
| Background | #ffffff | 页面背景 |
| Code Background | #282c34 | 代码块背景 |
| Border | #e8e8e8 | 边框、分割线 |

**字体规范：**
| 元素 | 大小 | 行高 | 字重 |
|------|------|------|------|
| H1 | 22px | 1.3 | 700 |
| H2 | 20px | 1.4 | 700 |
| H3 | 18px | 1.4 | 700 |
| Body | 16px | 1.75 | 400 |
| Code | 14px | 1.5 | 400 |

### business（商务风）

基于 IBM Carbon 设计系统，适合商业分析、行业报告。

**核心特征：**
- 主色调：#0f62fe（IBM蓝）
- 专业、稳重的视觉风格
- 清晰的信息层级

**颜色系统：**
| 名称 | 色值 | 用途 |
|------|------|------|
| Primary | #0f62fe | 主色调，按钮、链接 |
| Text Primary | #161616 | 主要文字 |
| Text Secondary | #525252 | 次要文字 |
| Background | #ffffff | 页面背景 |
| Surface | #f4f4f4 | 卡片背景 |
| Border | #c6c6c6 | 边框 |

**字体规范：**
| 元素 | 大小 | 行高 | 字重 |
|------|------|------|------|
| H1 | 22px | 1.3 | 600 |
| H2 | 20px | 1.4 | 600 |
| H3 | 18px | 1.4 | 600 |
| Body | 16px | 1.6 | 400 |
| Caption | 14px | 1.4 | 400 |

### claude（文艺风）

基于 Claude 设计系统，适合深度阅读、文艺内容。

**核心特征：**
- 暖色调背景：#f5f4ed（羊皮纸色）
- 陶土色强调：#c96442
- 优雅的衬线字体风格

**颜色系统：**
| 名称 | 色值 | 用途 |
|------|------|------|
| Primary | #c96442 | 主色调，强调色 |
| Text Primary | #141413 | 主要文字 |
| Text Secondary | #5e5d59 | 次要文字 |
| Background | #f5f4ed | 页面背景（羊皮纸色）|
| Card Surface | #faf9f5 | 卡片背景 |
| Border | #e8e6dc | 边框 |

**字体规范：**
| 元素 | 大小 | 行高 | 字重 |
|------|------|------|------|
| H1 | 24px | 1.3 | 600 |
| H2 | 20px | 1.4 | 600 |
| H3 | 18px | 1.4 | 600 |
| Body | 17px | 1.75 | 400 |
| Caption | 14px | 1.6 | 400 |

### minimal（极简风）

基于默认设计系统，适合通用文章。

**核心特征：**
- 黑白灰配色
- 极简视觉风格
- 通用性强

**颜色系统：**
| 名称 | 色值 | 用途 |
|------|------|------|
| Primary | #667eea | 主色调 |
| Accent | #35b3ff | 强调色 |
| Text Primary | #333333 | 主要文字 |
| Text Secondary | #666666 | 次要文字 |
| Background | #ffffff | 页面背景 |
| Border | #e8e8e8 | 边框 |

## 样式转换规则

AI 在转换时必须遵循以下规则：

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
<table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
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

## 主题特定样式参考

### Tech 主题专用样式

```html
<!-- 引用块 - 科技蓝 -->
<blockquote style="margin: 16px 0; padding: 12px 16px; border-left: 4px solid #35b3ff; background-color: #f8f8f8; color: #666;">

<!-- 代码块 - 深色主题 -->
<pre style="margin: 16px 0; padding: 16px; background-color: #282c34; color: #abb2bf; border-radius: 6px; font-family: monospace; font-size: 14px; line-height: 1.5; overflow-x: auto;">
```

### Business 主题专用样式

```html
<!-- 引用块 - IBM蓝 -->
<blockquote style="margin: 16px 0; padding: 12px 16px; border-left: 4px solid #0f62fe; background-color: #f4f4f4; color: #525252;">

<!-- 代码块 - 浅色主题 -->
<pre style="margin: 16px 0; padding: 16px; background-color: #f4f4f4; color: #161616; border-radius: 0px; font-family: monospace; font-size: 14px; line-height: 1.5; overflow-x: auto; border: 1px solid #e0e0e0;">
```

### Claude 主题专用样式

```html
<!-- 引用块 - 陶土色 -->
<blockquote style="margin: 16px 0; padding: 12px 16px; border-left: 4px solid #c96442; background-color: #faf9f5; color: #5e5d59;">

<!-- 代码块 - 暖色调 -->
<pre style="margin: 16px 0; padding: 16px; background-color: #30302e; color: #faf9f5; border-radius: 8px; font-family: monospace; font-size: 14px; line-height: 1.5; overflow-x: auto;">
```

## 文章模板

```html
<section style="max-width: 677px; margin: 0 auto; padding: 20px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif; font-size: 16px; line-height: 1.75; color: #333;">

  <!-- 标题区域 -->
  <h1 style="font-size: 22px; font-weight: bold; color: #333; margin: 0 0 8px 0; text-align: center;">文章标题</h1>

  <!-- 作者信息 -->
  <p style="font-size: 14px; color: #999; text-align: center; margin: 0 0 24px 0;">作者 | 日期</p>

  <!-- 正文内容 -->
  ...

</section>
```

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

- `design-system/SKILL.md` - Design System 使用指南
- `design-system/references/tech/DESIGN.md` - Tech 主题详细规范
- `design-system/references/business/DESIGN.md` - Business 主题详细规范
- `design-system/references/claude/DESIGN.md` - Claude 主题详细规范
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
生成微信公众号文章，图片模式none，主题为business，内容为：{markdown内容}
```

**纯文字文章示例（AI 会自动跳过配图）：**
```
生成微信公众号文章，内容为：
# 函数式编程的数学基础

函数式编程源于 lambda 演算，由阿隆佐·邱奇在1930年代提出...
```
AI 分析：纯理论技术文章，无界面展示需求 → 跳过配图
