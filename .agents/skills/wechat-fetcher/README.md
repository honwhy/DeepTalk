# WeChat Article Fetcher

微信公众号文章抓取工具 - 将公众号文章转换为 Markdown 格式。

## 快速开始

### CLI 使用

```bash
# 抓取单篇文章
npm run fetch-wechat -- -u "https://mp.weixin.qq.com/s/xxx"

# 指定输出目录
npm run fetch-wechat -- -u "https://mp.weixin.qq.com/s/xxx" -o ./articles

# 同时保存原始 HTML
npm run fetch-wechat -- -u "https://mp.weixin.qq.com/s/xxx" --html
```

### Web 界面使用

```bash
npm run web
# 访问 http://localhost:3000/editor
# 点击"抓取公众号文章"按钮
```

### 代码中使用

```typescript
import { fetchWeChatArticle, extractArticleTitle } from './utils/fetcher';

const html = await fetchWeChatArticle('https://mp.weixin.qq.com/s/xxx');
const title = extractArticleTitle(html);
```

## 工作原理

1. **模拟微信客户端**：使用 iPhone 微信浏览器的 User-Agent 和请求头
2. **智能重试**：失败时自动重试，最多 3 次，指数退避
3. **内容提取**：从 HTML 中解析标题、作者、日期、正文
4. **格式转换**：将 HTML 转换为干净的 Markdown 格式

## 文件结构

```
.agents/skills/wechat-fetcher/
├── SKILL.md              # 详细文档
├── README.md             # 快速入门
├── config.json           # Skill 配置
└── examples/
    └── basic-usage.ts    # 使用示例
```

## 技术细节

### 请求头

```
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)...
Referer: https://mp.weixin.qq.com/
Accept: text/html,application/xhtml+xml
```

### 提取规则

- **标题**: `rich_media_title` → `h1` → `og:title` → `title`
- **内容**: `js_content` → `rich_media_content`
- **作者**: `js_name` → `profile_nickname` → `meta author`
- **日期**: `publish_time` → `meta publish_time`

## 限制

- 仅支持公开可访问的文章
- 付费/原创保护文章可能无法抓取
- 图片 URL 可能有访问时效
- 请合理使用，避免频繁请求

## 相关文件

- `src/utils/fetcher.ts` - 核心实现
- `src/index.ts` - CLI 命令
- `src/web/server.ts` - Web API

## License

MIT
