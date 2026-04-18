# Cloudinary Image Host Skill

将本地图片上传到 Cloudinary 并获取永久 HTTP 链接的技能。

## 快速开始

### 1. 获取 Cloudinary API 凭证
1. 访问 https://cloudinary.com
2. 注册账号
3. 在 Dashboard 中获取 Cloud Name, API Key, API Secret

### 2. 设置环境变量
```bash
# 在 .env 文件中添加
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. 基本使用

**上传单张图片**:
```bash
使用 cloudinary-image-host 技能 --image "./contents/images/example.png"
```

**从文章提取图片**:
```bash
使用 cloudinary-image-host 技能 --article "./markdowns/article.md"
```

**扫描目录**:
```bash
使用 cloudinary-image-host 技能 --directory "./contents/images/"
```

## 功能特性

### 🖼️ 多种输入模式
- **单张图片**: 直接指定图片文件
- **文章提取**: 从 Markdown/HTML 文件中提取本地图片
- **目录扫描**: 扫描目录下的所有图片

### 🔗 永久链接生成
- 上传图片到 Cloudinary
- 获取永久 HTTP 链接
- 支持多种图片格式（JPG, PNG, GIF, WebP, BMP, SVG）

### 📝 智能替换
- 自动替换文章中的本地图片引用
- 保持原文件格式和结构
- 可选备份功能

### 📊 配额管理
- 实时显示 API 使用情况
- 防止超出限制
- 支持试运行模式

## 详细使用指南

### 模式1：上传单张图片

**命令**:
```bash
使用 cloudinary-image-host 技能 --image "path/to/image.png"
```

**可选参数**:
- `--replace`: 如果图片来自某个文件，替换原引用
- `--backup`: 替换时创建备份（默认: true）
- `--output`: 指定输出文件路径
- `--folder`: 指定 Cloudinary 中的文件夹路径（默认: deeptalk/articles）

**示例**:
```bash
# 上传图片并获取链接
使用 cloudinary-image-host 技能 --image "./contents/images/ev-battery.png"

# 上传并替换原文件中的引用
使用 cloudinary-image-host 技能 \
  --image "./contents/images/market-dashboard.png" \
  --replace \
  --output "./markdowns/article-cloudinary.md"
```

### 模式2：从文章提取图片

**命令**:
```bash
使用 cloudinary-image-host 技能 --article "path/to/article.md"
```

**工作流程**:
1. 读取文章文件
2. 提取所有本地图片引用
3. 列出图片让用户选择
4. 上传选中的图片
5. （可选）替换原文件中的引用

**示例**:
```bash
# 交互式选择要上传的图片
使用 cloudinary-image-host 技能 --article "./markdowns/春节后新能源汽车观察.md"

# 自动替换所有图片引用
使用 cloudinary-image-host 技能 \
  --article "./markdowns/article.md" \
  --replace \
  --backup
```

### 模式3：扫描目录

**命令**:
```bash
使用 cloudinary-image-host 技能 --directory "path/to/directory"
```

**用途**:
- 批量上传目录下的所有图片
- 为新项目准备图片库
- 迁移本地图片到 Cloudinary

**示例**:
```bash
# 扫描目录并交互式选择
使用 cloudinary-image-host 技能 --directory "./contents/images/"

# 限制上传数量
使用 cloudinary-image-host 技能 \
  --directory "./markdowns/" \
  --max-uploads 10 \
  --dry-run  # 先预览
```

## 参数参考

### 输入模式参数（必须选择一个）

| 参数 | 说明 | 示例 |
|------|------|------|
| `--image` | 单张图片文件路径 | `--image "./img.png"` |
| `--article` | 文章文件路径 | `--article "./article.md"` |
| `--directory` | 目录路径 | `--directory "./images/"` |

### 通用参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `--replace` | boolean | false | 是否替换原文件中的图片引用 |
| `--backup` | boolean | true | 替换时是否创建备份文件 |
| `--output` | string | - | 输出文件路径（仅替换模式） |
| `--dry-run` | boolean | false | 试运行模式，仅扫描不上传 |
| `--max-uploads` | number | 10 | 最大上传数量 |
| `--folder` | string | deeptalk/articles | Cloudinary 中的文件夹路径 |
| `--verbose` | boolean | false | 显示详细日志 |
| `--help` | boolean | - | 显示帮助信息 |

### 环境变量

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `CLOUDINARY_CLOUD_NAME` | 是 | Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | 是 | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | 是 | Cloudinary API Secret |

## 输出说明

### 控制台输出

成功上传后，您会看到类似输出：
```
✅ 图片上传成功！
📁 本地文件: ./images/example.png
🔗 Cloudinary URL: https://res.cloudinary.com/{cloud_name}/image/upload/v1234567890/deeptalk/articles/example.png
📐 尺寸: 1200x800
📦 大小: 123.5 KB

📊 配额使用: 1/25 credits (本月)
```

### 文件输出

如果启用替换模式，会生成以下文件：

1. **替换后的文件**
   - 原文件名或指定输出文件
   - 包含 Cloudinary 链接的版本

2. **备份文件**（如果启用 `--backup`）
   - `原文件名.backup.扩展名`
   - 原始文件的完整备份

3. **映射文件**
   - `cloudinary-mapping.json`
   - 记录本地路径和 Cloudinary URL 的映射关系
   - 格式：
     ```json
     {
       "./images/example.png": {
         "url": "https://res.cloudinary.com/.../example.png",
         "publicId": "deeptalk/articles/example",
         "format": "png",
         "width": 1200,
         "height": 800,
         "bytes": 123456,
         "uploadedAt": "2024-01-01T12:00:00Z"
       }
     }
     ```

## 使用场景

### 场景1：文章发布准备

**问题**: 文章中有本地图片，需要发布到网站或公众号
**解决方案**:
```bash
# 1. 上传图片并替换引用
使用 cloudinary-image-host 技能 \
  --article "./markdowns/article.md" \
  --replace \
  --backup

# 2. 使用替换后的文件发布
# （现在所有图片都有永久链接了）
```

### 场景2：图片库迁移

**问题**: 大量本地图片需要托管
**解决方案**:
```bash
# 1. 扫描目录查看所有图片
使用 cloudinary-image-host 技能 \
  --directory "./old-images/" \
  --dry-run

# 2. 分批上传（避免超出限制）
使用 cloudinary-image-host 技能 \
  --directory "./old-images/" \
  --max-uploads 20

# 3. 使用映射文件更新所有引用
```

### 场景3：团队协作

**问题**: 团队成员需要共享图片
**解决方案**:
1. 将图片上传到 Cloudinary
2. 分享 Cloudinary 链接
3. 在文章中直接使用链接

## 最佳实践

### 1. 图片优化

**上传前**:
- 压缩大图片（推荐使用工具如 TinyPNG）
- 统一图片格式（推荐 JPEG 或 PNG）
- 检查图片尺寸（避免过大）

**命令示例**:
```bash
# 先压缩图片再上传
compress-images.sh "./images/"
使用 cloudinary-image-host 技能 --directory "./images/compressed/"
```

### 2. 配额管理

**监控使用情况**:
```bash
# 查看当前配额
使用 cloudinary-image-host 技能 --dry-run --verbose
```

**分批处理**:
```bash
# 大量图片时分批上传
for i in {1..5}; do
  使用 cloudinary-image-host 技能 \
    --directory "./batch-$i/" \
    --max-uploads 10
  echo "批次 $i 完成，等待 1 分钟..."
  sleep 60
done
```

### 3. 文件夹组织

**使用 folder 参数**:
```bash
# 按日期组织
使用 cloudinary-image-host 技能 \
  --article "./markdowns/article.md" \
  --folder "deeptalk/2024/articles"

# 按分类组织
使用 cloudinary-image-host 技能 \
  --directory "./images/tech/" \
  --folder "deeptalk/tech"
```

### 4. 错误处理

**常见问题解决**:

**Q: "Invalid API Key" 错误**
```bash
# 检查环境变量
echo $CLOUDINARY_CLOUD_NAME
echo $CLOUDINARY_API_KEY
echo $CLOUDINARY_API_SECRET

# 重新设置
export CLOUDINARY_CLOUD_NAME="your-cloud-name"
export CLOUDINARY_API_KEY="your-api-key"
export CLOUDINARY_API_SECRET="your-api-secret"
```

**Q: 上传速度慢**
```bash
# 减少单次上传数量
使用 cloudinary-image-host 技能 --max-uploads 5

# 压缩图片
optimize-images.sh
```

**Q: 替换后格式错误**
```bash
# 恢复备份
cp "article.md.backup" "article.md"

# 重新尝试
使用 cloudinary-image-host 技能 --article "article.md" --replace --verbose
```

## 集成示例

### 与现有工作流集成

**完整发布流程**:
```bash
#!/bin/bash
# publish-article.sh

# 1. 生成文章
使用 wechat-article 技能 \
  --content "$CONTENT" \
  --title "$TITLE" \
  --output "./output/article.html"

# 2. 上传图片
使用 cloudinary-image-host 技能 \
  --article "./output/article.html" \
  --replace \
  --backup

# 3. 发布到微信
使用 wechat-publisher 技能 \
  --html "./output/article-cloudinary.html" \
  --title "$TITLE"
```

### 自动化脚本

**每日图片上传**:
```bash
#!/bin/bash
# daily-upload.sh

# 查找今天修改的文章
TODAY=$(date +%Y-%m-%d)
ARTICLES=$(find ./markdowns -name "*.md" -newermt "$TODAY")

for ARTICLE in $ARTICLES; do
  echo "处理文章: $ARTICLE"

  使用 cloudinary-image-host 技能 \
    --article "$ARTICLE" \
    --replace \
    --backup \
    --max-uploads 5

  # 记录日志
  echo "$(date): 已处理 $ARTICLE" >> upload.log
done
```

## 技术细节

### 支持的图片格式
- JPEG/JPG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- BMP (.bmp)
- SVG (.svg)

### 文件大小限制
- Cloudinary 免费版有文件大小限制
- 建议图片小于 10MB
- 大图片请先压缩

### API 端点
- 上传: `POST /v1_1/{cloud_name}/image/upload`
- 基础 URL: `https://api.cloudinary.com`
- 认证: API Key + API Secret + Signature

### 错误代码
| 代码 | 含义 | 解决方案 |
|------|------|----------|
| 401 | 无效 API 凭证 | 检查环境变量 |
| 403 | 超出配额 | 等待或升级计划 |
| 413 | 文件太大 | 压缩图片 |
| 422 | 无效文件格式 | 转换图片格式 |
| 429 | 请求过多 | 降低频率 |

## 更新与支持

### 获取更新
```bash
# 检查技能更新
cd .agents/skills/cloudinary-image-host
git pull origin main
```

### 报告问题
1. 检查日志文件
2. 使用 `--verbose` 参数
3. 提供错误信息
4. 联系维护者

### 贡献指南
1. Fork 仓库
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 许可证

本技能遵循 Cloudinary API 使用条款。使用本技能即表示您同意：
1. 遵守 Cloudinary 使用条款
2. 不滥用 API 服务
3. 仅上传您有权分享的图片

---

**提示**: 始终在非生产环境测试后再用于重要文件。
