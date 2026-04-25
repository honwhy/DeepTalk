import { ArticleConfig, TemplateType, ThemeType } from '../types';

/**
 * 根据文章内容自动选择合适的模板类型
 */
export function detectTemplateType(content: string): Exclude<TemplateType, 'auto'> {
  const lowerContent = content.toLowerCase();

  // 教程类特征
  const tutorialKeywords = ['步骤', '教程', '如何', '怎么', 'guide', 'how to', 'step', '配置', '安装', '部署', '入门', '快速开始'];
  if (tutorialKeywords.some(k => lowerContent.includes(k))) {
    return 'tutorial';
  }

  // 资讯类特征
  const newsKeywords = ['报道', '新闻', '发布', '宣布', '推出', '更新', '近日', '今天', '最新消息', '快讯'];
  if (newsKeywords.some(k => lowerContent.includes(k))) {
    return 'news';
  }

  // 清单类特征
  const listicleKeywords = ['个技巧', '个方法', '排行榜', '推荐', 'top', 'best', '清单', '盘点', '总结'];
  if (listicleKeywords.some(k => lowerContent.includes(k))) {
    return 'listicle';
  }

  // 评测类特征
  const reviewKeywords = ['评测', '体验', '测评', '对比', '优缺点', '值得买', '推荐', 'review', 'vs', '比较'];
  if (reviewKeywords.some(k => lowerContent.includes(k))) {
    return 'review';
  }

  // 故事类特征
  const storyKeywords = ['故事', '经历', '那天', '记得', '感受', '遇见', ' journey', 'story', '我的'];
  if (storyKeywords.some(k => lowerContent.includes(k))) {
    return 'story';
  }

  // 默认为分析类
  return 'analysis';
}

/**
 * 根据文章内容自动选择合适的主题
 */
export function detectTheme(content: string): Exclude<ThemeType, 'auto'> {
  const lowerContent = content.toLowerCase();

  // 科技类特征
  const techKeywords = ['代码', '编程', '算法', 'api', '框架', '开发', '技术', '软件', '数据库', '前端', '后端', 'ai模型', 'python', 'javascript', 'java', 'react', 'vue'];
  if (techKeywords.some(k => lowerContent.includes(k))) {
    return 'spacex';
  }

  // 商务类特征
  const businessKeywords = ['市场', '商业', '投资', '战略', '行业', '数据', '报告', '分析', '增长', '营收', '商业模式', 'b2b', 'b2c'];
  if (businessKeywords.some(k => lowerContent.includes(k))) {
    return 'stripe';
  }

  // 文艺类特征
  const claudeKeywords = ['思考', '感悟', '生活', '阅读', '文学', '艺术', '哲学', '随笔', '散文', '人性', '情感'];
  if (claudeKeywords.some(k => lowerContent.includes(k))) {
    return 'claude';
  }

  // 默认为极简风
  return 'vercel';
}

/**
 * 获取文章模板
 */
export function getArticleTemplate(config: ArticleConfig): string {
  const { topic, category, style = 'professional', length = 'medium', template = 'auto', content = '' } = config;

  // 自动检测模板类型
  const detectedTemplate = template === 'auto' && content
    ? detectTemplateType(content)
    : (template === 'auto' ? 'analysis' : template);

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

  const templateStructures: Record<Exclude<TemplateType, 'auto'>, string> = {
    tutorial: `结构：
├── 简介（说明学习目标和预期收获）
├── 前置条件/准备工作
├── 步骤详解（Step 1, Step 2...）
├── 常见问题
└── 总结与延伸阅读`,

    analysis: `结构：
├── 背景介绍
├── 核心观点
├── 论证分析（多角度论述）
├── 数据/案例支撑
├── 反方观点与回应
└── 结论与展望`,

    news: `结构：
├── 导语（5W1H 核心信息）
├── 事件详情
├── 各方反应
├── 影响分析
└── 延伸阅读`,

    story: `结构：
├── 引子（吸引注意力的开头）
├── 背景铺垫
├── 情节发展
├── 高潮/转折点
├── 结局
└── 感悟/启示`,

    listicle: `结构：
├── 引言（说明清单价值）
├── 要点 1
├── 要点 2
├── ...
├── 要点 N
└── 快速总结`,

    review: `结构：
├── 产品/工具简介
├── 评测维度说明
├── 详细体验
├── 优缺点分析
├── 适用人群
└── 购买/使用建议`,
  };

  return `主题：${topic}
分类：${getCategoryLabel(category)}
风格：${styleGuide[style]}
字数：${lengthGuide[length]}
模板：${detectedTemplate}

请按以下结构撰写文章：

${templateStructures[detectedTemplate]}

# [文章标题]

摘要：[一句话概括文章核心观点]

[根据上述结构展开正文内容]

标签：[用逗号分隔3-5个关键词标签]
`;
}

/**
 * 获取模板元数据信息
 */
export function getTemplateInfo(template: Exclude<TemplateType, 'auto'>): {
  name: string;
  description: string;
  suitableFor: string[];
} {
  const info: Record<Exclude<TemplateType, 'auto'>, {
    name: string;
    description: string;
    suitableFor: string[];
  }> = {
    tutorial: {
      name: '教程模板',
      description: '适合步骤说明、操作指南类内容',
      suitableFor: ['技术教程', '操作指南', '使用手册', '入门教程'],
    },
    analysis: {
      name: '分析模板',
      description: '适合观点论述、深度分析类内容',
      suitableFor: ['行业分析', '观点评论', '趋势解读', '深度文章'],
    },
    news: {
      name: '资讯模板',
      description: '适合新闻快讯、事件报道类内容',
      suitableFor: ['新闻快讯', '产品发布', '行业动态', '事件报道'],
    },
    story: {
      name: '故事模板',
      description: '适合个人经历、案例故事类内容',
      suitableFor: ['个人故事', '创业经历', '用户案例', '叙事文章'],
    },
    listicle: {
      name: '清单模板',
      description: '适合排行榜、要点汇总类内容',
      suitableFor: ['排行榜', '技巧清单', '资源推荐', '最佳实践'],
    },
    review: {
      name: '评测模板',
      description: '适合产品体验、工具对比类内容',
      suitableFor: ['产品评测', '工具对比', '软件体验', '购买指南'],
    },
  };

  return info[template];
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    tech: '技术',
    ai: 'AI人工智能',
    invest: '投资',
  };
  return labels[category] || category;
}

/**
 * 获取所有可用的模板类型
 */
export function getAvailableTemplates(): { value: Exclude<TemplateType, 'auto'>; label: string }[] {
  return [
    { value: 'tutorial', label: '教程' },
    { value: 'analysis', label: '分析' },
    { value: 'news', label: '资讯' },
    { value: 'story', label: '故事' },
    { value: 'listicle', label: '清单' },
    { value: 'review', label: '评测' },
  ];
}

/**
 * 获取所有可用的主题类型
 */
export function getAvailableThemes(): { value: Exclude<ThemeType, 'auto'>; label: string }[] {
  return [
    { value: 'airbnb', label: 'Airbnb' },
    { value: 'apple', label: 'Apple' },
    { value: 'binance', label: 'Binance' },
    { value: 'claude', label: 'Claude (Anthropic)' },
    { value: 'coinbase', label: 'Coinbase' },
    { value: 'japanese-zen', label: 'Japanese Zen' },
    { value: 'luxury-editorial', label: 'Luxury Editorial' },
    { value: 'mastercard', label: 'Mastercard' },
    { value: 'neo-brutalist', label: 'Neo Brutalist' },
    { value: 'notion', label: 'Notion' },
    { value: 'opencode.ai', label: 'OpenCode AI' },
    { value: 'spacex', label: 'SpaceX' },
    { value: 'standard', label: 'Standard' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'vercel', label: 'Vercel' },
    { value: 'vintage-newspaper', label: 'Vintage Newspaper' },
  ];
}
