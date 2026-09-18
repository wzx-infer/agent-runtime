"""
工具使用示例 - Python 版本
演示 TaskAgent 如何使用工具完成任务
"""

import sys
import io
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from agent_runtime import Agent, Runtime, Tool, Calculator
import re


class Weather(Tool):
    """天气查询工具（模拟）"""

    def __init__(self):
        super().__init__(
            name='weather',
            description='查询城市天气信息'
        )

    def execute(self, params):
        """执行天气查询"""
        import random

        city = params.get('city', '未知')
        conditions = ['晴朗', '多云', '阴天', '小雨', '大雨']
        condition = random.choice(conditions)
        temp = random.randint(15, 30)

        return {
            'city': city,
            'condition': condition,
            'temperature': temp,
            'unit': '°C',
            'humidity': random.randint(40, 80),
            'wind_speed': random.randint(5, 25),
            'note': '⚠️ 这是模拟数据',
            'success': True
        }


class TaskAgent(Agent):
    """任务执行 Agent"""

    def __init__(self, system_prompt='你是一个任务执行助手'):
        super().__init__(
            name='TaskAgent',
            description='任务执行 Agent',
            system_prompt=system_prompt
        )

    def process(self, input_text):
        """处理任务"""
        self.add_message('user', input_text)

        # 分析是否需要使用工具
        tool_calls = self._analyze_tools(input_text)

        if tool_calls:
            print(f"\n[{self.name}] 识别到 {len(tool_calls)} 个工具调用\n")

            results = []
            for tool_name, params in tool_calls:
                if tool_name in self.tools:
                    tool = self.tools[tool_name]
                    result = tool.execute(params)
                    results.append((tool_name, result))
                    print(f"✓ 工具 \"{tool_name}\" 执行成功\n")

            response = self._format_results(input_text, results)
        else:
            response = f"我收到了任务：\"{input_text}\"，但目前无法处理。"

        self.add_message('assistant', response)

        return {
            'content': response,
            'tool_calls': tool_calls,
            'metadata': {'tools_used': len(tool_calls)}
        }

    def _analyze_tools(self, input_text):
        """分析需要使用的工具"""
        tools = []
        text_lower = input_text.lower()

        # 检测计算需求
        if '计算' in text_lower or '算' in text_lower:
            # 提取数学表达式
            match = re.search(r'(\d+\s*[+\-*/]\s*\d+)', input_text)
            if match:
                tools.append(('calculator', {'expression': match.group(1)}))

        # 检测天气查询
        if '天气' in text_lower:
            # 提取城市名
            cities = ['北京', '上海', '广州', '深圳', '杭州', '成都']
            for city in cities:
                if city in input_text:
                    tools.append(('weather', {'city': city}))
                    break

        return tools

    def _format_results(self, input_text, results):
        """格式化工具执行结果"""
        responses = []

        for tool_name, result in results:
            if not result.get('success', False):
                responses.append(f"❌ {tool_name} 执行失败: {result.get('error', '未知错误')}")
                continue

            if tool_name == 'calculator':
                exp = result['expression']
                res = result['result']
                responses.append(f"计算结果: {exp} = {res}")

            elif tool_name == 'weather':
                w = result
                responses.append(
                    f"{w['city']}的天气: {w['condition']}, "
                    f"温度 {w['temperature']}{w['unit']}, "
                    f"湿度 {w['humidity']}%, "
                    f"风速 {w['wind_speed']} km/h\n"
                    f"{w['note']}"
                )

        return '\n\n'.join(responses) if responses else '任务完成'


def main():
    print('🛠️  TaskAgent 工具使用示例\n')

    # 创建任务 Agent
    task_agent = TaskAgent()

    # 注册工具
    task_agent.register_tool(Calculator())
    task_agent.register_tool(Weather())

    print(f"\n✓ 已注册 {len(task_agent.tools)} 个工具\n")

    # 创建运行时
    runtime = Runtime(verbose=True)

    # 测试任务
    tasks = [
        {'description': '数学计算', 'message': '帮我计算 125 * 8'},
        {'description': '天气查询', 'message': '北京今天的天气怎么样？'},
        {'description': '复杂表达式', 'message': '计算 100 + 50'},
        {'description': '多个城市', 'message': '上海的天气'},
    ]

    print('=' * 60)
    print('开始执行任务...\n')

    for task in tasks:
        print(f"\n📋 任务: {task['description']}")
        print(f"📝 输入: {task['message']}")
        print('-' * 60)

        response = runtime.run(task_agent, task['message'])

        print(f"\n✅ 结果:\n{response['content']}")

        if response.get('tool_calls'):
            print(f"\n🔧 使用了 {len(response['tool_calls'])} 个工具:")
            for idx, (tool_name, _) in enumerate(response['tool_calls'], 1):
                print(f"  {idx}. {tool_name}")

        print('\n' + '=' * 60)

    # 显示状态
    print('\n\n📊 Agent 状态:')
    import json
    print(json.dumps(task_agent.get_status(), indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
