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
| theme | string | 否 | 主题：tech \| business \| claude \| minimal，默认 tech |

## Output

内联样式的 HTML 内容，可直接复制到公众号编辑器。

## 执行流程

当用户请求生成微信公众号文章时，**AI 直接执行以下步骤**：

### 1. 解析 Markdown

AI 自行解析 Markdown 语法，识别以下元素：
- 标题（H1-H6）
- 段落
- 引用块
- 代码块和行内代码
- 列表（有序/无序）
- 表格
- 图片
- 链接

### 2. 应用 Design System 样式

根据选择的 theme，从 design-system 获取对应的设计规范，生成带有内联样式的 HTML。**不调用任何脚本或工具**，由 AI 完成全部转换。

### 3. 图片处理（可选）

如需自动获取配图，参考 design-system 中定义的图片处理规范。

### 4. 输出 HTML

直接输出完整的 HTML 内容，无需用户执行额外命令。

## 主题系统

主题样式定义在 `design-system/references/` 目录下，每个主题都有完整的 DESIGN.md 规范。

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

```html
<img src="图片URL" alt="描述" style="max-width: 100%; height: auto; display: block; margin: 16px auto; border-radius: 4px;">
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

## 相关文件

- `design-system/SKILL.md` - Design System 使用指南
- `design-system/references/tech/DESIGN.md` - Tech 主题详细规范
- `design-system/references/business/DESIGN.md` - Business 主题详细规范
- `design-system/references/claude/DESIGN.md` - Claude 主题详细规范
- `HTML-CSS-SPEC.md` - HTML/CSS 技术规范
