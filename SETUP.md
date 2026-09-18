# 环境设置指南

## Node.js 安装

项目需要 Node.js 环境。请按照以下步骤安装：

### Windows 安装

1. **访问 Node.js 官网**
   - 访问: https://nodejs.org/
   - 下载 LTS 版本（推荐）或最新版本

2. **运行安装程序**
   - 双击下载的 `.msi` 文件
   - 按照向导完成安装
   - 建议勾选 "Automatically install necessary tools"

3. **验证安装**
   ```bash
   node --version
   npm --version
   ```

### 使用包管理器安装（可选）

**使用 Chocolatey:**
```bash
choco install nodejs-lts
```

**使用 Scoop:**
```bash
scoop install nodejs-lts
```

**使用 winget:**
```bash
winget install OpenJS.NodeJS.LTS
```

## 项目运行

安装 Node.js 后：

```bash
# 1. 进入项目目录
cd agent-runtime

# 2. 安装依赖
npm install

# 3. 构建项目
npm run build

# 4. 运行示例
npm run example:basic
```

## Python 版本（备选方案）

如果你更熟悉 Python，我们也提供了 Python 版本，见 `python/` 目录。

```bash
# Python 版本运行
cd python
python basic_example.py
```

## 故障排除

### Node.js 未找到
- 重启终端/命令提示符
- 检查环境变量 PATH
- 重新安装 Node.js

### npm 安装失败
```bash
# 清除缓存
npm cache clean --force

# 使用国内镜像
npm config set registry https://registry.npmmirror.com
```

### TypeScript 编译错误
```bash
# 全局安装 TypeScript
npm install -g typescript

# 重新构建
npm run build
```
