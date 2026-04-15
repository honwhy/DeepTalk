import express, { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { generateHtml, Theme, WeChatTheme } from '../skills';
import { renderForWeChatCopy } from '../skills/wechatRenderer';

const OUTPUT_DIR = path.resolve(__dirname, '../../output');
const CONTENTS_DIR = path.resolve(__dirname, '../../contents');
const MARKDOWNS_DIR = path.resolve(__dirname, '../../markdowns');

interface PreviewOptions {
  mdPath?: string;
  theme?: Theme;
  path?: string;
}

const app = express();
app.use(express.json());

// 获取文件列表
function getFileList(dir: string): Array<{
  id: string;
  title: string;
  type: string;
  createdAt: string;
  filepath: string;
}> {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f.endsWith('.md'));
  return files.map(file => {
    const filepath = path.join(dir, file);
    const ext = path.extname(file);
    let title = file.replace(ext, '');

    if (ext === '.html') {
      try {
        const content = fs.readFileSync(filepath, 'utf-8');
        const titleMatch = content.match(/<h1>([^<]+)<\/h1>/);
        if (titleMatch) title = titleMatch[1];
      } catch (e) {
        // ignore
      }
    } else if (ext === '.md') {
      try {
        const content = fs.readFileSync(filepath, 'utf-8');
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) title = titleMatch[1];
      } catch (e) {
        // ignore
      }
    }

    const stats = fs.statSync(filepath);

    return {
      id: file,
      title,
      type: ext.replace('.', ''),
      createdAt: stats.mtime.toISOString(),
      filepath: `/api/files/${file}`,
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// API 路由 - 获取文件列表
app.get('/api/files', (req: Request, res: Response) => {
  const dir = (req.query.dir as string) || OUTPUT_DIR;
  const files = getFileList(dir);
  res.json(files);
});

// API 路由 - 获取单个文件
app.get('/api/files/:id', (req: Request, res: Response) => {
  const dir = (req.query.dir as string) || OUTPUT_DIR;
  const fileId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const filepath = path.join(dir, fileId);

  if (!fs.existsSync(filepath)) {
    res.status(404).json({ error: '文件不存在' });
    return;
  }

  const ext = path.extname(fileId);

  if (ext === '.html') {
    res.sendFile(filepath);
  } else if (ext === '.md') {
    const theme = (req.query.theme as Theme) || 'tech';
    const content = fs.readFileSync(filepath, 'utf-8');
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : fileId;

    const html = generateHtml({
      title,
      content,
      summary: '',
      category: 'markdown',
      tags: [],
      createdAt: new Date(),
      theme,
    });

    res.send(html);
  } else {
    res.sendFile(filepath);
  }
});

// API 路由 - 获取公众号格式 HTML
app.get('/api/wechat/:id', (req: Request, res: Response) => {
  const dir = (req.query.dir as string) || OUTPUT_DIR;
  const fileId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const theme = (req.query.theme as WeChatTheme) || 'tech';
  const filepath = path.join(dir, fileId);

  if (!fs.existsSync(filepath)) {
    res.status(404).json({ error: '文件不存在' });
    return;
  }

  const ext = path.extname(fileId);
  if (ext !== '.md' && ext !== '.html') {
    res.status(400).json({ error: '不支持的文件类型' });
    return;
  }

  try {
    let wechatHtml = '';
    let title = '';

    if (ext === '.md') {
      // Markdown 文件：使用 renderForWeChatCopy 渲染
      const markdown = fs.readFileSync(filepath, 'utf-8');
      const titleMatch = markdown.match(/^#\s+(.+)$/m);
      title = titleMatch ? titleMatch[1] : fileId.replace('.md', '');
      wechatHtml = renderForWeChatCopy(markdown, { theme, title });
    } else {
      // HTML 文件：提取 body 内容并内联样式
      const html = fs.readFileSync(filepath, 'utf-8');

      // 提取标题
      const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || html.match(/<title>([^<]+)<\/title>/i);
      title = titleMatch ? titleMatch[1] : fileId.replace('.html', '');

      // 提取 body 内容
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      let content = bodyMatch ? bodyMatch[1] : html;

      // 提取 style 标签中的 CSS
      const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
      const css = styleMatch ? styleMatch.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n') : '';

      // 使用 juice 内联样式
      if (css) {
        const juice = require('juice');
        const wrappedContent = `<div id="wechat-content">${content}</div>`;
        wechatHtml = juice.inlineContent(wrappedContent, css);
      } else {
        // 如果没有 style 标签，假设已经是内联样式，直接使用
        wechatHtml = content;
      }
    }

    res.json({ html: wechatHtml, title });
  } catch (error) {
    res.status(500).json({ error: '转换失败', details: String(error) });
  }
});

// API 路由 - Markdown 转 HTML（POST）
app.post('/api/render', (req: Request, res: Response) => {
  const { markdown, theme = 'tech', title = 'Preview' } = req.body;

  if (!markdown) {
    res.status(400).json({ error: '缺少 markdown 内容' });
    return;
  }

  const html = generateHtml({
    title,
    content: markdown,
    summary: '',
    category: 'preview',
    tags: [],
    createdAt: new Date(),
    theme: theme as Theme,
  });

  res.send(html);
});

// API 路由 - 保存 Markdown 文件
app.post('/api/markdowns', (req: Request, res: Response) => {
  const { filename, content } = req.body;

  if (!filename || !content) {
    res.status(400).json({ error: '缺少文件名或内容' });
    return;
  }

  // 确保目录存在
  if (!fs.existsSync(MARKDOWNS_DIR)) {
    fs.mkdirSync(MARKDOWNS_DIR, { recursive: true });
  }

  // 清理文件名
  const safeFilename = filename.replace(/[^a-zA-Z0-9\u4e00-\u9fa5\-_\.]/g, '');
  const finalFilename = safeFilename.endsWith('.md') ? safeFilename : `${safeFilename}.md`;
  const filepath = path.join(MARKDOWNS_DIR, finalFilename);

  try {
    fs.writeFileSync(filepath, content, 'utf-8');
    res.json({ success: true, filename: finalFilename, path: filepath });
  } catch (error) {
    res.status(500).json({ error: '保存文件失败', details: String(error) });
  }
});

// API 路由 - 获取 Markdown 文件列表
app.get('/api/markdowns', (req: Request, res: Response) => {
  const files = getFileList(MARKDOWNS_DIR);
  res.json(files);
});

// API 路由 - 获取单个 Markdown 文件内容
app.get('/api/markdowns/:id', (req: Request, res: Response) => {
  const fileId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const filepath = path.join(MARKDOWNS_DIR, fileId);

  if (!fs.existsSync(filepath)) {
    res.status(404).json({ error: '文件不存在' });
    return;
  }

  const content = fs.readFileSync(filepath, 'utf-8');
  res.json({ filename: fileId, content });
});

// API 路由 - 删除 Markdown 文件
app.delete('/api/markdowns/:id', (req: Request, res: Response) => {
  const fileId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const filepath = path.join(MARKDOWNS_DIR, fileId);

  if (!fs.existsSync(filepath)) {
    res.status(404).json({ error: '文件不存在' });
    return;
  }

  try {
    fs.unlinkSync(filepath);
    res.json({ success: true, message: '文件已删除' });
  } catch (error) {
    res.status(500).json({ error: '删除文件失败', details: String(error) });
  }
});

// 主页
app.get('/', (_req: Request, res: Response) => {
  res.send(getIndexHtml());
});

// Markdown 编辑器页面
app.get('/editor', (_req: Request, res: Response) => {
  res.send(getEditorHtml());
});

// 静态资源
app.use('/static', express.static(OUTPUT_DIR));
app.use('/output', express.static(OUTPUT_DIR));
app.use('/markdowns', express.static(MARKDOWNS_DIR));

export function startWebServer(port: number = 3000, contentDir: string = CONTENTS_DIR): void {
  app.listen(port, () => {
    console.log(`\n🌐 Web 界面已启动: http://localhost:${port}`);
    console.log(`📝 Markdown 编辑器: http://localhost:${port}/editor`);
    console.log(`📁 内容目录: ${contentDir}`);
    console.log('按 Ctrl+C 停止服务\n');
  });
}

export function startPreviewServer(
  port: number = 3001,
  mode: 'markdown' | 'file' | 'directory' = 'directory',
  options: PreviewOptions = {}
): void {
  const server = express();
  server.use(express.json());

  if (mode === 'markdown' && options.mdPath) {
    // Markdown 预览模式
    server.get('/', (_req: Request, res: Response) => {
      const theme = options.theme || 'tech';
      const content = fs.readFileSync(options.mdPath!, 'utf-8');
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : path.basename(options.mdPath!);

      const html = generateHtml({
        title,
        content,
        summary: '',
        category: 'preview',
        tags: [],
        createdAt: new Date(),
        theme: theme as Theme,
      });

      res.send(html);
    });
  } else if (mode === 'file' && options.path) {
    // 单个 HTML 文件预览
    server.get('/', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(options.path!));
    });
  } else {
    // 目录预览模式
    const targetDir = options.path || CONTENTS_DIR;

    server.get('/api/files', (_req: Request, res: Response) => {
      res.json(getFileList(targetDir));
    });

    server.get('/api/files/:id', (req: Request, res: Response) => {
      const fileId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const filepath = path.join(targetDir, fileId);
      if (!fs.existsSync(filepath)) {
        res.status(404).send('文件不存在');
        return;
      }
      res.sendFile(filepath);
    });

    server.get('/', (_req: Request, res: Response) => {
      res.send(getPreviewIndexHtml(targetDir));
    });
  }

  server.listen(port, () => {
    console.log(`\n👀 预览服务已启动: http://localhost:${port}`);
    if (mode === 'markdown') {
      console.log(`📄 预览文件: ${options.mdPath}`);
    } else if (mode === 'file') {
      console.log(`📄 预览文件: ${options.path}`);
    } else {
      console.log(`📁 预览目录: ${options.path || CONTENTS_DIR}`);
    }
    console.log('按 Ctrl+C 停止服务\n');
  });
}

function getIndexHtml(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DeepTalk - 文章管理</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@320;340;400;540;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-black: #000000;
      --color-white: #ffffff;
      --color-glass-dark: rgba(0, 0, 0, 0.08);
      --color-glass-light: rgba(255, 255, 255, 0.16);
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
      --font-mono: 'SF Mono', 'Fira Code', menlo, monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    *:focus { outline: dashed 2px var(--color-black); outline-offset: 2px; }
    body {
      font-family: var(--font-sans);
      font-weight: 340;
      font-size: 16px;
      line-height: 1.45;
      letter-spacing: -0.14px;
      font-feature-settings: "kern";
      background: var(--color-white);
      color: var(--color-black);
      min-height: 100vh;
    }
    .header {
      background: var(--color-black);
      color: var(--color-white);
      padding: 80px 24px;
      text-align: center;
    }
    .header h1 {
      font-size: 64px;
      font-weight: 400;
      line-height: 1.10;
      letter-spacing: -0.96px;
      margin-bottom: 16px;
    }
    .header p {
      font-size: 20px;
      font-weight: 330;
      line-height: 1.40;
      letter-spacing: -0.14px;
      opacity: 0.7;
    }
    .nav {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 32px;
    }
    .nav a {
      color: var(--color-black);
      text-decoration: none;
      padding: 8px 18px 10px;
      background: var(--color-white);
      border-radius: 50px;
      font-size: 16px;
      font-weight: 400;
      letter-spacing: -0.14px;
      transition: opacity 0.15s;
    }
    .nav a:hover { opacity: 0.8; }
    .nav a.active {
      background: var(--color-black);
      color: var(--color-white);
    }
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 48px 24px;
    }
    .section-label {
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 400;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      color: var(--color-black);
      opacity: 0.5;
      margin-bottom: 24px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
    }
    .card {
      background: var(--color-white);
      border: 1px solid var(--color-black);
      border-radius: 8px;
      padding: 24px;
      transition: box-shadow 0.2s;
    }
    .card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }
    .card h3 {
      font-size: 24px;
      font-weight: 700;
      line-height: 1.45;
      margin-bottom: 12px;
    }
    .card .meta {
      display: flex;
      gap: 12px;
      font-size: 14px;
      font-weight: 330;
      color: var(--color-black);
      opacity: 0.6;
      margin-bottom: 16px;
    }
    .card .type {
      padding: 4px 12px;
      background: var(--color-glass-dark);
      border-radius: 50px;
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 400;
      letter-spacing: 0.6px;
      text-transform: uppercase;
    }
    .card .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .btn {
      padding: 8px 18px 10px;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-family: var(--font-sans);
      font-size: 16px;
      font-weight: 340;
      letter-spacing: -0.14px;
      text-decoration: none;
      display: inline-block;
      transition: opacity 0.15s;
    }
    .btn:hover { opacity: 0.8; }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-primary {
      background: var(--color-black);
      color: var(--color-white);
    }
    .btn-secondary {
      background: var(--color-white);
      color: var(--color-black);
      border: 1px solid var(--color-black);
    }
    .empty {
      text-align: center;
      padding: 80px 24px;
      color: var(--color-black);
      opacity: 0.5;
    }
    .empty h3 { font-size: 26px; font-weight: 540; margin-bottom: 16px; }
    .empty p { font-size: 16px; font-weight: 340; margin-bottom: 8px; }
    .empty code {
      font-family: var(--font-mono);
      font-size: 14px;
      background: var(--color-glass-dark);
      padding: 4px 8px;
      border-radius: 6px;
    }
    .copy-toast {
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--color-black);
      color: var(--color-white);
      padding: 12px 24px;
      border-radius: 50px;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s;
      font-size: 14px;
      font-weight: 340;
    }
    .copy-toast.show { opacity: 1; }
    @media (max-width: 768px) {
      .header { padding: 48px 16px; }
      .header h1 { font-size: 48px; letter-spacing: -0.72px; }
      .container { padding: 32px 16px; }
      .grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>深言 DeepTalk</h1>
    <p>Markdown 转 HTML 工具 · 文章生成与预览</p>
    <div class="nav">
      <a href="/" class="active">文章列表</a>
      <a href="/editor">Markdown 编辑器</a>
    </div>
  </div>
  <div class="container">
    <div class="section-label">Articles</div>
    <div id="files" class="grid"></div>
    <div id="empty" class="empty" style="display:none;">
      <h3>暂无内容</h3>
      <p>使用 <code>npm run md2html -- -i file.md</code> 转换 Markdown</p>
      <p>或使用 <code>npm run generate -- -t "主题"</code> 生成文章</p>
    </div>
  </div>
  <div id="toast" class="copy-toast">已复制到剪贴板</div>
  <script>
    async function copyWeChatFormat(fileId) {
      const btn = event.target;
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = '复制中...';

      try {
        const response = await fetch('/api/wechat/' + encodeURIComponent(fileId));
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '获取失败');
        }

        const htmlContent = data.html;
        const plainText = '';
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        const textBlob = new Blob([plainText], { type: 'text/plain' });
        const clipboardItem = new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob
        });

        await navigator.clipboard.write([clipboardItem]);
        showToast('已复制公众号格式，可直接粘贴到公众号编辑器');
        btn.textContent = '已复制';
        setTimeout(() => { btn.textContent = originalText; }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
        showToast('复制失败: ' + err.message, true);
        btn.textContent = originalText;
      } finally {
        btn.disabled = false;
      }
    }

    function showToast(message, isError = false) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.style.background = isError ? '#dc3545' : '#000000';
      toast.classList.add('show');
      setTimeout(() => { toast.classList.remove('show'); }, 3000);
    }

    fetch('/api/files')
      .then(r => r.json())
      .then(files => {
        const grid = document.getElementById('files');
        const empty = document.getElementById('empty');
        if (files.length === 0) {
          empty.style.display = 'block';
          return;
        }
        grid.innerHTML = files.map(f => \`
          <div class="card">
            <h3>\${f.title}</h3>
            <div class="meta">
              <span class="type">\${f.type}</span>
              <span>\${new Date(f.createdAt).toLocaleDateString('zh-CN')}</span>
            </div>
            <div class="actions">
              <a href="/api/files/\${f.id}" class="btn btn-primary" target="_blank">预览</a>
              <button class="btn btn-secondary" onclick="copyWeChatFormat('\${f.id}')">复制公众号格式</button>
              <a href="/api/files/\${f.id}" class="btn btn-secondary" download>下载</a>
            </div>
          </div>
        \`).join('');
      });
  </script>
</body>
</html>`;
}

function getEditorHtml(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown 编辑器 - DeepTalk</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@320;340;400;540;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-black: #000000;
      --color-white: #ffffff;
      --color-glass-dark: rgba(0, 0, 0, 0.08);
      --color-glass-light: rgba(255, 255, 255, 0.16);
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
      --font-mono: 'SF Mono', 'Fira Code', menlo, monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    *:focus { outline: dashed 2px var(--color-white); outline-offset: 2px; }
    body {
      font-family: var(--font-sans);
      font-weight: 340;
      font-size: 16px;
      line-height: 1.45;
      letter-spacing: -0.14px;
      font-feature-settings: "kern";
      background: var(--color-white);
      color: var(--color-black);
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .toolbar {
      display: flex;
      gap: 12px;
      padding: 12px 16px;
      background: var(--color-black);
      align-items: center;
      flex-wrap: wrap;
    }
    .toolbar h1 {
      font-size: 20px;
      font-weight: 540;
      letter-spacing: -0.14px;
      color: var(--color-white);
      margin-right: 8px;
    }
    .toolbar label {
      color: var(--color-white);
      opacity: 0.7;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .toolbar select,
    .toolbar button,
    .toolbar input {
      padding: 8px 18px 10px;
      border: none;
      border-radius: 50px;
      font-family: var(--font-sans);
      font-size: 14px;
      font-weight: 340;
      letter-spacing: -0.14px;
    }
    .toolbar select {
      background: var(--color-glass-light);
      color: var(--color-white);
      cursor: pointer;
    }
    .toolbar select option { background: var(--color-black); }
    .toolbar button {
      background: var(--color-white);
      color: var(--color-black);
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .toolbar button:hover { opacity: 0.8; }
    .toolbar button.secondary {
      background: transparent;
      color: var(--color-white);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .toolbar input {
      background: var(--color-glass-light);
      color: var(--color-white);
      width: 140px;
    }
    .toolbar input::placeholder { color: rgba(255, 255, 255, 0.5); }
    .toolbar input#filename { width: 120px; }
    .toolbar .spacer { flex: 1; }
    .toolbar a {
      color: var(--color-white);
      text-decoration: none;
      font-size: 14px;
      font-weight: 340;
      opacity: 0.7;
      transition: opacity 0.15s;
    }
    .toolbar a:hover { opacity: 1; }
    .main {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .sidebar {
      width: 240px;
      background: var(--color-white);
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
    }
    .sidebar-header {
      padding: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    .sidebar-header h3 {
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 400;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      color: var(--color-black);
      opacity: 0.5;
    }
    .file-list {
      flex: 1;
      overflow-y: auto;
    }
    .file-item {
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background 0.15s;
    }
    .file-item:hover { background: var(--color-glass-dark); }
    .file-item.active { background: var(--color-black); }
    .file-item.active .name { color: var(--color-white); }
    .file-item .name {
      font-size: 14px;
      font-weight: 340;
      letter-spacing: -0.1px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }
    .file-item .delete {
      opacity: 0;
      color: #dc3545;
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 50px;
      transition: all 0.15s;
    }
    .file-item:hover .delete { opacity: 0.7; }
    .file-item .delete:hover {
      opacity: 1;
      background: #dc3545;
      color: white;
    }
    .file-item.active .delete { color: rgba(255, 255, 255, 0.7); }
    .file-item.active .delete:hover { background: #dc3545; color: white; }
    .editor {
      flex: 1;
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
    }
    .editor textarea {
      flex: 1;
      background: #fafafa;
      color: var(--color-black);
      border: none;
      padding: 16px;
      font-family: var(--font-mono);
      font-size: 14px;
      line-height: 1.6;
      resize: none;
    }
    .editor textarea::placeholder { color: rgba(0, 0, 0, 0.3); }
    .editor textarea:focus { outline: none; background: #f5f5f5; }
    .preview {
      flex: 1;
      background: var(--color-white);
      overflow: auto;
    }
    .preview iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
    .status {
      padding: 8px 16px;
      background: var(--color-white);
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      font-size: 13px;
      font-weight: 340;
      letter-spacing: -0.1px;
      color: var(--color-black);
      opacity: 0.5;
    }
    .status.success { opacity: 1; color: #198754; }
    .status.error { opacity: 1; color: #dc3545; }
    @media (max-width: 768px) {
      .sidebar { width: 180px; }
      .toolbar input { width: 100px; }
      .toolbar input#filename { width: 80px; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <h1>Markdown 编辑器</h1>
    <label>主题
      <select id="theme">
        <option value="tech">Tech</option>
        <option value="minimal">Minimal</option>
        <option value="business">Business</option>
      </select>
    </label>
    <input id="title" placeholder="文章标题" value="Preview">
    <input id="filename" placeholder="文件名">
    <button onclick="saveMarkdown()">保存</button>
    <button onclick="newFile()" class="secondary">新建</button>
    <button onclick="renderPreview()">刷新预览</button>
    <button onclick="downloadHtml()">下载 HTML</button>
    <span class="spacer"></span>
    <a href="/">← 返回列表</a>
  </div>
  <div class="main">
    <div class="sidebar">
      <div class="sidebar-header">
        <h3>Files</h3>
      </div>
      <div class="file-list" id="fileList"></div>
    </div>
    <div class="editor">
      <textarea id="markdown" placeholder="在此输入 Markdown 内容..."># 示例文章

这是一个 **Markdown** 预览示例。

## 功能特点

- 实时预览
- 多主题支持
- 一键保存到 markdowns 目录

\`\`\`javascript
console.log('Hello, DeepTalk!');
\`\`\`
</textarea>
    </div>
    <div class="preview">
      <iframe id="previewFrame"></iframe>
    </div>
  </div>
  <div class="status" id="status">就绪</div>
  <script>
    const markdownEl = document.getElementById('markdown');
    const themeEl = document.getElementById('theme');
    const titleEl = document.getElementById('title');
    const filenameEl = document.getElementById('filename');
    const previewFrame = document.getElementById('previewFrame');
    const statusEl = document.getElementById('status');
    const fileListEl = document.getElementById('fileList');
    let currentFile = null;

    function setStatus(msg, type = 'normal') {
      statusEl.textContent = msg;
      statusEl.className = 'status ' + type;
      if (type !== 'normal') {
        setTimeout(() => { statusEl.className = 'status'; }, 3000);
      }
    }

    function loadFileList() {
      fetch('/api/markdowns')
        .then(r => r.json())
        .then(files => {
          fileListEl.innerHTML = files.map(f => \`
            <div class="file-item \${currentFile === f.id ? 'active' : ''}" data-id="\${f.id}">
              <span class="name" onclick="openFile('\${f.id}')">\${f.title}</span>
              <span class="delete" onclick="deleteFile('\${f.id}', event)">✕</span>
            </div>
          \`).join('');
        });
    }

    function openFile(id) {
      fetch('/api/markdowns/' + encodeURIComponent(id))
        .then(r => r.json())
        .then(data => {
          markdownEl.value = data.content;
          filenameEl.value = data.filename.replace('.md', '');
          const titleMatch = data.content.match(/^#\\s+(.+)$/m);
          if (titleMatch) titleEl.value = titleMatch[1];
          currentFile = id;
          loadFileList();
          renderPreview();
          setStatus('已加载: ' + data.filename);
        })
        .catch(err => setStatus('加载失败: ' + err.message, 'error'));
    }

    function newFile() {
      markdownEl.value = '# 新文章\\n\\n在此输入内容...';
      titleEl.value = '新文章';
      filenameEl.value = 'new-article';
      currentFile = null;
      loadFileList();
      renderPreview();
      setStatus('新建文件');
    }

    function saveMarkdown() {
      const filename = filenameEl.value || titleEl.value || 'untitled';
      const content = markdownEl.value;

      fetch('/api/markdowns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content })
      })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStatus('保存成功: ' + data.filename, 'success');
          currentFile = data.filename;
          loadFileList();
        } else {
          setStatus('保存失败: ' + data.error, 'error');
        }
      })
      .catch(err => setStatus('保存失败: ' + err.message, 'error'));
    }

    function deleteFile(id, event) {
      event.stopPropagation();
      if (!confirm('确定要删除 ' + id + ' 吗？')) return;

      fetch('/api/markdowns/' + encodeURIComponent(id), { method: 'DELETE' })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setStatus('已删除', 'success');
            if (currentFile === id) newFile();
            else loadFileList();
          } else {
            setStatus('删除失败: ' + data.error, 'error');
          }
        })
        .catch(err => setStatus('删除失败: ' + err.message, 'error'));
    }

    function renderPreview() {
      fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markdown: markdownEl.value,
          theme: themeEl.value,
          title: titleEl.value
        })
      })
      .then(r => r.text())
      .then(html => {
        previewFrame.srcdoc = html;
      });
    }

    function downloadHtml() {
      fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markdown: markdownEl.value,
          theme: themeEl.value,
          title: titleEl.value
        })
      })
      .then(r => r.text())
      .then(html => {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = titleEl.value + '.html';
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    renderPreview();
    loadFileList();

    let timer;
    markdownEl.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(renderPreview, 500);
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveMarkdown();
      }
    });
  </script>
</body>
</html>`;
}

function getPreviewIndexHtml(dir: string): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>预览 - DeepTalk</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f7fa; color: #333; min-height: 100vh; }
    .header { background: #1a1a2e; color: white; padding: 1.5rem; text-align: center; }
    .header h1 { font-size: 1.5rem; }
    .container { max-width: 1000px; margin: 0 auto; padding: 2rem; }
    .list { display: flex; flex-direction: column; gap: 1rem; }
    .item { background: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); display: flex; justify-content: space-between; align-items: center; }
    .item h3 { font-size: 1rem; }
    .item .meta { font-size: 0.85rem; color: #666; }
    .btn { padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 6px; text-decoration: none; cursor: pointer; }
    .empty { text-align: center; padding: 3rem; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📄 文件预览</h1>
    <p style="opacity:0.7; font-size:0.9rem;">${dir}</p>
  </div>
  <div class="container">
    <div id="list" class="list"></div>
    <div id="empty" class="empty" style="display:none;">
      <p>目录为空</p>
    </div>
  </div>
  <script>
    fetch('/api/files')
      .then(r => r.json())
      .then(files => {
        const list = document.getElementById('list');
        const empty = document.getElementById('empty');
        if (files.length === 0) {
          empty.style.display = 'block';
          return;
        }
        list.innerHTML = files.map(f => \`
          <div class="item">
            <div>
              <h3>\${f.title}</h3>
              <div class="meta">\${f.type.toUpperCase()} · \${new Date(f.createdAt).toLocaleString('zh-CN')}</div>
            </div>
            <a href="/api/files/\${f.id}" class="btn" target="_blank">预览</a>
          </div>
        \`).join('');
      });
  </script>
</body>
</html>`;
}
