import { program } from 'commander';
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { generateArticle } from './generators';
import { Category } from './types';
import { generateHtml, Theme, renderForWeChat, renderForWeChatCopy, WeChatTheme } from './skills';
import { startWebServer, startPreviewServer } from './web';
import { WeChatAPI, ArticleDraft, WeChatAPIError } from './wechat';

const OUTPUT_DIR = path.resolve(__dirname, '../output');
const CONTENTS_DIR = path.resolve(__dirname, '../contents');
const HTML_DIR = path.join(OUTPUT_DIR, 'html');

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

program
  .name('deeptalk')
  .description('基于大模型的专业公众号文章生成系统，支持 Markdown 转 HTML 和预览')
  .version('1.0.0');

// 生成文章命令
program
  .command('generate')
  .description('通过大模型生成文章')
  .requiredOption('-t, --topic <topic>', '文章主题')
  .option('-c, --category <category>', '文章分类 (tech|ai|invest)', 'tech')
  .option('-s, --style <style>', '写作风格 (professional|casual|academic)', 'professional')
  .option('-l, --length <length>', '文章长度 (short|medium|long)', 'medium')
  .option('--html', '同时生成 HTML 格式', false)
  .option('--theme <theme>', 'HTML 主题 (tech|minimal|business)', 'tech')
  .option('--contents', '保存到 contents 目录', false)
  .action(async (options) => {
    const { topic, category, style, length, html, theme, contents } = options;

    if (!['tech', 'ai', 'invest'].includes(category)) {
      console.error('错误: 分类必须是 tech、ai 或 invest');
      process.exit(1);
    }

    if (!['tech', 'minimal', 'business'].includes(theme)) {
      console.error('错误: 主题必须是 tech、minimal 或 business');
      process.exit(1);
    }

    console.log(`正在生成文章...`);
    console.log(`主题: ${topic}`);
    console.log(`分类: ${category}`);
    console.log(`风格: ${style}`);
    console.log(`长度: ${length}`);

    try {
      const article = await generateArticle({
        topic,
        category: category as Category,
        style,
        length,
      });

      console.log('\n文章生成成功！');
      console.log(`标题: ${article.title}`);
      console.log(`标签: ${article.tags.join(', ')}`);

      if (html || contents) {
        const targetDir = contents ? CONTENTS_DIR : HTML_DIR;
        ensureDir(targetDir);

        const htmlContent = generateHtml({
          title: article.title,
          content: article.content,
          summary: article.summary,
          category: article.category,
          tags: article.tags,
          createdAt: article.createdAt,
          theme: theme as Theme,
        });

        const timestamp = article.createdAt.toISOString().replace(/[:.]/g, '-');
        const safeTitle = article.title.substring(0, 20).replace(/[\\/:*?"<>|]/g, '');
        const filename = `${timestamp}_${article.category}_${safeTitle}.html`;
        const filepath = path.join(targetDir, filename);
        fs.writeFileSync(filepath, htmlContent, 'utf-8');

        console.log(`\n📄 HTML 已保存: ${filepath}`);
      }
    } catch (error) {
      console.error('生成失败:', error);
      process.exit(1);
    }
  });

// Markdown 转 HTML 命令
program
  .command('md2html')
  .description('将 Markdown 文件转换为 HTML')
  .requiredOption('-i, --input <file>', 'Markdown 文件路径')
  .option('-o, --output <dir>', '输出目录', CONTENTS_DIR)
  .option('-t, --theme <theme>', 'HTML 主题 (tech|minimal|business)', 'tech')
  .option('--title <title>', '文章标题（默认从文件读取）')
  .option('--open', '转换后自动在浏览器打开', false)
  .action((options) => {
    const { input, output, theme, title, open: shouldOpen } = options;

    if (!fs.existsSync(input)) {
      console.error(`错误: 文件不存在 ${input}`);
      process.exit(1);
    }

    if (!['tech', 'minimal', 'business'].includes(theme)) {
      console.error('错误: 主题必须是 tech、minimal 或 business');
      process.exit(1);
    }

    ensureDir(output);

    const mdContent = fs.readFileSync(input, 'utf-8');
    const articleTitle = title || extractTitle(mdContent) || path.basename(input, '.md');

    const htmlContent = generateHtml({
      title: articleTitle,
      content: mdContent,
      summary: '',
      category: 'article',
      tags: [],
      createdAt: new Date(),
      theme: theme as Theme,
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}_${articleTitle.substring(0, 20).replace(/[\\/:*?"<>|]/g, '')}.html`;
    const outputPath = path.join(output, filename);
    fs.writeFileSync(outputPath, htmlContent, 'utf-8');

    console.log(`\n✅ 转换成功！`);
    console.log(`📄 HTML 已保存: ${outputPath}`);

    if (shouldOpen) {
      const url = `file://${path.resolve(outputPath)}`;
      console.log(`\n🌐 打开: ${url}`);
      const { exec } = require('child_process');
      const platform = process.platform;
      if (platform === 'win32') {
        exec(`start "" "${outputPath}"`);
      } else if (platform === 'darwin') {
        exec(`open "${outputPath}"`);
      } else {
        exec(`xdg-open "${outputPath}"`);
      }
    }
  });

// 预览 Markdown 命令
program
  .command('preview-md')
  .description('预览 Markdown 文件（渲染为 HTML）')
  .requiredOption('-i, --input <file>', 'Markdown 文件路径')
  .option('-t, --theme <theme>', 'HTML 主题 (tech|minimal|business)', 'tech')
  .option('-p, --port <port>', '预览服务器端口', '3100')
  .action((options) => {
    const { input, theme, port } = options;

    if (!fs.existsSync(input)) {
      console.error(`错误: 文件不存在 ${input}`);
      process.exit(1);
    }

    startPreviewServer(parseInt(port, 10), 'markdown', {
      mdPath: input,
      theme: theme as Theme,
    });
  });

// 预览 HTML 命令
program
  .command('preview-html')
  .description('预览本地 HTML 文件或目录')
  .option('-i, --input <path>', 'HTML 文件或目录路径', CONTENTS_DIR)
  .option('-p, --port <port>', '预览服务器端口', '3200')
  .action((options) => {
    const { input, port } = options;

    if (!fs.existsSync(input)) {
      console.error(`错误: 路径不存在 ${input}`);
      process.exit(1);
    }

    const isDir = fs.statSync(input).isDirectory();
    startPreviewServer(parseInt(port, 10), isDir ? 'directory' : 'file', {
      path: input,
    });
  });

// Web 管理界面命令
program
  .command('web')
  .description('启动 Web 管理界面')
  .option('-p, --port <port>', '端口号', '3000')
  .option('-d, --dir <dir>', '内容目录', OUTPUT_DIR)
  .action((options) => {
    const port = parseInt(options.port, 10);
    startWebServer(port, options.dir);
  });

// 预览服务器命令（兼容旧命令）
program
  .command('preview')
  .description('启动预览服务器')
  .option('-p, --port <port>', '端口号', '3001')
  .action((options) => {
    const port = parseInt(options.port, 10);
    startPreviewServer(port, 'directory', { path: CONTENTS_DIR });
  });

function extractTitle(content: string): string {
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.startsWith('# ')) {
      return line.replace('# ', '').trim();
    }
  }
  return '';
}

// 公众号格式转换命令
program
  .command('wechat')
  .description('转换为公众号格式 HTML')
  .requiredOption('-i, --input <file>', 'Markdown 文件路径')
  .option('-o, --output <file>', '输出文件路径')
  .option('-t, --theme <theme>', '主题 (tech|business|minimal)', 'tech')
  .option('--title <title>', '文章标题')
  .option('--author <author>', '作者名称')
  .option('--copy', '生成可直接复制的内容（无 HTML/HEAD 标签）', false)
  .option('--open', '转换后自动在浏览器打开', false)
  .action((options) => {
    const { input, output, theme, title, author, copy, open: shouldOpen } = options;

    if (!fs.existsSync(input)) {
      console.error(`错误: 文件不存在 ${input}`);
      process.exit(1);
    }

    if (!['tech', 'business', 'minimal'].includes(theme)) {
      console.error('错误: 主题必须是 tech、business 或 minimal');
      process.exit(1);
    }

    const mdContent = fs.readFileSync(input, 'utf-8');
    const articleTitle = title || extractTitle(mdContent) || path.basename(input, '.md');

    const htmlContent = copy
      ? renderForWeChatCopy(mdContent, {
          title: articleTitle,
          author,
          theme: theme as WeChatTheme,
        })
      : renderForWeChat(mdContent, {
          title: articleTitle,
          author,
          theme: theme as WeChatTheme,
        });

    const outputPath = output || path.join(
      CONTENTS_DIR,
      `wechat_${articleTitle.substring(0, 20).replace(/[\\/:*?"<>|]/g, '')}.html`
    );

    ensureDir(path.dirname(outputPath));
    fs.writeFileSync(outputPath, htmlContent, 'utf-8');

    console.log(`\n✅ 公众号格式转换成功！`);
    console.log(`📄 HTML 已保存: ${outputPath}`);
    if (copy) {
      console.log(`📋 内容可直接复制到公众号编辑器`);
    }

    if (shouldOpen) {
      const { exec } = require('child_process');
      const platform = process.platform;
      if (platform === 'win32') {
        exec(`start "" "${outputPath}"`);
      } else if (platform === 'darwin') {
        exec(`open "${outputPath}"`);
      } else {
        exec(`xdg-open "${outputPath}"`);
      }
    }
  });

// 发布到公众号命令
program
  .command('publish')
  .description('发布文章到微信公众号草稿箱')
  .requiredOption('-i, --input <file>', 'Markdown 或 HTML 文件路径')
  .option('--title <title>', '文章标题')
  .option('--author <author>', '作者名称')
  .option('--digest <digest>', '摘要')
  .option('--thumb <file>', '封面图片路径')
  .option('--theme <theme>', '主题 (tech|business|minimal)', 'tech')
  .option('--publish', '直接发布（不保存为草稿）', false)
  .action(async (options) => {
    const { input, title, author, digest, thumb, theme, publish } = options;

    // 检查公众号配置
    const appId = process.env.WECHAT_APP_ID;
    const appSecret = process.env.WECHAT_APP_SECRET;

    if (!appId || !appSecret) {
      console.error('错误: 请在 .env 文件中配置 WECHAT_APP_ID 和 WECHAT_APP_SECRET');
      process.exit(1);
    }

    if (!fs.existsSync(input)) {
      console.error(`错误: 文件不存在 ${input}`);
      process.exit(1);
    }

    console.log('正在发布到公众号...');

    try {
      const api = new WeChatAPI({ appId, appSecret });
      const content = fs.readFileSync(input, 'utf-8');
      const articleTitle = title || extractTitle(content) || path.basename(input, '.md');

      // 如果是 Markdown，转换为公众号格式
      let htmlContent = content;
      if (input.endsWith('.md')) {
        htmlContent = renderForWeChatCopy(content, {
          title: articleTitle,
          author,
          theme: theme as WeChatTheme,
        });
      }

      // 上传封面图（如果有）
      let thumbMediaId: string | undefined;
      if (thumb && fs.existsSync(thumb)) {
        console.log('正在上传封面图片...');
        thumbMediaId = await api.uploadImageFile(thumb);
        console.log(`封面图片已上传: ${thumbMediaId}`);
      }

      // 创建草稿
      const article: ArticleDraft = {
        title: articleTitle,
        content: htmlContent,
        author,
        digest,
        thumb_media_id: thumbMediaId,
      };

      console.log('正在创建草稿...');
      const mediaId = await api.createDraft(article);
      console.log(`\n✅ 草稿创建成功！`);
      console.log(`📝 草稿 ID: ${mediaId}`);

      // 直接发布
      if (publish) {
        console.log('\n正在发布文章...');
        const publishId = await api.publishDraft(mediaId);
        console.log(`\n🎉 文章发布成功！`);
        console.log(`📢 发布 ID: ${publishId}`);
      } else {
        console.log('\n💡 使用 --publish 参数可直接发布文章');
      }
    } catch (error) {
      if (error instanceof WeChatAPIError) {
        console.error(`\n❌ 微信 API 错误 (${error.errcode}): ${error.errmsg}`);
      } else {
        console.error('\n❌ 发布失败:', error);
      }
      process.exit(1);
    }
  });

// 公众号草稿管理命令
program
  .command('drafts')
  .description('获取公众号草稿列表')
  .option('--offset <offset>', '偏移量', '0')
  .option('--count <count>', '数量', '10')
  .action(async (options) => {
    const appId = process.env.WECHAT_APP_ID;
    const appSecret = process.env.WECHAT_APP_SECRET;

    if (!appId || !appSecret) {
      console.error('错误: 请在 .env 文件中配置 WECHAT_APP_ID 和 WECHAT_APP_SECRET');
      process.exit(1);
    }

    try {
      const api = new WeChatAPI({ appId, appSecret });
      const result = await api.getDraftList(
        parseInt(options.offset, 10),
        parseInt(options.count, 10)
      );

      console.log('\n📝 草稿列表:\n');
      if (result.item && result.item.length > 0) {
        result.item.forEach((item: any, index: number) => {
          console.log(`${index + 1}. ${item.content.news_item[0].title}`);
          console.log(`   ID: ${item.media_id}`);
          console.log(`   更新: ${new Date(item.update_time * 1000).toLocaleString('zh-CN')}`);
          console.log('');
        });
      } else {
        console.log('暂无草稿');
      }

      console.log(`总计: ${result.total_count || 0} 篇`);
    } catch (error) {
      console.error('获取草稿列表失败:', error);
      process.exit(1);
    }
  });

program.parse();
