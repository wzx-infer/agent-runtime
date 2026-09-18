/**
 * Agent 基类
 * 所有 Agent 的基础实现，提供核心功能和扩展接口
 */

export interface AgentConfig {
  name: string;
  description: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface AgentResponse {
  content: string;
  toolCalls?: ToolCall[];
  metadata?: Record<string, any>;
}

export interface ToolCall {
  toolName: string;
  parameters: Record<string, any>;
  result?: any;
}

/**
 * Agent 基类
 *
 * 核心职责：
 * 1. 管理 Agent 的配置和状态
 * 2. 处理输入消息
 * 3. 协调工具调用
 * 4. 管理对话历史
 */
export class Agent {
  protected config: AgentConfig;
  protected messages: Message[] = [];
  protected tools: Map<string, any> = new Map();

  constructor(config: AgentConfig) {
    this.config = {
      temperature: 0.7,
      maxTokens: 2000,
      ...config,
    };

    // 如果有系统提示词，添加到消息历史
    if (this.config.systemPrompt) {
      this.messages.push({
        role: 'system',
        content: this.config.systemPrompt,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * 获取 Agent 名称
   */
  getName(): string {
    return this.config.name;
  }

  /**
   * 获取 Agent 描述
   */
  getDescription(): string {
    return this.config.description;
  }

  /**
   * 注册工具
   */
  registerTool(tool: any): void {
    this.tools.set(tool.getName(), tool);
    console.log(`[${this.config.name}] 已注册工具: ${tool.getName()}`);
  }

  /**
   * 获取所有可用工具
   */
  getTools(): any[] {
    return Array.from(this.tools.values());
  }

  /**
   * 添加消息到历史
   */
  addMessage(role: 'user' | 'assistant', content: string): void {
    this.messages.push({
      role,
      content,
      timestamp: Date.now(),
    });
  }

  /**
   * 获取消息历史
   */
  getMessages(): Message[] {
    return [...this.messages];
  }

  /**
   * 清空消息历史（保留系统提示词）
   */
  clearHistory(): void {
    this.messages = this.messages.filter(msg => msg.role === 'system');
    console.log(`[${this.config.name}] 已清空对话历史`);
  }

  /**
   * 处理用户输入（核心方法，子类可以重写）
   */
  async process(input: string): Promise<AgentResponse> {
    // 添加用户消息
    this.addMessage('user', input);

    // 基础实现：简单的回声响应
    // 实际应用中，这里会调用 LLM API
    const response = `[${this.config.name}] 收到消息: "${input}"`;

    this.addMessage('assistant', response);

    return {
      content: response,
      metadata: {
        messageCount: this.messages.length,
        timestamp: Date.now(),
      },
    };
  }

  /**
   * 执行工具调用
   */
  protected async executeTool(toolName: string, parameters: Record<string, any>): Promise<any> {
    const tool = this.tools.get(toolName);

    if (!tool) {
      throw new Error(`工具 "${toolName}" 未找到`);
    }

    console.log(`[${this.config.name}] 执行工具: ${toolName}`, parameters);

    try {
      const result = await tool.execute(parameters);
      console.log(`[${this.config.name}] 工具执行成功:`, result);
      return result;
    } catch (error) {
      console.error(`[${this.config.name}] 工具执行失败:`, error);
      throw error;
    }
  }

  /**
   * 获取 Agent 状态信息
   */
  getStatus(): Record<string, any> {
    return {
      name: this.config.name,
      description: this.config.description,
      messageCount: this.messages.length,
      toolCount: this.tools.size,
      tools: Array.from(this.tools.keys()),
    };
  }
}
