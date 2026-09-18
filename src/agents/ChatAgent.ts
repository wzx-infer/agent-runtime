/**
 * ChatAgent 对话 Agent
 * 专门用于对话交互的 Agent
 */

import { Agent, AgentConfig, AgentResponse } from '../core/Agent';
import { Memory } from '../core/Memory';

export class ChatAgent extends Agent {
  private memory: Memory;

  constructor(config: Partial<AgentConfig> = {}) {
    super({
      name: 'ChatAgent',
      description: '一个友好的对话 Agent',
      systemPrompt: config.systemPrompt || '你是一个友好、有帮助的助手。',
      ...config,
    });

    this.memory = new Memory({
      maxEntries: 50,
      maxTokens: 2000,
    });
  }

  /**
   * 处理用户输入
   */
  async process(input: string): Promise<AgentResponse> {
    // 将用户消息添加到记忆
    this.memory.add('user', input);

    // 生成响应（这里是简化实现）
    const response = this.generateResponse(input);

    // 将助手响应添加到记忆
    this.memory.add('assistant', response);

    // 同时也添加到 Agent 的消息历史
    this.addMessage('user', input);
    this.addMessage('assistant', response);

    return {
      content: response,
      metadata: {
        memoryStats: this.memory.getStats(),
        timestamp: Date.now(),
      },
    };
  }

  /**
   * 生成响应（简化实现）
   * 实际应用中，这里会调用 LLM API
   */
  private generateResponse(input: string): string {
    const lowerInput = input.toLowerCase();

    // 简单的规则响应
    if (lowerInput.includes('你好') || lowerInput.includes('hello')) {
      return '你好！很高兴见到你。有什么我可以帮助你的吗？';
    }

    if (lowerInput.includes('天气')) {
      return '我可以帮你查询天气信息。请告诉我你想查询哪个城市的天气。';
    }

    if (lowerInput.includes('计算') || lowerInput.includes('算')) {
      return '我可以帮你进行数学计算。请告诉我要计算什么。';
    }

    if (lowerInput.includes('谢谢') || lowerInput.includes('thank')) {
      return '不客气！如果还有其他问题，随时告诉我。';
    }

    if (lowerInput.includes('再见') || lowerInput.includes('bye')) {
      return '再见！期待下次与你交流。';
    }

    // 默认响应
    return `我理解你说的是："${input}"。我会尽力帮助你！（注意：这是一个演示版本，实际应用中会接入真实的 LLM）`;
  }

  /**
   * 获取对话历史
   */
  getConversationHistory(): string[] {
    return this.memory.getAll().map(entry =>
      `${entry.role}: ${entry.content}`
    );
  }

  /**
   * 清空对话历史
   */
  clearConversation(): void {
    this.memory.clear();
    this.clearHistory();
  }

  /**
   * 获取记忆统计
   */
  getMemoryStats(): Record<string, any> {
    return this.memory.getStats();
  }
}
