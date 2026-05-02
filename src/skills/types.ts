// 通用 HTML 主题
export type Theme = 'airbnb' | 'apple' | 'binance' | 'claude' | 'coinbase' | 'japanese-zen' | 'luxury-editorial' | 'mastercard' | 'neo-brutalist' | 'notion' | 'opencode.ai' | 'pinterest' | 'shopify' | 'spacex' | 'standard' | 'stripe' | 'vercel' | 'vintage-newspaper';

export interface HtmlArticleConfig {
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  createdAt: Date;
  theme?: Theme;
}

// 公众号专用主题
export type WeChatTheme = 'airbnb' | 'apple' | 'binance' | 'claude' | 'coinbase' | 'japanese-zen' | 'luxury-editorial' | 'mastercard' | 'neo-brutalist' | 'notion' | 'opencode.ai' | 'pinterest' | 'shopify' | 'spacex' | 'standard' | 'stripe' | 'vercel' | 'vintage-newspaper';

export interface WeChatRenderOptions {
  theme?: WeChatTheme;
  title?: string;
  author?: string;
  customStyles?: string;
}

export interface WeChatArticle {
  title: string;
  content: string;
  thumbMediaId?: string;
  author?: string;
  digest?: string;
  contentSourceUrl?: string;
  needOpenComment?: number;
  onlyFansCanComment?: number;
}
