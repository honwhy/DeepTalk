---
name: wechat-article
description: |
  将 HTML 内容优化为符合微信公众号格式的文章，使用 design-system 定义的视觉风格系统。
  提供智能主题适配、模板化结构、AI 智能配图、HTML 优化引擎等功能。
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
metadata:
  trigger: 优化 HTML 内容为微信公众号格式
  category: wechat
  version: 2.0.0
---

# WeChat Article Optimizer Skill

将 HTML 内容优化为符合微信公众号格式的文章，使用 design-system 定义的视觉风格系统。

## Purpose

**AI驱动的微信公众号文章优化系统**，将HTML内容智能转换为符合微信公众号编辑器规范的HTML格式，提供专业级排版、智能配图、主题适配等高级功能。

### 核心价值
1. **解决微信公众号排版痛点**：自动处理内联CSS样式（公众号过滤`<style>`标签）、容器标签转换（`<div>`→`<section>`）、图片优化等兼容性问题
2. **提升内容专业度**：基于design-system的设计规范，提供科技、商务、文艺、极简等多种专业视觉风格
3. **智能内容增强**：AI自动分析文章内容，智能选择主题/模板，自动搜索并插入相关配图，提升文章吸引力
4. **工作流程优化**：一站式完成从HTML内容到可发布文章的完整优化，无需手动处理样式和兼容性问题


### 与 markdown-to-html 技能的关系

本技能专注于HTML内容的优化和微信公众号兼容性处理，通常与 `markdown-to-html` 技能配合使用：

**完整工作流程：**
```
AI 生成 Markdown → markdown-to-html → 基础 HTML → wechat-article → 微信公众号 HTML
```

**技能分工：**
- `markdown-to-html`：专注于内容转换，生成干净的HTML结构
- `wechat-article`：专注于样式优化和平台兼容性，生成可直接发布的微信公众号文章

## Input

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | HTML 格式的文章内容 |
| title | string | 否 | 文章标题 |
| author | string | 否 | 作者名称 |
| theme | string | 否 | 主题：tech \| business \| claude \| minimal，默认 auto |
| template | string | 否 | 模板：tutorial \| analysis \| news \| story \| listicle \| review，默认 auto |
| filename | string | 否 | 输出文件名（不含扩展名），默认使用标题或时间戳 |
| images | string | 否 | 图片模式：auto \| manual \| none，默认 auto |
| imageCount | number | 否 | 配图数量（1-5），AI 会根据文章长度智能判断 |
| imageKeywords | string | 否 | 强制指定图片搜索关键词（逗号分隔），未提供时由 AI 从内容自动提取 |
| tableStyle | string | 否 | 表格样式：simple \| striped \| bordered，默认 simple |
| fixTableStyles | boolean | 否 | 是否自动修复表格样式（如 tr background-color），默认 true |
| codeHighlight | boolean | 否 | 是否启用代码语法高亮，默认 true |

### 参数详细说明

**tableStyle 参数：**
- `simple`：简单表格，表头有背景色，单元格有边框
- `striped`：斑马纹表格，奇数行和偶数行交替背景色
- `bordered`：边框表格，所有单元格都有明显边框

**fixTableStyles 参数：**
当设置为 `true` 时（默认），AI 会自动：
1. 检测并修复在 `<tr>` 标签上使用的 `background-color`（微信公众号不支持）
2. 将 `tr` 的背景色迁移到对应的 `<th>` 或 `<td>` 单元格上
3. 确保表格样式符合微信公众号兼容性要求

**codeHighlight 参数：**
当设置为 `true` 时（默认），AI 会自动：
1. 检测文章中的代码块（`<pre><code>`）
2. 使用 highlight.js 进行语法高亮
3. 将动态生成的 class 样式转换为内联样式，确保微信公众号兼容性
4. 支持多种编程语言的语法高亮，包括 JavaScript、Python、Java、C++、HTML、CSS 等

**表格样式自动修复示例：**
```html
<!-- 输入（包含不兼容的 tr background-color） -->
<table>
  <tr style="background-color: #f5f5f5;">
    <th>表头1</th>
    <th>表头2</th>
  </tr>
</table>

<!-- 输出（修复后） -->
<table style="width: 100%; border-collapse: collapse; margin: 16px 0; display: block; overflow-x: auto;">
  <tr>
    <th style="background-color: #f5f5f5; padding: 10px 12px; border: 1px solid #e8e8e8; text-align: left; font-weight: bold;">表头1</th>
    <th style="background-color: #f5f5f5; padding: 10px 12px; border: 1px solid #e8e8e8; text-align: left; font-weight: bold;">表头2</th>
  </tr>
</table>
```

## 环境变量

| 变量名 | 必填 | 说明 |
|--------|------|------|
| UNSPLASH_ACCESS_KEY | 否 | Unsplash API Access Key，用于自动获取配图。未设置时跳过图片处理 |
| UNSPLASH_IMAGE_COUNT | 否 | 默认配图数量（1-5），覆盖 imageCount 参数 |

## Output

将生成的 HTML 文件写入 `output/` 目录，文件名格式为 `{filename}.html`。

## 执行流程（两阶段）

当用户请求优化微信公众号文章时，**AI 直接执行以下两阶段流程**：

### 阶段一：设计规范应用（Design Phase）

#### 1. 智能选择主题和模板（如未指定）

如果用户未指定 `theme` 或 `template`，AI 分析文章内容特征自动选择：

**Theme 自动选择规则：**
AI 基于内容特征自动匹配主题，详细规则请参考"主题系统"小节中的自动选择逻辑。

**Template 自动选择规则：**
| 内容特征 | 推荐 Template |
|----------|---------------|
| 教程类：步骤说明、操作指南、"如何..." | tutorial |
| 分析类：观点论述、趋势分析、深度解读 | analysis |
| 资讯类：新闻快讯、行业动态、事件报道 | news |
| 故事类：个人经历、案例故事、叙事文 | story |
| 清单类：排行榜、要点汇总、N个技巧 | listicle |
| 评测类：产品体验、工具对比、优缺点 | review |

#### 2. 内容解析与设计规范应用

AI 解析 HTML 结构，进行设计规范应用：

**设计规范应用工作流程：**
1. **读取 DESIGN.md 设计规范**
   - 从 `design-system/references/{theme}/DESIGN.md` 读取完整设计规范
   - 提取颜色系统、字体规范、间距规则、视觉层次
   - 理解设计理念和视觉特征

2. **应用设计理念优化 HTML**
   - 应用颜色系统：主色调、背景色、文字色
   - 应用字体规范：字体大小、字重、行高
   - 应用间距规则：段落间距、卡片内边距、元素间距
   - 应用视觉层次：标题大小、卡片设计、数据展示方式
   - **保持设计意图**：可以使用现代 CSS 特性表达设计理念

3. **生成设计规范的 HTML 草案**
   - 输出视觉上符合 DESIGN.md 规范的 HTML
   - 设计理念优先，技术实现为设计服务
   - 生成"设计意图"明确的 HTML 结构

### 阶段二：微信兼容性优化（WeChat Compatibility Phase）

#### 3. 微信兼容性转换

将阶段一生成的 HTML 草案转换为微信兼容格式：

**转换原则：**
- 保持设计理念和视觉一致性
- 技术实现方式调整为微信兼容方案
- 严格遵循 `HTML-CSS-SPEC.md` 规范

#### 微信兼容性优化工作流程：
1. **标签转换与清理**
   - 转换 `<div>` 为 `<section>`（微信公众号不支持 `<div>`）
   - 移除不支持的标签（script, style, header, footer 等）
   - 清理无效属性（class, id, data-* 等）
   - 标准化标签嵌套关系

2. **布局转换（关键步骤）**
   - **Flex 布局转换**：`display: flex` → `table` 布局或 `inline-block`
   - **Grid 布局转换**：`display: grid` → `table` 布局
   - **定位转换**：`position: fixed/absolute` → 移除或使用相对定位
   - **效果转换**：`transform`、`animation`、`transition` → 移除
   - **现代属性转换**：`gap` → `margin` 替代，`grid-template-columns` → `table` 列宽

3. **样式内联化与优化**
   - 确保所有样式以内联方式写在 `style` 属性中
   - 检测并修复不支持的 CSS 属性
   - 标准化单位（% → px, vw/vh → px, em/rem → px）
   - 优化字体回退链：添加系统字体回退

4. **表格兼容性处理**
   - 检测并修复在 `<tr>` 标签上使用的 `background-color`（微信公众号不支持）
   - 将 `tr` 的背景色迁移到对应的 `<th>` 或 `<td>` 单元格
   - 确保表格样式在单元格级别设置
   - 根据 `tableStyle` 参数应用对应的表格样式

5. **代码高亮处理**（当 codeHighlight=true 时）
   - 检测文章中的代码块（`<pre><code>`）
   - 使用 highlight.js 进行语法高亮
   - 将动态生成的 class 样式转换为内联样式
   - 确保代码高亮完全兼容微信公众号（无 class 属性，无外部依赖）

6. **图片与媒体处理**
   - 优化图片尺寸和对齐
   - 确保图片使用 `max-width: 100%` 和 `height: auto`
   - 处理 Unsplash 图片署名格式
   - 移除不支持的媒体元素

7. **最终兼容性检查**
   - 对照 `HTML-CSS-SPEC.md` 逐项检查
   - 确保宽度不超过 677px（公众号内容区宽度）
   - 使用系统默认字体确保兼容性
   - 移除所有 JavaScript 和交互特性
   - 验证代码高亮样式已完全内联化

#### 4. 模板结构应用与智能配图

根据选择的 template 和 images 参数进行最终优化：

- **模板结构应用**：根据模板类型重构文章结构
- **智能配图处理**：如果 `images=auto`，自动搜索并插入相关图片
- **内容组织优化**：智能插入章节分隔，优化内容流
- **最终输出生成**：生成符合微信公众号编辑器规范的 HTML

**HTML 输入的特殊处理：**
- 进行 CSS 内联化，不改变结构
- 应用主题样式并优化排版

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

### 5. 图片处理（智能配图）

AI 自动分析文章内容，智能判断是否适合添加配图，并自动提取主题词搜索合适的图片。

**图片模式说明：**
| 模式 | 说明 |
|------|------|
| auto | AI 智能分析内容，自动判断是否配图（默认）|
| manual | 保留用户 HTML 中原有的图片，不自动添加 |
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

### 6. 生成文件名

根据以下优先级确定输出文件名：
1. 用户指定的 filename 参数
2. 文章标题（转换为拼音或英文，去除特殊字符）
3. 时间戳格式：`article-{YYYYMMDD-HHmmss}`

### 7. 写入文件

使用 Write 工具将生成的 HTML 内容写入 `output/{filename}.html`。

**示例输出路径：**
```
output/my-article.html
output/tech-tutorial-20260415.html
output/article-20260415-143052.html
```

## 主题系统

主题样式定义在 `design-system/references/` 目录下，每个主题都有完整的 DESIGN.md 规范。

### 主题概述

系统提供10个专业设计主题，分为核心主题和扩展主题：

#### 核心主题（4个）
1. **tech（科技风）** - 适合技术教程、代码文章
2. **business（商务风）** - 适合商业分析、行业报告
3. **claude（文艺风）** - 适合深度阅读、文艺内容
4. **minimal（极简风）** - 适合通用文章

#### 扩展主题（6个）
5. **dark-finance（金融暗黑风）** - 适合投资分析、市场报告
6. **standard（标准风）** - 通用标准风格
7. **neo-brutalist（新粗野主义风）** - 适合创意设计、前卫风格
8. **luxury-editorial（奢华编辑风）** - 适合高端品牌、深度特稿
9. **japanese-zen（日式禅意风）** - 适合生活方式、文化内容
10. **vintage-newspaper（复古报纸风）** - 适合历史回顾、传统媒体风格

### 自动选择逻辑

当用户未指定 theme 时，AI 基于内容特征自动匹配主题。详细的主题选择逻辑和设计规范请参考 `design-system/SKILL.md`。

### 设计系统参考

每个主题都有详细的设计规范文件，位于 `design-system/references/` 目录下。完整的设计系统应用指南请参考 `design-system/SKILL.md`。

## 样式转换规则

AI 在转换时必须遵循微信公众号的 HTML/CSS 兼容性规则。所有样式必须内联，不支持 `<style>` 标签和 JavaScript。

### 核心规则

1. **内联样式**：所有 CSS 样式必须以内联方式写在元素的 `style` 属性中
2. **容器标签**：使用 `<section>` 替代 `<div>` 作为主要容器
3. **表格限制**：不支持在 `<tr>` 标签上使用 `background-color`，必须在每个 `<th>` 或 `<td>` 上单独设置
4. **图片处理**：图片需上传至微信服务器或使用可访问的外链
5. **宽度限制**：内容区域建议不超过 677px

### 详细规范

完整的 HTML/CSS 支持规范、样式转换示例和代码模板请参考 `HTML-CSS-SPEC.md` 文件。

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
10. **代码高亮**: 使用 highlight.js 进行语法高亮，所有样式已内联化，确保微信公众号兼容性

## 相关文件

### 核心文档

- `design-system/SKILL.md` - Design System 使用指南（设计系统架构、主题应用流程）
- `HTML-CSS-SPEC.md` - HTML/CSS 技术规范（兼容性规则、样式示例）

### 主题设计规范

所有主题的设计规范文件位于 `design-system/references/` 目录下，每个主题都有对应的 `DESIGN.md` 文件。完整列表请参考 `design-system/SKILL.md`。

### 模板文件

示例模板文件位于 `examples/` 目录下，用于参考和学习。

## 示例用法

### HTML 输入示例

**基本 HTML 优化（标准优化级别）：**
```
优化微信公众号文章，内容为：
<section>
  <h1>文章标题</h1>
  <p>正文内容...</p>
</section>
```

**完整优化（应用模板和主题）：**
```
优化微信公众号文章，主题为 tech，模板为 tutorial，内容为：
<section>
  <h1>文章标题</h1>
  <p>正文内容...</p>
</section>
```

**保留结构优化（仅内联样式）：**
```
优化微信公众号文章，优化级别为 minimal，保留结构为 true，内容为：
<section>
  <h1>文章标题</h1>
  <p>正文内容...</p>
</section>
```

**复杂 HTML 优化（包含表格和代码）：**
```
优化微信公众号文章，主题为 business，内容为：
<section>
  <h1>数据分析报告</h1>
  <table>
    <tr><th>指标</th><th>Q1</th><th>Q2</th></tr>
    <tr><td>收入</td><td>100万</td><td>120万</td></tr>
  </table>
  <pre><code>const data = analyze();</code></pre>
</section>
```
AI 会：1) 修复表格样式，2) 启用代码高亮（默认），3) 应用商务主题样式

**智能配图的 HTML 优化：**
```
优化微信公众号文章，图片模式为 auto，内容为：
<section>
  <h1>React 性能优化指南</h1>
  <p>本文将介绍 React 应用的性能优化技巧...</p>
</section>
```
AI 分析：技术教程文章 → 自动搜索 React 相关配图

**代码高亮优化示例：**
```
优化微信公众号文章，主题为 tech，codeHighlight为 true，内容为：
<section>
  <h1>Python 异步编程示例</h1>
  <pre><code class="language-python">
import asyncio

async def main():
    print('Hello')
    await asyncio.sleep(1)
    print('World')

asyncio.run(main())
  </code></pre>
</section>
```
AI 会：1) 识别 Python 代码，2) 应用语法高亮，3) 将样式内联化，4) 应用科技主题样式

### 高级用法示例

**指定特定主题和模板：**
```
优化微信公众号文章，主题为 dark-finance，模板为 analysis，内容为：
<section>
  <h1>2026年第一季度A股市场分析</h1>
  <p>随着十五五规划的实施，科技板块表现强劲...</p>
</section>
```
AI 会应用金融暗黑风格，使用分析模板结构

**使用扩展主题：**
```
优化微信公众号文章，主题为 japanese-zen，模板为 story，内容为：
<section>
  <h1>茶道中的禅意：一次心灵的旅程</h1>
  <p>在日本京都的古老茶室中，时间仿佛凝固了...</p>
</section>
```
AI 会应用日式禅意风格，使用故事模板结构

**完整参数配置：**
```
优化微信公众号文章，主题为 neo-brutalist，模板为 listicle，图片模式为 auto，imageCount为3，优化级别为full，内容为：
<section>
  <h1>10个颠覆性的设计趋势</h1>
  <ol>
    <li>新粗野主义的回归</li>
    <li>玻璃拟态设计</li>
    <li>超现实主义插画...</li>
  </ol>
</section>
```
AI 会应用新粗野主义风格，使用清单模板，自动添加3张配图，进行完整优化

**复杂内容处理：**
```
优化微信公众号文章，主题为 luxury-editorial，模板为 review，图片模式为 manual，保留原有图片，内容为：
<section>
  <h1>劳力士 Daytona 116500LN 深度评测</h1>
  <img src="https://example.com/rolex.jpg" alt="Rolex Daytona">
  <p>作为腕表界的传奇，Daytona 系列一直备受追捧...</p>
</section>
```
AI 会应用奢华编辑风格，使用评测模板，保留用户原有图片

### 与 markdown-to-html 技能协作示例

**完整工作流程：**
```
1. 首先使用 markdown-to-html 技能将 Markdown 转换为 HTML：
   将 Markdown 转换为 HTML，标题为"Python 异步编程入门"，主题为 tech，内容为：
   # Python 异步编程入门
   
   Python 的 asyncio 模块提供了强大的异步编程能力...

2. 然后使用 wechat-article 技能进行优化：
   优化微信公众号文章，主题为 tech，模板为 tutorial，图片模式为 auto，内容为：
   [将上一步生成的 HTML 内容粘贴到这里]
```

**单次请求完成完整流程：**
```
生成微信公众号文章，完整流程：
1. Markdown 内容：
   # React Hooks 深度解析
   
   React Hooks 是 React 16.8 引入的新特性...

2. 请先使用 markdown-to-html 技能将上述 Markdown 转换为 HTML
3. 然后使用 wechat-article 技能将生成的 HTML 优化为微信公众号格式
4. 主题：tech，模板：tutorial，图片模式：auto
```

## 与 CLI 工具的区别

| 维度 | Skill方式（AI驱动） | CLI方式（程序驱动） |
|------|-------------------|-------------------|
| **输入类型** | HTML 内容 | Markdown 文件或 HTML 文件 |
| **智能程度** | AI分析内容特征，智能选择主题/模板/配图 | 基于规则和参数配置 |
| **灵活性** | 实时调整，支持复杂内容分析和优化 | 固定流程，参数化控制 |
| **配图能力** | 智能搜索Unsplash，自动插入相关图片 | 依赖手动指定或跳过 |
| **使用场景** | 需要AI智能处理、内容增强的场景 | 已有HTML文件，快速批量转换 |

## 相关文件

### 核心文档
- `design-system/SKILL.md` - Design System 使用指南（设计系统架构、主题应用流程）
- `HTML-CSS-SPEC.md` - HTML/CSS 技术规范（兼容性规则、样式示例）

### 主题设计规范
所有主题的设计规范文件位于 `design-system/references/` 目录下，每个主题都有对应的 `DESIGN.md` 文件。完整列表请参考 `design-system/SKILL.md`。

### 模板文件
示例模板文件位于 `examples/` 目录下，用于参考和学习。