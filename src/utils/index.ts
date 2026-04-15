import * as fs from 'fs';
import * as path from 'path';
import { Article } from '../types';

const OUTPUT_DIR = path.resolve(__dirname, '../../output');

export function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

export async function saveArticle(article: Article): Promise<string> {
  ensureOutputDir();

  const timestamp = article.createdAt.toISOString().replace(/[:.]/g, '-');
  const filename = `${timestamp}_${article.category}_${article.title.substring(0, 20).replace(/[\\/:*?"<>|]/g, '')}.md`;
  const filepath = path.join(OUTPUT_DIR, filename);

  const content = formatArticle(article);
  fs.writeFileSync(filepath, content, 'utf-8');

  return filepath;
}

function formatArticle(article: Article): string {
  return `# ${article.title}

> 分类：${article.category} | 创建时间：${article.createdAt.toLocaleString('zh-CN')}

**摘要**：${article.summary}

---

${article.content}

---

**标签**：${article.tags.join('、')}
`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
