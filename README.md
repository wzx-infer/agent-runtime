# Agent Runtime

一个适合初学者学习的 Agent Runtime 框架，具有清晰的架构和良好的可扩展性。

## 📚 项目简介

Agent Runtime 是一个轻量级的 AI Agent 运行时框架，旨在帮助开发者：
- 🎓 快速理解 Agent 的核心概念
- 🔧 轻松创建和管理 AI Agents
- 🛠️ 扩展自定义工具和能力
- 🚀 从简单示例逐步构建复杂应用

## ✨ 核心特性

- **简单易懂**：清晰的代码结构，丰富的注释
- **模块化设计**：核心组件解耦，易于扩展
- **类型安全**：完整的 TypeScript 支持
- **工具系统**：灵活的工具注册和调用机制
- **记忆管理**：内置对话历史和上下文管理
- **可观察性**：完整的执行日志和调试信息

## 🏗️ 项目结构

```
agent-runtime/
├── src/
│   ├── core/              # 核心运行时
│   │   ├── Agent.ts       # Agent 基类
│   │   ├── Runtime.ts     # 运行时管理器
│   │   ├── Tool.ts        # 工具基类
│   │   └── Memory.ts      # 记忆管理
│   ├── agents/            # 预定义 Agent
│   │   ├── ChatAgent.ts   # 对话 Agent
│   │   └── TaskAgent.ts   # 任务 Agent
│   ├── tools/             # 内置工具
│   │   ├── Calculator.ts  # 计算器工具
│   │   └── Weather.ts     # 天气查询工具
│   ├── examples/          # 示例代码
│   │   ├── basic.ts       # 基础示例
│   │   ├── chat-agent.ts  # 对话示例
│   │   └── tool-agent.ts  # 工具使用示例
│   └── index.ts           # 导出入口
├── docs/                  # 文档
│   ├── getting-started.md # 快速开始
│   ├── concepts.md        # 核心概念
│   └── api.md             # API 文档
└── tests/                 # 测试
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 运行示例

```bash
# 基础示例
npm run example:basic

# 对话 Agent 示例
npm run example:chat

# 工具使用示例
npm run example:tools
```

### 第一个 Agent

```typescript
import { Agent, Runtime } from './src';

// 创建一个简单的 Agent
const agent = new Agent({
  name: 'MyFirstAgent',
  description: '我的第一个 Agent',
  systemPrompt: '你是一个友好的助手'
});

// 创建运行时
const runtime = new Runtime();

// 运行 Agent
async function main() {
  const response = await runtime.run(agent, {
    message: '你好，请介绍一下自己'
  });
  
  console.log(response);
}

main();
```

## 📖 核心概念

### Agent（智能体）
Agent 是具有自主决策能力的智能实体，可以：
- 接收输入并生成输出
- 使用工具完成任务
- 维护对话上下文
- 执行多步推理

### Runtime（运行时）
Runtime 负责：
- 管理 Agent 的生命周期
- 协调工具调用
- 处理错误和异常
- 提供日志和监控

### Tool（工具）
Tool 是 Agent 可以调用的外部能力：
- 函数式工具（计算、处理）
- API 调用（天气、搜索）
- 数据库操作
- 文件操作

### Memory（记忆）
Memory 管理对话历史和上下文：
- 短期记忆（当前对话）
- 长期记忆（持久化存储）
- 上下文窗口管理

## 🔧 扩展指南

### 创建自定义工具

```typescript
import { Tool } from './src/core/Tool';

export class CustomTool extends Tool {
  constructor() {
    super({
      name: 'custom_tool',
      description: '自定义工具描述'
    });
  }

  async execute(params: any): Promise<any> {
    // 工具逻辑
    return result;
  }
}
```

### 创建自定义 Agent

```typescript
import { Agent } from './src/core/Agent';

export class CustomAgent extends Agent {
  constructor() {
    super({
      name: 'CustomAgent',
      description: '自定义 Agent'
    });
  }

  async process(input: string): Promise<string> {
    // Agent 逻辑
    return response;
  }
}
```

## 🎯 路线图

- [x] 基础运行时框架
- [x] 工具系统
- [x] 记忆管理
- [ ] LLM 集成（OpenAI, Anthropic）
- [ ] 流式输出支持
- [ ] 多 Agent 协作
- [ ] 插件系统
- [ ] Web UI 界面
- [ ] 持久化存储
- [ ] 性能监控

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📞 联系方式

如有问题，欢迎提交 Issue。
