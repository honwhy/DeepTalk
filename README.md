<p align="center">
  <img src="public/logo.svg" alt="DeepTalk Logo" width="120" height="120">
</p>

<h1 align="center">DeepTalk 深言</h1>

<p align="center">Markdown 转 HTML 工具 + 微信公众号文章生成与发布系统</p>

支持与 qoder CLI、opencode、claude、codex、gemini 等 AI CLI 工具配合使用。

## 功能特性

### 1. Markdown 编辑与管理
- Web 界面编辑器 (`/editor`) 支持创建、编辑、保存 Markdown 文件
- 文件自动保存到 `markdowns/` 目录
- 支持 Ctrl+S 快捷键保存
- 文件列表侧边栏，快速切换编辑
- 支持直接抓取微信公众号文章到编辑器

### 2. Markdown 转 HTML
- 命令行一键转换，支持多种主题
- 代码高亮、响应式设计
- 实时预览

### 3. 公众号格式渲染
- 内联 CSS 样式（公众号兼容）
- 三种主题：科技风、商务风、简约风
- 可直接复制到公众号编辑器

### 4. 公众号 API 发布
- 一键发布到草稿箱
- 支持封面图片上传
- 草稿管理功能

### 5. 微信公众号文章抓取
- 通过 URL 抓取公众号文章
- 自动转换为 Markdown 格式
- 提取标题、作者、发布日期等信息
- 支持 CLI 和 Web 界面两种方式

### 6. 大模型文章生成
- 通过 OpenAI/DeepSeek 生成专业文章
- 支持技术、AI、投资三大领域

## 快速开始

### 安装

```bash
npm install
```

### 配置

```bash
cp .env.example .env
# 编辑 .env，配置必要的 API Key
```

### 基础使用

```bash
# Markdown 转 HTML
npm run md2html -- -i article.md

# 转换为公众号格式
npm run wechat -- -i article.md --copy

# 预览
npm run preview-md -- -i article.md
```

### 发布到公众号

```bash
# 发布到草稿箱
npm run publish -- -i article.md --title "文章标题"

# 查看草稿列表
npm run drafts
```

### 抓取公众号文章

```bash
# 抓取文章并保存为 Markdown
npm run fetch-wechat -- -u "https://mp.weixin.qq.com/s/xxx"

# 指定输出目录
npm run fetch-wechat -- -u "https://mp.weixin.qq.com/s/xxx" -o ./markdowns

# 同时保存原始 HTML
npm run fetch-wechat -- -u "https://mp.weixin.qq.com/s/xxx" --html
```

## 命令详解

### md2html - Markdown 转 HTML

```bash
npm run md2html -- [options]
  -i, --input <file>     Markdown 文件路径
  -o, --output <dir>     输出目录
  -t, --theme <theme>    主题：tech|minimal|business
  --open                 转换后自动打开浏览器
```

### wechat - 公众号格式转换

```bash
npm run wechat -- [options]
  -i, --input <file>     Markdown 文件路径
  -o, --output <file>    输出文件路径
  -t, --theme <theme>    主题：tech|business|minimal
  --title <title>        文章标题
  --author <author>      作者名称
  --copy                 生成可复制片段（无 HTML/HEAD 标签）
  --open                 自动打开浏览器
```

### publish - 发布到公众号

```bash
npm run publish -- [options]
  -i, --input <file>     Markdown 或 HTML 文件路径
  --title <title>        文章标题
  --author <author>      作者名称
  --digest <digest>      摘要
  --thumb <file>         封面图片路径
  --theme <theme>        主题
  --publish              直接发布（不保存为草稿）
```

### drafts - 草稿管理

```bash
npm run drafts -- [options]
  --offset <offset>      偏移量
  --count <count>        数量
```

### generate - 大模型文章生成

```bash
npm run generate -- [options]
  -t, --topic <topic>     主题（必需）
  -c, --category <cat>    领域：tech|ai|invest
  --contents              保存到 contents 目录
```

**示例：**
```bash
# 生成技术文章
npm run generate -- -t "React Hooks 最佳实践" -c tech

# 生成 AI 领域文章并保存到 contents
npm run generate -- -t "大模型推理优化" -c ai --contents
```

### fetch-wechat - 抓取公众号文章

```bash
npm run fetch-wechat -- [options]
  -u, --url <url>        文章URL (必需)
  -o, --output <dir>     输出目录 (默认: ./markdowns)
  --html                 同时保存原始HTML
```

### preview-md - Markdown 预览

```bash
npm run preview-md -- [options]
  -i, --input <file>     Markdown 文件路径
  -t, --theme <theme>    主题
  -p, --port <port>      端口号
```

### preview-html - HTML 预览

```bash
npm run preview-html -- [options]
  -i, --input <dir>      HTML 文件目录 (默认: ./contents)
  -p, --port <port>      端口号
```

### web - Web 管理界面

```bash
npm run web -- [options]
  -p, --port <port>      端口号
  -d, --dir <dir>        内容目录
```

**Web 界面功能：**
- `/` - 文章列表页，展示 contents/ 目录下的所有文件，支持复制公众号格式
- `/editor` - Markdown 编辑器，支持：
  - 创建、编辑、保存 Markdown 文件到 `markdowns/` 目录
  - 侧边栏文件列表，点击切换编辑
  - 实时 HTML 预览（支持主题切换）
  - Ctrl+S 快捷键保存
  - 下载为 HTML 文件
  - 抓取微信公众号文章（直接粘贴 URL）

## 开发命令

```bash
# 开发模式（直接运行 TypeScript）
npm run dev -- [command]

# 构建项目
npm run build

# 代码检查
npm run lint
```

## 主题说明

| 主题 | 说明 | 适用场景 |
|------|------|----------|
| tech | 科技风，蓝色主色调 | 技术博客、代码教程 |
| business | 商务风，深蓝主色调 | 商业分析、行业报告 |
| minimal | 简约风，黑白灰配色 | 通用文章、公众号 |

> **获取更多主题**：访问 [https://getdesign.md/](https://getdesign.md/) 可下载更多精美主题，将主题文件放置到 `.agents/skills/wechat-article/design-system/references/` 目录下即可使用。

## Skills

本项目提供 5 个 Skills，用于与 AI CLI 工具协作：

### wechat-article

生成符合微信公众号格式的 HTML 文章。

**功能：**
- Markdown 转 HTML（内联 CSS）
- 智能主题选择（tech / business / claude / minimal）
- 智能配图（Unsplash API）
- 多种文章模板（tutorial / analysis / news / story / listicle / review）

**用法示例：**
```
生成微信公众号文章，主题为 tech，内容如下：
# React Hooks 入门指南
...
```

### wechat-fetcher

抓取微信公众号文章并转换为 Markdown 格式。

**功能：**
- 模拟微信客户端请求头绕过反爬
- 自动重试机制（指数退避）
- 提取标题、作者、发布时间
- HTML 转 Markdown

### wechat-publisher

将 HTML 文章发布到微信公众号草稿箱。

**功能：**
- 自动处理封面图片上传
- 多种封面图模式（extract / unsplash / generate / url / none）
- 获取 media_id 并创建草稿

**用法示例：**
```
发布以下文章到微信公众号草稿箱：
标题：深入理解 React Hooks
HTML：<section>...</section>
```

### humanizer-zh

去除文本中的 AI 生成痕迹，使文章更自然。

**功能：**
- 检测并修复 AI 写作模式
- 处理过度强调意义、宣传性语言、三段式法则等
- 注入个性化表达

**用法示例：**
```
使用 humanizer-zh 处理以下文本，去除 AI 痕迹：
...
```

### cloudinary-image-host

将本地图片上传到 Cloudinary，获取永久 HTTP 链接，用于替换文章中的本地图片引用。

**功能：**
- 支持单张图片、文章提取、目录扫描三种模式
- 自动替换 Markdown/HTML 中的本地图片引用为 Cloudinary 链接
- 图片优化和压缩
- 配额管理和错误处理

**用法示例：**
```
# 上传单张图片
使用 cloudinary-image-host 技能 --image "./contents/images/ev-battery.png"

# 从文章提取并替换图片
使用 cloudinary-image-host 技能 --article "./markdowns/春节后新能源汽车观察.md" --replace

# 扫描目录批量上传
使用 cloudinary-image-host 技能 --directory "./contents/images/" --max-uploads 5
```

## 环境变量

```env
# LLM API（文章生成）
OPENAI_API_KEY=your-key
# 或
DEEPSEEK_API_KEY=your-key

# 微信公众号（发布功能）
WECHAT_APP_ID=wx...
WECHAT_APP_SECRET=...

# Unsplash 图片服务（预留功能）
# 获取：https://unsplash.com/developers
# 限制：免费版 50次/小时，5000次/天
UNSPLASH_ACCESS_KEY=your-key

# Cloudinary 图片托管（cloudinary-image-host 技能）
# 获取：https://cloudinary.com
# 限制：免费版每月 25 credits（约 25000 次转换或 25000 MB 存储/带宽）
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 公众号 API 说明

### 前置条件
1. 拥有微信公众号（订阅号或服务号）
2. 在后台获取 AppID 和 AppSecret
3. 将服务器 IP 添加到白名单

### 发布限制
- 订阅号：每天可群发 1 次
- 服务号：每月可群发 4 次
- 草稿箱：无限制

## 项目结构

```
DeepTalk/
├── src/
│   ├── index.ts           # CLI 入口
│   ├── skills/            # 渲染器
│   │   ├── htmlGenerator.ts
│   │   └── wechatRenderer.ts
│   ├── wechat/            # 公众号 API
│   │   └── api.ts
│   ├── web/               # Web 服务
│   │   └── server.ts      # Express 服务器
│   ├── utils/             # 工具函数
│   │   └── fetcher.ts     # 公众号文章抓取
│   └── ...
├── .agents/skills/         # Skills 定义
│   ├── wechat-article/    # 公众号文章生成
│   ├── wechat-fetcher/    # 公众号文章抓取
│   ├── wechat-publisher/  # 公众号文章发布
│   ├── humanizer-zh/      # AI 痕迹去除
│   └── cloudinary-image-host/ # Cloudinary 图片托管
├── contents/              # HTML 内容存储
├── output/                # LLM 生成输出目录
└── markdowns/             # Markdown 源文件目录（可通过 /editor 编辑）
```

## 技术栈

- TypeScript
- Commander.js (CLI)
- Express (Web 服务)
- Marked (Markdown 解析)
- Juice (CSS 内联化)
- Axios (HTTP 客户端)

## 文章示例

使用 DeepTalk 生成的文章示例：

| 文章 | 描述 |
|------|------|
| [阿里巴巴"半条命"论](https://mp.weixin.qq.com/s/kBI_ArHIVAJCRWR4tgET9g) | 看空机会是否存在？一份严谨的基本面分析 |
| [群核科技明日上市：暗盘暴涨157%只是开始？](https://mp.weixin.qq.com/s/uvByLpCeAhBmdVP50UtLvg) | 暗盘涨157%、市值破340亿，群核科技明天正式挂牌大概率继续冲高。|

## 相关资源

- [微信公众号开发文档](https://developers.weixin.qq.com/doc/offiaccount/)
- [doocs/md](https://github.com/doocs/md) - 公众号 Markdown 编辑器参考
- [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) - 设计系统参考

## 支持作者

如果这个项目对你有帮助，欢迎请我喝杯咖啡 ☕

<p align="center">
  <img src="public/wechat-donate.jpg" alt="微信支付" width="300">
</p>

## License

ISC
