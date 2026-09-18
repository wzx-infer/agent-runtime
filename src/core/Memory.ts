/**
 * Memory 记忆管理器
 * 负责管理 Agent 的对话历史和上下文
 */

export interface MemoryEntry {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface MemoryConfig {
  maxEntries?: number;      // 最大条目数
  maxTokens?: number;        // 最大 token 数（近似）
  persistPath?: string;      // 持久化路径
}

/**
 * Memory 记忆管理器
 *
 * 核心职责：
 * 1. 存储和检索对话历史
 * 2. 管理上下文窗口大小
 * 3. 支持记忆的持久化
 * 4. 提供记忆搜索和过滤
 */
export class Memory {
  private config: MemoryConfig;
  private entries: MemoryEntry[] = [];
  private idCounter: number = 0;

  constructor(config: MemoryConfig = {}) {
    this.config = {
      maxEntries: 100,
      maxTokens: 4000,
      ...config,
    };
  }

  /**
   * 添加记忆条目
   */
  add(
    role: 'system' | 'user' | 'assistant',
    content: string,
    metadata?: Record<string, any>
  ): MemoryEntry {
    const entry: MemoryEntry = {
      id: this.generateId(),
      role,
      content,
      timestamp: Date.now(),
      metadata,
    };

    this.entries.push(entry);

    // 检查是否超出限制
    this.enforceLimits();

    return entry;
  }

  /**
   * 获取所有记忆条目
   */
  getAll(): MemoryEntry[] {
    return [...this.entries];
  }

  /**
   * 获取最近的 N 条记忆
   */
  getRecent(count: number): MemoryEntry[] {
    return this.entries.slice(-count);
  }

  /**
   * 根据角色过滤记忆
   */
  getByRole(role: 'system' | 'user' | 'assistant'): MemoryEntry[] {
    return this.entries.filter(entry => entry.role === role);
  }

  /**
   * 搜索记忆内容
   */
  search(query: string): MemoryEntry[] {
    const lowerQuery = query.toLowerCase();
    return this.entries.filter(entry =>
      entry.content.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * 清空记忆
   */
  clear(): void {
    this.entries = [];
    this.idCounter = 0;
  }

  /**
   * 获取记忆统计信息
   */
  getStats(): Record<string, any> {
    const totalTokens = this.estimateTokens();

    return {
      totalEntries: this.entries.length,
      estimatedTokens: totalTokens,
      byRole: {
        system: this.getByRole('system').length,
        user: this.getByRole('user').length,
        assistant: this.getByRole('assistant').length,
      },
      oldestEntry: this.entries[0]?.timestamp,
      newestEntry: this.entries[this.entries.length - 1]?.timestamp,
    };
  }

  /**
   * 估算总 token 数（简单估算：4 个字符 ≈ 1 token）
   */
  private estimateTokens(): number {
    return Math.ceil(
      this.entries.reduce((sum, entry) => sum + entry.content.length, 0) / 4
    );
  }

  /**
   * 强制执行限制（删除旧条目）
   */
  private enforceLimits(): void {
    // 限制条目数
    if (this.config.maxEntries && this.entries.length > this.config.maxEntries) {
      const excess = this.entries.length - this.config.maxEntries;
      this.entries.splice(0, excess);
    }

    // 限制 token 数
    if (this.config.maxTokens) {
      while (this.estimateTokens() > this.config.maxTokens && this.entries.length > 1) {
        // 保留系统消息，删除最旧的非系统消息
        const index = this.entries.findIndex(entry => entry.role !== 'system');
        if (index !== -1) {
          this.entries.splice(index, 1);
        } else {
          break;
        }
      }
    }
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `mem_${++this.idCounter}_${Date.now()}`;
  }

  /**
   * 导出记忆为 JSON
   */
  export(): string {
    return JSON.stringify({
      entries: this.entries,
      config: this.config,
      exportedAt: Date.now(),
    }, null, 2);
  }

  /**
   * 从 JSON 导入记忆
   */
  import(data: string): void {
    try {
      const parsed = JSON.parse(data);
      this.entries = parsed.entries || [];
      this.idCounter = this.entries.length;
    } catch (error) {
      throw new Error('导入记忆失败: 无效的 JSON 格式');
    }
  }
}
