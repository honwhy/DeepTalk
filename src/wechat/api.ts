import axios from 'axios';

const WECHAT_API_BASE = 'https://api.weixin.qq.com/cgi-bin';

export interface WeChatConfig {
  appId: string;
  appSecret: string;
}

export interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  errcode?: number;
  errmsg?: string;
}

export interface MediaResponse {
  media_id: string;
  url?: string;
  errcode?: number;
  errmsg?: string;
}

export interface DraftResponse {
  media_id: string;
  errcode?: number;
  errmsg?: string;
}

export interface ArticleDraft {
  title: string;
  content: string;
  thumb_media_id?: string;
  author?: string;
  digest?: string;
  content_source_url?: string;
  need_open_comment?: number;
  only_fans_can_comment?: number;
}

export interface PublishResponse {
  publish_id: string;
  msg_data_id: string;
  errcode?: number;
  errmsg?: string;
}

/**
 * 微信公众号 API 客户端
 * 文档：https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
 */
export class WeChatAPI {
  private appId: string;
  private appSecret: string;
  private accessToken: string | null = null;
  private expiresAt: number = 0;

  constructor(config: WeChatConfig) {
    this.appId = config.appId;
    this.appSecret = config.appSecret;
  }

  /**
   * 获取 access_token
   * access_token 有效期 2 小时，需要缓存
   */
  async getAccessToken(): Promise<string> {
    // 如果 token 未过期，直接返回
    if (this.accessToken && Date.now() < this.expiresAt) {
      return this.accessToken;
    }

    const url = `${WECHAT_API_BASE}/token?grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`;

    const response = await axios.get<AccessTokenResponse>(url);
    const data = response.data;

    if (data.errcode) {
      throw new WeChatAPIError(data.errcode, data.errmsg || '获取 access_token 失败');
    }

    this.accessToken = data.access_token;
    // 提前 5 分钟过期，避免临界情况
    this.expiresAt = Date.now() + (data.expires_in - 300) * 1000;

    return this.accessToken;
  }

  /**
   * 上传图片素材
   * @param imageBuffer 图片二进制数据
   * @param filename 文件名
   * @returns media_id
   */
  async uploadImage(imageBuffer: Buffer, filename: string): Promise<string> {
    const token = await this.getAccessToken();
    const url = `${WECHAT_API_BASE}/material/add_material?access_token=${token}&type=image`;

    const FormData = require('form-data');
    const form = new FormData();
    form.append('media', imageBuffer, {
      filename,
      contentType: 'image/jpeg',
    });

    const response = await axios.post<MediaResponse>(url, form, {
      headers: form.getHeaders(),
    });

    const data = response.data;
    if (data.errcode) {
      throw new WeChatAPIError(data.errcode, data.errmsg || '上传图片失败');
    }

    return data.media_id;
  }

  /**
   * 上传本地图片文件
   */
  async uploadImageFile(filepath: string): Promise<string> {
    const fs = require('fs');
    const imageBuffer = fs.readFileSync(filepath);
    const filename = filepath.split('/').pop() || 'image.jpg';
    return this.uploadImage(imageBuffer, filename);
  }

  /**
   * 创建草稿
   * @param article 文章内容
   * @returns media_id 草稿 ID
   */
  async createDraft(article: ArticleDraft): Promise<string> {
    const token = await this.getAccessToken();
    const url = `${WECHAT_API_BASE}/draft/add?access_token=${token}`;

    const response = await axios.post<DraftResponse>(url, {
      articles: [article],
    });

    const data = response.data;
    if (data.errcode) {
      throw new WeChatAPIError(data.errcode, data.errmsg || '创建草稿失败');
    }

    return data.media_id;
  }

  /**
   * 批量创建草稿（多图文）
   */
  async createDraftBatch(articles: ArticleDraft[]): Promise<string> {
    const token = await this.getAccessToken();
    const url = `${WECHAT_API_BASE}/draft/add?access_token=${token}`;

    const response = await axios.post<DraftResponse>(url, {
      articles,
    });

    const data = response.data;
    if (data.errcode) {
      throw new WeChatAPIError(data.errcode, data.errmsg || '创建草稿失败');
    }

    return data.media_id;
  }

  /**
   * 发布草稿
   * @param mediaId 草稿 ID
   * @returns publish_id 发布任务 ID
   */
  async publishDraft(mediaId: string): Promise<string> {
    const token = await this.getAccessToken();
    const url = `${WECHAT_API_BASE}/freepublish/submit?access_token=${token}`;

    const response = await axios.post<PublishResponse>(url, {
      media_id: mediaId,
    });

    const data = response.data;
    if (data.errcode) {
      throw new WeChatAPIError(data.errcode, data.errmsg || '发布失败');
    }

    return data.publish_id;
  }

  /**
   * 获取草稿列表
   */
  async getDraftList(offset: number = 0, count: number = 10): Promise<any> {
    const token = await this.getAccessToken();
    const url = `${WECHAT_API_BASE}/draft/batchget?access_token=${token}`;

    const response = await axios.post(url, {
      offset,
      count,
      no_content: 0,
    });

    return response.data;
  }

  /**
   * 删除草稿
   */
  async deleteDraft(mediaId: string): Promise<void> {
    const token = await this.getAccessToken();
    const url = `${WECHAT_API_BASE}/draft/delete?access_token=${token}`;

    const response = await axios.post(url, {
      media_id: mediaId,
    });

    const data = response.data;
    if (data.errcode) {
      throw new WeChatAPIError(data.errcode, data.errmsg || '删除草稿失败');
    }
  }

  /**
   * 获取发布状态
   */
  async getPublishStatus(publishId: string): Promise<any> {
    const token = await this.getAccessToken();
    const url = `${WECHAT_API_BASE}/freepublish/get?access_token=${token}`;

    const response = await axios.post(url, {
      publish_id: publishId,
    });

    return response.data;
  }
}

/**
 * 微信 API 错误类
 */
export class WeChatAPIError extends Error {
  constructor(
    public errcode: number,
    public errmsg: string
  ) {
    super(`WeChat API Error (${errcode}): ${errmsg}`);
    this.name = 'WeChatAPIError';
  }
}

/**
 * 错误码说明
 * https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Global_Return_Code.html
 */
export const WeChatErrorCodes: Record<number, string> = {
  40001: 'AppSecret 错误或者 AppSecret 不属于这个公众号',
  40002: '请确保 grant_type 字段值为 client_credential',
  40013: '不合法的 AppID',
  40014: '不合法的 access_token',
  42001: 'access_token 超时',
  42002: 'refresh_token 超时',
  45009: '接口调用超过限制',
  47001: '解析 JSON/XML 内容错误',
};
