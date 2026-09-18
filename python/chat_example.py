"""
对话 Agent 示例 - Python 版本
演示如何使用 ChatAgent 进行对话
"""

from agent_runtime import ChatAgent, Runtime


def main():
    print('💬 ChatAgent 对话示例\n')

    # 创建对话 Agent
    chat_agent = ChatAgent(
        system_prompt='你是一个友好、有帮助的 AI 助手，名叫小智。'
    )

    # 创建运行时
    runtime = Runtime(verbose=True)

    # 模拟多轮对话
    conversations = [
        '你好！',
        '你能帮我做什么？',
        '北京的天气怎么样？',
        '帮我计算 25 * 4',
        '谢谢你的帮助！',
    ]

    print('开始对话...\n')
    print('=' * 60)

    for message in conversations:
        print(f"\n👤 用户: {message}")

        response = runtime.run(chat_agent, message)

        print(f"🤖 小智: {response['content']}")
        print('-' * 60)

    # 显示对话历史
    print('\n\n📜 完整对话历史:\n')
    history = chat_agent.memory.get_all()
    for idx, entry in enumerate(history):
        role_emoji = '👤' if entry['role'] == 'user' else '🤖'
        print(f"{idx + 1}. {role_emoji} {entry['role']}: {entry['content']}")

    # 显示记忆统计
    print('\n\n📊 记忆统计:')
    import json
    stats = {
        'total_entries': len(history),
        'user_messages': len([e for e in history if e['role'] == 'user']),
        'assistant_messages': len([e for e in history if e['role'] == 'assistant'])
    }
    print(json.dumps(stats, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
