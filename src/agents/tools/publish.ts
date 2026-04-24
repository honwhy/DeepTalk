import { readFile } from 'fs/promises';
import OpenAI from 'openai';
import { getConfig } from '../../config';
import { WeChatAPI, ArticleDraft } from '../../wechat/api';

interface PublishParams {
  html: string;
  title: string;
  coverImage?: string;
  author?: string;
}

function getWeChatConfig(): { appId: string; appSecret: string } {
  const appId = process.env.WECHAT_APP_ID || '';
  const appSecret = process.env.WECHAT_APP_SECRET || '';

  if (!appId || !appSecret) {
    throw new Error('请设置 WECHAT_APP_ID 和 WECHAT_APP_SECRET 环境变量');
  }

  return { appId, appSecret };
}

export async function publishToWeChat(params: PublishParams): Promise<{ mediaId: string; success: boolean }> {
  const { html, title, coverImage, author } = params;
  const config = getWeChatConfig();

  let thumbMediaId: string | undefined;

  if (coverImage) {
    try {
      const wechatApi = new WeChatAPI(config);
      thumbMediaId = await wechatApi.uploadImageFromUrl(coverImage);
    } catch (error) {
      console.warn('封面图上传失败:', error);
    }
  }

  const article: ArticleDraft = {
    title,
    content: html,
    thumb_media_id: thumbMediaId,
    author: author || '',
  };

  const wechatApi = new WeChatAPI(config);
  const mediaId = await wechatApi.createDraft(article);

  return { mediaId, success: true };
}

export type { PublishParams };