# Markdown to HTML 基础用法示例

## 示例 Markdown 内容

```markdown
# React 性能优化指南

React 是一个用于构建用户界面的 JavaScript 库。本文将介绍 React 应用的性能优化技巧。

## 为什么需要性能优化？

在大型 React 应用中，性能问题可能表现为：
- 页面加载缓慢
- 交互响应延迟
- 内存占用过高

## 核心优化技巧

### 1. 使用 React.memo()

`React.memo()` 可以避免不必要的组件重渲染：

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  // 组件实现
});
```

### 2. 使用 useCallback 和 useMemo

避免在每次渲染时创建新的函数和计算值：

```javascript
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### 3. 代码分割

使用 React.lazy 和 Suspense 进行代码分割：

```javascript
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtherComponent />
    </Suspense>
  );
}
```

## 性能监控工具

| 工具 | 用途 | 特点 |
|------|------|------|
| React DevTools | 组件性能分析 | 内置，易于使用 |
| Chrome DevTools | 整体性能分析 | 功能全面 |
| Lighthouse | 网页性能评分 | 自动化测试 |

## 总结

React 性能优化需要综合考虑：
1. 组件渲染优化
2. 状态管理优化
3. 代码组织优化
4. 构建配置优化

通过合理的优化策略，可以显著提升 React 应用的性能表现。
```

## 转换后的 HTML 输出

使用 markdown-to-html 技能转换后，将生成标准的 HTML 文档，包含：
- 完整的 HTML 结构
- 基础样式应用
- 代码语法高亮
- 表格样式
- 列表样式

## 使用方式

### CLI 方式
```bash
npm run md2html -- -i example.md -o ./output --theme tech
```

### Web 界面方式
1. 启动 Web 服务：`npm run web`
2. 访问 http://localhost:3000/editor
3. 粘贴 Markdown 内容
4. 选择主题并预览

### 代码调用方式
```typescript
import { convertMarkdownToHtml } from '../src/skills/markdownConverter';

const html = convertMarkdownToHtml(markdownContent, {
  title: 'React 性能优化指南',
  author: '技术团队',
  theme: 'tech'
});
```