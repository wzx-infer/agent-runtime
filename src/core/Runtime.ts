/**
 * Runtime 运行时管理器
 * 负责协调 Agent 的执行、工具调用和生命周期管理
 */

import { Agent, AgentResponse } from './Agent';

export interface RuntimeConfig {
  maxIterations?: number;  // 最大迭代次数（防止无限循环）
  timeout?: number;        // 超时时间（毫秒）
  verbose?: boolean;       // 是否输出详细日志
}

export interface RuntimeContext {
  message: string;
  metadata?: Record<string, any>;
}

/**
 * Runtime 运行时管理器
 *
 * 核心职责：
 * 1. 管理 Agent 的执行流程
 * 2. 处理工具调用链
 * 3. 错误处理和超时控制
 * 4. 日志和监控
 */
export class Runtime {
  private config: RuntimeConfig;
  private agents: Map<string, Agent> = new Map();

  constructor(config: RuntimeConfig = {}) {
    this.config = {
      maxIterations: 10,
      timeout: 30000,
      verbose: true,
      ...config,
    };
  }

  /**
   * 注册 Agent
   */
  registerAgent(agent: Agent): void {
    this.agents.set(agent.getName(), agent);
    this.log(`已注册 Agent: ${agent.getName()}`);
  }

  /**
   * 获取 Agent
   */
  getAgent(name: string): Agent | undefined {
    return this.agents.get(name);
  }

  /**
   * 运行 Agent
   */
  async run(agent: Agent, context: RuntimeContext): Promise<AgentResponse> {
    this.log(`\n${'='.repeat(60)}`);
    this.log(`开始运行 Agent: ${agent.getName()}`);
    this.log(`输入: ${context.message}`);
    this.log(`${'='.repeat(60)}\n`);

    const startTime = Date.now();

    try {
      // 执行 Agent
      const response = await this.executeAgent(agent, context);

      const duration = Date.now() - startTime;
      this.log(`\n${'='.repeat(60)}`);
      this.log(`Agent 执行完成 (耗时: ${duration}ms)`);
      this.log(`输出: ${response.content}`);
      this.log(`${'='.repeat(60)}\n`);

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log(`\n❌ Agent 执行失败: ${errorMessage}\n`);

      throw error;
    }
  }

  /**
   * 执行 Agent（内部方法）
   */
  private async executeAgent(
    agent: Agent,
    context: RuntimeContext
  ): Promise<AgentResponse> {
    // 创建超时 Promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`执行超时 (${this.config.timeout}ms)`));
      }, this.config.timeout);
    });

    // 执行 Agent
    const executePromise = agent.process(context.message);

    // 竞速执行，返回先完成的
    return Promise.race([executePromise, timeoutPromise]);
  }

  /**
   * 批量运行多个 Agent
   */
  async runMultiple(
    agents: Agent[],
    context: RuntimeContext
  ): Promise<AgentResponse[]> {
    this.log(`\n批量运行 ${agents.length} 个 Agents...`);

    const promises = agents.map(agent => this.run(agent, context));
    const results = await Promise.allSettled(promises);

    const responses: AgentResponse[] = [];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      if (result.status === 'fulfilled') {
        responses.push(result.value);
      } else {
        this.log(`Agent ${agents[i].getName()} 执行失败: ${result.reason}`);
      }
    }

    return responses;
  }

  /**
   * 获取所有已注册的 Agent
   */
  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * 获取运行时状态
   */
  getStatus(): Record<string, any> {
    return {
      agentCount: this.agents.size,
      agents: Array.from(this.agents.keys()),
      config: this.config,
    };
  }

  /**
   * 日志输出
   */
  private log(message: string): void {
    if (this.config.verbose) {
      console.log(message);
    }
  }
}
