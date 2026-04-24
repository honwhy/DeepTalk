import { fetchWeChatArticle, extractArticleTitle, extractArticleContent, extractAuthor, extractPublishDate, extractCoverImage } from '../../utils/fetcher';

interface FetchParams {
  url: string;
}

interface FetchResult {
  title: string;
  content: string;
  author?: string;
  publishDate?: string;
  coverImage?: string;
  url: string;
}

export async function fetchWeChat(params: FetchParams): Promise<FetchResult> {
  const { url } = params;

  const html = await fetchWeChatArticle(url);

  const title = extractArticleTitle(html) || '无标题';
  const content = extractArticleContent(html) || '';
  const author = extractAuthor(html) || undefined;
  const publishDate = extractPublishDate(html)?.toISOString() || undefined;
  const coverImage = extractCoverImage(html) || undefined;

  if (!content) {
    throw new Error('无法提取文章内容');
  }

  return {
    title,
    content,
    author,
    publishDate,
    coverImage,
    url,
  };
}

export type { FetchParams, FetchResult };