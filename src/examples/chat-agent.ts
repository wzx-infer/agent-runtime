/**
 * 对话 Agent 示例
 * 演示如何使用 ChatAgent 进行对话
 */

import { ChatAgent } from '../agents/ChatAgent';
import { Runtime } from '../core/Runtime';

async function main() {
  console.log('💬 ChatAgent 对话示例\n');

  // 创建对话 Agent
  const chatAgent = new ChatAgent({
    systemPrompt: '你是一个友好、有帮助的 AI 助手，名叫小智。',
  });

  // 创建运行时
  const runtime = new Runtime({
    verbose: true,
  });

  // 模拟多轮对话
  const conversations = [
    '你好！',
    '你能帮我做什么？',
    '北京的天气怎么样？',
    '帮我计算 25 * 4',
    '谢谢你的帮助！',
  ];

  console.log('开始对话...\n');
  console.log('='.repeat(60));

  for (const message of conversations) {
    console.log(`\n👤 用户: ${message}`);

    const response = await runtime.run(chatAgent, { message });

    console.log(`🤖 小智: ${response.content}`);
    console.log('-'.repeat(60));
  }

  // 显示对话历史
  console.log('\n\n📜 完整对话历史:\n');
  const history = chatAgent.getConversationHistory();
  history.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry}`);
  });

  // 显示记忆统计
  console.log('\n\n📊 记忆统计:');
  console.log(JSON.stringify(chatAgent.getMemoryStats(), null, 2));
}

// 运行示例
main().catch(console.error);
