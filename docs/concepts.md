# 核心概念

理解 Agent Runtime 的核心概念，帮助你构建强大的 AI 应用。

## 架构概览

```
┌─────────────────────────────────────────────────────┐
│                     Runtime                          │
│  (运行时管理器 - 协调执行、错误处理、生命周期)        │
└──────────────────┬──────────────────────────────────┘
                   │
      ┌────────────┴────────────┐
      │                         │
┌─────▼──────┐          ┌──────▼──────┐
│   Agent    │          │   Agent     │
│ (智能体)    │          │ (智能体)     │
└─────┬──────┘          └──────┬──────┘
      │                        │
      ├──── Memory             ├──── Memory
      │     (记忆)             │     (记忆)
      │                        │
      └──── Tools              └──── Tools
            (工具集)                  (工具集)
```

## Agent（智能体）

### 什么是 Agent？

Agent 是一个自主的智能实体，能够：
- **感知**：接收和理解输入
- **思考**：处理信息并做出决策
- **行动**：使用工具执行任务
- **记忆**：维护上下文和历史

### Agent 的生命周期

```
创建 → 配置 → 注册工具 → 执行 → 清理
```

### Agent 类型

#### 1. 基础 Agent
最简单的 Agent，提供核心功能：

```typescript
const agent = new Agent({
  name: 'BasicAgent',
  description: '基础 Agent',
  systemPrompt: '你是一个助手'
});
```

#### 2. ChatAgent（对话 Agent）
专门用于对话场景：

```typescript
const chatAgent = new ChatAgent({
  systemPrompt: '你是一个友好的助手'
});
```

特点：
- 内置记忆管理
- 对话历史追踪
- 上下文理解

#### 3. TaskAgent（任务 Agent）
专门用于执行任务和使用工具：

```typescript
const taskAgent = new TaskAgent();
taskAgent.registerTool(new Calculator());
taskAgent.registerTool(new Weather());
```

特点：
- 工具调用能力
- 任务规划
- 多步推理

### Agent 配置

```typescript
interface AgentConfig {
  name: string;           // Agent 名称
  description: string;    // Agent 描述
  systemPrompt?: string;  // 系统提示词
  temperature?: number;   // 温度参数 (0-1)
  maxTokens?: number;     // 最大 token 数
}
```

## Runtime（运行时）

### 什么是 Runtime？

Runtime 是 Agent 的执行环境，负责：
- **生命周期管理**：创建、启动、停止 Agent
- **资源协调**：分配和管理系统资源
- **错误处理**：捕获和处理异常
- **监控日志**：记录执行过程

### Runtime 配置

```typescript
const runtime = new Runtime({
  maxIterations: 10,  // 最大迭代次数
  timeout: 30000,     // 超时时间（毫秒）
  verbose: true       // 详细日志
});
```

### Runtime 使用模式

#### 单 Agent 模式

```typescript
const response = await runtime.run(agent, {
  message: '执行任务'
});
```

#### 多 Agent 模式

```typescript
const agents = [agent1, agent2, agent3];
const responses = await runtime.runMultiple(agents, {
  message: '并行执行'
});
```

## Tool（工具）

### 什么是 Tool？

Tool 扩展 Agent 的能力，让它可以：
- 调用外部 API
- 执行计算
- 操作数据库
- 读写文件

### Tool 结构

```typescript
class CustomTool extends Tool {
  constructor() {
    super({
      name: 'tool_name',
      description: '工具描述',
      parameters: [
        {
          name: 'param1',
          type: 'string',
          description: '参数描述',
          required: true
        }
      ]
    });
  }

  async execute(params: any) {
    // 工具逻辑
    return result;
  }
}
```

### 工具类型

#### 1. 函数式工具
执行计算和数据处理：
- Calculator（计算器）
- DataTransformer（数据转换）
- Validator（验证器）

#### 2. API 工具
调用外部服务：
- Weather（天气查询）
- Search（搜索引擎）
- Translation（翻译）

#### 3. 数据工具
操作数据存储：
- Database（数据库）
- FileSystem（文件系统）
- Cache（缓存）

### 工具注册

```typescript
// 方式 1: 直接注册
agent.registerTool(new Calculator());

// 方式 2: 批量注册
const tools = [
  new Calculator(),
  new Weather(),
  new Search()
];
tools.forEach(tool => agent.registerTool(tool));
```

## Memory（记忆）

### 什么是 Memory？

Memory 管理 Agent 的记忆和上下文：
- **短期记忆**：当前对话的上下文
- **长期记忆**：持久化的知识和历史
- **工作记忆**：当前任务的临时信息

### Memory 管理

```typescript
const memory = new Memory({
  maxEntries: 100,    // 最大条目数
  maxTokens: 4000     // 最大 token 数
});

// 添加记忆
memory.add('user', '用户消息');
memory.add('assistant', '助手响应');

// 检索记忆
const recent = memory.getRecent(10);      // 最近 10 条
const userMessages = memory.getByRole('user');  // 按角色过滤
const results = memory.search('关键词');   // 搜索
```

### 记忆策略

#### 1. 滑动窗口
保留最近的 N 条消息：

```typescript
const memory = new Memory({ maxEntries: 50 });
```

#### 2. Token 限制
基于 token 数量管理：

```typescript
const memory = new Memory({ maxTokens: 4000 });
```

#### 3. 重要性过滤
保留重要的消息：

```typescript
// 自定义实现
class ImportanceMemory extends Memory {
  add(role, content, importance = 1) {
    super.add(role, content, { importance });
  }
  
  prune() {
    // 删除低重要性的消息
  }
}
```

## 数据流

### 典型执行流程

```
用户输入
   ↓
Runtime 接收
   ↓
Agent 处理
   ↓
检查 Memory（获取上下文）
   ↓
分析是否需要工具
   ↓
是 → 调用 Tool → 获取结果
   ↓
生成响应
   ↓
更新 Memory
   ↓
返回给用户
```

### 消息格式

```typescript
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
  metadata?: any;
}
```

## 扩展性设计

### 1. 模块化
每个组件独立，易于替换和扩展：

```typescript
// 替换记忆实现
class RedisMemory extends Memory {
  // 使用 Redis 存储
}

// 替换 Agent 实现
class CustomAgent extends Agent {
  // 自定义逻辑
}
```

### 2. 插件系统
通过工具系统扩展功能：

```typescript
// 添加新工具
agent.registerTool(new CustomTool());
```

### 3. 事件系统（未来）
监听和响应事件：

```typescript
agent.on('message', handler);
agent.on('tool-call', handler);
```

## 最佳实践

### 1. Agent 设计
- 单一职责：每个 Agent 专注一个领域
- 清晰的系统提示词
- 合理的工具配置

### 2. Memory 管理
- 设置合理的上限
- 定期清理不重要的记忆
- 持久化重要信息

### 3. Tool 开发
- 明确的参数定义
- 完善的错误处理
- 幂等性设计

### 4. Runtime 配置
- 设置合理的超时时间
- 启用日志便于调试
- 监控资源使用

## 下一步

- 查看 [API 文档](./api.md) 了解详细接口
- 阅读 [快速开始](./getting-started.md) 运行示例
- 探索源码了解实现细节
