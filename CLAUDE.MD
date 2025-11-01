# 待办事项管理系统

一个功能完整的基于Next.js 14+的现代化待办事项管理应用，支持四象限管理、附件上传、月历视图等功能。

## 🌟 项目特性

### 核心功能
- ✅ **用户认证** - JWT token认证，安全的登录/注册系统
- ✅ **任务管理** - 创建、编辑、删除待办事项
- ✅ **四象限分类** - 基于重要性和紧急性的任务分类
- ✅ **优先级管理** - 高/中/低三级优先级
- ✅ **截止日期** - 任务时间管理和提醒
- ✅ **分类管理** - 自定义任务分类
- ✅ **附件支持** - 支持Word、Excel、PPT、TXT、PDF文件上传下载
- ✅ **月历视图** - 直观的月历界面显示任务
- ✅ **快速添加** - 一键快速创建任务

### 技术特性
- 🎨 **现代化UI** - 基于Tailwind CSS的响应式设计
- 🔒 **类型安全** - 完整的TypeScript类型定义
- 📱 **移动端支持** - 完全响应式设计
- ⚡ **高性能** - Next.js 14 App Router优化
- 🗄️ **数据持久化** - Prisma + SQLite数据库

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 14.2.33 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: 自定义组件库
- **图标**: Lucide React
- **日期处理**: date-fns

### 后端
- **API**: Next.js API Routes
- **数据库**: SQLite (通过Prisma)
- **ORM**: Prisma Client
- **认证**: JWT (jsonwebtoken)
- **密码加密**: bcryptjs

### 开发工具
- **包管理**: npm
- **代码质量**: TypeScript + ESLint
- **构建**: Next.js构建系统

## 📁 项目结构

```
todo-manager/
├── prisma/
│   ├── schema.prisma          # 数据库模型定义
│   └── migrations/            # 数据库迁移文件
├── src/
│   ├── app/                   # Next.js App Router页面
│   │   ├── api/               # API路由
│   │   │   ├── auth/           # 认证相关API
│   │   │   ├── todos/          # 任务管理API
│   │   │   ├── categories/     # 分类管理API
│   │   │   └── attachments/    # 附件管理API
│   │   ├── dashboard/         # 仪表板页面
│   │   ├── calendar/          # 月历视图
│   │   ├── quadrants/         # 四象限视图
│   │   └── settings/          # 设置页面
│   ├── components/            # React组件
│   │   ├── ui/               # 基础UI组件
│   │   ├── navigation.tsx    # 导航组件
│   │   ├── calendar.tsx      # 日历组件
│   │   ├── attachments.tsx   # 附件管理组件
│   │   └── temp-attachments.tsx # 临时附件组件
│   ├── lib/                   # 工具函数和配置
│   │   ├── auth.ts          # 认证工具
│   │   ├── auth-context.tsx # 认证上下文
│   │   ├── prisma.ts        # 数据库连接
│   │   └── utils.ts         # 工具函数
│   └── types/                 # TypeScript类型定义
├── public/                   # 静态资源
├── .env.local               # 环境变量（不提交到Git）
├── package.json              # 项目依赖
└── README.md                # 项目说明
```

## 🚀 快速开始

### 环境要求
- Node.js 18.0+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 环境配置
1. 复制环境变量模板：
```bash
cp .env.example .env.local
```

2. 配置数据库和JWT密钥：
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 数据库设置
```bash
# 生成Prisma客户端
npx prisma generate

# 应用数据库迁移
npx prisma db push
```

### 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📚 API文档

### 认证API
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 任务管理API
- `GET /api/todos` - 获取任务列表
- `POST /api/todos` - 创建新任务
- `PUT /api/todos/[id]` - 更新任务
- `DELETE /api/todos/[id]` - 删除任务

### 分类管理API
- `GET /api/categories` - 获取分类列表
- `POST /api/categories` - 创建新分类
- `PUT /api/categories/[id]` - 更新分类
- `DELETE /api/categories/[id]` - 删除分类

### 附件管理API
- `POST /api/attachments` - 上传附件
- `GET /api/attachments/[id]` - 下载附件
- `DELETE /api/attachments/[id]` - 删除附件

## 🔧 开发指南

### 添加新功能
1. **数据模型**: 在 `prisma/schema.prisma` 中定义新模型
2. **API路由**: 在 `src/app/api/` 中创建新的API端点
3. **页面组件**: 在 `src/app/` 中创建新页面
4. **类型定义**: 在 `src/types/` 中添加类型定义

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint规则
- 组件使用PascalCase命名
- API路由使用camelCase命名

### 数据库操作
```typescript
import { prisma } from '@/lib/prisma'

// 查询示例
const todos = await prisma.todo.findMany({
  where: { userId: decoded.userId },
  include: { category: true, attachments: true }
})

// 创建示例
const newTodo = await prisma.todo.create({
  data: { title, userId: decoded.userId }
})
```

## 🚀 部署指南

### 环境准备
1. 配置生产环境变量
2. 设置SQLite数据库（无需额外安装）
3. 配置域名和SSL证书

### 构建部署
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### Docker部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🎯 功能说明

### 四象限管理
- **紧急且重要**: 需要立即处理的危机任务
- **不紧急但重要**: 需要长期规划的重要任务
- **紧急但不重要**: 可以委托他人的干扰性任务
- **不紧急且不重要**: 可以减少或消除的浪费时间活动

### 附件支持
- 支持文件格式：Word (.doc/.docx)、Excel (.xls/.xlsx)、PowerPoint (.ppt/.pptx)、TXT、PDF
- 文件大小限制：10MB
- 安全上传和下载机制

### 月历视图
- 中文月份显示
- 任务优先级颜色编码
- 附件图标显示
- 点击日期查看详情

## 🔒 安全特性

### 认证安全
- JWT token认证
- 密码bcrypt加密存储
- 自动token过期处理

### 数据安全
- 用户数据隔离
- SQL注入防护
- XSS攻击防护
- 文件上传安全检查

## 📈 性能优化

### 前端优化
- Next.js自动代码分割
- 图片优化和懒加载
- 客户端状态管理优化

### 后端优化
- 数据库查询优化
- API响应缓存
- 分页查询支持

## 🐛 故障排除

### 常见问题
1. **数据库连接失败**: 检查DATABASE_URL配置
2. **认证失败**: 检查JWT_SECRET配置
3. **文件上传失败**: 检查文件大小和格式
4. **构建失败**: 检查Node.js版本兼容性

### 调试技巧
- 查看浏览器开发者工具
- 检查服务器日志
- 使用Next.js调试工具

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📞 支持

如有问题或建议，请通过以下方式联系：
- 提交GitHub Issue
- 发送邮件至：[your-email@example.com]

---

**最后更新**: 2025年11月1日