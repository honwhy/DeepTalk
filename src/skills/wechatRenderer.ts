// 公众号专用渲染器 - 学习自 doocs/md 项目
// 关键：将 CSS 转换为内联样式，因为公众号不支持 <style> 标签
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { marked } = require('marked');
import juice from 'juice';
import { WeChatTheme, WeChatRenderOptions } from './types';

// 公众号文章样式（参考 doocs/md）
const wechatThemes: Record<WeChatTheme, string> = {
  tech: `
    :root {
      --bg: #fff;
      --text: #333;
      --text-light: #666;
      --primary: #35b3ff;
      --border: #e8e8e8;
      --code-bg: #f6f8fa;
      --quote-bg: #f8f8f8;
      --quote-border: #35b3ff;
    }
  `,
  business: `
    :root {
      --bg: #fff;
      --text: #333;
      --text-light: #666;
      --primary: #2d5a7b;
      --border: #e8e8e8;
      --code-bg: #f5f5f5;
      --quote-bg: #fafafa;
      --quote-border: #2d5a7b;
    }
  `,
  minimal: `
    :root {
      --bg: #fff;
      --text: #333;
      --text-light: #888;
      --primary: #333;
      --border: #eee;
      --code-bg: #f8f8f8;
      --quote-bg: #fafafa;
      --quote-border: #333;
    }
  `,
};

// 公众号基础样式
const wechatBaseStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;
    font-size: 16px;
    line-height: 1.75;
    color: var(--text);
    background: var(--bg);
    padding: 20px;
    max-width: 100%;
    word-wrap: break-word;
  }

  /* 标题 */
  h1 { font-size: 22px; font-weight: bold; margin: 20px 0; color: var(--text); }
  h2 { font-size: 20px; font-weight: bold; margin: 18px 0; color: var(--text); }
  h3 { font-size: 18px; font-weight: bold; margin: 16px 0; color: var(--text); }
  h4 { font-size: 16px; font-weight: bold; margin: 14px 0; color: var(--text); }

  /* 段落 */
  p { margin: 12px 0; text-align: justify; }
  strong { font-weight: bold; color: var(--text); }
  em { font-style: italic; }

  /* 链接 */
  a { color: var(--primary); text-decoration: none; }

  /* 引用 */
  blockquote {
    padding: 12px 16px;
    margin: 12px 0;
    background: var(--quote-bg);
    border-left: 4px solid var(--quote-border);
    color: var(--text-light);
  }
  blockquote p { margin: 0; }

  /* 列表 */
  ul, ol { padding-left: 24px; margin: 12px 0; }
  li { margin: 4px 0; }
  li p { margin: 0; }

  /* 代码块 */
  pre {
    padding: 16px;
    margin: 12px 0;
    background: var(--code-bg);
    border-radius: 6px;
    overflow-x: auto;
    font-family: "Fira Code", "SF Mono", Consolas, monospace;
    font-size: 14px;
    line-height: 1.6;
  }
  pre code {
    background: transparent;
    padding: 0;
    border-radius: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  /* 行内代码 */
  code {
    padding: 2px 6px;
    background: var(--code-bg);
    border-radius: 4px;
    font-family: "Fira Code", "SF Mono", Consolas, monospace;
    font-size: 14px;
  }

  /* 图片 */
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 12px auto;
    border-radius: 4px;
  }

  /* 表格 */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 14px;
  }
  th, td {
    padding: 10px 12px;
    border: 1px solid var(--border);
    text-align: left;
  }
  th {
    background: var(--quote-bg);
    font-weight: bold;
  }
  tr:nth-child(even) { background: var(--quote-bg); }

  /* 分割线 */
  hr {
    border: none;
    border-top: 1px solid var(--border);
    margin: 20px 0;
  }

  /* 删除线 */
  del { text-decoration: line-through; color: var(--text-light); }

  /* 脚注 */
  .footnote { font-size: 14px; color: var(--text-light); }
`;

/**
 * 渲染为公众号格式 HTML
 * 关键特性：内联 CSS 样式，可直接复制到公众号编辑器
 */
export function renderForWeChat(
  markdown: string,
  options: WeChatRenderOptions = {}
): string {
  const {
    theme = 'tech',
    title = '',
    author = '',
    customStyles = '',
  } = options;

  // 配置 marked
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  // 解析 Markdown
  const htmlContent = marked(markdown) as string;

  // 组合完整 CSS
  const css = `
    ${wechatThemes[theme]}
    ${wechatBaseStyles}
    ${customStyles}
  `;

  // 构建 HTML
  const html = buildWeChatHtml(htmlContent, css, { title, author });

  // 使用 juice 将 CSS 内联化
  const inlinedHtml = juice(html, {
    extraCss: css,
    applyStyleTags: true,
    removeStyleTags: false,
    preserveMediaQueries: true,
  });

  return inlinedHtml;
}

/**
 * 构建公众号 HTML 结构
 */
function buildWeChatHtml(
  content: string,
  css: string,
  meta: { title: string; author: string }
): string {
  const { title, author } = meta;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${title ? `<title>${escapeHtml(title)}</title>` : ''}
  <style>${css}</style>
</head>
<body>
  ${title ? `<h1>${escapeHtml(title)}</h1>` : ''}
  ${author ? `<p style="color: var(--text-light); font-size: 14px; margin-bottom: 20px;">作者：${escapeHtml(author)}</p>` : ''}
  ${content}
</body>
</html>`;
}

/**
 * 生成可直接复制的内容（无 HTML/HEAD 标签）
 * 用于直接粘贴到公众号编辑器
 */
export function renderForWeChatCopy(
  markdown: string,
  options: WeChatRenderOptions = {}
): string {
  const {
    theme = 'tech',
    title = '',
    author = '',
    customStyles = '',
  } = options;

  marked.setOptions({ gfm: true, breaks: true });
  const htmlContent = marked(markdown) as string;

  const css = `
    ${wechatThemes[theme]}
    ${wechatBaseStyles}
    ${customStyles}
  `;

  // 构建内容片段
  const contentHtml = `
    <section style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif; font-size: 16px; line-height: 1.75; color: #333; background: #fff; padding: 20px;">
      ${title ? `<h1 style="font-size: 22px; font-weight: bold; margin: 20px 0; color: #333;">${escapeHtml(title)}</h1>` : ''}
      ${author ? `<p style="color: #666; font-size: 14px; margin-bottom: 20px;">作者：${escapeHtml(author)}</p>` : ''}
      ${htmlContent}
    </section>
  `;

  // 内联样式
  return juice(contentHtml, {
    extraCss: css,
    applyStyleTags: true,
    removeStyleTags: true,
  });
}

/**
 * 获取公众号主题预览 CSS
 */
export function getWeChatThemePreview(theme: WeChatTheme): string {
  return `
    ${wechatThemes[theme]}
    ${wechatBaseStyles}
  `;
}

/**
 * 转义 HTML 特殊字符
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 代码高亮处理（简化版）
 * 公众号不支持 JavaScript，这里返回带样式的 HTML
 */
export function highlightCode(html: string): string {
  // 简单的关键字高亮（可根据需要扩展）
  return html.replace(
    /<pre><code class="language-(\w+)">/g,
    '<pre style="background: #f6f8fa;"><code class="language-$1">'
  );
}
