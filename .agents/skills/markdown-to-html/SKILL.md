---
name: markdown-to-html
description: |
  将 Markdown 转换为基础 HTML 结构，专注于内容转换而非样式设计。
  对接 AI 大语言模型生成的 Markdown 内容，输出干净的 HTML。
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
metadata:
  trigger: 将 Markdown 转换为基础 HTML
  category: conversion
  version: 1.0.0
---

# Markdown to HTML Converter

## Purpose

将 AI 大语言模型生成的 Markdown 内容转换为基础 HTML 结构，为后续的样式优化和平台适配做准备。

## Features

- 轻量级 Markdown 解析（使用 marked 库）
- 基础 HTML 结构生成
- 代码高亮支持（使用 highlight.js）
- 多种主题支持（tech/minimal/business）
- 干净的输出，无复杂样式

## Input

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | Markdown 格式的内容 |
| title | string | 否 | 文章标题 |
| author | string | 否 | 作者名称 |
| theme | string | 否 | 主题：tech | minimal | business，默认 tech |
| outputDir | string | 否 | 输出目录，默认 `./output` |

## Output

- 标准 HTML 文件
- 包含完整的 HTML 文档结构
- 应用基础样式确保可读性
- 不包含平台特定的兼容性处理

## 执行流程

当用户请求将 Markdown 转换为 HTML 时，AI 执行以下步骤：

### 1. 解析 Markdown 内容

使用 marked 库解析 Markdown 内容，识别以下元素：
- 标题（H1-H6）
- 段落
- 引用块
- 代码块和行内代码
- 列表（有序/无序）
- 表格
- 图片
- 链接

### 2. 应用基础样式

根据选择的主题应用基础样式：

**Tech 主题（默认）：**
- 主色调：#35b3ff（科技蓝）
- 代码背景：#f6f8fa
- 字体：系统默认字体

**Minimal 主题：**
- 主色调：#333333
- 代码背景：#f8f8f8
- 极简视觉风格

**Business 主题：**
- 主色调：#2d5a7b
- 代码背景：#f5f5f5
- 专业商务风格

### 3. 代码高亮处理

使用 highlight.js 对代码块进行语法高亮：
- 自动检测编程语言
- 应用对应的语法高亮样式
- 支持多种编程语言

### 4. 生成 HTML 文档

构建完整的 HTML 文档结构：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>文章标题</title>
  <style>
    /* 基础样式 */
  </style>
</head>
<body>
  <article>
    <!-- 文章内容 -->
  </article>
</body>
</html>
```

### 5. 写入文件

将生成的 HTML 内容写入指定目录，文件名格式为 `{timestamp}_{title}.html`。

## 与 wechat-article 技能的关系

本技能专注于内容转换，输出的 HTML 可以作为 `wechat-article` 技能的输入，进行进一步的微信公众号兼容性优化和样式应用。

### 协作工作流程：
```
AI 生成 Markdown → markdown-to-html → 基础 HTML → wechat-article → 微信公众号 HTML
```

## 示例用法

### 基础用法
```
将 Markdown 转换为 HTML，内容为：
# 文章标题

这是正文内容...

代码示例：
```javascript
console.log('Hello World');
```

列表：
- 项目1
- 项目2
```

### 指定主题
```
将 Markdown 转换为 HTML，主题为 business，内容为：
# 商务报告

市场分析...
```

### 完整参数
```
将 Markdown 转换为 HTML，标题为"技术教程"，作者为"张三"，主题为 tech，输出到 ./articles 目录，内容为：
# React 入门教程

React 是一个用于构建用户界面的 JavaScript 库...
```

## 注意事项

1. **样式简单**：本技能只应用基础样式，不处理复杂的布局和响应式设计
2. **平台无关**：生成的 HTML 是通用的，不针对特定平台优化
3. **代码高亮**：依赖 highlight.js 库，需要确保相关资源可用
4. **后续处理**：如需发布到微信公众号，请使用 `wechat-article` 技能进行进一步优化

## 相关文件

- `src/skills/markdownConverter.ts` - 核心转换实现
- `src/skills/htmlGenerator.ts` - 标准 HTML 生成器（参考实现）
- `package.json` - 依赖配置（marked, highlight.js）