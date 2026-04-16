import { WeChatAPI } from '../src/wechat/api';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

async function publishArticle() {
  // 检查环境变量
  const appId = process.env.WECHAT_APP_ID;
  const appSecret = process.env.WECHAT_APP_SECRET;

  if (!appId || !appSecret) {
    console.error('错误：请设置 WECHAT_APP_ID 和 WECHAT_APP_SECRET 环境变量');
    process.exit(1);
  }

  // 获取文章文件路径
  const articlePath = process.argv[2];
  if (!articlePath) {
    console.error('用法: npx ts-node scripts/publish-article.ts <文章HTML路径>');
    process.exit(1);
  }

  // 读取文章HTML
  const htmlContent = fs.readFileSync(articlePath, 'utf-8');

  // 提取标题
  const titleMatch = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '') : '无标题文章';

  console.log(`准备发布文章: ${title}`);
  console.log(`文件路径: ${articlePath}`);

  // 初始化微信API
  const wechatAPI = new WeChatAPI({ appId, appSecret });

  try {
    // 获取封面图路径
    const coverImagePath = process.argv[3];
    let thumbMediaId: string | undefined;

    if (coverImagePath && fs.existsSync(coverImagePath)) {
      console.log(`上传封面图: ${coverImagePath}`);
      thumbMediaId = await wechatAPI.uploadImageFile(coverImagePath);
      console.log(`封面图上传成功, media_id: ${thumbMediaId}`);
    } else {
      console.log('未提供封面图，将创建无封面草稿');
    }

    // 生成摘要（限制54个字符以内，微信要求）
    const textContent = htmlContent
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const digest = textContent.slice(0, 54) + (textContent.length > 54 ? '...' : '');

    // 创建草稿
    console.log('创建草稿...');
    const mediaId = await wechatAPI.createDraft({
      title: title,
      content: htmlContent,
      thumb_media_id: thumbMediaId,
      digest: digest,
      need_open_comment: 1,
      only_fans_can_comment: 0,
    });

    console.log('\n✅ 草稿创建成功！');
    console.log(`📄 标题: ${title}`);
    console.log(`🆔 草稿ID: ${mediaId}`);
    if (thumbMediaId) {
      console.log(`🖼️ 封面图media_id: ${thumbMediaId}`);
    }
    console.log('\n您可以在微信公众号后台的"草稿箱"中查看和编辑这篇文章。');

  } catch (error) {
    console.error('\n❌ 发布失败:', error);
    process.exit(1);
  }
}

publishArticle();
