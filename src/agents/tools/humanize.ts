import { readFile } from 'fs/promises';
import { resolve } from 'path';
import OpenAI from 'openai';
import { getConfig } from '../../config';

interface HumanizeParams {
  content: string;
}

export async function humanizeText(params: HumanizeParams): Promise<string> {
  const { content } = params;
  const { apiKey, baseURL } = getConfig();

  const openai = new OpenAI({ apiKey, baseURL });

  const rulesPath = resolve('./.agents/skills/humanizer-zh/SKILL.md');
  const rules = await readFile(rulesPath, 'utf-8');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: rules },
      { role: 'user', content: `请修改以下文章，去除 AI 写作痕迹，使其更自然、像人类书写：\n\n${content}` }
    ],
    temperature: 0.5,
  });

  return response.choices[0].message.content || '';
}

export type { HumanizeParams };