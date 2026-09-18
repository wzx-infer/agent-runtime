# 贡献指南

感谢你对 Agent Runtime 项目的关注！我们欢迎所有形式的贡献。

## 如何贡献

### 报告 Bug

如果你发现了 Bug，请创建一个 Issue，包含：

1. **清晰的标题**：简要描述问题
2. **复现步骤**：详细说明如何重现问题
3. **期望行为**：描述应该发生什么
4. **实际行为**：描述实际发生了什么
5. **环境信息**：Node.js 版本、操作系统等

### 提出新功能

如果你有好的想法，欢迎创建 Feature Request：

1. **功能描述**：清晰描述你想要的功能
2. **使用场景**：说明为什么需要这个功能
3. **实现建议**：如果有想法，可以提出实现方案

### 提交代码

1. **Fork 项目**

```bash
# Fork 项目到你的账号
# 然后克隆到本地
git clone https://github.com/your-username/agent-runtime.git
cd agent-runtime
```

2. **创建分支**

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

3. **开发和测试**

```bash
# 安装依赖
npm install

# 开发
# 编写代码...

# 测试
npm run build
npm run example:basic
```

4. **提交代码**

```bash
git add .
git commit -m "feat: 添加新功能的描述"
# 或
git commit -m "fix: 修复 Bug 的描述"
```

提交信息格式：
- `feat: 新功能`
- `fix: Bug 修复`
- `docs: 文档更新`
- `style: 代码格式调整`
- `refactor: 重构`
- `test: 测试相关`
- `chore: 构建/工具相关`

5. **推送并创建 PR**

```bash
git push origin feature/your-feature-name
```

然后在 GitHub 上创建 Pull Request。

## 代码规范

### TypeScript 风格

- 使用 2 空格缩进
- 使用单引号
- 添加类型注解
- 为公共 API 编写 JSDoc 注释

示例：

```typescript
/**
 * 计算两个数的和
 * @param a 第一个数
 * @param b 第二个数
 * @returns 和
 */
function add(a: number, b: number): number {
  return a + b;
}
```

### 文件组织

```
src/
├── core/          # 核心组件
├── agents/        # Agent 实现
├── tools/         # 工具实现
└── examples/      # 示例代码
```

### 命名规范

- **类名**：PascalCase (例如: `ChatAgent`)
- **函数/变量**：camelCase (例如: `getName`)
- **常量**：UPPER_SNAKE_CASE (例如: `MAX_TOKENS`)
- **文件名**：PascalCase (例如: `ChatAgent.ts`)

## 文档

如果你的改动涉及 API 变更：

1. 更新 [README.md](../README.md)
2. 更新 [API 文档](../docs/api.md)
3. 如果需要，添加示例到 `src/examples/`

## 测试

目前项目还没有完整的测试框架，但我们计划添加：

```bash
npm test
```

在此之前，请确保：
1. 代码能正常编译 (`npm run build`)
2. 示例能正常运行 (`npm run example:basic`)

## 开发路线图

查看 [README.md](../README.md) 中的路线图了解项目计划。

欢迎认领任务或提出新的想法！

## 行为准则

- 尊重他人
- 建设性地沟通
- 欢迎新手
- 关注技术，避免争议话题

## 问题？

如有疑问，欢迎：
- 创建 Issue 讨论
- 在 PR 中提问
- 查看现有的 Issues 和 PRs

感谢你的贡献！🎉
