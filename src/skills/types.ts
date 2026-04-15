// 通用 HTML 主题
export type Theme = 'tech' | 'minimal' | 'business';

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
export type WeChatTheme = 'tech' | 'business' | 'minimal';

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
