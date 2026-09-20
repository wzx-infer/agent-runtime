"""
真正的 Agent Runtime - DeepSeek API 版本
支持实际的 LLM 推理和工具调用
"""

import os
import json
import requests
from typing import Dict, List, Any, Optional
from datetime import datetime


class Tool:
    """工具基类"""

    def __init__(self, name: str, description: str, parameters: Dict):
        self.name = name
        self.description = description
        self.parameters = parameters

    def to_function_schema(self) -> Dict:
        """转换为 OpenAI Function Calling 格式"""
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters
            }
        }

    def execute(self, **kwargs) -> Any:
        """执行工具（子类实现）"""
        raise NotImplementedError


class WebSearchTool(Tool):
    """网络搜索工具 - 使用 DuckDuckGo 搜索"""

    def __init__(self):
        super().__init__(
            name="web_search",
            description="搜索互联网获取最新信息。适用于：查询实时信息、新闻、百科知识等",
            parameters={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "搜索关键词或问题"
                    },
                    "max_results": {
                        "type": "integer",
                        "description": "返回结果数量，默认 5",
                        "default": 5
                    }
                },
                "required": ["query"]
            }
        )

    def execute(self, query: str, max_results: int = 5) -> Dict:
        """执行网络搜索"""
        try:
            # 使用 DuckDuckGo HTML 搜索
            url = "https://html.duckduckgo.com/html/"
            params = {"q": query}
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }

            response = requests.get(url, params=params, headers=headers, timeout=10)

            # 简化实现：返回搜索结果概要
            if response.status_code == 200:
                return {
                    "success": True,
                    "query": query,
                    "results": f"搜索 '{query}' 返回了相关结果。",
                    "note": "⚠️ 简化实现，实际应解析 HTML 提取结果"
                }
            else:
                return {
                    "success": False,
                    "error": f"搜索失败，状态码: {response.status_code}"
                }
        except Exception as e:
            return {
                "success": False,
                "error": f"搜索出错: {str(e)}"
            }


class WeatherTool(Tool):
    """天气查询工具 - 使用免费天气 API"""

    def __init__(self):
        super().__init__(
            name="get_weather",
            description="查询指定城市的实时天气信息",
            parameters={
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称，如：北京、上海、深圳"
                    }
                },
                "required": ["city"]
            }
        )

    def execute(self, city: str) -> Dict:
        """查询天气"""
        try:
            # 使用 wttr.in 免费天气服务
            url = f"https://wttr.in/{city}?format=j1&lang=zh"
            response = requests.get(url, timeout=10)

            if response.status_code == 200:
                data = response.json()
                current = data.get('current_condition', [{}])[0]

                return {
                    "success": True,
                    "city": city,
                    "temperature": current.get('temp_C', 'N/A'),
                    "condition": current.get('lang_zh', [{}])[0].get('value', 'N/A'),
                    "humidity": current.get('humidity', 'N/A'),
                    "wind_speed": current.get('windspeedKmph', 'N/A'),
                    "feels_like": current.get('FeelsLikeC', 'N/A')
                }
            else:
                return {
                    "success": False,
                    "error": "无法获取天气信息"
                }
        except Exception as e:
            return {
                "success": False,
                "error": f"天气查询出错: {str(e)}"
            }


class CalculatorTool(Tool):
    """计算器工具"""

    def __init__(self):
        super().__init__(
            name="calculator",
            description="执行数学计算，支持基本运算和复杂表达式",
            parameters={
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "数学表达式，如：2+2、10*5、(100-20)/4"
                    }
                },
                "required": ["expression"]
            }
        )

    def execute(self, expression: str) -> Dict:
        """执行计算"""
        try:
            # 安全的表达式求值
            result = eval(expression, {"__builtins__": {}}, {})
            return {
                "success": True,
                "expression": expression,
                "result": result
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"计算错误: {str(e)}"
            }


class DeepSeekAgent:
    """基于 DeepSeek API 的真实 Agent"""

    def __init__(self, api_key: str, model: str = "deepseek-chat"):
        self.api_key = api_key
        self.model = model
        self.base_url = "https://api.deepseek.com/v1"
        self.tools: Dict[str, Tool] = {}
        self.messages: List[Dict] = []

    def register_tool(self, tool: Tool):
        """注册工具"""
        self.tools[tool.name] = tool
        print(f"✓ 已注册工具: {tool.name}")

    def add_message(self, role: str, content: str):
        """添加消息"""
        self.messages.append({
            "role": role,
            "content": content
        })

    def chat(self, user_message: str, max_iterations: int = 5) -> str:
        """
        与 Agent 对话
        支持多轮工具调用
        """
        self.add_message("user", user_message)

        iteration = 0

        while iteration < max_iterations:
            iteration += 1
            print(f"\n🔄 迭代 {iteration}/{max_iterations}")

            # 准备工具定义
            tools_schema = [tool.to_function_schema() for tool in self.tools.values()]

            # 调用 DeepSeek API
            response = self._call_api(tools_schema)

            if not response:
                return "❌ API 调用失败"

            message = response.get('choices', [{}])[0].get('message', {})

            # 检查是否有工具调用
            tool_calls = message.get('tool_calls', [])

            if not tool_calls:
                # 没有工具调用，返回最终答案
                assistant_message = message.get('content', '')
                self.add_message("assistant", assistant_message)
                return assistant_message

            # 执行工具调用
            self.add_message("assistant", message.get('content', ''))

            for tool_call in tool_calls:
                function_name = tool_call['function']['name']
                function_args = json.loads(tool_call['function']['arguments'])

                print(f"🔧 调用工具: {function_name}")
                print(f"   参数: {function_args}")

                # 执行工具
                if function_name in self.tools:
                    result = self.tools[function_name].execute(**function_args)
                    print(f"   结果: {result}")

                    # 将工具结果添加到对话
                    self.messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call['id'],
                        "content": json.dumps(result, ensure_ascii=False)
                    })

        return "⚠️ 达到最大迭代次数"

    def _call_api(self, tools_schema: List[Dict]) -> Optional[Dict]:
        """调用 DeepSeek API"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            payload = {
                "model": self.model,
                "messages": self.messages,
                "tools": tools_schema,
                "temperature": 0.7
            }

            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=30
            )

            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ API 错误: {response.status_code}")
                print(f"   响应: {response.text}")
                return None

        except Exception as e:
            print(f"❌ 请求失败: {str(e)}")
            return None

    def reset(self):
        """重置对话"""
        self.messages = []


# 使用示例
if __name__ == '__main__':
    import sys
    import io
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8', line_buffering=True)

    print("🤖 DeepSeek Agent Runtime\n")

    # 从环境变量获取 API Key
    api_key = os.getenv('DEEPSEEK_API_KEY')

    if not api_key:
        print("请设置环境变量 DEEPSEEK_API_KEY")
        print("或在代码中直接设置:")
        print('  api_key = "your-api-key-here"')
        print("\n临时设置（仅本次运行）:")
        api_key = input("请输入你的 DeepSeek API Key: ").strip()

    if not api_key:
        print("❌ 未提供 API Key，退出")
        exit(1)

    # 创建 Agent
    agent = DeepSeekAgent(api_key)

    # 注册工具
    agent.register_tool(CalculatorTool())
    agent.register_tool(WeatherTool())
    agent.register_tool(WebSearchTool())

    print("\n" + "="*60)
    print("Agent 已就绪！输入 'quit' 退出")
    print("="*60 + "\n")

    # 交互式对话
    while True:
        try:
            user_input = input("\n👤 你: ").strip()

            if user_input.lower() in ['quit', 'exit', '退出']:
                print("\n👋 再见！")
                break

            if not user_input:
                continue

            print("\n🤖 Agent 思考中...")
            response = agent.chat(user_input)
            print(f"\n🤖 Agent: {response}")

        except KeyboardInterrupt:
            print("\n\n👋 再见！")
            break
        except Exception as e:
            print(f"\n❌ 错误: {str(e)}")
