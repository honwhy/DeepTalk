import { readFile } from 'fs/promises';
import { resolve } from 'path';
import OpenAI from 'openai';
import { getConfig } from '../../config';

const themes = ['tech', 'business', 'claude', 'minimal', 'dark-finance', 'standard', 'neo-brutalist', 'luxury-editorial', 'japanese-zen', 'vintage-newspaper'];

interface RenderParams {
  content: string;
  theme?: string;
  title?: string;
}

async function loadDesignSystem(theme: string): Promise<string> {
  const themeName = theme === 'auto' ? 'tech' : theme;
  const themePath = resolve(`./.agents/skills/wechat-article/design-system/references/${themeName}/DESIGN.md`);
  try {
    return await readFile(themePath, 'utf-8');
  } catch {
    const fallbackPath = resolve('./.agents/skills/wechat-article/design-system/references/tech/DESIGN.md');
    return await readFile(fallbackPath, 'utf-8');
  }
}

async function buildRenderPrompt(designDoc: string, cssSpec: string, theme: string, title?: string): Promise<string> {
  const themeInstruction = theme === 'auto' 
    ? '根据内容自动选择最合适的主题'
    : `使用 ${theme} 主题`;

  return `你是一个专业的公众号文章排版专家。

## 设计系统规范（必须严格遵循）

${designDoc}

## 技术规范（微信公众号兼容内联 CSS）

${cssSpec}

## 任务

将输入的 Markdown 转换为微信公众号兼容的 HTML：
1. 所有 CSS 必须是内联样式（style="属性:值"）
2. 不使用 <style> 标签
3. 不使用 <div> 标签，使用 <section> 替代
4. 代码使用 <pre><code> 标签包裹，style="background:#f5f5f5;padding:12px;border-radius:4px;font-family:monospace;"
5. 标题使用 <h2> 或 <h3>，加粗
6. 段落使用 <p>，行高 1.6
7. 图片使用 <img>，最大宽度 100%

## 主题

${themeInstruction}

${title ? `## 标题\n${title}` : ''}

## 输出格式

直接输出完整的 HTML 字符串，不需要代码块包裹。`;
}

export async function renderHtml(params: RenderParams): Promise<string> {
  const { content, theme = 'auto', title } = params;
  const { apiKey, baseURL } = getConfig();
  
  const openai = new OpenAI({ apiKey, baseURL });

  const designDoc = await loadDesignSystem(theme);
  const cssSpecPath = resolve('./.agents/skills/wechat-article/HTML-CSS-SPEC.md');
  const cssSpec = await readFile(cssSpecPath, 'utf-8');

  const systemPrompt = await buildRenderPrompt(designDoc, cssSpec, theme, title);

  const response = await openai.chat.completions.create({
    model: 'deepseek-v4-flash',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `请将以下 Markdown 转换为公众号 HTML：\n\n${content}` }
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content || '';
}

export { themes };
export type { RenderParams };