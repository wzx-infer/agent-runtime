# DeepSeek Agent Runtime 使用指南

## 🚀 真正的 Agent Runtime

这是一个**真实的** Agent Runtime 实现，使用 DeepSeek API 进行推理，支持工具调用。

### 与之前版本的区别

| 特性 | 之前版本 | 现在版本 |
|------|---------|---------|
| LLM 推理 | ❌ 规则匹配 | ✅ DeepSeek API |
| 工具调用 | ❌ 预设规则 | ✅ LLM 自主决策 |
| 多轮对话 | ❌ 简单响应 | ✅ 完整上下文 |
| 网络工具 | ❌ 模拟数据 | ✅ 真实 API |

## 📋 前置要求

### 1. 安装依赖

```bash
pip install requests
```

### 2. 获取 DeepSeek API Key

1. 访问: https://platform.deepseek.com/
2. 注册账号并充值
3. 创建 API Key

### 3. 设置 API Key

**方法 1: 环境变量（推荐）**
```bash
# Windows
set DEEPSEEK_API_KEY=your-api-key-here

# Linux/Mac
export DEEPSEEK_API_KEY=your-api-key-here
```

**方法 2: 运行时输入**
程序会提示你输入 API Key

## 🎯 快速开始

### 交互式对话

```bash
python deepseek_agent.py
```

示例对话:
```
👤 你: 帮我计算 1234 * 5678
🤖 Agent 思考中...
🔧 调用工具: calculator
   参数: {'expression': '1234 * 5678'}
   结果: {'success': True, 'result': 7006652}
🤖 Agent: 计算结果是 7,006,652

👤 你: 北京的天气怎么样？
🤖 Agent 思考中...
🔧 调用工具: get_weather
   参数: {'city': '北京'}
   结果: {'success': True, 'temperature': '15', ...}
🤖 Agent: 北京当前温度 15°C，天气晴朗...
```

### 运行测试

```bash
python test_deepseek_agent.py
```

## 🛠️ 可用工具

### 1. Calculator（计算器）
- **功能**: 执行数学计算
- **示例**: "计算 100 * 50"、"(20+30) * 2 等于多少"

### 2. Weather（天气查询）
- **功能**: 查询实时天气
- **示例**: "北京的天气"、"上海今天热吗"
- **数据源**: wttr.in 免费天气服务

### 3. WebSearch（网络搜索）
- **功能**: 搜索互联网信息
- **示例**: "搜索最新的 AI 新闻"
- **数据源**: DuckDuckGo

## 📖 工作原理

### 1. 用户提问
```
"帮我计算 25 * 4，然后告诉我北京的天气"
```

### 2. Agent 分析
DeepSeek LLM 分析问题，决定需要使用哪些工具

### 3. 工具调用
```python
# 第一次调用
calculator.execute(expression="25 * 4")
# 返回: 100

# 第二次调用
get_weather.execute(city="北京")
# 返回: 温度、天气状况等
```

### 4. 生成回复
LLM 基于工具结果生成自然语言回复：
```
"25 乘以 4 等于 100。北京当前温度 15°C，天气晴朗。"
```

## 🔧 自定义工具

### 创建新工具

```python
from deepseek_agent import Tool

class MyTool(Tool):
    def __init__(self):
        super().__init__(
            name="my_tool",
            description="工具描述（LLM 用来决定何时使用）",
            parameters={
                "type": "object",
                "properties": {
                    "param1": {
                        "type": "string",
                        "description": "参数描述"
                    }
                },
                "required": ["param1"]
            }
        )
    
    def execute(self, param1: str) -> Dict:
        # 实现工具逻辑
        return {
            "success": True,
            "result": "..."
        }

# 注册到 Agent
agent.register_tool(MyTool())
```

## 📊 示例代码

### 简单使用

```python
from deepseek_agent import DeepSeekAgent, CalculatorTool

# 创建 Agent
agent = DeepSeekAgent(api_key="your-key")

# 注册工具
agent.register_tool(CalculatorTool())

# 对话
response = agent.chat("计算 100 + 200")
print(response)  # "100 加 200 等于 300"
```

### 多轮对话

```python
agent = DeepSeekAgent(api_key="your-key")
agent.register_tool(CalculatorTool())

# 第一轮
response1 = agent.chat("计算 10 * 5")
# "结果是 50"

# 第二轮（保留上下文）
response2 = agent.chat("再加上 20")
# "50 加 20 等于 70"
```

## 💡 最佳实践

### 1. 工具描述要清晰
```python
# ❌ 不好
description="计算工具"

# ✅ 好
description="执行数学计算，支持加减乘除和复杂表达式"
```

### 2. 参数描述要详细
```python
parameters={
    "type": "object",
    "properties": {
        "city": {
            "type": "string",
            "description": "城市名称，如：北京、上海、深圳"  # 提供示例
        }
    }
}
```

### 3. 错误处理
```python
def execute(self, **kwargs):
    try:
        # 工具逻辑
        return {"success": True, "result": ...}
    except Exception as e:
        return {"success": False, "error": str(e)}
```

## 🐛 故障排除

### API 调用失败
- 检查 API Key 是否正确
- 确认账户有余额
- 检查网络连接

### 工具未被调用
- 检查工具描述是否清晰
- 确认参数定义正确
- 尝试更明确的提问

### 编码错误
- Windows 用户已在代码中处理
- 确保使用 UTF-8 编码

## 📈 下一步

1. **添加更多工具** - 文件操作、数据库查询等
2. **优化提示词** - 提升 Agent 性能
3. **添加记忆系统** - 长期对话历史
4. **多 Agent 协作** - Agent 之间互相调用

## 🔗 相关资源

- [DeepSeek API 文档](https://platform.deepseek.com/docs)
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)
- [项目 GitHub](https://github.com/wzx-infer/agent-runtime)
