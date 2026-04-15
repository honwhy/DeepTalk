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
  const dir = (req.query.dir as string) || CONTENTS_DIR;
  const files = getFileList(dir);
  res.json(files);
});

// API 路由 - 获取单个文件
app.get('/api/files/:id', (req: Request, res: Response) => {
  const dir = (req.query.dir as string) || CONTENTS_DIR;
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
  const dir = (req.query.dir as string) || CONTENTS_DIR;
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
app.use('/static', express.static(CONTENTS_DIR));
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
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f5f7fa;
      color: #333;
      min-height: 100vh;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    .header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .header p { opacity: 0.9; }
    .nav { display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; }
    .nav a { color: white; text-decoration: none; padding: 0.5rem 1rem; background: rgba(255,255,255,0.2); border-radius: 6px; }
    .nav a:hover { background: rgba(255,255,255,0.3); }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
    .tab { padding: 0.5rem 1rem; border: none; background: #e8e8e8; border-radius: 6px; cursor: pointer; }
    .tab.active { background: #667eea; color: white; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover { transform: translateY(-4px); box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
    .card h3 { font-size: 1.1rem; margin-bottom: 0.75rem; color: #1a1a2e; }
    .card .meta { display: flex; gap: 1rem; font-size: 0.85rem; color: #666; margin-bottom: 1rem; }
    .card .type { padding: 0.25rem 0.75rem; background: #e8f4f8; color: #2d5a7b; border-radius: 9999px; font-size: 0.8rem; }
    .card .actions { display: flex; gap: 0.5rem; }
    .btn { padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; text-decoration: none; display: inline-block; }
    .btn-primary { background: #667eea; color: white; }
    .btn-secondary { background: #e8e8e8; color: #333; }
    .btn-wechat { background: #07c160; color: white; }
    .btn:hover { opacity: 0.9; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .empty { text-align: center; padding: 4rem 2rem; color: #666; }
    .copy-toast {
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      background: #07c160; color: white; padding: 12px 24px;
      border-radius: 8px; z-index: 9999; opacity: 0; transition: opacity 0.3s;
    }
    .copy-toast.show { opacity: 1; }
  </style>
</head>
<body>
  <div class="header">
    <h1>深言 DeepTalk</h1>
    <p>Markdown 转 HTML 工具 | 文章生成与预览</p>
    <div class="nav">
      <a href="/">文章列表</a>
      <a href="/editor">Markdown 编辑器</a>
    </div>
  </div>
  <div class="container">
    <div id="files" class="grid"></div>
    <div id="empty" class="empty" style="display:none;">
      <h3>暂无内容</h3>
      <p>使用 <code>npm run md2html -- -i file.md</code> 转换 Markdown</p>
      <p>或使用 <code>npm run generate -- -t "主题"</code> 生成文章</p>
    </div>
  </div>
  <div id="toast" class="copy-toast">已复制到剪贴板</div>
  <!-- 隐藏元素用于复制功能 -->
  <input type="text" id="copyInput" style="position: absolute; left: -9999px;">
  <script>
    // 复制公众号格式到剪贴板（使用 Clipboard API）
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

        // 使用现代 Clipboard API 复制 HTML
        const htmlContent = data.html;
        // text/plain 使用空字符串，避免粘贴时出现标题
        const plainText = '';

        // 创建一个包含 HTML 的 blob
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        const textBlob = new Blob([plainText], { type: 'text/plain' });

        // 使用 ClipboardItem 同时设置多种格式
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
      toast.style.background = isError ? '#dc3545' : '#07c160';
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
              <span class="type">\${f.type.toUpperCase()}</span>
              <span>\${new Date(f.createdAt).toLocaleDateString('zh-CN')}</span>
            </div>
            <div class="actions">
              <a href="/api/files/\${f.id}" class="btn btn-primary" target="_blank">预览</a>
              <button class="btn btn-wechat" onclick="copyWeChatFormat('\${f.id}')">复制公众号格式</button>
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
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #1a1a2e; color: #fff; height: 100vh; display: flex; flex-direction: column; }
    .toolbar { display: flex; gap: 1rem; padding: 1rem; background: #161b22; align-items: center; flex-wrap: wrap; }
    .toolbar h1 { font-size: 1.2rem; }
    .toolbar select, .toolbar button, .toolbar input { padding: 0.5rem 1rem; border: none; border-radius: 6px; font-size: 0.9rem; }
    .toolbar select { background: #30363d; color: #c9d1d9; }
    .toolbar button { background: #667eea; color: white; cursor: pointer; }
    .toolbar button:hover { opacity: 0.9; }
    .toolbar button.secondary { background: #30363d; }
    .toolbar button.danger { background: #dc3545; }
    .toolbar input { background: #30363d; color: #c9d1d9; width: 180px; }
    .toolbar input#filename { width: 150px; }
    .main { display: flex; flex: 1; overflow: hidden; }
    .sidebar { width: 250px; background: #0d1117; border-right: 1px solid #30363d; display: flex; flex-direction: column; }
    .sidebar h3 { padding: 1rem; font-size: 0.9rem; color: #8b949e; border-bottom: 1px solid #30363d; }
    .file-list { flex: 1; overflow-y: auto; }
    .file-item { padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid #21262d; display: flex; justify-content: space-between; align-items: center; }
    .file-item:hover { background: #161b22; }
    .file-item.active { background: #1f6feb; }
    .file-item .name { font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
    .file-item .delete { opacity: 0; color: #f85149; font-size: 0.8rem; padding: 0.2rem 0.4rem; }
    .file-item:hover .delete { opacity: 1; }
    .file-item .delete:hover { background: #f85149; color: white; border-radius: 4px; }
    .editor { flex: 1; display: flex; flex-direction: column; border-right: 1px solid #30363d; }
    .editor textarea { flex: 1; background: #0d1117; color: #c9d1d9; border: none; padding: 1rem; font-family: 'Fira Code', monospace; font-size: 14px; resize: none; }
    .preview { flex: 1; background: #fff; color: #333; overflow: auto; }
    .preview iframe { width: 100%; height: 100%; border: none; }
    .status { padding: 0.5rem 1rem; background: #161b22; border-top: 1px solid #30363d; font-size: 0.8rem; color: #8b949e; }
    .status.success { color: #3fb950; }
    .status.error { color: #f85149; }
  </style>
</head>
<body>
  <div class="toolbar">
    <h1>📝 Markdown 编辑器</h1>
    <label>主题:
      <select id="theme">
        <option value="tech">Tech (深色)</option>
        <option value="minimal">Minimal (简约)</option>
        <option value="business">Business (商务)</option>
      </select>
    </label>
    <input id="title" placeholder="文章标题" value="Preview">
    <input id="filename" placeholder="文件名" value="">
    <button onclick="saveMarkdown()">💾 保存</button>
    <button onclick="newFile()" class="secondary">新建</button>
    <button onclick="renderPreview()">刷新预览</button>
    <button onclick="downloadHtml()">下载 HTML</button>
    <a href="/" style="color: #667eea; text-decoration: none; margin-left: auto;">返回列表</a>
  </div>
  <div class="main">
    <div class="sidebar">
      <h3>📁 Markdown 文件</h3>
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

    // 初始渲染和加载文件列表
    renderPreview();
    loadFileList();

    // 输入时自动预览（防抖）
    let timer;
    markdownEl.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(renderPreview, 500);
    });

    // Ctrl+S 保存
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
