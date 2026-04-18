/**
 * 批量选择上传示例
 *
 * 这个示例展示了如何使用 cloudinary-image-host 技能从多个来源批量选择图片上传
 */

// 场景1: 从多个文章提取图片
const multiArticleExample = `
# 从多个文章提取图片并批量上传

# 步骤1: 查找所有包含本地图片的文章
ARTICLES=$(find ./markdowns -name "*.md" -exec grep -l "\./images/" {} \\;)

echo "找到包含本地图片的文章:"
echo "$ARTICLES"

# 步骤2: 为每篇文章上传图片
for ARTICLE in $ARTICLES; do
  echo "处理文章: $ARTICLE"

  # 交互式上传图片
  使用 cloudinary-image-host 技能 --article "$ARTICLE"

  # 询问是否替换
  read -p "是否替换此文章中的图片引用？(y/n): " REPLACE_ANSWER

  if [ "$REPLACE_ANSWER" = "y" ]; then
    使用 cloudinary-image-host 技能 --article "$ARTICLE" --replace --backup
    echo "✅ 已替换 $ARTICLE 中的图片引用"
  else
    echo "⏭️  跳过替换 $ARTICLE"
  fi

  echo "---"
done
`;

// 场景2: 智能选择图片
const smartSelectionExample = `
# 智能选择图片上传（基于条件）

# 条件1: 只上传大图片（>1MB）
find ./contents/images -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | \\
while read IMAGE; do
  SIZE=$(stat -f%z "$IMAGE" 2>/dev/null || stat -c%s "$IMAGE")

  if [ $SIZE -gt 1048576 ]; then  # 1MB = 1048576 bytes
    echo "发现大图片: $IMAGE ($((SIZE/1024/1024))MB)"

    # 询问是否上传
    read -p "上传此图片？(y/n/skip all): " UPLOAD_ANSWER

    case $UPLOAD_ANSWER in
      y)
        使用 cloudinary-image-host 技能 --image "$IMAGE"
        ;;
      n)
        echo "跳过: $IMAGE"
        ;;
      "skip all")
        echo "跳过所有剩余图片"
        break
        ;;
    esac
  fi
done

# 条件2: 只上传最近修改的图片（7天内）
RECENT_IMAGES=$(find ./contents/images \\( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \\) -mtime -7)

echo "最近7天修改的图片:"
echo "$RECENT_IMAGES"

# 批量上传最近图片（限制数量）
echo "$RECENT_IMAGES" | head -10 | while read IMAGE; do
  使用 cloudinary-image-host 技能 --image "$IMAGE" --verbose
done
`;

// 场景3: 项目迁移工作流
const migrationWorkflow = `
# 项目图片迁移工作流

# 阶段1: 分析当前图片使用情况
echo "=== 阶段1: 图片使用分析 ==="

# 1.1 统计图片数量
IMAGE_COUNT=$(find ./contents/images -type f \\( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.webp" \\) | wc -l)
echo "总图片数量: $IMAGE_COUNT"

# 1.2 统计图片大小
TOTAL_SIZE=$(find ./contents/images -type f \\( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.webp" \\) -exec du -k {} + | awk '{sum+=$1} END {print sum}')
echo "总图片大小: $((TOTAL_SIZE/1024)) MB"

# 1.3 查找引用这些图片的文章
echo "查找引用图片的文章..."
find ./markdowns -name "*.md" -exec grep -l "\./images/" {} \\; > referenced-articles.txt
ARTICLE_COUNT=$(wc -l < referenced-articles.txt)
echo "引用图片的文章数量: $ARTICLE_COUNT"

# 阶段2: 准备上传
echo "=== 阶段2: 上传准备 ==="

# 2.1 创建备份
BACKUP_DIR="./backups/images-$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"
cp -r ./contents/images/* "$BACKUP_DIR/"
echo "已创建备份到: $BACKUP_DIR"

# 2.2 压缩大图片（可选）
echo "压缩大图片..."
find ./contents/images -size +1M -name "*.png" -exec pngquant --force --output {} {} \\;
find ./contents/images -size +1M -name "*.jpg" -exec jpegoptim --max=80 {} \\;

# 阶段3: 分批上传
echo "=== 阶段3: 分批上传 ==="

# 3.1 创建上传批次
BATCH_SIZE=5
BATCH_COUNT=$(( (IMAGE_COUNT + BATCH_SIZE - 1) / BATCH_SIZE ))

echo "将 $IMAGE_COUNT 张图片分成 $BATCH_COUNT 个批次（每批 $BATCH_SIZE 张）"

# 3.2 分批上传
for ((BATCH=1; BATCH<=BATCH_COUNT; BATCH++)); do
  echo "--- 批次 $BATCH/$BATCH_COUNT ---"

  # 获取本批图片
  find ./contents/images -type f \\( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \\) | \\
    head -$((BATCH * BATCH_SIZE)) | \\
    tail -$BATCH_SIZE > batch-$BATCH.txt

  # 上传本批图片
  while read IMAGE; do
    echo "上传: $(basename "$IMAGE")"
    使用 cloudinary-image-host 技能 --image "$IMAGE" --verbose

    if [ $? -eq 0 ]; then
      echo "✅ 成功"
      # 记录成功上传
      echo "$IMAGE" >> uploaded-successfully.txt
    else
      echo "❌ 失败"
      echo "$IMAGE" >> upload-failed.txt
    fi
  done < batch-$BATCH.txt

  # 批次间等待（避免超出限制）
  if [ $BATCH -lt $BATCH_COUNT ]; then
    echo "等待 60 秒..."
    sleep 60
  fi
done

# 阶段4: 更新文章引用
echo "=== 阶段4: 更新文章引用 ==="

# 4.1 加载映射关系
if [ -f "cloudinary-mapping.json" ]; then
  echo "使用映射文件更新文章引用..."

  while read ARTICLE; do
    echo "更新文章: $ARTICLE"
    使用 cloudinary-image-host 技能 --article "$ARTICLE" --replace --backup --output "${ARTICLE%.md}-cloudinary.md"
  done < referenced-articles.txt
else
  echo "警告: 未找到映射文件，无法自动更新引用"
fi

# 阶段5: 验证和清理
echo "=== 阶段5: 验证和清理 ==="

# 5.1 验证上传结果
SUCCESS_COUNT=$(wc -l < uploaded-successfully.txt 2>/dev/null || echo 0)
FAILED_COUNT=$(wc -l < upload-failed.txt 2>/dev/null || echo 0)

echo "上传结果:"
echo "  ✅ 成功: $SUCCESS_COUNT"
echo "  ❌ 失败: $FAILED_COUNT"

# 5.2 生成报告
REPORT_FILE="migration-report-$(date +%Y%m%d).md"
cat > "$REPORT_FILE" << EOF
# 图片迁移报告
## 统计信息
- 总图片数量: $IMAGE_COUNT
- 成功上传: $SUCCESS_COUNT
- 上传失败: $FAILED_COUNT
- 处理文章: $ARTICLE_COUNT
- 开始时间: $(date)
- 总耗时: 约 $((BATCH_COUNT * 60)) 秒

## 失败图片
$(cat upload-failed.txt 2>/dev/null || echo "无")

## 下一步
1. 手动处理失败图片
2. 验证更新后的文章
3. 清理备份文件（30天后）
EOF

echo "迁移完成！报告已保存到: $REPORT_FILE"
`;

// 场景4: 交互式批量选择
const interactiveBatchExample = `
# 交互式批量选择工具

#!/bin/bash
# interactive-upload.sh

# 颜色定义
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# 函数: 显示菜单
show_menu() {
  clear
  echo -e "${BLUE}=================================${NC}"
  echo -e "${BLUE}    Cloudinary 图片上传工具        ${NC}"
  echo -e "${BLUE}=================================${NC}"
  echo ""
  echo "1. 上传单张图片"
  echo "2. 从文章提取图片"
  echo "3. 扫描目录"
  echo "4. 批量处理多个文章"
  echo "5. 查看上传统计"
  echo "6. 检查 API 配额"
  echo "7. 退出"
  echo ""
  echo -n "请选择 (1-7): "
}

# 函数: 上传单张图片
upload_single() {
  echo -n "请输入图片路径: "
  read IMAGE_PATH

  if [ ! -f "$IMAGE_PATH" ]; then
    echo -e "${RED}错误: 文件不存在${NC}"
    return 1
  fi

  echo -e "${YELLOW}上传图片: $IMAGE_PATH${NC}"
  使用 cloudinary-image-host 技能 --image "$IMAGE_PATH"

  echo -n "是否替换原文件中的引用？(y/n): "
  read REPLACE_ANSWER

  if [ "$REPLACE_ANSWER" = "y" ]; then
    echo -n "请输入原文件路径: "
    read SOURCE_FILE

    if [ -f "$SOURCE_FILE" ]; then
      使用 cloudinary-image-host 技能 --article "$SOURCE_FILE" --replace --backup
    else
      echo -e "${RED}错误: 原文件不存在${NC}"
    fi
  fi
}

# 函数: 从文章提取
upload_from_article() {
  echo -n "请输入文章路径: "
  read ARTICLE_PATH

  if [ ! -f "$ARTICLE_PATH" ]; then
    echo -e "${RED}错误: 文件不存在${NC}"
    return 1
  fi

  echo -e "${YELLOW}分析文章: $ARTICLE_PATH${NC}"
  使用 cloudinary-image-host 技能 --article "$ARTICLE_PATH"
}

# 函数: 扫描目录
scan_directory() {
  echo -n "请输入目录路径: "
  read DIR_PATH

  if [ ! -d "$DIR_PATH" ]; then
    echo -e "${RED}错误: 目录不存在${NC}"
    return 1
  fi

  echo -n "最大上传数量 (默认 10): "
  read MAX_UPLOADS
  MAX_UPLOADS=${MAX_UPLOADS:-10}

  echo -n "试运行模式？(y/n, 默认 n): "
  read DRY_RUN
  DRY_RUN=${DRY_RUN:-n}

  CMD="使用 cloudinary-image-host 技能 --directory \"$DIR_PATH\" --max-uploads $MAX_UPLOADS"

  if [ "$DRY_RUN" = "y" ]; then
    CMD="$CMD --dry-run"
  fi

  eval "$CMD"
}

# 函数: 批量处理
batch_process() {
  echo "查找 Markdown 文件..."
  FILES=$(find ./markdowns -name "*.md" | head -20)

  if [ -z "$FILES" ]; then
    echo -e "${YELLOW}未找到 Markdown 文件${NC}"
    return
  fi

  echo "找到以下文件:"
  echo "$FILES" | nl

  echo -n "选择要处理的文件编号 (多个用逗号分隔，或输入 all): "
  read SELECTION

  if [ "$SELECTION" = "all" ]; then
    SELECTED_FILES="$FILES"
  else
    SELECTED_FILES=""
    for NUM in $(echo "$SELECTION" | tr ',' ' '); do
      FILE=$(echo "$FILES" | sed -n "${NUM}p")
      SELECTED_FILES="$SELECTED_FILES$FILE"$'\\n'
    done
  fi

  echo "将处理以下文件:"
  echo "$SELECTED_FILES"

  echo -n "确认处理？(y/n): "
  read CONFIRM

  if [ "$CONFIRM" = "y" ]; then
    echo "$SELECTED_FILES" | while read FILE; do
      if [ -n "$FILE" ]; then
        echo -e "${BLUE}处理: $FILE${NC}"
        使用 cloudinary-image-host 技能 --article "$FILE" --replace --backup
        echo ""
      fi
    done
  fi
}

# 函数: 查看统计
show_stats() {
  if [ -f "cloudinary-mapping.json" ]; then
    echo -e "${GREEN}上传统计:${NC}"
    COUNT=$(grep -c '"url"' cloudinary-mapping.json 2>/dev/null || echo 0)
    echo "已上传图片: $COUNT"

    # 显示最近上传
    echo -e "${YELLOW}最近上传的图片:${NC}"
    tail -5 cloudinary-mapping.json | grep -o '"url":"[^"]*"' | head -5
  else
    echo -e "${YELLOW}暂无上传记录${NC}"
  fi
}

# 函数: 检查配额
check_quota() {
  echo -e "${YELLOW}检查 API 配额...${NC}"
  # Cloudinary 配额信息需要在控制台查看
  echo "请在 Cloudinary Dashboard 查看配额使用情况:"
  echo "https://console.cloudinary.com/console"
}

# 主循环
while true; do
  show_menu
  read CHOICE

  case $CHOICE in
    1)
      upload_single
      ;;
    2)
      upload_from_article
      ;;
    3)
      scan_directory
      ;;
    4)
      batch_process
      ;;
    5)
      show_stats
      ;;
    6)
      check_quota
      ;;
    7)
      echo -e "${GREEN}再见！${NC}"
      exit 0
      ;;
    *)
      echo -e "${RED}无效选择${NC}"
      ;;
  esac

  echo ""
  echo -n "按 Enter 继续..."
  read
done
`;

// 导出所有场景
export const batchExamples = {
  multiArticle: multiArticleExample,
  smartSelection: smartSelectionExample,
  migrationWorkflow: migrationWorkflow,
  interactiveTool: interactiveBatchExample
};

// 使用说明
console.log(`
# 批量选择上传示例

## 场景1: 从多个文章提取图片
${multiArticleExample}

## 场景2: 智能选择图片
${smartSelectionExample}

## 场景3: 项目迁移工作流
${migrationWorkflow}

## 场景4: 交互式批量选择工具
${interactiveBatchExample}

## 使用建议

### 1. 对于大量图片
- 使用分批上传避免超出 API 限制
- 先使用 --dry-run 模式预览
- 记录上传进度以便恢复

### 2. 对于团队项目
- 共享 cloudinary-mapping.json 文件
- 建立图片上传规范
- 使用统一的文件夹结构

### 3. 对于内容管理系统
- 集成到发布流程中
- 自动检测新图片
- 生成使用报告

### 4. 最佳实践
- 始终创建备份
- 监控 API 使用情况
- 定期清理旧备份
- 验证替换后的文件
- 使用文件夹组织图片

## 故障排除

### 批量上传失败
1. 检查网络连接
2. 验证 API 凭证是否有效
3. 确认未超出配额限制
4. 检查图片格式和大小

### 替换后格式错误
1. 使用备份文件恢复
2. 检查映射文件是否正确
3. 验证图片引用格式
4. 手动修复个别问题

### 性能优化
1. 压缩大图片再上传
2. 使用并行上传（注意 API 限制）
3. 缓存已上传图片信息
4. 避免重复上传相同图片
`);
