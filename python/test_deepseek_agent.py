"""
DeepSeek Agent 测试脚本
演示真实的 Agent Runtime 功能
"""

import sys
import io
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8', line_buffering=True)

from deepseek_agent import DeepSeekAgent, CalculatorTool, WeatherTool, WebSearchTool


def test_calculator():
    """测试计算器功能"""
    print("\n" + "="*60)
    print("测试 1: 计算器工具")
    print("="*60)

    api_key = input("\n请输入你的 DeepSeek API Key: ").strip()

    agent = DeepSeekAgent(api_key)
    agent.register_tool(CalculatorTool())

    print("\n👤 用户: 帮我计算 1234 * 5678")
    response = agent.chat("帮我计算 1234 * 5678")
    print(f"\n🤖 Agent: {response}")


def test_weather():
    """测试天气查询功能"""
    print("\n" + "="*60)
    print("测试 2: 天气查询工具")
    print("="*60)

    api_key = input("\n请输入你的 DeepSeek API Key: ").strip()

    agent = DeepSeekAgent(api_key)
    agent.register_tool(WeatherTool())

    print("\n👤 用户: 北京今天天气怎么样？")
    response = agent.chat("北京今天天气怎么样？")
    print(f"\n🤖 Agent: {response}")


def test_multi_tool():
    """测试多工具协作"""
    print("\n" + "="*60)
    print("测试 3: 多工具协作")
    print("="*60)

    api_key = input("\n请输入你的 DeepSeek API Key: ").strip()

    agent = DeepSeekAgent(api_key)
    agent.register_tool(CalculatorTool())
    agent.register_tool(WeatherTool())
    agent.register_tool(WebSearchTool())

    test_cases = [
        "帮我计算 (100 + 50) * 2 是多少",
        "上海的天气如何？",
        "搜索一下最近的 AI 新闻"
    ]

    for question in test_cases:
        print(f"\n👤 用户: {question}")
        response = agent.chat(question)
        print(f"\n🤖 Agent: {response}")
        agent.reset()  # 重置对话


def test_complex_task():
    """测试复杂任务"""
    print("\n" + "="*60)
    print("测试 4: 复杂任务 - 需要多次工具调用")
    print("="*60)

    api_key = input("\n请输入你的 DeepSeek API Key: ").strip()

    agent = DeepSeekAgent(api_key)
    agent.register_tool(CalculatorTool())
    agent.register_tool(WeatherTool())

    print("\n👤 用户: 北京和上海的温度差是多少？")
    print("（这需要 Agent 先查询两个城市的天气，再计算温度差）")

    response = agent.chat("北京和上海的温度差是多少？")
    print(f"\n🤖 Agent: {response}")


def main():
    """主函数"""
    print("🧪 DeepSeek Agent 测试套件\n")

    print("可用测试:")
    print("  1. 计算器工具测试")
    print("  2. 天气查询测试")
    print("  3. 多工具协作测试")
    print("  4. 复杂任务测试")
    print("  5. 运行所有测试")

    choice = input("\n请选择测试 (1-5): ").strip()

    tests = {
        '1': test_calculator,
        '2': test_weather,
        '3': test_multi_tool,
        '4': test_complex_task
    }

    if choice == '5':
        for test_func in tests.values():
            try:
                test_func()
            except Exception as e:
                print(f"\n❌ 测试失败: {str(e)}")
    elif choice in tests:
        try:
            tests[choice]()
        except Exception as e:
            print(f"\n❌ 测试失败: {str(e)}")
    else:
        print("❌ 无效选择")

    print("\n✅ 测试完成")


if __name__ == '__main__':
    main()
