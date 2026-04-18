# DeepTalk 架构设计

## 系统架构图

```mermaid
graph TB
    subgraph "用户界面层 User Interface"
        CLI[CLI 命令行]
        WEB[Web 管理界面]
    end

    subgraph "应用层 Application Layer"
        direction TB
        CMD[Command Handler<br/>commander.js]
        ROUTER[Router Handler<br/>express]
    end

    subgraph "服务层 Service Layer"
        direction LR
        subgraph "核心服务 Core Services"
            GEN[ArticleGenerator<br/>文章生成]
            MD2HTML[HtmlGenerator<br/>MD转HTML]
            WC_RENDER[WechatRenderer<br/>公众号渲染]
        end
        subgraph "API服务 API Services"
            WC_API[WeChatAPI<br/>公众号API]
            LLM_API[LLMApi<br/>大模型API]
        end
    end

    subgraph "技能层 Skills Layer"
        SKILLS[.agents/skills/]
        SK_WC[wechat-article<br/>公众号文章Skill]
        SK_DESIGN[design-system<br/>设计系统]
    end

    subgraph "数据层 Data Layer"
        CONTENTS[contents/<br/>HTML内容存储]
        MARKDOWNS[markdowns/<br/>Markdown源文件]
        OUTPUT[output/<br/>生成输出]
        CONFIG[config/<br/>配置管理]
    end

    subgraph "外部服务 External Services"
        WECHAT[微信公众号API]
        OPENAI[OpenAI/DeepSeek API]
    end

    CLI --> CMD
    WEB --> ROUTER

    CMD --> GEN
    CMD --> MD2HTML
    CMD --> WC_RENDER
    CMD --> WC_API

    ROUTER --> MD2HTML
    ROUTER --> WC_RENDER

    GEN --> LLM_API
    MD2HTML --> SKILLS
    WC_RENDER --> SK_WC
    WC_RENDER --> SK_DESIGN

    WC_API --> WECHAT
    LLM_API --> OPENAI

    GEN --> OUTPUT
    MD2HTML --> CONTENTS
    WC_RENDER --> CONTENTS
    ROUTER --> MARKDOWNS
    CONFIG --> LLM_API
    CONFIG --> WC_API
```

## 核心模块数据流图

```mermaid
flowchart LR
    subgraph "输入 Input"
        MD[Markdown文件]
        TOPIC[文章主题]
    end

    subgraph "处理 Processing"
        PARSE[Markdown解析<br/>marked]
        RENDER[HTML渲染<br/>htmlGenerator]
        WC_RENDER[公众号渲染<br/>wechatRenderer]
        INLINE[内联样式<br/>juice]
        LLM[大模型生成<br/>openai]
    end

    subgraph "输出 Output"
        HTML[HTML文件]
        WC_HTML[公众号HTML]
        DRAFT[草稿箱]
    end

    MD --> PARSE --> RENDER --> HTML
    RENDER --> WC_RENDER --> INLINE --> WC_HTML
    TOPIC --> LLM --> PARSE
    WC_HTML --> |WeChatAPI| DRAFT
```

## 公众号发布流程图

```mermaid
sequenceDiagram
    participant User as 用户
    participant CLI as CLI/Web
    participant Renderer as WechatRenderer
    participant API as WeChatAPI
    participant WeChat as 微信服务器

    User->>CLI: publish article.md
    CLI->>Renderer: renderForWeChat(md)
    Renderer->>Renderer: 解析Markdown
    Renderer->>Renderer: 转换内联样式
    Renderer-->>CLI: 公众号HTML

    CLI->>API: getAccessToken()
    API->>WeChat: GET /token
    WeChat-->>API: access_token
    API-->>CLI: token

    alt 有图片
        CLI->>API: uploadImage(path)
        API->>WeChat: POST /material/add_material
        WeChat-->>API: media_id
    end

    CLI->>API: createDraft(article)
    API->>WeChat: POST /draft/add
    WeChat-->>API: media_id
    API-->>CLI: 草稿ID

    CLI-->>User: 发布成功
```

## 目录结构图

```mermaid
graph TD
    ROOT[DeepTalk/] --> SRC[src/]
    ROOT --> QODER[.agents/]
    ROOT --> CONTENTS[contents/]
    ROOT --> MARKDOWNS[markdowns/]
    ROOT --> OUTPUT[output/]
    ROOT --> CONFIG[config/]

    SRC --> INDEX[index.ts<br/>CLI入口]
    SRC --> SKILLS[skills/]
    SRC --> WEB[web/]
    SRC --> WECHAT[wechat/]
    SRC --> GENERATORS[generators/]
    SRC --> PROMPTS[prompts/]
    SRC --> TEMPLATES[templates/]

    SKILLS --> HTML_GEN[htmlGenerator.ts]
    SKILLS --> WC_RENDER[wechatRenderer.ts]
    SKILLS --> TYPES[types.ts]

    WECHAT --> API[api.ts]
    WECHAT --> TYPES_WC[types.ts]

    QODER --> SKILLS_DIR[skills/]
    SKILLS_DIR --> WC_SKILL[wechat-article/]
    SKILLS_DIR --> DESIGN_SKILL[design-system/]

    WC_SKILL --> SKILL_MD[SKILL.md]
    WC_SKILL --> TEMPLATES_WC[templates/]

    DESIGN_SKILL --> DESIGN_MD[DESIGN.md]
    DESIGN_SKILL --> REFS[references/]
```

## 技术栈分层图

```mermaid
graph TB
    subgraph "前端 Frontend"
        EJS[EJS模板]
        CSS[内联CSS]
        JS[原生JavaScript]
    end

    subgraph "后端 Backend"
        TS[TypeScript]
        EXPR[Express.js]
        CMD[Commander.js]
    end

    subgraph "渲染引擎 Rendering"
        MARKED[marked]
        JUICE[juice]
        HLJS[highlight.js]
    end

    subgraph "API集成 API Integration"
        OPENAI[openai SDK]
        AXIOS[axios]
    end

    subgraph "开发工具 Dev Tools"
        NODE[Node.js]
        TSC[tsc]
        TS_NODE[ts-node]
    end

    CSS --> JUICE
    MARKED --> HLJS
    TS --> EXPR
    TS --> CMD
    OPENAI --> AXIOS
```

## 模块依赖关系图

```mermaid
graph LR
    subgraph "核心依赖 Core Dependencies"
        A[index.ts] --> B[generators]
        A --> C[skills]
        A --> D[wechat]
        A --> E[web]
    end

    subgraph "生成器依赖 Generator Dependencies"
        B --> F[prompts]
        B --> G[templates]
        B --> H[config]
        B --> I[utils]
    end

    subgraph "技能依赖 Skills Dependencies"
        C --> J[marked]
        C --> K[juice]
        C --> L[highlight.js]
    end

    subgraph "微信依赖 WeChat Dependencies"
        D --> M[axios]
        D --> H
    end

    subgraph "Web依赖 Web Dependencies"
        E --> N[express]
        E --> C
    end
```

## 架构设计原则

### 1. 分层架构 (Layered Architecture)

| 层级 | 职责 | 模块 |
|------|------|------|
| 表现层 | 用户交互 | CLI, Web UI |
| 应用层 | 请求处理 | Command Handler, Router |
| 服务层 | 业务逻辑 | Generator, Renderer, API |
| 数据层 | 数据存储 | contents/, output/, config/ |

### 2. 关注点分离 (Separation of Concerns)

- **渲染逻辑**: `skills/htmlGenerator.ts`, `skills/wechatRenderer.ts`
- **API 集成**: `wechat/api.ts`, `generators/index.ts`
- **配置管理**: `config/index.ts`
- **CLI 入口**: `index.ts`

### 3. 开闭原则 (Open/Closed Principle)

- 新增主题：扩展 `themes` 对象，无需修改核心逻辑
- 新增 API：实现新接口，注入到 CLI
- 新增 Skill：在 `.agents/skills/` 添加目录

### 4. 依赖倒置 (Dependency Inversion)

```typescript
// 高层模块不依赖低层模块，两者都依赖抽象
interface Renderer {
  render(content: string, options: RenderOptions): string;
}

class HtmlGenerator implements Renderer { }
class WechatRenderer implements Renderer { }

// 高层模块
class ArticleService {
  constructor(private renderer: Renderer) {}
}
```

## 扩展点设计

### 1. 渲染器扩展

```typescript
// src/skills/types.ts
export interface Renderer {
  name: string;
  render(content: string, options: RenderOptions): string;
}

// 注册新渲染器
Registry.registerRenderer('wechat', new WechatRenderer());
```

### 2. 主题扩展

```typescript
// 新增主题只需添加配置
const themes = {
  tech: { /* ... */ },
  business: { /* ... */ },
  custom: { /* 用户自定义 */ }
};
```

### 3. API 扩展

```typescript
// 支持多个平台
interface PublishAPI {
  publish(article: Article): Promise<string>;
}

class WeChatAPI implements PublishAPI { }
class MediumAPI implements PublishAPI { } // 未来扩展
```
