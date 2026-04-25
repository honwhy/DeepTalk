export type Category = 'tech' | 'ai' | 'invest';

export type TemplateType = 'tutorial' | 'analysis' | 'news' | 'story' | 'listicle' | 'review' | 'auto';
export type ThemeType = 'airbnb' | 'apple' | 'binance' | 'claude' | 'coinbase' | 'japanese-zen' | 'luxury-editorial' | 'mastercard' | 'neo-brutalist' | 'notion' | 'opencode.ai' | 'spacex' | 'standard' | 'stripe' | 'vercel' | 'vintage-newspaper' | 'auto';

export interface ArticleConfig {
  topic: string;
  category: Category;
  style?: 'professional' | 'casual' | 'academic';
  length?: 'short' | 'medium' | 'long';
  template?: TemplateType;
  theme?: ThemeType;
  content?: string;
}

export interface Article {
  title: string;
  summary: string;
  content: string;
  category: Category;
  createdAt: Date;
  tags: string[];
}
