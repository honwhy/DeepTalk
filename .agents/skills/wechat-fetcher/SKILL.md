---
name: wechat-fetcher
description: |
  抓取微信公众号文章并转换为 Markdown 格式。
  支持模拟微信 iPhone 客户端请求头绕过反爬，自动重试机制，提取标题/作者/发布时间/正文内容。
  支持 CLI 和 Web 界面使用。
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
metadata:
  trigger: 抓取公众号文章、公众号文章转 Markdown、微信文章下载
---

# WeChat Article Fetcher Skill

抓取微信公众号文章并转换为 Markdown 格式，支持 CLI 和 Web 界面使用。

## Purpose

解决微信公众号文章无法直接访问的问题，通过模拟微信客户端请求头绕过反爬机制，提取文章内容保存为可编辑的 Markdown 格式。

## Input

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | string | 是 | 微信公众号文章 URL (mp.weixin.qq.com) |
| output | string | 否 | 输出目录，默认 `./markdowns` |
| html | boolean | 否 | 是否同时保存原始 HTML，默认 `false` |

## Output

- Markdown 文件保存到指定目录
- 文件名格式：`{YYYY-MM-DD}_{文章标题}.md`
- 可选原始 HTML 文件

## 执行流程

当用户请求抓取微信公众号文章时，AI 应执行以下步骤：

### 1. 验证 URL

确保是 mp.weixin.qq.com 域名，否则返回错误提示。

### 2. 发送请求

使用模拟微信 iPhone 客户端的请求头：
```
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.30
Referer: https://mp.weixin.qq.com/
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Upgrade-Insecure-Requests: 1
```

### 3. 处理重定向

自动跟随 301/302 跳转。

### 4. 提取内容

从 HTML 中解析文章信息，按优先级提取：

**标题提取（按优先级）：**
1. `<h1 class="rich_media_title">`
2. `<h1>` 标签
3. `<meta property="og:title">`
4. `<title>` 标签

**内容提取（按优先级）：**
1. `<div id="js_content">`
2. `<div class="rich_media_content">`

**作者提取（按优先级）：**
1. `<a id="js_name">`
2. `<span class="profile_nickname">`
3. `<meta name="author">`

**日期提取（按优先级）：**
1. `<em id="publish_time">`
2. `<span class="publish_time">`
3. `<meta name="publish_time">`

### 5. 格式转换

将 HTML 转换为 Markdown 格式：

| HTML 元素 | Markdown 转换 |
|-----------|---------------|
| `<h1>` - `<h4>` | `#` - `####` |
| `<p>` | 段落 + 空行 |
| `<br>` | `\n` |
| `<strong>`, `<b>` | `**text**` |
| `<em>`, `<i>` | `*text*` |
| `<img>` | `![图片](url)` |
| `<a>` | `[text](url)` |
| `<code>` | `` `code` `` |
| `<pre>` | ``` code block ``` |
| `<ul>`, `<li>` | `- item` |
| `<ol>`, `<li>` | `1. item` |

### 6. 保存文件

写入指定目录，文件名格式：`{YYYY-MM-DD}_{文章标题}.md`。

### 7. 重试机制

- 默认重试 3 次
- 指数退避延迟：1s, 2s, 4s
- 单次请求超时：30 秒

## Error Handling

| 错误场景 | 处理方式 |
|----------|----------|
| URL 格式错误 | 返回错误提示，要求 mp.weixin.qq.com 域名 |
| 文章已删除 | 提示"文章可能已被删除或需要登录" |
| 请求超时 | 自动重试，最多 3 次 |
| 网络错误 | 自动重试，指数退避 |
| 内容提取失败 | 返回具体错误信息 |

## Limitations

- 需要文章是公开可访问的（不需要登录）
- 部分付费或原创保护文章可能无法抓取
- 图片 URL 可能有访问时效限制
- 频繁抓取可能触发微信风控

## Usage

### CLI 方式

```bash
# 基本用法
npm run fetch-wechat -- -u "https://mp.weixin.qq.com/s/xxx"

# 指定输出目录
npm run fetch-wechat -- -u "https://mp.weixin.qq.com/s/xxx" -o ./articles

# 同时保存原始 HTML
npm run fetch-wechat -- -u "https://mp.weixin.qq.com/s/xxx" --html
```

### Web 界面方式

```bash
# 启动 Web 服务
npm run web

# 访问 http://localhost:3000/editor
# 点击"抓取公众号文章"按钮，粘贴链接即可
```

### API 调用方式

```typescript
import {
  fetchWeChatArticle,
  extractArticleTitle,
  extractArticleContent,
  extractAuthor,
  extractPublishDate
} from './utils/fetcher';

// 抓取文章
const html = await fetchWeChatArticle('https://mp.weixin.qq.com/s/xxx');

// 提取信息
const title = extractArticleTitle(html);
const content = extractArticleContent(html);
const author = extractAuthor(html);
const date = extractPublishDate(html);
```

## API Endpoints (Web)

### POST /api/fetch-wechat

抓取微信公众号文章。

**Request Body:**
```json
{
  "url": "https://mp.weixin.qq.com/s/xxx",
  "save": true
}
```

**Response:**
```json
{
  "success": true,
  "title": "文章标题",
  "author": "作者名",
  "publishDate": "2024-01-15T00:00:00.000Z",
  "content": "# 文章标题\n\nMarkdown 内容...",
  "savedFile": "2024-01-15_文章标题.md"
}
```

## 相关文件

- `src/utils/fetcher.ts` - 核心抓取模块
- `src/index.ts` - CLI 命令注册
- `src/web/server.ts` - Web API 和界面

## 示例

### 示例 1：CLI 抓取文章

```bash
$ npm run fetch-wechat -- -u "https://mp.weixin.qq.com/s/kBI_ArHIVAJCRWR4tgET9g"

正在抓取文章...
URL: https://mp.weixin.qq.com/s/kBI_ArHIVAJCRWR4tgET9g

✅ 抓取成功！
📰 标题: 示例文章标题
✍️  作者: 公众号名称
📅 日期: 2024/1/15

📝 Markdown 已保存: ./markdowns/2024-01-15_示例文章标题.md

💡 提示: 使用 --html 参数可同时保存原始HTML文件
```

### 示例 2：代码调用

```typescript
import { fetchWeChatArticle, extractArticleTitle } from './utils/fetcher';

async function main() {
  const url = 'https://mp.weixin.qq.com/s/xxx';

  try {
    const html = await fetchWeChatArticle(url, {
      timeout: 30000,
      retries: 3
    });

    const title = extractArticleTitle(html);
    console.log(`文章标题: ${title}`);
  } catch (error) {
    console.error('抓取失败:', error.message);
  }
}
```

### 示例 3：Web 界面使用

1. 启动服务：`npm run web`
2. 访问 `http://localhost:3000/editor`
3. 点击"抓取公众号文章"按钮
4. 粘贴文章链接，点击"开始抓取"
5. 文章自动加载到编辑器中

## Troubleshooting

### 抓取失败：无法提取文章标题或内容

- 文章可能已被删除
- 文章可能需要登录才能查看
- 检查 URL 是否正确

### 请求超时

- 检查网络连接
- 增加超时时间：`{ timeout: 60000 }`
- 检查微信服务器是否可用

### 内容格式错乱

- 部分特殊 HTML 结构可能转换不完美
- 手动调整生成的 Markdown
- 使用原始 HTML 作为参考

## Changelog

### v1.0.0

- 初始版本
- 支持 CLI 和 Web 界面
- 基础 HTML 转 Markdown 功能
- 自动重试机制
