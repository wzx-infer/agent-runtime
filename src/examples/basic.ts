/**
 * 基础示例
 * 演示如何创建和使用 Agent
 */

import { Agent } from '../core/Agent';
import { Runtime } from '../core/Runtime';

async function main() {
  console.log('🚀 Agent Runtime 基础示例\n');

  // 创建一个简单的 Agent
  const agent = new Agent({
    name: 'BasicAgent',
    description: '一个基础的示例 Agent',
    systemPrompt: '你是一个友好的助手，负责回答用户的问题。',
  });

  // 创建运行时
  const runtime = new Runtime({
    verbose: true,
    timeout: 10000,
  });

  // 注册 Agent
  runtime.registerAgent(agent);

  // 执行一些任务
  console.log('\n📝 测试 1: 简单问候\n');
  const response1 = await runtime.run(agent, {
    message: '你好，请介绍一下自己',
  });

  console.log('\n📝 测试 2: 询问能力\n');
  const response2 = await runtime.run(agent, {
    message: '你能做什么？',
  });

  // 查看 Agent 状态
  console.log('\n📊 Agent 状态:');
  console.log(JSON.stringify(agent.getStatus(), null, 2));

  // 查看运行时状态
  console.log('\n📊 Runtime 状态:');
  console.log(JSON.stringify(runtime.getStatus(), null, 2));
}

// 运行示例
main().catch(console.error);
