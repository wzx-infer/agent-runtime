"""
快速演示脚本 - 修复版
一键运行所有示例
"""

import sys
import io

# 设置输出编码
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8', line_buffering=True)
    sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8', line_buffering=True)

from agent_runtime import Agent, Runtime, ChatAgent, Memory, Calculator


def demo_1():
    """演示 1: 基础功能"""
    print("\n" + "="*60)
    print("  演示 1: 基础 Agent 功能")
    print("="*60 + "\n")

    agent = Agent('DemoAgent', '演示 Agent', '你是一个友好的助手')
    runtime = Runtime(verbose=False)

    print("用户: 你好")
    response = runtime.run(agent, '你好')
    print(f"助手: {response['content']}\n")


def demo_2():
    """演示 2: 对话功能"""
    print("\n" + "="*60)
    print("  演示 2: 对话功能")
    print("="*60 + "\n")

    chat_agent = ChatAgent(system_prompt='你是一个友好的助手')
    runtime = Runtime(verbose=False)

    messages = ['你好！', '谢谢你！']

    for msg in messages:
        print(f"用户: {msg}")
        response = runtime.run(chat_agent, msg)
        print(f"助手: {response['content']}\n")

    print(f"记忆条目数: {len(chat_agent.memory.get_all())}")


def demo_3():
    """演示 3: 工具使用"""
    print("\n" + "="*60)
    print("  演示 3: 工具使用")
    print("="*60 + "\n")

    agent = Agent('ToolAgent', '工具 Agent', '你是助手')
    calc = Calculator()

    # 直接使用工具
    result = calc.execute({'expression': '100 + 50'})
    print(f"计算: 100 + 50 = {result['result']}")

    result2 = calc.execute({'expression': '25 * 4'})
    print(f"计算: 25 * 4 = {result2['result']}")


def demo_4():
    """演示 4: 记忆管理"""
    print("\n" + "="*60)
    print("  演示 4: 记忆管理")
    print("="*60 + "\n")

    memory = Memory(max_entries=10)

    # 添加记忆
    memory.add('user', '我叫小明')
    memory.add('assistant', '你好小明！')
    memory.add('user', '我喜欢编程')
    memory.add('assistant', '编程很有趣！')

    print(f"总记忆数: {len(memory.get_all())}")
    print(f"\n最近 2 条:")
    for entry in memory.get_recent(2):
        print(f"  {entry['role']}: {entry['content']}")

    print(f"\n搜索 '小明': {len(memory.search('小明'))} 条结果")


def main():
    """主函数"""
    print("\n" + "="*60)
    print("  Agent Runtime - 功能演示")
    print("="*60)

    try:
        demo_1()
        demo_2()
        demo_3()
        demo_4()

        print("\n" + "="*60)
        print("  演示完成！")
        print("="*60)
        print("\n更多信息:")
        print("  - 运行: python agent_runtime.py")
        print("  - 运行: python tool_example.py")
        print("  - 文档: ../docs/")
        print()

    except Exception as e:
        print(f"\n错误: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
