# Agent Runtime

一个**真正可用的** Agent Runtime 框架，集成 DeepSeek API，支持实际的工具调用和推理。

## 📚 项目简介

Agent Runtime 是一个生产级的 AI Agent 运行时框架，提供：
- 🤖 **真实 LLM 推理** - 基于 DeepSeek API
- 🔧 **智能工具调用** - LLM 自主决策何时使用工具
- 🌐 **实用工具集** - 网络搜索、天气查询、计算器等
- 🎓 **易于学习** - 清晰的代码结构和完整文档
- 🚀 **易于扩展** - 灵活的工具系统

## ✨ 两种实现

### 1. 真实版本（推荐）- DeepSeek API
完整的 Agent Runtime，使用真实的 LLM 进行推理：
- ✅ 真正的 AI 推理能力
- ✅ 自主工具调用决策
- ✅ 多轮对话和上下文理解
- ✅ 实际的网络工具（搜索、天气等）

### 2. 学习版本 - 纯 Python 实现
简化版本，用于理解 Agent 架构：
- 📖 清晰的代码结构
- 📖 详细的中文注释
- 📖 无需 API Key
- 📖 适合学习原理

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

### 方式 1: 真实 Agent（推荐）

```bash
# 1. 安装依赖
pip install requests

# 2. 设置 API Key（从 https://platform.deepseek.com/ 获取）
set DEEPSEEK_API_KEY=your-api-key-here

# 3. 运行
cd python
python deepseek_agent.py
```

**示例对话：**
```
👤 你: 帮我计算 1234 * 5678，然后查询北京的天气

🤖 Agent 思考中...
🔧 调用工具: calculator
   参数: {'expression': '1234 * 5678'}
🔧 调用工具: get_weather
   参数: {'city': '北京'}

🤖 Agent: 1234 乘以 5678 等于 7,006,652。
          北京当前温度 15°C，天气晴朗...
```

### 方式 2: 学习版本（无需 API）

```bash
cd python
python agent_runtime.py  # 基础示例
python demo.py          # 完整演示
```

### 第一个真实 Agent

```python
from deepseek_agent import DeepSeekAgent, CalculatorTool

# 创建 Agent
agent = DeepSeekAgent(api_key="your-key")

# 注册工具
agent.register_tool(CalculatorTool())

# 对话
response = agent.chat("计算 100 * 50")
print(response)  # LLM 会自动调用计算器工具并返回结果
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

```python
from deepseek_agent import Tool

class DatabaseTool(Tool):
    def __init__(self):
        super().__init__(
            name="query_database",
            description="查询数据库获取数据",
            parameters={
                "type": "object",
                "properties": {
                    "sql": {
                        "type": "string",
                        "description": "SQL 查询语句"
                    }
                },
                "required": ["sql"]
            }
        )
    
    def execute(self, sql: str):
        # 执行数据库查询
        return {"success": True, "data": [...]}

# 注册到 Agent
agent.register_tool(DatabaseTool())
```

### 工作原理

```
用户输入 → DeepSeek LLM 分析 → 决定使用哪个工具
                ↓
          调用工具执行
                ↓
       将结果返回给 LLM
                ↓
      LLM 生成最终回复 → 返回用户
```

## 🛠️ 可用工具

### 内置工具

1. **CalculatorTool** - 数学计算
   - 支持复杂表达式
   - 示例："计算 (100+50)*2"

2. **WeatherTool** - 实时天气查询
   - 使用 wttr.in 免费 API
   - 示例："北京的天气怎么样？"

3. **WebSearchTool** - 网络搜索
   - 使用 DuckDuckGo 搜索
   - 示例："搜索最新的 AI 新闻"

### 自定义工具

轻松添加新工具，LLM 会自动学会使用：
- 数据库查询
- 文件操作
- API 调用
- 任何你需要的功能

## 🎯 路线图

- [x] 基础运行时框架
- [x] 工具系统
- [x] 记忆管理
- [x] **LLM 集成（DeepSeek API）** ✨
- [x] **真实工具调用（网络搜索、天气等）** ✨
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
