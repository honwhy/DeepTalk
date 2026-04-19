# 微信公众号 HTML/CSS 支持规范

本文档详细说明微信公众号编辑器对 HTML 标签和 CSS 样式的支持情况，用于指导微信公众号文章的 HTML 生成。

## 与设计系统的关系

本技术规范是 `wechat-article` 技能和 `design-system` 的技术基础，提供了微信公众号兼容性的详细规则和实现方案。

**文件关系：**
- `wechat-article/SKILL.md` - 技能使用指南（用户视角）
- `design-system/SKILL.md` - 设计系统指南（设计视角）
- `HTML-CSS-SPEC.md` - 技术规范文档（技术视角）

**使用场景：**
1. 当应用设计系统规范时，需要参考本文件确保微信兼容性
2. 当转换现代 CSS 特性时，需要参考"设计规范到微信规范的转换映射"部分
3. 当需要具体样式示例时，参考"样式转换示例"部分

## 核心原则

> "如果一个 CSS 效果需要 JavaScript 或 `<style>` 标签才能实现，那它在微信里大概率不行。"

微信公众号文章编辑器对 HTML 标签和 CSS 样式有严格的**白名单限制**，只能使用经过微信过滤允许的元素和属性。

## 代码高亮支持

`wechat-article` 技能支持代码语法高亮功能，基于 highlight.js 实现，并通过 DOM 处理将动态样式转换为内联样式，确保微信公众号兼容性。

**与技能参数关联：**
- 当 `codeHighlight=true` 时（默认），AI 会自动应用代码高亮
- 当 `codeHighlight=false` 时，跳过代码高亮处理

**工作原理：**
1. 使用 highlight.js 检测代码语言并生成语法高亮
2. 通过 DOM 处理提取 highlight.js 生成的样式规则
3. 将 class 样式转换为内联 style 属性
4. 移除所有 class 属性，确保微信公众号兼容性
5. 支持 JavaScript、Python、Java、C++、HTML、CSS 等多种编程语言

---

## HTML 标签支持

### 支持的标签

| 标签 | 用途 | 备注 |
|------|------|------|
| `<section>` | 内容分区 | **推荐**作为主要容器，替代 `<div>` |
| `<p>` | 段落 | 裸露文本会自动用 `<p>` 包裹 |
| `<span>` | 行内文本 | 用于行内样式 |
| `<strong>` | 加粗 | 语义化加粗 |
| `<em>` | 斜体 | 语义化斜体 |
| `<b>` | 加粗 | 样式加粗 |
| `<i>` | 斜体 | 样式斜体 |
| `<br>` | 换行 | 必须显式使用 |
| `<pre>` | 预格式化 | 代码块容器 |
| `<code>` | 代码 | 行内代码 |
| `<blockquote>` | 引用 | 引用块 |
| `<ul>` | 无序列表 | - |
| `<ol>` | 有序列表 | - |
| `<li>` | 列表项 | 列表项会自动添加 `<section>` 包裹 |
| `<table>` | 表格 | 表格布局替代 Grid |
| `<thead>` | 表头 | - |
| `<tbody>` | 表体 | - |
| `<tr>` | 表格行 | - |
| `<th>` | 表头单元格 | - |
| `<td>` | 表格单元格 | - |
| `<img>` | 图片 | 需上传至微信服务器或使用外链 |
| `<a>` | 链接 | 外部链接会触发安全跳转提示 |
| `<h1>` - `<h6>` | 标题 | 建议使用内联样式覆盖默认样式 |

### 不支持的标签

| 标签 | 说明 |
|------|------|
| `<div>` | **会被移除**，使用 `<section>` 替代 |
| `<script>` | **会被移除**，不支持任何 JavaScript |
| `<style>` | **会被移除**，所有样式必须内联 |
| `<form>` | 表单相关标签被过滤 |
| `<input>` | 输入控件被过滤 |
| `<button>` | 按钮被过滤 |
| `<iframe>` | 嵌入框架被过滤 |
| `<video>` | 需通过公众号后台插入 |
| `<audio>` | 需通过公众号后台插入 |
| `<header>` | HTML5 语义标签不稳定 |
| `<footer>` | HTML5 语义标签不稳定 |
| `<nav>` | HTML5 语义标签不稳定 |
| `<article>` | HTML5 语义标签不稳定 |
| `<aside>` | HTML5 语义标签不稳定 |
| `<main>` | HTML5 语义标签不稳定 |

### 属性支持

| 属性 | 支持情况 |
|------|----------|
| `style` | **必须使用**，所有样式必须内联 |
| `class` | 不支持，会被忽略 |
| `id` | 不支持，会被移除 |
| `data-*` | 不支持，会被移除 |
| 事件属性 (`onclick` 等) | 不支持，会被移除 |
| `href` | 支持（`<a>` 标签） |
| `src` | 支持（`<img>` 标签） |
| `alt` | 支持（`<img>` 标签） |

---

## CSS 属性支持

### 支持的 CSS 属性

以下属性可以通过内联 `style` 属性使用：

#### 文本样式

```css
color: #333333;
font-size: 16px;
font-weight: bold;
font-style: italic;
text-align: center;
text-decoration: underline;
line-height: 1.75;
letter-spacing: 1px;
text-indent: 2em;
```

#### 背景与边框

```css
background-color: #f5f5f5;
border: 1px solid #e8e8e8;
border-radius: 4px;
border-left: 4px solid #35b3ff;
box-shadow: 0 2px 4px rgba(0,0,0,0.1);
```

#### 盒模型

```css
margin: 16px 0;
padding: 12px 16px;
width: 100%;
max-width: 100%;
height: auto;
```

#### 其他

```css
vertical-align: middle;
white-space: pre-wrap;
word-break: break-all;
overflow: hidden;
```

### 不支持的 CSS 属性

| 属性/值 | 说明 |
|---------|------|
| `display: flex` | Flexbox 部分支持，不稳定 |
| `display: grid` | **不支持**，需转换为 table 布局 |
| `position: absolute` | **不支持** |
| `position: fixed` | **不支持** |
| `transform` | **不支持** |
| `animation` | **不支持** |
| `transition` | **不支持** |
| CSS Variables (`--var`) | **不支持** |
| `:hover` 等伪类 | **不支持**，样式内联时无法匹配 |
| `::before` / `::after` | **不支持**，伪元素无法内联 |
| `@media` | **不支持**，媒体查询无效 |
| `@keyframes` | **不支持** |

---

## 单位与数值

### 推荐使用的单位

| 单位 | 推荐程度 | 说明 |
|------|----------|------|
| `px` | **推荐** | 最稳定，优先使用 |
| `em` | 可用 | 相对单位，需注意继承 |
| `rem` | 可用 | 相对根元素 |
| `%` | **慎用** | 表现不稳定，建议替换为 px |
| `vw`/`vh` | 不推荐 | 兼容性差 |

### 推荐数值

```css
/* 字体大小 */
font-size: 14px;  /* 小号文字 */
font-size: 16px;  /* 正文 */
font-size: 18px;  /* 小标题 */
font-size: 20px;  /* 二级标题 */
font-size: 22px;  /* 一级标题 */

/* 行高 */
line-height: 1.5;   /* 紧凑 */
line-height: 1.75;  /* 舒适，推荐正文使用 */
line-height: 2;     /* 宽松 */

/* 间距 */
margin: 16px 0;     /* 段落间距 */
padding: 12px 16px; /* 内边距 */
```

---

## 特殊处理

### 空白字符

微信公众号编辑器会移除标签前的空格字符：

```html
<!-- 错误：缩进会丢失 -->
<pre>    code</pre>

<!-- 正确：使用 &nbsp; 保留缩进 -->
<pre>&nbsp;&nbsp;&nbsp;&nbsp;code</pre>
```

**规则**：
- 连续空白会被强制合并
- 代码块缩进必须使用 `&nbsp;`（`\u00A0`）
- 常规换行符 `\n` 无法生效，必须转换为 `<br>`

### 链接处理

外部超链接会触发微信安全跳转提示：

```html
<!-- 外部链接会显示安全提示 -->
<a href="https://example.com">链接</a>
```

**建议**：
- 重要链接转为文末脚注
- 或提示用户"点击阅读原文"

### 图片处理

```html
<!-- 图片要求 -->
<img src="..." style="max-width: 100%; height: auto; display: block; margin: 0 auto;">
```

**规则**：
- 图片必须上传至微信服务器或使用公众号可访问的 URL
- 外部图片需符合 CORS 要求
- 建议宽度不超过 677px（公众号内容区宽度）

---

## 表格样式限制

### tr 标签样式限制
微信公众号编辑器对 `<tr>` 标签的样式支持有限：

**与 `wechat-article` 技能参数关联：**
- `fixTableStyles=true`（默认）：AI 自动检测并修复 tr 背景色问题
- `tableStyle` 参数：控制表格样式（simple/striped/bordered）

| 属性 | 支持情况 | 替代方案 |
|------|----------|----------|
| `background-color` | **不支持** | 必须给每个 `<th>` 或 `<td>` 单独设置背景色 |
| `border` | 部分支持 | 建议给每个单元格单独设置边框 |
| `height` | 支持 | 可以设置行高 |
| `text-align` | 不支持 | 必须在单元格级别设置 |
| `vertical-align` | 不支持 | 必须在单元格级别设置 |

### 正确的表格样式写法
```html
<!-- 错误：tr 的 background-color 无效 -->
<tr style="background-color: #f5f5f5;">
  <th style="padding: 12px;">表头</th>
</tr>

<!-- 正确：给每个 th 单独设置背景色 -->
<tr>
  <th style="background-color: #f5f5f5; padding: 12px;">表头</th>
</tr>
```

### 表格最佳实践
1. **避免使用 tr 样式**：所有样式都应在单元格级别设置
2. **表头样式**：给每个 `<th>` 单独设置 `background-color` 和 `font-weight`
3. **斑马纹表格**：通过给奇数/偶数行的 `<td>` 设置不同背景色实现
4. **边框处理**：给每个单元格设置边框，而不是给 table 或 tr 设置
5. **复杂表格**：避免使用 `colspan` 和 `rowspan`，微信支持有限
6. **宽度控制**：使用 `width: 100%` 或固定像素值，避免百分比
7. **横向滚动**：为支持宽表格，添加 `display: block; overflow-x: auto;` 实现横向滚动

### 斑马纹表格示例
```html
<table style="width: 100%; border-collapse: collapse; margin: 16px 0; display: block; overflow-x: auto;">
  <thead>
    <tr>
      <th style="background-color: #f5f5f5; padding: 12px; border: 1px solid #e8e8e8; font-weight: bold;">姓名</th>
      <th style="background-color: #f5f5f5; padding: 12px; border: 1px solid #e8e8e8; font-weight: bold;">职位</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #e8e8e8;">张三</td>
      <td style="padding: 12px; border: 1px solid #e8e8e8;">工程师</td>
    </tr>
    <tr>
      <td style="background-color: #f9f9f9; padding: 12px; border: 1px solid #e8e8e8;">李四</td>
      <td style="background-color: #f9f9f9; padding: 12px; border: 1px solid #e8e8e8;">设计师</td>
    </tr>
  </tbody>
</table>
```

---

## 设计规范到微信规范的转换映射

当应用 DESIGN.md 设计规范生成微信公众号文章时，需要将现代 CSS 特性转换为微信兼容格式。以下是常见的转换映射：

### 布局转换映射

| 设计规范特性 | 微信兼容方案 | 示例转换 |
|-------------|-------------|----------|
| **Flex 布局**<br>`display: flex`<br>`justify-content: center`<br>`align-items: center`<br>`flex-direction: column`<br>`gap: 16px` | **Table 布局**<br>`display: table` + `width: 100%`<br>`text-align: center`<br>`vertical-align: middle`<br>嵌套表格或块元素<br>`margin` 替代 `gap` | ```html
<!-- 设计规范：Flex 居中 -->
<div style="display: flex; justify-content: center; align-items: center; gap: 16px;">
  <span>项目1</span>
  <span>项目2</span>
</div>

<!-- 微信兼容：Table 居中 -->
<table style="width: 100%; border: none;">
  <tr>
    <td style="text-align: center; vertical-align: middle;">
      <span style="margin-right: 8px;">项目1</span>
      <span style="margin-left: 8px;">项目2</span>
    </td>
  </tr>
</table>
``` |
| **Grid 布局**<br>`display: grid`<br>`grid-template-columns: 1fr 1fr`<br>`grid-gap: 20px` | **Table 布局**<br>`display: table`<br>`width: 50%` 每列<br>`margin` 和 `padding` 控制间距 | ```html
<!-- 设计规范：Grid 两列 -->
<div style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 20px;">
  <div>左列</div>
  <div>右列</div>
</div>

<!-- 微信兼容：Table 两列 -->
<table style="width: 100%; border-collapse: separate; border-spacing: 20px;">
  <tr>
    <td style="width: 50%;">左列</td>
    <td style="width: 50%;">右列</td>
  </tr>
</table>
``` |
| **定位布局**<br>`position: fixed`<br>`position: absolute`<br>`top/bottom/left/right` | **移除或相对定位**<br>移除 `fixed` 和 `absolute`<br>使用 `position: relative` 或流式布局<br>水印使用普通定位 | ```html
<!-- 设计规范：固定水印 -->
<div style="position: fixed; bottom: 20px; right: 20px;">
  水印
</div>

<!-- 微信兼容：相对定位 -->
<section style="position: relative;">
  <!-- 内容 -->
  <div style="position: relative; bottom: 0; right: 0; text-align: right;">
    水印
  </div>
</section>
``` |

### 视觉效果转换映射

| 设计规范特性 | 微信兼容方案 | 示例转换 |
|-------------|-------------|----------|
| **变换效果**<br>`transform: rotate(-8deg)`<br>`transform: scale(1.1)`<br>`transform: translateX(50px)` | **移除变换效果**<br>使用 CSS 替代方案<br>或移除视觉效果 | ```html
<!-- 设计规范：旋转文字 -->
<span style="transform: rotate(-8deg);">斜体文字</span>

<!-- 微信兼容：移除变换 -->
<span style="font-style: italic;">斜体文字</span>
``` |
| **动画效果**<br>`animation: fadeIn 1s`<br>`@keyframes fadeIn`<br>`transition: all 0.3s` | **移除动画效果**<br>微信不支持 CSS 动画<br>使用静态样式替代 | ```html
<!-- 设计规范：淡入动画 -->
<div style="animation: fadeIn 1s;">内容</div>

<!-- 微信兼容：静态样式 -->
<div style="opacity: 1;">内容</div>
``` |
| **现代 CSS 特性**<br>`gap: 16px` (Flex/Grid)<br>`aspect-ratio: 16/9`<br>`object-fit: cover`<br>`backdrop-filter: blur(10px)` | **传统 CSS 替代**<br>`margin` 和 `padding`<br>固定宽高比计算<br>`width/height` 控制<br>移除模糊效果 | ```html
<!-- 设计规范：间距和宽高比 -->
<div style="display: flex; gap: 16px;">
  <img style="aspect-ratio: 16/9; object-fit: cover;">
</div>

<!-- 微信兼容：传统样式 -->
<table style="width: 100%; border-spacing: 16px;">
  <tr>
    <td>
      <img style="width: 100%; height: 56.25%;">
    </td>
  </tr>
</table>
``` |

### 字体与排版转换映射

| 设计规范特性 | 微信兼容方案 | 示例转换 |
|-------------|-------------|----------|
| **自定义字体**<br>`font-family: 'CustomFont'`<br>`@font-face` 引入 | **系统字体回退**<br>添加系统字体回退链<br>优先使用安全字体 | ```html
<!-- 设计规范：自定义字体 -->
<p style="font-family: 'CustomFont', sans-serif;">文字</p>

<!-- 微信兼容：系统字体 -->
<p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif;">文字</p>
``` |
| **现代字体特性**<br>`font-variation-settings`<br>`font-feature-settings`<br>`text-rendering: optimizeLegibility` | **移除高级特性**<br>使用标准字体属性<br>`font-weight`, `font-style` 等 | ```html
<!-- 设计规范：字体变体 -->
<p style="font-variation-settings: 'wght' 700;">粗体文字</p>

<!-- 微信兼容：标准属性 -->
<p style="font-weight: 700;">粗体文字</p>
``` |

### 容器与卡片转换映射

| 设计规范特性 | 微信兼容方案 | 示例转换 |
|-------------|-------------|----------|
| **Div 容器**<br>`<div class="card">`<br>`<div style="...">` | **Section 容器**<br>`<section style="...">`<br>微信公众号不支持 `<div>` | ```html
<!-- 设计规范：Div 卡片 -->
<div style="background: #f5f5f5; border-radius: 8px; padding: 16px;">
  卡片内容
</div>

<!-- 微信兼容：Section 卡片 -->
<section style="background: #f5f5f5; border-radius: 8px; padding: 16px;">
  卡片内容
</section>
``` |
| **阴影与深度**<br>`box-shadow: 0 4px 20px rgba(0,0,0,0.1)`<br>`filter: drop-shadow(...)` | **颜色对比替代**<br>使用背景色对比创建深度<br>或使用边框模拟阴影 | ```html
<!-- 设计规范：阴影卡片 -->
<div style="box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
  卡片
</div>

<!-- 微信兼容：边框模拟 -->
<section style="border: 1px solid #e0e0e0; border-top: 4px solid #f0f0f0;">
  卡片
</section>
``` |

### 转换原则总结

1. **保持设计理念**：颜色、字体、间距等设计理念保持不变
2. **技术实现调整**：仅调整技术实现方式，不改变视觉效果目标
3. **渐进增强**：先实现核心功能，再考虑视觉效果
4. **兼容性优先**：确保在微信公众号中完美显示

---

## 布局替代方案

### Grid 布局 → Table 布局

```html
<!-- 不支持 Grid -->
<div style="display: grid; grid-template-columns: 1fr 1fr;">
  <div>左</div>
  <div>右</div>
</div>

<!-- 替代方案：Table -->
<table style="width: 100%; border: none; display: block; overflow-x: auto;">
  <tr>
    <td style="width: 50%;">左</td>
    <td style="width: 50%;">右</td>
  </tr>
</table>
```

### Flex 布局 → Inline-block/Table

```html
<!-- 不稳定的 Flex -->
<div style="display: flex; justify-content: center;">
  <span>内容</span>
</div>

<!-- 替代方案 -->
<section style="text-align: center;">
  <span style="display: inline-block;">内容</span>
</section>
```

---

## 样式内联化

### 原则

所有 CSS 样式必须转换为内联样式：

```html
<!-- 错误：style 标签会被过滤 -->
<style>
  .title { color: #333; font-size: 22px; }
</style>
<p class="title">标题</p>

<!-- 正确：内联样式 -->
<p style="color: #333; font-size: 22px;">标题</p>
```

### 工具库

推荐使用 [Juice](https://github.com/Automattic/juice) 库自动将 CSS 规则转换为内联样式：

```javascript
import juice from 'juice';

const html = `
  <style>.title { color: #333; }</style>
  <p class="title">标题</p>
`;

const inlinedHtml = juice(html);
// 输出: <p style="color: #333;">标题</p>
```

---

## 完整示例

```html
<!-- 微信公众号文章 HTML 模板 -->
<section style="
  max-width: 677px;
  margin: 0 auto;
  padding: 20px 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.75;
  color: #333;
">

  <!-- 标题 -->
  <h1 style="
    font-size: 22px;
    font-weight: bold;
    color: #333;
    margin: 0 0 8px 0;
    text-align: center;
  ">文章标题</h1>

  <!-- 作者信息 -->
  <p style="
    font-size: 14px;
    color: #999;
    text-align: center;
    margin: 0 0 24px 0;
  ">作者 | 日期</p>

  <!-- 正文段落 -->
  <p style="margin: 16px 0; text-align: justify;">
    这是正文内容。
  </p>

  <!-- 引用块 -->
  <blockquote style="
    margin: 16px 0;
    padding: 12px 16px;
    border-left: 4px solid #35b3ff;
    background-color: #f8f8f8;
    color: #666;
  ">
    这是引用内容。
  </blockquote>

  <!-- 代码块 -->
  <pre style="
    margin: 16px 0;
    padding: 16px;
    background-color: #282c34;
    color: #abb2bf;
    border-radius: 6px;
    font-family: 'SFMono-Regular', Consolas, monospace;
    font-size: 14px;
    line-height: 1.5;
    overflow-x: auto;
    white-space: pre-wrap;
  "><code>const hello = 'world';</code></pre>

  <!-- 行内代码 -->
  <p style="margin: 16px 0;">
    使用 <code style="
      padding: 2px 6px;
      background-color: #f5f5f5;
      border-radius: 4px;
      font-family: 'SFMono-Regular', Consolas, monospace;
      font-size: 14px;
    ">npm install</code> 安装依赖。
  </p>

  <!-- 图片 -->
  <img src="..." alt="图片描述" style="
    max-width: 100%;
    height: auto;
    display: block;
    margin: 16px auto;
    border-radius: 4px;
  ">

  <!-- 分割线 -->
  <section style="
    border-top: 1px solid #e8e8e8;
    margin: 24px 0;
  "></section>

</section>
```

---

## 样式转换示例

以下是在微信公众号文章中常用的样式示例，所有样式必须内联。

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

### 代码高亮样式（语法高亮）

**JavaScript 代码高亮示例：**
```html
<pre style="margin: 16px 0; padding: 16px; background-color: #282c34; border-radius: 6px; font-family: 'SFMono-Regular', Consolas, monospace; font-size: 14px; line-height: 1.5; overflow-x: auto; white-space: pre-wrap;">
<code style="display: block;">
<span style="color: #e06c75;">const</span> <span style="color: #61afef;">greeting</span> <span style="color: #e06c75;">=</span> <span style="color: #98c379;">'Hello, World!'</span><span style="color: #abb2bf;">;</span>
<span style="color: #e06c75;">console</span><span style="color: #abb2bf;">.</span><span style="color: #61afef;">log</span><span style="color: #abb2bf;">(</span><span style="color: #61afef;">greeting</span><span style="color: #abb2bf;">);</span>
</code>
</pre>
```

**Python 代码高亮示例：**
```html
<pre style="margin: 16px 0; padding: 16px; background-color: #282c34; border-radius: 6px; font-family: 'SFMono-Regular', Consolas, monospace; font-size: 14px; line-height: 1.5; overflow-x: auto; white-space: pre-wrap;">
<code style="display: block;">
<span style="color: #e06c75;">import</span> <span style="color: #61afef;">asyncio</span>

<span style="color: #e06c75;">async</span> <span style="color: #e06c75;">def</span> <span style="color: #61afef;">main</span><span style="color: #abb2bf;">():</span>
    <span style="color: #e06c75;">print</span><span style="color: #abb2bf;">(</span><span style="color: #98c379;">'Hello'</span><span style="color: #abb2bf;">)</span>
    <span style="color: #e06c75;">await</span> <span style="color: #61afef;">asyncio</span><span style="color: #abb2bf;">.</span><span style="color: #61afef;">sleep</span><span style="color: #abb2bf;">(</span><span style="color: #d19a66;">1</span><span style="color: #abb2bf;">)</span>
    <span style="color: #e06c75;">print</span><span style="color: #abb2bf;">(</span><span style="color: #98c379;">'World'</span><span style="color: #abb2bf;">)</span>

<span style="color: #61afef;">asyncio</span><span style="color: #abb2bf;">.</span><span style="color: #61afef;">run</span><span style="color: #abb2bf;">(</span><span style="color: #61afef;">main</span><span style="color: #abb2bf;">())</span>
</code>
</pre>
```

**HTML 代码高亮示例：**
```html
<pre style="margin: 16px 0; padding: 16px; background-color: #282c34; border-radius: 6px; font-family: 'SFMono-Regular', Consolas, monospace; font-size: 14px; line-height: 1.5; overflow-x: auto; white-space: pre-wrap;">
<code style="display: block;">
<span style="color: #e06c75;">&lt;</span><span style="color: #e06c75;">div</span> <span style="color: #d19a66;">class</span><span style="color: #abb2bf;">=</span><span style="color: #98c379;">"container"</span><span style="color: #e06c75;">&gt;</span>
  <span style="color: #e06c75;">&lt;</span><span style="color: #e06c75;">h1</span><span style="color: #e06c75;">&gt;</span>标题<span style="color: #e06c75;">&lt;/</span><span style="color: #e06c75;">h1</span><span style="color: #e06c75;">&gt;</span>
  <span style="color: #e06c75;">&lt;</span><span style="color: #e06c75;">p</span><span style="color: #e06c75;">&gt;</span>内容<span style="color: #e06c75;">&lt;/</span><span style="color: #e06c75;">p</span><span style="color: #e06c75;">&gt;</span>
<span style="color: #e06c75;">&lt;/</span><span style="color: #e06c75;">div</span><span style="color: #e06c75;">&gt;</span>
</code>
</pre>
```

**代码高亮颜色系统：**
- `#e06c75` - 关键字、标签名（红色）
- `#61afef` - 函数名、属性名（蓝色）
- `#98c379` - 字符串、文本内容（绿色）
- `#d19a66` - 数字、常量（橙色）
- `#abb2bf` - 标点符号、运算符（灰色）
- `#c678dd` - 特殊关键字（紫色）
- `#56b6c2` - 类型注解（青色）

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
<table style="width: 100%; border-collapse: collapse; margin: 16px 0; display: block; overflow-x: auto;">
  <thead>
    <tr>
      <!-- 注意：微信公众号不支持 tr 的 background-color，必须在 th 上单独设置 -->
      <th style="background-color: #f5f5f5; padding: 12px; border: 1px solid #e8e8e8; text-align: left; font-weight: bold;">表头</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #e8e8e8;">内容</td>
    </tr>
  </tbody>
</table>
```

**斑马纹表格示例：**
```html
<table style="width: 100%; border-collapse: collapse; margin: 16px 0; display: block; overflow-x: auto;">
  <thead>
    <tr>
      <th style="background-color: #f5f5f5; padding: 12px; border: 1px solid #e8e8e8; font-weight: bold;">姓名</th>
      <th style="background-color: #f5f5f5; padding: 12px; border: 1px solid #e8e8e8; font-weight: bold;">职位</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #e8e8e8;">张三</td>
      <td style="padding: 12px; border: 1px solid #e8e8e8;">工程师</td>
    </tr>
    <tr>
      <td style="background-color: #f9f9f9; padding: 12px; border: 1px solid #e8e8e8;">李四</td>
      <td style="background-color: #f9f9f9; padding: 12px; border: 1px solid #e8e8e8;">设计师</td>
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

## 相关文件

### 设计系统文档
- `design-system/SKILL.md` - 设计系统使用指南（主题选择、设计规范应用）
- `wechat-article/SKILL.md` - 技能使用指南（参数说明、示例用法）

### 外部参考资源
- [微信公众号图文的HTML/CSS 支持概览](https://www.axtonliu.ai/newsletters/ai-2/posts/wechat-article-html-css-support)
- [公众号图文编辑器开发必备技能](https://juejin.cn/post/7368777511953809434)
- [Juice - CSS 内联化工具](https://github.com/Automattic/juice)
