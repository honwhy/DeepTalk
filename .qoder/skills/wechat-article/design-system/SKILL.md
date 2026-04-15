# Article Styling Skill

为微信公众号文章提供排版美化服务，将内容转换为具有特定视觉风格的 HTML 格式。

## Purpose

根据用户选择的设计模板，将 Markdown 或纯文本内容转换为美观的、符合微信公众号要求的 HTML 格式。支持多种设计风格，用户可在 `references/` 目录下添加自定义模板。

## Input

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | Markdown 或纯文本格式的文章内容 |
| template | string | 否 | 设计模板名称，默认 `default` |
| title | string | 否 | 文章标题 |
| author | string | 否 | 作者名称 |
| customColors | object | 否 | 自定义颜色配置，覆盖模板默认值 |

### template 可选值

| 模板 | 说明 |
|------|------|
| `default` | DeepTalk 默认风格，适合技术文章 |
| `claude` | Claude 风格，温暖文艺，适合深度阅读 |
| `tech` | 科技风格，蓝色主调 |
| `business` | 商务风格，稳重大气 |
| `minimal` | 极简风格，黑白灰 |

### customColors 示例

```json
{
  "primary": "#35b3ff",
  "text": "#333333",
  "background": "#ffffff",
  "accent": "#667eea"
}
```

## Output

内联样式的 HTML 内容，可直接复制到微信公众号编辑器使用。

## Templates

模板存放在 `references/` 目录，每个模板为一个子目录：

```
references/
├── claude/         # Claude 风格模板
│   └── DESIGN.md
├── tech/           # 科技风格（待添加）
├── business/       # 商务风格（待添加）
└── custom/         # 用户自定义模板
```

### 添加自定义模板

1. 在 `references/` 下创建新目录，如 `references/my-style/`
2. 创建 `DESIGN.md` 文件，定义设计规范
3. 在 SKILL.md 的 template 可选值中添加模板名称

### DESIGN.md 格式

```markdown
# 模板名称

## 视觉风格
描述整体设计风格和氛围...

## 颜色系统
| 名称 | 色值 | 用途 |
|------|------|------|
| Primary | #xxx | 主色调 |
| Text | #xxx | 文字颜色 |
...

## 字体规范
| 元素 | 字体 | 大小 | 行高 |
|------|------|------|------|
| 标题 | xxx | 22px | 1.3 |
...

## 组件样式
### 标题
### 正文
### 引用
### 代码块
...

## 完整示例
HTML 示例代码...
```

## Default Styles

以下为 `default` 模板的设计规范。

### 颜色系统

| 名称 | 色值 | 用途 |
|------|------|------|
| Primary | `#667eea` | 主色调，按钮、链接、强调 |
| Accent | `#35b3ff` | 强调色，公众号主题 |
| Text Primary | `#333333` | 主要文字 |
| Text Secondary | `#666666` | 次要文字 |
| Text Light | `#888888` | 轻量文字 |
| Border | `#e8e8e8` | 边框、分割线 |
| Background | `#f5f7fa` | 背景色 |

### 字体规范

```css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;
--font-mono: "Fira Code", "SF Mono", Consolas, monospace;
```

| 元素 | 大小 | 行高 | 字重 |
|------|------|------|------|
| H1 | 22px | 1.3 | 700 |
| H2 | 20px | 1.4 | 700 |
| H3 | 18px | 1.4 | 700 |
| H4 | 16px | 1.5 | 700 |
| Body | 16px | 1.75 | 400 |
| Small | 14px | 1.6 | 400 |

### 间距规范

| 元素 | 上边距 | 下边距 |
|------|--------|--------|
| 标题 | 20px | 16px |
| 段落 | 12px | 12px |
| 引用 | 12px | 12px |
| 代码块 | 12px | 12px |
| 图片 | 12px | 12px |

### 组件样式

#### 标题
```html
<h1 style="font-size: 22px; font-weight: bold; color: #333; margin: 20px 0 16px;">标题</h1>
```

#### 正文段落
```html
<p style="font-size: 16px; line-height: 1.75; color: #333; margin: 12px 0; text-align: justify;">正文内容</p>
```

#### 引用块
```html
<blockquote style="margin: 12px 0; padding: 12px 16px; border-left: 4px solid #35b3ff; background-color: #f8f8f8; color: #666;">
  引用内容
</blockquote>
```

#### 代码块
```html
<pre style="margin: 12px 0; padding: 16px; background: #282c34; color: #abb2bf; border-radius: 6px; font-family: monospace; font-size: 14px; overflow-x: auto;"><code>const code = 'example';</code></pre>
```

#### 行内代码
```html
<code style="padding: 2px 6px; background: #f5f5f5; border-radius: 4px; font-family: monospace; font-size: 14px;">code</code>
```

#### 图片
```html
<img src="..." style="max-width: 100%; height: auto; display: block; margin: 12px auto; border-radius: 4px;">
```

## Important Notes

1. **内联样式**: 所有样式必须内联，公众号不支持 `<style>` 标签
2. **HTML 规范**: 遵循 `wechat-article` skill 定义的 HTML/CSS 支持规范
3. **模板优先级**: customColors > 模板默认值 > 系统默认值
4. **扩展性**: 在 `references/` 目录添加新的 DESIGN.md 即可扩展模板

## Related Files

- `references/claude/DESIGN.md` - Claude 风格设计规范
- `.qoder/skills/wechat-article/SKILL.md` - 微信公众号 HTML/CSS 规范
