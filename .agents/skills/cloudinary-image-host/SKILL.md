---
name: cloudinary-image-host
description: |
  将本地图片上传到 Cloudinary，获取永久 HTTP 链接，用于替换文章中的本地图片引用。
  支持单张图片上传、从文章提取图片、目录扫描三种模式，自动替换图片引用。
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
metadata:
  trigger: 上传本地图片到 Cloudinary，获取永久链接
  category: image-hosting
  version: 1.0.0
---

# Cloudinary Image Host Skill

将本地图片上传到 Cloudinary，获取永久 HTTP 链接，用于替换文章中的本地图片引用。

## Purpose

为 `markdowns/` 和 `contents/` 目录下的本地图片生成永久可访问的 Cloudinary 链接。主要用途：

1. **永久链接**: 将本地图片转换为永久 HTTP 链接
2. **文章发布**: 替换文章中的本地图片引用为 Cloudinary 链接
3. **图片托管**: 使用 Cloudinary 作为可靠的图片托管服务
4. **图片优化**: 自动压缩和优化图片

## Input

### 输入模式（三选一）

| 模式 | 参数 | 必填 | 说明 |
|------|------|------|------|
| **单张图片** | `image` | 是 | 直接指定图片文件路径 |
| **文章提取** | `article` | 是 | 指定 Markdown/HTML 文件，提取其中的本地图片 |
| **目录扫描** | `directory` | 是 | 扫描目录，列出所有本地图片供选择 |

### 通用参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `replace` | boolean | 否 | 是否自动替换原文件中的图片引用，默认 `false` |
| `backup` | boolean | 否 | 替换时是否创建备份，默认 `true` |
| `output` | string | 否 | 输出文件路径（仅替换模式有效） |
| `dry-run` | boolean | 否 | 试运行模式，仅扫描不上传，默认 `false` |
| `max-uploads` | number | 否 | 最大上传数量，防止超限，默认 `10` |
| `folder` | string | 否 | Cloudinary 中的文件夹路径，默认 `deeptalk/articles` |

### 示例

```bash
# 模式1：上传单张图片
使用 cloudinary-image-host 技能 --image "./contents/images/ev-battery.png"

# 模式2：从文章提取图片
使用 cloudinary-image-host 技能 --article "./markdowns/春节后新能源汽车观察.md"

# 模式3：扫描目录
使用 cloudinary-image-host 技能 --directory "./contents/images/"
```

## 环境变量

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `CLOUDINARY_CLOUD_NAME` | 是 | Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | 是 | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | 是 | Cloudinary API Secret |

**获取 API 凭证**:
1. 访问 https://cloudinary.com
2. 注册账号
3. 在 Dashboard 中获取 Cloud Name, API Key, API Secret

**免费套餐限制**:
- 每月 25 个 credits（约 25000 次图片转换或 25000 MB 存储/带宽）
- 支持图片转换、优化、CDN 分发

## Output

### 输出格式

```json
{
  "success": true,
  "uploads": [
    {
      "localPath": "./contents/images/ev-battery.png",
      "cloudinaryUrl": "https://res.cloudinary.com/{cloud_name}/image/upload/v1234567890/deeptalk/articles/ev-battery.png",
      "secureUrl": "https://res.cloudinary.com/{cloud_name}/image/upload/v1234567890/deeptalk/articles/ev-battery.png",
      "publicId": "deeptalk/articles/ev-battery",
      "format": "png",
      "width": 1200,
      "height": 800,
      "bytes": 123456,
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ],
  "replacements": [
    {
      "file": "./markdowns/春节后新能源汽车观察.md",
      "original": "![电池技术](./images/ev-battery.png)",
      "replaced": "![电池技术](https://res.cloudinary.com/{cloud_name}/image/upload/v1234567890/deeptalk/articles/ev-battery.png)"
    }
  ],
  "stats": {
    "totalUploaded": 1,
    "totalReplaced": 1,
    "totalBytes": 123456
  }
}
```

### 文件输出

如果启用替换模式，会生成：
1. **替换后的文件**: 原文件名或指定输出文件
2. **备份文件**: 原文件备份（如 `原文件.backup.md`）
3. **映射文件**: `cloudinary-mapping.json`（图片映射关系）

## 执行流程

### 阶段1：图片发现与选择

**模式A：单张图片**
- 直接验证图片文件存在性
- 检查图片格式（支持：jpg, jpeg, png, gif, webp, bmp, svg）
- 进入上传阶段

**模式B：文章提取**
1. 读取文章文件（Markdown/HTML）
2. 提取所有本地图片引用：
   - Markdown: `![alt](./path/to/image.png)`
   - HTML: `<img src="./path/to/image.png">`
3. 解析相对路径为绝对路径
4. 验证图片文件存在性
5. **用户交互**: 列出找到的图片，让用户选择要上传的

**模式C：目录扫描**
1. 递归扫描目录下的图片文件
2. 过滤支持的图片格式
3. **用户交互**: 列出所有图片，让用户选择要上传的

### 阶段2：Cloudinary 上传

对于每张选中的图片：

1. **API 验证**
   - 检查 `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` 环境变量
   - 测试 API 连接性

2. **图片准备**
   - 读取图片文件
   - 获取图片元数据（尺寸、格式、大小）
   - 检查文件大小限制（Cloudinary 免费版限制）

3. **上传图片**
   ```http
   POST https://api.cloudinary.com/v1_1/{cloud_name}/image/upload
   Content-Type: multipart/form-data

   file=@image.png
   api_key={api_key}
   timestamp={timestamp}
   signature={signature}
   folder=deeptalk/articles
   ```

4. **处理响应**
   - 获取 Cloudinary URL
   - 获取图片元数据（尺寸、格式、大小）
   - 生成图片链接

5. **配额管理**
   - 记录已使用配额
   - 显示剩余配额
   - 如果接近限制则警告

### 阶段3：引用处理（可选）

如果启用 `replace` 参数：

1. **备份原文件**（如果启用 `backup`）
2. **替换图片引用**
   - Markdown: 替换 `![alt](./path)` 为 `![alt](cloudinary-url)`
   - HTML: 替换 `src="./path"` 为 `src="cloudinary-url"`
3. **保存映射关系**
   - 保存到 `cloudinary-mapping.json`
   - 记录本地路径和 Cloudinary URL 的映射

### 阶段4：报告生成

1. **控制台输出**
   - 上传成功的图片和链接
   - 替换的文件列表
   - 使用统计

2. **文件输出**
   - 替换后的文件
   - 映射关系文件
   - 执行日志

## 错误处理

### 常见错误及处理

| 错误类型 | 原因 | 处理方式 |
|----------|------|----------|
| **API Key 无效** | 环境变量未设置或无效 | 提示用户设置正确的 API 凭证 |
| **图片文件不存在** | 文件路径错误 | 跳过该图片，继续处理其他 |
| **图片格式不支持** | 非标准图片格式 | 跳过该图片，列出支持的格式 |
| **文件大小超限** | Cloudinary 文件大小限制 | 提示用户压缩图片 |
| **API 配额用尽** | 达到每月限制 | 停止上传，显示剩余时间 |
| **网络错误** | 连接超时或中断 | 重试 3 次，然后跳过 |

### 恢复机制

1. **断点续传**: 保存进度，支持从断点继续
2. **映射缓存**: 避免重复上传相同图片
3. **回滚功能**: 如果替换失败，恢复备份文件

## 使用示例

### 示例1：上传单张图片并获取链接

```bash
使用 cloudinary-image-host 技能 --image "./contents/images/market-dashboard.png"
```

**输出**:
```
✅ 图片上传成功！
📁 本地文件: ./contents/images/market-dashboard.png
🔗 Cloudinary URL: https://res.cloudinary.com/{cloud_name}/image/upload/v1234567890/deeptalk/articles/market-dashboard.png
📐 尺寸: 1200x800
📦 大小: 123.5 KB

📊 配额使用: 1/25 credits (本月)
```

### 示例2：从文章提取并替换图片

```bash
使用 cloudinary-image-host 技能 \
  --article "./markdowns/春节后新能源汽车观察.md" \
  --replace \
  --backup \
  --output "./markdowns/春节后新能源汽车观察-cloudinary.md"
```

**交互流程**:
```
📄 正在分析文章: 春节后新能源汽车观察.md
🔍 找到 3 张本地图片:
  1. ./images/ev-battery.png (电池技术)
  2. ./images/technology-chip.png (芯片技术)
  3. ./images/market-dashboard.png (市场概览)

请选择要上传的图片（输入编号，多个用逗号分隔，或输入 all）:
> 1,2

📤 上传中...
✅ 已上传: ev-battery.png → https://res.cloudinary.com/...
✅ 已上传: technology-chip.png → https://res.cloudinary.com/...

🔄 正在替换文件引用...
✅ 已创建备份: 春节后新能源汽车观察.md.backup
✅ 已生成新文件: 春节后新能源汽车观察-cloudinary.md
✅ 已保存映射: cloudinary-mapping.json
```

### 示例3：扫描目录批量上传

```bash
使用 cloudinary-image-host 技能 \
  --directory "./contents/images/" \
  --dry-run \
  --max-uploads 5
```

**输出**:
```
🔍 扫描目录: ./contents/images/
📁 找到 8 张图片:
  1. ev-battery.png (2.1 MB)
  2. market-dashboard.png (1.3 MB)
  3. technology-chip.png (1.7 MB)
  ... (5 more)

⚠️ 试运行模式，不会实际上传
📊 预计上传: 5 张图片（受 max-uploads 限制）
⏱️ 预计时间: 约 30 秒
📈 预计配额使用: 5/25 credits

要实际执行上传，请移除 --dry-run 参数
```

## 最佳实践

### 1. 图片准备
- 压缩大图片以减少上传时间
- 使用标准格式（推荐 JPEG 或 PNG）
- 确保图片内容适合公开分享

### 2. 配额管理
- 使用 `--dry-run` 先预览要上传的图片
- 使用 `--max-uploads` 限制单次上传数量
- 定期检查配额使用情况

### 3. 文件夹组织
- 使用 `--folder` 参数组织图片
- 建议按文章或日期分类
- 例如：`--folder "deeptalk/2024/articles"`

### 4. 文件管理
- 启用 `--backup` 参数以防意外
- 定期清理旧的备份文件
- 使用映射文件跟踪已上传的图片

## 集成建议

### 与现有技能集成

1. **wechat-article 技能**:
   ```bash
   # 生成文章后上传图片
   使用 wechat-article 技能 --content "..."
   使用 cloudinary-image-host 技能 --article "output/article.html" --replace
   ```

2. **wechat-publisher 技能**:
   ```bash
   # 发布前确保图片有永久链接
   使用 cloudinary-image-host 技能 --article "article.md" --replace
   使用 wechat-publisher 技能 --html "article-cloudinary.html"
   ```

3. **wechat-fetcher 技能**:
   ```bash
   # 抓取文章后上传其中的图片
   使用 wechat-fetcher 技能 --url "..."
   使用 cloudinary-image-host 技能 --article "fetched-article.md" --replace
   ```

### 自动化工作流

创建脚本 `upload-images.sh`:
```bash
#!/bin/bash
# 自动上传新图片并替换引用

# 1. 查找最近修改的 Markdown 文件
ARTICLE=$(find ./markdowns -name "*.md" -mtime -1 | head -1)

# 2. 上传图片
if [ -n "$ARTICLE" ]; then
  echo "处理文章: $ARTICLE"
  使用 cloudinary-image-host 技能 --article "$ARTICLE" --replace --backup
else
  echo "没有找到新文章"
fi
```

## 注意事项

### 法律与合规
1. **版权**: 确保您有权上传该图片
2. **内容**: 不要上传敏感或不适当的内容

### 技术限制
1. **文件大小**: Cloudinary 免费版有文件大小限制
2. **格式支持**: 仅支持常见图片格式
3. **API 限制**: 注意每月 credits 限制

### 数据安全
1. **API 凭证**: 不要将 API 凭证提交到版本控制
2. **备份**: 重要文件总是创建备份
3. **映射文件**: 映射文件可能包含敏感信息，妥善保管

## 故障排除

### 常见问题

**Q: 上传失败，提示 "Invalid API Key"**
A: 检查 `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` 环境变量是否正确设置

**Q: 图片上传成功但链接无法访问**
A: 检查 Cloudinary 控制台中的访问权限设置

**Q: 替换后文章格式混乱**
A: 使用备份文件恢复，检查图片引用格式是否正确

**Q: 达到 API 限制**
A: 等待下个月或升级到付费计划

### 调试模式

添加 `--verbose` 参数查看详细日志：
```bash
使用 cloudinary-image-host 技能 --image "test.png" --verbose
```

### 获取帮助

查看详细帮助：
```bash
使用 cloudinary-image-host 技能 --help
```

检查环境变量（安全模式，不输出密钥值）：
```bash
# 安全检查环境变量是否存在（不输出密钥值）
!node -e "
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('CLOUDINARY_CLOUD_NAME:', cloudName ? '已设置' : '未设置');
console.log('CLOUDINARY_API_KEY:', apiKey ? '已设置' : '未设置');
console.log('CLOUDINARY_API_SECRET:', apiSecret ? '已设置' : '未设置');

if (!cloudName || !apiKey || !apiSecret) {
  console.log('❌ 请设置所有 Cloudinary 环境变量');
  console.log('   参考 .env.example 文件配置以下变量：');
  console.log('   - CLOUDINARY_CLOUD_NAME');
  console.log('   - CLOUDINARY_API_KEY');
  console.log('   - CLOUDINARY_API_SECRET');
  process.exit(1);
} else {
  console.log('✅ Cloudinary 环境变量已正确设置');
}
"
```

测试 API 连接（注意：此命令会在命令历史中记录密钥，建议仅在安全环境下使用）：
```bash
# 警告：此命令会在命令历史中记录 API 密钥
# 建议仅在安全环境下临时使用，或使用其他方式测试
curl -s "https://api.cloudinary.com/v1_1/$CLOUDINARY_CLOUD_NAME/resources/image" \
  -u "$CLOUDINARY_API_KEY:$CLOUDINARY_API_SECRET" \
  | jq -r '.resources[0:3] | length as $count | "找到 \($count) 个图片资源"'
```

## 更新日志

### v1.0.0 (初始版本)
- 支持单张图片上传
- 支持从文章提取图片
- 支持目录扫描
- 自动替换图片引用
- 配额管理
- 错误处理和恢复机制
