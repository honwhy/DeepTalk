import { readFile } from 'fs/promises';
import { resolve } from 'path';
import OpenAI from 'openai';
import { getConfig } from '../../config';

const templates = ['tutorial', 'analysis', 'news', 'story', 'listicle', 'review', 'auto'];

interface FormatParams {
  content: string;
  template?: string;
}

async function loadTemplate(template: string): Promise<string> {
  const templatePath = resolve(`./.agents/skills/wechat-article/SKILL.md`);
  return await readFile(templatePath, 'utf-8');
}

async function buildFormatPrompt(templateDoc: string, template: string): Promise<string> {
  const templateInstruction = template === 'auto'
    ? '根据文章内容自动选择最合适的模板结构'
    : `使用 ${template} 模板结构`;

  return `你是一个公众号文章结构专家。

## 模板定义

${templateDoc}

## 任务

优化以下文章的结构：
1. 按照 ${templateInstruction} 组织内容
2. 确保文章结构清晰，逻辑连贯
3. 保持 Markdown 格式规范
4. 适当添加过渡段落

## 输入文章

`;
}

export async function formatMarkdown(params: FormatParams): Promise<string> {
  const { content, template = 'auto' } = params;
  const { apiKey, baseURL } = getConfig();

  const openai = new OpenAI({ apiKey, baseURL });

  const templateDoc = await loadTemplate(template);
  const systemPrompt = await buildFormatPrompt(templateDoc, template);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: content }
    ],
    temperature: 0.5,
  });

  return response.choices[0].message.content || '';
}

export { templates };
export type { FormatParams };