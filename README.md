# 🌸 凤歌-待办事项+云盘存储管理平台

> 一个优雅的待办事项管理系统，采用温馨的粉色主题，集成云盘存储功能

![Next.js](https://img.shields.io/badge/Next.js-14-pink?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-pink?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-pink?style=flat-square)
![Prisma](https://img.shields.io/badge/Prisma-5-pink?style=flat-square)

## ✨ 项目特色

### 📋 智能任务管理
- ✅ 用户认证系统 - 注册、登录、JWT认证
- ✅ 任务管理 - 创建、编辑、删除、完成任务
- ✅ 四象限分类 - 基于重要性和紧急性的任务分类
- ✅ 优先级管理 - 高、中、低三级优先级
- ✅ 截止日期 - 任务时间管理和提醒
- ✅ 分类管理 - 自定义任务分类和颜色标记
- ✅ 月历视图 - 直观的月历界面显示任务
- ✅ 提醒功能 - 任务提醒和通知

### ☁️ 集成云盘存储
- 📎 文件关联 - 每个任务都可以关联多个文件附件
- 📁 多格式支持 - Word、Excel、PowerPoint、PDF、TXT全格式支持
- 🔒 安全存储 - 文件加密存储，用户隔离访问
- ⬆️ 拖拽上传 - 支持拖拽上传和批量上传
- 👀 在线预览 - 文件在线预览和快速下载
- 📊 存储统计 - 个人存储空间使用情况统计
- 🗂️ 文件管理 - 文件重命名、删除、分享功能

### 🎨 精美的粉色主题
- 💕 温馨的粉色/紫色配色方案
- 🎯 专为女性用户打造的友好界面
- 📱 完全响应式设计，支持移动端
- 🌈 渐变背景和柔和的色彩过渡

## 🛠️ 技术栈

### 前端
- **Next.js 14** - React全栈框架，App Router
- **TypeScript** - 类型安全的JavaScript
- **Tailwind CSS** - 实用优先的CSS框架
- **Lucide React** - 现代化图标库
- **date-fns** - 日期处理工具库

### 后端
- **Next.js API Routes** - 服务端API
- **Prisma** - 现代化数据库ORM
- **SQLite** - 轻量级数据库
- **JWT** - JSON Web Token认证
- **bcryptjs** - 密码加密

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/fenger067850/todo-manager.git
cd todo-manager
```

2. **安装依赖**
```bash
npm install --legacy-peer-deps
```

3. **配置环境变量**
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，设置必要的环境变量：
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-32-characters-minimum"
NEXTAUTH_SECRET="your-nextauth-secret-32-characters-minimum"
NEXTAUTH_URL="http://localhost:3005"
PORT="3005"
```

4. **初始化数据库**
```bash
npx prisma generate
npx prisma db push
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 http://localhost:3005 查看应用！

## 📁 项目结构

```
todo-manager/
├── src/
│   ├── app/                 # Next.js页面
│   │   ├── api/            # API路由
│   │   ├── auth/           # 认证页面
│   │   ├── dashboard/      # 仪表板
│   │   ├── calendar/       # 月历视图
│   │   ├── quadrants/      # 四象限视图
│   │   └── settings/       # 设置页面
│   ├── components/         # React组件
│   │   ├── ui/            # 基础UI组件
│   │   └── ...            # 功能组件
│   ├── lib/               # 工具函数
│   └── types/             # TypeScript类型
├── prisma/
│   └── schema.prisma      # 数据库模型
├── public/                # 静态资源
└── uploads/               # 文件上传目录
```

## 🎯 主要功能

### 用户认证
- 用户注册和登录
- JWT Token认证
- 密码加密存储

### 任务管理
- CRUD操作（创建、读取、更新、删除）
- 任务分类和标签
- 优先级设置
- 截止日期管理

### 四象限视图
基于艾森豪威尔矩阵的任务分类：
- Q1: 紧急且重要
- Q2: 不紧急但重要
- Q3: 紧急但不重要
- Q4: 不紧急且不重要

### 月历视图
- 可视化的月历显示
- 任务日期标记
- 快速导航和筛选

### 云盘存储
- 文件上传和下载
- 文件类型限制（10MB以内）
- 用户存储空间管理（100MB/用户）
- 文件与任务关联

## 🎨 颜色主题

项目采用温馨的粉色主题：

| 用途 | 颜色代码 | 说明 |
|------|----------|------|
| 主色调 | #ec4899 | 粉色 (pink-600) |
| 辅助色 | #a855f7 | 紫色 (purple-600) |
| 背景色 | #fdf2f8 | 淡粉色 (pink-50) |
| 文字色 | #831843 | 深粉色 (pink-900) |

详细的颜色配置请查看 [COLOR_THEME_CHANGES.md](COLOR_THEME_CHANGES.md)

## 📝 API 文档

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 任务管理
- `GET /api/todos` - 获取任务列表
- `POST /api/todos` - 创建新任务
- `PUT /api/todos/[id]` - 更新任务
- `DELETE /api/todos/[id]` - 删除任务

### 分类管理
- `GET /api/categories` - 获取分类列表
- `POST /api/categories` - 创建新分类
- `PUT /api/categories/[id]` - 更新分类
- `DELETE /api/categories/[id]` - 删除分类

### 文件管理
- `POST /api/attachments` - 上传文件
- `GET /api/attachments/[id]` - 下载文件
- `DELETE /api/attachments/[id]` - 删除文件

## 🔐 安全性

- JWT Token认证
- 密码使用 bcryptjs 加密
- API路由权限验证
- 用户数据隔离
- 文件上传类型和大小限制

## 📱 响应式设计

完全适配：
- 💻 桌面端 (1920px+)
- 💼 笔记本 (1366px+)
- 📱 平板 (768px+)
- 📱 手机 (375px+)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件

## 👩‍💻 作者

**凤歌**

- GitHub: [@fenger067850](https://github.com/fenger067850)
- 项目链接: [https://github.com/fenger067850/todo-manager](https://github.com/fenger067850/todo-manager)

## 🙏 致谢

- 感谢 [Next.js](https://nextjs.org/) 提供的优秀框架
- 感谢 [Tailwind CSS](https://tailwindcss.com/) 提供的样式工具
- 感谢 [Prisma](https://www.prisma.io/) 提供的数据库工具
- 本项目基于 Claude Code 教程开发

## 📸 预览截图

（可以在这里添加项目截图）

---

⭐ 如果这个项目对您有帮助，请给个 Star 支持一下！
