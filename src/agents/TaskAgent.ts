/**
 * TaskAgent 任务 Agent
 * 专门用于执行任务和使用工具的 Agent
 */

import { Agent, AgentConfig, AgentResponse, ToolCall } from '../core/Agent';

export class TaskAgent extends Agent {
  constructor(config: Partial<AgentConfig> = {}) {
    super({
      name: 'TaskAgent',
      description: '一个可以使用工具完成任务的 Agent',
      systemPrompt: config.systemPrompt || '你是一个任务执行助手，可以使用各种工具完成任务。',
      ...config,
    });
  }

  /**
   * 处理任务（支持工具调用）
   */
  async process(input: string): Promise<AgentResponse> {
    // 添加用户消息
    this.addMessage('user', input);

    // 分析输入，决定是否需要使用工具
    const toolCalls = this.analyzeAndPlanTools(input);

    let response = '';
    const executedTools: ToolCall[] = [];

    // 执行工具调用
    if (toolCalls.length > 0) {
      console.log(`\n[${this.getName()}] 识别到 ${toolCalls.length} 个工具调用\n`);

      for (const toolCall of toolCalls) {
        try {
          const result = await this.executeTool(toolCall.toolName, toolCall.parameters);

          executedTools.push({
            ...toolCall,
            result,
          });

          console.log(`✓ 工具 "${toolCall.toolName}" 执行成功\n`);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          console.error(`✗ 工具 "${toolCall.toolName}" 执行失败: ${errorMsg}\n`);

          executedTools.push({
            ...toolCall,
            result: { error: errorMsg },
          });
        }
      }

      // 基于工具结果生成响应
      response = this.generateResponseFromTools(input, executedTools);
    } else {
      // 没有工具调用，直接响应
      response = this.generateDirectResponse(input);
    }

    // 添加助手消息
    this.addMessage('assistant', response);

    return {
      content: response,
      toolCalls: executedTools,
      metadata: {
        toolsUsed: executedTools.length,
        timestamp: Date.now(),
      },
    };
  }

  /**
   * 分析输入并规划需要使用的工具
   */
  private analyzeAndPlanTools(input: string): ToolCall[] {
    const toolCalls: ToolCall[] = [];
    const lowerInput = input.toLowerCase();

    // 检测计算需求
    if (lowerInput.includes('计算') || lowerInput.includes('算') || /\d+\s*[+\-*/]\s*\d+/.test(input)) {
      // 提取数学表达式
      const match = input.match(/(\d+\s*[+\-*/^().\s]+\d+)/);
      if (match) {
        toolCalls.push({
          toolName: 'calculator',
          parameters: { expression: match[1] },
        });
      }
    }

    // 检测天气查询需求
    if (lowerInput.includes('天气')) {
      // 提取城市名
      const cityMatch = input.match(/([北上广深杭成都重庆武汉西安南京天津]{2,})/);
      if (cityMatch) {
        toolCalls.push({
          toolName: 'weather',
          parameters: { city: cityMatch[1] },
        });
      }
    }

    return toolCalls;
  }

  /**
   * 基于工具结果生成响应
   */
  private generateResponseFromTools(input: string, toolCalls: ToolCall[]): string {
    const responses: string[] = [];

    for (const toolCall of toolCalls) {
      if (toolCall.result?.error) {
        responses.push(`❌ 执行 ${toolCall.toolName} 时出错: ${toolCall.result.error}`);
        continue;
      }

      // 根据工具类型格式化结果
      if (toolCall.toolName === 'calculator') {
        const { expression, result } = toolCall.result;
        responses.push(`计算结果: ${expression} = ${result}`);
      } else if (toolCall.toolName === 'weather') {
        const weather = toolCall.result;
        responses.push(
          `${weather.city}的天气: ${weather.condition}, ` +
          `温度 ${weather.temperature}${weather.unit}, ` +
          `湿度 ${weather.humidity}%, ` +
          `风速 ${weather.windSpeed} km/h\n` +
          `${weather.note}`
        );
      }
    }

    return responses.length > 0
      ? responses.join('\n\n')
      : '任务完成，但没有生成结果。';
  }

  /**
   * 生成直接响应（不使用工具）
   */
  private generateDirectResponse(input: string): string {
    return `我收到了你的任务："${input}"，但我目前还无法处理这个任务。\n\n` +
           `我可以帮你：\n` +
           `- 进行数学计算（例如："计算 25 * 4"）\n` +
           `- 查询天气信息（例如："北京的天气"）\n\n` +
           `请告诉我具体需要什么帮助。`;
  }
}
