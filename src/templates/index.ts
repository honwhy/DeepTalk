import { ArticleConfig } from '../types';

export function getArticleTemplate(config: ArticleConfig): string {
  const { topic, category, style = 'professional', length = 'medium' } = config;

  const lengthGuide = {
    short: '500-800字，简洁精炼',
    medium: '1500-2500字，详实完整',
    long: '3000-5000字，深度分析',
  };

  const styleGuide = {
    professional: '专业严谨，适合业内人士阅读',
    casual: '轻松活泼，适合大众读者',
    academic: '学术规范，适合研究参考',
  };

  return `主题：${topic}
分类：${getCategoryLabel(category)}
风格：${styleGuide[style]}
字数：${lengthGuide[length]}

请按以下结构撰写文章：

# [文章标题]

摘要：[一句话概括文章核心观点]

## 引言
[引出话题，说明背景和重要性]

## 核心内容
[根据主题展开详细论述，使用二级标题分隔不同部分]

## 实践/应用
[提供具体的实践建议或应用案例]

## 总结
[总结要点，给出展望或建议]

标签：[用逗号分隔3-5个关键词标签]
`;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    tech: '技术',
    ai: 'AI人工智能',
    invest: '投资',
  };
  return labels[category] || category;
}
