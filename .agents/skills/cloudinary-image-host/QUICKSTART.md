# Cloudinary Image Host - 快速开始

## 1. 环境准备

### 1.1 获取 Cloudinary API 凭证
1. 访问 https://cloudinary.com
2. 注册账号
3. 在 Dashboard 中获取 Cloud Name, API Key, API Secret

### 1.2 配置环境变量
在项目根目录的 `.env` 文件中添加：
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

或在命令行中设置：
```bash
# Linux/Mac
export CLOUDINARY_CLOUD_NAME="your-cloud-name"
export CLOUDINARY_API_KEY="your-api-key"
export CLOUDINARY_API_SECRET="your-api-secret"

# Windows PowerShell:
$env:CLOUDINARY_CLOUD_NAME="your-cloud-name"
$env:CLOUDINARY_API_KEY="your-api-key"
$env:CLOUDINARY_API_SECRET="your-api-secret"
```

## 2. 基本使用

### 2.1 上传单张图片
```bash
使用 cloudinary-image-host 技能 --image "./contents/images/ev-battery.png"
```

**输出示例**:
```
✅ 图片上传成功！
📁 本地文件: ./contents/images/ev-battery.png
🔗 Cloudinary URL: https://res.cloudinary.com/{cloud_name}/image/upload/v1234567890/deeptalk/articles/ev-battery.png
📐 尺寸: 1200x800
📦 大小: 123.5 KB

📊 配额使用: 1/25 credits (本月)
```

### 2.2 从文章提取图片
```bash
使用 cloudinary-image-host 技能 --article "./markdowns/春节后新能源汽车观察.md"
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
```

### 2.3 自动替换图片引用
```bash
使用 cloudinary-image-host 技能 \
  --article "./markdowns/article.md" \
  --replace \
  --backup \
  --output "./markdowns/article-cloudinary.md"
```

## 3. 实用场景

### 3.1 为现有文章添加永久图片链接
```bash
# 1. 查找所有包含本地图片的文章
find ./markdowns -name "*.md" -exec grep -l "\./images/" {} \;

# 2. 为每篇文章上传图片
for ARTICLE in $(find ./markdowns -name "*.md" -exec grep -l "\./images/" {} \;); do
  echo "处理: $ARTICLE"
  使用 cloudinary-image-host 技能 --article "$ARTICLE" --replace --backup
done
```

### 3.2 批量上传目录图片
```bash
# 先预览（不上传）
使用 cloudinary-image-host 技能 --directory "./contents/images/" --dry-run

# 实际分批上传（避免超出限制）
使用 cloudinary-image-host 技能 --directory "./contents/images/" --max-uploads 5
```

### 3.3 集成到发布工作流
```bash
#!/bin/bash
# publish-workflow.sh

# 1. 生成文章
使用 wechat-article 技能 --content "$CONTENT" --title "$TITLE"

# 2. 上传图片到 Cloudinary
使用 cloudinary-image-host 技能 \
  --article "./output/article.html" \
  --replace \
  --backup

# 3. 发布到微信公众号
使用 wechat-publisher 技能 \
  --html "./output/article-cloudinary.html" \
  --title "$TITLE"
```

## 4. 常见问题

### 4.1 API 凭证错误
**问题**: `Invalid API credentials`
**解决**:
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

### 4.2 超出配额限制
**问题**: `API rate limit exceeded`
**解决**:
```bash
# 分批上传，限制数量
使用 cloudinary-image-host 技能 --max-uploads 5

# 或升级到付费计划
```

### 4.3 文件不存在
**问题**: `Image file not found`
**解决**:
```bash
# 检查文件路径
ls -la "./contents/images/"

# 使用绝对路径
使用 cloudinary-image-host 技能 --image "$(pwd)/contents/images/ev-battery.png"
```

## 5. 最佳实践

### 5.1 图片优化
- 上传前压缩大图片
- 使用标准格式（推荐 JPEG 或 PNG）
- 确保图片尺寸适中

### 5.2 文件夹组织
- 使用 `--folder` 参数组织图片
- 建议按文章或日期分类
- 例如：`--folder "deeptalk/2024/articles"`

### 5.3 备份策略
- 启用 `--backup` 参数
- 定期清理旧备份
- 保存映射文件供后续使用

## 6. 高级功能

### 6.1 使用映射文件
```bash
# 上传后生成映射文件
使用 cloudinary-image-host 技能 --image "./image.png"

# 查看映射文件
cat cloudinary-mapping.json

# 使用映射文件批量替换
jq -r 'to_entries[] | "s|\(.key)|\(.value.url)|g"' cloudinary-mapping.json > replace.sed
sed -f replace.sed article.md > article-cloudinary.md
```

### 6.2 自动化脚本
```bash
#!/bin/bash
# auto-upload-new-images.sh

# 查找今天新增的图片
NEW_IMAGES=$(find ./contents/images -name "*.png" -o -name "*.jpg" -newermt "$(date +%Y-%m-%d)")

for IMAGE in $NEW_IMAGES; do
  echo "上传新图片: $IMAGE"
  使用 cloudinary-image-host 技能 --image "$IMAGE" --verbose
done
```

### 6.3 使用文件夹参数
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

## 7. 获取帮助

### 7.1 查看帮助
```bash
使用 cloudinary-image-host 技能 --help
```

### 7.2 详细日志
```bash
使用 cloudinary-image-host 技能 --image "./test.png" --verbose
```

### 7.3 检查配置
```bash
# 检查环境变量
env | grep CLOUDINARY

# 测试 API 连接
curl "https://api.cloudinary.com/v1_1/$CLOUDINARY_CLOUD_NAME/resources/image" \
  -u "$CLOUDINARY_API_KEY:$CLOUDINARY_API_SECRET"
```

## 8. 下一步

1. **测试**: 先用测试图片尝试上传
2. **集成**: 将技能集成到您的工作流中
3. **优化**: 根据使用情况调整参数
4. **反馈**: 报告问题或建议改进

**提示**: 首次使用时建议先使用 `--dry-run` 模式预览。
