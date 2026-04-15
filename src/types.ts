export type Category = 'tech' | 'ai' | 'invest';

export interface ArticleConfig {
  topic: string;
  category: Category;
  style?: 'professional' | 'casual' | 'academic';
  length?: 'short' | 'medium' | 'long';
}

export interface Article {
  title: string;
  summary: string;
  content: string;
  category: Category;
  createdAt: Date;
  tags: string[];
}
