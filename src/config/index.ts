import * as dotenv from 'dotenv';

dotenv.config();

interface Config {
  apiKey: string;
  baseURL: string;
}

export function getConfig(): Config {
  const apiKey = process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY || '';
  const baseURL = process.env.OPENAI_BASE_URL || process.env.DEEPSEEK_BASE_URL || 'https://api.openai.com/v1';

  if (!apiKey) {
    throw new Error('请设置 OPENAI_API_KEY 或 DEEPSEEK_API_KEY 环境变量');
  }

  return { apiKey, baseURL };
}
