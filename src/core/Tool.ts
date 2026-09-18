/**
 * Tool 基类
 * 所有工具的基础实现，提供统一的接口
 */

export interface ToolConfig {
  name: string;
  description: string;
  parameters?: ToolParameter[];
}

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required?: boolean;
  default?: any;
}

/**
 * Tool 基类
 *
 * 核心职责：
 * 1. 定义工具的元数据（名称、描述、参数）
 * 2. 提供统一的执行接口
 * 3. 参数验证和错误处理
 */
export abstract class Tool {
  protected config: ToolConfig;

  constructor(config: ToolConfig) {
    this.config = config;
  }

  /**
   * 获取工具名称
   */
  getName(): string {
    return this.config.name;
  }

  /**
   * 获取工具描述
   */
  getDescription(): string {
    return this.config.description;
  }

  /**
   * 获取工具参数定义
   */
  getParameters(): ToolParameter[] {
    return this.config.parameters || [];
  }

  /**
   * 获取工具的 JSON Schema（用于 LLM 工具调用）
   */
  getSchema(): Record<string, any> {
    const properties: Record<string, any> = {};
    const required: string[] = [];

    for (const param of this.getParameters()) {
      properties[param.name] = {
        type: param.type,
        description: param.description,
      };

      if (param.required) {
        required.push(param.name);
      }
    }

    return {
      name: this.config.name,
      description: this.config.description,
      parameters: {
        type: 'object',
        properties,
        required,
      },
    };
  }

  /**
   * 验证参数
   */
  protected validateParameters(params: Record<string, any>): void {
    const parameters = this.getParameters();

    for (const param of parameters) {
      // 检查必需参数
      if (param.required && !(param.name in params)) {
        throw new Error(`缺少必需参数: ${param.name}`);
      }

      // 检查参数类型
      if (param.name in params) {
        const value = params[param.name];
        const actualType = Array.isArray(value) ? 'array' : typeof value;

        if (actualType !== param.type && value !== null && value !== undefined) {
          throw new Error(
            `参数 "${param.name}" 类型错误: 期望 ${param.type}，实际 ${actualType}`
          );
        }
      }
    }
  }

  /**
   * 执行工具（抽象方法，子类必须实现）
   */
  abstract execute(params: Record<string, any>): Promise<any>;

  /**
   * 工具执行的包装方法，包含验证和错误处理
   */
  async run(params: Record<string, any>): Promise<any> {
    try {
      // 验证参数
      this.validateParameters(params);

      // 执行工具
      const result = await this.execute(params);

      return {
        success: true,
        result,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}
