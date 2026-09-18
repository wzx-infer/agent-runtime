"""
Agent Runtime - Python 版本
简化的 Python 实现，用于快速测试和学习
"""

from typing import Dict, List, Any, Optional
from datetime import datetime


class Memory:
    """记忆管理器"""

    def __init__(self, max_entries: int = 100):
        self.max_entries = max_entries
        self.entries: List[Dict[str, Any]] = []
        self.id_counter = 0

    def add(self, role: str, content: str, metadata: Optional[Dict] = None) -> Dict:
        """添加记忆条目"""
        entry = {
            'id': f'mem_{self.id_counter}',
            'role': role,
            'content': content,
            'timestamp': datetime.now().timestamp(),
            'metadata': metadata or {}
        }
        self.entries.append(entry)
        self.id_counter += 1

        # 限制条目数
        if len(self.entries) > self.max_entries:
            self.entries.pop(0)

        return entry

    def get_all(self) -> List[Dict]:
        """获取所有记忆"""
        return self.entries.copy()

    def get_recent(self, count: int) -> List[Dict]:
        """获取最近的 N 条记忆"""
        return self.entries[-count:] if count > 0 else []

    def clear(self):
        """清空记忆"""
        self.entries = []
        self.id_counter = 0


class Tool:
    """工具基类"""

    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description

    def execute(self, params: Dict[str, Any]) -> Any:
        """执行工具（子类需要实现）"""
        raise NotImplementedError


class Calculator(Tool):
    """计算器工具"""

    def __init__(self):
        super().__init__(
            name='calculator',
            description='执行基础数学运算'
        )

    def execute(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """执行计算"""
        expression = params.get('expression', '')

        try:
            # 简单的计算（注意：实际应用中需要更安全的实现）
            result = eval(expression, {"__builtins__": {}}, {})
            return {
                'expression': expression,
                'result': result,
                'success': True
            }
        except Exception as e:
            return {
                'expression': expression,
                'error': str(e),
                'success': False
            }


class Agent:
    """Agent 基类"""

    def __init__(self, name: str, description: str, system_prompt: str = ''):
        self.name = name
        self.description = description
        self.system_prompt = system_prompt
        self.tools: Dict[str, Tool] = {}
        self.messages: List[Dict] = []

        if system_prompt:
            self.messages.append({
                'role': 'system',
                'content': system_prompt
            })

    def register_tool(self, tool: Tool):
        """注册工具"""
        self.tools[tool.name] = tool
        print(f"[{self.name}] 已注册工具: {tool.name}")

    def add_message(self, role: str, content: str):
        """添加消息"""
        self.messages.append({
            'role': role,
            'content': content,
            'timestamp': datetime.now().timestamp()
        })

    def process(self, input_text: str) -> Dict[str, Any]:
        """处理输入"""
        self.add_message('user', input_text)

        # 简单的响应生成
        response = f"[{self.name}] 收到消息: \"{input_text}\""

        self.add_message('assistant', response)

        return {
            'content': response,
            'metadata': {
                'message_count': len(self.messages),
                'timestamp': datetime.now().timestamp()
            }
        }

    def get_status(self) -> Dict[str, Any]:
        """获取状态"""
        return {
            'name': self.name,
            'description': self.description,
            'message_count': len(self.messages),
            'tool_count': len(self.tools),
            'tools': list(self.tools.keys())
        }


class ChatAgent(Agent):
    """对话 Agent"""

    def __init__(self, system_prompt: str = '你是一个友好的助手'):
        super().__init__(
            name='ChatAgent',
            description='对话 Agent',
            system_prompt=system_prompt
        )
        self.memory = Memory()

    def process(self, input_text: str) -> Dict[str, Any]:
        """处理对话"""
        self.memory.add('user', input_text)

        # 简单的规则响应
        response = self._generate_response(input_text)

        self.memory.add('assistant', response)
        self.add_message('user', input_text)
        self.add_message('assistant', response)

        return {
            'content': response,
            'metadata': {
                'memory_count': len(self.memory.get_all())
            }
        }

    def _generate_response(self, input_text: str) -> str:
        """生成响应"""
        text_lower = input_text.lower()

        if '你好' in text_lower or 'hello' in text_lower:
            return '你好！很高兴见到你。有什么我可以帮助你的吗？'
        elif '天气' in text_lower:
            return '我可以帮你查询天气信息。请告诉我你想查询哪个城市的天气。'
        elif '计算' in text_lower or '算' in text_lower:
            return '我可以帮你进行数学计算。请告诉我要计算什么。'
        elif '谢谢' in text_lower or 'thank' in text_lower:
            return '不客气！如果还有其他问题，随时告诉我。'
        elif '再见' in text_lower or 'bye' in text_lower:
            return '再见！期待下次与你交流。'
        else:
            return f'我理解你说的是："{input_text}"。我会尽力帮助你！'


class Runtime:
    """运行时管理器"""

    def __init__(self, verbose: bool = True, timeout: int = 30000):
        self.verbose = verbose
        self.timeout = timeout
        self.agents: Dict[str, Agent] = {}

    def register_agent(self, agent: Agent):
        """注册 Agent"""
        self.agents[agent.name] = agent
        self._log(f"已注册 Agent: {agent.name}")

    def run(self, agent: Agent, message: str) -> Dict[str, Any]:
        """运行 Agent"""
        self._log(f"\n{'=' * 60}")
        self._log(f"开始运行 Agent: {agent.name}")
        self._log(f"输入: {message}")
        self._log(f"{'=' * 60}\n")

        start_time = datetime.now()

        try:
            response = agent.process(message)

            duration = (datetime.now() - start_time).total_seconds() * 1000
            self._log(f"\n{'=' * 60}")
            self._log(f"Agent 执行完成 (耗时: {duration:.0f}ms)")
            self._log(f"输出: {response['content']}")
            self._log(f"{'=' * 60}\n")

            return response
        except Exception as e:
            self._log(f"\n❌ Agent 执行失败: {str(e)}\n")
            raise

    def _log(self, message: str):
        """日志输出"""
        if self.verbose:
            print(message)


if __name__ == '__main__':
    # 设置输出编码
    import sys
    import io
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print('🚀 Agent Runtime - Python 版本\n')

    # 创建对话 Agent
    agent = ChatAgent(system_prompt='你是一个友好的助手')

    # 创建运行时
    runtime = Runtime(verbose=True)
    runtime.register_agent(agent)

    # 测试对话
    messages = [
        '你好！',
        '你能做什么？',
        '帮我计算 25 * 4',
        '谢谢你的帮助！'
    ]

    print('开始对话...\n')
    print('=' * 60)

    for msg in messages:
        print(f"\n👤 用户: {msg}")
        response = runtime.run(agent, msg)
        print(f"🤖 助手: {response['content']}")
        print('-' * 60)

    print('\n\n📊 Agent 状态:')
    import json
    print(json.dumps(agent.get_status(), indent=2, ensure_ascii=False))
