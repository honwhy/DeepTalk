// eslint-disable-next-line @typescript-eslint/no-var-requires
const { marked } = require('marked');
import { Theme, HtmlArticleConfig } from './types';

const themes: Record<Theme, string> = {
  airbnb: `
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #fafafa;
      --text-primary: #484848;
      --text-secondary: #767676;
      --accent: #ff5a5f;
      --border: #e6e6e6;
      --code-bg: #fafafa;
    }
  `,
  apple: `
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #f5f5f7;
      --text-primary: #1d1d1f;
      --text-secondary: #86868b;
      --accent: #0071e3;
      --border: #d2d2d7;
      --code-bg: #f5f5f7;
    }
  `,
  binance: `
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #f8f9fa;
      --text-primary: #2a2a2a;
      --text-secondary: #5f6a7d;
      --accent: #f0b90a;
      --border: #e1e3e8;
      --code-bg: #f8f9fa;
    }
  `,
  claude: `
    :root {
      --bg-primary: #f5f4ed;
      --bg-secondary: #faf9f5;
      --text-primary: #141413;
      --text-secondary: #5e5d59;
      --accent: #c96442;
      --border: #e8e6dc;
      --code-bg: #faf9f5;
    }
  `,
  coinbase: `
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #f5f7fa;
      --text-primary: #0a0b0d;
      --text-secondary: #5f6b7a;
      --accent: #0052ff;
      --border: #e2e4e8;
      --code-bg: #f5f7fa;
    }
  `,
  'japanese-zen': `
    :root {
      --bg-primary: #f5f0e8;
      --bg-secondary: #faf8f5;
      --text-primary: #3d3d3d;
      --text-secondary: #7a7a7a;
      --accent: #8b7355;
      --border: #d9d0c5;
      --code-bg: #faf8f5;
    }
  `,
  'luxury-editorial': `
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #f5f5f5;
      --text-primary: #1a1a1a;
      --text-secondary: #666666;
      --accent: #b8966b;
      --border: #e5e5e5;
      --code-bg: #fafafa;
    }
  `,
  mastercard: `
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #f8f8f8;
      --text-primary: #1a1a1a;
      --text-secondary: #767676;
      --accent: #eb001b;
      --border: #e6e6e6;
      --code-bg: #f8f8f8;
    }
  `,
'neo-brutalist': `
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #f0f0f0;
      --text-primary: #000000;
      --text-secondary: #555555;
      --accent: #000000;
      --border: #000000;
      --code-bg: #f0f0f0;
    }
  `,
  notion: `
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #f7f6f3;
      --text-primary: #37352f;
      --text-secondary: #787774;
      --accent: #2eaadc;
      --border: #e8e7e4;
      --code-bg: #f7f6f3;
    }
  `,
  'opencode.ai': `
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #f8f8fc;
      --text-primary: #1e1e2e;
      --text-secondary: #6e6e7e;
      --accent: #6366f1;
      --border: #e2e2e8;
      --code-bg: #f8f8fc;
    }
  `,
  spacex: `
    :root {
      --bg-primary: #000000;
      --bg-secondary: #0a0a0a;
      --text-primary: #f0f0fa;
      --text-secondary: #a0a0b0;
      --accent: #ffffff;
      --border: #303030;
      --code-bg: #0a0a0a;
    }
  `,
  standard: `
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #f5f5f5;
      --text-primary: #333333;
      --text-secondary: #666666;
      --accent: #1890ff;
      --border: #e0e0e0;
      --code-bg: #f5f5f5;
    }
  `,
  stripe: `
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #f5f7fa;
      --text-primary: #061b31;
      --text-secondary: #64748d;
      --accent: #533afd;
      --border: #e5edf5;
      --code-bg: #f5f7fa;
    }
  `,
  vercel: `
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #fafafa;
      --text-primary: #171717;
      --text-secondary: #666666;
      --accent: #000000;
      --border: #ebebeb;
      --code-bg: #fafafa;
    }
  `,
  'vintage-newspaper': `
    :root {
      --bg-primary: #f5f2e8;
      --bg-secondary: #ebe8de;
      --text-primary: #2b2b2b;
      --text-secondary: #666666;
      --accent: #8b4513;
      --border: #c9c2b0;
      --code-bg: #ebe8de;
    }
  `,
};

export function generateHtml(config: HtmlArticleConfig): string {
  const { title, content, summary, category, tags, createdAt, theme = 'standard' } = config;
  const htmlContent = marked(content) as string;
  const themeStyles = themes[theme];

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.8;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    ${themeStyles}
    article { margin-bottom: 3rem; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; line-height: 1.3; }
    h2 { font-size: 1.5rem; margin: 2rem 0 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
    h3 { font-size: 1.25rem; margin: 1.5rem 0 0.75rem; }
    p { margin-bottom: 1rem; }
    a { text-decoration: none; }
    a:hover { text-decoration: underline; }
    blockquote {
      padding: 1rem 1.5rem;
      margin: 1.5rem 0;
      border-left: 4px solid var(--accent);
      font-style: italic;
    }
    pre {
      padding: 1rem;
      overflow-x: auto;
      margin: 1rem 0;
    }
    code {
      font-family: "Fira Code", "SF Mono", Consolas, monospace;
      font-size: 0.9em;
    }
    p code {
      padding: 0.2em 0.4em;
      border-radius: 3px;
    }
    ul, ol { padding-left: 1.5rem; margin-bottom: 1rem; }
    li { margin-bottom: 0.5rem; }
    img { max-width: 100%; height: auto; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th, td { padding: 0.75rem; border: 1px solid var(--border); text-align: left; }
    th { background: var(--bg-secondary); }
    .meta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    .meta span { display: flex; align-items: center; gap: 0.25rem; }
    .summary {
      padding: 1rem;
      background: var(--bg-secondary);
      border-radius: 8px;
      margin-bottom: 2rem;
      font-style: italic;
    }
    .tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
    }
    .tag {
      padding: 0.25rem 0.75rem;
      background: var(--bg-secondary);
      border-radius: 9999px;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .footer {
      margin-top: 3rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.85rem;
    }
  </style>
</head>
<body>
  <article>
    <header>
      <h1>${escapeHtml(title)}</h1>
      <div class="meta">
        <span>📁 ${escapeHtml(category)}</span>
        <span>📅 ${formatDate(createdAt)}</span>
      </div>
    </header>
    ${summary ? `<div class="summary">${escapeHtml(summary)}</div>` : ''}
    <div class="content">${htmlContent}</div>
    ${tags.length > 0 ? `
    <div class="tags">
      ${tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('\n      ')}
    </div>` : ''}
  </article>
  <footer class="footer">
    Generated by <strong>DeepTalk</strong> · ${formatDate(new Date())}
  </footer>
  <script>document.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));</script>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
