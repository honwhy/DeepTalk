---
name: design-system
description: |
  Design System 使用指南 - 微信公众号文章设计系统规范与主题应用指南
  AI 在执行 wechat-article 技能时，根据此指南应用设计系统规范，将 HTML 内容转换为符合特定主题视觉风格的文章。
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
metadata:
  trigger: 应用设计系统规范
  category: design
  version: 1.0.0
---

# Design System 使用指南

微信公众号文章设计系统规范与主题应用指南。

## 与 wechat-article 技能的关系

本设计系统是 `wechat-article` 技能的核心组成部分，为微信公众号文章提供专业级视觉设计规范。当 AI 执行 `wechat-article` 技能时，会根据此指南应用设计系统规范，将 HTML 内容转换为符合特定主题视觉风格的文章。

**文件关系：**
- `wechat-article/SKILL.md` - 技能使用指南（用户视角）
- `design-system/SKILL.md` - 设计系统指南（设计视角）
- `HTML-CSS-SPEC.md` - 技术规范文档（技术视角）

## 概述

本设计系统为微信公众号文章提供专业级视觉设计规范，包含10个精心设计的主题，每个主题都有完整的颜色系统、字体规范、排版规则和视觉特征说明。

## 设计系统架构

### 核心概念

1. **设计理念优先**：设计系统首先定义视觉理念和美学原则，然后提供技术实现方案
2. **主题化设计**：每个主题都有独特的视觉特征和适用场景
3. **微信兼容性**：所有设计规范都考虑微信公众号的技术限制
4. **AI 驱动应用**：AI 智能分析内容特征，自动选择和应用最适合的主题

### 文件结构

```
design-system/
├── SKILL.md (本文件) - Design System 使用指南
├── references/ - 主题设计规范目录
│   ├── tech/DESIGN.md - Tech 主题详细规范（SpaceX 风格）
│   ├── business/DESIGN.md - Business 主题详细规范（IBM Carbon 风格）
│   ├── claude/DESIGN.md - Claude 主题详细规范（Anthropic 风格）
│   ├── minimal/DESIGN.md - Minimal 主题详细规范（Figma 风格）
│   ├── dark-finance/DESIGN.md - Dark Finance 主题详细规范（金融暗黑风格）
│   ├── standard/DESIGN.md - Standard 主题详细规范（通用标准风格）
│   ├── neo-brutalist/DESIGN.md - Neo-Brutalist 主题详细规范（新粗野主义风格）
│   ├── luxury-editorial/DESIGN.md - Luxury Editorial 主题详细规范（奢华编辑风格）
│   ├── japanese-zen/DESIGN.md - Japanese Zen 主题详细规范（日式禅意风格）
│   └── vintage-newspaper/DESIGN.md - Vintage Newspaper 主题详细规范（复古报纸风格）
└── HTML-CSS-SPEC.md - HTML/CSS 技术规范
```

## 主题系统

### 主题概述

系统提供10个专业设计主题，每个主题都有完整的设计系统规范，包含颜色系统、字体规范、间距规则和视觉特征说明。

#### 核心主题（4个）
1. **tech（科技风）** - 基于 SpaceX 设计系统，适合技术教程、代码文章、产品评测
   - **设计理念**：简洁、现代、专业、技术感强
   - **视觉特征**：科技蓝主色调、清晰的信息层次、代码友好的排版

2. **business（商务风）** - 基于 IBM Carbon 设计系统，适合商业分析、行业报告、企业新闻
   - **设计理念**：专业、稳重、数据驱动、商务感强
   - **视觉特征**：商务蓝主色调、严谨的排版、数据可视化友好

3. **claude（文艺风）** - 基于 Claude 设计系统，适合深度阅读、散文随笔、文化评论
   - **设计理念**：温暖、人文、易读、文艺感强
   - **视觉特征**：文艺紫主色调、舒适的阅读体验、人文关怀

4. **minimal（极简风）** - 基于默认设计系统，适合通用文章、新闻简讯
   - **设计理念**：简洁、清晰、无干扰、内容优先
   - **视觉特征**：极简设计、充足的留白、专注内容

#### 扩展主题（6个）
5. **dark-finance（金融暗黑风）** - 适合投资分析、市场报告、财经新闻
   - **设计理念**：专业、数据密集、暗色主题
   - **视觉特征**：暗色背景、高对比度、数据突出

6. **standard（标准风）** - 通用标准风格，适合各类文章
   - **设计理念**：平衡、通用、兼容性强
   - **视觉特征**：中性色调、标准排版、广泛适用

7. **neo-brutalist（新粗野主义风）** - 适合创意设计、艺术内容、前卫风格
   - **设计理念**：原始、直接、反装饰、前卫
   - **视觉特征**：粗犷排版、高对比色彩、非传统布局

8. **luxury-editorial（奢华编辑风）** - 适合高端品牌、深度特稿、奢侈品评测
   - **设计理念**：精致、奢华、细节丰富、高端感
   - **视觉特征**：金色/黑色搭配、精致排版、高品质感

9. **japanese-zen（日式禅意风）** - 适合生活方式、健康养生、文化内容
   - **设计理念**：宁静、和谐、自然、简约
   - **视觉特征**：自然色调、大量留白、平和氛围

10. **vintage-newspaper（复古报纸风）** - 适合历史回顾、怀旧主题、传统媒体风格
    - **设计理念**：怀旧、传统、报纸质感、历史感
    - **视觉特征**：报纸纹理、复古字体、传统排版

### 主题选择逻辑

当用户未指定 theme 时，AI 基于以下内容特征自动匹配：

```
内容分析维度：
├── 关键词匹配（代码、算法、API、编程语言 → tech）
├── 语气分析（数据驱动、专业术语 → business）
├── 情感基调（温暖、人文、叙事 → claude）
├── 金融投资内容（数据分析、市场报告 → dark-finance）
├── 通用内容、新闻简讯 → minimal
├── 无法分类 → standard
└── 其他特殊情况 → 根据内容特征匹配扩展主题
```

#### 扩展主题匹配规则：
- **neo-brutalist**: 创意设计、艺术评论、前卫内容
- **luxury-editorial**: 高端品牌、奢侈品、深度特稿
- **japanese-zen**: 生活方式、健康养生、文化内容
- **vintage-newspaper**: 历史回顾、怀旧主题、传统媒体风格

## 设计系统应用流程

### 阶段一：设计规范应用（Design Phase）

#### 1. 读取 DESIGN.md 设计规范

AI 从 `design-system/references/{theme}/DESIGN.md` 读取完整设计规范：

```bash
# 示例：读取 tech 主题设计规范
read design-system/references/tech/DESIGN.md
```

**提取的关键信息：**
- 颜色系统：主色调、背景色、文字色、强调色
- 字体规范：字体大小、字重、行高、字体回退链
- 间距规则：段落间距、卡片内边距、元素间距
- 视觉层次：标题大小、卡片设计、数据展示方式
- 设计理念：主题的视觉特征和美学原则

#### 2. 应用设计理念优化 HTML

AI 解析 HTML 结构，进行设计规范应用：

**设计规范应用工作流程：**
1. **应用颜色系统**：根据 DESIGN.md 中的颜色规范设置主色调、背景色、文字色
2. **应用字体规范**：设置字体大小、字重、行高，添加字体回退链
3. **应用间距规则**：设置段落间距、卡片内边距、元素间距
4. **应用视觉层次**：设置标题大小、卡片设计、数据展示方式
5. **保持设计意图**：可以使用现代 CSS 特性表达设计理念

#### 3. 生成设计规范的 HTML 草案

输出视觉上符合 DESIGN.md 规范的 HTML：
- 设计理念优先，技术实现为设计服务
- 生成"设计意图"明确的 HTML 结构
- 保持视觉一致性和美学原则

### 阶段二：微信兼容性优化（WeChat Compatibility Phase）

#### 4. 微信兼容性转换

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

## 设计规范文件格式

每个主题的 DESIGN.md 文件包含以下章节：

### 1. 主题概述
- 设计理念和视觉特征
- 适用场景和内容类型
- 设计灵感和参考来源

### 2. 颜色系统
- 主色调（Primary Colors）
- 背景色（Background Colors）
- 文字色（Text Colors）
- 强调色（Accent Colors）
- 状态色（Status Colors）
- 数据可视化色（Data Visualization Colors）

### 3. 字体规范
- 字体大小（Font Sizes）
- 字重（Font Weights）
- 行高（Line Heights）
- 字体回退链（Font Fallback Chains）
- 特殊字符处理

### 4. 间距系统
- 基础间距单位（Base Spacing Unit）
- 段落间距（Paragraph Spacing）
- 元素间距（Element Spacing）
- 卡片内边距（Card Padding）
- 外边距规则（Margin Rules）

### 5. 视觉层次
- 标题层级（Heading Hierarchy）
- 卡片设计（Card Design）
- 数据展示（Data Presentation）
- 引用样式（Blockquote Styles）
- 代码块样式（Code Block Styles）

### 6. 组件规范
- 按钮样式（Button Styles）
- 表格样式（Table Styles）
- 列表样式（List Styles）
- 图片样式（Image Styles）
- 分隔线样式（Divider Styles）

### 7. 微信兼容性说明
- 特殊注意事项
- 已知限制和解决方案
- 最佳实践建议

## AI 执行指南

### 读取设计规范

当需要应用特定主题时，AI 应：

```bash
# 1. 确定主题（从参数或自动分析）
theme="tech"  # 示例：用户指定或AI自动选择

# 2. 读取设计规范文件
read "design-system/references/${theme}/DESIGN.md"

# 3. 解析设计规范内容
# - 提取颜色系统
# - 提取字体规范
# - 提取间距规则
# - 提取视觉层次
```

### 应用设计规范

AI 应将 DESIGN.md 中的设计规范应用到 HTML 内容：

```html
<!-- 输入：原始 HTML -->
<section>
  <h1>文章标题</h1>
  <p>正文内容...</p>
</section>

<!-- AI 处理：应用 tech 主题设计规范 -->
<section style="max-width: 677px; margin: 0 auto; padding: 20px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif; font-size: 16px; line-height: 1.75; color: #1a1a1a; background-color: #ffffff;">
  <h1 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin: 0 0 16px 0; text-align: center; border-bottom: 2px solid #0070f3; padding-bottom: 8px;">文章标题</h1>
  <p style="margin: 0 0 20px 0; color: #333333;">正文内容...</p>
</section>
```

### 微信兼容性转换

应用设计规范后，AI 应进行微信兼容性转换：

```html
<!-- 设计规范应用后（可能包含不兼容的 CSS） -->
<section style="display: flex; flex-direction: column; gap: 16px;">
  <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px;">
    <h2>卡片标题</h2>
    <p>卡片内容...</p>
  </div>
</section>

<!-- 微信兼容性转换后 -->
<section style="margin-bottom: 16px;">
  <section style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
    <h2 style="font-size: 18px; font-weight: 600; margin: 0 0 12px 0; color: #1a1a1a;">卡片标题</h2>
    <p style="margin: 0; color: #333333;">卡片内容...</p>
  </section>
</section>
```

## 主题设计规范示例

### tech 主题（科技风）

**设计理念：**
- 灵感来源：SpaceX、GitHub、科技公司设计系统
- 视觉特征：简洁、现代、专业、技术感强
- 适用场景：技术教程、代码分享、产品评测、科技新闻

**颜色系统：**
- 主色调：`#0070f3`（科技蓝）
- 背景色：`#ffffff`（纯白）、`#fafafa`（浅灰）
- 文字色：`#1a1a1a`（深黑）、`#333333`（正文黑）、`#666666`（辅助灰）
- 强调色：`#0070f3`（链接蓝）、`#e60000`（错误红）、`#00a854`（成功绿）
- 代码高亮色：GitHub 风格的语法高亮

**字体规范：**
- 主要字体：`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`
- 中文字体：`'PingFang SC', 'Microsoft YaHei', sans-serif`
- 字体大小：标题22px，正文16px，小字14px
- 字重：标题700，正文400，强调600
- 行高：1.75（正文），1.5（标题）

### business 主题（商务风）

**设计理念：**
- 灵感来源：IBM Carbon、Microsoft Fluent、企业级设计系统
- 视觉特征：专业、稳重、数据驱动、商务感强
- 适用场景：商业分析、行业报告、市场研究、企业新闻

**颜色系统：**
- 主色调：`#0f62fe`（商务蓝）
- 背景色：`#ffffff`（纯白）、`#f4f4f4`（商务灰）
- 文字色：`#161616`（深灰）、`#393939`（正文灰）、`#6f6f6f`（辅助灰）
- 强调色：`#0f62fe`（商务蓝）、`#da1e28`（警告红）、`#198038`（成功绿）
- 数据可视化色：IBM Carbon 配色方案

**字体规范：**
- 主要字体：`IBM Plex Sans, -apple-system, BlinkMacSystemFont`
- 中文字体：`'Microsoft YaHei', 'PingFang SC', sans-serif`
- 字体大小：标题24px，正文16px，小字14px
- 字重：标题600，正文400，数据700
- 行高：1.625（正文），1.3（标题）

### claude 主题（文艺风）

**设计理念：**
- 灵感来源：Anthropic Claude、Medium、文艺平台
- 视觉特征：温暖、人文、易读、文艺感强
- 适用场景：深度阅读、散文随笔、文化评论、人文内容

**颜色系统：**
- 主色调：`#8a2be2`（文艺紫）
- 背景色：`#fefefe`（暖白）、`#f9f7f7`（米白）
- 文字色：`#2c2c2c`（暖黑）、`#444444`（正文灰）、`#777777`（辅助灰）
- 强调色：`#8a2be2`（文艺紫）、`#ff6b6b`（温暖红）、`#51cf66`（自然绿）
- 氛围色：温暖、柔和的色调

**字体规范：**
- 主要字体：`Georgia, 'Times New Roman', Times, serif`
- 中文字体：`'Source Han Serif SC', 'SimSun', serif`
- 字体大小：标题20px，正文18px，小字15px
- 字重：标题500，正文400，引用300
- 行高：1.8（正文），1.6（标题）

## 最佳实践

### 1. 设计理念优先
- 首先理解 DESIGN.md 中的设计理念和视觉特征
- 确保 HTML 转换后保持主题的视觉一致性
- 设计意图比技术实现更重要

### 2. 渐进增强
- 先应用设计规范，再进行微信兼容性转换
- 保持设计理念，调整技术实现方式
- 确保最终输出既美观又兼容

### 3. 内容适配
- 根据文章内容类型选择最合适的主题
- 技术内容 → tech 主题
- 商业内容 → business 主题
- 人文内容 → claude 主题
- 通用内容 → minimal 或 standard 主题

### 4. 微信兼容性检查
- 对照 HTML-CSS-SPEC.md 逐项检查
- 确保所有样式内联化
- 移除不支持的标签和属性
- 验证代码高亮完全兼容

### 5. 性能优化
- 合并重复的样式规则
- 优化图片尺寸和格式
- 减少不必要的 HTML 嵌套
- 确保最终文件大小合理

## 故障排除

### 常见问题

1. **设计规范无法应用**
   - 检查 DESIGN.md 文件是否存在且格式正确
   - 验证主题名称是否正确
   - 确保 AI 有权限读取文件

2. **微信兼容性问题**
   - 对照 HTML-CSS-SPEC.md 检查不支持的 CSS 属性
   - 确保所有样式已内联化
   - 检查是否有 `<div>` 标签未转换为 `<section>`

3. **视觉不一致**
   - 重新读取 DESIGN.md 设计规范
   - 检查颜色、字体、间距是否按规范设置
   - 确保设计理念得到正确表达

4. **代码高亮问题**
   - 检查 codeHighlight 参数是否为 true
   - 验证 highlight.js 是否正常工作
   - 确保代码高亮样式已完全内联化

### 调试步骤

```bash
# 1. 检查设计规范文件
read "design-system/references/tech/DESIGN.md"

# 2. 检查 HTML-CSS-SPEC.md
read "design-system/HTML-CSS-SPEC.md"

# 3. 验证主题选择逻辑
# - 用户是否指定了 theme 参数？
# - AI 自动分析是否选择了正确的主题？
# - 主题名称是否与目录匹配？

# 4. 检查微信兼容性
# - 是否有不支持的 CSS 属性？
# - 是否有未转换的 <div> 标签？
# - 样式是否全部内联化？
```

## 相关文件

### 设计规范文件
- `design-system/references/tech/DESIGN.md` - Tech 主题详细规范
- `design-system/references/business/DESIGN.md` - Business 主题详细规范
- `design-system/references/claude/DESIGN.md` - Claude 主题详细规范
- `design-system/references/minimal/DESIGN.md` - Minimal 主题详细规范
- `design-system/references/dark-finance/DESIGN.md` - Dark Finance 主题详细规范
- `design-system/references/standard/DESIGN.md` - Standard 主题详细规范
- `design-system/references/neo-brutalist/DESIGN.md` - Neo-Brutalist 主题详细规范
- `design-system/references/luxury-editorial/DESIGN.md` - Luxury Editorial 主题详细规范
- `design-system/references/japanese-zen/DESIGN.md` - Japanese Zen 主题详细规范
- `design-system/references/vintage-newspaper/DESIGN.md` - Vintage Newspaper 主题详细规范

### 技术规范文件
- `HTML-CSS-SPEC.md` - HTML/CSS 技术规范（微信公众号兼容性规则、样式转换示例）

### 技能文件
- `wechat-article/SKILL.md` - WeChat Article 技能主文件（技能使用指南、参数说明、示例用法）

### 文件使用关系
1. **用户使用流程**：从 `wechat-article/SKILL.md` 开始了解技能使用方法
2. **设计规范应用**：参考本文件（`design-system/SKILL.md`）了解设计系统应用
3. **技术实现参考**：参考 `HTML-CSS-SPEC.md` 了解微信兼容性技术细节

## 更新日志

### v1.0.0 (2026-04-19)
- 初始版本创建
- 定义设计系统应用流程
- 提供10个主题的设计规范指南
- 详细说明 AI 执行步骤和最佳实践

---

**注意**：本指南为 AI 提供设计系统应用的具体指导，确保 wechat-article 技能能够正确应用设计规范，生成既美观又兼容的微信公众号文章。