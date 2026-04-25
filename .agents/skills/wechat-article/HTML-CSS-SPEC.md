# 微信公众号 HTML/CSS 支持规范

本文档详细说明微信公众号编辑器对 HTML 标签和 CSS 样式的支持情况，用于指导微信公众号文章的 HTML 生成。

## 核心原则

> "如果一个 CSS 效果需要 JavaScript 或 `<style>` 标签才能实现，那它在微信里大概率不行。"

微信公众号文章编辑器对 HTML 标签和 CSS 样式有严格的**白名单限制**，只能使用经过微信过滤允许的元素和属性。

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
font-size: 14px;  /* 小号文字：辅助信息、日期等 */
font-size: 15px;  /* 六级标题 h6 */
font-size: 16px;  /* 正文、五级标题 h5 */
font-size: 18px;  /* 四级标题 h4 */
font-size: 20px;  /* 三级标题 h3 */
font-size: 24px;  /* 二级标题 h2 */
font-size: 28px;  /* 强调一级标题 */
font-size: 32px;  /* 主标题 h1（推荐） */
font-size: 36px;  /* 主标题 h1（上限） */

/* 行高 */
line-height: 1.3;   /* 标题（紧凑） */
line-height: 1.5;   /* 小标题 */
line-height: 1.75;  /* 正文（推荐） */
line-height: 2;     /* 宽松 */

/* 间距 */
margin: 16px 0;     /* 段落间距 */
padding: 12px 16px; /* 内边距 */
```

---

## 标题字体大小规范

推荐按以下层级设置标题字体大小，h1 最大为 36px：

### 推荐值（激进方案）

| 标签 | font-size | 行高 | 上下间距 | 场景 |
|------|----------|------|---------|------|
| **h1** | 32-36px | 1.3 | 24px 12px | 主标题 |
| **h2** | 26-28px | 1.35 | 20px 10px | 二级标题 |
| **h3** | 22-24px | 1.4 | 16px 8px | 三级标题 |
| **h4** | 18-20px | 1.45 | 14px 6px | 四级标题 |
| **h5** | 16-17px | 1.5 | 12px 6px | 五级标题 |
| **h6** | 15px | 1.5 | 12px 4px | 六级标题 |
| 正文 | 16px | 1.75 | 16px 0 | 正文段落 |
| 小字 | 14px | 1.5 | 8px 0 | 日期、来源等 |

### 替代值（保守方案）

如果需要更保守的字体大小（兼容性更好）：

| 标签 | font-size |
|------|-----------|
| **h1** | 30px |
| **h2** | 24px |
| **h3** | 20px |
| **h4** | 18px |
| **h5** | 16px |
| **h6** | 15px |
| 正文 | 16px |
| 小字 | 14px |

### 标题样式模板

```html
<!-- h1: 主标题 32-36px -->
<h1 style="
  font-size: 32px;
  font-weight: bold;
  line-height: 1.3;
  color: #333;
  margin: 24px 0 12px;
  text-align: center;
">文章标题</h1>

<!-- h2: 二级标题 26-28px -->
<h2 style="
  font-size: 26px;
  font-weight: bold;
  line-height: 1.35;
  color: #333;
  margin: 20px 0 10px;
">二级标题</h2>

<!-- h3: 三级标题 22-24px -->
<h3 style="
  font-size: 22px;
  font-weight: bold;
  line-height: 1.4;
  color: #333;
  margin: 16px 0 8px;
">三级标题</h3>

<!-- h4: 四级标题 18-20px -->
<h4 style="
  font-size: 18px;
  font-weight: bold;
  line-height: 1.45;
  color: #444;
  margin: 14px 0 6px;
">四级标题</h4>

<!-- h5: 五级标题 16-17px -->
<h5 style="
  font-size: 16px;
  font-weight: bold;
  line-height: 1.5;
  color: #444;
  margin: 12px 0 6px;
">五级标题</h5>

<!-- h6: 六级标题 15px -->
<h6 style="
  font-size: 15px;
  font-weight: bold;
  line-height: 1.5;
  color: #666;
  margin: 12px 0 4px;
">六级标题</h6>

<!-- 正文段落 -->
<p style="
  font-size: 16px;
  line-height: 1.75;
  color: #333;
  margin: 16px 0;
  text-align: justify;
">正文内容</p>

<!-- 小字（日期、来源等） -->
<p style="
  font-size: 14px;
  line-height: 1.5;
  color: #999;
  margin: 8px 0;
  text-align: center;
">2024年1月1日</p>
```


## 注意事项

1. **h1 别超过 36px**，过大可能被微信编辑器过滤或显示异常
2. **避免连续标题**：h1 后紧跟 h2，中间必须有正文段落
3. **移动端适配**：实际显示可能略小 1-2px，属于正常现象
4. **行高随字号递减**：字号越大行高越小，保持呼吸感

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

## 布局替代方案

### Grid 布局 → Table 布局

```html
<!-- 不支持 Grid -->
<div style="display: grid; grid-template-columns: 1fr 1fr;">
  <div>左</div>
  <div>右</div>
</div>

<!-- 替代方案：Table -->
<table style="width: 100%; border: none;">
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

### 表格样式规范

微信公众号中使用表格时，必须添加以下样式以确保兼容性：

```html
<table style="width: 100%; border-collapse: collapse; margin: 16px 0; display: block; overflow-x: auto;">
  <thead>
    <tr>
      <th style="padding: 12px; border: 1px solid #e8e8e8; text-align: left; font-weight: bold; background-color: #f5f5f5; color: #333;">表头</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #e8e8e8; color: #333;">内容</td>
    </tr>
  </tbody>
</table>
```

**表格样式要点：**
| 元素 | 必需样式 | 说明 |
|------|----------|------|
| `<table>` | `display: block; overflow-x: auto` | 防止表格在窄屏设备溢出 |
| `<th>` | `background-color: {主题色}` | 表头背景色与主题保持一致 |
| `<td>` | `color: #333` | 确保文字可读性 |


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
    font-size: 32px;
    font-weight: bold;
    line-height: 1.3;
    color: #333;
    margin: 24px 0 12px 0;
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

## 参考资源

- [微信公众号图文的HTML/CSS 支持概览](https://www.axtonliu.ai/newsletters/ai-2/posts/wechat-article-html-css-support)
- [公众号图文编辑器开发必备技能](https://juejin.cn/post/7368777511953809434)
- [Juice - CSS 内联化工具](https://github.com/Automattic/juice)
- [微信开放文档 - rich-text 组件](https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html)
