"""
基础示例 - Python 版本
演示如何使用 Agent Runtime
"""

from agent_runtime import Agent, Runtime


def main():
    print('🚀 Agent Runtime 基础示例\n')

    # 创建一个简单的 Agent
    agent = Agent(
        name='BasicAgent',
        description='一个基础的示例 Agent',
        system_prompt='你是一个友好的助手，负责回答用户的问题。'
    )

    # 创建运行时
    runtime = Runtime(verbose=True)
    runtime.register_agent(agent)

    # 测试
    print('\n📝 测试 1: 简单问候\n')
    response1 = runtime.run(agent, '你好，请介绍一下自己')

    print('\n📝 测试 2: 询问能力\n')
    response2 = runtime.run(agent, '你能做什么？')

    # 查看状态
    print('\n📊 Agent 状态:')
    import json
    print(json.dumps(agent.get_status(), indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
