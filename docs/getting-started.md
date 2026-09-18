# 快速开始

本指南将帮助你快速上手 Agent Runtime。

## 安装

```bash
# 克隆项目
git clone <your-repo-url>
cd agent-runtime

# 安装依赖
npm install

# 构建项目
npm run build
```

## 核心概念

### 1. Agent（智能体）

Agent 是具有自主能力的智能实体：

```typescript
import { Agent } from './src/core/Agent';

const agent = new Agent({
  name: 'MyAgent',
  description: '我的第一个 Agent',
  systemPrompt: '你是一个有帮助的助手'
});
```

### 2. Runtime（运行时）

Runtime 负责管理和执行 Agent：

```typescript
import { Runtime } from './src/core/Runtime';

const runtime = new Runtime({
  verbose: true,
  timeout: 30000
});

// 运行 Agent
const response = await runtime.run(agent, {
  message: '你好！'
});
```

### 3. Tool（工具）

Tool 扩展 Agent 的能力：

```typescript
import { Tool } from './src/core/Tool';

class MyTool extends Tool {
  constructor() {
    super({
      name: 'my_tool',
      description: '我的工具'
    });
  }

  async execute(params: any) {
    // 工具逻辑
    return result;
  }
}

// 注册到 Agent
agent.registerTool(new MyTool());
```

### 4. Memory（记忆）

Memory 管理对话历史：

```typescript
import { Memory } from './src/core/Memory';

const memory = new Memory({
  maxEntries: 100,
  maxTokens: 4000
});

// 添加记忆
memory.add('user', '你好');
memory.add('assistant', '你好！有什么可以帮助你的吗？');

// 获取记忆
const recent = memory.getRecent(5);
```

## 示例

### 示例 1: 基础 Agent

```typescript
import { Agent, Runtime } from './src';

async function main() {
  const agent = new Agent({
    name: 'BasicAgent',
    description: '基础示例'
  });

  const runtime = new Runtime();
  
  const response = await runtime.run(agent, {
    message: '你好'
  });
  
  console.log(response.content);
}

main();
```

运行：
```bash
npm run example:basic
```

### 示例 2: 对话 Agent

```typescript
import { ChatAgent, Runtime } from './src';

async function main() {
  const chatAgent = new ChatAgent();
  const runtime = new Runtime();

  // 多轮对话
  const messages = ['你好', '你能做什么？', '谢谢'];
  
  for (const msg of messages) {
    const response = await runtime.run(chatAgent, { message: msg });
    console.log(response.content);
  }
}

main();
```

运行：
```bash
npm run example:chat
```

### 示例 3: 使用工具的 Agent

```typescript
import { TaskAgent, Runtime, Calculator, Weather } from './src';

async function main() {
  const taskAgent = new TaskAgent();
  
  // 注册工具
  taskAgent.registerTool(new Calculator());
  taskAgent.registerTool(new Weather());

  const runtime = new Runtime();

  // 使用工具
  const response = await runtime.run(taskAgent, {
    message: '计算 25 * 4'
  });
  
  console.log(response.content);
  console.log('工具调用:', response.toolCalls);
}

main();
```

运行：
```bash
npm run example:tools
```

## 下一步

- 阅读 [核心概念](./concepts.md) 深入了解架构
- 查看 [API 文档](./api.md) 了解详细接口
- 尝试创建自己的 Agent 和工具

## 常见问题

### Q: 如何接入真实的 LLM？

A: 目前的示例使用了简化的响应生成。要接入真实 LLM（如 OpenAI）：

```typescript
import OpenAI from 'openai';

class LLMAgent extends Agent {
  private openai = new OpenAI({ apiKey: 'your-key' });

  async process(input: string): Promise<AgentResponse> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: this.getMessages()
    });
    
    return { content: completion.choices[0].message.content };
  }
}
```

### Q: 如何持久化记忆？

A: Memory 类提供了导出和导入方法：

```typescript
// 导出
const data = memory.export();
fs.writeFileSync('memory.json', data);

// 导入
const data = fs.readFileSync('memory.json', 'utf-8');
memory.import(data);
```

### Q: 如何添加自定义工具？

A: 继承 Tool 类并实现 execute 方法：

```typescript
class SearchTool extends Tool {
  constructor() {
    super({
      name: 'search',
      description: '搜索信息',
      parameters: [{
        name: 'query',
        type: 'string',
        description: '搜索关键词',
        required: true
      }]
    });
  }

  async execute(params: any) {
    // 实现搜索逻辑
    return searchResults;
  }
}
```
