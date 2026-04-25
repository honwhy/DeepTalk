// 公众号专用渲染器 - 学习自 doocs/md 项目
// 关键：将 CSS 转换为内联样式，因为公众号不支持 <style> 标签
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { marked } = require('marked');
import juice from 'juice';
import { WeChatTheme, WeChatRenderOptions } from './types';

const wechatThemes: Record<WeChatTheme, string> = {
  airbnb: `
    :root {
      --bg: #ffffff;
      --text: #484848;
      --text-light: #767676;
      --primary: #ff5a5f;
      --border: #e6e6e6;
      --code-bg: #fafafa;
      --quote-bg: #f9f9f9;
      --quote-border: #ff5a5f;
    }
  `,
  apple: `
    :root {
      --bg: #ffffff;
      --text: #1d1d1f;
      --text-light: #86868b;
      --primary: #0071e3;
      --border: #d2d2d7;
      --code-bg: #f5f5f7;
      --quote-bg: #f5f5f7;
      --quote-border: #0071e3;
    }
  `,
  binance: `
    :root {
      --bg: #ffffff;
      --text: #2a2a2a;
      --text-light: #5f6a7d;
      --primary: #f0b90a;
      --border: #e1e3e8;
      --code-bg: #f8f9fa;
      --quote-bg: #faf8f0;
      --quote-border: #f0b90a;
    }
  `,
  claude: `
    :root {
      --bg: #f5f4ed;
      --text: #141413;
      --text-light: #5e5d59;
      --primary: #c96442;
      --border: #e8e6dc;
      --code-bg: #faf9f5;
      --quote-bg: #e8e6dc;
      --quote-border: #c96442;
    }
  `,
  coinbase: `
    :root {
      --bg: #ffffff;
      --text: #0a0b0d;
      --text-light: #5f6b7a;
      --primary: #0052ff;
      --border: #e2e4e8;
      --code-bg: #f5f7fa;
      --quote-bg: #f0f4fd;
      --quote-border: #0052ff;
    }
  `,
  'japanese-zen': `
    :root {
      --bg: #f5f0e8;
      --text: #3d3d3d;
      --text-light: #7a7a7a;
      --primary: #8b7355;
      --border: #d9d0c5;
      --code-bg: #faf8f5;
      --quote-bg: #ebe6db;
      --quote-border: #8b7355;
    }
  `,
  'luxury-editorial': `
    :root {
      --bg: #ffffff;
      --text: #1a1a1a;
      --text-light: #666666;
      --primary: #b8966b;
      --border: #e5e5e5;
      --code-bg: #fafafa;
      --quote-bg: #f5f5f5;
      --quote-border: #b8966b;
    }
  `,
  mastercard: `
    :root {
      --bg: #ffffff;
      --text: #1a1a1a;
      --text-light: #767676;
      --primary: #eb001b;
      --border: #e6e6e6;
      --code-bg: #f8f8f8;
      --quote-bg: #fef0f0;
      --quote-border: #eb001b;
    }
  `,
  'neo-brutalist': `
    :root {
      --bg: #ffffff;
      --text: #000000;
      --text-light: #555555;
      --primary: #000000;
      --border: #000000;
      --code-bg: #f0f0f0;
      --quote-bg: #ffff00;
      --quote-border: #000000;
    }
  `,
  notion: `
    :root {
      --bg: #ffffff;
      --text: #37352f;
      --text-light: #787774;
      --primary: #2eaadc;
      --border: #e8e7e4;
      --code-bg: #f7f6f3;
      --quote-bg: #eeeeec;
      --quote-border: #2eaadc;
    }
  `,
  'opencode.ai': `
    :root {
      --bg: #ffffff;
      --text: #1e1e2e;
      --text-light: #6e6e7e;
      --primary: #6366f1;
      --border: #e2e2e8;
      --code-bg: #f8f8fc;
      --quote-bg: #f0f0fa;
      --quote-border: #6366f1;
    }
  `,
  spacex: `
    :root {
      --bg: #000000;
      --text: #f0f0fa;
      --text-light: #a0a0b0;
      --primary: #ffffff;
      --border: #303030;
      --code-bg: #0a0a0a;
      --quote-bg: #101010;
      --quote-border: #ffffff;
    }
  `,
  standard: `
    :root {
      --bg: #ffffff;
      --text: #333333;
      --text-light: #666666;
      --primary: #1890ff;
      --border: #e0e0e0;
      --code-bg: #f5f5f5;
      --quote-bg: #fafafa;
      --quote-border: #1890ff;
    }
  `,
  stripe: `
    :root {
      --bg: #ffffff;
      --text: #061b31;
      --text-light: #64748d;
      --primary: #533afd;
      --border: #e5edf5;
      --code-bg: #f5f7fa;
      --quote-bg: #f0f4fc;
      --quote-border: #533afd;
    }
  `,
  vercel: `
    :root {
      --bg: #ffffff;
      --text: #171717;
      --text-light: #666666;
      --primary: #000000;
      --border: #ebebeb;
      --code-bg: #fafafa;
      --quote-bg: #f5f5f5;
      --quote-border: #171717;
    }
  `,
  'vintage-newspaper': `
    :root {
      --bg: #f5f2e8;
      --text: #2b2b2b;
      --text-light: #666666;
      --primary: #8b4513;
      --border: #c9c2b0;
      --code-bg: #ebe8de;
      --quote-bg: #ddd8c8;
      --quote-border: #8b4513;
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
    theme = 'standard',
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
    theme = 'standard',
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
