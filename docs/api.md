# API 文档

完整的 Agent Runtime API 参考文档。

## 核心类

### Agent

Agent 基类，所有 Agent 的基础实现。

#### 构造函数

```typescript
constructor(config: AgentConfig)
```

**AgentConfig:**
```typescript
interface AgentConfig {
  name: string;           // Agent 名称
  description: string;    // Agent 描述
  systemPrompt?: string;  // 系统提示词
  temperature?: number;   // 温度参数 (默认: 0.7)
  maxTokens?: number;     // 最大 token (默认: 2000)
}
```

#### 方法

##### getName()
获取 Agent 名称。

```typescript
getName(): string
```

##### getDescription()
获取 Agent 描述。

```typescript
getDescription(): string
```

##### registerTool(tool)
注册工具到 Agent。

```typescript
registerTool(tool: Tool): void
```

##### getTools()
获取所有已注册的工具。

```typescript
getTools(): Tool[]
```

##### addMessage(role, content)
添加消息到历史记录。

```typescript
addMessage(role: 'user' | 'assistant', content: string): void
```

##### getMessages()
获取所有消息历史。

```typescript
getMessages(): Message[]
```

##### clearHistory()
清空消息历史（保留系统提示词）。

```typescript
clearHistory(): void
```

##### process(input)
处理用户输入（核心方法，可被子类重写）。

```typescript
async process(input: string): Promise<AgentResponse>
```

**返回值:**
```typescript
interface AgentResponse {
  content: string;
  toolCalls?: ToolCall[];
  metadata?: Record<string, any>;
}
```

##### getStatus()
获取 Agent 状态信息。

```typescript
getStatus(): Record<string, any>
```

---

### Runtime

运行时管理器，负责协调 Agent 执行。

#### 构造函数

```typescript
constructor(config?: RuntimeConfig)
```

**RuntimeConfig:**
```typescript
interface RuntimeConfig {
  maxIterations?: number;  // 最大迭代次数 (默认: 10)
  timeout?: number;        // 超时时间/毫秒 (默认: 30000)
  verbose?: boolean;       // 详细日志 (默认: true)
}
```

#### 方法

##### registerAgent(agent)
注册 Agent 到运行时。

```typescript
registerAgent(agent: Agent): void
```

##### getAgent(name)
根据名称获取 Agent。

```typescript
getAgent(name: string): Agent | undefined
```

##### run(agent, context)
运行单个 Agent。

```typescript
async run(agent: Agent, context: RuntimeContext): Promise<AgentResponse>
```

**RuntimeContext:**
```typescript
interface RuntimeContext {
  message: string;
  metadata?: Record<string, any>;
}
```

##### runMultiple(agents, context)
批量运行多个 Agent。

```typescript
async runMultiple(
  agents: Agent[], 
  context: RuntimeContext
): Promise<AgentResponse[]>
```

##### getAgents()
获取所有已注册的 Agent。

```typescript
getAgents(): Agent[]
```

##### getStatus()
获取运行时状态。

```typescript
getStatus(): Record<string, any>
```

---

### Tool

工具基类，所有工具的基础实现。

#### 构造函数

```typescript
constructor(config: ToolConfig)
```

**ToolConfig:**
```typescript
interface ToolConfig {
  name: string;
  description: string;
  parameters?: ToolParameter[];
}

interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required?: boolean;
  default?: any;
}
```

#### 方法

##### getName()
获取工具名称。

```typescript
getName(): string
```

##### getDescription()
获取工具描述。

```typescript
getDescription(): string
```

##### getParameters()
获取工具参数定义。

```typescript
getParameters(): ToolParameter[]
```

##### getSchema()
获取工具的 JSON Schema（用于 LLM 工具调用）。

```typescript
getSchema(): Record<string, any>
```

##### execute(params)
执行工具（抽象方法，子类必须实现）。

```typescript
abstract async execute(params: Record<string, any>): Promise<any>
```

##### run(params)
工具执行的包装方法，包含验证和错误处理。

```typescript
async run(params: Record<string, any>): Promise<{
  success: boolean;
  result?: any;
  error?: string;
}>
```

---

### Memory

记忆管理器，管理对话历史和上下文。

#### 构造函数

```typescript
constructor(config?: MemoryConfig)
```

**MemoryConfig:**
```typescript
interface MemoryConfig {
  maxEntries?: number;      // 最大条目数 (默认: 100)
  maxTokens?: number;        // 最大 token (默认: 4000)
  persistPath?: string;      // 持久化路径
}
```

#### 方法

##### add(role, content, metadata?)
添加记忆条目。

```typescript
add(
  role: 'system' | 'user' | 'assistant',
  content: string,
  metadata?: Record<string, any>
): MemoryEntry
```

**返回值:**
```typescript
interface MemoryEntry {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
  metadata?: Record<string, any>;
}
```

##### getAll()
获取所有记忆条目。

```typescript
getAll(): MemoryEntry[]
```

##### getRecent(count)
获取最近的 N 条记忆。

```typescript
getRecent(count: number): MemoryEntry[]
```

##### getByRole(role)
根据角色过滤记忆。

```typescript
getByRole(role: 'system' | 'user' | 'assistant'): MemoryEntry[]
```

##### search(query)
搜索记忆内容。

```typescript
search(query: string): MemoryEntry[]
```

##### clear()
清空所有记忆。

```typescript
clear(): void
```

##### getStats()
获取记忆统计信息。

```typescript
getStats(): {
  totalEntries: number;
  estimatedTokens: number;
  byRole: { system: number; user: number; assistant: number };
  oldestEntry: number;
  newestEntry: number;
}
```

##### export()
导出记忆为 JSON。

```typescript
export(): string
```

##### import(data)
从 JSON 导入记忆。

```typescript
import(data: string): void
```

---

## 预定义 Agent

### ChatAgent

专门用于对话的 Agent。

```typescript
class ChatAgent extends Agent {
  constructor(config?: Partial<AgentConfig>)
  
  // 获取对话历史
  getConversationHistory(): string[]
  
  // 清空对话历史
  clearConversation(): void
  
  // 获取记忆统计
  getMemoryStats(): Record<string, any>
}
```

### TaskAgent

专门用于任务执行和工具使用的 Agent。

```typescript
class TaskAgent extends Agent {
  constructor(config?: Partial<AgentConfig>)
}
```

---

## 内置工具

### Calculator

数学计算工具。

```typescript
class Calculator extends Tool {
  constructor()
  
  // 执行计算
  async execute(params: {
    expression: string  // 数学表达式
  }): Promise<{
    expression: string;
    result: number;
    type: string;
  }>
}
```

**示例:**
```typescript
const calc = new Calculator();
const result = await calc.run({ expression: '2 + 2' });
// { success: true, result: { expression: '2 + 2', result: 4, type: 'number' } }
```

### Weather

天气查询工具（模拟实现）。

```typescript
class Weather extends Tool {
  constructor()
  
  // 查询天气
  async execute(params: {
    city: string;      // 城市名称
    unit?: string;     // 温度单位: 'celsius' | 'fahrenheit'
  }): Promise<{
    city: string;
    condition: string;
    temperature: number;
    unit: string;
    humidity: number;
    windSpeed: number;
    timestamp: string;
    note: string;
  }>
}
```

**示例:**
```typescript
const weather = new Weather();
const result = await weather.run({ city: '北京' });
```

---

## 类型定义

### Message
```typescript
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: number;
}
```

### ToolCall
```typescript
interface ToolCall {
  toolName: string;
  parameters: Record<string, any>;
  result?: any;
}
```

---

## 工具函数

### createRuntime(config?)
快速创建 Runtime 实例。

```typescript
function createRuntime(config?: RuntimeConfig): Runtime
```

### createAgent(config)
快速创建 Agent 实例。

```typescript
function createAgent(config: AgentConfig): Agent
```

---

## 常量

### VERSION
当前版本号。

```typescript
const VERSION: string  // '0.1.0'
```

---

## 使用示例

### 完整示例

```typescript
import { 
  Agent, 
  Runtime, 
  Calculator, 
  TaskAgent 
} from 'agent-runtime';

// 创建 Agent
const agent = new TaskAgent({
  name: 'MyAgent',
  systemPrompt: '你是一个助手'
});

// 注册工具
agent.registerTool(new Calculator());

// 创建运行时
const runtime = new Runtime({
  timeout: 30000,
  verbose: true
});

// 执行任务
const response = await runtime.run(agent, {
  message: '计算 100 * 25'
});

console.log(response.content);
console.log('工具调用:', response.toolCalls);
```

---

## 错误处理

所有异步方法都可能抛出错误，建议使用 try-catch：

```typescript
try {
  const response = await runtime.run(agent, { message: 'test' });
} catch (error) {
  console.error('执行失败:', error.message);
}
```

常见错误：
- `工具未找到`: 尝试调用未注册的工具
- `参数验证失败`: 工具参数不符合要求
- `执行超时`: 超过配置的超时时间
- `表达式格式错误`: Calculator 工具的表达式无效
