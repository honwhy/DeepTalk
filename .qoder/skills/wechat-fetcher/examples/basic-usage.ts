/**
 * WeChat Article Fetcher - Basic Usage Examples
 *
 * 基础使用示例
 */

import {
  fetchWeChatArticle,
  extractArticleTitle,
  extractArticleContent,
  extractAuthor,
  extractPublishDate,
  extractCoverImage,
  FetchOptions,
} from '../../../src/utils/fetcher';

// ============================================
// 示例 1: 基本抓取
// ============================================
async function basicFetch() {
  const url = 'https://mp.weixin.qq.com/s/kBI_ArHIVAJCRWR4tgET9g';

  try {
    console.log('正在抓取文章...');
    const html = await fetchWeChatArticle(url);

    console.log('抓取成功！');
    console.log(`HTML 长度: ${html.length} 字符`);

    return html;
  } catch (error) {
    console.error('抓取失败:', error);
    throw error;
  }
}

// ============================================
// 示例 2: 提取文章信息
// ============================================
async function extractInfo() {
  const url = 'https://mp.weixin.qq.com/s/kBI_ArHIVAJCRWR4tgET9g';

  try {
    const html = await fetchWeChatArticle(url);

    // 提取各种信息
    const title = extractArticleTitle(html);
    const content = extractArticleContent(html);
    const author = extractAuthor(html);
    const publishDate = extractPublishDate(html);
    const coverImage = extractCoverImage(html);

    console.log('文章信息:');
    console.log(`  标题: ${title}`);
    console.log(`  作者: ${author}`);
    console.log(`  发布时间: ${publishDate?.toLocaleDateString('zh-CN')}`);
    console.log(`  封面图: ${coverImage}`);
    console.log(`  内容长度: ${content?.length} 字符`);

    return {
      title,
      content,
      author,
      publishDate,
      coverImage,
    };
  } catch (error) {
    console.error('提取失败:', error);
    throw error;
  }
}

// ============================================
// 示例 3: 自定义选项
// ============================================
async function customOptions() {
  const url = 'https://mp.weixin.qq.com/s/kBI_ArHIVAJCRWR4tgET9g';

  const options: FetchOptions = {
    timeout: 60000,      // 60 秒超时
    retries: 5,          // 重试 5 次
    headers: {
      // 自定义请求头（会合并到默认请求头）
      'Cookie': 'your-cookie-here',
    },
  };

  try {
    const html = await fetchWeChatArticle(url, options);
    console.log('使用自定义选项抓取成功');
    return html;
  } catch (error) {
    console.error('抓取失败:', error);
    throw error;
  }
}

// ============================================
// 示例 4: 批量抓取
// ============================================
async function batchFetch(urls: string[]) {
  const results = [];
  const errors = [];

  for (const url of urls) {
    try {
      console.log(`\n抓取: ${url}`);
      const html = await fetchWeChatArticle(url);
      const title = extractArticleTitle(html);

      results.push({
        url,
        title,
        success: true,
      });

      // 添加延迟，避免请求过快
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      errors.push({
        url,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  console.log('\n===== 批量抓取结果 =====');
  console.log(`成功: ${results.length} 篇`);
  console.log(`失败: ${errors.length} 篇`);

  if (errors.length > 0) {
    console.log('\n失败的 URL:');
    errors.forEach(e => console.log(`  - ${e.url}: ${e.error}`));
  }

  return { results, errors };
}

// ============================================
// 示例 5: 生成 Markdown
// ============================================
async function generateMarkdown(url: string): Promise<string> {
  const html = await fetchWeChatArticle(url);

  const title = extractArticleTitle(html);
  const content = extractArticleContent(html);
  const author = extractAuthor(html);
  const publishDate = extractPublishDate(html);

  if (!title || !content) {
    throw new Error('无法提取文章标题或内容');
  }

  const markdown = `# ${title}

> 原文链接: ${url}
> ${author ? `作者: ${author}` : ''}${author && publishDate ? ' | ' : ''}${publishDate ? `发布时间: ${publishDate.toLocaleDateString('zh-CN')}` : ''}

---

${content}
`;

  return markdown;
}

// ============================================
// 运行示例
// ============================================
async function main() {
  console.log('===== WeChat Article Fetcher 示例 =====\n');

  // 选择要运行的示例
  const example = process.argv[2] || 'basic';

  switch (example) {
    case 'basic':
      await basicFetch();
      break;
    case 'info':
      await extractInfo();
      break;
    case 'custom':
      await customOptions();
      break;
    case 'batch':
      // 批量抓取示例 URL
      await batchFetch([
        'https://mp.weixin.qq.com/s/xxx1',
        'https://mp.weixin.qq.com/s/xxx2',
        'https://mp.weixin.qq.com/s/xxx3',
      ]);
      break;
    case 'markdown':
      const md = await generateMarkdown('https://mp.weixin.qq.com/s/kBI_ArHIVAJCRWR4tgET9g');
      console.log('\n生成的 Markdown:');
      console.log(md.substring(0, 500) + '...');
      break;
    default:
      console.log('可用的示例:');
      console.log('  basic    - 基本抓取');
      console.log('  info     - 提取文章信息');
      console.log('  custom   - 自定义选项');
      console.log('  batch    - 批量抓取');
      console.log('  markdown - 生成 Markdown');
  }
}

// 如果直接运行此文件
if (require.main === module) {
  main().catch(console.error);
}

export {
  basicFetch,
  extractInfo,
  customOptions,
  batchFetch,
  generateMarkdown,
};
