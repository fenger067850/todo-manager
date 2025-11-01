# 待办事项管理系统

一个功能强大的 Next.js 待办事项管理应用，支持四象限管理、附件上传、月历视图等功能。

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 本地开发
```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local

# 初始化数据库
npm run db:push

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 📦 编译部署

### 编译打包
```bash
# 编译并打包（推荐）
./build-force.sh
```

这将生成 `build-temp/todo-manager-*.zip` 部署包。

### 服务器部署
```bash
# 上传部署包到服务器
scp build-temp/todo-manager-*.zip user@server:/tmp/

# 使用自动部署脚本
sudo ./deploy-built.sh
```

## 🛠️ 可用脚本

### 编译脚本
- **`build-force.sh`** - 强制编译脚本（推荐使用）
- **`build-package.ps1`** - PowerShell 版本（Windows 用户）

### 部署脚本
- **`deploy-built.sh`** - 自动部署脚本
- **`deploy.sh`** - 传统服务器部署

## 🎯 核心功能

- ✅ **用户认证** - JWT 安全登录
- ✅ **任务管理** - 增删改查待办事项
- ✅ **四象限分类** - 重要性和紧急性管理
- ✅ **优先级管理** - 高/中/低三级优先级
- ✅ **截止日期** - 任务时间管理
- ✅ **分类管理** - 自定义任务分类
- ✅ **附件支持** - 支持多种文件格式上传下载
- ✅ **月历视图** - 直观的月历界面显示任务
- ✅ **响应式设计** - 完美适配移动端和桌面端

## 🔧 技术栈

- **前端**: Next.js 14 + React 18 + TypeScript
- **样式**: Tailwind CSS
- **数据库**: SQLite + Prisma ORM
- **认证**: JWT + bcryptjs
- **部署**: PM2 + Nginx

## 📚 详细文档

- `DEPLOYMENT.md` - 详细部署指南
- `QUICK_DEPLOY.md` - 快速部署说明

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License