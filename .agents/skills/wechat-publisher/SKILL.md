---
name: wechat-publisher
description: |
  将 HTML 富文本文章发布到微信公众号草稿箱。
  支持多种封面图片获取方式（自动提取/Unsplash 搜索/AI 生成/指定 URL），自动处理封面上传并获取 media_id。
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
metadata:
  trigger: 发布文章到微信公众号草稿箱、上传封面图到微信
  category: wechat
  version: 1.0.0
---

# WeChat Publisher Skill

将 HTML 富文本文章发布到微信公众号草稿箱，自动处理封面图片上传获取 media_id。

## Purpose

将已经生成的微信公众号 HTML 文章发布到草稿箱。微信公众号创建草稿接口要求提供封面图的 `thumb_media_id`，本 Skill 负责：
- 获取或生成封面图片
- 上传图片到微信服务器获取 `media_id`
- 创建草稿并返回草稿 ID

**注意**：HTML 内容中的图片链接保持原样，不需要替换。封面图 `thumb_media_id` 是调用微信草稿接口的必要参数。

## Input

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| html | string | 是 | HTML 格式的文章内容（内联 CSS） |
| title | string | 是 | 文章标题 |
| author | string | 否 | 作者名称 |
| digest | string | 否 | 文章摘要，默认自动生成 |
| thumb_image | string | 否 | 封面图片处理方式：auto \| extract \| unsplash \| generate \| url \| none，默认 auto |
| thumb_url | string | 否 | 当 thumb_image=url 时，指定封面图片 URL |
| thumb_keywords | string | 否 | 封面图搜索/生成关键词，未提供时从标题提取 |
| content_source_url | string | 否 | 原文链接 |
| need_open_comment | number | 否 | 是否打开评论，0=关闭，1=打开，默认 1 |
| only_fans_can_comment | number | 否 | 是否仅粉丝可评论，0=所有人，1=仅粉丝，默认 0 |

## 环境变量

| 变量名 | 必填 | 说明 |
|--------|------|------|
| WECHAT_APP_ID | 是 | 微信公众号 AppID |
| WECHAT_APP_SECRET | 是 | 微信公众号 AppSecret |
| UNSPLASH_ACCESS_KEY | 否 | Unsplash API Access Key，用于搜索配图（thumb_image=unsplash 时必填） |

## Output

返回草稿创建结果：

```json
{
  "success": true,
  "media_id": "草稿ID",
  "title": "文章标题",
  "thumb_media_id": "封面图media_id",
  "thumb_source": "封面图来源：extracted/unsplash/generated/none",
  "message": "草稿创建成功"
}
```

## 执行流程

### 1. 初始化 WeChat API

**环境变量要求：**
- `WECHAT_APP_ID` - 微信公众号 AppID
- `WECHAT_APP_SECRET` - 微信公众号 AppSecret

**前置检查（仅验证存在性，不输出值）：**
```bash
!node -e "console.log('WECHAT_APP_ID: ' + (process.env.WECHAT_APP_ID ? '已设置' : '未设置')); console.log('WECHAT_APP_SECRET: ' + (process.env.WECHAT_APP_SECRET ? '已设置' : '未设置'))"
```

如果环境变量未设置，提示用户配置。

### 2. 获取封面图并上传

根据 `thumb_image` 参数获取封面图片，上传到微信获取 `thumb_media_id`：

#### 模式：auto（默认）

智能选择封面图源：

1. **优先从文章提取**：扫描 HTML 中的 `<img>` 标签，获取第一张图片的 URL
2. **如无图片则搜索**：使用 Unsplash 搜索配图
3. **如 Unsplash 不可用**：使用 AI 生成配图

#### 模式：extract

从文章 HTML 中提取第一张图片作为封面：

**提取规则：**
- 匹配 `<img[^>]+src=["']([^"']+)["']` 正则表达式
- 排除 data URI 格式的图片（`data:image`）
- 返回第一个有效图片 URL

**示例：**
```html
<!-- 会被提取 -->
<img src="https://example.com/image.jpg">

<!-- 会被排除 -->
<img src="data:image/png;base64,xxx">
```

**如果文章中无图片**：
- 返回错误提示用户选择其他模式
- 或降级到 unsplash 模式（如果配置了 UNSPLASH_ACCESS_KEY）

#### 模式：unsplash

从 Unsplash 搜索并下载配图：

**步骤 1：提取关键词**
- 如果提供了 `thumb_keywords`，直接使用
- 否则从标题中提取关键词（去除停用词，保留名词）

**步骤 2：搜索图片**
```
GET https://api.unsplash.com/search/photos
Headers:
  Authorization: Client-ID {UNSPLASH_ACCESS_KEY}
Query Parameters:
  query: {关键词}
  per_page: 5
  orientation: landscape
```

**步骤 3：选择最佳图片**
- 从搜索结果中选择第一张图片
- 记录图片信息（作者、链接等用于署名）

**步骤 4：下载图片**
- 使用 `urls.regular`（1080px 宽度）
- 下载图片二进制数据

**错误处理：**
- 未配置 `UNSPLASH_ACCESS_KEY` → 提示用户配置或切换模式
- 搜索无结果 → 调整关键词重试，或降级到 generate 模式
- 下载失败 → 尝试下一张搜索结果

#### 模式：generate

AI 生成封面配图：

**步骤 1：构建生成提示词**

基于文章标题和关键词构建提示词：

```
主题：{文章标题}
关键词：{thumb_keywords 或从标题提取}
风格：适合微信公众号封面的横版配图，专业、美观、有视觉冲击力
尺寸：900x500 像素
```

**步骤 2：生成图片**
- 使用 `ImageGen` 工具生成图片
- 尺寸：900x500（16:9，适合公众号封面）
- 或 1024x768（4:3，兼容性好）

**步骤 3：读取生成的图片**
- 获取图片文件路径
- 读取图片二进制数据

#### 模式：url

使用用户指定的图片 URL：

**要求：**
- 必须提供 `thumb_url` 参数
- 支持常见图片格式：JPG、PNG、GIF、WebP

**处理流程：**
1. 验证 URL 格式
2. 下载图片
3. 验证图片大小（不超过 2MB）

#### 模式：none

不设置封面图：
- 创建草稿时不传 `thumb_media_id` 参数
- 微信会显示默认无图封面

### 3. 上传封面图到微信

获取到封面图片后，上传到微信素材库：

**调用方法：**
```typescript
import { WeChatAPI } from './src/wechat/api';

const wechatAPI = new WeChatAPI({
  appId: process.env.WECHAT_APP_ID!,
  appSecret: process.env.WECHAT_APP_SECRET!,
});

// 方式1：从 URL 上传
const thumbMediaId = await wechatAPI.uploadImageFromUrl(imageUrl);

// 方式2：从 Buffer 上传（AI 生成或已下载的图片）
const thumbMediaId = await wechatAPI.uploadImage(imageBuffer, filename);
```

**上传流程：**
1. 获取 access_token（自动缓存，2小时有效期）
2. 构造 multipart/form-data 请求
3. 上传图片到微信素材库
4. 返回 `media_id`（永久素材 ID）

**错误处理：**

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 40001 | AppSecret 错误 | 检查 WECHAT_APP_SECRET |
| 40014 | access_token 过期 | 自动重新获取 |
| 45009 | 接口调用超过限制 | 稍后重试 |
| 61004 | 未设置 IP 白名单 | 在微信后台添加服务器 IP |

### 4. 生成文章摘要

如果未提供 `digest`，自动生成摘要：

**生成规则：**
1. 从 HTML 中提取纯文本内容（去除所有标签）
2. 去除多余空白字符
3. 截取前 120 个字符
4. 如果内容被截断，添加省略号「...」

**示例：**
```typescript
// 原始 HTML
<p>React Hooks 是 React 16.8 引入的新特性，它让你在函数组件中使用状态和其他 React 特性...</p>

// 生成摘要
"React Hooks 是 React 16.8 引入的新特性，它让你在函数组件中使用状态和其他 React 特性..."
```

### 5. 创建草稿

调用 `wechat/api.ts` 中的 `createDraft()` 方法：

```typescript
const article = {
  title: title,
  content: html,  // 原始 HTML，不修改图片链接
  thumb_media_id: thumbMediaId,  // 封面图 media_id（可选）
  author: author,
  digest: digest,
  content_source_url: contentSourceUrl,
  need_open_comment: needOpenComment,
  only_fans_can_comment: onlyFansCanComment,
};

const mediaId = await wechatAPI.createDraft(article);
```

**参数说明：**

| 参数 | 必填 | 说明 |
|------|------|------|
| title | 是 | 文章标题，最长 64 字符 |
| content | 是 | 图文消息具体内容，支持 HTML 标签 |
| thumb_media_id | 否 | 封面图片素材 ID |
| author | 否 | 作者，最长 16 字符 |
| digest | 否 | 图文消息摘要，最长 120 字符 |
| content_source_url | 否 | 阅读原文链接 |
| need_open_comment | 否 | 是否打开评论，0/1 |
| only_fans_can_comment | 否 | 是否仅粉丝可评论，0/1 |

### 6. 返回结果

```json
{
  "success": true,
  "media_id": "草稿ID",
  "title": "文章标题",
  "thumb_media_id": "封面图media_id",
  "thumb_source": "extracted",
  "message": "草稿创建成功，可在公众号后台查看"
}
```

## 封面图模式详解

### auto 模式决策树

```
thumb_image=auto
│
├─ 文章中有图片？
│  ├─ 是 → 使用第一张图片（extract 模式）
│  └─ 否 → 继续判断
│
├─ 配置了 UNSPLASH_ACCESS_KEY？
│  ├─ 是 → 从 Unsplash 搜索（unsplash 模式）
│  └─ 否 → 使用 AI 生成（generate 模式）
```

### 各模式适用场景

| 模式 | 适用场景 | 要求 |
|------|----------|------|
| auto | 通用场景，让 AI 自动选择最佳方案 | 无 |
| extract | 文章已有合适配图 | 文章中包含 `<img>` 标签 |
| unsplash | 需要高质量免费配图 | UNSPLASH_ACCESS_KEY |
| generate | 需要定制化、独特的封面图 | 无（使用 AI 生成） |
| url | 已有确定的图片链接 | 提供 thumb_url |
| none | 不需要封面图 | 无 |

## 错误处理

### 微信 API 错误

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| -1 | 系统繁忙 | 稍后重试 |
| 40001 | AppSecret 错误 | 检查 WECHAT_APP_SECRET |
| 40013 | AppID 错误 | 检查 WECHAT_APP_ID |
| 40014 | access_token 过期 | 自动重新获取 |
| 42001 | access_token 超时 | 自动重新获取 |
| 45009 | 接口调用超过限制 | 稍后重试 |
| 45002 | 消息内容超过限制 | 文章内容过长（>20000字） |
| 47001 | 解析 JSON 错误 | 检查 HTML 格式 |
| 50002 | 用户受限 | 检查公众号状态 |
| 61004 | 未设置 IP 白名单 | 在微信后台添加服务器 IP |

### 封面图获取错误

| 场景 | 处理方式 |
|------|----------|
| extract 模式但文章无图片 | 提示用户选择其他模式，或降级到 unsplash/generate |
| unsplash 搜索无结果 | 调整关键词重试，或降级到 generate 模式 |
| unsplash API 错误 | 降级到 generate 模式 |
| AI 生成失败 | 提示用户选择其他模式 |
| 图片下载失败 | 重试 3 次，仍失败则提示用户 |
| 图片过大（>2MB） | 压缩图片后重试 |
| 微信上传失败 | 根据错误码提示用户 |

## 示例用法

### 基础用法（自动选择封面）

```
发布以下文章到微信公众号草稿箱：

标题：深入理解 React Hooks

HTML：
<section style="max-width: 677px; margin: 0 auto; padding: 20px 16px;">
  <h1 style="font-size: 22px; font-weight: bold; text-align: center;">深入理解 React Hooks</h1>
  <img src="https://example.com/react-hooks.jpg" style="max-width: 100%;">
  <p>React Hooks 是 React 16.8 引入的新特性...</p>
</section>
```

AI 会自动：
1. 从 HTML 中提取第一张图片 `https://example.com/react-hooks.jpg`
2. 上传到微信获取 `thumb_media_id`
3. 创建草稿

### 从文章提取封面图

```
发布文章到草稿箱，使用文章中的图片作为封面：

标题：深入理解 React Hooks
thumb_image: extract

HTML：...
```

### 从 Unsplash 搜索封面图

```
发布文章到草稿箱，使用 Unsplash 搜索封面图：

标题：人工智能的未来发展
thumb_image: unsplash
thumb_keywords: artificial intelligence, technology, future

HTML：...
```

### AI 生成封面图

```
发布文章到草稿箱，AI 生成封面图：

标题：探索量子计算的奥秘
thumb_image: generate
thumb_keywords: quantum computing, abstract, technology

HTML：...
```

### 使用指定 URL 作为封面

```
发布文章到草稿箱，使用指定封面图：

标题：每日技术资讯
thumb_image: url
thumb_url: https://my-cdn.com/cover.jpg

HTML：...
```

### 无封面图

```
发布文章到草稿箱，不设置封面图：

标题：每日技术资讯
thumb_image: none

HTML：...
```

## 注意事项

1. **IP 白名单**：必须先在微信公众号后台设置服务器 IP 白名单，否则无法调用 API
2. **封面图尺寸**：建议 900x500 像素（16:9），或 800x600（4:3）
3. **封面图大小**：不超过 2MB
4. **封面图格式**：支持 JPG、PNG、GIF、BMP、WebP
5. **文章长度**：正文内容不超过 20000 字
6. **标题长度**：不超过 64 字符
7. **摘要长度**：不超过 120 字符
8. **草稿数量**：草稿箱无数量限制
9. **media_id 有效期**：永久素材的 media_id 长期有效

## 相关文件

- `src/wechat/api.ts` - 微信 API 客户端
- `.agents/skills/wechat-article/SKILL.md` - 文章生成 Skill
- `.agents/skills/wechat-article/design-system/index.md` - 设计系统规范

## 依赖

- `axios` - HTTP 请求
- `form-data` - 表单数据构造
- `ImageGen` 工具 - AI 生成图片（仅在 generate 模式下使用）
