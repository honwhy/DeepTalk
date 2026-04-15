import OpenAI from 'openai';
import { Article, ArticleConfig, Category } from '../types';
import { buildSystemPrompt } from '../prompts';
import { getArticleTemplate } from '../templates';
import { saveArticle } from '../utils';
import { getConfig } from '../config';

export async function generateArticle(config: ArticleConfig): Promise<Article> {
  const { apiKey, baseURL } = getConfig();
  const openai = new OpenAI({ apiKey, baseURL });

  const systemPrompt = buildSystemPrompt(config.category);
  const template = getArticleTemplate(config);

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `请根据以下要求撰写一篇公众号文章：\n\n${template}` },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const content = response.choices[0]?.message?.content || '';
  const article = parseArticle(content, config);

  await saveArticle(article);

  return article;
}

function parseArticle(content: string, config: ArticleConfig): Article {
  const lines = content.split('\n');
  let title = '';
  let summary = '';
  let currentSection = 'content';
  let bodyLines: string[] = [];
  const tags: string[] = [];

  for (const line of lines) {
    if (line.startsWith('# ') && !title) {
      title = line.replace('# ', '').trim();
    } else if (line.startsWith('摘要：') || line.startsWith('摘要:')) {
      summary = line.replace(/摘要[：:]/, '').trim();
    } else if (line.startsWith('标签：') || line.startsWith('标签:')) {
      const tagStr = line.replace(/标签[：:]/, '').trim();
      tags.push(...tagStr.split(/[,，、]/).map((t) => t.trim()).filter(Boolean));
    } else {
      bodyLines.push(line);
    }
  }

  if (!title) {
    title = config.topic;
  }

  return {
    title,
    summary,
    content: bodyLines.join('\n').trim(),
    category: config.category,
    createdAt: new Date(),
    tags: tags.length > 0 ? tags : [config.category],
  };
}
