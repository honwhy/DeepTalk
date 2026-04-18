/**
 * Cloudinary Image Host - 基础使用示例
 *
 * 这个示例展示了如何使用 cloudinary-image-host 技能的基本功能
 */

// 示例1: 上传单张图片
const example1 = `
# 上传单张图片并获取链接
使用 cloudinary-image-host 技能 --image "./contents/images/ev-battery.png"
`;

// 示例2: 从文章提取图片
const example2 = `
# 从文章提取图片并交互式选择
使用 cloudinary-image-host 技能 --article "./markdowns/春节后新能源汽车观察.md"

# 输出示例:
# 📄 正在分析文章: 春节后新能源汽车观察.md
# 🔍 找到 3 张本地图片:
#   1. ./images/ev-battery.png (电池技术)
#   2. ./images/technology-chip.png (芯片技术)
#   3. ./images/market-dashboard.png (市场概览)
#
# 请选择要上传的图片（输入编号，多个用逗号分隔，或输入 all）:
# > 1,2
`;

// 示例3: 自动替换图片引用
const example3 = `
# 上传并自动替换图片引用
使用 cloudinary-image-host 技能 \\
  --article "./markdowns/article.md" \\
  --replace \\
  --backup \\
  --output "./markdowns/article-cloudinary.md"

# 这个命令会:
# 1. 分析 article.md 中的本地图片
# 2. 上传图片到 Cloudinary
# 3. 创建备份文件 article.md.backup
# 4. 生成新文件 article-cloudinary.md，其中包含 Cloudinary 链接
`;

// 示例4: 扫描目录
const example4 = `
# 扫描目录并批量上传
使用 cloudinary-image-host 技能 \\
  --directory "./contents/images/" \\
  --max-uploads 5 \\
  --dry-run

# 先使用 --dry-run 预览:
# 🔍 扫描目录: ./contents/images/
# 📁 找到 8 张图片:
#   1. ev-battery.png (2.1 MB)
#   2. market-dashboard.png (1.3 MB)
#   3. technology-chip.png (1.7 MB)
#   ... (5 more)
#
# ⚠️ 试运行模式，不会实际上传
# 📊 预计上传: 5 张图片（受 max-uploads 限制）

# 实际执行（移除 --dry-run）:
使用 cloudinary-image-host 技能 \\
  --directory "./contents/images/" \\
  --max-uploads 5
`;

// 示例5: 完整工作流
const example5 = `
# 完整文章发布工作流
#!/bin/bash

# 1. 生成文章（使用 wechat-article 技能）
使用 wechat-article 技能 \\
  --content "$(cat ./input/content.md)" \\
  --title "新能源汽车市场分析" \\
  --theme tech \\
  --output "./output/article.html"

# 2. 上传图片到 Cloudinary
使用 cloudinary-image-host 技能 \\
  --article "./output/article.html" \\
  --replace \\
  --backup \\
  --output "./output/article-cloudinary.html"

# 3. 发布到微信公众号（使用 wechat-publisher 技能）
使用 wechat-publisher 技能 \\
  --html "./output/article-cloudinary.html" \\
  --title "新能源汽车市场分析" \\
  --thumb_image auto

echo "✅ 文章发布流程完成！"
`;

// 示例6: 错误处理
const example6 = `
# 错误处理示例

# 1. API 凭证错误
# 错误信息: "Invalid API credentials"
# 解决方案: 检查 Cloudinary 环境变量
export CLOUDINARY_CLOUD_NAME="your-cloud-name"
export CLOUDINARY_API_KEY="your-api-key"
export CLOUDINARY_API_SECRET="your-api-secret"

# 2. 文件不存在
# 错误信息: "Image file not found: ./images/nonexistent.png"
# 解决方案: 检查文件路径
使用 cloudinary-image-host 技能 --image "./images/existing.png"

# 3. 超出配额
# 错误信息: "API rate limit exceeded"
# 解决方案: 等待或升级到付费计划
使用 cloudinary-image-host 技能 --max-uploads 5

# 4. 网络错误
# 错误信息: "Network error: Connection timeout"
# 解决方案: 检查网络连接，使用重试
使用 cloudinary-image-host 技能 --verbose
`;

// 示例7: 文件夹组织
const example7 = `
# 文件夹组织示例

# 按日期组织图片
使用 cloudinary-image-host 技能 \\
  --article "./markdowns/article.md" \\
  --folder "deeptalk/2024/articles"

# 按分类组织图片
使用 cloudinary-image-host 技能 \\
  --directory "./images/tech/" \\
  --folder "deeptalk/tech"

# 按项目组织图片
使用 cloudinary-image-host 技能 \\
  --article "./markdowns/project-alpha.md" \\
  --folder "projects/alpha"
`;

// 示例8: 脚本自动化
const example8 = `
# 自动化脚本示例

#!/bin/bash
# auto-upload.sh - 自动上传新图片

# 配置
IMAGE_DIR="./contents/images"
BACKUP_DIR="./backups"
LOG_FILE="./upload.log"

# 创建必要的目录
mkdir -p "$BACKUP_DIR"

# 查找今天修改的图片
TODAY=$(date +%Y-%m-%d)
NEW_IMAGES=$(find "$IMAGE_DIR" -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -newermt "$TODAY")

if [ -z "$NEW_IMAGES" ]; then
  echo "$(date): 没有找到新图片" >> "$LOG_FILE"
  exit 0
fi

echo "$(date): 找到 $(echo "$NEW_IMAGES" | wc -l) 张新图片" >> "$LOG_FILE"

# 分批上传（避免超出限制）
COUNT=0
for IMAGE in $NEW_IMAGES; do
  if [ $COUNT -ge 5 ]; then
    echo "$(date): 已达到批次限制，等待下一轮" >> "$LOG_FILE"
    break
  fi

  echo "处理图片: $IMAGE"

  # 上传图片
  使用 cloudinary-image-host 技能 --image "$IMAGE" --verbose

  if [ $? -eq 0 ]; then
    echo "$(date): 成功上传 $IMAGE" >> "$LOG_FILE"
    # 移动原文件到备份目录
    mv "$IMAGE" "$BACKUP_DIR/"
  else
    echo "$(date): 上传失败 $IMAGE" >> "$LOG_FILE"
  fi

  COUNT=$((COUNT + 1))
  sleep 2  # 避免请求过快
done

echo "$(date): 批次上传完成" >> "$LOG_FILE"
`;

// 导出所有示例
export const examples = {
  singleImage: example1,
  fromArticle: example2,
  autoReplace: example3,
  directoryScan: example4,
  workflow: example5,
  errorHandling: example6,
  folderOrganization: example7,
  automation: example8
};

// 使用说明
console.log(`
# Cloudinary Image Host 使用示例

选择适合您需求的示例:

1. 上传单张图片: ${example1}
2. 从文章提取图片: ${example2}
3. 自动替换引用: ${example3}
4. 扫描目录: ${example4}
5. 完整工作流: ${example5}
6. 错误处理: ${example6}
7. 文件夹组织: ${example7}
8. 自动化脚本: ${example8}

环境变量要求:
- CLOUDINARY_CLOUD_NAME: Cloudinary Cloud Name
- CLOUDINARY_API_KEY: Cloudinary API Key
- CLOUDINARY_API_SECRET: Cloudinary API Secret

基本命令格式:
使用 cloudinary-image-host 技能 [选项] [参数]

获取帮助:
使用 cloudinary-image-host 技能 --help
`);
