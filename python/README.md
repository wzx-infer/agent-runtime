# Agent Runtime - Python 快速上手

## 🚀 立即运行

项目已经可以直接运行了！使用 Python 版本：

```bash
cd python
python agent_runtime.py
```

## 📚 示例程序

### 1. 基础示例 - 简单的 Agent 交互
```bash
python agent_runtime.py
```

演示内容：
- 创建 ChatAgent
- 多轮对话
- 查看状态统计

### 2. 对话示例 - 完整的对话流程
```bash
python chat_example.py
```

演示内容：
- 对话历史管理
- 记忆统计
- 上下文维护

### 3. 工具使用示例 - Agent 调用工具
```bash
python tool_example.py
```

演示内容：
- 计算器工具
- 天气查询工具
- 工具链调用

## 🎯 快速开始

### 创建你的第一个 Agent

```python
from agent_runtime import ChatAgent, Runtime

# 创建 Agent
agent = ChatAgent(system_prompt='你是一个友好的助手')

# 创建运行时
runtime = Runtime(verbose=True)

# 执行对话
response = runtime.run(agent, '你好！')
print(response['content'])
```

### 使用工具

```python
from agent_runtime import Agent, Calculator

# 创建 Agent 并注册工具
agent = Agent('MyAgent', '我的 Agent', '你是一个助手')
agent.register_tool(Calculator())

# 执行工具
tool = agent.tools['calculator']
result = tool.execute({'expression': '10 + 20'})
print(result)  # {'expression': '10 + 20', 'result': 30, 'success': True}
```

## 📦 项目结构

```
python/
├── agent_runtime.py    # 核心框架
├── basic_example.py    # 基础示例
├── chat_example.py     # 对话示例
└── tool_example.py     # 工具示例
```

## 🔧 核心组件

### Agent
智能体基类，所有 Agent 的基础：

```python
agent = Agent(
    name='MyAgent',
    description='描述',
    system_prompt='系统提示词'
)
```

### ChatAgent
对话型 Agent，带记忆管理：

```python
chat_agent = ChatAgent(system_prompt='你是助手')
response = chat_agent.process('你好')
```

### Tool
工具基类，扩展 Agent 能力：

```python
class MyTool(Tool):
    def __init__(self):
        super().__init__('tool_name', '工具描述')
    
    def execute(self, params):
        # 工具逻辑
        return result
```

### Runtime
运行时管理器，协调执行：

```python
runtime = Runtime(verbose=True, timeout=30000)
response = runtime.run(agent, '输入消息')
```

## 🎨 自定义扩展

### 创建自定义工具

```python
class SearchTool(Tool):
    def __init__(self):
        super().__init__('search', '搜索工具')
    
    def execute(self, params):
        query = params.get('query')
        # 执行搜索逻辑
        return {'results': [...], 'success': True}

# 使用
agent.register_tool(SearchTool())
```

### 创建自定义 Agent

```python
class CustomAgent(Agent):
    def process(self, input_text):
        # 自定义处理逻辑
        response = f"处理: {input_text}"
        return {'content': response}
```

## 💡 下一步

1. **运行所有示例**，了解基础功能
2. **修改示例代码**，尝试不同的配置
3. **创建自己的工具**，扩展 Agent 能力
4. **设计自定义 Agent**，实现特定功能

## 🔄 Node.js 版本

如果你想使用完整的 TypeScript 版本：

1. 安装 Node.js: https://nodejs.org/
2. 运行：
   ```bash
   npm install
   npm run build
   npm run example:basic
   ```

## 📖 文档

- [核心概念](../docs/concepts.md)
- [API 文档](../docs/api.md)
- [快速开始](../docs/getting-started.md)

## 🎉 开始探索

现在你可以开始探索和学习 Agent Runtime 了！
