/**
 * 工具使用示例
 * 演示如何让 Agent 使用工具完成任务
 */

import { TaskAgent } from '../agents/TaskAgent';
import { Runtime } from '../core/Runtime';
import { Calculator } from '../tools/Calculator';
import { Weather } from '../tools/Weather';

async function main() {
  console.log('🛠️  TaskAgent 工具使用示例\n');

  // 创建任务 Agent
  const taskAgent = new TaskAgent({
    systemPrompt: '你是一个任务执行助手，可以使用工具完成各种任务。',
  });

  // 注册工具
  const calculator = new Calculator();
  const weather = new Weather();

  taskAgent.registerTool(calculator);
  taskAgent.registerTool(weather);

  console.log(`✓ 已注册 ${taskAgent.getTools().length} 个工具\n`);

  // 创建运行时
  const runtime = new Runtime({
    verbose: true,
  });

  // 测试任务
  const tasks = [
    {
      description: '数学计算',
      message: '帮我计算 125 * 8',
    },
    {
      description: '天气查询',
      message: '北京今天的天气怎么样？',
    },
    {
      description: '复杂表达式',
      message: '计算 (10 + 5) * 3 - 8',
    },
    {
      description: '多个城市天气',
      message: '上海的天气',
    },
  ];

  console.log('='.repeat(60));
  console.log('开始执行任务...\n');

  for (const task of tasks) {
    console.log(`\n📋 任务: ${task.description}`);
    console.log(`📝 输入: ${task.message}`);
    console.log('-'.repeat(60));

    const response = await runtime.run(taskAgent, {
      message: task.message,
    });

    console.log(`\n✅ 结果:\n${response.content}`);

    if (response.toolCalls && response.toolCalls.length > 0) {
      console.log(`\n🔧 使用了 ${response.toolCalls.length} 个工具:`);
      response.toolCalls.forEach((call, index) => {
        console.log(`  ${index + 1}. ${call.toolName}`);
      });
    }

    console.log('\n' + '='.repeat(60));
  }

  // 显示 Agent 状态
  console.log('\n\n📊 Agent 状态:');
  console.log(JSON.stringify(taskAgent.getStatus(), null, 2));
}

// 运行示例
main().catch(console.error);
