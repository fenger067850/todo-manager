# 🚀 Claude Code 全栈待办事项管理系统 + 云盘存储开发教程

> 🌟 **创新特色**：这不仅仅是一个待办事项管理系统，更是一个集成云盘存储的智能工作平台！每个任务都可以关联和管理文件附件，让任务管理更加高效和完整。

> 从零开始，使用 Claude Code 构建一个功能完整的现代化待办事项管理系统

## 📖 目录

1. [项目特色亮点](#项目特色亮点)
2. [技术栈介绍](#技术栈介绍)
3. [开发环境准备](#开发环境准备)
4. [项目初始化](#项目初始化)
5. [数据库设计](#数据库设计)
6. [后端API开发](#后端api开发)
7. [前端页面开发](#前端页面开发)
8. [云盘存储功能](#云盘存储功能)
9. [核心功能实现](#核心功能实现)
10. [样式与UI设计](#样式与ui设计)
11. [部署配置](#部署配置)
12. [Claude Code 使用技巧](#claude-code-使用技巧)

---

## ✨ 项目特色亮点

### 🎯 **创新功能：任务 + 云盘双模式管理**

这不是一个普通的待办事项管理系统！我们将任务管理与云盘存储完美结合，创造出一个全新的工作效率平台：

#### 📋 **智能任务管理**

- ✅ **用户认证系统** - 注册、登录、JWT认证
- ✅ **任务管理** - 创建、编辑、删除、完成任务
- ✅ **四象限分类** - 基于重要性和紧急性的任务分类
- ✅ **优先级管理** - 高、中、低三级优先级
- ✅ **截止日期** - 任务时间管理和提醒
- ✅ **分类管理** - 自定义任务分类和颜色标记
- ✅ **月历视图** - 直观的月历界面显示任务
- ✅ **提醒功能** - 任务提醒和通知

#### ☁️ **集成云盘存储**

- 📎 **文件关联** - 每个任务都可以关联多个文件附件
- 📁 **多格式支持** - Word、Excel、PowerPoint、PDF、TXT全格式支持
- 🔒 **安全存储** - 文件加密存储，用户隔离访问
- ⬆️ **拖拽上传** - 支持拖拽上传和批量上传
- 👀 **在线预览** - 文件在线预览和快速下载
- 📊 **存储统计** - 个人存储空间使用情况统计
- 🗂️ **文件管理** - 文件重命名、删除、分享功能

#### 🚀 **独特优势**

- **🎯 任务驱动** - 以任务为中心的文件管理，让每个文件都有明确的业务关联
- **📈 工作流优化** - 任务进度与相关文件同步管理，提高工作效率
- **🔍 快速检索** - 通过任务快速定位相关文件，告别文件混乱
- **💾 永久保存** - 任务完成后的文件仍然保留，形成知识库
- **📱 移动友好** - 完全响应式设计，随时随地管理任务和文件

### 📱 用户界面

- **仪表板** - 任务概览和存储统计
- **四象限视图** - 时间管理矩阵 + 文件预览
- **月历视图** - 可视化任务时间线 + 附件标记
- **云盘中心** - 独立的文件管理中心
- **设置页面** - 个人设置和存储配置

### 🎨 **用户体验创新**

- **智能关联** - 自动识别文件类型，匹配对应图标
- **快速预览** - 鼠标悬停即可预览文件信息
- **批量操作** - 支持多文件上传和批量管理
- **进度显示** - 文件上传进度实时反馈
- **容量提醒** - 存储空间不足时智能提醒

---

## 🛠️ 技术栈介绍

### 前端技术

- **Next.js 14** - React全栈框架，App Router
- **TypeScript** - 类型安全的JavaScript
- **Tailwind CSS** - 实用优先的CSS框架
- **Lucide React** - 现代化图标库
- **date-fns** - 日期处理工具库

### 后端技术

- **Next.js API Routes** - 服务端API
- **Prisma** - 现代化数据库ORM
- **SQLite** - 轻量级数据库
- **JWT** - JSON Web Token认证
- **bcryptjs** - 密码加密

### 开发工具

- **Claude Code** - AI编程助手
- **VS Code** - 代码编辑器
- **Node.js** - JavaScript运行时
- **npm** - 包管理器

---

## 🔧 开发环境准备

### 1. 安装Node.js

```bash
# 下载并安装 Node.js 18+ 版本
# 访问 https://nodejs.org 下载安装包
```

### 2. 安装Claude Code

```bash
# 安装 Claude Code CLI
npm install -g @anthropic-ai/claude-code

# 登录 Claude Code
claude-code login
```

### 3. 创建项目目录

```bash
# 创建项目文件夹
mkdir todo-manager
cd todo-manager
```

---

## 🚀 项目初始化

### Claude Code 提示词 📝

```
请帮我初始化一个Next.js 14项目，要求使用TypeScript和Tailwind CSS。项目名称是todo-manager，这是一个待办事项管理系统。
```

### 手动初始化步骤

1. **创建Next.js项目**

```bash
npx create-next-app@latest todo-manager --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

2. **安装依赖包**

```bash
# 安装项目依赖
npm install @prisma/client prisma bcryptjs jsonwebtoken date-fns react-hook-form @hookform/resolvers zod lucide-react clsx tailwind-merge

# 安装开发依赖
npm install -D @types/bcryptjs @types/jsonwebtoken tsx
```

3. **配置环境变量**

```bash
# 创建环境变量文件
touch .env.local
```

**Claude Code 提示词 📝**

```
请帮我创建 .env.local 文件，包含以下环境变量：
- DATABASE_URL: SQLite数据库文件路径
- JWT_SECRET: JWT密钥
- NEXTAUTH_SECRET: NextAuth密钥
- NEXTAUTH_URL: 应用URL
- PORT: 端口号设置为3005
```

---

## 🗄️ 数据库设计

### Claude Code 提示词 📝

```
请帮我设计一个待办事项管理系统的数据库模型，使用Prisma和SQLite。需要包含以下表：
1. User - 用户表（id, email, username, password, name, createdAt, updatedAt）
2. Category - 分类表（id, name, color, description, userId, createdAt, updatedAt）
3. Todo - 待办事项表（id, title, description, dueDate, isCompleted, priority, quadrant, userId, categoryId, createdAt, updatedAt）
4. Attachment - 附件表（id, todoId, filename, originalName, fileType, fileSize, filePath, createdAt）
5. Reminder - 提醒表（id, todoId, remindAt, message, isActive, createdAt）

请创建完整的Prisma schema文件，包含所有表关系和索引。
```

### 生成的 Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  todos Todo[]
  categories Category[]

  @@map("users")
}

model Category {
  id          String   @id @default(cuid())
  name        String
  color       String?
  description String?
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user  User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  todos Todo[]

  @@unique([userId, name])
  @@map("categories")
}

model Todo {
  id          String      @id @default(cuid())
  title       String
  description String?
  dueDate     DateTime?
  isCompleted Boolean     @default(false)
  priority    String      @default("MEDIUM")
  quadrant    String?
  userId      String
  categoryId  String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  category   Category?   @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  attachments Attachment[]
  reminders  Reminder[]

  @@map("todos")
}

model Attachment {
  id           String   @id @default(cuid())
  todoId       String
  filename     String
  originalName String
  fileType     String
  fileSize     Int
  filePath     String
  createdAt    DateTime @default(now())

  todo Todo @relation(fields: [todoId], references: [id], onDelete: Cascade)

  @@map("attachments")
}

model Reminder {
  id        String   @id @default(cuid())
  todoId    String
  remindAt  DateTime
  message   String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  todo Todo @relation(fields: [todoId], references: [id], onDelete: Cascade)

  @@map("reminders")
}
```

### 数据库初始化

```bash
# 生成Prisma客户端
npx prisma generate

# 创建数据库表
npx prisma db push
```

---

## 🔐 后端API开发

### 1. 认证API

#### Claude Code 提示词 📝

```
请帮我创建用户认证相关的API路由：
1. POST /api/auth/register - 用户注册
2. POST /api/auth/login - 用户登录

需要包含：
- 密码加密（bcryptjs）
- JWT token生成
- 输入验证（zod schema）
- 错误处理
- TypeScript类型定义
```

#### 注册API (`src/app/api/auth/register/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(6),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password, name } = registerSchema.parse(body);

    // 检查用户是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '用户已存在' },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        createdAt: true,
      }
    });

    // 生成JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: '注册成功',
      user,
      token,
    });
  } catch (error) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { error: '注册失败' },
      { status: 500 }
    );
  }
}
```

#### 登录API (`src/app/api/auth/login/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 401 }
      );
    }

    // 验证密码
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      );
    }

    // 生成JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: '登录成功',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    );
  }
}
```

### 2. 待办事项API

#### Claude Code 提示词 📝

```
请帮我创建待办事项管理的API路由：
1. GET /api/todos - 获取待办事项列表
2. POST /api/todos - 创建新待办事项
3. PUT /api/todos/[id] - 更新待办事项
4. DELETE /api/todos/[id] - 删除待办事项

需要包含：
- JWT认证中间件
- 完整的CRUD操作
- 关联查询（分类、附件）
- 分页和筛选
- 错误处理
```

#### 待办事项API (`src/app/api/todos/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const todoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  quadrant: z.enum(['Q1', 'Q2', 'Q3', 'Q4']).optional(),
  categoryId: z.string().optional(),
});

// JWT认证中间件
async function authenticateUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('未提供认证令牌');
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return decoded;
  } catch (error) {
    throw new Error('无效的认证令牌');
  }
}

// 获取待办事项列表
export async function GET(request: NextRequest) {
  try {
    const decoded = await authenticateUser(request);
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const categoryId = searchParams.get('categoryId');

    const where: any = { userId: decoded.userId };

    if (status === 'completed') {
      where.isCompleted = true;
    } else if (status === 'pending') {
      where.isCompleted = false;
    }

    if (priority) {
      where.priority = priority;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where,
        include: {
          category: true,
          attachments: true,
          reminders: true,
        },
        orderBy: [
          { isCompleted: 'asc' },
          { priority: 'desc' },
          { dueDate: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.todo.count({ where })
    ]);

    return NextResponse.json({
      todos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('获取待办事项错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取失败' },
      { status: 401 }
    );
  }
}

// 创建新待办事项
export async function POST(request: NextRequest) {
  try {
    const decoded = await authenticateUser(request);
    const body = await request.json();
    const { title, description, dueDate, priority, quadrant, categoryId } = todoSchema.parse(body);

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        quadrant,
        categoryId,
        userId: decoded.userId,
      },
      include: {
        category: true,
        attachments: true,
        reminders: true,
      },
    });

    return NextResponse.json({
      message: '创建成功',
      todo,
    });
  } catch (error) {
    console.error('创建待办事项错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '创建失败' },
      { status: error instanceof Error ? 401 : 500 }
    );
  }
}
```

### 3. 分类管理API

#### Claude Code 提示词 📝

```
请帮我创建分类管理的API路由：
1. GET /api/categories - 获取分类列表
2. POST /api/categories - 创建新分类
3. PUT /api/categories/[id] - 更新分类
4. DELETE /api/categories/[id] - 删除分类

需要包含用户数据隔离和颜色管理功能。
```

### 4. 附件管理API

#### Claude Code 提示词 📝

```
请帮我创建附件管理的API路由：
1. POST /api/attachments - 上传附件
2. GET /api/attachments/[id] - 下载附件
3. DELETE /api/attachments/[id] - 删除附件

需要支持：
- 文件类型验证（Word, Excel, PPT, PDF, TXT）
- 文件大小限制（10MB）
- 安全的文件存储和访问
- 文件删除清理
```

---

## 🎨 前端页面开发

### 1. 认证页面

#### Claude Code 提示词 📝

```
请帮我创建用户认证页面：
1. 登录页面 - /auth/login
2. 注册页面 - /auth/register

需要包含：
- 美观的表单设计
- 表单验证
- 错误提示
- 响应式设计
- 跳转逻辑
```

#### 登录页面 (`src/app/auth/login/page.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || '登录失败');
      }
    } catch (error) {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">登录</CardTitle>
          <CardDescription className="text-center">
            欢迎回到待办事项管理系统
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                邮箱
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="请输入邮箱"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                密码
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="请输入密码"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">
              还没有账号？{' '}
              <Link href="/auth/register" className="text-blue-600 hover:underline">
                立即注册
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 2. 仪表板页面

#### Claude Code 提示词 📝

```
请帮我创建仪表板页面，包含：
1. 任务统计概览
2. 快速添加任务功能
3. 最近任务列表
4. 四象限任务分布
5. 优先级任务分布
6. 美观的卡片布局
```

#### 仪表板页面 (`src/app/dashboard/page.tsx`)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

interface Todo {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: boolean;
  priority: string;
  quadrant?: string;
  category?: {
    id: string;
    name: string;
    color?: string;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });
  const [recentTodos, setRecentTodos] = useState<Todo[]>([]);
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // 获取统计数据
      const statsResponse = await fetch('/api/todos/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // 获取最近任务
      const todosResponse = await fetch('/api/todos?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (todosResponse.ok) {
        const todosData = await todosResponse.json();
        setRecentTodos(todosData.todos);
      }
    } catch (error) {
      console.error('获取仪表板数据错误:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddTitle.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: quickAddTitle,
          priority: 'MEDIUM',
        }),
      });

      if (response.ok) {
        setQuickAddTitle('');
        fetchDashboardData();
      }
    } catch (error) {
      console.error('快速添加任务错误:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'LOW': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getQuadrantName = (quadrant: string) => {
    switch (quadrant) {
      case 'Q1': return '紧急且重要';
      case 'Q2': return '不紧急但重要';
      case 'Q3': return '紧急但不重要';
      case 'Q4': return '不紧急且不重要';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">仪表板</h1>
          <p className="text-gray-600 mt-2">欢迎回来！这里是您的任务概览</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总任务数</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                所有任务
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已完成</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                完成率 {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">进行中</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                待完成任务
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已逾期</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <p className="text-xs text-muted-foreground">
                需要立即处理
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 快速添加任务 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                快速添加任务
              </CardTitle>
              <CardDescription>
                快速创建一个新的待办事项
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleQuickAdd} className="flex gap-2">
                <Input
                  placeholder="输入任务标题..."
                  value={quickAddTitle}
                  onChange={(e) => setQuickAddTitle(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!quickAddTitle.trim()}>
                  添加
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* 最近任务 */}
          <Card>
            <CardHeader>
              <CardTitle>最近任务</CardTitle>
              <CardDescription>
                最新创建的任务
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTodos.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">暂无任务</p>
                ) : (
                  recentTodos.map((todo) => (
                    <div key={todo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className={`font-medium ${todo.isCompleted ? 'line-through text-gray-500' : ''}`}>
                          {todo.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(todo.priority)}`}>
                            {todo.priority === 'HIGH' ? '高' : todo.priority === 'MEDIUM' ? '中' : '低'}优先级
                          </span>
                          {todo.quadrant && (
                            <span className="text-xs text-gray-500">
                              {getQuadrantName(todo.quadrant)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${todo.isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

---

## ☁️ 云盘存储功能

### 🎯 创新设计理念

传统的云盘只是文件存储，而我们的云盘与任务管理深度结合：

- **任务驱动存储** - 每个文件都与具体任务关联，让文件更有意义
- **上下文管理** - 通过任务快速定位相关文件，提高检索效率
- **工作流集成** - 文件与任务进度同步，形成完整的工作闭环
- **知识沉淀** - 完成的任务和文件形成个人知识库

### 1. 云盘存储API设计

#### Claude Code 提示词 📝

```
请帮我创建云盘存储相关的API路由：
1. POST /api/attachments - 上传附件到指定任务
2. GET /api/attachments - 获取任务的附件列表
3. GET /api/attachments/[id] - 下载指定附件
4. DELETE /api/attachments/[id] - 删除附件
5. GET /api/files/storage - 获取用户存储统计
6. POST /api/files/upload-batch - 批量文件上传

需要包含：
- 文件类型验证（Word, Excel, PPT, PDF, TXT）
- 文件大小限制（10MB）
- 用户存储空间限制（每人100MB）
- 文件安全扫描和病毒检测
- 文件重名处理（自动重命名）
- 上传进度追踪
- 文件预览URL生成
```

#### 附件管理API (`src/app/api/attachments/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// 允许的文件类型
const ALLOWED_FILE_TYPES = {
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'text/plain': ['.txt'],
  'application/pdf': ['.pdf']
}

// 允许的文件扩展名
const ALLOWED_EXTENSIONS = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.pdf']

// 最大文件大小 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024

// 用户存储空间限制 (100MB)
const USER_STORAGE_LIMIT = 100 * 1024 * 1024

// POST - 上传附件
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '无效的认证令牌' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const todoId = formData.get('todoId') as string

    if (!file) {
      return NextResponse.json({ error: '未提供文件' }, { status: 400 })
    }

    if (!todoId) {
      return NextResponse.json({ error: '未提供待办事项ID' }, { status: 400 })
    }

    // 检查用户存储空间
    const currentStorage = await prisma.attachment.aggregate({
      where: {
        todo: {
          userId: decoded.userId
        }
      },
      _sum: {
        fileSize: true
      }
    })

    const totalStorage = (currentStorage._sum.fileSize || 0) + file.size
    if (totalStorage > USER_STORAGE_LIMIT) {
      return NextResponse.json({
        error: `存储空间不足。当前使用：${formatBytes(currentStorage._sum.fileSize || 0)}，限制：${formatBytes(USER_STORAGE_LIMIT)}`
      }, { status: 400 })
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: '文件大小不能超过10MB' }, { status: 400 })
    }

    // 验证文件类型
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json({
        error: `不支持的文件类型。支持的格式：${ALLOWED_EXTENSIONS.join(', ')}`
      }, { status: 400 })
    }

    // 验证MIME类型
    if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.type)) {
      return NextResponse.json({ error: '文件MIME类型不支持' }, { status: 400 })
    }

    // 验证待办事项是否存在且属于当前用户
    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: decoded.userId,
      },
    })

    if (!todo) {
      return NextResponse.json({ error: '待办事项不存在' }, { status: 404 })
    }

    // 创建用户专属上传目录
    const uploadDir = join(process.cwd(), 'uploads', decoded.userId, 'attachments')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 生成唯一文件名（避免重名）
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const uniqueFilename = `${timestamp}_${randomString}_${file.name}`
    const filePath = join(uploadDir, uniqueFilename)

    // 保存文件
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // 保存附件信息到数据库
    const attachment = await prisma.attachment.create({
      data: {
        todoId,
        filename: uniqueFilename,
        originalName: file.name,
        fileType: file.type,
        fileSize: file.size,
        filePath: `/uploads/${decoded.userId}/attachments/${uniqueFilename}`,
      },
    })

    return NextResponse.json({
      message: '文件上传成功',
      attachment: {
        id: attachment.id,
        originalName: attachment.originalName,
        fileType: attachment.fileType,
        fileSize: attachment.fileSize,
        createdAt: attachment.createdAt,
      },
      storageInfo: {
        used: totalStorage,
        limit: USER_STORAGE_LIMIT,
        remaining: USER_STORAGE_LIMIT - totalStorage,
      }
    })

  } catch (error) {
    console.error('文件上传失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// 格式化字节数
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
```

### 2. 云盘存储统计API

#### Claude Code 提示词 📝

```
请帮我创建用户存储统计API：
1. 获取用户当前存储使用情况
2. 按文件类型统计存储分布
3. 存储使用趋势分析
4. 存储空间提醒功能
5. 文件上传历史记录

请创建 /api/files/storage 路由。
```

#### 存储统计API (`src/app/api/files/storage/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// 用户存储空间限制 (100MB)
const USER_STORAGE_LIMIT = 100 * 1024 * 1024

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '无效的认证令牌' }, { status: 401 })
    }

    // 获取用户总存储使用量
    const totalStorage = await prisma.attachment.aggregate({
      where: {
        todo: {
          userId: decoded.userId
        }
      },
      _sum: {
        fileSize: true
      },
      _count: {
        id: true
      }
    })

    // 按文件类型统计
    const storageByType = await prisma.attachment.groupBy({
      by: ['fileType'],
      where: {
        todo: {
          userId: decoded.userId
        }
      },
      _sum: {
        fileSize: true
      },
      _count: {
        id: true
      }
    })

    // 按月份统计上传趋势
    const uploadTrend = await prisma.$queryRaw`
      SELECT
        strftime('%Y-%m', createdAt) as month,
        COUNT(*) as count,
        SUM(fileSize) as size
      FROM attachments
      WHERE todoId IN (
        SELECT id FROM todos WHERE userId = ${decoded.userId}
      )
      GROUP BY strftime('%Y-%m', createdAt)
      ORDER BY month DESC
      LIMIT 12
    ` as Array<{ month: string; count: number; size: number }>

    // 最近上传的文件
    const recentFiles = await prisma.attachment.findMany({
      where: {
        todo: {
          userId: decoded.userId
        }
      },
      include: {
        todo: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      select: {
        id: true,
        originalName: true,
        fileType: true,
        fileSize: true,
        createdAt: true,
        todo: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    const usedStorage = totalStorage._sum.fileSize || 0
    const fileCount = totalStorage._count.id || 0

    return NextResponse.json({
      storage: {
        used: usedStorage,
        limit: USER_STORAGE_LIMIT,
        remaining: Math.max(0, USER_STORAGE_LIMIT - usedStorage),
        usagePercentage: Math.round((usedStorage / USER_STORAGE_LIMIT) * 100),
        fileCount
      },
      storageByType: storageByType.map(item => ({
        type: item.fileType,
        size: item._sum.fileSize || 0,
        count: item._count.id || 0,
        typeName: getFileTypeName(item.fileType)
      })),
      uploadTrend: uploadTrend.map(item => ({
        month: item.month,
        count: item.count,
        size: item.size || 0
      })),
      recentFiles: recentFiles.map(file => ({
        id: file.id,
        name: file.originalName,
        type: file.fileType,
        size: file.fileSize,
        uploadedAt: file.createdAt,
        todo: {
          id: file.todo.id,
          title: file.todo.title
        }
      }))
    })

  } catch (error) {
    console.error('获取存储统计失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// 获取文件类型显示名称
function getFileTypeName(fileType: string): string {
  const typeMap: Record<string, string> = {
    'application/msword': 'Word文档',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word文档',
    'application/vnd.ms-excel': 'Excel表格',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel表格',
    'application/vnd.ms-powerpoint': 'PowerPoint演示文稿',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint演示文稿',
    'text/plain': '文本文件',
    'application/pdf': 'PDF文档'
  }
  return typeMap[fileType] || '其他文件'
}
```

### 3. 附件管理组件

#### Claude Code 提示词 📝

```
请帮我创建高级附件管理组件：
1. 拖拽上传功能
2. 批量文件上传
3. 上传进度显示
4. 文件类型图标
5. 文件预览功能
6. 存储空间显示
7. 文件搜索和筛选
8. 批量操作（删除、下载）

请创建 AttachmentManager 组件。
```

#### 附件管理组件 (`src/components/attachments.tsx`)

```typescript
'use client'

import { useState, useRef, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Paperclip,
  Upload,
  Download,
  Trash2,
  FileText,
  FileSpreadsheet,
  FileIcon,
  File as FilePdf,
  Search,
  Filter,
  Grid,
  List,
  HardDrive,
  AlertCircle
} from 'lucide-react'
import type { Attachment } from '@/types'

interface AttachmentManagerProps {
  todoId: string
  attachments: Attachment[]
  onAttachmentAdded: (attachment: Attachment) => void
  onAttachmentDeleted: (attachmentId: string) => void
  storageUsed?: number
  storageLimit?: number
}

export function AttachmentManager({
  todoId,
  attachments,
  onAttachmentAdded,
  onAttachmentDeleted,
  storageUsed = 0,
  storageLimit = 100 * 1024 * 1024 // 100MB
}: AttachmentManagerProps) {
  const { token } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // 过滤后的附件列表
  const filteredAttachments = attachments.filter(attachment =>
    attachment.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 根据文件类型获取图标
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="w-8 h-8 text-blue-600" />
    } else if (fileType.includes('sheet') || fileType.includes('excel')) {
      return <FileSpreadsheet className="w-8 h-8 text-green-600" />
    } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
      return <FileIcon className="w-8 h-8 text-orange-600" />
    } else if (fileType === 'application/pdf') {
      return <FilePdf className="w-8 h-8 text-red-600" />
    } else if (fileType === 'text/plain') {
      return <FileText className="w-8 h-8 text-gray-600" />
    }
    return <Paperclip className="w-8 h-8 text-gray-600" />
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // 处理拖拽事件
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await handleMultipleFileUpload(files)
    }
  }, [])

  // 处理多个文件上传
  const handleMultipleFileUpload = async (files: File[]) => {
    const validFiles = files.filter(file => {
      const allowedTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'application/pdf'
      ]

      return allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024
    })

    if (validFiles.length === 0) {
      alert('没有有效的文件。请上传 Word、Excel、PowerPoint、TXT 或 PDF 文件，且文件大小不超过 10MB。')
      return
    }

    // 检查存储空间
    const totalSize = validFiles.reduce((sum, file) => sum + file.size, 0)
    if (storageUsed + totalSize > storageLimit) {
      alert(`存储空间不足。需要 ${formatFileSize(totalSize)}，剩余 ${formatFileSize(storageLimit - storageUsed)}`)
      return
    }

    for (const file of validFiles) {
      await handleSingleFileUpload(file)
    }
  }

  // 处理单个文件上传
  const handleSingleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('todoId', todoId)

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 100)

      const response = await fetch('/api/attachments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        const result = await response.json()
        onAttachmentAdded(result.attachment)
      } else {
        const errorData = await response.json()
        alert(`上传失败: ${errorData.error}`)
      }
    } catch (error) {
      console.error('文件上传失败:', error)
      alert('上传失败，请重试')
    } finally {
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)
    }
  }

  // 处理文件上传
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      await handleMultipleFileUpload(files)
    }

    // 清空文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 处理文件下载
  const handleDownload = async (attachment: Attachment) => {
    try {
      const response = await fetch(`/api/attachments/${attachment.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = attachment.originalName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const errorData = await response.json()
        alert(`下载失败: ${errorData.error}`)
      }
    } catch (error) {
      console.error('文件下载失败:', error)
      alert('下载失败，请重试')
    }
  }

  // 处理文件删除
  const handleDelete = async (attachment: Attachment) => {
    if (!confirm(`确定要删除文件 "${attachment.originalName}" 吗？`)) {
      return
    }

    try {
      const response = await fetch(`/api/attachments/${attachment.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        onAttachmentDeleted(attachment.id)
      } else {
        const errorData = await response.json()
        alert(`删除失败: ${errorData.error}`)
      }
    } catch (error) {
      console.error('文件删除失败:', error)
      alert('删除失败，请重试')
    }
  }

  const storageUsagePercentage = Math.round((storageUsed / storageLimit) * 100)

  return (
    <div className="space-y-6">
      {/* 存储空间指示器 */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <HardDrive className="w-5 h-5 text-blue-600" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">存储空间</span>
              <span className="text-sm text-gray-600">
                {formatFileSize(storageUsed)} / {formatFileSize(storageLimit)}
              </span>
            </div>
            <Progress
              value={storageUsagePercentage}
              className="h-2"
              indicatorClassName={storageUsagePercentage > 80 ? 'bg-red-500' : storageUsagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'}
            />
          </div>
          {storageUsagePercentage > 80 && (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
      </Card>

      {/* 上传区域 */}
      <div
        ref={dropZoneRef}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf"
          multiple
          className="hidden"
          disabled={isUploading}
        />

        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-600" />
          </div>

          <div>
            <p className="text-lg font-medium">拖拽文件到这里上传</p>
            <p className="text-sm text-gray-500 mt-1">或者</p>
          </div>

          <Button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
            disabled={isUploading}
            className="flex items-center gap-2 mx-auto"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                上传中...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                选择文件
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500">
            支持 Word、Excel、PowerPoint、TXT、PDF 格式，单个文件最大 10MB
          </p>
        </div>

        {/* 上传进度条 */}
        {isUploading && (
          <div className="mt-4">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-gray-600 mt-1">上传进度: {uploadProgress}%</p>
          </div>
        )}
      </div>

      {/* 搜索和筛选 */}
      {attachments.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索文件..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Badge variant="secondary">
            {filteredAttachments.length} / {attachments.length} 个文件
          </Badge>
        </div>
      )}

      {/* 附件列表 */}
      {filteredAttachments.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
          {filteredAttachments.map((attachment) => (
            <Card key={attachment.id} className={viewMode === 'grid' ? 'p-4' : 'p-3'}>
              <CardContent className="p-0">
                {viewMode === 'grid' ? (
                  // 网格视图
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      {getFileIcon(attachment.fileType)}
                    </div>

                    <div className="text-center">
                      <p className="font-medium text-sm truncate" title={attachment.originalName}>
                        {attachment.originalName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatFileSize(attachment.fileSize)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(attachment.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex justify-center gap-2">
                      <Button
                        onClick={() => handleDownload(attachment)}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="下载"
                      >
                        <Download className="w-4 h-4" />
                      </Button>

                      <Button
                        onClick={() => handleDelete(attachment)}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // 列表视图
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getFileIcon(attachment.fileType)}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {attachment.originalName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(attachment.fileSize)} •
                          {new Date(attachment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        onClick={() => handleDownload(attachment)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        title="下载"
                      >
                        <Download className="w-4 h-4" />
                      </Button>

                      <Button
                        onClick={() => handleDelete(attachment)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : searchTerm ? (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="font-medium mb-2">没有找到匹配的文件</p>
          <p className="text-sm">尝试其他搜索关键词</p>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <Paperclip className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="font-medium mb-2">暂无附件</p>
          <p className="text-sm">拖拽文件或点击上方按钮为这个任务添加附件</p>
        </div>
      )}
    </div>
  )
}
```

---

## 🎯 核心功能实现

### 1. 四象限视图

#### Claude Code 提示词 📝

```
请帮我创建四象限时间管理视图页面：
- Q1: 紧急且重要（红色）
- Q2: 不紧急但重要（蓝色）
- Q3: 紧急但不重要（黄色）
- Q4: 不紧急且不重要（灰色）

需要包含：
1. 2x2网格布局
2. 任务拖拽功能
3. 任务卡片展示
4. 附件预览功能
5. 象限统计
6. 响应式设计
```

### 2. 月历视图

#### Claude Code 提示词 📝

```
请帮我创建月历视图页面：
1. 月历网格布局
2. 任务在对应日期显示
3. 不同优先级任务的颜色区分
4. 点击日期查看详情
5. 月份切换功能
6. 今天高亮显示

需要使用date-fns库处理日期。
```

### 3. 附件管理

#### Claude Code 提示词 📝

```
请帮我创建附件管理组件：
1. 文件上传功能
2. 文件类型验证
3. 文件大小限制
4. 上传进度显示
5. 文件列表展示
6. 文件下载和删除

支持的文件类型：Word, Excel, PPT, PDF, TXT
```

---

## 🎨 样式与UI设计

### 1. UI组件库

#### Claude Code 提示词 📝

```
请帮我创建基础UI组件库：
1. Button组件 - 不同样式和尺寸
2. Input组件 - 表单输入
3. Card组件 - 卡片容器
4. Modal组件 - 弹窗
5. Loading组件 - 加载状态
6. Toast组件 - 消息提示

使用Tailwind CSS和shadcn/ui设计规范。
```

### 2. 导航组件

#### Claude Code 提示词 📝

```
请帮我创建导航组件：
1. 顶部导航栏
2. 侧边栏导航
3. 用户菜单
4. 响应式折叠
5. 活跃状态显示
6. 移动端适配
```

---

## ⚙️ 部署配置

### 1. 生产环境配置

#### Claude Code 提示词 📝

```
请帮我配置生产环境：
1. 设置端口为3005
2. 配置环境变量
3. 优化构建配置
4. 设置启动脚本
5. 数据库生产配置
```

### 2. Next.js配置

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  port: 3005,
  images: {
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

export default nextConfig
```

### 3. 环境变量配置

```env
# .env.production
DATABASE_URL="file:./prod.db"
JWT_SECRET="your-production-jwt-secret"
NEXTAUTH_SECRET="your-production-nextauth-secret"
NEXTAUTH_URL="https://your-domain.com"
PORT=3005
NODE_ENV="production"
```

---

## 🤖 Claude Code 使用技巧

### 1. 项目初始化提示词模板

```text
请帮我创建一个{项目类型}项目，要求：
- 使用{技术栈}
- 包含{功能列表}
- 遵循{设计规范}

请生成完整的{文件类型}文件。
```

### 2. 功能开发提示词模板

```text
请帮我实现{功能名称}功能：
1. 需要{具体需求}
2. 包含{技术要求}
3. 使用{设计模式}
4. 考虑{边界情况}

请创建相关的API路由和前端组件。
```

### 3. 样式设计提示词模板

```text
请帮我设计{组件名称}组件：
1. 使用{设计风格}
2. 包含{交互效果}
3. 响应式设计
4. 无障碍访问
5. 主题适配

请使用Tailwind CSS实现。
```

### 4. 数据库设计提示词模板

```text
请帮我设计{业务场景}的数据库模型：
1. 包含{实体列表}
2. 定义{字段类型}
3. 设置{关联关系}
4. 添加{索引约束}
5. 考虑{数据完整性}

请生成Prisma schema文件。
```

### 5. 错误处理提示词模板

```text
请帮我优化{功能名称}的错误处理：
1. 添加{验证规则}
2. 处理{异常情况}
3. 提供{用户反馈}
4. 记录{错误日志}
5. 优化{用户体验}

请更新相关代码。
```

---

## 📝 开发最佳实践

### 1. 代码组织

```
src/
├── app/              # Next.js页面
├── components/       # React组件
│   ├── ui/          # 基础UI组件
│   └── features/    # 功能组件
├── lib/             # 工具函数
├── hooks/           # 自定义Hooks
├── types/           # TypeScript类型
└── styles/          # 样式文件
```

### 2. API设计规范

- 使用RESTful设计
- 统一的错误处理
- 完整的类型定义
- 适当的HTTP状态码
- 请求参数验证

### 3. 安全最佳实践

- JWT认证
- 密码加密
- 输入验证
- SQL注入防护
- XSS防护

### 4. 性能优化

- 数据库查询优化
- 图片懒加载
- 代码分割
- 缓存策略
- 响应式设计

---

## 🚀 部署指南

### 1. 本地部署

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 启动服务
npm start
```

### 2. Docker部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3005
CMD ["npm", "start"]
```

### 3. 云平台部署

- Vercel (推荐)
- Netlify
- AWS
- 阿里云
- 腾讯云

---

## 🎓 学习总结

通过这个项目，您将学会：

1. **Next.js 14** - 现代化全栈React框架
2. **TypeScript** - 类型安全的JavaScript
3. **Prisma** - 现代化数据库ORM
4. **JWT认证** - 无状态用户认证
5. **RESTful API** - 标准化API设计
6. **Tailwind CSS** - 实用优先的CSS框架
7. **响应式设计** - 移动端适配
8. **数据库设计** - 关系型数据库建模
9. **文件上传** - 多媒体文件处理
10. **Claude Code** - AI辅助开发

---

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

---

## 📞 技术支持

如有问题，请通过以下方式获取帮助：

1. 查看项目文档
2. 搜索相关Issues
3. 提交新的Issue
4. 参与社区讨论

---

**最后更新**: 2025年11月1日
**作者**: 凤歌
**版本**: v1.0.0

> 🎉 恭喜！您已经完成了使用Claude Code开发全栈待办事项管理系统的学习。现在您可以开始构建自己的项目了！
