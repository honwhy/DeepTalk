import * as https from 'https';
import { URL } from 'url';
import * as zlib from 'zlib';

/**
 * 微信公众号文章抓取配置
 * 使用模拟微信客户端的请求头来绕过反爬机制
 */
const WECHAT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.30',
  'Referer': 'https://mp.weixin.qq.com/',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Cache-Control': 'max-age=0',
};

export interface FetchOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

/**
 * 抓取微信公众号文章
 * @param url 文章URL
 * @param options 可选配置
 * @returns 文章HTML内容
 */
export async function fetchWeChatArticle(url: string, options: FetchOptions = {}): Promise<string> {
  const { timeout = 30000, retries = 3 } = options;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const html = await fetchWithTimeout(url, timeout);
      return html;
    } catch (error) {
      lastError = error as Error;
      console.log(`抓取尝试 ${attempt}/${retries} 失败: ${lastError.message}`);

      if (attempt < retries) {
        // 指数退避重试
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await sleep(delay);
      }
    }
  }

  throw new Error(`抓取失败，已重试 ${retries} 次: ${lastError?.message}`);
}

/**
 * 带超时的HTTP请求
 */
function fetchWithTimeout(url: string, timeout: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);

    const request = https.get(
      {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        headers: WECHAT_HEADERS,
        timeout,
      },
      (response) => {
        // 处理重定向
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            console.log(`跟随重定向: ${redirectUrl}`);
            fetchWithTimeout(redirectUrl, timeout)
              .then(resolve)
              .catch(reject);
            return;
          }
        }

        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          return;
        }

        // 处理压缩编码
        const encoding = response.headers['content-encoding'];
        let stream: NodeJS.ReadableStream = response;

        if (encoding === 'gzip') {
          stream = response.pipe(zlib.createGunzip());
        } else if (encoding === 'deflate') {
          stream = response.pipe(zlib.createInflate());
        } else if (encoding === 'br') {
          stream = response.pipe(zlib.createBrotliDecompress());
        }

        let data = '';
        stream.setEncoding('utf8');
        stream.on('data', (chunk) => {
          data += chunk;
        });
        stream.on('end', () => {
          resolve(data);
        });
        stream.on('error', (err) => {
          reject(err);
        });
      }
    );

    request.on('timeout', () => {
      request.destroy();
      reject(new Error('请求超时'));
    });

    request.on('error', (err) => {
      reject(err);
    });

    request.end();
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 从HTML中提取文章标题
 */
export function extractArticleTitle(html: string): string | null {
  // 尝试多种标题提取方式
  const patterns = [
    /<h1[^>]*class="rich_media_title[^"]*"[^>]*>(.*?)<\/h1>/is,
    /<h1[^>]*>(.*?)<\/h1>/is,
    /<meta[^>]*property="og:title"[^>]*content="([^"]*)"/i,
    /<title>(.*?)<\/title>/is,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      // 清理HTML标签和空白
      return match[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();
    }
  }

  return null;
}

/**
 * 从HTML中提取文章内容
 */
export function extractArticleContent(html: string): string | null {
  // 尝试多种内容提取方式
  const patterns = [
    /<div[^>]*id="js_content"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i,
    /<div[^>]*class="rich_media_content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i,
    /<div[^>]*class="rich_media_content[^"]*"[^>]*>([\s\S]*?)<script/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return cleanHtmlContent(match[1]);
    }
  }

  return null;
}

/**
 * 清理HTML内容，转换为Markdown
 */
function cleanHtmlContent(html: string): string {
  return html
    // 移除脚本和样式
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // 移除微信文章末尾的提示信息容器
    .replace(/<div[^>]*id="js_a_[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*$/gi, '')
    .replace(/<div[^>]*class="[^"]*rich_media_tool[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="[^"]*rich_media_extra[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="[^"]*js_tags[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="[^"]*tag-card[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    // 转换常见标签
    .replace(/<p[^>]*>/gi, '\n\n')
    .replace(/<\/p>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<h1[^>]*>/gi, '\n\n# ')
    .replace(/<h2[^>]*>/gi, '\n\n## ')
    .replace(/<h3[^>]*>/gi, '\n\n### ')
    .replace(/<h4[^>]*>/gi, '\n\n#### ')
    .replace(/<\/h[1-4]>/gi, '\n')
    .replace(/<strong[^>]*>|<b[^>]*>/gi, '**')
    .replace(/<\/strong>|<\/b>/gi, '**')
    .replace(/<em[^>]*>|<i[^>]*>/gi, '*')
    .replace(/<\/em>|<\/i>/gi, '*')
    // 处理图片
    .replace(/<img[^>]*data-src="([^"]*)"[^>]*>/gi, '\n\n![图片]($1)\n\n')
    .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '\n\n![图片]($1)\n\n')
    // 处理链接
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    // 移除其他标签
    .replace(/<[^>]+>/g, '')
    // 解码HTML实体
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    // 清理多余空白
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    // 移除微信文章末尾常见的提示文字
    .replace(/[\s]*预览时标签不可点.*$/gi, '')
    .replace(/[\s]*阅读原文.*$/gi, '')
    .replace(/[\s]*点个"在看".*$/gi, '')
    .replace(/[\s]*点击下方"阅读原文".*$/gi, '')
    .replace(/[\s]*收录于话题.*$/gi, '')
    // 再次清理末尾空白
    .trim();
}

/**
 * 从HTML中提取发布日期
 */
export function extractPublishDate(html: string): Date | null {
  const patterns = [
    /<em[^>]*id="publish_time"[^>]*>(.*?)<\/em>/i,
    /<span[^>]*class="publish_time[^"]*"[^>]*>(.*?)<\/span>/i,
    /<meta[^>]*name="publish_time"[^>]*content="([^"]*)"/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const dateStr = match[1].trim();
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  return null;
}

/**
 * 从HTML中提取作者信息
 */
export function extractAuthor(html: string): string | null {
  const patterns = [
    /<a[^>]*id="js_name"[^>]*>(.*?)<\/a>/i,
    /<span[^>]*class="profile_nickname[^"]*"[^>]*>(.*?)<\/span>/i,
    /<meta[^>]*name="author"[^>]*content="([^"]*)"/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return match[1]
        .replace(/<[^>]+>/g, '')
        .trim();
    }
  }

  return null;
}

/**
 * 提取文章封面图片
 */
export function extractCoverImage(html: string): string | null {
  const patterns = [
    /<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i,
    /<img[^>]*class="rich_media_thumb[^"]*"[^>]*data-src="([^"]*)"/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}
