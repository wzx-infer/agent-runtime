/**
 * Agent Runtime 主入口
 * 导出所有核心组件和工具
 */

// 核心组件
export { Agent, AgentConfig, AgentResponse, Message, ToolCall } from './core/Agent';
export { Runtime, RuntimeConfig, RuntimeContext } from './core/Runtime';
export { Tool, ToolConfig, ToolParameter } from './core/Tool';
export { Memory, MemoryEntry, MemoryConfig } from './core/Memory';

// 预定义 Agents
export { ChatAgent } from './agents/ChatAgent';
export { TaskAgent } from './agents/TaskAgent';

// 内置工具
export { Calculator } from './tools/Calculator';
export { Weather } from './tools/Weather';

// 版本信息
export const VERSION = '0.1.0';

// 快速创建方法
export function createRuntime(config?: any) {
  return new Runtime(config);
}

export function createAgent(config: any) {
  return new Agent(config);
}
