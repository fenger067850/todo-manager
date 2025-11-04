# 🚀 一键部署到 Vercel - 让老板直接访问

## 方式一：点击按钮一键部署（最简单 ⭐推荐）

点击下面的按钮，一键部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fenger067850/todo-manager)

或访问这个链接：
```
https://vercel.com/new/clone?repository-url=https://github.com/fenger067850/todo-manager
```

---

## 方式二：通过 Vercel Dashboard 手动导入

### 步骤 1: 登录 Vercel

访问：https://vercel.com

- 使用 GitHub 账号登录（推荐）
- 或使用邮箱注册登录

### 步骤 2: 导入项目

1. 点击右上角 **"Add New..."** → **"Project"**
2. 在 "Import Git Repository" 中，选择 `fenger067850/todo-manager`
3. 点击 **"Import"**

### 步骤 3: 配置项目（重要！）

在配置页面，按以下设置：

#### Build & Development Settings

- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Install Command**: `npm install --legacy-peer-deps`
- **Output Directory**: `.next`（默认）

#### Environment Variables（环境变量）

⚠️ **必须添加以下环境变量：**

点击 **"Add"** 按钮，逐个添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `file:./prod.db` | 数据库路径 |
| `JWT_SECRET` | `i/l7WFJT3Ksp6AiVmicwNZBlwnNfk61fw6Fg0onv+k8=` | JWT密钥 |
| `NEXTAUTH_SECRET` | `409NFKta6U8eq3XRFcG3WCQqrQ+yugf7BP4uxJ80J5M=` | NextAuth密钥 |
| `NEXTAUTH_URL` | ⚠️ **先留空，部署后填入** | 应用URL |

### 步骤 4: 开始部署

点击 **"Deploy"** 按钮，等待 2-3 分钟。

### 步骤 5: 获取部署 URL

部署成功后，Vercel 会显示您的应用 URL，类似：
```
https://todo-manager-xxx.vercel.app
```

### 步骤 6: 更新环境变量（必须！）

1. 复制刚才获得的 URL
2. 进入项目的 **Settings** → **Environment Variables**
3. 找到 `NEXTAUTH_URL` 变量
4. 点击编辑，填入刚才的 URL：`https://todo-manager-xxx.vercel.app`
5. 保存后，进入 **Deployments** 页面
6. 点击最新部署右侧的 **"..."** → **"Redeploy"**

---

## ⚠️ 重要：数据库问题

SQLite 在 Vercel 上无法持久化数据！每次请求后数据会丢失。

### 解决方案：使用 Vercel Postgres（免费）

1. 在 Vercel 项目页面，点击 **"Storage"** 标签
2. 点击 **"Create Database"**
3. 选择 **"Postgres"**
4. 数据库名称：`todo-manager-db`
5. 点击 **"Create"**

Vercel 会自动添加以下环境变量：
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`

### 更新代码以使用 PostgreSQL

需要修改 `prisma/schema.prisma` 文件：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

然后推送代码到 GitHub，Vercel 会自动重新部署。

---

## 🎉 部署完成！

部署成功后，您会得到一个公开访问的 URL，例如：
```
https://todo-manager-abc123.vercel.app
```

**将这个链接发给老板，他就可以直接访问使用了！**

### 发送给老板的消息模板

```
老板您好！

凤歌-待办管理系统已经部署上线，您可以直接访问：

🔗 https://todo-manager-xxx.vercel.app

🎯 快速开始：
1. 点击"注册"创建账号
2. 登录后即可开始使用
3. 支持待办管理、文件上传、四象限视图等功能

💡 特点：
- 温馨粉色主题
- 完整的任务管理功能
- 云端访问，随时随地使用
- 数据安全加密存储

期待您的反馈！
```

---

## 📊 部署后的功能

✅ **可用功能：**
- 用户注册和登录
- 创建、编辑、删除待办事项
- 四象限视图
- 月历视图
- 分类管理
- 完整的响应式界面

⚠️ **需要配置数据库后才可用：**
- 数据持久化（否则刷新后数据丢失）
- 文件上传（需要配置对象存储）

---

## 🔧 故障排查

### 问题 1: 部署失败 - "npm install failed"

**解决方法：**

确保在 Vercel 的 Build Settings 中，Install Command 设置为：
```
npm install --legacy-peer-deps
```

### 问题 2: 访问页面显示 500 错误

**可能原因：**
- 环境变量未正确配置
- 数据库连接失败

**解决方法：**
1. 检查所有环境变量是否正确
2. 查看 Vercel 的 Deployments → Logs 查看错误详情
3. 确认已配置 PostgreSQL 数据库

### 问题 3: 注册后数据丢失

**原因：** SQLite 不支持 Vercel 的无服务器架构

**解决方法：** 按上文说明配置 Vercel Postgres

---

## 💡 优化建议

### 1. 自定义域名（可选）

在 Vercel 项目设置中可以绑定自定义域名：
```
todo.your-domain.com
```

### 2. 配置文件存储

使用 Vercel Blob 或其他对象存储服务：
```bash
npm install @vercel/blob
```

### 3. 启用分析

在 Vercel Dashboard 启用 Analytics 查看访问数据。

---

## 🔗 有用的链接

- **Vercel Dashboard**: https://vercel.com/dashboard
- **项目仓库**: https://github.com/fenger067850/todo-manager
- **Vercel 文档**: https://vercel.com/docs
- **Prisma PostgreSQL 指南**: https://www.prisma.io/docs/guides/deployment

---

## 📞 需要帮助？

如果部署遇到问题，可以：

1. 查看 Vercel 的部署日志
2. 访问项目 GitHub Issues
3. 查看 Vercel 官方文档

---

**祝部署顺利！** 🚀

部署完成后，老板就可以通过链接直接访问使用了！
