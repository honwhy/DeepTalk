// eslint-disable-next-line @typescript-eslint/no-var-requires
const { marked } = require('marked');
import { Theme, HtmlArticleConfig } from './types';

const themes: Record<Theme, string> = {
  tech: `
    :root {
      --bg-primary: #0d1117;
      --bg-secondary: #161b22;
      --text-primary: #c9d1d9;
      --text-secondary: #8b949e;
      --accent: #58a6ff;
      --border: #30363d;
      --code-bg: #1f2428;
    }
    body {
      background: var(--bg-primary);
      color: var(--text-primary);
    }
    a { color: var(--accent); }
    pre, code {
      background: var(--code-bg);
      border-radius: 6px;
    }
    blockquote {
      border-left: 4px solid var(--accent);
      background: var(--bg-secondary);
    }
  `,
  minimal: `
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #f8f9fa;
      --text-primary: #212529;
      --text-secondary: #6c757d;
      --accent: #0d6efd;
      --border: #dee2e6;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 720px;
      margin: 0 auto;
      padding: 2rem;
      background: var(--bg-primary);
      color: var(--text-primary);
    }
  `,
  business: `
    :root {
      --bg-primary: #fafbfc;
      --bg-secondary: #ffffff;
      --text-primary: #1a1a2e;
      --text-secondary: #4a5568;
      --accent: #2d5a7b;
      --border: #e2e8f0;
      --header-bg: #1a1a2e;
    }
    body {
      background: var(--bg-primary);
      color: var(--text-primary);
      font-family: "Georgia", serif;
    }
    .header {
      background: var(--header-bg);
      color: #fff;
      padding: 2rem;
      margin: -2rem -2rem 2rem -2rem;
    }
  `,
};

export function generateHtml(config: HtmlArticleConfig): string {
  const { title, content, summary, category, tags, createdAt, theme = 'tech' } = config;
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
