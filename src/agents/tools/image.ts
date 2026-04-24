import { readFile } from 'fs/promises';
import axios from 'axios';

interface ImageUploadParams {
  filepath?: string;
  url?: string;
}

interface UploadResult {
  url: string;
  publicId: string;
}

function getCloudinaryConfig(): { cloudName: string; apiKey: string; apiSecret: string } {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
  const apiKey = process.env.CLOUDINARY_API_KEY || '';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || '';

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('请设置 CLOUDINARY_CLOUD_NAME、CLOUDINARY_API_KEY 和 CLOUDINARY_API_SECRET 环境变量');
  }

  return { cloudName, apiKey, apiSecret };
}

async function uploadToCloudinary(imageBuffer: Buffer, filename: string, config: { cloudName: string; apiKey: string; apiSecret: string }): Promise<UploadResult> {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = await generateSignature(config.cloudName, config.apiSecret, timestamp);

  const formData = new (require('form-data'))();
  formData.append('file', imageBuffer, filename);
  formData.append('api_key', config.apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', 'deeptalk/articles');

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    formData,
    {
      headers: formData.getHeaders(),
    }
  );

  return {
    url: response.data.secure_url,
    publicId: response.data.public_id,
  };
}

async function generateSignature(cloudName: string, apiSecret: string, timestamp: number): Promise<string> {
  const crypto = require('crypto');
  const signature = crypto.createHash('sha1').update(`timestamp=${timestamp}${apiSecret}`).digest('hex');
  return signature;
}

export async function uploadImage(params: ImageUploadParams): Promise<UploadResult> {
  const { filepath, url } = params;
  const config = getCloudinaryConfig();

  let imageBuffer: Buffer;
  let filename: string;

  if (filepath) {
    imageBuffer = await readFile(filepath);
    filename = filepath.split(/[/\\]/).pop() || 'image.jpg';
  } else if (url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    imageBuffer = Buffer.from(response.data);
    const urlParts = url.split('/');
    filename = urlParts[urlParts.length - 1] || 'image.jpg';
    if (!filename.includes('.')) {
      filename += '.jpg';
    }
  } else {
    throw new Error('请提供 filepath 或 url 参数');
  }

  return uploadToCloudinary(imageBuffer, filename, config);
}

export type { ImageUploadParams, UploadResult };