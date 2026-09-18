/**
 * Calculator 计算器工具
 * 提供基础的数学计算功能
 */

import { Tool } from '../core/Tool';

export class Calculator extends Tool {
  constructor() {
    super({
      name: 'calculator',
      description: '执行基础数学运算（加、减、乘、除、幂运算）',
      parameters: [
        {
          name: 'expression',
          type: 'string',
          description: '要计算的数学表达式，例如: "2 + 2" 或 "10 * 5"',
          required: true,
        },
      ],
    });
  }

  async execute(params: Record<string, any>): Promise<any> {
    const { expression } = params;

    if (!expression || typeof expression !== 'string') {
      throw new Error('表达式不能为空且必须是字符串');
    }

    try {
      // 安全的数学表达式求值
      const result = this.evaluateExpression(expression);

      return {
        expression,
        result,
        type: typeof result,
      };
    } catch (error) {
      throw new Error(`计算失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 安全地求值数学表达式
   * 注意：这是一个简化的实现，实际应用中应使用更安全的解析器
   */
  private evaluateExpression(expression: string): number {
    // 移除空格
    const cleanExpr = expression.replace(/\s+/g, '');

    // 只允许数字、运算符和括号
    if (!/^[0-9+\-*/.()^]+$/.test(cleanExpr)) {
      throw new Error('表达式包含非法字符');
    }

    // 替换 ^ 为 **（幂运算）
    const jsExpr = cleanExpr.replace(/\^/g, '**');

    // 使用 Function 构造器安全求值
    try {
      const result = new Function(`return ${jsExpr}`)();

      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('计算结果无效');
      }

      return result;
    } catch (error) {
      throw new Error('表达式格式错误');
    }
  }
}
